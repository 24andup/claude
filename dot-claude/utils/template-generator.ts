#!/usr/bin/env -S pnpm tsx

/**
 * Template Generator Utility
 * Generates new files from templates with variable substitution
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname } from 'path';

interface TemplateVariables {
	[key: string]: string;
}

interface ComponentProps extends TemplateVariables {
	ComponentName: string;
}

interface PageProps extends TemplateVariables {
	PageName: string;
	PageTitle?: string;
	PageDescription?: string;
	title?: string;
	description?: string;
}

interface ApiRouteProps extends TemplateVariables {
	RouteName: string;
}

class TemplateGenerator {
	private templatesDir: string;

	constructor(templatesDir: string) {
		this.templatesDir = templatesDir;
	}

	generateFile(templateName: string, outputPath: string, variables: TemplateVariables = {}): void {
		const templatePath = join(this.templatesDir, `${templateName}.tsx`);

		if (!existsSync(templatePath)) {
			throw new Error(`Template ${templateName} not found at ${templatePath}`);
		}

		let content = readFileSync(templatePath, 'utf8');

		// Replace template variables
		for (const [key, value] of Object.entries(variables)) {
			const regex = new RegExp(`{{${key}}}`, 'g');
			content = content.replace(regex, value);
		}

		// Ensure output directory exists
		const outputDir = dirname(outputPath);
		if (!existsSync(outputDir)) {
			mkdirSync(outputDir, { recursive: true });
		}

		writeFileSync(outputPath, content);

		console.log(`✅ Generated ${outputPath} from ${templateName} template`);
	}

	generateComponent(componentName: string, outputPath: string, props: Partial<ComponentProps> = {}): void {
		const variables: ComponentProps = {
			ComponentName: componentName,
			...props,
		};

		this.generateFile('component', outputPath, variables);
	}

	generatePage(pageName: string, outputPath: string, props: Partial<PageProps> = {}): void {
		const variables: PageProps = {
			PageName: pageName,
			PageTitle: props.title || pageName,
			PageDescription: props.description || `${pageName} page`,
			...props,
		};

		this.generateFile('page', outputPath, variables);
	}

	generateApiRoute(routeName: string, outputPath: string, props: Partial<ApiRouteProps> = {}): void {
		const variables: ApiRouteProps = {
			RouteName: routeName,
			...props,
		};

		this.generateFile('api-route', outputPath, variables);
	}

	listTemplates(): string[] {
		const templates = readdirSync(this.templatesDir)
			.filter((file) => file.endsWith('.tsx') || file.endsWith('.ts'))
			.map((file) => file.replace(/\.(tsx|ts)$/, ''));

		return templates;
	}
}

export default TemplateGenerator;

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
	const [, , command, ...args] = process.argv;

	const templatesDir = join(dirname(new URL(import.meta.url).pathname), '..', 'templates');
	const generator = new TemplateGenerator(templatesDir);

	switch (command) {
		case 'list':
			console.log('Available templates:');
			generator.listTemplates().forEach((template) => {
				console.log(`  - ${template}`);
			});
			break;

		case 'component':
			const [componentName, componentPath] = args;
			if (!componentName || !componentPath) {
				console.error('Usage: tsx template-generator.ts component <ComponentName> <output-path>');
				process.exit(1);
			}
			generator.generateComponent(componentName, componentPath);
			break;

		case 'page':
			const [pageName, pagePath, pageTitle] = args;
			if (!pageName || !pagePath) {
				console.error('Usage: tsx template-generator.ts page <PageName> <output-path> [title]');
				process.exit(1);
			}
			generator.generatePage(pageName, pagePath, { title: pageTitle });
			break;

		case 'api-route':
			const [routeName, routePath] = args;
			if (!routeName || !routePath) {
				console.error('Usage: tsx template-generator.ts api-route <RouteName> <output-path>');
				process.exit(1);
			}
			generator.generateApiRoute(routeName, routePath);
			break;

		default:
			console.error('Usage: tsx template-generator.ts <list|component|page|api-route> [args...]');
			process.exit(1);
	}
}
