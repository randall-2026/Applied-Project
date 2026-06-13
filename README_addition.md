# Suggested README Addition

You can paste the following section into your existing `README.md`.

## Build Phase Baseline

This repository represents the build-phase baseline for Judgment Gym. The current implementation is a single-file React prototype centered on `JudgmentGym.jsx`.

### Baseline Scope

The baseline includes:

- A runnable React application shell.
- Decision creation and commitment workflow.
- Locking behavior after decision commitment.
- Simulated adversarial AI critique.
- Outcome logging and reflection.
- Basic analytics and practice scenario functionality.
- Documentation for architecture, risks, known issues, and changelog.

### How to Run

Create a Vite React project:

```bash
npm create vite@latest judgment-gym -- --template react
cd judgment-gym
npm install
```

Replace the generated `src/App.jsx` file with the contents of `JudgmentGym.jsx`.

Run the app:

```bash
npm run dev
```

Open the local URL shown in the terminal, usually:

```text
http://localhost:5173
```

### Baseline Tag

Recommended baseline tag:

```bash
git tag v0.1.0-baseline
git push origin v0.1.0-baseline
```

### Documentation Files

- `ARCHITECTURE.md` describes the current technical architecture.
- `CHANGELOG.md` records baseline changes.
- `KNOWN_ISSUES.md` tracks current limitations.
- `RISK_LOG.md` tracks project risks and mitigations.
- `docs/BASELINE_CHECKIN.md` summarizes the build-phase check-in.
- `docs/smoke-test-output.txt` stores smoke-test evidence.
