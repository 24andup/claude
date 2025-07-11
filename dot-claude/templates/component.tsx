import React from 'react';
import { cn } from '@/lib/utils';

interface {{ComponentName}}Props {
	className?: string;
	children?: React.ReactNode;
}

export default function {{ComponentName}}({ className, children }: {{ComponentName}}Props) {
	return (
		<div className={cn('', className)}>
			{children}
		</div>
	);
}