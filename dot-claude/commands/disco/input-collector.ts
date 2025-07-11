/**
 * Input Collection and Validation
 * Handles all user input collection and validation logic
 */

import { readFileSync } from 'fs';
import * as readline from 'readline';
import type { DiscoveryInput, UserFlow, InputCollectionResult } from './types.js';

export class InputCollector {
	/**
	 * Collect input either from file or interactively
	 */
	async collect(inputFile?: string): Promise<InputCollectionResult> {
		// Try file input first if provided
		if (inputFile && inputFile.endsWith('.json')) {
			try {
				const input = this.collectFromFile(inputFile);
				console.log('✓ Loaded input from file');
				return { input, source: 'file' };
			} catch (error) {
				console.log('⚠️  Could not load input file, falling back to interactive mode');
			}
		}

		// Fall back to interactive collection
		const input = await this.collectInteractively();
		return { input, source: 'interactive' };
	}

	/**
	 * Load and validate input from JSON file
	 */
	collectFromFile(filePath: string): DiscoveryInput {
		const inputData = JSON.parse(readFileSync(filePath, 'utf8'));
		return this.validateInput(inputData);
	}

	/**
	 * Collect input through interactive CLI prompts
	 */
	async collectInteractively(): Promise<DiscoveryInput> {
		console.log('🔍 Feature Discovery Process Started');
		console.log('');
		console.log('Please provide the following information:');
		console.log('');

		console.log('1. Business Context:');
		console.log('   (Describe the business impact and stakeholder value)');
		const businessContext = await this.promptForInput('Business Context');

		console.log('');
		console.log('2. In Scope:');
		console.log('   (List functionality explicitly included in this feature)');
		const inScope = await this.promptForList('In Scope Items');

		console.log('');
		console.log('3. Out of Scope:');
		console.log('   (List functionality explicitly excluded from this feature)');
		const outOfScope = await this.promptForList('Out of Scope Items');

		console.log('');
		console.log('4. User Flows:');
		console.log('   (Describe how users will interact with the feature)');
		const userFlows = await this.promptForUserFlows();

		return {
			businessContext,
			inScope,
			outOfScope,
			userFlows,
		};
	}

	/**
	 * Validate input data structure and types
	 */
	validateInput(data: any): DiscoveryInput {
		if (!data.businessContext || typeof data.businessContext !== 'string') {
			throw new Error('Business context is required');
		}
		if (!Array.isArray(data.inScope)) {
			throw new Error('In scope must be an array');
		}
		if (!Array.isArray(data.outOfScope)) {
			throw new Error('Out of scope must be an array');
		}
		if (!Array.isArray(data.userFlows)) {
			throw new Error('User flows must be an array');
		}

		return data as DiscoveryInput;
	}

	/**
	 * Prompt for single line input
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

	/**
	 * Prompt for list of items
	 */
	private async promptForList(prompt: string): Promise<string[]> {
		const items: string[] = [];
		console.log(`${prompt} (enter items one by one, empty line to finish):`);

		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});

		return new Promise((resolve) => {
			const askForItem = () => {
				rl.question(`${items.length + 1}. `, (answer) => {
					const trimmed = answer.trim();
					if (trimmed === '') {
						rl.close();
						resolve(items);
					} else {
						items.push(trimmed);
						askForItem();
					}
				});
			};
			askForItem();
		});
	}

	/**
	 * Prompt for complex user flow structures
	 */
	private async promptForUserFlows(): Promise<UserFlow[]> {
		const flows: UserFlow[] = [];
		console.log('User Flows (press Enter with empty name to finish):');

		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		});

		return new Promise((resolve) => {
			const askForFlow = async () => {
				rl.question(`Flow ${flows.length + 1} name: `, async (name) => {
					if (name.trim() === '') {
						rl.close();
						resolve(flows);
						return;
					}

					rl.question('Description: ', (description) => {
						console.log('Success path steps (empty line to finish):');
						const successPath: string[] = [];

						const collectSuccessSteps = () => {
							rl.question(`Success step ${successPath.length + 1}: `, (step) => {
								if (step.trim() === '') {
									console.log('Failure path steps (empty line to finish):');
									const failurePaths: string[] = [];

									const collectFailureSteps = () => {
										rl.question(`Failure step ${failurePaths.length + 1}: `, (failStep) => {
											if (failStep.trim() === '') {
												flows.push({
													name: name.trim(),
													description: description.trim(),
													successPath,
													failurePaths,
												});
												askForFlow();
											} else {
												failurePaths.push(failStep.trim());
												collectFailureSteps();
											}
										});
									};
									collectFailureSteps();
								} else {
									successPath.push(step.trim());
									collectSuccessSteps();
								}
							});
						};
						collectSuccessSteps();
					});
				});
			};
			askForFlow();
		});
	}
}
