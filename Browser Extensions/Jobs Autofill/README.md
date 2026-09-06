# Job App Autofill

**Autofill job applications with role-based profiles and resume selection—while stopping for manual review.**

Job App Autofill is a Safari Web Extension for macOS that helps job seekers fill repetitive application forms faster. Store your details once in locally saved profiles, then let a content script match and fill fields on job application pages. Unmatched or required fields are highlighted so you can review before continuing.

## What It Helps With


| Can do ✅                                                                  | Cannot do still ❌                                                                                                                      |
| ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Fill personal info (name, email, phone)                                   | First-class Google Chrome support *(planned)*                                                                                          |
| Fill professional details (title, company, years of experience)           | Reliable fill of async Workday / SPA widgets *(planned)*                                                                               |
| Fill location, address, LinkedIn, GitHub, and portfolio URLs              | Dedicated adapters for Lever, Ashby, Workable, Jobvite, SuccessFactors, Phenom, Eightfold, Rippling, JazzHR, BambooHR, ADP *(planned)* |
| Fill work eligibility, visa, salary, notice period, and relocation        | LinkedIn Easy Apply, Indeed, ZipRecruiter, Handshake, and custom career-site embeds *(planned)*                                        |
| Fill work history and education groups                                    | Stable session state across SPA / step changes *(planned)*                                                                             |
| Fill common ATS screening questions                                       | Clear handling of unknown widgets, captchas, e-sign, and cover-letter editors *(planned)*                                              |
| Attach a stored PDF, DOC, or DOCX resume                                  | Auto-detect questions and AI answer suggestions *(planned)*                                                                            |
| Dedicated adapters for Workday, Greenhouse, iCIMS, Taleo, SmartRecruiters | Auto-submit or apply on your behalf                                                                                                    |
| Pause for review and highlight skipped fields                             | Generate or upload cover letters                                                                                                       |
| Keep all profile and resume data on-device                                | Fill fields that have no matching profile value                                                                                        |


## Future Improvements

- [ ] **Chrome** — Ship a first-class Google Chrome package instead of Safari-only with unpacked Chromium loading.
- [ ] **Workday async** — Wait for late-loaded Workday widgets, comboboxes, and step content before filling.
- [ ] **More ATS sites** — Add adapters for Lever, Ashby, Workable, Jobvite, SuccessFactors, LinkedIn Easy Apply, Indeed, ZipRecruiter, Handshake, and similar hosts.
- [ ] **Page-change state** — Keep pause/resume context across SPA navigations, iframes, and multi-step flows.
- [ ] **Unknown UI** — Skip unsupported controls with a clear reason instead of failing the rest of the run.
- [ ] **AI suggestions** — Scan page questions and suggest answers from your profile data for you to review (never auto-submit).

## Key Features

- **Role-based profiles** — maintain separate application profiles (for example *SDE* and *AI Engineer*) and pick one per run from the popup.
- **Settings-driven configuration** — edit profiles, resumes, label matchers, and screening answers on the options page (`options.html`); changes are written immediately to `chrome.storage.local` under `jobAutofillConfig`.
- **Local browser storage** — profiles, resumes (Base64), and defaults live in extension storage only; export/import JSON from settings for backup. No backend or cloud sync.
- **Per-tab session orchestration** — a background service worker tracks each application tab in `jobAutofillSessions`, persists state across reloads, and coordinates the content script via runtime messages.
- **Multi-page flow handling** — on tab navigation (`tabs.onUpdated`), the session resets step counters and re-runs autofill on the new page; pause, resume, stop, and review modes are preserved until you stop or close the tab.
- **ATS-aware filling** — provider adapters for Workday, Greenhouse, iCIMS, Taleo, and SmartRecruiters detect the ATS and adapt field matching and step navigation.
- **Live status in the popup** — shows session state (`running`, `paused`, `waitingForNavigation`, `pausedForReview`, `error`, and more), detected provider, step name, filled/skipped counts, and lists of identified vs skipped fields.
- **On-page review cues** — skipped or unmatched fields get an amber outline (`job-autofill-needs-review`) on the page; the extension pauses for review and never auto-submits.

## How It Works

Save your profile once. On an application page, run autofill. The extension fills matches, highlights the rest, and leaves submit to you.

```mermaid
flowchart LR
  A["Save profile"] --> B["Open application"]
  B --> C["Run autofill"]
  C --> D["Review highlights"]
  D --> E["Submit yourself"]
```



## Installation (Safari on macOS)

This project is an **Xcode Safari Web Extension** consisting of a macOS host app (`Jobs Autofill`) and the web extension bundle (`Jobs Autofill Extension`).

### Requirements

- macOS
- Xcode
- Safari

### Steps

1. Open `Jobs Autofill.xcodeproj` in Xcode.
2. Select the **Jobs Autofill** scheme and run the app (`⌘R`).
3. In Safari, go to **Settings → Extensions** and enable **Job App Autofill**.
  - For local development builds, you may need to allow unsigned extensions in Safari’s Develop menu (**Develop → Allow Unsigned Extensions**).
4. Optionally launch the host app again and use **Quit and Open Safari Extensions Preferences…** to jump directly to extension settings.

Grant the extension permission on job application sites when Safari prompts you.

### Chrome / Chromium (development)

The extension uses **Manifest V3** with standard APIs (`storage`, `tabs`, `scripting`, `content_scripts`, `service_worker`). For development, Chrome (or another Chromium browser) can load the unpacked folder:

1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** and select `Jobs Autofill Extension/Resources/`

This repository is packaged and tested as a Safari Web Extension. Chrome loading is for development only.

## Privacy

- Profile data, resumes (stored as Base64), and session state are kept in **local browser storage** (`chrome.storage.local`).
- The extension does **not** upload your data to any backend, cloud service, or third-party API.
- Resumes and configuration remain on your machine inside the extension’s storage.
- Exported JSON backups contain the same personal data and resume files. Treat them as sensitive and do not commit them to git.

## Project Structure

```
Jobs Autofill/                    # macOS host app (Swift)
├── AppDelegate.swift
├── ViewController.swift          # Extension enablement UI
└── Resources/                    # Host app HTML/CSS

Jobs Autofill Extension/          # Safari Web Extension
├── SafariWebExtensionHandler.swift
└── Resources/
    ├── manifest.json
    ├── background.js             # Session orchestration
    ├── content.js                # DOM scanning & autofill
    ├── popup.html / popup.js     # Popup UI & controls
    ├── options.html / options.js # Settings & profile management
    ├── images/                   # Toolbar and store icons
    └── _locales/

Jobs Autofill.xcodeproj           # Xcode project
```

## Supported Sites

Host permissions and provider adapters are configured for:

- `*.myworkdayjobs.com`
- `*.greenhouse.io`
- `*.icims.com`
- `*.taleo.net`
- `*.smartrecruiters.com`
- Other `https://` sites via the generic adapter

Field matching quality varies by site and form structure. Always review filled values before submitting an application.

## License

This is a personal project by Tarun Singh. The repository is public for showcase purposes only.

All rights reserved. You may view the code, but you may not copy, modify, distribute, or use it without explicit permission.