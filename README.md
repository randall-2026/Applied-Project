# Applied-Project
# Judgment Gym

A web-based decision training app that combats cognitive biases (overconfidence, hindsight bias) by enforcing a structured workflow: **document → commit → critique → reflect**.

Users lock in their prediction before seeing AI feedback, preventing retroactive editing. Over time, the analytics dashboard reveals patterns in judgment accuracy.

## Quick Start

```bash
npm create vite@latest judgment-gym -- --template react
cd judgment-gym
# Replace src/App.jsx with src/JudgmentGym.jsx
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## Project Structure

```
judgment-gym/
├── README.md
├── JudgmentGym.jsx        # Complete application source
├── JudgmentGym_Report.pptx
```

## Architecture

```
User → UI Module (React) → Decision Module (useReducer state machine)
                                 ├── AI Integration (critique generator)
                                 ├── Practice Module (multi-stage scenarios)
                                 └── Analytics Module (metrics engine)
```

**State flow:** `dispatch(action) → reducer → new state → re-render`

**Status machine:** `draft → committed → critiqued → reflected`

## Test Results

| Test Case | Description | Result |
|-----------|-------------|--------|
| TC-JG-01 | Commitment & field locking | **PASS** |
| TC-JG-02 | AI critique generation (4 perspectives) | **PASS** |
| TC-JG-03 | Outcome logging & reflection comparison | **PASS** |
