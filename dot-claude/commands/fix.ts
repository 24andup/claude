#!/usr/bin/env -S pnpm tsx

/**
 * Fix Command
 * Context-aware bug fixes with scope determined by issue location
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SCOPES_CONFIG = JSON.parse(readFileSync(join(__dirname, '../config/scopes.json'), 'utf8'));
const QUALITY_GATES = JSON.parse(readFileSync(join(__dirname, '../config/quality-gates.json'), 'utf8'));

interface ScopeConfig {
	include: string[];
	exclude: string[];
	allowedDependencies: string[] | string;
	scopingRules: {
		'frontend-only': { triggers: string[] };
		'backend-only': { triggers: string[] };
		'full-stack': { triggers: string[] };
	};
}

interface QualityCheck {
	name: string;
	description: string;
	command: string;
	required: boolean;
}

interface QualityGates {
	'pre-checks': QualityCheck[];
	'post-checks': QualityCheck[];
}

class FixCommand {
	private scope: ScopeConfig;
	private qualityGates: QualityGates;
	private issueDescription: string;
	public determinedScope: string;

	constructor(issueDescription: string = '') {
		this.scope = SCOPES_CONFIG['fix'];
		this.qualityGates = QUALITY_GATES['fix'];
		this.issueDescription = issueDescription.toLowerCase();
		this.determinedScope = this.determineScope();
	}

	private determineScope(): string {
		const scopingRules = this.scope.scopingRules;

		// Check for frontend-only indicators
		for (const trigger of scopingRules['frontend-only'].triggers) {
			if (this.issueDescription.includes(trigger)) {
				return 'design-engineering';
			}
		}

		// Check for backend-only indicators
		for (const trigger of scopingRules['backend-only'].triggers) {
			if (this.issueDescription.includes(trigger)) {
				return 'backend';
			}
		}

		// Check for full-stack indicators
		for (const trigger of scopingRules['full-stack'].triggers) {
			if (this.issueDescription.includes(trigger)) {
				return 'feature';
			}
		}

		// Default to contextual analysis
		return 'contextual';
	}

	validateScope(filePath: string): boolean {
		const isIncluded = this.scope.include.some((pattern) => this.matchesPattern(filePath, pattern));

		const isExcluded = this.scope.exclude.some((pattern) => this.matchesPattern(filePath, pattern));

		return isIncluded && !isExcluded;
	}

	private matchesPattern(filePath: string, pattern: string): boolean {
		// Simple glob-like matching
		const regex = pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*').replace(/\./g, '\\.');

		return new RegExp(`^${regex}$`).test(filePath);
	}

	async runPreChecks(): Promise<void> {
		console.log('🔍 Running bug fix pre-checks...');

		for (const check of this.qualityGates['pre-checks']) {
			console.log(`  ✓ ${check.name}: ${check.description}`);
			// Implementation would go here
		}
	}

	async runPostChecks(): Promise<void> {
		console.log('🔍 Running bug fix post-checks...');

		for (const check of this.qualityGates['post-checks']) {
			console.log(`  → ${check.name}: ${check.description}`);

			if (check.command.startsWith('pnpm')) {
				console.log(`    Running: ${check.command}`);
				// Would execute: execSync(check.command)
			}
		}
	}

	getPromptContext() {
		return {
			role: 'bug-fixing',
			focus: 'Context-aware bug resolution',
			scope: this.scope,
			determinedScope: this.determinedScope,
			issueDescription: this.issueDescription,
			workflow: [
				'1. Analyze issue context and scope',
				'2. Identify root cause',
				'3. Implement minimal fix',
				'4. Verify fix resolves issue',
				'5. Check for regression risks',
				'6. Run quality gates',
			],
			scopingGuidance: {
				'design-engineering': 'UI/UX bugs, styling issues, component errors',
				backend: 'API errors, database issues, server-side problems',
				feature: 'Integration issues, workflow problems, end-to-end bugs',
				contextual: 'Analyze the specific error to determine appropriate scope',
			},
			techStack: [
				'Next.js 15',
				'React 19',
				'TypeScript',
				'PostgreSQL',
				'NeonDB',
				'pgvector',
				'Tailwind CSS',
				'shadcn/ui',
				'NextAuth.js',
				'OpenAI API',
			],
			qualityRequirements: [
				'Minimal change principle',
				'Regression risk assessment',
				'Error boundary considerations',
				'Type safety preservation',
				'Performance impact analysis',
			],
		};
	}
}

export default FixCommand;

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
	const issueDescription = process.argv[2] || '';
	const command = new FixCommand(issueDescription);

	console.log('🐛 Bug Fix Mode Activated');
	console.log(`📁 Determined scope: ${command.determinedScope}`);
	console.log('🔧 Focus: Minimal, targeted fixes');
	console.log('');

	// Output context for Claude
	console.log('Context for Claude:');
	console.log(JSON.stringify(command.getPromptContext(), null, 2));
}
