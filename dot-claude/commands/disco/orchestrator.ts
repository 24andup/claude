/**
 * Discovery Orchestrator
 * Coordinates the entire discovery workflow and handles user interaction
 */

import * as readline from 'readline';
import { InputCollector } from './input-collector.js';
import { LinearService } from './linear-service.js';
import { FeatureAnalyzer } from './feature-analyzer.js';
import { ProgressManager } from './progress-manager.js';
import type { DiscoverySession, DiscoveryInput, ProjectPlan } from './types.js';

export class DiscoveryOrchestrator {
	private inputCollector: InputCollector;
	private linearService: LinearService;
	private featureAnalyzer: FeatureAnalyzer;
	private progressManager: ProgressManager;

	private session: DiscoverySession;

	constructor() {
		this.inputCollector = new InputCollector();
		this.linearService = new LinearService();
		this.featureAnalyzer = new FeatureAnalyzer();
		this.progressManager = new ProgressManager();

		// Initialize empty session
		this.session = {
			timestamp: new Date().toISOString(),
			input: null,
			clarifications: [],
			projectPlan: null,
		};
	}

	/**
	 * Main workflow orchestration
	 */
	async run(inputFile?: string): Promise<void> {
		try {
			console.log('🔍 Feature Discovery Mode Activated');
			console.log('📋 Planning large features with Linear integration');
			console.log('');

			// Check for existing progress
			await this.checkExistingProgress();

			// Step 1: Validate Linear setup
			const linearAvailable = await this.linearService.validateSetup();

			// Step 2: Collect input (if not already loaded)
			if (!this.session.input) {
				await this.collectInput(inputFile);
			}

			// Step 3: Generate clarifications
			await this.generateClarifications();

			// Step 4: Generate ticket breakdown
			await this.generateTicketBreakdown();

			console.log('');

			// Step 5: Handle Linear integration or local save
			if (linearAvailable) {
				await this.handleLinearIntegration();
			} else {
				await this.saveLocalProgress();
			}
		} catch (error) {
			await this.handleError(error as Error, 'discovery process');
		}
	}

	/**
	 * Check for and optionally resume existing progress
	 */
	private async checkExistingProgress(): Promise<void> {
		if (this.progressManager.hasProgress()) {
			const resume = await this.promptForInput('Previous progress found. Resume? (y/N)');

			if (resume.toLowerCase() === 'y' || resume.toLowerCase() === 'yes') {
				const savedProgress = this.progressManager.loadProgress();
				if (savedProgress) {
					this.session = savedProgress;
					console.log('✓ Resumed previous session');
				}
			} else {
				this.progressManager.clearProgress();
			}
		}
	}

	/**
	 * Collect and validate input
	 */
	private async collectInput(inputFile?: string): Promise<void> {
		try {
			const result = await this.inputCollector.collect(inputFile);
			this.session.input = result.input;

			// Save progress after successful input collection
			this.progressManager.saveProgress(this.session);
		} catch (error) {
			throw new Error(`Input collection failed: ${error}`);
		}
	}

	/**
	 * Generate clarification questions
	 */
	private async generateClarifications(): Promise<void> {
		if (!this.session.input) {
			throw new Error('Input not collected');
		}

		console.log('🤔 Analyzing requirements and generating clarifications...');

		this.session.clarifications = this.featureAnalyzer.generateClarifications(this.session.input);

		console.log('');
		console.log('📋 Clarification Questions:');
		this.session.clarifications.forEach((q, i) => {
			console.log(`${i + 1}. ${q}`);
		});

		console.log('');
		console.log('Please review these questions and provide answers.');
		console.log('Type "continue" when ready to proceed with ticket breakdown.');

		const continueResponse = await this.promptForInput('Ready to continue? (continue)');
		if (continueResponse.toLowerCase() !== 'continue') {
			console.log('Please address the clarifications and run the command again.');
			return;
		}
	}

	/**
	 * Generate intelligent ticket breakdown
	 */
	private async generateTicketBreakdown(): Promise<void> {
		if (!this.session.input) {
			throw new Error('Input not collected');
		}

		console.log('🎫 Generating intelligent ticket breakdown...');

		this.session.projectPlan = this.featureAnalyzer.generateProjectPlan(this.session.input);

		console.log('');
		console.log('📊 Proposed Ticket Breakdown:');
		console.log('');

		this.session.projectPlan.tickets.forEach((ticket, i) => {
			console.log(`${i + 1}. ${ticket.title} [${ticket.estimatedEffort}]`);
			console.log(`   ${ticket.description}`);
			if (ticket.dependencies.length > 0) {
				console.log(`   Dependencies: ${ticket.dependencies.join(', ')}`);
			}
			console.log('');
		});

		console.log('🗺️  Dependency Map:');
		console.log(this.session.projectPlan.dependencyMap);

		// Save progress after successful analysis
		this.progressManager.saveProgress(this.session);
	}

	/**
	 * Handle Linear project creation
	 */
	private async handleLinearIntegration(): Promise<void> {
		if (!this.session.projectPlan) {
			throw new Error('Project plan not generated');
		}

		console.log('Ready to create Linear project and tickets.');
		console.log('Type "approve" to proceed or "modify" to make changes.');

		const approval = await this.promptForInput('Proceed with Linear creation? (y/N)');

		if (approval.toLowerCase() === 'y' || approval.toLowerCase() === 'yes') {
			try {
				const team = await this.linearService.selectTeam();
				const project = await this.linearService.createProject(this.session.projectPlan, team);
				const tickets = await this.linearService.createTickets(this.session.projectPlan.tickets, project, team);

				console.log('');
				console.log('🎉 Successfully created Linear project and tickets!');
				console.log(`🔗 Project: ${project.name}`);
				console.log(`📊 Created ${tickets.length} tickets`);

				// Clear progress after successful Linear creation
				this.progressManager.clearProgress();
			} catch (error) {
				throw new Error(`Linear integration failed: ${error}`);
			}
		} else {
			await this.saveLocalProgress();
		}
	}

	/**
	 * Save progress locally when Linear integration isn't used
	 */
	private async saveLocalProgress(): Promise<void> {
		console.log('💾 Project plan created and saved locally.');
		console.log('You can manually create Linear tickets using the breakdown above.');
		this.progressManager.saveProgress(this.session);
	}

	/**
	 * Handle errors with appropriate recovery actions
	 */
	private async handleError(error: Error, stage: string): Promise<void> {
		console.error(`❌ ${stage} failed:`, error.message);

		// Save progress for recovery
		this.progressManager.saveProgress(this.session);

		console.log('💾 Progress saved for recovery. You can resume by running the command again.');

		// Don't re-throw the error to allow graceful exit
	}

	/**
	 * Helper method for prompting user input
	 */
	private async promptForInput(prompt: string): Promise<string> {
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});

		return new Promise((resolve) => {
			rl.question(`${prompt}: `, (answer) => {
				rl.close();
				resolve(answer.trim());
			});
		});
	}
}
