# Phase 1: Foundation & "Liquid Calm" Aesthetic

> **Objective**: Establish the "Premium" look and feel (Glassmorphism), implement quick-win functionality features, and prepare the "AI Readiness" infrastructure.
> **Philosophy**: "Polish first, then Intelligence." A smart extension that looks ugly is not trusted. A beautiful extension earns the right to be smart.

---

## 1. Conflict Analysis: Low vs. Medium Effort
**Question**: Will implementing "Low Effort" items (Polish) cause rework when we tackle "Medium Effort" (Features)?

**Verdict**: **NO.** The items are complementary, not conflicting.
*   **UI Foundation**: The **Glassmorphism (Low)** creates the *container* and visual language. The **Breathing UI (Medium)** adds *animation* to that existing container. Building the glass effect now saves time later.
*   **Theming**: **Auto-Sync (Low)** is a prerequisite for a seamless experience. It doesn't conflict with future UI complexity.
*   **Notifications**: **Polite Notifications (Low)** sets the *rules* (silence). **Smart Suggestions (Medium)** defines the *content*. You need the rules before the content.
*   **AI**: Adding the **AI Status Check (Low/New)** is strictly additive and necessary before we try to build complex Smart Shields.

**Conclusion**: We can safely proceed with ALL 5 Low-Effort items + AI Status Check without fear of wasted work.

---

## 2. Phase 1 Scope (The "Quick Wins" + AI Prep)

### Feature Set
1.  **Glassmorphism UI**: Replace flat colors with backdrop-blur, semi-transparent layers, and modern typography (Inter).
2.  **Theme Auto-Sync**: Remove manual toggle; bind to `prefers-color-scheme`.
3.  **"One More Minute"**: Add a button to the active timer state to extend session by 60s.
4.  **Right-Click "Zone In"**: Add Context Menu item to start timer immediately.
5.  **Polite Notifications**: Implementation of `silent` flag for notifications.
6.  **AI Readiness Indicator**: New section in Options page to test `window.ai` availability.

### [COMPLETE] Definition of Done (DoD)
*   [x] **Code**: Implemented cleaner, modular CSS variables and functional logic.
*   [x] **Tests**: 
    *   [x] Unit tests for new timer logic ("One More Minute").
    *   [x] E2E test for Context Menu appears.
    *   [x] Manual verification of Glassmorphism (Screenshots).
    *   [x] **Regression**: Full pass of existing test suite.
*   [x] **Docs**: 
    *   [x] Updated `README.md` with new screenshots and features.
    *   [x] Updated `Doc/Marketing.md` (Changelog) with release notes.
    *   [x] Updated `Doc/2026_Vision_and_Roadmap.md` to mark Phase 1 items as Complete.
*   [x] **Release**:
    *   [x] Pull Request raised and merged to `main`.
    *   [x] Incremental Git Tag created (e.g., `v0.4.0`).
    *   [x] GitHub Release created with artifacts.
*   [x] **ADR**: Architecture Decision Record created and finalized.

---

## 3. Execution Plan

### [COMPLETE] Step 1: Project Structure & Clean-up
*   Create `Doc/ADR` folder.
*   Create `Doc/phases` folder.
*   Verify `manifest.json` permissions for Context Menus.

### [COMPLETE] Step 2: Visual Overhaul (CSS)
*   Refactor `popup.css` and `options.css` to use CSS Variables for "Glass" values (`--glass-bg`, `--glass-border`, `--blur-amt`).
*   Implement `backdrop-filter: blur(10px)`.

### [COMPLETE] Step 3: Logic Enhancements (JS)
*   **Extension**: updates `background.js` to handle `chrome.contextMenus`.
*   **Timer**: update `popup.js` to handle "+1 Min" button event.

### [COMPLETE] Step 4: AI Status Check
*   Update `options.html` to include a "System Capabilities" footer.
*   Update `options.js` to run `window.ai ? "Available" : "Not Found"` check (graceful degradation).

---

## 4. Tracked Issues (To Be Created)
*   [ ] Feature: Implement Glassmorphism UI & Theme Sync
*   [ ] Feature: Add "One More Minute" & Context Menu
*   [ ] Task: Add AI Capability Check to Options Page
