# ADR 001: Adoption of "Sentient Focus" Architecture

## Status
Accepted

## Context
The current "Simple Focus Mode" extension is based on a "Static Blocking" paradigm (Regex/Domain lists) and uses a dated flat UI. The technical landscape has shifted with the introduction of Chrome's on-device AI (Gemini Nano) via `window.ai`.

We need to decide whether to:
1.  Maintain the simple, lightweight regex-based blocker.
2.  Evolve into a context-aware AI agent that runs locally.

## Decision
We will adopt the **"Sentient Focus" (2026 Vision)** architecture.

This entails:
1.  **AI-First Core**: Leveraging `window.ai` (Gemini Nano) as the primary engine for future blocking decisions (classifying context vs. content).
2.  **Privacy-Absolute**: All inference must happen ON-DEVICE. No data leaves the browser. This is a hard constraint.
3.  **Modern Aesthetics**: Adoption of "Liquid Calm" (Glassmorphism) design language to build trust and reduce cognitive load.
4.  **Graceful Degradation**: The extension must function as a "Classic" timer if AI hardware is unavailable.

## Consequences
*   **Positive**:
    *   Significant competitive advantage over cloud-based or static blockers.
    *   Aligns with "Privacy-First" branding.
    *   Improved user retention via modern UI.
*   **Negative**:
    *   Increased complexity in `options.js` to handle AI capability checks.
    *   Potential performance overhead if not managed correctly (must use Web Workers or careful async handling for AI).
    *   Browser compatibility limited to Chrome instances with Gemini Nano enabled (for AI features), requiring robust fallback logic.

## Compliance
*   All new UI changes must reference the Glassmorphism CSS variables.
*   All AI features must check `await window.ai.languageModel.capabilities()` before execution.
