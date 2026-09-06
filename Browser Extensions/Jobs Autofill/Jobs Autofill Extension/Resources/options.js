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
function createId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}
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

// extension/src/ui/options/options.ts
var profileSelect = document.getElementById("profileSelect");
var fieldsBodyCommon = document.getElementById("fieldsBodyCommon");
var fieldsBodyCommonQuestions = document.getElementById("fieldsBodyCommonQuestions");
var addressGroupsRoot = document.getElementById("addressGroupsRoot");
var workGroupsRoot = document.getElementById("workGroupsRoot");
var educationGroupsRoot = document.getElementById("educationGroupsRoot");
var resumeList = document.getElementById("resumeList");
var statusToast = document.getElementById("statusToast");
var newProfileBtn = document.getElementById("newProfileBtn");
var duplicateProfileBtn = document.getElementById("duplicateProfileBtn");
var renameProfileBtn = document.getElementById("renameProfileBtn");
var deleteProfileBtn = document.getElementById("deleteProfileBtn");
var addAddressFieldBtn = document.getElementById("addAddressFieldBtn");
var addWorkGroupBtn = document.getElementById("addWorkGroupBtn");
var addWorkFieldBtn = document.getElementById("addWorkFieldBtn");
var addEducationGroupBtn = document.getElementById("addEducationGroupBtn");
var addEducationFieldBtn = document.getElementById("addEducationFieldBtn");
var addCommonQuestionBtn = document.getElementById("addCommonQuestionBtn");
var addResumeBtn = document.getElementById("addResumeBtn");
var exportBtn = document.getElementById("exportBtn");
var importBtn = document.getElementById("importBtn");
var resumeNameInput = document.getElementById("resumeNameInput");
var resumeFileInput = document.getElementById("resumeFileInput");
var importFileInput = document.getElementById("importFileInput");
var state = createDefaultConfig();
var statusTimer = null;
var FIELD_HELP_TEXT = {
  firstName: "Your given name as it should appear on job applications.",
  lastName: "Your family name as it should appear on job applications.",
  email: "Primary email address for receiving application updates.",
  phone: "Phone number (include country code if required).",
  currentTitle: "Your most recent job title (e.g., Software Engineer).",
  currentCompany: "Your most recent company name.",
  yearsOfExperience: "Total years of professional experience (or a numeric approximation).",
  locationCity: "City for your current location.",
  locationState: "State/Province for your current location.",
  locationCountry: "Country for your current location.",
  linkedinUrl: "Full LinkedIn profile URL.",
  githubUrl: "Full GitHub profile URL or code repository link.",
  portfolioUrl: "Portfolio or personal website URL.",
  workAuthorization: "Select the appropriate work authorization value for your location.",
  visaStatus: "If applicable, specify your current visa status.",
  salaryExpectation: "Your desired salary or salary range (as required by the form).",
  noticePeriod: "How soon you can start (e.g., '2 weeks' or 'Immediate').",
  relocationWilling: "Whether you are willing to relocate (Yes/No)."
};
var FIELD_TYPE_OPTIONS = [
  { label: "Text", value: "text" },
  { label: "Date", value: "date" },
  { label: "Email", value: "email" },
  { label: "Phone", value: "phone" },
  { label: "Dropdown", value: "dropdown" },
  { label: "Boolean", value: "boolean" },
  { label: "Number", value: "number" },
  { label: "URL", value: "url" }
];
function getSelectedProfile() {
  const id = profileSelect.value;
  return state.profiles.find((profile) => profile.id === id) ?? null;
}
function getFieldHelpText(fieldKey) {
  return FIELD_HELP_TEXT[fieldKey] ?? "";
}
function getDefaultHelpForNewField(fieldKey) {
  return getFieldHelpText(fieldKey);
}
function setStatus(text) {
  statusToast.textContent = text;
  statusToast.classList.add("visible");
  if (statusTimer !== null) window.clearTimeout(statusTimer);
  statusTimer = window.setTimeout(() => {
    statusToast.classList.remove("visible");
    statusTimer = null;
  }, 2600);
}
async function saveAndRender(status) {
  await setConfig(state);
  render();
  setStatus(status);
}
function render() {
  const selectedId = state.defaultProfileId ?? profileSelect.value ?? state.profiles[0]?.id ?? "";
  profileSelect.innerHTML = "";
  for (const profile2 of state.profiles) {
    profileSelect.appendChild(new Option(profile2.name, profile2.id));
  }
  profileSelect.value = selectedId;
  const profile = getSelectedProfile();
  renderFields(profile);
  renderResumes();
}
function renderFields(profile) {
  if (!profile) return;
  profile.commonFields = Array.isArray(profile.commonFields) ? profile.commonFields : [];
  profile.commonQuestions = Array.isArray(profile.commonQuestions) ? profile.commonQuestions : [];
  profile.addressGroups = Array.isArray(profile.addressGroups) ? profile.addressGroups : [];
  if (profile.addressGroups.length > 1) profile.addressGroups = [profile.addressGroups[0]];
  profile.workGroups = Array.isArray(profile.workGroups) ? profile.workGroups : [];
  profile.educationGroups = Array.isArray(profile.educationGroups) ? profile.educationGroups : [];
  fieldsBodyCommon.innerHTML = "";
  fieldsBodyCommonQuestions.innerHTML = "";
  addressGroupsRoot.innerHTML = "";
  workGroupsRoot.innerHTML = "";
  educationGroupsRoot.innerHTML = "";
  for (const field of profile.commonFields) {
    const row = document.createElement("tr");
    row.dataset.fieldKey = field.key;
    row.appendChild(makeDragHandleCell("Drag to reorder field"));
    row.appendChild(
      makeTextareaCell(
        field.label,
        (value) => updateCommonField(field.key, { label: value }),
        "Matcher spec for question labels (; separated; exact match)."
      )
    );
    row.appendChild(
      makeTypedValueCell(
        field,
        field.value,
        (value) => updateCommonField(field.key, { value }),
        "Value that will be inserted into the application field."
      )
    );
    row.appendChild(
      makeSelectCell(
        FIELD_TYPE_OPTIONS,
        field.fieldType ?? "text",
        (value) => updateCommonField(field.key, { fieldType: value })
      )
    );
    row.appendChild(
      makeInputCell(
        field.description ?? getFieldHelpText(field.key),
        (value) => updateCommonField(field.key, { description: value }),
        "Description shown in settings. Editable."
      )
    );
    row.appendChild(
      makeInlineActionCell([
        { icon: "\uFF0B", title: "Insert field below", onClick: () => void insertCommonFieldBelow(field.key) },
        { icon: "\u{1F5D1}", title: "Delete field", onClick: () => void removeCommonField(field.key) }
      ])
    );
    fieldsBodyCommon.appendChild(row);
  }
  if (!profile.commonFields.length) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 6;
    const button = document.createElement("button");
    button.textContent = "Add first field";
    button.addEventListener("click", () => void insertCommonFieldBelow(null));
    cell.appendChild(button);
    row.appendChild(cell);
    fieldsBodyCommon.appendChild(row);
  }
  wireRowDnD(fieldsBodyCommon, (orderedKeys) => void reorderCommonFields(orderedKeys));
  renderGroupedSection("address", addressGroupsRoot, profile.addressGroups);
  renderGroupedSection("work", workGroupsRoot, profile.workGroups);
  renderGroupedSection("education", educationGroupsRoot, profile.educationGroups);
  for (const field of profile.commonQuestions) {
    const row = document.createElement("tr");
    row.dataset.fieldKey = field.key;
    row.appendChild(makeDragHandleCell("Drag to reorder question"));
    row.appendChild(
      makeTextareaCell(field.label, (value) => updateCommonQuestion(field.key, { label: value }), "Matcher spec (; separated).")
    );
    row.appendChild(
      makeTypedValueCell(
        field,
        field.value,
        (value) => updateCommonQuestion(field.key, { value }),
        field.key === "skills" ? "Use ; to separate skills. Example: Python;React;AWS" : "Value(s) to be used for this question. Use ; to provide alternatives."
      )
    );
    row.appendChild(
      makeSelectCell(
        FIELD_TYPE_OPTIONS,
        field.fieldType ?? "text",
        (value) => updateCommonQuestion(field.key, { fieldType: value })
      )
    );
    row.appendChild(
      makeInputCell(
        field.description ?? "",
        (value) => updateCommonQuestion(field.key, { description: value }),
        "Description shown in settings. Editable."
      )
    );
    row.appendChild(makeIconButtonCell("\u{1F5D1}", "Delete question", () => void removeCommonQuestion(field.key)));
    fieldsBodyCommonQuestions.appendChild(row);
  }
  wireRowDnD(fieldsBodyCommonQuestions, (orderedKeys) => void reorderCommonQuestions(orderedKeys));
}
function renderGroupedSection(groupType, root, groups) {
  for (const group of groups) {
    const wrapper = document.createElement("div");
    wrapper.className = "groupCard";
    const header = document.createElement("div");
    header.className = "row";
    const title = document.createElement("h3");
    title.textContent = group.name;
    title.style.margin = "6px 0";
    title.style.fontSize = "14px";
    const rename = document.createElement("button");
    rename.className = "iconBtn";
    rename.textContent = "\u270E";
    rename.title = "Rename group";
    rename.addEventListener("click", () => {
      const newName = prompt("Group name", group.name)?.trim();
      if (!newName) return;
      updateGroupMeta(groupType, group.id, { name: newName });
    });
    const del = document.createElement("button");
    del.className = "iconBtn";
    del.textContent = "\u{1F5D1}";
    del.title = "Delete group";
    del.addEventListener("click", () => void removeGroup(groupType, group.id));
    header.appendChild(title);
    header.appendChild(rename);
    header.appendChild(del);
    wrapper.appendChild(header);
    const table = document.createElement("table");
    table.innerHTML = `
      <thead>
        <tr>
          <th class="dragCol">Move</th>
          <th>Label</th>
          <th>Value</th>
          <th>Type</th>
          <th>Description</th>
          <th>Action</th>
        </tr>
      </thead>
    `;
    const body = document.createElement("tbody");
    for (const field of group.fields) {
      const row = document.createElement("tr");
      row.dataset.fieldKey = field.key;
      row.appendChild(makeDragHandleCell("Drag to reorder group field"));
      row.appendChild(makeTextareaCell(field.label, (v) => updateGroupField(groupType, group.id, field.key, { label: v }), "Matcher spec (; separated)."));
      row.appendChild(
        makeTypedValueCell(
          field,
          field.value,
          (v) => updateGroupField(groupType, group.id, field.key, { value: v }),
          "Value for this group instance."
        )
      );
      row.appendChild(
        makeSelectCell(
          FIELD_TYPE_OPTIONS,
          field.fieldType ?? "text",
          (v) => updateGroupField(groupType, group.id, field.key, { fieldType: v })
        )
      );
      row.appendChild(
        makeInputCell(
          field.description ?? "",
          (v) => updateGroupField(groupType, group.id, field.key, { description: v }),
          "Description shown in settings. Editable."
        )
      );
      row.appendChild(makeIconButtonCell("\u{1F5D1}", "Delete this field label from all groups", () => void removeGroupFieldKey(groupType, field.key)));
      body.appendChild(row);
    }
    wireRowDnD(body, (orderedKeys) => void reorderGroupFields(groupType, orderedKeys));
    table.appendChild(body);
    wrapper.appendChild(table);
    root.appendChild(wrapper);
  }
}
function renderResumes() {
  resumeList.innerHTML = "";
  for (const resume of state.resumes) {
    const item = document.createElement("li");
    const renameInput = document.createElement("input");
    renameInput.type = "text";
    renameInput.value = resume.name;
    renameInput.addEventListener("change", () => {
      void renameResume(resume.id, renameInput.value.trim() || resume.name);
    });
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => void removeResume(resume.id));
    item.append(`${resume.mimeType} - `);
    item.appendChild(renameInput);
    item.append(" ");
    item.appendChild(deleteButton);
    resumeList.appendChild(item);
  }
}
function updateCommonField(fieldKey, patch) {
  const profile = getSelectedProfile();
  if (!profile) return;
  profile.commonFields = profile.commonFields.map((field) => field.key === fieldKey ? { ...field, ...patch } : field);
  profile.updatedAt = Date.now();
  void saveAndRender("Field updated");
}
async function removeCommonField(fieldKey) {
  const profile = getSelectedProfile();
  if (!profile) return;
  profile.commonFields = profile.commonFields.filter((field) => field.key !== fieldKey);
  profile.updatedAt = Date.now();
  await saveAndRender("Field removed");
}
function updateCommonQuestion(fieldKey, patch) {
  const profile = getSelectedProfile();
  if (!profile) return;
  profile.commonQuestions = profile.commonQuestions.map((field) => field.key === fieldKey ? { ...field, ...patch } : field);
  profile.updatedAt = Date.now();
  void saveAndRender("Question updated");
}
async function removeCommonQuestion(fieldKey) {
  const profile = getSelectedProfile();
  if (!profile) return;
  profile.commonQuestions = profile.commonQuestions.filter((field) => field.key !== fieldKey);
  profile.updatedAt = Date.now();
  await saveAndRender("Question removed");
}
async function reorderCommonFields(orderedKeys) {
  const profile = getSelectedProfile();
  if (!profile) return;
  const before = profile.commonFields.map((f) => f.key).join("|");
  const map = new Map(profile.commonFields.map((f) => [f.key, f]));
  const reordered = orderedKeys.map((k) => map.get(k)).filter((x) => !!x);
  const leftovers = profile.commonFields.filter((f) => !orderedKeys.includes(f.key));
  profile.commonFields = [...reordered, ...leftovers];
  const after = profile.commonFields.map((f) => f.key).join("|");
  if (after === before) return;
  profile.updatedAt = Date.now();
  await saveAndRender("Common fields reordered");
}
async function reorderCommonQuestions(orderedKeys) {
  const profile = getSelectedProfile();
  if (!profile) return;
  const before = profile.commonQuestions.map((f) => f.key).join("|");
  const map = new Map(profile.commonQuestions.map((f) => [f.key, f]));
  const reordered = orderedKeys.map((k) => map.get(k)).filter((x) => !!x);
  const leftovers = profile.commonQuestions.filter((f) => !orderedKeys.includes(f.key));
  profile.commonQuestions = [...reordered, ...leftovers];
  const after = profile.commonQuestions.map((f) => f.key).join("|");
  if (after === before) return;
  profile.updatedAt = Date.now();
  await saveAndRender("Common questions reordered");
}
async function reorderGroupFields(groupType, orderedKeys) {
  const profile = getSelectedProfile();
  if (!profile) return;
  const groups = getGroupList(profile, groupType);
  const before = groups[0]?.fields.map((f) => f.key).join("|") ?? "";
  const next = groups.map((g) => {
    const map = new Map(g.fields.map((f) => [f.key, f]));
    const reordered = orderedKeys.map((k) => map.get(k)).filter((x) => !!x);
    const leftovers = g.fields.filter((f) => !orderedKeys.includes(f.key));
    return { ...g, fields: [...reordered, ...leftovers], updatedAt: Date.now() };
  });
  setGroupList(profile, groupType, next);
  const after = next[0]?.fields.map((f) => f.key).join("|") ?? "";
  if (after === before) return;
  profile.updatedAt = Date.now();
  await saveAndRender(`${groupType} fields reordered`);
}
function updateGroupMeta(groupType, groupId, patch) {
  const profile = getSelectedProfile();
  if (!profile) return;
  const list = getGroupList(profile, groupType);
  const next = list.map((g) => g.id === groupId ? { ...g, ...patch, updatedAt: Date.now() } : g);
  setGroupList(profile, groupType, next);
  profile.updatedAt = Date.now();
  void saveAndRender("Group updated");
}
function updateGroupField(groupType, groupId, fieldKey, patch) {
  const profile = getSelectedProfile();
  if (!profile) return;
  const list = getGroupList(profile, groupType);
  const next = list.map((g) => {
    if (g.id !== groupId) return g;
    return {
      ...g,
      updatedAt: Date.now(),
      fields: g.fields.map((f) => f.key === fieldKey ? { ...f, ...patch } : f)
    };
  });
  setGroupList(profile, groupType, next);
  profile.updatedAt = Date.now();
  void saveAndRender("Group field updated");
}
async function removeGroup(groupType, groupId) {
  const profile = getSelectedProfile();
  if (!profile) return;
  const list = getGroupList(profile, groupType);
  const next = list.filter((g) => g.id !== groupId);
  setGroupList(profile, groupType, next.length ? next : list);
  profile.updatedAt = Date.now();
  await saveAndRender("Group removed");
}
async function removeGroupFieldKey(groupType, fieldKey) {
  const profile = getSelectedProfile();
  if (!profile) return;
  const list = getGroupList(profile, groupType);
  const next = list.map((g) => ({ ...g, fields: g.fields.filter((f) => f.key !== fieldKey), updatedAt: Date.now() }));
  setGroupList(profile, groupType, next);
  profile.updatedAt = Date.now();
  await saveAndRender("Field label removed from all groups");
}
function getGroupList(profile, groupType) {
  if (groupType === "address") return profile.addressGroups;
  if (groupType === "work") return profile.workGroups;
  return profile.educationGroups;
}
function setGroupList(profile, groupType, list) {
  if (groupType === "address") profile.addressGroups = list;
  else if (groupType === "work") profile.workGroups = list;
  else profile.educationGroups = list;
}
async function renameResume(resumeId, newName) {
  state.resumes = state.resumes.map((resume) => resume.id === resumeId ? { ...resume, name: newName } : resume);
  await saveAndRender("Resume updated");
}
async function removeResume(resumeId) {
  state.resumes = state.resumes.filter((resume) => resume.id !== resumeId);
  if (state.defaultResumeId === resumeId) state.defaultResumeId = null;
  await saveAndRender("Resume removed");
}
async function fileToBase64(file) {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary);
}
async function insertCommonFieldBelow(afterKey) {
  const profile = getSelectedProfile();
  if (!profile) return;
  const key = createId("customField");
  const newField = {
    key,
    label: "",
    value: "",
    description: getDefaultHelpForNewField(key),
    fieldType: "text"
  };
  if (!afterKey) {
    profile.commonFields.push(newField);
  } else {
    const idx = profile.commonFields.findIndex((f) => f.key === afterKey);
    if (idx === -1) profile.commonFields.push(newField);
    else profile.commonFields.splice(idx + 1, 0, newField);
  }
  profile.updatedAt = Date.now();
  await saveAndRender("Field inserted");
}
async function addGroup(groupType) {
  const profile = getSelectedProfile();
  if (!profile) return;
  const list = getGroupList(profile, groupType);
  const source = list[0];
  if (!source) return;
  const id = createId(groupType);
  const group = {
    id,
    name: `${groupType === "work" ? "Work history" : groupType === "education" ? "Education" : "Address"} #${list.length + 1}`,
    fields: source.fields.map((f) => ({ ...f, value: "" })),
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  setGroupList(profile, groupType, [...list, group]);
  profile.updatedAt = Date.now();
  await saveAndRender("Group added");
}
async function addFieldToGroups(groupType) {
  const profile = getSelectedProfile();
  if (!profile) return;
  const key = createId(`${groupType}Field`);
  const list = getGroupList(profile, groupType);
  const next = list.map((g) => ({
    ...g,
    updatedAt: Date.now(),
    fields: [...g.fields, { key, label: "", value: "", description: "", fieldType: "text" }]
  }));
  setGroupList(profile, groupType, next);
  profile.updatedAt = Date.now();
  await saveAndRender("Field label added to all groups");
}
async function addCommonQuestionField() {
  const profile = getSelectedProfile();
  if (!profile) return;
  const key = createId("question");
  profile.commonQuestions.push({ key, label: "", value: "", description: "", fieldType: "text" });
  profile.updatedAt = Date.now();
  await saveAndRender("Common question added");
}
async function createProfile() {
  const name = prompt("Profile name", "New Profile")?.trim();
  if (!name) return;
  const sourceDefaultId = state.defaultProfileId ?? state.profiles[0]?.id ?? null;
  const sourceDefault = state.profiles.find((p) => p.id === sourceDefaultId) ?? null;
  const now = Date.now();
  const clonedCommonFields = sourceDefault ? sourceDefault.commonFields.map((field) => ({ ...field })) : [];
  const clonedQuestions = sourceDefault ? sourceDefault.commonQuestions.map((field) => ({ ...field })) : [];
  const cloneGroups = (groups) => groups.map((g) => ({
    ...g,
    id: createId("group"),
    fields: g.fields.map((f) => ({ ...f, value: "" })),
    createdAt: now,
    updatedAt: now
  }));
  const profile = {
    id: createId("profile"),
    name,
    commonFields: clonedCommonFields,
    addressGroups: sourceDefault ? cloneGroups(sourceDefault.addressGroups) : [],
    workGroups: sourceDefault ? cloneGroups(sourceDefault.workGroups) : [],
    educationGroups: sourceDefault ? cloneGroups(sourceDefault.educationGroups) : [],
    commonQuestions: clonedQuestions,
    createdAt: now,
    updatedAt: now
  };
  state.profiles.push(profile);
  state.defaultProfileId = profile.id;
  await saveAndRender("Profile created");
}
async function duplicateProfile() {
  const profile = getSelectedProfile();
  if (!profile) return;
  const now = Date.now();
  const clone = {
    ...profile,
    id: createId("profile"),
    name: `${profile.name} Copy`,
    commonFields: profile.commonFields.map((field) => ({ ...field })),
    addressGroups: profile.addressGroups.map((g) => ({ ...g, id: createId("group"), fields: g.fields.map((f) => ({ ...f })) })),
    workGroups: profile.workGroups.map((g) => ({ ...g, id: createId("group"), fields: g.fields.map((f) => ({ ...f })) })),
    educationGroups: profile.educationGroups.map((g) => ({ ...g, id: createId("group"), fields: g.fields.map((f) => ({ ...f })) })),
    commonQuestions: profile.commonQuestions.map((field) => ({ ...field })),
    createdAt: now,
    updatedAt: now
  };
  state.profiles.push(clone);
  state.defaultProfileId = clone.id;
  await saveAndRender("Profile duplicated");
}
async function renameProfile() {
  const profile = getSelectedProfile();
  if (!profile) return;
  const name = prompt("New profile name", profile.name)?.trim();
  if (!name) return;
  profile.name = name;
  profile.updatedAt = Date.now();
  await saveAndRender("Profile renamed");
}
async function deleteProfile() {
  const profile = getSelectedProfile();
  if (!profile) return;
  if (state.profiles.length === 1) {
    setStatus("At least one profile is required");
    return;
  }
  state.profiles = state.profiles.filter((entry) => entry.id !== profile.id);
  if (state.defaultProfileId === profile.id) {
    state.defaultProfileId = state.profiles[0]?.id ?? null;
  }
  await saveAndRender("Profile deleted");
}
async function addResume() {
  const file = resumeFileInput.files?.[0];
  if (!file) {
    setStatus("Choose a file first");
    return;
  }
  const name = resumeNameInput.value.trim() || file.name;
  const dataBase64 = await fileToBase64(file);
  const resume = {
    id: createId("resume"),
    name,
    mimeType: file.type || "application/octet-stream",
    dataBase64,
    createdAt: Date.now()
  };
  state.resumes.push(resume);
  if (!state.defaultResumeId) state.defaultResumeId = resume.id;
  resumeNameInput.value = "";
  resumeFileInput.value = "";
  await saveAndRender("Resume stored");
}
function exportConfig() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "job-app-autofill-config.json";
  anchor.click();
  URL.revokeObjectURL(url);
  setStatus("Config exported");
}
async function importConfig() {
  const file = importFileInput.files?.[0];
  if (!file) {
    setStatus("Choose a JSON file first");
    return;
  }
  const text = await file.text();
  const parsed = JSON.parse(text);
  state = parsed;
  await saveAndRender("Config imported");
}
function makeInputCell(value, onCommit, title) {
  const cell = document.createElement("td");
  const input = document.createElement("input");
  input.type = "text";
  input.value = value;
  if (title) input.title = title;
  input.addEventListener("change", () => onCommit(input.value));
  cell.appendChild(input);
  return cell;
}
function makeTypedValueCell(field, value, onCommit, title) {
  const cell = document.createElement("td");
  const fieldType = field.fieldType ?? "text";
  if (fieldType === "date") {
    const wrap = document.createElement("div");
    wrap.className = "row";
    const dateParts = parseDateParts(value);
    const mm = document.createElement("input");
    mm.type = "text";
    mm.placeholder = "MM";
    mm.maxLength = 2;
    mm.value = dateParts.mm;
    mm.className = "datePart";
    const dd = document.createElement("input");
    dd.type = "text";
    dd.placeholder = "DD";
    dd.maxLength = 2;
    dd.value = dateParts.dd;
    dd.className = "datePart";
    const yyyy = document.createElement("input");
    yyyy.type = "text";
    yyyy.placeholder = "YYYY";
    yyyy.maxLength = 4;
    yyyy.value = dateParts.yyyy;
    yyyy.className = "datePartYear";
    const commit = () => onCommit(composeDateParts(mm.value, dd.value, yyyy.value));
    mm.addEventListener("change", commit);
    dd.addEventListener("change", commit);
    yyyy.addEventListener("change", commit);
    wrap.append(mm, dd, yyyy);
    if (title) wrap.title = title;
    cell.appendChild(wrap);
    return cell;
  }
  if (fieldType === "boolean") {
    const select = document.createElement("select");
    const normalized = normalizeBooleanString(value);
    select.appendChild(new Option("Yes / True", "yes"));
    select.appendChild(new Option("No / False", "no"));
    select.value = normalized;
    select.addEventListener("change", () => onCommit(select.value));
    if (title) select.title = title;
    cell.appendChild(select);
    return cell;
  }
  const input = document.createElement("input");
  input.type = fieldType === "email" ? "email" : fieldType === "phone" ? "tel" : fieldType === "number" ? "number" : fieldType === "url" ? "url" : "text";
  input.value = value;
  if (title) input.title = title;
  input.addEventListener("change", () => onCommit(input.value));
  if (fieldType === "dropdown") {
    return makeTextareaCell(
      value,
      onCommit,
      title ? `${title} (use ; to separate dropdown values)` : "Use ; to separate dropdown values"
    );
  }
  cell.appendChild(input);
  return cell;
}
function makeTextareaCell(value, onCommit, title) {
  const cell = document.createElement("td");
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.rows = 2;
  if (title) textarea.title = title;
  const autoGrow = () => {
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };
  textarea.addEventListener("focus", () => autoGrow());
  textarea.addEventListener("input", () => {
    if (document.activeElement === textarea) autoGrow();
  });
  textarea.addEventListener("blur", () => {
    textarea.style.height = "";
  });
  textarea.addEventListener("change", () => onCommit(textarea.value));
  cell.appendChild(textarea);
  return cell;
}
function parseDateParts(value) {
  const trimmed = value.trim();
  if (!trimmed) return { mm: "", dd: "", yyyy: "" };
  const iso = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (iso) return { mm: iso[2].padStart(2, "0"), dd: iso[3].padStart(2, "0"), yyyy: iso[1] };
  const slash = trimmed.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/);
  if (slash) return { mm: slash[1].padStart(2, "0"), dd: slash[2].padStart(2, "0"), yyyy: slash[3] };
  return { mm: "", dd: "", yyyy: "" };
}
function composeDateParts(mmRaw, ddRaw, yyyyRaw) {
  const mm = mmRaw.trim();
  const dd = ddRaw.trim();
  const yyyy = yyyyRaw.trim();
  if (!mm && !dd && !yyyy) return "";
  return `${mm.padStart(2, "0")}/${dd.padStart(2, "0")}/${yyyy}`;
}
function normalizeBooleanString(value) {
  const v = value.trim().toLowerCase();
  if (v === "no" || v === "false" || v === "0") return "no";
  return "yes";
}
function makeDragHandleCell(title) {
  const cell = document.createElement("td");
  const button = document.createElement("button");
  button.className = "dragHandle";
  button.type = "button";
  button.textContent = "\u22EE\u22EE";
  button.title = title;
  button.setAttribute("aria-label", title);
  cell.appendChild(button);
  return cell;
}
function makeSelectCell(options, selected, onChange) {
  const cell = document.createElement("td");
  const select = document.createElement("select");
  for (const option of options) {
    select.appendChild(new Option(option.label, option.value));
  }
  select.value = selected;
  select.addEventListener("change", () => onChange(select.value));
  cell.appendChild(select);
  return cell;
}
function makeIconButtonCell(icon, title, onClick) {
  const cell = document.createElement("td");
  const button = document.createElement("button");
  button.className = "iconBtn";
  button.textContent = icon;
  button.title = title;
  button.setAttribute("aria-label", title);
  button.addEventListener("click", onClick);
  cell.appendChild(button);
  return cell;
}
function makeInlineActionCell(actions) {
  const cell = document.createElement("td");
  const wrap = document.createElement("div");
  wrap.className = "row";
  for (const action of actions) {
    const btn = document.createElement("button");
    btn.className = "iconBtn";
    btn.textContent = action.icon;
    btn.title = action.title;
    btn.setAttribute("aria-label", action.title);
    btn.addEventListener("click", action.onClick);
    wrap.appendChild(btn);
  }
  cell.appendChild(wrap);
  return cell;
}
function wireRowDnD(tbody, onReorder) {
  let dragging = null;
  const rows = Array.from(tbody.querySelectorAll("tr"));
  for (const row of rows) {
    row.draggable = true;
    row.classList.add("draggableRow");
    row.addEventListener("dragstart", () => {
      dragging = row;
      row.classList.add("dragging");
    });
    row.addEventListener("dragover", (event) => {
      event.preventDefault();
      if (!dragging || dragging === row) return;
      const rect = row.getBoundingClientRect();
      const after = event.clientY > rect.top + rect.height / 2;
      tbody.insertBefore(dragging, after ? row.nextSibling : row);
    });
    row.addEventListener("drop", (event) => event.preventDefault());
    row.addEventListener("dragend", () => {
      row.classList.remove("dragging");
      dragging = null;
      const orderedKeys = Array.from(tbody.querySelectorAll("tr")).map((r) => r.dataset.fieldKey ?? "").filter(Boolean);
      onReorder(orderedKeys);
    });
  }
}
profileSelect.addEventListener("change", () => {
  state.defaultProfileId = profileSelect.value || null;
  void saveAndRender("Default profile updated");
});
newProfileBtn.addEventListener("click", () => void createProfile());
duplicateProfileBtn.addEventListener("click", () => void duplicateProfile());
renameProfileBtn.addEventListener("click", () => void renameProfile());
deleteProfileBtn.addEventListener("click", () => void deleteProfile());
addAddressFieldBtn.addEventListener("click", () => void addFieldToGroups("address"));
addWorkGroupBtn.addEventListener("click", () => void addGroup("work"));
addWorkFieldBtn.addEventListener("click", () => void addFieldToGroups("work"));
addEducationGroupBtn.addEventListener("click", () => void addGroup("education"));
addEducationFieldBtn.addEventListener("click", () => void addFieldToGroups("education"));
addCommonQuestionBtn.addEventListener("click", () => void addCommonQuestionField());
addResumeBtn.addEventListener("click", () => void addResume());
exportBtn.addEventListener("click", exportConfig);
importBtn.addEventListener("click", () => void importConfig());
async function init() {
  try {
    state = await getConfig();
    render();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load settings";
    setStatus(message);
  }
}
void init();
//# sourceMappingURL=options.js.map
