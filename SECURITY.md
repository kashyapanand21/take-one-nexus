# Security Policy

At TAKE ONE Nexus, we take the security of our platform and user data seriously. This document outlines our security practices and how to report potential vulnerabilities.

## Supported Versions

We currently support the following branches for security updates:

| Version | Supported          |
| ------- | ------------------ |
| `main`  | :white_check_mark: |
| `< 1.0` | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within TAKE ONE Nexus, please **do not** report it by creating a public GitHub issue. 

Instead, please send an email to the core maintainers:
**[Maintainer Email / Security Contact]** *(Replace with actual email)*

### What to include in your report:
- A clear description of the vulnerability.
- Steps to reproduce the issue.
- Potential impact of the vulnerability.
- Any proposed mitigation or fix (if applicable).

We will acknowledge receipt of your vulnerability report within 48 hours and strive to resolve critical issues as quickly as possible.

## Responsible Disclosure

We ask that you follow the principles of responsible disclosure:
1. Give us a reasonable amount of time to investigate and patch the vulnerability before making any information public.
2. Avoid accessing or modifying user data that does not belong to you during your testing.
3. Do not perform any testing that could degrade the performance of the live platform (e.g., DoS attacks).

## Security Best Practices in our Codebase

Contributors should adhere to the following when writing code:
- **Authentication:** All protected API routes must be gated using our JWT middleware.
- **Authorization:** Ensure role-based access control (RBAC) is enforced at the API level, not just the UI level.
- **Input Validation:** All user inputs must be validated using Zod before interacting with the database.
- **Data Privacy:** Never log sensitive information (e.g., passwords, full JWT tokens, PII) to the console.
- **Dependencies:** Regularly audit `package.json` for vulnerable dependencies (`npm audit`).

Thank you for helping keep TAKE ONE Nexus secure!
