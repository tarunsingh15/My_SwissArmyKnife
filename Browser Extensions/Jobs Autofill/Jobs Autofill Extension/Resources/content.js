// extension/src/content/fill.ts
var HIGHLIGHT_CLASS = "job-autofill-needs-review";
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function ensureHighlightStyle() {
  if (document.getElementById("job-autofill-style")) return;
  const style = document.createElement("style");
  style.id = "job-autofill-style";
  style.textContent = `
    .${HIGHLIGHT_CLASS} {
      outline: 2px solid #f59e0b !important;
      background-color: rgba(245, 158, 11, 0.18) !important;
    }
  `;
  document.head.appendChild(style);
}
function highlightUnknown(selector) {
  if (!selector) return;
  const target = document.querySelector(selector);
  if (target) {
    target.classList.add(HIGHLIGHT_CLASS);
  }
}
async function fillQuestion(question, field) {
  const element = resolveElement(question.selector, question.type);
  if (!element) return false;
  const normalizedValue = normalizeByConfiguredFieldType(field.value, field.fieldType);
  if (question.type === "combobox_single") {
    return fillComboboxSingle(element, normalizedValue);
  }
  if (question.type === "combobox_multi") {
    return fillComboboxMulti(element, normalizedValue);
  }
  return setElementValue(element, question.type, normalizedValue);
}
function uploadResume(question, resume) {
  if (question.type !== "file") return false;
  const element = resolveElement(question.selector, "file");
  if (!(element instanceof HTMLInputElement) || element.type !== "file") {
    return false;
  }
  const file = base64ToFile(resume.dataBase64, resume.name, resume.mimeType);
  const transfer = new DataTransfer();
  transfer.items.add(file);
  element.files = transfer.files;
  dispatchElementEvents(element, ["input", "change"]);
  return true;
}
function resolveElement(selector, type) {
  if (!selector) return null;
  const element = document.querySelector(selector);
  if (!element) return null;
  if (type === "unknown") return null;
  return element;
}
function setElementValue(element, type, rawValue) {
  if (type === "text" || type === "textarea" || type === "date") {
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      element.focus();
      if (type === "date" && element instanceof HTMLInputElement && element.type === "date") {
        element.value = normalizeDateValue(rawValue);
      } else {
        element.value = rawValue;
      }
      dispatchElementEvents(element, ["input", "change", "blur"]);
      return true;
    }
    return false;
  }
  if (type === "select") {
    if (element instanceof HTMLSelectElement) {
      const tokens = rawValue.split(";").map((t) => t.trim()).filter(Boolean);
      if (element.multiple) {
        const optionElements = Array.from(element.options);
        let matchedAny = false;
        for (const option of optionElements) {
          const optionText = (option.textContent ?? option.value).toLowerCase().trim();
          const shouldSelect = tokens.some((token) => {
            const t = token.toLowerCase().trim();
            return optionText === t || optionText.includes(t) || t.includes(optionText);
          });
          option.selected = shouldSelect;
          if (shouldSelect) matchedAny = true;
        }
        if (!matchedAny) return false;
        dispatchElementEvents(element, ["input", "change", "blur"]);
        return true;
      }
      const normalized = rawValue.toLowerCase().trim();
      const options = Array.from(element.options);
      let best = null;
      let bestScore = -1;
      for (const option of options) {
        const optionText = (option.textContent ?? option.value).toLowerCase().trim();
        const normalizedCandidate = normalizeBooleanEquivalent(normalized, optionText);
        const score = scoreTextMatch(normalizedCandidate, optionText);
        if (score > bestScore) {
          bestScore = score;
          best = option;
        }
      }
      if (!best || bestScore < 40) return false;
      element.value = best.value;
      dispatchElementEvents(element, ["input", "change", "blur"]);
      return true;
    }
    return false;
  }
  if (type === "checkbox") {
    if (element instanceof HTMLInputElement && element.type === "checkbox") {
      const bool = toBooleanLike(rawValue);
      if (bool === null) return false;
      element.checked = bool;
      dispatchElementEvents(element, ["input", "change", "blur"]);
      return true;
    }
    return false;
  }
  if (type === "radio") {
    if (!(element instanceof HTMLInputElement) || element.type !== "radio") return false;
    const groupName = element.name;
    const candidates = Array.from(document.querySelectorAll(`input[type="radio"][name="${CSS.escape(groupName)}"]`));
    const normalized = normalizeBooleanText(rawValue.toLowerCase().trim());
    for (const candidate of candidates) {
      const label = candidate.closest("label")?.textContent?.toLowerCase().trim() ?? candidate.getAttribute("aria-label")?.toLowerCase().trim() ?? "";
      const candidateValue = candidate.value.toLowerCase().trim();
      const normalizedLabel = normalizeBooleanEquivalent(normalized, label);
      const normalizedCandidateValue = normalizeBooleanEquivalent(normalized, candidateValue);
      if (normalizedLabel === normalized || normalizedCandidateValue === normalized || label === normalized || candidateValue === normalized) {
        candidate.checked = true;
        dispatchElementEvents(candidate, ["input", "change", "blur"]);
        return true;
      }
    }
    return false;
  }
  return false;
}
function normalizeByConfiguredFieldType(rawValue, fieldType) {
  const value = rawValue.trim();
  if (!fieldType || fieldType === "text" || fieldType === "dropdown") return rawValue;
  if (fieldType === "email") return value.toLowerCase();
  if (fieldType === "phone") {
    const cleaned = value.replace(/(?!^\+)[^\d]/g, "");
    return cleaned || rawValue;
  }
  if (fieldType === "date") return normalizeDateValue(value);
  if (fieldType === "boolean") return normalizeBooleanText(value);
  if (fieldType === "number") return value.replace(/[^\d.-]/g, "");
  if (fieldType === "url") return value;
  return rawValue;
}
function normalizeBooleanText(value) {
  const v = value.trim().toLowerCase();
  const truthy = ["yes", "true", "1", "on", "checked"];
  const falsy = ["no", "false", "0", "off", "unchecked"];
  if (truthy.includes(v)) return "yes";
  if (falsy.includes(v)) return "no";
  return value;
}
function toBooleanLike(value) {
  const normalized = normalizeBooleanText(value).toLowerCase();
  if (normalized === "yes" || normalized === "true") return true;
  if (normalized === "no" || normalized === "false") return false;
  return null;
}
function normalizeBooleanEquivalent(target, candidate) {
  const t = target.toLowerCase().trim();
  const c = candidate.toLowerCase().trim();
  if ((c === "true" || c === "false") && (t === "yes" || t === "no")) {
    return t === "yes" ? "true" : "false";
  }
  if ((c === "yes" || c === "no") && (t === "true" || t === "false")) {
    return t === "true" ? "yes" : "no";
  }
  return t;
}
function normalizeDateValue(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  const ymdLoose = trimmed.match(/^(\d{4})[\/\-.](\d{1,2})[\/\-.](\d{1,2})$/);
  if (ymdLoose) {
    const yyyy = ymdLoose[1];
    const mm = ymdLoose[2].padStart(2, "0");
    const dd = ymdLoose[3].padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  const slashDate = trimmed.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/);
  if (slashDate) {
    const first = Number(slashDate[1]);
    const second = Number(slashDate[2]);
    const yyyy = slashDate[3];
    const mm = (first > 12 ? second : first).toString().padStart(2, "0");
    const dd = (first > 12 ? first : second).toString().padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }
  const yearMonthA = trimmed.match(/^(\d{4})[\/\-.](\d{1,2})$/);
  if (yearMonthA) {
    const yyyy = yearMonthA[1];
    const mm = yearMonthA[2].padStart(2, "0");
    return `${yyyy}-${mm}-01`;
  }
  const yearMonthB = trimmed.match(/^(\d{1,2})[\/\-.](\d{4})$/);
  if (yearMonthB) {
    const mm = yearMonthB[1].padStart(2, "0");
    const yyyy = yearMonthB[2];
    return `${yyyy}-${mm}-01`;
  }
  const months = /* @__PURE__ */ new Map([
    ["jan", "01"],
    ["feb", "02"],
    ["mar", "03"],
    ["apr", "04"],
    ["may", "05"],
    ["jun", "06"],
    ["jul", "07"],
    ["aug", "08"],
    ["sep", "09"],
    ["oct", "10"],
    ["nov", "11"],
    ["dec", "12"]
  ]);
  const monthYear = trimmed.match(/^([a-zA-Z]+)\s+(\d{4})$/);
  if (monthYear) {
    const monthToken = monthYear[1].slice(0, 3).toLowerCase();
    const mm = months.get(monthToken);
    if (mm) return `${monthYear[2]}-${mm}-01`;
  }
  const monthDayYear = trimmed.match(/^([a-zA-Z]+)\s+(\d{1,2}),?\s+(\d{4})$/);
  if (monthDayYear) {
    const monthToken = monthDayYear[1].slice(0, 3).toLowerCase();
    const mm = months.get(monthToken);
    if (mm) {
      const dd = monthDayYear[2].padStart(2, "0");
      return `${monthDayYear[3]}-${mm}-${dd}`;
    }
  }
  return trimmed;
}
function scoreTextMatch(target, candidate) {
  if (!target || !candidate) return 0;
  if (candidate === target) return 100;
  if (candidate.includes(target) || target.includes(candidate)) return 70;
  const tTokens = target.split(/\s+/g).filter(Boolean);
  const cTokens = candidate.split(/\s+/g).filter(Boolean);
  const overlap = tTokens.filter((t) => cTokens.includes(t)).length;
  if (overlap > 0) return 50 + overlap;
  return 10;
}
async function fillComboboxSingle(trigger, rawValue) {
  const normalized = rawValue.toLowerCase().trim();
  trigger.click();
  await sleep(150);
  const listbox = resolveListbox(trigger);
  if (!listbox) return false;
  const searchInput = listbox.querySelector("input[type='search']") || listbox.querySelector("input[role='searchbox']") || listbox.querySelector("input");
  if (searchInput) {
    searchInput.focus();
    searchInput.value = rawValue;
    searchInput.dispatchEvent(new Event("input", { bubbles: true }));
    searchInput.dispatchEvent(new Event("change", { bubbles: true }));
    await sleep(180);
  }
  let options = Array.from(listbox.querySelectorAll("[role='option']"));
  if (!options.length) {
    await sleep(200);
    options = Array.from(listbox.querySelectorAll("[role='option']"));
  }
  if (!options.length) return false;
  let bestOption = null;
  let bestScore = -1;
  for (const option of options) {
    const text = (option.textContent ?? "").trim().toLowerCase();
    const score = scoreTextMatch(normalized, text);
    if (score > bestScore) {
      bestScore = score;
      bestOption = option;
    }
  }
  if (!bestOption || bestScore < 40) return false;
  bestOption.click();
  await sleep(120);
  const innerInput = trigger.querySelector("input");
  if (innerInput) {
    innerInput.dispatchEvent(new Event("input", { bubbles: true }));
    innerInput.dispatchEvent(new Event("change", { bubbles: true }));
    innerInput.dispatchEvent(new Event("blur", { bubbles: true }));
  }
  const displayed = getComboboxDisplayedValue(trigger).toLowerCase();
  const verifyScore = scoreTextMatch(normalized, displayed);
  if (verifyScore >= 40) return true;
  const triggerText = (trigger.textContent ?? "").toLowerCase().trim();
  return scoreTextMatch(normalized, triggerText) >= 40;
}
async function fillComboboxMulti(trigger, rawValue) {
  const tokens = rawValue.split(";").map((t) => t.trim()).filter(Boolean);
  if (!tokens.length) return false;
  trigger.click();
  await sleep(200);
  const listbox = resolveListbox(trigger);
  if (!listbox) return false;
  const searchInput = listbox.querySelector("input[type='search']") || listbox.querySelector("input[role='searchbox']");
  let selectedCount = 0;
  for (const token of tokens) {
    const beforeTokenState = getComboboxDisplayedValue(trigger).toLowerCase();
    if (searchInput) {
      searchInput.focus();
      searchInput.value = token;
      searchInput.dispatchEvent(new Event("input", { bubbles: true }));
      searchInput.dispatchEvent(new Event("change", { bubbles: true }));
      await sleep(250);
    }
    let options = Array.from(listbox.querySelectorAll("[role='option']"));
    if (!options.length) {
      await sleep(150);
      options = Array.from(listbox.querySelectorAll("[role='option']"));
    }
    let bestOption = null;
    let bestScore = -1;
    for (const option of options) {
      const text = getOptionText(option);
      const score = scoreTextMatch(token.toLowerCase(), text);
      if (score > bestScore) {
        bestScore = score;
        bestOption = option;
      }
    }
    if (bestOption && bestScore >= 40) {
      bestOption.click();
      await sleep(100);
      if (isTokenApplied(trigger, token, beforeTokenState)) {
        selectedCount += 1;
        continue;
      }
    }
    if (searchInput) {
      dispatchKeyboard(searchInput, "Enter");
      await sleep(120);
      if (!isTokenApplied(trigger, token, beforeTokenState)) {
        dispatchKeyboard(searchInput, ",");
        await sleep(120);
      }
      if (!isTokenApplied(trigger, token, beforeTokenState)) {
        dispatchKeyboard(searchInput, "Tab");
        await sleep(120);
      }
      if (isTokenApplied(trigger, token, beforeTokenState)) {
        selectedCount += 1;
        searchInput.focus();
        searchInput.value = "";
        searchInput.dispatchEvent(new Event("input", { bubbles: true }));
        searchInput.dispatchEvent(new Event("change", { bubbles: true }));
      }
    }
  }
  const innerInput = trigger.querySelector("input");
  if (innerInput) {
    innerInput.dispatchEvent(new Event("input", { bubbles: true }));
    innerInput.dispatchEvent(new Event("change", { bubbles: true }));
    innerInput.dispatchEvent(new Event("blur", { bubbles: true }));
  }
  return selectedCount > 0;
}
function resolveListbox(trigger) {
  const controlsId = trigger.getAttribute("aria-controls");
  if (controlsId) {
    const byId = document.getElementById(controlsId);
    if (byId && isElementVisible(byId)) return byId;
  }
  const listboxes = Array.from(document.querySelectorAll("[role='listbox']")).filter(isElementVisible);
  if (!listboxes.length) return null;
  const triggerRect = trigger.getBoundingClientRect();
  let best = null;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const box of listboxes) {
    const rect = box.getBoundingClientRect();
    const dx = rect.left - triggerRect.left;
    const dy = rect.top - triggerRect.bottom;
    const distance = Math.hypot(dx, dy);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = box;
    }
  }
  return best;
}
function isElementVisible(element) {
  const style = window.getComputedStyle(element);
  if (style.visibility === "hidden" || style.display === "none") return false;
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}
function getComboboxDisplayedValue(trigger) {
  const input = trigger.querySelector("input[aria-autocomplete], input[type='text'], input[type='search']") || (trigger instanceof HTMLInputElement ? trigger : null);
  if (input?.value?.trim()) return input.value.trim();
  const selectedToken = trigger.querySelector("[aria-selected='true']") || trigger.querySelector("[data-automation-id*='selected' i]");
  if (selectedToken?.textContent?.trim()) return selectedToken.textContent.trim();
  return trigger.textContent?.trim() ?? "";
}
function getOptionText(option) {
  const prompt = option.querySelector("[data-automation-id='promptOption']");
  const text = (prompt?.textContent ?? option.textContent ?? "").trim().toLowerCase();
  return text;
}
function dispatchKeyboard(element, key) {
  element.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
  element.dispatchEvent(new KeyboardEvent("keypress", { key, bubbles: true }));
  element.dispatchEvent(new KeyboardEvent("keyup", { key, bubbles: true }));
}
function isTokenApplied(trigger, token, beforeState) {
  const after = getComboboxDisplayedValue(trigger).toLowerCase();
  const normalizedToken = token.toLowerCase().trim();
  if (!normalizedToken) return false;
  if (scoreTextMatch(normalizedToken, after) >= 40) return true;
  return after !== beforeState && after.length > 0;
}
function dispatchElementEvents(element, eventTypes) {
  for (const type of eventTypes) {
    element.dispatchEvent(new Event(type, { bubbles: true }));
  }
}
function base64ToFile(base64, name, mimeType) {
  const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
  return new File([bytes], name, { type: mimeType });
}

// extension/src/content/normalize.ts
var KEYWORD_TO_KEY = [
  { pattern: /\bfirst\s*name\b|\bgiven\s*name\b/i, key: "firstName" },
  { pattern: /\blast\s*name\b|\bsurname\b|\bfamily\s*name\b/i, key: "lastName" },
  { pattern: /\bemail\b/i, key: "email" },
  { pattern: /\bphone\b|\bmobile\b/i, key: "phone" },
  { pattern: /\blinkedin\b/i, key: "linkedinUrl" },
  { pattern: /\bgithub\b|\bcode\s*repository\b/i, key: "githubUrl" },
  { pattern: /\bportfolio\b|\bwebsite\b/i, key: "portfolioUrl" },
  { pattern: /\bcity\b/i, key: "locationCity" },
  { pattern: /\bstate\b|\bprovince\b/i, key: "locationState" },
  { pattern: /\bcountry\b/i, key: "locationCountry" },
  { pattern: /\bwork\s*authori[sz]ation\b|\blegally\s*authorized\b/i, key: "workAuthorization" },
  { pattern: /\bvisa\b/i, key: "visaStatus" },
  { pattern: /\bsalary\b|\bcompensation\b/i, key: "salaryExpectation" },
  { pattern: /\bnotice\s*period\b/i, key: "noticePeriod" },
  { pattern: /\brelocat/i, key: "relocationWilling" },
  { pattern: /\byears?\s*of\s*experience\b/i, key: "yearsOfExperience" },
  { pattern: /\bcurrent\s*title\b/i, key: "currentTitle" },
  { pattern: /\bcurrent\s*company\b/i, key: "currentCompany" }
];
function normalizeText(text) {
  const cleaned = text.replace(/[^\p{L}\p{N}\s]+/gu, " ").replace(/\s+/g, " ").trim().toLowerCase();
  return cleaned;
}
function buildSelector(input) {
  const id = input.getAttribute("id");
  if (id) {
    return `#${CSS.escape(id)}`;
  }
  const name = input.getAttribute("name");
  if (name) {
    return `${input.tagName.toLowerCase()}[name="${CSS.escape(name)}"]`;
  }
  const dataAutomationId = input.getAttribute("data-automation-id") ?? input.getAttribute("data-qa-id") ?? "";
  if (dataAutomationId.trim()) {
    return `[data-automation-id="${CSS.escape(dataAutomationId.trim())}"]`;
  }
  const dataTestId = input.getAttribute("data-testid") ?? "";
  if (dataTestId.trim()) {
    return `[data-testid="${CSS.escape(dataTestId.trim())}"]`;
  }
  const ariaLabel = input.getAttribute("aria-label") ?? "";
  if (ariaLabel.trim()) {
    return `${input.tagName.toLowerCase()}[aria-label="${CSS.escape(ariaLabel.trim())}"]`;
  }
  const ariaLabelledBy = input.getAttribute("aria-labelledby") ?? "";
  if (ariaLabelledBy.trim()) {
    return `${input.tagName.toLowerCase()}[aria-labelledby="${CSS.escape(ariaLabelledBy.trim())}"]`;
  }
  return null;
}
function buildNthFallbackSelector(input) {
  const parts = [];
  let current = input;
  for (let depth = 0; depth < 6 && current && current !== document.body; depth++) {
    const tag = current.tagName.toLowerCase();
    const parent = current.parentElement;
    if (parent) {
      const sameTagSiblings = Array.from(parent.children).filter((c) => c.tagName === current?.tagName);
      const index = sameTagSiblings.indexOf(current) + 1;
      parts.push(`${tag}:nth-of-type(${index})`);
    } else {
      parts.push(tag);
    }
    if (current.id) {
      return `#${CSS.escape(current.id)} > ${parts.reverse().join(" > ")}`;
    }
    current = parent;
  }
  if (!parts.length) return null;
  return parts.reverse().join(" > ");
}
function detectLabelForElement(input) {
  const ariaLabel = input.getAttribute("aria-label");
  if (ariaLabel?.trim()) {
    return ariaLabel.trim();
  }
  const labelledBy = input.getAttribute("aria-labelledby");
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy);
    if (labelElement?.textContent?.trim()) {
      return labelElement.textContent.trim();
    }
  }
  const id = input.getAttribute("id");
  if (id) {
    const label = document.querySelector(`label[for="${CSS.escape(id)}"]`);
    if (label?.textContent?.trim()) {
      return label.textContent.trim();
    }
  }
  const wrappingLabel = input.closest("label");
  if (wrappingLabel?.textContent?.trim()) {
    return wrappingLabel.textContent.trim();
  }
  const placeholder = input.getAttribute("placeholder");
  if (placeholder?.trim()) {
    return placeholder.trim();
  }
  return "Unknown question";
}
function detectQuestionType(input) {
  const role = input.getAttribute("role") ?? "";
  const ariaHasPopup = input.getAttribute("aria-haspopup") ?? "";
  const ariaMulti = input.getAttribute("aria-multiselectable") ?? "";
  if (role === "combobox" || ariaHasPopup === "listbox") {
    return ariaMulti === "true" ? "combobox_multi" : "combobox_single";
  }
  if (input instanceof HTMLTextAreaElement) return "textarea";
  if (input instanceof HTMLSelectElement) return "select";
  if (input instanceof HTMLInputElement) {
    if (input.type === "radio") return "radio";
    if (input.type === "checkbox") return "checkbox";
    if (input.type === "date") return "date";
    if (input.type === "file") return "file";
    return "text";
  }
  return "unknown";
}
function scanQuestionsFromDom() {
  const nativeControls = Array.from(document.querySelectorAll("input, textarea, select"));
  const comboboxControls = Array.from(document.querySelectorAll("[role='combobox'], [aria-haspopup='listbox']"));
  const all = [...nativeControls, ...comboboxControls];
  const unique = Array.from(new Set(all));
  return unique.filter((el) => {
    const disabled = el.hasAttribute("disabled") || el.getAttribute("aria-disabled") === "true";
    if (disabled) return false;
    const tag = el.tagName.toLowerCase();
    const typeAttr = el.getAttribute("type") ?? "";
    if (tag === "input" && typeAttr === "hidden") return false;
    return true;
  }).map((input, index) => {
    const type = detectQuestionType(input);
    const label = detectLabelForElement(input);
    const required = input.hasAttribute("required") || input.getAttribute("aria-required") === "true" || !!input.closest("[aria-required='true']");
    const options = input instanceof HTMLSelectElement ? Array.from(input.options).map((option) => option.textContent?.trim() ?? "").filter(Boolean) : [];
    return {
      id: input.id || `q-${index}`,
      label,
      type,
      required,
      options,
      selector: buildSelector(input) ?? buildNthFallbackSelector(input),
      canonicalKeyCandidate: inferCanonicalKey(label)
    };
  });
}
function inferCanonicalKey(label) {
  for (const entry of KEYWORD_TO_KEY) {
    if (entry.pattern.test(label)) {
      return entry.key;
    }
  }
  return null;
}
function parseLabelMatchers(spec) {
  return spec.split(";").map((token) => token.trim()).filter(Boolean).map((token) => {
    if (token.startsWith("=")) return token.slice(1).trim();
    if (token.toLowerCase().startsWith("re:")) return "";
    return token;
  }).map((token) => normalizeText(token));
}
function scoreFieldLabelMatchers(spec, questionNormalizedLabel) {
  const tokens = parseLabelMatchers(spec);
  if (!tokens.length) return null;
  let best = null;
  for (const token of tokens) {
    if (!token) continue;
    const exact = token === questionNormalizedLabel;
    if (exact) {
      const candidate = { score: 100, tokenLen: token.length };
      best = best && candidate.tokenLen <= best.tokenLen ? best : candidate;
      continue;
    }
    const containsQuestion = questionNormalizedLabel.includes(token);
    const containsToken = token.includes(questionNormalizedLabel);
    if (containsQuestion || containsToken) {
      const candidate = { score: 70, tokenLen: token.length };
      best = best && candidate.tokenLen <= best.tokenLen ? best : candidate;
    }
  }
  return best;
}

// extension/src/content/providers/base.ts
function genericScan() {
  return scanQuestionsFromDom();
}
function genericNextAction(documentRef) {
  const button = Array.from(documentRef.querySelectorAll("button, input[type='button'], input[type='submit']")).find((node) => {
    const text = (node.textContent ?? node.value ?? "").toLowerCase();
    return /next|continue|save and continue/.test(text);
  });
  if (!button) return null;
  return {
    selector: resolveButtonSelector(button),
    label: button.textContent?.trim() || "Next"
  };
}
function genericIsSubmitAction(element) {
  const text = (element.textContent ?? element.value ?? "").toLowerCase();
  return /submit|apply|send application|review and submit/.test(text);
}
function resolveButtonSelector(button) {
  const id = button.id;
  if (id) return `#${CSS.escape(id)}`;
  const testId = button.getAttribute("data-automation-id");
  if (testId) return `[data-automation-id="${CSS.escape(testId)}"]`;
  const classes = Array.from(button.classList).slice(0, 2).map((name) => `.${CSS.escape(name)}`).join("");
  if (classes) return `${button.tagName.toLowerCase()}${classes}`;
  return null;
}

// extension/src/content/providers/generic.ts
var genericAdapter = {
  provider: "generic",
  detect() {
    return 0.1;
  },
  scan() {
    return genericScan();
  },
  findNextAction(documentRef) {
    return genericNextAction(documentRef);
  },
  isSubmitAction(element) {
    return genericIsSubmitAction(element);
  },
  resolveStepName() {
    return "Application step";
  }
};

// extension/src/content/providers/greenhouse.ts
var greenhouseAdapter = {
  provider: "greenhouse",
  detect(documentRef) {
    const domainMatch = /greenhouse\.io/.test(window.location.hostname) ? 0.65 : 0;
    const domMatch = documentRef.querySelector("form#application_form") || documentRef.querySelector(".application-header") || documentRef.querySelector("[id^='question_']");
    return domMatch ? domainMatch + 0.35 : domainMatch;
  },
  scan() {
    return genericScan();
  },
  findNextAction(documentRef) {
    const explicit = Array.from(documentRef.querySelectorAll("button,input[type='submit']")).find((element) => {
      const text = (element.textContent ?? element.value ?? "").toLowerCase();
      return /next|continue|save/.test(text);
    });
    if (explicit) {
      return {
        selector: resolveButtonSelector(explicit),
        label: explicit.textContent?.trim() || "Next"
      };
    }
    return genericNextAction(documentRef);
  },
  isSubmitAction(element) {
    return genericIsSubmitAction(element);
  },
  resolveStepName(documentRef) {
    return documentRef.querySelector(".application-header h1, h1")?.textContent?.trim() || "Greenhouse step";
  }
};

// extension/src/content/providers/icims.ts
var icimsAdapter = {
  provider: "icims",
  detect(documentRef) {
    const domainMatch = /icims\.com/.test(window.location.hostname) ? 0.65 : 0;
    const domMatch = documentRef.querySelector("[class*='iCIMS_']") || documentRef.querySelector("[id*='icims']") || documentRef.querySelector("form[action*='icims']");
    return domMatch ? domainMatch + 0.35 : domainMatch;
  },
  scan() {
    return genericScan();
  },
  findNextAction(documentRef) {
    return genericNextAction(documentRef);
  },
  isSubmitAction(element) {
    return genericIsSubmitAction(element);
  },
  resolveStepName(documentRef) {
    return documentRef.querySelector("h1,h2,.step-title")?.textContent?.trim() || "iCIMS step";
  }
};

// extension/src/content/providers/smartrecruiters.ts
var smartrecruitersAdapter = {
  provider: "smartrecruiters",
  detect(documentRef) {
    const hostname = window.location.hostname;
    const domainMatch = /smartrecruiters\.com/.test(hostname) ? 0.65 : 0;
    const domMatch = documentRef.querySelector("[data-testid*='application' i]") || documentRef.querySelector("form[action*='smartrecruiters']") || documentRef.querySelector("[class*='SmartRecruiters'], [id*='smartrecruiters']");
    return domMatch ? domainMatch + 0.35 : domainMatch;
  },
  scan() {
    return genericScan();
  },
  findNextAction(documentRef) {
    const explicit = Array.from(documentRef.querySelectorAll("button,input[type='button'],input[type='submit']")).find(
      (element) => {
        const text = (element.textContent ?? element.value ?? "").toLowerCase();
        return /next|continue|save and continue|review/i.test(text);
      }
    );
    if (explicit) {
      return {
        selector: resolveButtonSelector(explicit),
        label: explicit.textContent?.trim() || "Next"
      };
    }
    return genericNextAction(documentRef);
  },
  isSubmitAction(element) {
    return genericIsSubmitAction(element);
  },
  resolveStepName(documentRef) {
    return documentRef.querySelector("h1,h2,[data-testid*='step' i]")?.textContent?.trim() || "SmartRecruiters step";
  }
};

// extension/src/content/providers/taleo.ts
var taleoAdapter = {
  provider: "taleo",
  detect(documentRef) {
    const domainMatch = /taleo\.net/.test(window.location.hostname) ? 0.65 : 0;
    const domMatch = documentRef.querySelector("form[name='jobapp']") || documentRef.querySelector("[id*='Taleo']") || documentRef.querySelector("[class*='oracletaleo']");
    return domMatch ? domainMatch + 0.35 : domainMatch;
  },
  scan() {
    return genericScan();
  },
  findNextAction(documentRef) {
    return genericNextAction(documentRef);
  },
  isSubmitAction(element) {
    return genericIsSubmitAction(element);
  },
  resolveStepName(documentRef) {
    return documentRef.querySelector("h1,h2,.pageTitle")?.textContent?.trim() || "Taleo step";
  }
};

// extension/src/content/providers/workday.ts
var workdayAdapter = {
  provider: "workday",
  detect(documentRef) {
    const domainMatch = /myworkdayjobs\.com/.test(window.location.hostname) ? 0.65 : 0;
    const domMatch = documentRef.querySelector("[data-automation-id='jobApplicationForm']") || documentRef.querySelector("[data-automation-id='next']") || documentRef.querySelector(".css-1m4dr9z");
    return domMatch ? domainMatch + 0.35 : domainMatch;
  },
  scan() {
    return genericScan();
  },
  findNextAction(documentRef) {
    const explicit = documentRef.querySelector("[data-automation-id='bottom-navigation-next-button']") || documentRef.querySelector("[data-automation-id='next']");
    if (explicit) {
      return {
        selector: `[data-automation-id="${explicit.getAttribute("data-automation-id")}"]`,
        label: explicit.textContent?.trim() ?? "Next"
      };
    }
    return genericNextAction(documentRef);
  },
  isSubmitAction(element) {
    return genericIsSubmitAction(element);
  },
  resolveStepName(documentRef) {
    return documentRef.querySelector("[data-automation-id='stepHeader']")?.textContent?.trim() || documentRef.querySelector("h2")?.textContent?.trim() || "Workday step";
  }
};

// extension/src/content/providers/index.ts
var ADAPTERS = [workdayAdapter, greenhouseAdapter, icimsAdapter, taleoAdapter, smartrecruitersAdapter, genericAdapter];
function getBestProviderAdapter(documentRef) {
  let winner = genericAdapter;
  let bestScore = -1;
  for (const adapter of ADAPTERS) {
    const score = adapter.detect(documentRef);
    if (score > bestScore) {
      bestScore = score;
      winner = adapter;
    }
  }
  return winner;
}

// extension/src/content/index.ts
function sleep2(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function expandWorkdayRepeatSections(profile) {
  if (!profile) return;
  const workConfiguredEntries = profile.workGroups.filter((g) => g.fields.some((f) => f.value.trim())).length;
  const educationConfiguredEntries = profile.educationGroups.filter((g) => g.fields.some((f) => f.value.trim())).length;
  const needsWorkExtra = workConfiguredEntries > 1;
  const needsEducationExtra = educationConfiguredEntries > 1;
  if (!needsWorkExtra && !needsEducationExtra) return;
  function sectionHintForElement(el) {
    const own = `${el.textContent ?? ""} ${el.getAttribute("aria-label") ?? ""}`.toLowerCase();
    const container = (el.closest("fieldset,section,[role='group'],[data-automation-id],[class*='section'],[class*='group']")?.textContent ?? "").slice(0, 400).toLowerCase();
    return `${own} ${container}`;
  }
  async function clickSectionAdd(section, maxClicks) {
    for (let i = 0; i < maxClicks; i++) {
      const inputsBefore = document.querySelectorAll("input,select,textarea").length;
      const candidates = Array.from(document.querySelectorAll("button,[role='button'],input[type='button']"));
      const addButton = candidates.find((el) => {
        const disabled = el.disabled === true || el.getAttribute("aria-disabled") === "true";
        if (disabled) return false;
        const hint = sectionHintForElement(el);
        const addMatch = /\badd\b|\badd another\b|\badd more\b|\badd additional\b/i.test(hint);
        if (!addMatch) return false;
        if (section === "work") return /\bwork|employment|experience|employer|company\b/i.test(hint);
        return /\beducation|school|university|degree|major\b/i.test(hint);
      });
      if (!addButton) break;
      addButton.click();
      await sleep2(300 + Math.floor(Math.random() * 100));
      const inputsAfter = document.querySelectorAll("input,select,textarea").length;
      if (inputsAfter <= inputsBefore) break;
    }
  }
  if (needsWorkExtra) await clickSectionAdd("work", Math.max(0, workConfiguredEntries - 1));
  if (needsEducationExtra) await clickSectionAdd("education", Math.max(0, educationConfiguredEntries - 1));
}
function emitToBackground(event) {
  chrome.runtime.sendMessage(event);
}
function elementHasMeaningfulValue(selector, type) {
  if (!selector) return false;
  const element = document.querySelector(selector);
  if (!element) return false;
  if (element instanceof HTMLInputElement) {
    if (element.type === "checkbox" || element.type === "radio") return element.checked;
    if (element.type === "file") return (element.files?.length ?? 0) > 0 || element.value.trim().length > 0;
    return element.value.trim().length > 0;
  }
  if (element instanceof HTMLTextAreaElement) return element.value.trim().length > 0;
  if (element instanceof HTMLSelectElement) {
    if (element.multiple) return Array.from(element.selectedOptions).length > 0;
    return element.value.trim().length > 0;
  }
  const innerInput = element.querySelector("input");
  if (innerInput) return innerInput.value.trim().length > 0;
  return element.textContent?.trim().length ? true : false;
}
function focusQuestionBySelector(selector) {
  if (!selector) return;
  const element = document.querySelector(selector);
  if (!element) return;
  try {
    element.scrollIntoView({ behavior: "smooth", block: "center" });
  } catch {
    element.scrollIntoView();
  }
  const inner = element.querySelector("input,textarea,select");
  if (inner && typeof inner.focus === "function") {
    inner.focus();
  } else if (typeof element.focus === "function") {
    element.focus();
  }
}
function isResumeUploadQuestion(label, selector, canonicalKey) {
  if (canonicalKey === "resume") return true;
  const normalizedLabel = normalizeText(label);
  const resumeHint = /\b(resume|cv|curriculum vitae)\b/i.test(normalizedLabel);
  const coverLetterHint = /\b(cover letter|motivation letter|supporting statement)\b/i.test(normalizedLabel);
  if (coverLetterHint) return false;
  if (resumeHint) return true;
  if (!selector) return false;
  const element = document.querySelector(selector);
  if (!element) return false;
  const attrs = [
    element.getAttribute("aria-label") ?? "",
    element.getAttribute("name") ?? "",
    element.getAttribute("id") ?? "",
    element.getAttribute("data-automation-id") ?? "",
    element.closest("label")?.textContent ?? ""
  ].join(" ").toLowerCase();
  if (/\bcover[\s_-]*letter\b/.test(attrs)) return false;
  return /\b(resume|cv)\b/.test(attrs);
}
async function runFillCycle(profile, resume, autoAdvance, resumeAlreadyUploaded, educationSet2Decision) {
  const adapter = getBestProviderAdapter(document);
  ensureHighlightStyle();
  if (!profile) {
    emitToBackground({
      type: "content:error",
      payload: { message: "No profile selected. Choose a profile in the popup first." }
    });
    return;
  }
  await expandWorkdayRepeatSections(profile);
  const questions = adapter.scan(document);
  const identified = [];
  const filled = [];
  const skipped = [];
  let resumeUploadedNow = false;
  let resumeAlreadyHandledInSession = resumeAlreadyUploaded;
  const groupCounters = {};
  const fillAdditionalEducationGroups = educationSet2Decision === "fill";
  const unknownAdditionalEducationGroups = educationSet2Decision === "unknown";
  function inferPreferredGroupType(label, selector) {
    const t = normalizeText(label);
    if (/\bemail\b/i.test(t)) return "unknown";
    if (selector) {
      const element = document.querySelector(selector);
      const containerText = normalizeText(
        element?.closest("fieldset,section,[role='group'],[data-automation-id],[class*='section'],[class*='group']")?.textContent?.slice(0, 300) ?? ""
      );
      if (/\beducation|school|university|degree|major\b/i.test(containerText)) return "education";
      if (/\bwork history|employment|experience|employer|company\b/i.test(containerText)) return "work";
      if (/\baddress|street|postal|zip|city|state|province|country\b/i.test(containerText)) return "address";
    }
    if (/\b(street|address|zip|postal|postcode|apartment|suite)\b/i.test(t)) return "address";
    if (/\b(school|university|college|degree|major|field of study|graduation)\b/i.test(t)) return "education";
    if (/\b(company|employer|job title|position|role)\b/i.test(t)) return "work";
    return "unknown";
  }
  function resolveBestMatchFromList(normalizedLabel, fields) {
    let best = null;
    for (const f of fields) {
      const scoreInfo = scoreFieldLabelMatchers(f.label, normalizedLabel);
      if (!scoreInfo) continue;
      const candidate = { key: f.key, score: scoreInfo.score, tokenLen: scoreInfo.tokenLen };
      if (!best || candidate.score > best.score || candidate.score === best.score && candidate.tokenLen > best.tokenLen) {
        best = candidate;
      }
    }
    return best;
  }
  function resolveCommonKey(questionLabel) {
    const normalizedLabel = normalizeText(questionLabel);
    const best = resolveBestMatchFromList(normalizedLabel, [...profile.commonFields, ...profile.commonQuestions]);
    return best ? best.key : null;
  }
  function resolveGroupedField(groupType, questionLabel) {
    const groups = groupType === "address" ? profile.addressGroups : groupType === "work" ? profile.workGroups : profile.educationGroups;
    if (!groups.length) return null;
    const normalizedLabel = normalizeText(questionLabel);
    const templateFields = groups[0]?.fields ?? [];
    const bestTemplate = resolveBestMatchFromList(normalizedLabel, templateFields);
    if (!bestTemplate) return null;
    const counterKey = `${groupType}:${bestTemplate.key}`;
    const seen = groupCounters[counterKey] ?? 0;
    const groupIndex = Math.min(seen, groups.length - 1);
    groupCounters[counterKey] = seen + 1;
    const group = groups[groupIndex];
    const field = group?.fields.find((f) => f.key === bestTemplate.key) ?? null;
    if (!field) return null;
    const canonicalKey = `${groupType}.${field.key}#${groupIndex + 1}`;
    return { canonicalKey, valueField: field };
  }
  function buildCommonValueField(key) {
    return profile.commonFields.find((f) => f.key === key) ?? profile.commonQuestions.find((f) => f.key === key) ?? null;
  }
  for (const question of questions) {
    const preferred = inferPreferredGroupType(question.label, question.selector);
    const alreadyFilled = elementHasMeaningfulValue(question.selector, question.type);
    let canonicalKey = null;
    let field = null;
    if (preferred === "address" || preferred === "work" || preferred === "education") {
      const grouped = resolveGroupedField(preferred, question.label);
      if (grouped) {
        canonicalKey = grouped.canonicalKey;
        field = grouped.valueField;
      }
    }
    if (!field) {
      const commonKey = resolveCommonKey(question.label);
      if (commonKey) {
        canonicalKey = commonKey;
        field = buildCommonValueField(commonKey);
      }
    }
    if (!field) {
      for (const gt of ["education", "work", "address"]) {
        const grouped = resolveGroupedField(gt, question.label);
        if (grouped) {
          canonicalKey = grouped.canonicalKey;
          field = grouped.valueField;
          break;
        }
      }
    }
    if (!fillAdditionalEducationGroups && canonicalKey?.startsWith("education.") && canonicalKey.includes("#2")) {
      continue;
    }
    if (question.type === "unknown") {
      if (alreadyFilled) {
        const alreadyFilledOutcome = {
          questionId: question.id,
          label: question.label,
          type: question.type,
          required: question.required,
          canonicalKey,
          status: "filled",
          selector: question.selector ?? null
        };
        identified.push(alreadyFilledOutcome);
        filled.push(alreadyFilledOutcome);
        continue;
      }
      const unknown = {
        questionId: question.id,
        label: question.label,
        type: question.type,
        required: question.required,
        canonicalKey,
        status: "skipped",
        reason: "UnsupportedType",
        selector: question.selector ?? null
      };
      identified.push(unknown);
      skipped.push(unknown);
      highlightUnknown(question.selector);
      continue;
    }
    if (question.type === "file") {
      const isResumeField = isResumeUploadQuestion(question.label, question.selector, canonicalKey);
      if (!isResumeField) {
        if (alreadyFilled) {
          const alreadyFilledOutcome = {
            questionId: question.id,
            label: question.label,
            type: question.type,
            required: question.required,
            canonicalKey,
            status: "filled",
            selector: question.selector ?? null
          };
          identified.push(alreadyFilledOutcome);
          filled.push(alreadyFilledOutcome);
          continue;
        }
        const skipNonResumeFile = {
          questionId: question.id,
          label: question.label,
          type: question.type,
          required: question.required,
          canonicalKey,
          status: "skipped",
          reason: "NotPredefined",
          selector: question.selector ?? null
        };
        identified.push(skipNonResumeFile);
        skipped.push(skipNonResumeFile);
        highlightUnknown(question.selector);
        continue;
      }
      if (resumeAlreadyHandledInSession) {
        const alreadyUploadedOutcome = {
          questionId: question.id,
          label: question.label,
          type: question.type,
          required: question.required,
          canonicalKey: "resume",
          status: "skipped",
          reason: "ResumeAlreadyUploaded",
          selector: question.selector ?? null
        };
        identified.push(alreadyUploadedOutcome);
        skipped.push(alreadyUploadedOutcome);
        continue;
      }
      if (!resume) {
        if (alreadyFilled) {
          const filledOutcome = {
            questionId: question.id,
            label: question.label,
            type: question.type,
            required: question.required,
            canonicalKey,
            status: "filled",
            selector: question.selector ?? null
          };
          identified.push(filledOutcome);
          filled.push(filledOutcome);
          continue;
        }
        const noResume = {
          questionId: question.id,
          label: question.label,
          type: question.type,
          required: question.required,
          canonicalKey: null,
          status: "skipped",
          reason: "NoValue",
          selector: question.selector ?? null
        };
        identified.push(noResume);
        skipped.push(noResume);
        highlightUnknown(question.selector);
        continue;
      }
      const uploadOk = uploadResume(question, resume);
      const outcome2 = {
        questionId: question.id,
        label: question.label,
        type: question.type,
        required: question.required,
        canonicalKey: "resume",
        status: uploadOk ? "filled" : "skipped",
        reason: uploadOk ? void 0 : "NoDomTarget",
        selector: question.selector ?? null
      };
      identified.push(outcome2);
      if (uploadOk) {
        filled.push(outcome2);
        resumeUploadedNow = true;
        resumeAlreadyHandledInSession = true;
      } else {
        skipped.push(outcome2);
        highlightUnknown(question.selector);
      }
      await sleep2(40 + Math.floor(Math.random() * 100));
      continue;
    }
    if (!field) {
      if (alreadyFilled) {
        const filledOutcome = {
          questionId: question.id,
          label: question.label,
          type: question.type,
          required: question.required,
          canonicalKey: null,
          status: "filled",
          selector: question.selector ?? null
        };
        identified.push(filledOutcome);
        filled.push(filledOutcome);
        continue;
      }
      const noKey = {
        questionId: question.id,
        label: question.label,
        type: question.type,
        required: question.required,
        canonicalKey: null,
        status: "skipped",
        reason: "NotPredefined",
        selector: question.selector ?? null
      };
      identified.push(noKey);
      skipped.push(noKey);
      highlightUnknown(question.selector);
      continue;
    }
    if (!field.value.trim()) {
      if (canonicalKey?.startsWith("address.")) {
        const addressFieldKey = canonicalKey.split(".")[1]?.split("#")[0] ?? "";
        const fallbackCommonKey = addressFieldKey === "addressState" ? "locationState" : addressFieldKey === "addressCity" ? "locationCity" : addressFieldKey === "addressCountry" ? "locationCountry" : null;
        if (fallbackCommonKey) {
          const fallback = buildCommonValueField(fallbackCommonKey);
          if (fallback?.value.trim()) {
            field = fallback;
            canonicalKey = `${canonicalKey} (fallback:${fallbackCommonKey})`;
          }
        }
      }
      if (!field.value.trim()) {
        if (alreadyFilled) {
          const filledOutcome = {
            questionId: question.id,
            label: question.label,
            type: question.type,
            required: question.required,
            canonicalKey,
            status: "filled",
            selector: question.selector ?? null
          };
          identified.push(filledOutcome);
          filled.push(filledOutcome);
          continue;
        }
        const noValue = {
          questionId: question.id,
          label: question.label,
          type: question.type,
          required: question.required,
          canonicalKey,
          status: "skipped",
          reason: "NoValue",
          selector: question.selector ?? null
        };
        identified.push(noValue);
        skipped.push(noValue);
        highlightUnknown(question.selector);
        continue;
      }
    }
    const fillOk = await fillQuestion(question, field);
    const outcome = {
      questionId: question.id,
      label: question.label,
      type: question.type,
      required: question.required,
      canonicalKey,
      status: fillOk ? "filled" : "skipped",
      reason: fillOk ? void 0 : "NoDomTarget",
      selector: question.selector ?? null
    };
    identified.push(outcome);
    if (fillOk) {
      filled.push(outcome);
    } else {
      skipped.push(outcome);
      highlightUnknown(question.selector);
    }
    await sleep2(50 + Math.floor(Math.random() * 120));
  }
  const mandatorySkipped = skipped.filter((item) => item.required);
  const reviewRequired = mandatorySkipped.some(
    (item) => item.reason === "NotPredefined" || item.reason === "UnsupportedType" || item.reason === "NoValue" || item.reason === "NoDomTarget"
  );
  let shouldAdvance = false;
  if (autoAdvance && !reviewRequired) {
    const nextAction = adapter.findNextAction(document);
    if (nextAction?.selector) {
      const button = document.querySelector(nextAction.selector);
      if (button && !adapter.isSubmitAction(button)) {
        shouldAdvance = true;
        button.click();
      }
    }
  }
  const secondEducationSetPending = unknownAdditionalEducationGroups && profile.educationGroups.length >= 2 && profile.educationGroups[1].fields.some((f) => f.value.trim().length > 0);
  if (secondEducationSetPending) {
    shouldAdvance = false;
  }
  const result = {
    provider: adapter.provider,
    stepName: adapter.resolveStepName(document),
    identified,
    filled,
    skipped,
    shouldAdvance,
    resumeUploadedNow,
    reviewRequired,
    secondEducationSetPending
  };
  emitToBackground({ type: "content:result", payload: result });
}
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "content:focusQuestion") {
    focusQuestionBySelector(message.payload.selector);
    sendResponse({ ok: true });
    return;
  }
  if (message?.type !== "content:run") return;
  runFillCycle(
    message.payload.profile,
    message.payload.resume,
    message.payload.autoAdvance,
    message.payload.resumeAlreadyUploaded,
    message.payload.educationSet2Decision
  ).then(() => sendResponse({ ok: true })).catch((error) => {
    const err = error instanceof Error ? error.message : "Unknown autofill error";
    emitToBackground({ type: "content:error", payload: { message: err } });
    sendResponse({ ok: false, error: err });
  });
  return true;
});
//# sourceMappingURL=content.js.map

