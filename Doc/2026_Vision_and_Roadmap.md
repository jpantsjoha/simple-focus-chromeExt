# Simple Focus: 2026 Vision & Roadmap

> **Target Date**: January 1, 2026
> **Objective**: Transform "Simple Focus" from a basic utility into a "Sentient" Productivity Companion that leverages Edge AI to understand *why* you are focusing, not just *when*.

---

## 1. Executive Summary: The "Sentient Focus" Shift
The current "Simple Focus Mode" (v0.3.1) is a functional, privacy-respecting Pomodoro timer. However, in the landscape of 2026, "blocking sites" via a static list is archaic. The future of productivity is **Context-Aware Intent**.

Run-of-the-mill extensions block "YouTube.com" entirely. A 2026 AI-native extension understands that watching a *tutorial* on YouTube is productive, but watching *cat videos* is distraction.

By leveraging **Chrome's on-device Gemini Nano**, we can build the first **Privacy-First, Context-Aware Focus Tool** that incurs zero server costs and leaks zero user data.

---

## 2. Critical Re-evaluation (2024 State)

| Aspect | Current Status | Verdict for 2026 |
| :--- | :--- | :--- |
| **Logic** | Static Rule Sets (RegEx/Domains) | **Obsolete**. Needs Semantic understanding. |
| **UI/UX** | Basic HTML/CSS, Flat Design | **Dated**. Needs Glassmorphism, Fluid Motion, "Alive" feel. |
| **Privacy** | High (Local Storage) | **Maintain**. This is our competitive edge against cloud-AI apps. |
| **Features** | Timer + Blocklist | **Insufficient**. Needs NLP Task Entry, Smart Interventions. |
| **Perf** | Lightweight | **Excellent**. Must preserve this speed while adding AI. |

**Critical Feedback**: The current extension is "too simple". It competes with a sticky note. To dominate in 2026, it must actively *help* the user focus, not just punish them for clicking links.

---

## 3. 2026 Vision: "Aesthetics & Intelligence"

### 3.1 Design Philosophy: "Liquid Calm"
The 2026 aesthetic is not just "Dark Mode". It is **Fluid, Organic, and Haptic**.
*   **Glassmorphism 3.0**: Frosted, multi-layered backgrounds that blur the browser content behind them, grounding the extension in the user's current context.
*   **Micro-Interactions**: The timer shouldn't just "tick". It should *breathe*. A subtle pulsing glow that matches a slow breathing rhythm (4-7-8 technique) to subconsciously calm the user.
*   **Typography**: Move to variable fonts (Inter/Roboto Flex) that adjust weight dynamically based on urgency.

### 3.2 Core Intelligence: "Gemini at the Edge"
Using the `window.ai` (Prompt API), the extension becomes an active participant.
*   **Intent Parsing**: User types "Deep work on Q3 Report". AI parses -> *45 min timer, Block Socials + News, Allow Google Sheets & Corporate Intranet*.
*   **Content Classification**: If users stray to a blocked domain, the AI scans the *content* (not just URL). If the content aligns with the "Q3 Report" goal, it silently allows it. If it's unrelated, it gently intervenes.

---

## 4. Competitor Landscape (2025/2026)
*   **Otto/Forest**: Heavily gamified. Good for students, distracting for professionals.
    *   *Our Edge*: **Professional Minimalism**. No avatars, no virtual trees. Just flow.
*   **Rize/Opal**: Heavy AI, but often Cloud-based/Subscription heavy.
    *   *Our Edge*: **100% On-Device, Free/One-time**. We use Chrome's *free* local inference.
*   **Focus To-Do**: Feature bloat (Tasks, Calendar, Projects).
    *   *Our Edge*: **Input-less Operation**. We don't want to be your Jira. We just want to guard your attention.

---

## 5. 2026 Improvements Roadmap

### 🔴 High Effort / High Impact
*These define the "2.0" upgrade.*

1.  **Context-Aware "Smart Shield" (Gemini Nano)**
    *   *Concept*: Instead of `block *youtube.com*`, use `window.ai` to classify the current page title/content against the user's stated goal.
    *   *Value*: Eliminates false positives. Allows research while blocking procrastination.
2.  **Natural Language "Focus Intent" Entry**
    *   *Concept*: Replace number inputs with a text box. "Focus for 20m on fixing the navbar bug". AI configures time, strictness, and even suggests breaking it down.
    *   *Value*: Low friction. Captures *what* the user is doing for historical analysis.
3.  **"Flow State" Bio-Adaptive Timer**
    *   *Concept*: If the user is active (scrolling, typing) when the timer hits 0, *don't ring*. Wait for a pause in activity to gently suggest a break.
    *   *Value*: Prevents the tool from breaking the very focus it protects.
4.  **Local "Distraction Summary"**
    *   *Concept*: When a user tries to visit a blocked site, AI generates a 1-sentence "FOMO Killer" summary of that page (e.g., "Just another clickbait article about X") to discourage them.
    *   *Value*: Cognitive behavioral intervention.
5.  **Voice-First Control (Web Speech API + Gemini)**
    *   *Concept*: "Hey Focus, give me 15 minutes." No clicks required.
    *   *Value*: Accessibility and speed.

### 🟡 Medium Effort / High Impact
*Significant UX upgrades that require moderate coding.*

1.  **"Breathing" UI (CSS/Canvas)**
    *   *Concept*: Replace the static countdown with a subtle, rhythmic glowing background that guides breathing patterns.
    *   *Value*: Reduces anxiety, promotes physiological focus.
2.  **Smart Break Suggestions**
    *   *Concept*: Use Chrome Activity APIs to suggest *types* of breaks. "You've been typing for 40m, try stretching" vs "You've been reading, close your eyes."
    *   *Value*: Healthier work habits.
3.  **Haptic/Audio Soundscapes**
    *   *Concept*: Generative or looped Brown Noise / Binaural Beats that auto-play during focus.
    *   *Value*: Instant environment control.
4.  **"Day Recall" Summarization**
    *   *Concept*: Use local history (stored securely) to generate a bullet-point summary of what was achieved during focus sessions using GenAI.
    *   *Value*: Automated daily stand-up prep.
5.  **Task-Specific Blocklists**
    *   *Concept*: Presets for "Coding" (Allow StackOverflow, GitHub), "Writing" (Block everything but Google Docs), "Design" (Allow Dribbble/Figma).
    *   *Value*: Granular control.

### 🟢 Low Effort / High Impact
*Quick wins for immediate polish.*

1.  **Glassmorphism UI Overhaul**
    *   *Concept*: Update `popup.css` with `backdrop-filter: blur()`, semi-transparent backgrounds, and soft shadows.
    *   *Value*: Instant "Premium" feel.
2.  **Polite Notifications**
    *   *Concept*: Notifications that don't play sound if media is playing, or use the Notification API's "silent" priority.
    *   *Value*: Respect.
3.  **Right-Click "Zone In"**
    *   *Concept*: Context menu item "Start Focus Session" on any page.
    *   *Value*: Immediacy.
4.  **Dark/Light Mode Auto-Sync**
    *   *Concept*: Ensure extension theme perfectly matches system theme (macOS) without a toggle.
    *   *Value*: Seamless integration.
5.  **"One More Minute" Button**
    *   *Concept*: A friction-free way to extend a session by 1 minute without breaking flow to reset a timer.
    *   *Value*: Flexibility.

---

## 6. Implementation Strategy (Next Steps)
1.  **Prototype**: Create a branch `feat/smart-shield-poc`.
2.  **Experiment**: Use `PromptKeeper` code as a reference to implement a simple `window.ai` call that summarizes the current tab title.
3.  **Design**: Create a Figma mock (or `generate_image`) for the Glassmorphism UI.
