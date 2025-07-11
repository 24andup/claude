/**
 * Shared types and interfaces for the disco command
 */

export interface DiscoveryInput {
	businessContext: string;
	inScope: string[];
	outOfScope: string[];
	userFlows: UserFlow[];
}

export interface UserFlow {
	name: string;
	description: string;
	successPath: string[];
	failurePaths: string[];
}

export interface Ticket {
	title: string;
	description: string;
	dependencies: string[];
	estimatedEffort: 'small' | 'medium' | 'large';
	type: 'feature' | 'bug' | 'tech-debt' | 'research';
}

export interface ProjectPlan {
	projectName: string;
	summary: string;
	tickets: Ticket[];
	dependencyMap: string;
}

export interface LinearTeam {
	id: string;
	name: string;
	key?: string;
}

export interface LinearProject {
	id: string;
	name: string;
}

export interface TicketResult {
	id: string;
	title: string;
	url?: string;
}

export interface FeatureContext {
	complexity: 'high' | 'medium' | 'low';
	needsDatabase: boolean;
	needsAPI: boolean;
	needsBackend: boolean;
	needsFrontend: boolean;
	databaseComplexity: 'small' | 'medium' | 'large';
	backendComplexity: 'small' | 'medium' | 'large';
	apiComplexity: 'small' | 'medium' | 'large';
	frontendComplexity: 'small' | 'medium' | 'large';
}

export interface DiscoverySession {
	timestamp: string;
	input: DiscoveryInput | null;
	clarifications: string[];
	projectPlan: ProjectPlan | null;
}

export interface InputCollectionResult {
	input: DiscoveryInput;
	source: 'file' | 'interactive';
}
