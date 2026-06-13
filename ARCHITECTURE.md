# Judgment Gym Architecture Notes

## 1. Project Overview

Judgment Gym is a web-based decision training prototype. The application helps users document decisions, commit to predictions before receiving feedback, request adversarial critique, log actual outcomes, and review decision-quality metrics.

The current implementation is intentionally lightweight: a single-file React prototype centered on `JudgmentGym.jsx`. The goal of this baseline is to prove that the core workflow is runnable before expanding into a larger production-style folder structure.

## 2. Repository Structure

```text
Applied-Project/
├── JudgmentGym.jsx
├── JudgmentGym_Report.pptx
├── README.md
├── ARCHITECTURE.md
├── CHANGELOG.md
├── KNOWN_ISSUES.md
├── RISK_LOG.md
└── docs/
    ├── BASELINE_CHECKIN.md
    └── smoke-test-output.txt
```

## 3. Runtime Architecture

The prototype runs as a client-side React application. It can be placed into a Vite React starter project by replacing `src/App.jsx` with the contents of `JudgmentGym.jsx`.

The application does not currently require a backend server or external database. Application state is held in React state during the active browser session.

## 4. Logical Modules

Although the current project is implemented as a single JSX file, it contains the following logical modules:

| Module | Responsibility |
|---|---|
| UI Module | Renders the application views, forms, buttons, navigation, cards, and workflow status indicators. |
| Decision Module | Manages decision creation, commitment, locking, critique, outcome logging, and reflection. |
| AI Critique Module | Generates simulated multi-perspective critique. This is currently local/mock behavior rather than a live external API call. |
| Practice Module | Provides structured practice scenarios and records user choices across stages. |
| Analytics Module | Summarizes decision history and displays calibration-oriented metrics. |

## 5. State Management

The baseline implementation uses React state management. The important design principle is that the decision workflow follows a controlled sequence:

```text
draft → committed → critiqued → reflected
```

Once a decision is committed, the committed fields should not be edited. This supports the anti-hindsight-bias goal of the project.

## 6. Data Flow

```text
User action
  → React event handler
  → state update / workflow transition
  → UI re-render
  → updated decision, critique, reflection, or analytics view
```

For the current baseline, all data remains local to the running application session.

## 7. API and Integration Baseline

No production API integration is required for the current baseline. The AI critique path is implemented as a simulated/local critique generator. This gives the project a runnable technical path without requiring API keys, network calls, or paid services.

Future versions may replace the simulated critique function with a real LLM API call. That future change should preserve the same high-level interface: decision context, options, selected option, confidence, and expected outcome in; structured critique out.

## 8. Future Decomposition Plan

If the project grows beyond the single-file prototype, the recommended structure is:

```text
src/
├── components/
├── data/
├── services/
├── state/
├── styles/
└── App.jsx
```

This decomposition is not required for the current baseline, but it provides a clear path for later sprints.
