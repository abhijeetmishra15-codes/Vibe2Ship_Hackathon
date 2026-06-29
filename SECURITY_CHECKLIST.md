# 🔐 Complete Website Security Checklist — Pre-Production

> Use this checklist before every production deployment. Check off each item, and document any findings in the Notes column. Aim for 100% before going live.

---

## How to Use This File

- `[ ]` = Not checked yet
- `[x]` = Passed / Fixed
- `[!]` = Issue found — document and resolve before launch
- Add notes inline using `<!-- note here -->` or in a separate `FINDINGS.md`

---

## 1. 🔑 Authentication & Authorization

### Authentication
- [ ] Passwords are hashed using a strong algorithm (bcrypt, Argon2, scrypt) — **never MD5/SHA1**
- [ ] Minimum password length enforced (≥ 12 characters recommended)
- [ ] Password complexity rules in place
- [ ] Rate limiting applied on login endpoints (e.g., max 5 attempts, then lockout/CAPTCHA)
- [ ] Account lockout mechanism after repeated failed logins
- [ ] "Forgot password" flow uses time-limited, single-use tokens (≥ 32 bytes, expires in 15–60 min)
- [ ] Password reset tokens are invalidated after use
- [ ] Multi-Factor Authentication (MFA/2FA) is available and enforced for admin/privileged accounts
- [ ] Login pages served over HTTPS only
- [ ] No usernames or passwords exposed in URL query strings or server logs

### Session Management
- [ ] Session tokens are cryptographically random and sufficiently long (≥ 128 bits)
- [ ] Sessions are invalidated on logout
- [ ] Sessions expire after inactivity (e.g., 15–30 min for sensitive apps)
- [ ] Absolute session expiry set (e.g., max 8–24 hours regardless of activity)
- [ ] Session token is regenerated after login (prevents session fixation)
- [ ] Session cookies use `HttpOnly`, `Secure`, and `SameSite=Strict` or `Lax` flags
- [ ] Session IDs are never exposed in URLs or logs

### Authorization
- [ ] Role-Based Access Control (RBAC) or equivalent is implemented
- [ ] Principle of Least Privilege enforced — users only access what they need
- [ ] Every API route/endpoint checks authorization, not just the UI
- [ ] Horizontal privilege escalation tested (can User A access User B's data?)
- [ ] Vertical privilege escalation tested (can a regular user access admin functions?)
- [ ] Admin panel is protected and not publicly discoverable (`/admin`, `/dashboard`)
- [ ] No security decisions are made purely client-side (JavaScript)

---

## 2. 🛡️ Injection & Input Validation

### SQL Injection
- [ ] All database queries use parameterized statements or prepared statements
- [ ] No raw SQL string concatenation with user input anywhere in the codebase
- [ ] ORM is used and raw query escapes are reviewed where needed
- [ ] Database error messages are not exposed to users (no stack traces in responses)
- [ ] Stored procedures are reviewed for injection risks

### Cross-Site Scripting (XSS)
- [ ] All user-generated content is HTML-escaped before rendering
- [ ] No `innerHTML`, `document.write()`, or `eval()` with untrusted data
- [ ] Content Security Policy (CSP) header is configured (see Section 5)
- [ ] Rich text editors sanitize HTML on the server side (e.g., DOMPurify, bleach)
- [ ] DOM-based XSS reviewed for sources like `location.hash`, `document.referrer`
- [ ] Template engines use auto-escaping by default

### Command Injection
- [ ] No shell commands built from user input (`exec`, `system`, `popen`, etc.)
- [ ] If OS commands are needed, arguments are passed as arrays — never as strings
- [ ] File paths constructed from user input are validated and sandboxed

### Other Injection
- [ ] LDAP injection: Inputs are escaped if LDAP queries are used
- [ ] NoSQL injection: MongoDB operators (`$where`, `$gt`) not injectable via user input
- [ ] XML/XPath injection: User input is not inserted into XML/XPath expressions
- [ ] Template injection: Server-side template engines do not render user-supplied templates
- [ ] Header injection: HTTP response headers are not built from unvalidated user input

### General Input Validation
- [ ] All inputs validated on the server side (client-side validation is UX only)
- [ ] Input length limits enforced
- [ ] Allowed character sets (whitelists) used where possible
- [ ] File uploads validated by MIME type and extension — stored outside web root
- [ ] Uploaded files are scanned for malware or renamed to prevent execution
- [ ] JSON/XML payloads have a size limit to prevent DoS

---

## 3. 🌐 Cross-Site Request Forgery (CSRF)

- [ ] CSRF tokens are generated per-session or per-request for all state-changing operations
- [ ] CSRF tokens are validated server-side on every POST/PUT/PATCH/DELETE request
- [ ] `SameSite=Strict` or `SameSite=Lax` cookie attribute is set (adds CSRF protection)
- [ ] API endpoints using JSON-only accept `Content-Type: application/json` (mitigates simple CSRF)
- [ ] `Origin` and `Referer` headers checked on sensitive endpoints as a secondary defense
- [ ] No state-changing actions triggered by GET requests

---

## 4. 🔒 Transport Layer Security (HTTPS / TLS)

- [ ] All traffic is served over HTTPS — HTTP redirects to HTTPS (301)
- [ ] TLS 1.2 and 1.3 are enabled; TLS 1.0 and 1.1 are disabled
- [ ] SSL/TLS certificate is valid and issued by a trusted CA
- [ ] Certificate expiry is monitored and auto-renewed (e.g., Let's Encrypt + certbot)
- [ ] Weak cipher suites are disabled (RC4, DES, 3DES, EXPORT ciphers)
- [ ] Forward Secrecy (ECDHE/DHE) cipher suites are preferred
- [ ] HTTP Strict Transport Security (HSTS) header is set with `max-age ≥ 31536000`
- [ ] HSTS `includeSubDomains` and `preload` considered if all subdomains use HTTPS
- [ ] Mixed content (HTTP resources on HTTPS pages) eliminated
- [ ] Verify with: [SSL Labs](https://www.ssllabs.com/ssltest/) — target grade A or A+

---

## 5. 📋 HTTP Security Headers

Run your site through [securityheaders.com](https://securityheaders.com) and confirm each:

- [ ] `Content-Security-Policy` (CSP) — defines allowed sources for scripts, styles, images, etc.
  - Start with: `default-src 'self'; script-src 'self'; object-src 'none'; base-uri 'self';`
  - No `unsafe-inline` or `unsafe-eval` unless absolutely necessary and documented
- [ ] `X-Content-Type-Options: nosniff` — prevents MIME-type sniffing
- [ ] `X-Frame-Options: DENY` or `SAMEORIGIN` — prevents clickjacking
- [ ] `Referrer-Policy: strict-origin-when-cross-origin` (or stricter)
- [ ] `Permissions-Policy` — disables unused browser features (camera, mic, geolocation)
- [ ] `Cache-Control: no-store` on authenticated/sensitive pages
- [ ] `X-XSS-Protection: 0` — disable old browser XSS auditor (CSP replaces this)
- [ ] Remove or obscure server version headers (`Server`, `X-Powered-By`, `X-AspNet-Version`)

---

## 6. 🗄️ Database & Data Storage

- [ ] Database is not exposed to the public internet (behind VPC/firewall)
- [ ] Database credentials are not hardcoded — use environment variables or secrets manager
- [ ] Database user used by the app has minimum required permissions (no `DROP`, `CREATE` if not needed)
- [ ] Backups are encrypted and tested for restore
- [ ] Sensitive data (PII, health data, financial) is encrypted at rest
- [ ] Sensitive fields (SSN, card numbers) are masked/tokenized in logs and UI
- [ ] Data retention and deletion policies are implemented
- [ ] Database connections use TLS where supported
- [ ] Connection pooling configured to prevent resource exhaustion

---

## 7. 🔐 Secrets & Credentials Management

- [ ] No secrets, API keys, or passwords in source code or version control
- [ ] `.env` files are in `.gitignore` — never committed
- [ ] Run `git log --all -S "password"` and `git log --all -S "secret"` to check history
- [ ] Use a secrets manager (AWS Secrets Manager, HashiCorp Vault, Doppler, etc.)
- [ ] API keys are scoped to minimum permissions
- [ ] API keys are rotated regularly and on suspected compromise
- [ ] Private keys (SSH, TLS, signing) are stored securely and never in code
- [ ] CI/CD pipeline secrets are stored in the platform's secrets store — not hardcoded in YAML
- [ ] Third-party service credentials reviewed for over-permission

---

## 8. 📁 File & Directory Security

- [ ] Directory listing is disabled on the web server
- [ ] `.git`, `.env`, `config`, `backup` directories are blocked from public access
- [ ] Sensitive files (`web.config`, `.htaccess`, `.DS_Store`) not publicly accessible
- [ ] File upload directory is outside the web root or non-executable
- [ ] Symbolic links followed by the web server are restricted
- [ ] Temporary files are cleaned up after use
- [ ] Log files do not contain sensitive user data and are not publicly accessible

---

## 9. 🧰 Dependencies & Third-Party Code

- [ ] All dependencies are pinned to specific versions (lock files committed: `package-lock.json`, `Pipfile.lock`, etc.)
- [ ] Known vulnerabilities scanned:
  - Node.js: `npm audit` or `yarn audit`
  - Python: `pip-audit` or `safety check`
  - PHP: `composer audit`
  - Java: OWASP Dependency-Check
  - Ruby: `bundle audit`
- [ ] No abandoned or unmaintained packages used
- [ ] Outdated packages updated, especially those with CVEs
- [ ] Third-party scripts (CDN, analytics, ads) reviewed and limited via CSP
- [ ] Subresource Integrity (SRI) hashes used for external CDN assets
- [ ] Frontend dependencies checked with `npm outdated` or Dependabot/Renovate enabled

---

## 10. ⚡ API Security

- [ ] All API endpoints require authentication where appropriate
- [ ] API keys / tokens are validated server-side on every request
- [ ] API rate limiting is enforced per user/IP
- [ ] API responses do not expose internal server details or stack traces
- [ ] GraphQL: Introspection disabled in production; query depth and complexity limits set
- [ ] REST: HTTP methods restricted per endpoint (no DELETE where only GET is needed)
- [ ] Pagination limits enforced to prevent data dumps
- [ ] API versioning in place — deprecated endpoints removed or secured
- [ ] CORS policy is explicit: `Access-Control-Allow-Origin` is not `*` unless intentionally public
- [ ] Webhooks validate signatures before processing payload
- [ ] API responses strip sensitive fields (passwords, tokens, internal IDs where not needed)

---

## 11. 🖥️ Server & Infrastructure

- [ ] Firewall configured — only necessary ports open (80, 443; close 22 to public if possible)
- [ ] SSH key-based authentication only — password auth disabled
- [ ] SSH port changed from default 22 or protected by port-knocking / VPN
- [ ] OS and server software patched and up to date
- [ ] Unnecessary services and daemons disabled
- [ ] Web server configured with minimal file permissions (principle of least privilege)
- [ ] Separate environments: development, staging, production — no shared credentials
- [ ] Production environment does not have debug mode / developer tools enabled
- [ ] Error pages are custom — do not reveal stack traces or server info
- [ ] DDoS protection in place (Cloudflare, AWS Shield, or equivalent)
- [ ] Intrusion Detection System (IDS) or Web Application Firewall (WAF) configured

---

## 12. 🪵 Logging & Monitoring

- [ ] Application logs capture: auth events, access denied, errors, input validation failures
- [ ] Logs do NOT contain: passwords, session tokens, credit card numbers, SSNs
- [ ] Log timestamps are in UTC and consistent
- [ ] Centralized log aggregation in place (Datadog, Splunk, ELK Stack, CloudWatch, etc.)
- [ ] Alerts configured for: repeated failed logins, spikes in errors, unusual traffic patterns
- [ ] Audit trail for admin actions (who did what, when)
- [ ] Log retention policy defined and enforced
- [ ] Logs are tamper-evident / write-protected
- [ ] Uptime and performance monitoring in place (e.g., Pingdom, Better Uptime)

---

## 13. 🔍 Business Logic & Application-Specific

- [ ] Price/quantity manipulation tested (can a user change prices client-side or via API?)
- [ ] Workflow bypass tested (can a user skip steps, e.g., skip payment?)
- [ ] Mass assignment / over-posting prevented (filter allowed fields explicitly)
- [ ] Object references (IDs in URLs/params) are not predictable or guessable — use UUIDs
- [ ] Insecure Direct Object Reference (IDOR): verify ownership before serving resources
- [ ] Race conditions tested on critical operations (payments, bookings, voucher redemptions)
- [ ] Coupon / promo code abuse mitigated (per-user limits, one-time-use enforcement)
- [ ] Email enumeration prevented (e.g., "this email is not registered" messages)
- [ ] Export/download endpoints paginated and access-controlled

---

## 14. 🍪 Cookies

- [ ] All sensitive cookies have `HttpOnly` flag (not readable by JavaScript)
- [ ] All cookies served over `Secure` flag (HTTPS only)
- [ ] `SameSite` attribute set on all cookies (`Strict` or `Lax`)
- [ ] Cookie expiry is appropriate (session cookies expire on browser close where needed)
- [ ] No sensitive data stored directly in cookies — use server-side sessions
- [ ] Cookie consent / privacy banner compliant with GDPR/CCPA if applicable

---

## 15. 📜 Error Handling

- [ ] All exceptions are caught and handled gracefully
- [ ] Users see friendly error pages — not stack traces or debug info
- [ ] 404, 403, 500 pages are custom and do not reveal server details
- [ ] Errors are logged internally but not echoed to the response
- [ ] No commented-out debug code left in production files
- [ ] `try/catch` blocks do not silently swallow errors without logging

---

## 16. 🌍 Privacy & Compliance

- [ ] Privacy Policy is up to date and accessible
- [ ] Terms of Service are up to date
- [ ] GDPR (if serving EU users): lawful basis for data processing documented
- [ ] CCPA (if serving California users): opt-out mechanism in place
- [ ] Data minimization: only collect what is needed
- [ ] User data deletion / export request flow implemented
- [ ] Third-party data sharing documented and disclosed
- [ ] Analytics tools (GA, Mixpanel) configured for privacy compliance (IP anonymization, etc.)
- [ ] Cookie consent implemented correctly (no pre-ticked boxes for non-essential cookies)

---

## 17. 🧪 Security Testing

- [ ] Manual penetration testing performed (or scheduled with a third party)
- [ ] OWASP Top 10 reviewed and addressed: [owasp.org/Top10](https://owasp.org/www-project-top-ten/)
- [ ] Automated DAST scan run (OWASP ZAP, Burp Suite Community, Nikto)
- [ ] Static code analysis (SAST) run:
  - JS/TS: `eslint-plugin-security`, Semgrep
  - Python: Bandit, Semgrep
  - PHP: PHPCS Security Audit
  - Java: SpotBugs + Find Security Bugs
- [ ] Secrets scanning run on full git history (truffleHog, gitleaks, git-secrets)
- [ ] All critical and high findings from scans are resolved before go-live
- [ ] Security review of authentication and payment flows completed

---

## 18. 🚀 Deployment & CI/CD

- [ ] CI pipeline runs security scans on every PR (dependency audit, SAST, secrets scan)
- [ ] Deployments to production require approval from at least one other person
- [ ] Docker images scanned for vulnerabilities (Trivy, Snyk, Docker Scout)
- [ ] Docker containers run as non-root user
- [ ] Kubernetes: RBAC configured, pod security policies set
- [ ] Environment variables in deployment configs are injected — not hardcoded
- [ ] `.dockerignore` excludes `.env`, credentials, and unnecessary files
- [ ] Infrastructure as Code (Terraform, CloudFormation) reviewed for misconfigurations
- [ ] Rollback plan documented and tested

---

## 19. ☁️ Cloud & External Services

- [ ] S3 / Blob storage buckets are private by default — no public `ListBucket`
- [ ] IAM roles follow least privilege — no wildcard `*` permissions where avoidable
- [ ] Cloud storage access logs enabled
- [ ] Public-facing cloud resources inventoried (no forgotten test buckets/instances)
- [ ] CDN cache-control reviewed — authenticated content is not cached publicly
- [ ] Sensitive data not stored in environment variable logs or cloud console outputs
- [ ] Third-party OAuth apps reviewed for over-permission (Google, GitHub integrations)

---

## 20. 📦 Backup & Recovery

- [ ] Automated backups configured for database and critical storage
- [ ] Backups are encrypted
- [ ] Backups are stored in a separate location / account from production
- [ ] Backup restore process tested and documented
- [ ] Recovery Time Objective (RTO) and Recovery Point Objective (RPO) defined
- [ ] Incident response plan documented (who to call, what to do on breach)

---
