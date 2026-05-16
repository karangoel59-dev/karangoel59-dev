export function getPillColor(type: string) {
	type = type.trim();
	switch (type.toLowerCase()) {
		case 'issue':
			return 'bg-purple-100 text-purple-700';
		case 'development':
			return 'bg-blue-100 text-blue-700';
		case 'chore':
			return 'bg-red-100 text-red-700';
		case 'personal':
			return 'bg-gray-100 text-gray-700';
		case 'work':
			return 'bg-yellow-100 text-yellow-700';
		default:
			return 'bg-slate-100 text-slate-700';
	}
}

export function getTypes(typeString: string) {
	if (!typeString) return [];
	return typeString
		.split(',')
		.map((t) => t.trim())
		.filter(Boolean);
}

export function getBoxColor(typeString: string) {
	const types = getTypes(typeString);
	if (types.length === 0) return 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-900';
	const mainType = types[0].toLowerCase();
	switch (mainType) {
		case 'issue':
			return 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-900';
		case 'development':
			return 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-900';
		case 'chore':
			return 'bg-red-50 hover:bg-red-100 border-red-200 text-red-900';
		case 'personal':
			return 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-900';
		case 'work':
			return 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200 text-yellow-900';
		default:
			return 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-900';
	}
}

export function getDatesFromRange(dateStr: string) {
	if (!dateStr) return ['No Date'];

	const parts = dateStr.split('→').map((s) => s.trim());
	if (parts.length === 1) return [parts[0]];

	// Create dates at noon to avoid timezone/DST boundary issues
	const startDate = new Date(parts[0] + ' 12:00:00');
	const endDate = new Date(parts[1] + ' 12:00:00');

	if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
		return [parts[0]];
	}

	const dates = [];
	const currentDate = new Date(startDate);

	let safety = 0;
	while (currentDate <= endDate && safety < 100) {
		dates.push(
			currentDate.toLocaleDateString('en-US', {
				month: 'long',
				day: 'numeric',
				year: 'numeric'
			})
		);
		currentDate.setDate(currentDate.getDate() + 1);
		safety++;
	}

	return dates;
}

export function getEventColors(typeString: string): { background: string; text: string } {
	if (!typeString) return { background: '#64748b', text: '#ffffff' }; // slate-500
	const types = typeString
		.split(',')
		.map((t) => t.trim())
		.filter(Boolean);
	if (types.length === 0) return { background: '#64748b', text: '#ffffff' };
	const mainType = types[0].toLowerCase();
	switch (mainType) {
		case 'issue':
			return { background: '#a855f7', text: '#ffffff' }; // purple-500
		case 'development':
			return { background: '#3b82f6', text: '#ffffff' }; // blue-500
		case 'chore':
			return { background: '#ef4444', text: '#ffffff' }; // red-500
		case 'personal':
			return { background: '#6b7280', text: '#ffffff' }; // gray-500
		case 'work':
			return { background: '#eab308', text: '#1f2937' }; // yellow-500, text-gray-800
		default:
			return { background: '#64748b', text: '#ffffff' }; // slate-500
	}
}
