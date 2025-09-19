# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is a **Claude Code template repository** that provides structured development workflows, specialized AI agents, and code quality audit capabilities. The repository is designed to be copied into other projects to enable AI-powered development assistance with role-based agent collaboration.

### Core Components

**dot-claude/commands/** - Markdown-based command definitions for different workflows:

- `feature.md` - Product engineering workflow with Linear integration for ticket management
- `fix-pr.md` - Pull request feedback workflow using GitHub CLI for comprehensive PR reviews
- `accessibility-audit.md` - WCAG 2.1 AA compliance auditing with detailed remediation guidance
- `pendo-audit.md` - Analytics implementation verification for proper tracking coverage
- `security-audit.md` - Comprehensive security vulnerability assessment and reporting

**dot-claude/agents/** - Specialized AI agent definitions for collaborative development:

- `product-feature-planner.md` - Product management expertise for feature planning, specification, and Linear ticket creation
- `engineering-team-lead.md` - Engineering leadership for technical feasibility, architecture decisions, and requirement refinement
- `research-analyst.md` - Deep research capabilities for exploring best practices, external documentation, and technical solutions
- `intern.md` - Quick administrative tasks, note-taking, and Linear ticket creation without disrupting main workflow

### Template System Architecture

The system combines two complementary approaches:

1. **Command System**: Markdown-based workflow definitions that provide:
   - Role-specific instructions and expertise requirements
   - Step-by-step workflow guidance
   - Integration points with external tools (Linear, GitHub CLI)
   - Output format specifications for audit reports

2. **Agent System**: Specialized AI agents that can be invoked via the Task tool to provide:
   - Domain-specific expertise and perspectives
   - Collaborative development workflows
   - Independent task execution
   - Parallel processing capabilities

### Agent Collaboration Model

Agents work together to provide comprehensive development support:

- **Product-Engineering Collaboration**: The product-feature-planner and engineering-team-lead agents work together to ensure features are properly scoped from both business and technical perspectives
- **Research-Driven Development**: The research-analyst agent gathers external knowledge to inform implementation decisions
- **Administrative Support**: The intern agent handles quick tasks without interrupting the main development flow

### Key Patterns

- **Workflow-Driven Development**: Commands provide structured workflows for specific engineering tasks
- **Agent-Based Collaboration**: Specialized agents bring domain expertise to complex development scenarios
- **External Tool Integration**: Direct integration with Linear for project management and GitHub CLI for PR operations
- **Audit Capabilities**: Specialized audit commands for accessibility, security, and analytics tracking
- **Report Generation**: Structured output formats for audit findings and recommendations
- **Role-Based Instructions**: Each command and agent defines specific expertise and responsibilities
- **Parallel Processing**: Agents can be invoked concurrently for efficient task completion

## Template Usage

This repository serves as a template - copy selected components to target projects based on your team's needs:

### Commands
Copy command files from `dot-claude/commands/` to your project's `.claude/commands/` directory:

- For product teams: Include `feature.md` and `fix-pr.md` for development workflows
- For security-conscious projects: Include `security-audit.md` for vulnerability assessments
- For accessibility compliance: Include `accessibility-audit.md` for WCAG auditing
- For analytics-driven products: Include `pendo-audit.md` for tracking verification

### Agents
Copy agent files from `dot-claude/agents/` to your project's `.claude/agents/` directory:

- For product planning: Include `product-feature-planner.md` for feature specification and Linear integration
- For technical leadership: Include `engineering-team-lead.md` for architecture and feasibility assessment
- For research needs: Include `research-analyst.md` for exploring best practices and external resources
- For task management: Include `intern.md` for quick administrative tasks and note-taking
