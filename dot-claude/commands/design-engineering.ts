#!/usr/bin/env -S pnpm tsx

/**
 * Design Engineering Command
 * Scopes Claude to frontend-only changes focusing on UI components and client-side logic
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

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

class DesignEngineeringCommand {
	private scope: ScopeConfig;
	private qualityGates: QualityGates;

	constructor() {
		this.scope = SCOPES_CONFIG['design-engineering'];
		this.qualityGates = QUALITY_GATES['design-engineering'];
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
		console.log('🔍 Running design engineering pre-checks...');

		for (const check of this.qualityGates['pre-checks']) {
			if (check.required) {
				console.log(`  ✓ ${check.name}: ${check.description}`);
				// Implementation would go here
			}
		}
	}

	async runPostChecks(): Promise<void> {
		console.log('🔍 Running design engineering post-checks...');

		for (const check of this.qualityGates['post-checks']) {
			console.log(`  → ${check.name}: ${check.description}`);

			if (check.command.startsWith('pnpm')) {
				console.log(`    Running: ${check.command}`);
				execSync(check.command);
			}
		}
	}

	getPromptContext() {
		return {
			role: 'design-engineering',
			focus: 'Frontend UI/UX components and client-side logic',
			scope: this.scope,
			restrictions: [
				'No API route modifications',
				'No database schema changes',
				'No service layer changes',
				'Focus on React components and styling',
			],
			techStack: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'Radix UI'],
			qualityRequirements: [
				'TypeScript strict mode compliance',
				'Tailwind CSS best practices',
				'Responsive design',
				'Component reusability',
				'Props interface definitions',
			],
		};
	}
}

export default DesignEngineeringCommand;

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
	const command = new DesignEngineeringCommand();

	console.log('🎨 Design Engineering Mode Activated');
	console.log('📁 Scope: Frontend components and client-side logic');
	console.log('🚫 Restrictions: No API/DB/Service changes');
	console.log('');

	// Output context for Claude
	console.log('Context for Claude:');
	console.log(JSON.stringify(command.getPromptContext(), null, 2));
}
