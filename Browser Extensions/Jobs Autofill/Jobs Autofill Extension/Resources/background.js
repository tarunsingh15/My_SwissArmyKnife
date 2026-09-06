// extension/src/shared/constants.ts
var STORAGE_KEY = "jobAutofillConfig";
var SESSIONS_STORAGE_KEY = "jobAutofillSessions";
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
function getProfileById(config, profileId) {
  if (!profileId) return null;
  return config.profiles.find((profile) => profile.id === profileId) ?? null;
}
function getResumeById(config, resumeId) {
  if (!resumeId) return null;
  return config.resumes.find((resume) => resume.id === resumeId) ?? null;
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

// extension/src/background.ts
var sessions = /* @__PURE__ */ new Map();
var persistedSessionsLoaded = false;
async function ensurePersistedSessionsLoaded() {
  if (persistedSessionsLoaded) return;
  const stored = await chrome.storage.local.get(SESSIONS_STORAGE_KEY);
  const raw = stored[SESSIONS_STORAGE_KEY];
  if (raw && typeof raw === "object") {
    for (const [tabIdStr, session] of Object.entries(raw)) {
      const tabId = Number(tabIdStr);
      if (!Number.isFinite(tabId) || !session) continue;
      if (!("educationSet2Decision" in session)) {
        session.educationSet2Decision = "unknown";
      }
      sessions.set(tabId, session);
    }
  }
  persistedSessionsLoaded = true;
}
async function persistTabSession(tabId) {
  const session = sessions.get(tabId);
  if (!session) return;
  const stored = await chrome.storage.local.get(SESSIONS_STORAGE_KEY);
  const raw = stored[SESSIONS_STORAGE_KEY];
  const next = raw && typeof raw === "object" ? { ...raw } : {};
  next[String(tabId)] = session;
  await chrome.storage.local.set({ [SESSIONS_STORAGE_KEY]: next });
}
function resolveDomain(url) {
  if (!url) return "unknown";
  try {
    return new URL(url).hostname;
  } catch {
    return "unknown";
  }
}
function notifyPopup(tabId) {
  chrome.runtime.sendMessage({ type: "background:sessionUpdated", payload: { tabId } }).catch(() => void 0);
}
async function startSession(payload) {
  const tab = await chrome.tabs.get(payload.tabId);
  const session = {
    tabId: payload.tabId,
    domain: resolveDomain(tab.url),
    provider: "generic",
    startedAt: Date.now(),
    updatedAt: Date.now(),
    profileId: payload.profileId,
    resumeId: payload.resumeId,
    status: "running",
    stepName: "Starting",
    filledCount: 0,
    skippedCount: 0,
    identified: [],
    skipped: [],
    lastError: void 0,
    resumeUploaded: false,
    educationSet2Decision: "unknown"
  };
  sessions.set(payload.tabId, session);
  notifyPopup(payload.tabId);
  await persistTabSession(payload.tabId);
  await runContentCycle(payload.tabId);
}
async function runContentCycle(tabId, autoAdvanceOverride) {
  const session = sessions.get(tabId);
  if (!session || session.status !== "running") return;
  const config = await getConfig();
  const profile = getProfileById(config, session.profileId);
  const resume = getResumeById(config, session.resumeId);
  const autoAdvance = typeof autoAdvanceOverride === "boolean" ? autoAdvanceOverride : config.autoAdvance;
  const fillSecondEducationSet = session.educationSet2Decision === "fill";
  await chrome.tabs.sendMessage(tabId, {
    type: "content:run",
    payload: {
      profile,
      resume,
      autoAdvance,
      resumeAlreadyUploaded: session.resumeUploaded,
      educationSet2Decision: session.educationSet2Decision
    }
  });
}
function updateSessionStatus(tabId, status) {
  const session = sessions.get(tabId);
  if (!session) return;
  session.status = status;
  session.updatedAt = Date.now();
  sessions.set(tabId, session);
  notifyPopup(tabId);
  void persistTabSession(tabId);
}
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "popup:start") {
    void ensurePersistedSessionsLoaded().finally(() => void 0);
    startSession(message.payload).then(() => sendResponse({ ok: true })).catch(
      (error) => sendResponse({ ok: false, error: error instanceof Error ? error.message : "Failed to start session" })
    );
    return true;
  }
  if (message.type === "popup:pause") {
    updateSessionStatus(message.payload.tabId, "paused");
    sendResponse({ ok: true });
    return;
  }
  if (message.type === "popup:resume") {
    updateSessionStatus(message.payload.tabId, "running");
    runContentCycle(message.payload.tabId).then(() => sendResponse({ ok: true })).catch(
      (error) => sendResponse({ ok: false, error: error instanceof Error ? error.message : "Failed to resume session" })
    );
    return true;
  }
  if (message.type === "popup:stop") {
    updateSessionStatus(message.payload.tabId, "stopped");
    sendResponse({ ok: true });
    return;
  }
  if (message.type === "popup:nextSkippedField") {
    void ensurePersistedSessionsLoaded().finally(() => void 0);
    const tabId = message.payload.tabId;
    const session = sessions.get(tabId);
    const target = session?.skipped.find((item) => item.questionId === message.payload.questionId) ?? null;
    const selector = target?.selector ?? null;
    void chrome.tabs.sendMessage(tabId, { type: "content:focusQuestion", payload: { selector } }).then(() => sendResponse({ ok: true })).catch(
      (error) => sendResponse({
        ok: false,
        error: error instanceof Error ? error.message : "Failed to focus skipped field"
      })
    );
    return true;
  }
  if (message.type === "popup:continueFromReview") {
    void ensurePersistedSessionsLoaded().finally(() => void 0);
    const tabId = message.payload.tabId;
    updateSessionStatus(tabId, "running");
    runContentCycle(tabId, true).then(() => sendResponse({ ok: true })).catch(
      (error) => sendResponse({ ok: false, error: error instanceof Error ? error.message : "Failed to continue after review" })
    );
    return true;
  }
  if (message.type === "popup:fillSecondEducationSet") {
    void ensurePersistedSessionsLoaded().finally(() => void 0);
    const tabId = message.payload.tabId;
    const session = sessions.get(tabId);
    if (!session) return sendResponse({ ok: false, error: "No session" });
    session.educationSet2Decision = "fill";
    sessions.set(tabId, session);
    updateSessionStatus(tabId, "running");
    runContentCycle(tabId, true).then(() => sendResponse({ ok: true })).catch(
      (error) => sendResponse({ ok: false, error: error instanceof Error ? error.message : "Failed to fill second education set" })
    );
    return true;
  }
  if (message.type === "popup:skipSecondEducationSet") {
    void ensurePersistedSessionsLoaded().finally(() => void 0);
    const tabId = message.payload.tabId;
    const session = sessions.get(tabId);
    if (!session) return sendResponse({ ok: false, error: "No session" });
    session.educationSet2Decision = "skip";
    sessions.set(tabId, session);
    updateSessionStatus(tabId, "running");
    runContentCycle(tabId, true).then(() => sendResponse({ ok: true })).catch(
      (error) => sendResponse({ ok: false, error: error instanceof Error ? error.message : "Failed to skip second education set" })
    );
    return true;
  }
  if (message.type === "popup:getState") {
    void ensurePersistedSessionsLoaded().then(() => {
      const session = sessions.get(message.payload.tabId) ?? null;
      sendResponse({ ok: true, session });
    });
    return true;
  }
  if (message.type === "content:result") {
    const tabId = sender.tab?.id;
    if (typeof tabId !== "number") return;
    const session = sessions.get(tabId);
    if (!session) return;
    session.provider = message.payload.provider;
    session.stepName = message.payload.stepName;
    session.filledCount += message.payload.filled.length;
    session.skippedCount += message.payload.skipped.length;
    session.identified = message.payload.identified;
    session.skipped = message.payload.skipped;
    session.updatedAt = Date.now();
    session.status = message.payload.secondEducationSetPending ? "pausedForSecondEducationSet" : message.payload.reviewRequired ? "pausedForReview" : message.payload.shouldAdvance ? "waitingForNavigation" : "finishedForReview";
    session.lastError = void 0;
    if (message.payload.resumeUploadedNow) session.resumeUploaded = true;
    sessions.set(tabId, session);
    notifyPopup(tabId);
    void persistTabSession(tabId);
    if (session.status === "pausedForReview") {
      const firstRequired = session.skipped.find((item) => item.required && item.selector);
      if (firstRequired) {
        void chrome.tabs.sendMessage(tabId, { type: "content:focusQuestion", payload: { selector: firstRequired.selector ?? null } }).catch(() => void 0);
      }
    }
    return;
  }
  if (message.type === "content:error") {
    const tabId = sender.tab?.id;
    if (typeof tabId !== "number") return;
    const session = sessions.get(tabId);
    if (!session) return;
    session.status = "error";
    session.lastError = message.payload.message;
    session.stepName = "Error";
    session.updatedAt = Date.now();
    sessions.set(tabId, session);
    notifyPopup(tabId);
    void persistTabSession(tabId);
  }
});
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  const session = sessions.get(tabId);
  if (!session || session.status === "paused" || session.status === "pausedForReview" || session.status === "pausedForSecondEducationSet" || session.status === "stopped") return;
  if (changeInfo.status !== "complete") return;
  session.identified = [];
  session.skipped = [];
  session.filledCount = 0;
  session.skippedCount = 0;
  session.stepName = "Loading next step";
  session.lastError = void 0;
  session.status = "running";
  session.updatedAt = Date.now();
  sessions.set(tabId, session);
  notifyPopup(tabId);
  void persistTabSession(tabId);
  runContentCycle(tabId).catch(() => {
    updateSessionStatus(tabId, "error");
  });
});
chrome.tabs.onRemoved.addListener((tabId) => {
  sessions.delete(tabId);
});
chrome.commands.onCommand.addListener((command) => {
  if (command !== "run-autofill") return;
  void (async () => {
    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const tabId = activeTab?.id;
    if (typeof tabId !== "number") return;
    await ensurePersistedSessionsLoaded();
    const config = await getConfig();
    const payload = {
      tabId,
      profileId: config.defaultProfileId ?? config.profiles[0]?.id ?? null,
      resumeId: config.defaultResumeId,
      autoAdvance: config.autoAdvance
    };
    await startSession(payload);
  })().catch(() => void 0);
});
//# sourceMappingURL=background.js.map
