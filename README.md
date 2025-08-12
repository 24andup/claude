# Claude Code Templates

A template repository containing Claude Code command definitions for structured development workflows, code auditing, and external tool integrations.

## Overview

This repository provides reusable Claude Code command templates that can be copied into your projects to enable:

- **Development Workflows** - Product engineering with Linear integration and PR feedback via GitHub CLI
- **Accessibility Auditing** - WCAG 2.1 AA compliance checking with detailed remediation guidance
- **Security Auditing** - Comprehensive vulnerability assessment and threat analysis
- **Analytics Auditing** - Pendo tracking implementation verification
- **AI Code Review** - Automated GitHub Actions workflow for pull request reviews

## Quick Start

1. **Copy selected command files** to your project:

   ```bash
   # Copy desired command templates
   cp dot-claude/commands/feature.md /path/to/your/project/.claude/commands/
   cp dot-claude/commands/fix-pr.md /path/to/your/project/.claude/commands/
   
   # Copy audit commands as needed
   cp dot-claude/commands/security-audit.md /path/to/your/project/.claude/commands/
   cp dot-claude/commands/accessibility-audit.md /path/to/your/project/.claude/commands/
   cp dot-claude/commands/pendo-audit.md /path/to/your/project/.claude/commands/
   
   # Copy GitHub Actions workflow (optional)
   cp -r dot-github/ /path/to/your/project/.github/
   ```

2. **Customize commands** for your project:
   - Update repository-specific references in command files
   - Adjust Linear project references in `feature.md`
   - Configure analytics patterns in `pendo-audit.md`

3. **Setup AI Code Review** (optional):
   - Add `ANTHROPIC_API_KEY` secret to your GitHub repository
   - The workflow automatically reviews PRs under 2000 lines
   - Comment `/claude-review` to manually trigger reviews

4. **Use commands** in Claude Code:
   - `/feature [ticket-id]` - Product engineering with Linear integration
   - `/fix-pr [pr-number]` - Review and address PR feedback
   - `/security-audit` - Run comprehensive security analysis
   - `/accessibility-audit` - Check WCAG compliance
   - `/pendo-audit` - Verify analytics tracking

## Available Commands

### 🚀 Product Engineering (`feature.md`)

Linear-integrated development workflow for implementing features:

- **Ticket Management**: Pulls Linear tickets, assigns to user, updates status
- **Planning & Documentation**: Attaches implementation plans and summaries to Linear
- **Devil's Advocate Approach**: Considers edge cases and alternative approaches
- **Project Context**: Reviews parent projects for full context

**Requirements**: Linear MCP server configuration for ticket management.

### 🔧 Pull Request Feedback (`fix-pr.md`)

Structured PR review and feedback resolution workflow:

- **GitHub CLI Integration**: Direct interaction with pull requests
- **Linear Context**: Automatically reviews associated tickets (531-XXX format)
- **Feedback Triage**: Categorizes feedback into immediate fixes vs. future tickets
- **Performance & DX Focus**: Evaluates edge cases and developer experience

### 🔐 Security Audit (`security-audit.md`)

Comprehensive security vulnerability assessment:

- **Secret Scanning**: Identifies exposed credentials and API keys
- **Dependency Analysis**: Checks for vulnerable or suspicious packages
- **Injection Prevention**: Scans for SQL, XSS, and command injection risks
- **AI Security**: Detects prompt injection vulnerabilities
- **Report Generation**: Creates prioritized findings in `.claude/tmp/`

### ♿ Accessibility Audit (`accessibility-audit.md`)

WCAG 2.1 AA compliance verification:

- **Semantic HTML Review**: Validates proper structure and landmarks
- **Keyboard Navigation**: Checks focus management and tab order
- **Screen Reader Support**: Verifies ARIA implementation
- **Visual Accessibility**: Evaluates color contrast and text sizing
- **Detailed Remediation**: Provides specific code fixes with testing methods

### 📊 Analytics Audit (`pendo-audit.md`)

Pendo tracking implementation verification:

- **Coverage Analysis**: Identifies missing tracking on interactions
- **Naming Conventions**: Validates `feature:component:action` patterns
- **Privacy Review**: Ensures no sensitive data in tracking
- **Git Diff Focus**: Audits recent changes for proper implementation

## GitHub Actions Workflow

### 🤖 AI Code Review

Automated code review workflow that provides comprehensive feedback on pull requests using Claude AI.

**Features:**

- **Automatic Triggers**: Reviews PRs when opened (under 2000 lines)
- **Manual Override**: Comment `/claude-review` to force review large PRs
- **Smart Analysis**: Security, TypeScript compliance, architecture adherence
- **Cost Control**: Automatic size limits with manual override options

**Setup:**

1. Add `ANTHROPIC_API_KEY` as a repository secret
2. Workflow runs automatically on new PRs
3. Review comments appear directly on pull requests

**Review Focus:**

- Multi-tenant security and data isolation
- TypeScript strict mode compliance
- API authentication and error handling
- Database query security and performance
- Code organization and best practices

## Repository Structure

```
dot-claude/
├── commands/
│   ├── feature.md              # Product engineering workflow
│   ├── fix-pr.md               # PR feedback resolution
│   ├── security-audit.md       # Security vulnerability scanning
│   ├── accessibility-audit.md  # WCAG compliance checking
│   └── pendo-audit.md          # Analytics tracking verification
└── (additional configs as needed)

dot-github/
└── workflows/
    └── (AI code review workflow)
```

## Customization Guide

### Adapting Commands

Each command file can be customized for your project:

1. **Update Repository References**: Replace example repository names with your actual project
2. **Configure Tool Integrations**: Update Linear project IDs, GitHub repo paths, etc.
3. **Adjust Audit Criteria**: Modify security rules, accessibility standards, or analytics patterns
4. **Add Project-Specific Instructions**: Include your team's conventions and requirements

### Creating New Commands

To create custom commands:

1. Create a new `.md` file in `.claude/commands/`
2. Define the role and expertise at the top
3. Provide clear step-by-step instructions
4. Specify output formats and destinations
5. Include any required tool integrations

## Contributing

This is a template repository. Improvements to command templates and new workflow patterns are welcome via pull requests.
