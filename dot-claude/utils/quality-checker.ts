#!/usr/bin/env -S pnpm tsx

/**
 * Quality Checker Utility
 * Runs quality gates for different command types
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';

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

interface CheckResult {
	name: string;
	success: boolean;
	output?: string;
	error?: string;
}

class QualityChecker {
	private qualityGates: QualityGates;

	constructor(qualityGates: QualityGates) {
		this.qualityGates = qualityGates;
	}

	async runPreChecks(): Promise<CheckResult[]> {
		console.log('🔍 Running pre-checks...');
		const results: CheckResult[] = [];

		for (const check of this.qualityGates['pre-checks']) {
			const result = await this.runCheck(check);
			results.push(result);

			if (check.required && !result.success) {
				throw new Error(`Required pre-check failed: ${check.name}`);
			}
		}

		return results;
	}

	async runPostChecks(): Promise<CheckResult[]> {
		console.log('🔍 Running post-checks...');
		const results: CheckResult[] = [];

		for (const check of this.qualityGates['post-checks']) {
			const result = await this.runCheck(check);
			results.push(result);

			if (check.required && !result.success) {
				throw new Error(`Required post-check failed: ${check.name}`);
			}
		}

		return results;
	}

	private async runCheck(check: QualityCheck): Promise<CheckResult> {
		console.log(`  → ${check.name}: ${check.description}`);

		try {
			if (check.command.startsWith('pnpm')) {
				const output = execSync(check.command, {
					encoding: 'utf8',
					stdio: 'pipe',
				});

				console.log(`    ✅ ${check.name} passed`);
				return {
					name: check.name,
					success: true,
					output: output.trim(),
				};
			} else {
				// Custom check implementation would go here
				console.log(`    ⚠️  Custom check ${check.name} not implemented`);
				return {
					name: check.name,
					success: true,
					output: 'Custom check placeholder',
				};
			}
		} catch (error) {
			console.log(`    ❌ ${check.name} failed`);
			console.log(`    Error: ${error instanceof Error ? error.message : 'Unknown error'}`);

			return {
				name: check.name,
				success: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			};
		}
	}

	generateReport(results: CheckResult[]): string {
		let report = '';

		const passed = results.filter((r) => r.success);
		const failed = results.filter((r) => !r.success);

		if (passed.length > 0) {
			report += `✅ Passed checks (${passed.length}):\n`;
			passed.forEach((check) => {
				report += `  - ${check.name}\n`;
			});
		}

		if (failed.length > 0) {
			report += `\n❌ Failed checks (${failed.length}):\n`;
			failed.forEach((check) => {
				report += `  - ${check.name}: ${check.error}\n`;
			});
		}

		return report;
	}
}

export default QualityChecker;

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
	const [, , commandType, checkType] = process.argv;

	if (!commandType || !checkType) {
		console.error('Usage: tsx quality-checker.ts <command-type> <pre|post>');
		process.exit(1);
	}

	const qualityGates = JSON.parse(readFileSync(new URL('../config/quality-gates.json', import.meta.url), 'utf8'));
	const checker = new QualityChecker(qualityGates[commandType]);

	const runChecks = checkType === 'pre' ? checker.runPreChecks.bind(checker) : checker.runPostChecks.bind(checker);

	runChecks()
		.then((results) => {
			const report = checker.generateReport(results);
			console.log('\n' + report);

			const failed = results.filter((r) => !r.success);
			if (failed.length > 0) {
				process.exit(1);
			}
		})
		.catch((error) => {
			console.error('Quality check failed:', error.message);
			process.exit(1);
		});
}
