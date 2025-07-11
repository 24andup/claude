# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Testing and Running Commands

```bash
# Execute TypeScript command files
pnpm tsx dot-claude/commands/design-engineering.ts
pnpm tsx dot-claude/utils/template-generator.ts

# Template generation utility
pnpm tsx dot-claude/utils/template-generator.ts component ComponentName ./output/path.tsx

# Scope validation utility
pnpm tsx dot-claude/utils/scope-validator.ts design-engineering file1.tsx file2.ts

# Quality checking utility
pnpm tsx dot-claude/utils/quality-checker.ts feature post
```

## Architecture Overview

This is a **Claude Code template repository** that provides structured development workflows with scoped permissions and automated quality gates. The repository is designed to be copied into other projects to enable AI-powered development assistance.

### Core Components

**dot-claude/commands/** - TypeScript command implementations for different development modes:

- `design-engineering.ts` - Frontend-focused development with restricted file access
- `feature.ts` - Full-stack development with complete codebase access
- `fix.ts` - Context-aware bug resolution with intelligent scope determination
- `disco/` - Modular feature discovery system with Linear integration

**dot-claude/config/** - Configuration-driven behavior control:

- `scopes.json` - File access patterns and technology stack restrictions
- `quality-gates.json` - Pre/post validation checks for each command
- `file-patterns.json` - Naming conventions and code structure patterns

**dot-claude/utils/** - Reusable utility functions:

- `template-generator.ts` - Variable substitution system for code generation
- `scope-validator.ts` - Glob pattern matching for file validation
- `quality-checker.ts` - Command execution with output capture

### Template System Architecture

The command system uses configuration-driven scoping where each development mode has defined file access patterns, technology restrictions, and quality requirements. Commands validate scope before execution and run quality gates afterward.

The disco command demonstrates modular architecture with separate modules for orchestration, input collection, feature analysis, Linear service integration, and progress management.

### Key Patterns

- **Scope Validation**: Commands use glob patterns to restrict file access based on development context
- **Quality Gates**: Automated validation through configurable pre/post checks
- **Template Generation**: Variable substitution system ({{ComponentName}}) for consistent code generation
- **Error Recovery**: Progress management for complex multi-step workflows
- **Configuration-Driven**: Behavior controlled through JSON configuration files rather than hardcoded logic

## Template Usage

This repository serves as a template - copy `dot-claude/` contents to target projects' `.claude/` directories and customize the configuration files for project-specific needs.
