#!/usr/bin/env -S pnpm tsx

/**
 * Discovery Command - Refactored Architecture
 * Feature discovery and Linear project planning with clean separation of concerns
 */

import { DiscoveryOrchestrator } from './orchestrator.js';

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
	const orchestrator = new DiscoveryOrchestrator();
	const inputFile = process.argv[2];

	orchestrator.run(inputFile);
}

export { DiscoveryOrchestrator } from './orchestrator.js';
export { InputCollector } from './input-collector.js';
export { LinearService } from './linear-service.js';
export { FeatureAnalyzer } from './feature-analyzer.js';
export { ProgressManager } from './progress-manager.js';
export * from './types.js';
