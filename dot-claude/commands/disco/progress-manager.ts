/**
 * Progress Management Service
 * Handles saving and restoring session state for error recovery
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { DiscoverySession } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class ProgressManager {
	private readonly progressDir: string;
	private readonly progressFile: string;

	constructor() {
		this.progressDir = join(__dirname, '../../progress');
		this.progressFile = join(this.progressDir, 'disco-progress.json');

		// Ensure progress directory exists
		if (!existsSync(this.progressDir)) {
			mkdirSync(this.progressDir, { recursive: true });
		}
	}

	/**
	 * Save current session progress to disk
	 */
	saveProgress(session: DiscoverySession): void {
		try {
			const progress = {
				...session,
				timestamp: new Date().toISOString(),
			};

			writeFileSync(this.progressFile, JSON.stringify(progress, null, 2));
			console.log(`💾 Progress saved to: ${this.progressFile}`);
		} catch (error) {
			console.error('⚠️  Failed to save progress:', error);
		}
	}

	/**
	 * Load previous session progress from disk
	 */
	loadProgress(): DiscoverySession | null {
		try {
			if (!existsSync(this.progressFile)) {
				return null;
			}

			const progressData = readFileSync(this.progressFile, 'utf8');
			const progress = JSON.parse(progressData) as DiscoverySession;

			console.log(`📂 Loaded previous progress from: ${progress.timestamp}`);
			return progress;
		} catch (error) {
			console.error('⚠️  Failed to load progress:', error);
			return null;
		}
	}

	/**
	 * Clear saved progress
	 */
	clearProgress(): void {
		try {
			if (existsSync(this.progressFile)) {
				// Instead of deleting, we could archive it
				const archiveFile = join(this.progressDir, `disco-progress-${Date.now()}.json`);
				const progressData = readFileSync(this.progressFile, 'utf8');
				writeFileSync(archiveFile, progressData);

				// Clear current progress
				writeFileSync(
					this.progressFile,
					JSON.stringify(
						{
							timestamp: new Date().toISOString(),
							input: null,
							clarifications: [],
							projectPlan: null,
						},
						null,
						2,
					),
				);

				console.log(`🗑️  Progress cleared and archived to: ${archiveFile}`);
			}
		} catch (error) {
			console.error('⚠️  Failed to clear progress:', error);
		}
	}

	/**
	 * Check if there's existing progress that can be resumed
	 */
	hasProgress(): boolean {
		try {
			if (!existsSync(this.progressFile)) {
				return false;
			}

			const progressData = readFileSync(this.progressFile, 'utf8');
			const progress = JSON.parse(progressData) as DiscoverySession;

			// Check if there's meaningful progress to resume
			return !!(progress.input || progress.projectPlan);
		} catch (error) {
			return false;
		}
	}

	/**
	 * Get progress file path for external access
	 */
	getProgressFilePath(): string {
		return this.progressFile;
	}
}
