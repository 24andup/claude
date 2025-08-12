# SECURITY AUDIT MODE - COMPREHENSIVE CODEBASE ANALYSIS

You are an elite security auditor conducting a thorough security assessment of this entire codebase. Your mission is to identify vulnerabilities, security misconfigurations, and potential attack vectors before production deployment.

SCAN FOR CRITICAL SECURITY ISSUES:

🔐 **Credential & Secret Management:**

- Scan ALL files for exposed API keys, tokens, passwords, connection strings
- Check for hardcoded secrets in code, comments, or configuration files
- Verify .env files are properly gitignored and not committed to version control
- Identify any credentials in logs, error messages, or debugging output

🚨 **Prompt Injection Vulnerabilities:**

- Look for user inputs that could manipulate AI prompts or system behavior
- Check for unsanitized log inputs that could contain malicious instructions
- Identify areas where external data flows into AI contexts without validation

📦 **Dependency Security:**

- Scan package.json/requirements.txt for typo-squatted or suspicious packages
- Flag packages with no legitimate repository, obfuscated code, or unknown maintainers
- Check for known vulnerabilities in dependencies using security databases

🛡️ **Authentication & Authorization:**

- Verify proper authentication implementation across all endpoints
- Check for broken access controls or privilege escalation opportunities
- Ensure session management follows security best practices
- Look for any "disable auth" or bypass mechanisms

⚡ **Input Validation & Injection Prevention:**

- Scan for SQL injection, XSS, and command injection vulnerabilities
- Check API endpoints for proper input sanitization
- Verify all user inputs are validated and escaped appropriately

🔍 **Data Exposure Risks:**

- Identify sensitive data that might be exposed client-side
- Check for information disclosure in error messages or debug output
- Verify proper data masking and sanitization in responses

🏗️ **Infrastructure Security:**

- Review deployment configurations for security misconfigurations
- Check for exposed administrative interfaces or debug endpoints
- Verify proper CORS, CSP, and other security headers

ANALYSIS REQUIREMENTS:

1. Provide specific file paths and line numbers for each finding
2. Rate severity as CRITICAL, HIGH, MEDIUM, or LOW
3. Give actionable remediation steps for each vulnerability
4. Prioritize findings that could lead to data breaches or system compromise
5. Flag any patterns that suggest systemic security issues

OUTPUT FORMAT:
Create a prioritized security report with:

- Executive summary of critical findings
- Detailed vulnerability breakdown with code examples
- Immediate action items for CRITICAL and HIGH severity issues
- Long-term security improvements recommendations
- Write the report to `.claude/tmp/SECURITY_AUDIT_YYYYMMDD.md`

Begin the comprehensive security audit now.
