# Risk and Issue Log

| ID | Risk / Issue | Severity | Mitigation Action | Owner | Status |
|---|---|---:|---|---|---|
| R-001 | Repo structure may not match a production React app because the prototype is currently single-file. | Medium | Document the current structure honestly and add a future decomposition plan. | Yu Huai | Mitigated |
| R-002 | AI critique currently uses simulated local behavior, not a real API. | Medium | Treat the simulated critique as a baseline stub and document future API replacement path. | Yu Huai | Open |
| R-003 | No persistent data storage in the current client-side prototype. | Medium | Add localStorage first; consider backend persistence only if required by scope. | Yu Huai | Open |
| R-004 | Lack of automated tests could make future changes fragile. | Medium | Add unit tests for decision status transitions and a startup smoke test. | Yu Huai | Open |
| R-005 | API keys could be exposed if future LLM integration is added directly in the browser. | High | Do not place secrets in client-side code. Use backend proxy or environment-managed server function for real API calls. | Yu Huai | Open |
| R-006 | Scope creep could shift the project from decision-training prototype to a full production platform. | Medium | Keep next sprint focused on persistence, testing, and documentation rather than new feature expansion. | Yu Huai | Mitigated |
| R-007 | Manual smoke-test evidence could become outdated after code changes. | Low | Re-run startup command and update `docs/smoke-test-output.txt` after major changes. | Yu Huai | Open |
| R-008 | Single-file architecture may reduce readability as the app grows. | Low | Split into components and services if the file becomes difficult to maintain. | Yu Huai | Deferred |
