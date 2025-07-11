#!/usr/bin/env -S pnpm tsx

/**
 * Scope Validator Utility
 * Validates file changes against command scope restrictions
 */

import { readFileSync } from 'fs';

interface ScopeConfig {
	include: string[];
	exclude: string[];
	allowedDependencies: string[] | string;
}

interface ValidationResult {
	allowed: boolean;
	reason: string;
}

interface ValidationResults {
	allowed: string[];
	blocked: Array<{ file: string; reason: string }>;
	warnings: string[];
}

class ScopeValidator {
	private scopeConfig: ScopeConfig;

	constructor(scopeConfig: ScopeConfig) {
		this.scopeConfig = scopeConfig;
	}

	validateFile(filePath: string): ValidationResult {
		const isIncluded = this.scopeConfig.include.some((pattern) => this.matchesPattern(filePath, pattern));

		const isExcluded = this.scopeConfig.exclude.some((pattern) => this.matchesPattern(filePath, pattern));

		return {
			allowed: isIncluded && !isExcluded,
			reason: this.getValidationReason(filePath, isIncluded, isExcluded),
		};
	}

	private getValidationReason(filePath: string, isIncluded: boolean, isExcluded: boolean): string {
		if (!isIncluded) {
			return `File ${filePath} is not in the allowed scope`;
		}

		if (isExcluded) {
			return `File ${filePath} is explicitly excluded from this scope`;
		}

		return 'File is within allowed scope';
	}

	validateChanges(changedFiles: string[]): ValidationResults {
		const results: ValidationResults = {
			allowed: [],
			blocked: [],
			warnings: [],
		};

		for (const file of changedFiles) {
			const validation = this.validateFile(file);

			if (validation.allowed) {
				results.allowed.push(file);
			} else {
				results.blocked.push({
					file,
					reason: validation.reason,
				});
			}
		}

		return results;
	}

	private matchesPattern(filePath: string, pattern: string): boolean {
		// Simple glob-like matching
		const regex = pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*').replace(/\./g, '\\.');

		return new RegExp(`^${regex}$`).test(filePath);
	}

	generateReport(validationResults: ValidationResults): string {
		let report = '';

		if (validationResults.allowed.length > 0) {
			report += '✅ Allowed files:\n';
			validationResults.allowed.forEach((file) => {
				report += `  - ${file}\n`;
			});
		}

		if (validationResults.blocked.length > 0) {
			report += '\n❌ Blocked files:\n';
			validationResults.blocked.forEach(({ file, reason }) => {
				report += `  - ${file}: ${reason}\n`;
			});
		}

		if (validationResults.warnings.length > 0) {
			report += '\n⚠️ Warnings:\n';
			validationResults.warnings.forEach((warning) => {
				report += `  - ${warning}\n`;
			});
		}

		return report;
	}
}

export default ScopeValidator;

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
	const [, , scopeType, ...files] = process.argv;

	if (!scopeType || files.length === 0) {
		console.error('Usage: tsx scope-validator.ts <scope-type> <file1> [file2] ...');
		process.exit(1);
	}

	const scopesConfig = JSON.parse(readFileSync(new URL('../config/scopes.json', import.meta.url), 'utf8'));
	const validator = new ScopeValidator(scopesConfig[scopeType]);

	const results = validator.validateChanges(files);
	const report = validator.generateReport(results);

	console.log(report);

	// Exit with error code if any files are blocked
	if (results.blocked.length > 0) {
		process.exit(1);
	}
}
