// extension/src/shared/constants.ts
var STORAGE_KEY = "jobAutofillConfig";
var SEEDED_COMMON_FIELDS = [
  { key: "firstName", label: "First name;Given name", value: "" },
  { key: "lastName", label: "Last name;Surname;Family name", value: "" },
  { key: "email", label: "Email", value: "" },
  { key: "phone", label: "Phone;Mobile", value: "" },
  { key: "currentTitle", label: "Current title;Job title;Title", value: "" },
  { key: "currentCompany", label: "Current company;Company", value: "" },
  { key: "yearsOfExperience", label: "Years of experience;Experience", value: "" },
  { key: "locationCity", label: "City;Town", value: "" },
  { key: "locationState", label: "State;Province;U.S. state;Region", value: "" },
  { key: "locationCountry", label: "Country;Region", value: "" },
  { key: "linkedinUrl", label: "LinkedIn;LinkedIn URL", value: "" },
  { key: "githubUrl", label: "GitHub;GitHub URL;Code repository;Code Repo", value: "" },
  { key: "portfolioUrl", label: "Portfolio;Portfolio URL;Personal website;Website", value: "" },
  { key: "workAuthorization", label: "Work authorization;Work status;Employment eligibility", value: "" },
  { key: "visaStatus", label: "Visa status;Immigration status", value: "" },
  { key: "salaryExpectation", label: "Salary expectation;Compensation;Desired salary;Salary", value: "" },
  { key: "noticePeriod", label: "Notice period;Start date;Availability", value: "" },
  { key: "relocationWilling", label: "Willing to relocate;Relocation", value: "" }
];
var SEEDED_ADDRESS_FIELDS = [
  { key: "addressLine1", label: "Address line 1;Street address;Address 1", value: "" },
  { key: "addressLine2", label: "Address line 2;Apartment;Suite;Address 2", value: "" },
  { key: "addressCity", label: "City;Town", value: "" },
  { key: "addressState", label: "State;Province;Region", value: "" },
  { key: "addressPostalCode", label: "Zip;ZIP code;Postal code", value: "" },
  { key: "addressCountry", label: "Country", value: "" }
];
var SEEDED_COMMON_QUESTIONS = [
  // Workday-specific/common ATS fields
  {
    key: "heardAboutUs",
    label: "How did you hear about us;How did you hear about us?;Where did you hear about us",
    value: "Careers site",
    description: "Common Workday dropdown. Default: Careers site (closest match)."
  },
  {
    key: "previouslyWorkedForCompany",
    label: "Have you previously worked for;Previously worked for",
    value: "No",
    description: "Common Workday yes/no question."
  },
  {
    key: "skills",
    label: "Skills;Skill",
    value: "",
    description: "Use ; to separate skills. Example: Python;React;AWS"
  },
  // Common screening questions across Workday/ATS (safe, non-demographic)
  {
    key: "screening_authorizedToWork",
    label: "Are you currently authorized to work;Work authorization;Employment eligibility",
    value: "Yes",
    description: "Common yes/no screening question: are you legally authorized to work in the role's country?"
  },
  {
    key: "screening_requireSponsorship",
    label: "Will you now or in the future require sponsorship;Require sponsorship;Visa sponsorship",
    value: "No",
    description: "Common yes/no screening question about needing employer visa sponsorship now or in the future."
  },
  {
    key: "screening_relocation",
    label: "Are you willing to relocate;Willing to relocate;Relocation",
    value: "No",
    description: "Common yes/no question about relocation willingness."
  },
  {
    key: "screening_travel",
    label: "Are you willing to travel;Willing to travel;Travel",
    value: "No",
    description: "Common yes/no question about travel willingness."
  },
  {
    key: "screening_startDate",
    label: "When can you start;Available start date;Availability;Start date",
    value: "",
    description: "Start date/availability question (often free text or date)."
  }
];
var SEEDED_WORK_FIELDS = [
  { key: "workCompany", label: "Company;Employer", value: "", description: "Company / employer name." },
  { key: "workTitle", label: "Job title;Position title;Title", value: "", description: "Your title in this role." },
  { key: "workLocation", label: "Location;City;Town", value: "", description: "Job location (city/state or full)." },
  { key: "workStartDate", label: "Start date;From", value: "", description: "Role start date (date or text)." },
  { key: "workEndDate", label: "End date;To;Through", value: "", description: "Role end date (or Present)." }
];
var SEEDED_EDUCATION_FIELDS = [
  { key: "eduSchool", label: "School;University;Institution", value: "", description: "School / university name." },
  { key: "eduDegree", label: "Degree;Qualification", value: "", description: "Degree (e.g., Bachelor's;B.S;M.S)." },
  { key: "eduField", label: "Field of study;Major;Discipline", value: "", description: "Major / field of study." },
  { key: "eduStartDate", label: "Start date;From", value: "", description: "Education start date (date or text)." },
  { key: "eduEndDate", label: "End date;To;Graduation date", value: "", description: "Education end / graduation date." }
];
function makeGroup(now, id, name, fields) {
  return {
    id,
    name,
    fields: fields.map((f) => ({ ...f, value: "" })),
    // groups start empty by default
    createdAt: now,
    updatedAt: now
  };
}
function createDefaultProfiles(now) {
  const addressGroups = [makeGroup(now, "address-1", "Address #1", SEEDED_ADDRESS_FIELDS)];
  const workGroups = [makeGroup(now, "work-1", "Work history #1", SEEDED_WORK_FIELDS)];
  const educationGroups = [
    makeGroup(now, "education-1", "Education #1", SEEDED_EDUCATION_FIELDS),
    makeGroup(now, "education-2", "Education #2", SEEDED_EDUCATION_FIELDS)
  ];
  return [
    {
      id: "profile-sde",
      name: "SDE",
      commonFields: SEEDED_COMMON_FIELDS.map((field) => ({ ...field })),
      addressGroups: addressGroups.map((g) => ({ ...g, fields: g.fields.map((f) => ({ ...f })) })),
      workGroups: workGroups.map((g) => ({ ...g, fields: g.fields.map((f) => ({ ...f })) })),
      educationGroups: educationGroups.map((g) => ({ ...g, fields: g.fields.map((f) => ({ ...f })) })),
      commonQuestions: SEEDED_COMMON_QUESTIONS.map((field) => ({ ...field })),
      createdAt: now,
      updatedAt: now
    },
    {
      id: "profile-ai-engineer",
      name: "AI Engineer",
      commonFields: SEEDED_COMMON_FIELDS.map((field) => ({ ...field })),
      addressGroups: addressGroups.map((g) => ({ ...g, fields: g.fields.map((f) => ({ ...f })) })),
      workGroups: workGroups.map((g) => ({ ...g, fields: g.fields.map((f) => ({ ...f })) })),
      educationGroups: educationGroups.map((g) => ({ ...g, fields: g.fields.map((f) => ({ ...f })) })),
      commonQuestions: SEEDED_COMMON_QUESTIONS.map((field) => ({ ...field })),
      createdAt: now,
      updatedAt: now
    }
  ];
}

// extension/src/shared/storage.ts
function createDefaultConfig() {
  const now = Date.now();
  const profiles = createDefaultProfiles(now);
  return {
    profiles,
    resumes: [],
    defaultProfileId: profiles[0]?.id ?? null,
    defaultResumeId: null,
    autoAdvance: false
  };
}
async function getConfig() {
  const stored = await chrome.storage.local.get(STORAGE_KEY);
  if (!stored[STORAGE_KEY]) {
    const defaults = createDefaultConfig();
    await setConfig(defaults);
    return defaults;
  }
  const raw = stored[STORAGE_KEY];
  const migrated = migrateConfig(raw);
  if (migrated !== raw) {
    await setConfig(migrated);
  }
  return migrated;
}
async function setConfig(config) {
  await chrome.storage.local.set({ [STORAGE_KEY]: config });
}
function migrateConfig(config) {
  let changed = false;
  const migrateField = (f) => {
    const any = f;
    let next = f;
    if (any.helpText && !any.description) {
      changed = true;
      next = { ...next, description: any.helpText, helpText: void 0 };
    }
    if (!any.fieldType) {
      changed = true;
      next = { ...next, fieldType: inferFieldTypeFromKey(next.key) };
    }
    return next;
  };
  const now = Date.now();
  const ensureGroup = (groups, prefix, name, templateFields) => {
    if (groups.length) return groups;
    changed = true;
    return [
      {
        id: `${prefix}-1`,
        name: `${name} #1`,
        fields: templateFields.map((t) => ({ ...t, value: "" })),
        createdAt: now,
        updatedAt: now
      }
    ];
  };
  const migratedProfiles = config.profiles.map((p) => {
    if (Array.isArray(p.commonFields)) {
      const profile = p;
      const safeCommonFields = Array.isArray(profile.commonFields) ? profile.commonFields : [];
      const safeCommonQuestions = Array.isArray(profile.commonQuestions) ? profile.commonQuestions : [];
      const safeAddressGroups = Array.isArray(profile.addressGroups) ? profile.addressGroups : [];
      const safeWorkGroups = Array.isArray(profile.workGroups) ? profile.workGroups : [];
      const safeEducationGroups = Array.isArray(profile.educationGroups) ? profile.educationGroups : [];
      if (safeCommonFields !== profile.commonFields || safeCommonQuestions !== profile.commonQuestions || safeAddressGroups !== profile.addressGroups || safeWorkGroups !== profile.workGroups || safeEducationGroups !== profile.educationGroups) {
        changed = true;
      }
      const next = {
        ...profile,
        commonFields: safeCommonFields.map(migrateField),
        commonQuestions: safeCommonQuestions.map(migrateField),
        addressGroups: safeAddressGroups.map((g) => ({
          ...g,
          fields: Array.isArray(g.fields) ? g.fields.map(migrateField) : []
        })),
        workGroups: safeWorkGroups.map((g) => ({
          ...g,
          fields: Array.isArray(g.fields) ? g.fields.map(migrateField) : []
        })),
        educationGroups: safeEducationGroups.map((g) => ({
          ...g,
          fields: Array.isArray(g.fields) ? g.fields.map(migrateField) : []
        }))
      };
      if (next.addressGroups.length > 1) {
        next.addressGroups = [next.addressGroups[0]];
        changed = true;
      }
      if (!next.addressGroups.length || !next.workGroups.length || !next.educationGroups.length) {
        const seeded2 = createDefaultProfiles(now)[0];
        next.addressGroups = ensureGroup(next.addressGroups, "address", "Address", seeded2.addressGroups[0]?.fields ?? []);
        next.workGroups = ensureGroup(next.workGroups, "work", "Work history", seeded2.workGroups[0]?.fields ?? []);
        next.educationGroups = ensureGroup(next.educationGroups, "education", "Education", seeded2.educationGroups[0]?.fields ?? []);
      }
      return next;
    }
    changed = true;
    const legacyFields = p.fields ?? [];
    const legacy = legacyFields.map(migrateField);
    const commonFields = [];
    const commonQuestions = [];
    const addressByGroupIndex = { 0: [] };
    const workByGroupIndex = { 0: [] };
    const educationByGroupIndex = { 0: [], 1: [] };
    const isQuestionKey = (key) => key.startsWith("screening_") || key === "heardAboutUs" || key === "previouslyWorkedForCompany" || key === "skills";
    for (const f of legacy) {
      if (isQuestionKey(f.key)) {
        commonQuestions.push(f);
        continue;
      }
      if (f.key.startsWith("address")) {
        addressByGroupIndex[0].push(f);
        continue;
      }
      if (f.key.startsWith("workExperience")) {
        const idx = f.key.match(/(\d)$/)?.[1] ? Number(f.key.match(/(\d)$/)[1]) - 1 : 0;
        const baseKey = f.key.replace(/\d$/, "");
        (workByGroupIndex[idx] ??= []).push({ ...f, key: baseKey });
        continue;
      }
      if (f.key.startsWith("education")) {
        const idx = f.key.match(/(\d)$/)?.[1] ? Number(f.key.match(/(\d)$/)[1]) - 1 : 0;
        const baseKey = f.key.replace(/\d$/, "");
        (educationByGroupIndex[idx] ??= []).push({ ...f, key: baseKey });
        continue;
      }
      commonFields.push(f);
    }
    const mkGroup = (prefix, idx, name, fields) => ({
      id: `${prefix}-${idx + 1}`,
      name: `${name} #${idx + 1}`,
      fields,
      createdAt: p.createdAt ?? now,
      updatedAt: now
    });
    const addressGroups = [mkGroup("address", 0, "Address", addressByGroupIndex[0] ?? [])];
    const workGroups = Object.keys(workByGroupIndex).map((k) => Number(k)).sort((a, b) => a - b).map((idx) => mkGroup("work", idx, "Work history", workByGroupIndex[idx] ?? [])).filter((g) => g.fields.length > 0);
    const educationGroups = Object.keys(educationByGroupIndex).map((k) => Number(k)).sort((a, b) => a - b).map((idx) => mkGroup("education", idx, "Education", educationByGroupIndex[idx] ?? [])).filter((g) => g.fields.length > 0);
    const seededProfiles = createDefaultProfiles(now);
    const seeded = seededProfiles[0];
    const nextProfile = {
      id: p.id,
      name: p.name,
      fields: void 0,
      commonFields: commonFields.length ? commonFields : seeded.commonFields.map((f) => ({ ...f })),
      addressGroups: ensureGroup(addressGroups, "address", "Address", seeded.addressGroups[0]?.fields ?? []),
      workGroups: ensureGroup(workGroups, "work", "Work history", seeded.workGroups[0]?.fields ?? []),
      educationGroups: seeded.educationGroups.length ? seeded.educationGroups.map((g, i) => ({
        ...g,
        id: `education-${i + 1}`,
        name: `Education #${i + 1}`,
        fields: i < educationGroups.length ? educationGroups[i].fields : g.fields.map((f) => ({ ...f, value: "" })),
        createdAt: p.createdAt ?? now,
        updatedAt: now
      })) : ensureGroup(educationGroups, "education", "Education", seeded.educationGroups[0]?.fields ?? []),
      commonQuestions: commonQuestions.length ? commonQuestions : seeded.commonQuestions.map((f) => ({ ...f })),
      createdAt: p.createdAt ?? now,
      updatedAt: now
    };
    return nextProfile;
  });
  if (!changed) return config;
  return { ...config, profiles: migratedProfiles };
}
function inferFieldTypeFromKey(key) {
  const k = key.toLowerCase();
  if (k.includes("email")) return "email";
  if (k.includes("phone")) return "phone";
  if (k.includes("url") || k.includes("website") || k.includes("linkedin") || k.includes("github")) return "url";
  if (k.includes("years") || k.includes("salary") || k.includes("compensation")) return "number";
  if (k.includes("authorized") || k.includes("sponsorship") || k.includes("relocation") || k.includes("travel")) return "boolean";
  if (k.includes("date") || k.includes("start") || k.includes("end")) return "date";
  return "text";
}

// extension/src/ui/popup/popup.ts
var profileSelect = document.getElementById("profileSelect");
var resumeSelect = document.getElementById("resumeSelect");
var statusLine = document.getElementById("statusLine");
var metaLine = document.getElementById("metaLine");
var countLine = document.getElementById("countLine");
var executionLine = document.getElementById("executionLine");
var errorLine = document.getElementById("errorLine");
var identifiedList = document.getElementById("identifiedList");
var skippedList = document.getElementById("skippedList");
var reviewActions = document.getElementById("reviewActions");
var education2Actions = document.getElementById("education2Actions");
var nextSkippedBtn = document.getElementById("nextSkippedBtn");
var continueBtn = document.getElementById("continueBtn");
var fillEducation2Btn = document.getElementById("fillEducation2Btn");
var skipEducation2Btn = document.getElementById("skipEducation2Btn");
var startBtn = document.getElementById("startBtn");
var pauseBtn = document.getElementById("pauseBtn");
var resumeBtn = document.getElementById("resumeBtn");
var stopBtn = document.getElementById("stopBtn");
var openSettingsBtn = document.getElementById("openSettingsBtn");
var currentSession = null;
async function getActiveTabId() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) throw new Error("No active tab");
  return tab.id;
}
async function sendCommand(message) {
  return await chrome.runtime.sendMessage(message);
}
async function renderSelectors() {
  const config = await getConfig();
  profileSelect.innerHTML = "";
  for (const profile of config.profiles) {
    const option = new Option(profile.name, profile.id);
    profileSelect.appendChild(option);
  }
  profileSelect.value = config.defaultProfileId ?? config.profiles[0]?.id ?? "";
  resumeSelect.innerHTML = "";
  resumeSelect.appendChild(new Option("No resume", ""));
  for (const resume of config.resumes) {
    const option = new Option(resume.name, resume.id);
    resumeSelect.appendChild(option);
  }
  resumeSelect.value = config.defaultResumeId ?? "";
}
function renderSession(session) {
  currentSession = session;
  if (!session) {
    statusLine.textContent = "Idle";
    metaLine.textContent = "Provider: - | Step: -";
    countLine.textContent = "Filled 0 | Skipped 0";
    executionLine.textContent = "Not executing";
    errorLine.style.display = "none";
    reviewActions.style.display = "none";
    renderList(identifiedList, []);
    renderList(skippedList, []);
    setButtons("idle");
    return;
  }
  statusLine.textContent = session.status;
  metaLine.textContent = `Provider: ${session.provider} | Step: ${session.stepName}`;
  countLine.textContent = `Filled ${session.filledCount} | Skipped ${session.skippedCount}`;
  if (session.status === "running") executionLine.textContent = "Executing on this page\u2026";
  else if (session.status === "paused") executionLine.textContent = "Paused.";
  else if (session.status === "waitingForNavigation") executionLine.textContent = "Waiting for navigation / next step\u2026";
  else if (session.status === "finishedForReview") executionLine.textContent = "Stopped for manual review.";
  else if (session.status === "pausedForReview") executionLine.textContent = "Paused: fill highlighted skipped fields, then use \u201CNext skipped field\u201D and \u201CContinue\u201D.";
  else if (session.status === "pausedForSecondEducationSet")
    executionLine.textContent = "Education set 2 is available. Fill it now or skip it.";
  else if (session.status === "stopped") executionLine.textContent = "Stopped.";
  else if (session.status === "error") executionLine.textContent = "Error while executing.";
  else executionLine.textContent = "Not executing";
  if (session.status === "error" && session.lastError) {
    errorLine.textContent = session.lastError;
    errorLine.style.display = "block";
  } else {
    errorLine.textContent = "";
    errorLine.style.display = "none";
  }
  reviewActions.style.display = session.status === "pausedForReview" ? "grid" : "none";
  education2Actions.style.display = session.status === "pausedForSecondEducationSet" ? "grid" : "none";
  renderList(identifiedList, session.identified);
  renderList(skippedList, session.skipped);
  setButtons(session.status);
}
function renderList(list, outcomes) {
  list.innerHTML = "";
  for (const outcome of outcomes) {
    const item = document.createElement("li");
    const key = outcome.canonicalKey ? ` -> ${outcome.canonicalKey}` : "";
    const reason = outcome.reason ? ` (${outcome.reason})` : "";
    item.textContent = `${outcome.label}${key}: ${outcome.status}${reason}`;
    list.appendChild(item);
  }
}
function setButtons(status) {
  startBtn.disabled = status === "running" || status === "waitingForNavigation" || status === "pausedForReview" || status === "pausedForSecondEducationSet";
  pauseBtn.disabled = status !== "running";
  resumeBtn.disabled = status !== "paused";
  stopBtn.disabled = status === "idle" || status === "stopped";
}
async function refreshSession() {
  const tabId = await getActiveTabId();
  const response = await sendCommand({
    type: "popup:getState",
    payload: { tabId }
  });
  renderSession(response.session);
}
async function handleStart() {
  const tabId = await getActiveTabId();
  const config = await getConfig();
  await sendCommand({
    type: "popup:start",
    payload: {
      tabId,
      profileId: profileSelect.value || null,
      resumeId: resumeSelect.value || null,
      autoAdvance: config.autoAdvance
    }
  });
  await refreshSession();
}
async function handlePause() {
  const tabId = await getActiveTabId();
  await sendCommand({ type: "popup:pause", payload: { tabId } });
  await refreshSession();
}
async function handleResume() {
  const tabId = await getActiveTabId();
  await sendCommand({ type: "popup:resume", payload: { tabId } });
  await refreshSession();
}
async function handleStop() {
  const tabId = await getActiveTabId();
  await sendCommand({ type: "popup:stop", payload: { tabId } });
  await refreshSession();
}
startBtn.addEventListener("click", () => void handleStart());
pauseBtn.addEventListener("click", () => void handlePause());
resumeBtn.addEventListener("click", () => void handleResume());
stopBtn.addEventListener("click", () => void handleStop());
openSettingsBtn.addEventListener("click", () => {
  void chrome.runtime.openOptionsPage();
});
fillEducation2Btn.addEventListener("click", async () => {
  if (!currentSession) return;
  const tabId = currentSession.tabId;
  await sendCommand({ type: "popup:fillSecondEducationSet", payload: { tabId } });
  await refreshSession();
});
skipEducation2Btn.addEventListener("click", async () => {
  if (!currentSession) return;
  const tabId = currentSession.tabId;
  await sendCommand({ type: "popup:skipSecondEducationSet", payload: { tabId } });
  await refreshSession();
});
nextSkippedBtn.addEventListener("click", async () => {
  if (!currentSession) return;
  if (currentSession.status !== "pausedForReview") return;
  const tabId = currentSession.tabId;
  const queue = currentSession.skipped.filter((item2) => {
    const reason = item2.reason;
    if (!item2.required) return false;
    return reason === "NotPredefined" || reason === "UnsupportedType" || reason === "NoValue" || reason === "NoDomTarget";
  });
  if (!queue.length) return;
  const key = `jobAutofill_reviewCursor_${tabId}`;
  const raw = localStorage.getItem(key);
  const idx = raw ? Number.parseInt(raw, 10) : 0;
  const nextIndex = Number.isFinite(idx) ? Math.max(0, Math.min(idx, queue.length - 1)) : 0;
  const item = queue[nextIndex];
  await sendCommand({
    type: "popup:nextSkippedField",
    payload: { tabId, questionId: item.questionId }
  });
  const updated = (nextIndex + 1) % queue.length;
  localStorage.setItem(key, String(updated));
});
continueBtn.addEventListener("click", async () => {
  if (!currentSession) return;
  const tabId = currentSession.tabId;
  localStorage.removeItem(`jobAutofill_reviewCursor_${tabId}`);
  await sendCommand({ type: "popup:continueFromReview", payload: { tabId } });
  await refreshSession();
});
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "background:sessionUpdated") {
    void refreshSession();
  }
});
void renderSelectors().then(refreshSession);
//# sourceMappingURL=popup.js.map
