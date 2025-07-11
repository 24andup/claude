/**
 * Feature Analysis Service
 * Handles AI-powered analysis, ticket generation, and dependency mapping
 */

import type { DiscoveryInput, Ticket, FeatureContext, ProjectPlan } from './types.js';

export class FeatureAnalyzer {
	/**
	 * Generate clarification questions based on input
	 */
	generateClarifications(input: DiscoveryInput): string[] {
		// AI-powered clarification generation would go here
		// For now, example clarifications based on common patterns
		const clarifications = [
			'Should this feature support real-time updates or batch processing?',
			'What are the performance requirements (concurrent users, response time)?',
			'Are there any specific compliance or security requirements?',
			'Should this integrate with existing authentication/authorization?',
			'What level of audit logging is required?',
		];

		// Could enhance this with context-aware questions based on input analysis
		const scopeText = input.inScope.join(' ').toLowerCase();

		if (scopeText.includes('api') || scopeText.includes('integration')) {
			clarifications.push('What external systems need to be integrated?');
		}

		if (scopeText.includes('user') || scopeText.includes('interface')) {
			clarifications.push('Are there specific accessibility requirements?');
		}

		if (scopeText.includes('data') || scopeText.includes('store')) {
			clarifications.push('What are the data retention and backup requirements?');
		}

		return clarifications;
	}

	/**
	 * Analyze feature context to determine complexity and component needs
	 */
	analyzeFeatureContext(input: DiscoveryInput): FeatureContext {
		const scopeText = input.inScope.join(' ').toLowerCase();
		const contextText = input.businessContext.toLowerCase();
		const flowsText = input.userFlows
			.map((f) => f.description)
			.join(' ')
			.toLowerCase();

		const allText = `${scopeText} ${contextText} ${flowsText}`;

		// Determine complexity based on scope and flows
		const complexityIndicators = [
			'integration',
			'real-time',
			'ai',
			'machine learning',
			'analytics',
			'reporting',
			'multi-tenant',
			'oauth',
			'webhook',
			'streaming',
		];
		const isComplex =
			complexityIndicators.some((indicator) => allText.includes(indicator)) ||
			input.inScope.length > 5 ||
			input.userFlows.length > 3;

		// Determine what components are needed
		const needsDatabase = ['store', 'save', 'persist', 'database', 'record', 'track', 'data'].some((term) =>
			allText.includes(term),
		);
		const needsAPI =
			['api', 'endpoint', 'request', 'response', 'integration', 'webhook'].some((term) => allText.includes(term)) ||
			needsDatabase;
		const needsBackend =
			needsAPI ||
			needsDatabase ||
			['logic', 'process', 'calculate', 'validate', 'service'].some((term) => allText.includes(term));
		const needsFrontend = ['ui', 'interface', 'form', 'display', 'show', 'user', 'component'].some((term) =>
			allText.includes(term),
		);

		// Estimate complexity for each area
		const getComplexity = (area: string[]): 'small' | 'medium' | 'large' => {
			const relevantScope = input.inScope.filter((item) => area.some((term) => item.toLowerCase().includes(term)));
			if (relevantScope.length > 3) return 'large';
			if (relevantScope.length > 1) return 'medium';
			return 'small';
		};

		return {
			complexity: isComplex ? 'high' : 'medium',
			needsDatabase,
			needsAPI,
			needsBackend,
			needsFrontend,
			databaseComplexity: getComplexity(['data', 'model', 'schema', 'table']),
			backendComplexity: getComplexity(['service', 'logic', 'process', 'business']),
			apiComplexity: getComplexity(['endpoint', 'api', 'request', 'integration']),
			frontendComplexity: getComplexity(['ui', 'component', 'form', 'interface']),
		};
	}

	/**
	 * Generate context-aware tickets based on feature analysis
	 */
	generateTickets(input: DiscoveryInput): Ticket[] {
		const tickets: Ticket[] = [];
		const context = this.analyzeFeatureContext(input);

		// Always start with research/planning if complex
		if (context.complexity === 'high') {
			tickets.push({
				title: 'Technical Discovery & Architecture Planning',
				description: `Research technical approach, define architecture, and create implementation plan for: ${input.businessContext}`,
				dependencies: [],
				estimatedEffort: 'medium',
				type: 'research',
			});
		}

		// Database changes if needed
		if (context.needsDatabase) {
			tickets.push({
				title: 'Database Schema & Migration',
				description: 'Design and implement database schema changes, create migrations, update models',
				dependencies: context.complexity === 'high' ? ['Technical Discovery & Architecture Planning'] : [],
				estimatedEffort: context.databaseComplexity,
				type: 'feature',
			});
		}

		// Backend service implementation
		if (context.needsBackend) {
			const backendDeps = context.needsDatabase
				? ['Database Schema & Migration']
				: context.complexity === 'high'
					? ['Technical Discovery & Architecture Planning']
					: [];

			tickets.push({
				title: 'Backend Service Implementation',
				description: 'Implement business logic, service layer, validation, and error handling',
				dependencies: backendDeps,
				estimatedEffort: context.backendComplexity,
				type: 'feature',
			});
		}

		// API endpoints
		if (context.needsAPI) {
			tickets.push({
				title: 'API Endpoints & Authentication',
				description: 'Create REST API endpoints with proper authentication, validation, and error responses',
				dependencies: context.needsBackend ? ['Backend Service Implementation'] : [],
				estimatedEffort: context.apiComplexity,
				type: 'feature',
			});
		}

		// Frontend implementation
		if (context.needsFrontend) {
			const frontendDeps = context.needsAPI ? ['API Endpoints & Authentication'] : [];

			tickets.push({
				title: 'Frontend Components & UI',
				description: 'Build user interface components, forms, interactions, and responsive design',
				dependencies: frontendDeps,
				estimatedEffort: context.frontendComplexity,
				type: 'feature',
			});
		}

		// Integration and testing (depends on the last implementation ticket)
		if (tickets.length > 0) {
			const lastImplementationTicket = tickets[tickets.length - 1];

			tickets.push({
				title: 'Integration Testing & QA',
				description: 'End-to-end testing, quality assurance, performance validation, and bug fixes',
				dependencies: [lastImplementationTicket.title],
				estimatedEffort: 'small',
				type: 'feature',
			});
		}

		return tickets;
	}

	/**
	 * Create complete project plan with tickets and dependency map
	 */
	generateProjectPlan(input: DiscoveryInput): ProjectPlan {
		const tickets = this.generateTickets(input);
		const dependencyMap = this.createDependencyMap(tickets);
		const projectName = `Feature: ${this.extractFeatureName(input)}`;

		return {
			projectName,
			summary: input.businessContext,
			tickets,
			dependencyMap,
		};
	}

	/**
	 * Create ASCII dependency visualization
	 */
	createDependencyMap(tickets: Ticket[]): string {
		let map = '\n';
		map += '┌─────────────────────────────────────┐\n';
		map += '│           Dependency Flow           │\n';
		map += '├─────────────────────────────────────┤\n';

		const processed = new Set<string>();
		const queue = tickets.filter((t) => t.dependencies.length === 0);

		while (queue.length > 0) {
			const current = queue.shift()!;
			if (processed.has(current.title)) continue;

			const indent = this.getIndentLevel(current, tickets, processed);
			map += `│ ${'  '.repeat(indent)}• ${current.title}\n`;

			processed.add(current.title);

			// Add dependents to queue
			const dependents = tickets.filter((t) => t.dependencies.includes(current.title) && !processed.has(t.title));
			queue.push(...dependents);
		}

		map += '└─────────────────────────────────────┘\n';
		return map;
	}

	/**
	 * Extract a concise feature name from business context
	 */
	private extractFeatureName(input: DiscoveryInput): string {
		// Extract feature name from business context
		const words = input.businessContext.split(' ').slice(0, 3);
		return words.join(' ');
	}

	/**
	 * Calculate indentation level for dependency visualization
	 */
	private getIndentLevel(ticket: Ticket, allTickets: Ticket[], processed: Set<string>): number {
		if (ticket.dependencies.length === 0) return 0;

		const maxDepLevel = Math.max(
			...ticket.dependencies.map((dep) => {
				const depTicket = allTickets.find((t) => t.title === dep);
				return depTicket ? this.getIndentLevel(depTicket, allTickets, processed) : 0;
			}),
		);

		return maxDepLevel + 1;
	}
}
