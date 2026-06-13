# Known Issues Log

| ID | Issue | Severity | Impact | Current Status | Planned Action |
|---|---|---:|---|---|---|
| KI-001 | Application state is in-memory only. | Medium | User data is lost when the page refreshes. | Open | Add localStorage or backend persistence in a later sprint. |
| KI-002 | AI critique is simulated rather than connected to a live LLM API. | Medium | Feedback is deterministic and limited compared with a production AI service. | Open | Replace simulated critique generator with API integration when credentials and backend security are available. |
| KI-003 | No formal automated test suite is included yet. | Medium | Regression risk increases as the prototype grows. | Open | Add unit tests for workflow transitions and smoke tests for app startup. |
| KI-004 | Single-file implementation may become difficult to maintain as features expand. | Low | Future changes could become harder to isolate. | Open | Decompose into components, services, state, and data folders in later sprint. |
| KI-005 | No backend authentication or user account model is implemented. | Low | Prototype supports workflow validation but not multi-user production usage. | Deferred | Add authentication only if the project scope expands beyond prototype validation. |
| KI-006 | Baseline screenshots and terminal output must be kept up to date. | Low | Submission evidence may become stale if app setup changes. | Open | Refresh smoke-test output whenever setup commands change. |
