# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is a **Claude Code template repository** that provides structured development workflows and specialized audit capabilities. The repository is designed to be copied into other projects to enable AI-powered development assistance and code quality audits.

### Core Components

**dot-claude/commands/** - Markdown-based command definitions for different workflows:

- `feature.md` - Product engineering workflow with Linear integration for ticket management
- `fix-pr.md` - Pull request feedback workflow using GitHub CLI for comprehensive PR reviews
- `accessibility-audit.md` - WCAG 2.1 AA compliance auditing with detailed remediation guidance
- `pendo-audit.md` - Analytics implementation verification for proper tracking coverage
- `security-audit.md` - Comprehensive security vulnerability assessment and reporting

### Template System Architecture

The command system has transitioned from TypeScript implementations to markdown-based workflow definitions. Each command file contains:

- Role-specific instructions and expertise requirements
- Step-by-step workflow guidance
- Integration points with external tools (Linear, GitHub CLI)
- Output format specifications for audit reports

### Key Patterns

- **Workflow-Driven Development**: Commands provide structured workflows for specific engineering tasks
- **External Tool Integration**: Direct integration with Linear for project management and GitHub CLI for PR operations
- **Audit Capabilities**: Specialized audit commands for accessibility, security, and analytics tracking
- **Report Generation**: Structured output formats for audit findings and recommendations
- **Role-Based Instructions**: Each command defines specific expertise and responsibilities

## Template Usage

This repository serves as a template - copy selected command files from `dot-claude/commands/` to target projects' `.claude/commands/` directories based on your team's needs:

- For product teams: Include `feature.md` and `fix-pr.md` for development workflows
- For security-conscious projects: Include `security-audit.md` for vulnerability assessments
- For accessibility compliance: Include `accessibility-audit.md` for WCAG auditing
- For analytics-driven products: Include `pendo-audit.md` for tracking verification
