# AuditMaster Pro

A product concept for audit management: engagement tracking, findings,
evidence and reporting.

A self-contained static page. No build step and no backend.

---

Built by Michael A. Thom, MAT Solutions, Guyana. <https://matsolutions.gy>

## Demonstration boundary

The seed checks, severities and timelines are illustrative, not an approved
compliance checklist or verified regulatory guidance. A review tick is not a
compliance decision. Selections last only for this page session; no audit record
or evidence is saved.

## Development tests

Optional DOM checks use Node 24: `npm ci --ignore-scripts && npm test`.
The page has no runtime build step or backend. Tests cover search, keyboard focus,
expansion state, progress semantics and the demonstration notice. Native visual and
screen-reader verification are still required before release.
