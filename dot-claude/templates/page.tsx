import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: '{{PageTitle}}',
	description: '{{PageDescription}}',
};

export default function {{PageName}}() {
	return (
		<div className="container mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold mb-6">{{PageTitle}}</h1>
			
			{/* Page content */}
		</div>
	);
}