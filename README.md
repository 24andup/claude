# Claude Code Templates

A template repository containing Claude Code configurations for structured development workflows with scoped permissions and automated quality gates.

## Overview

This repository provides reusable Claude Code configurations that can be copied into your projects to enable:

- **Scoped Development Modes** - Frontend, full-stack, and bug fix workflows with appropriate permissions
- **Automated Quality Gates** - Integrated linting, type-checking, and build validation
- **Feature Discovery** - AI-powered feature breakdown and Linear project planning
- **Code Templates** - Boilerplate for common patterns and components
- **AI Code Review** - Automated GitHub Actions workflow for pull request reviews

## Quick Start

1. **Copy template files** to your project:

   ```bash
   cp -r dot-claude/ /path/to/your/project/.claude/
   cp -r dot-github/ /path/to/your/project/.github/
   ```

2. **Customize configuration** files for your project's needs:
   - Update `config/quality-gates.json` with your project's scripts
   - Modify `config/file-patterns.json` for your codebase structure
   - Adjust `config/scopes.json` permissions as needed

3. **Setup AI Code Review** (optional):
   - Add `ANTHROPIC_API_KEY` secret to your GitHub repository
   - The workflow automatically reviews PRs under 2000 lines
   - Comment `/claude-review` to manually trigger reviews

4. **Use development commands** in your project:
   - `/disco` - Feature planning (requires Linear MCP server)
   - `/design-engineering` - Frontend development
   - `/feature` - Full-stack features
   - `/fix` - Bug fixes

## Development Modes

### 🔍 Discovery

Feature discovery and Linear project planning for complex features

The `/disco` command provides AI-powered feature breakdown and project management integration:

- **Interactive Planning**: Guided prompts for business context, scope definition, and user flows
- **Smart Analysis**: Context-aware ticket generation with automatic complexity assessment
- **Dependency Mapping**: Visual relationship mapping between tickets and components
- **Linear Integration**: Automatic project and ticket creation with team auto-detection
- **File Input Support**: Use `disco-input.json` template for batch processing

**Requirements**: Requires the Linear MCP server to be configured for project management integration.

**Best For**: Large feature planning, stakeholder alignment, technical architecture planning, and dependency analysis.

### 🎨 Design Engineering

Frontend-focused development with access to components, pages, and styling files. Excludes API routes and database operations.

### 🚀 Feature Development

Complete full-stack feature implementation with database migrations, API routes, services, and frontend components.

### 🔧 Bug Fixes

Context-aware bug resolution with intelligent scope determination based on the issue description.

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

## Configuration Files

- **file-patterns.json** - Defines file scope access for different development modes
- **quality-gates.json** - Specifies quality gate commands (lint, type-check, format, build)
- **scopes.json** - Permission scopes for different development contexts
- **templates/** - Code templates for API routes, components, and pages
- **workflows/** - GitHub Actions workflow for automated AI code reviews

## Contributing

This is a template repository. Improvements to the base configurations and commands are welcome via pull requests.
