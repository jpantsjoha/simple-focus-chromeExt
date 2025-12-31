# Changelog

## v0.4.0 (Phase 1: Modernization) - 2026-01-01

### ✨ New Features
*   **"Liquid Calm" UI**: Complete visual overhaul using Glassmorphism (`backdrop-filter: blur`), CSS variables, and Inter typography.
*   **Zone In**: Right-click context menu to start a Focus Session immediately from any page.
*   **One More Minute**: New button (+1m) in the active timer view to extend sessions by 60s.
*   **AI Readiness**: Options page now displays the status of Chrome's built-in Gemini Nano (`window.ai`).

### 🛠 Improvements
*   **Theme Auto-Sync**: Removed manual toggle; extension now respects system dark/light mode preference automatically (via CSS media queries).
*   **Unit Tests**: Added Jest test suite for timer logic integrity.

### 🔒 Security & Privacy
*   Added `contextMenus` permission.
*   No external data calls; AI checks are local-only.