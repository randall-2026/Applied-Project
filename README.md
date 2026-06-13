# Judgment Gym

Judgment Gym is a web-based decision training application designed to help users improve decision quality through structured practice, commitment, adversarial critique, and reflection.

The application combats common decision-making problems such as overconfidence bias, hindsight bias, and lack of structured feedback. Users document a decision, commit to a prediction, receive critique only after commitment, and later compare the expected outcome with the actual outcome.

## Project Purpose

Most people make important decisions without a reliable feedback loop. They may remember outcomes incorrectly, revise their original reasoning after the fact, or fail to track whether their confidence was justified.

Judgment Gym addresses this by enforcing a structured workflow:

```text
document → commit → critique → reflect
```

The core idea is that users must lock in their prediction before receiving feedback. This prevents retroactive editing and supports honest reflection over time.

## Current Baseline

This repository currently contains a single-file React prototype. The project is intentionally lightweight for the build-phase baseline, but it already demonstrates the main user workflow.

Current main files:

```text
Applied-Project/
├── JudgmentGym.jsx              # Complete React application source
├── JudgmentGym_Report.pptx      # Project report / presentation artifact
└── README.md                    # Project overview and setup instructions
```

Supporting documentation files for the build-phase package:

```text
Applied-Project/
├── ARCHITECTURE.md
├── CHANGELOG.md
├── KNOWN_ISSUES.md
├── RISK_LOG.md
└── docs/
    ├── BASELINE_CHECKIN.md
    └── smoke-test-output.txt
```

## Features

* Create structured decision entries.
* Record decision context, options, selected choice, confidence level, and expected outcome.
* Commit decisions before receiving feedback.
* Lock committed decision fields to reduce hindsight bias.
* Generate simulated adversarial critique from multiple perspectives.
* Log actual outcomes and lessons learned.
* Compare expected outcomes with actual outcomes.
* View basic analytics for decision history.
* Practice with multi-stage decision scenarios.

## Architecture

The current implementation is a client-side React application. It does not require a backend server or external database for the baseline prototype.

Although the implementation is contained in `JudgmentGym.jsx`, it follows a logical modular structure:

```text
User
  → UI Module
  → Decision Module
      → AI Critique Module
      → Practice Module
      → Analytics Module
```

The decision workflow follows this state machine:

```text
draft → committed → critiqued → reflected
```

Once a decision moves out of the draft state, the committed fields are locked.

## Technology Stack

| Layer               | Technology                           |
| ------------------- | ------------------------------------ |
| Frontend            | React                                |
| Starter Environment | Vite React project                   |
| State Management    | React state / reducer-style workflow |
| Styling             | In-component styling                 |
| AI Integration      | Simulated local critique generator   |
| Data Storage        | In-memory browser session state      |

## Quick Start

Create a new Vite React project:

```bash
npm create vite@latest judgment-gym -- --template react
cd judgment-gym
npm install
```

Copy the contents of `JudgmentGym.jsx` from this repository into the generated file:

```text
src/App.jsx
```

Then run the development server:

```bash
npm run dev
```

Open the local URL shown in the terminal. It is usually:

```text
http://localhost:5173
```

## Minimal Smoke Test

After starting the application, verify the following baseline behavior:

1. The Judgment Gym interface loads successfully.
2. A user can create a new decision.
3. A user can enter options, select a choice, set confidence, and enter an expected outcome.
4. A user can commit the decision.
5. The committed fields become locked.
6. A user can request critique.
7. The simulated critique appears.
8. A user can log an actual outcome and reflection.
9. The analytics view updates.

## Test Results

| Test Case | Description                                   | Result |
| --------- | --------------------------------------------- | ------ |
| TC-JG-01  | Decision commitment and field locking         | PASS   |
| TC-JG-02  | AI critique generation with four perspectives | PASS   |
| TC-JG-03  | Outcome logging and reflection comparison     | PASS   |

## API Baseline

The current baseline does not call an external API. The AI critique behavior is simulated locally so that the application remains runnable without API keys, credentials, or network dependencies.

A future version may replace the simulated critique generator with a real LLM API integration. API keys should not be stored in client-side code.

## Known Limitations

* Data is stored only during the active browser session.
* No backend persistence is implemented yet.
* AI critique is simulated rather than connected to a real LLM service.
* Automated tests are not yet included.
* The prototype is currently implemented as a single JSX file.

## Next Sprint Targets

The next sprint should focus on engineering reliability rather than adding many new features:

1. Add local persistence using `localStorage`.
2. Add automated tests for decision state transitions.
3. Split the single JSX file into smaller components if needed.
4. Add or update smoke-test screenshots and terminal output.
5. Keep the risk log and known-issues log current.

## Recommended Baseline Tag

After the baseline files are committed, create a Git tag:

```bash
git tag v0.1.0-baseline
git push origin v0.1.0-baseline
```

## Project Status

Build-phase baseline established. The current artifact is runnable as a React prototype and demonstrates the minimum technical path for the Judgment Gym decision-training workflow.
