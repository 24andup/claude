# Claude Code Development Guide

This directory contains Claude Code configuration and utilities, providing structured development workflows with scoped permissions and automated quality gates.

## Development Modes

### 🔍 Discovery (`/disco`)

**Purpose**: Feature discovery and Linear project planning for large, complex features.

**Workflow**:

1. Collect business context, scope definition, and user flows
2. Generate AI-powered clarification questions
3. Intelligent ticket breakdown based on feature complexity
4. Visual dependency mapping
5. Automatic Linear project and ticket creation

**Input Options**:

- Interactive mode with guided prompts
- File input using `.claude/templates/disco-input.json`

**Smart Analysis**:

- Context-aware ticket generation (database, API, frontend, testing)
- Automatic complexity assessment and effort estimation
- Dependency relationship mapping
- Linear team auto-detection

**Best For**:

- Large feature planning and breakdown
- Stakeholder alignment and scope definition
- Project management integration
- Technical architecture planning
- Dependency analysis and sequencing

**Requirements**: Requires Linear MCP server configuration

**Quality Gates**: Input validation, Linear integration

### 🎨 Design Engineering (`/design-engineering`)

**Purpose**: Frontend-focused development for UI/UX changes, component updates, and styling improvements.

**Scope**:

- ✅ `src/components/` - React components and UI elements
- ✅ `src/app/` (excluding `api/`) - Pages and layouts
- ✅ Frontend TypeScript types and interfaces
- ✅ Tailwind CSS and styling
- ❌ API routes and backend logic
- ❌ Database operations and services

**Best For**:

- Component development and updates
- UI/UX improvements
- Styling and responsive design
- TypeScript interface updates
- shadcn/ui component integration

**Quality Gates**: lint, type-check, format

### 🚀 Feature Development (`/feature`)

**Purpose**: Complete full-stack feature implementation with access to the entire codebase.

**Scope**:

- ✅ Complete codebase access
- ✅ Database migrations and schema changes
- ✅ API routes and services
- ✅ Frontend and backend components
- ✅ Third-party integrations (OpenAI, Slack)

**Workflow**:

1. Database migration (if needed)
2. Zod schema definition (`src/models/`)
3. Database functions (`src/lib/db/`)
4. Service layer (`src/services/`)
5. API routes (`src/app/api/`)
6. Frontend components
7. Quality gates validation

**Best For**:

- New feature implementation
- API endpoint creation
- Database schema changes
- Integration development
- Multi-tenant feature rollouts

**Quality Gates**: lint, type-check, format, build

### 🔧 Bug Fixes (`/fix`)

**Purpose**: Context-aware bug resolution with intelligent scope determination.

**Dynamic Scoping**: Analyzes the issue description to determine appropriate scope:

- Frontend issues → Design engineering scope
- API/Backend issues → Service and database scope
- Full-stack issues → Complete access

**Best For**:

- Targeted bug resolution
- Performance optimizations
- Error handling improvements
- Security vulnerability fixes
- Regression issue resolution

**Quality Gates**: lint, type-check, format
