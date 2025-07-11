/**
 * Linear Integration Service
 * Handles all Linear API operations and team management
 */

import { execSync } from 'child_process';
import * as readline from 'readline';
import type { LinearTeam, LinearProject, ProjectPlan, Ticket, TicketResult } from './types.js';

export class LinearService {
	/**
	 * Validate Linear MCP server setup and authentication
	 */
	async validateSetup(): Promise<boolean> {
		console.log('🔍 Validating Linear MCP server setup...');
		console.log('');
		console.log('⚠️  Note: Linear MCP server validation requires running disco within Claude Code');
		console.log('The disco command assumes Linear MCP server is properly configured.');
		console.log('If Linear operations fail later, check your MCP server setup.');
		console.log('');

		const continueWithLinear = await this.promptForInput('Proceed with Linear integration? (Y/n)');
		return continueWithLinear.toLowerCase() !== 'n' && continueWithLinear.toLowerCase() !== 'no';
	}

	/**
	 * Auto-detect Linear team (returns team if only one exists)
	 */
	async detectTeam(): Promise<LinearTeam | null> {
		try {
			console.log('🔍 Detecting Linear teams...');

			const teamsResult = execSync('claude mcp__linear-server__list_teams', {
				encoding: 'utf8',
				stdio: ['pipe', 'pipe', 'ignore'],
			});

			const teams = JSON.parse(teamsResult);

			// Auto-select if only one team
			if (teams.length === 1) {
				return { id: teams[0].id, name: teams[0].name, key: teams[0].key };
			}

			return null;
		} catch (error) {
			console.log('⚠️  Could not auto-detect Linear team');
			return null;
		}
	}

	/**
	 * Select Linear team (auto-detect or prompt user)
	 */
	async selectTeam(): Promise<LinearTeam> {
		const autoDetected = await this.detectTeam();

		if (autoDetected) {
			console.log(`✓ Auto-selected Linear team: ${autoDetected.name}`);
			return autoDetected;
		}

		// List available teams and prompt for selection
		try {
			const teamsResult = execSync('claude mcp__linear-server__list_teams', {
				encoding: 'utf8',
				stdio: ['pipe', 'pipe', 'ignore'],
			});

			const teams = JSON.parse(teamsResult);

			console.log('🎯 Available Linear teams:');
			teams.forEach((team: any, index: number) => {
				console.log(`${index + 1}. ${team.name} (${team.key})`);
			});

			const selection = await this.promptForInput('Select team number');
			const selectedIndex = parseInt(selection) - 1;

			if (selectedIndex >= 0 && selectedIndex < teams.length) {
				const selectedTeam = teams[selectedIndex];
				return { id: selectedTeam.id, name: selectedTeam.name, key: selectedTeam.key };
			}

			throw new Error('Invalid team selection');
		} catch (error) {
			console.error('❌ Failed to list Linear teams:', error);
			throw error;
		}
	}

	/**
	 * Create Linear project
	 */
	async createProject(projectPlan: ProjectPlan, team: LinearTeam): Promise<LinearProject> {
		console.log(`✓ Creating project: ${projectPlan.projectName}`);

		const createProjectCmd = `claude mcp__linear-server__create_project --name "${projectPlan.projectName}" --summary "${projectPlan.summary}" --teamId "${team.id}"`;
		const projectResult = execSync(createProjectCmd, {
			encoding: 'utf8',
			stdio: ['pipe', 'pipe', 'ignore'],
		});

		const project = JSON.parse(projectResult);
		console.log(`✓ Created project: ${project.name} (${project.id})`);

		return { id: project.id, name: project.name };
	}

	/**
	 * Create tickets with dependency relationships
	 */
	async createTickets(tickets: Ticket[], project: LinearProject, team: LinearTeam): Promise<TicketResult[]> {
		const createdTickets: { [title: string]: TicketResult } = {};
		const results: TicketResult[] = [];

		// First pass: create tickets without dependencies
		for (const ticket of tickets) {
			if (ticket.dependencies.length === 0) {
				const result = await this.createSingleTicket(ticket, project, team);
				createdTickets[ticket.title] = result;
				results.push(result);
			}
		}

		// Second pass: create tickets with dependencies and link them
		for (const ticket of tickets) {
			if (ticket.dependencies.length > 0) {
				const result = await this.createSingleTicket(ticket, project, team);
				createdTickets[ticket.title] = result;
				results.push(result);

				// Add dependency comments
				await this.addDependencyComments(result, ticket.dependencies, createdTickets);
			}
		}

		return results;
	}

	/**
	 * Create a single Linear ticket
	 */
	private async createSingleTicket(ticket: Ticket, project: LinearProject, team: LinearTeam): Promise<TicketResult> {
		console.log(`✓ Creating ticket: ${ticket.title}`);

		const createTicketCmd = `claude mcp__linear-server__create_issue --title "${ticket.title}" --description "${ticket.description}" --teamId "${team.id}" --projectId "${project.id}"`;
		const ticketResult = execSync(createTicketCmd, {
			encoding: 'utf8',
			stdio: ['pipe', 'pipe', 'ignore'],
		});

		const createdTicket = JSON.parse(ticketResult);
		return {
			id: createdTicket.id,
			title: ticket.title,
			url: createdTicket.url,
		};
	}

	/**
	 * Add dependency relationship comments to tickets
	 */
	private async addDependencyComments(
		ticket: TicketResult,
		dependencies: string[],
		createdTickets: { [title: string]: TicketResult },
	): Promise<void> {
		for (const dep of dependencies) {
			if (createdTickets[dep]) {
				const commentBody = `This issue depends on: ${dep} (${createdTickets[dep].id})`;
				const addCommentCmd = `claude mcp__linear-server__create_comment --issueId "${ticket.id}" --body "${commentBody}"`;

				try {
					execSync(addCommentCmd, {
						encoding: 'utf8',
						stdio: ['pipe', 'pipe', 'ignore'],
					});
				} catch (error) {
					console.log(`⚠️  Could not add dependency comment for ${ticket.title}`);
				}
			}
		}
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
