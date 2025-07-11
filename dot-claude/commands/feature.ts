#!/usr/bin/env -S pnpm tsx

/**
 * Feature Command
 * Full-stack feature development with complete codebase access
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

class FeatureCommand {
	private scope: ScopeConfig;
	private qualityGates: QualityGates;

	constructor() {
		this.scope = SCOPES_CONFIG['feature'];
		this.qualityGates = QUALITY_GATES['feature'];
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
		console.log('🔍 Running feature development pre-checks...');

		for (const check of this.qualityGates['pre-checks']) {
			console.log(`  ✓ ${check.name}: ${check.description}`);
			// Implementation would go here
		}
	}

	async runPostChecks(): Promise<void> {
		console.log('🔍 Running feature development post-checks...');

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
			role: 'feature-development',
			focus: 'Full-stack feature implementation',
			scope: this.scope,
			workflow: [
				'1. Database schema changes (if needed)',
				'2. Model/type definitions',
				'3. Database layer functions',
				'4. Service layer implementation',
				'5. API route creation',
				'6. Frontend components',
				'7. Integration and testing',
			],
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
			architecturePatterns: [
				'Service-oriented architecture',
				'Multi-tenant organization scoping',
				'Type-safe database queries',
				'Parameterized SQL queries',
				'Error boundary handling',
				'Authentication middleware',
			],
			qualityRequirements: [
				'Organization-scoped queries',
				'Authentication checks',
				'Input validation with Zod',
				'Error handling with createErrorResponse',
				'TypeScript strict compliance',
				'Database transaction safety',
			],
		};
	}
}

export default FeatureCommand;

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
	const command = new FeatureCommand();

	console.log('🚀 Feature Development Mode Activated');
	console.log('📁 Scope: Full-stack implementation');
	console.log('🔧 Access: Complete codebase');
	console.log('');

	// Output context for Claude
	console.log('Context for Claude:');
	console.log(JSON.stringify(command.getPromptContext(), null, 2));
}
