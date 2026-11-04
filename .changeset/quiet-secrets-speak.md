---
"@cloudflare/kumo": patch
---

SensitiveInput now shows `description` and `error` when there is no visible `label`, matching Input. The masked state also uses the consumer's `aria-label` for its accessible name instead of the generic "Sensitive value".
