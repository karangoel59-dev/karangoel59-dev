const colorPalette = [
	{
		pill: 'bg-pink-100 text-pink-700',
		box: 'bg-pink-50 hover:bg-pink-100 border-pink-200 text-pink-900',
		eventBg: '#ec4899',
		eventText: '#ffffff'
	},
	{
		pill: 'bg-indigo-100 text-indigo-700',
		box: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-900',
		eventBg: '#6366f1',
		eventText: '#ffffff'
	},
	{
		pill: 'bg-teal-100 text-teal-700',
		box: 'bg-teal-50 hover:bg-teal-100 border-teal-200 text-teal-900',
		eventBg: '#14b8a6',
		eventText: '#ffffff'
	},
	{
		pill: 'bg-orange-100 text-orange-700',
		box: 'bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-900',
		eventBg: '#f97316',
		eventText: '#ffffff'
	},
	{
		pill: 'bg-cyan-100 text-cyan-700',
		box: 'bg-cyan-50 hover:bg-cyan-100 border-cyan-200 text-cyan-900',
		eventBg: '#06b6d4',
		eventText: '#ffffff'
	},
	{
		pill: 'bg-green-100 text-green-700',
		box: 'bg-green-50 hover:bg-green-100 border-green-200 text-green-900',
		eventBg: '#22c55e',
		eventText: '#ffffff'
	},
	{
		pill: 'bg-emerald-100 text-emerald-700',
		box: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-900',
		eventBg: '#10b981',
		eventText: '#ffffff'
	},
	{
		pill: 'bg-rose-100 text-rose-700',
		box: 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-900',
		eventBg: '#f43f5e',
		eventText: '#ffffff'
	}
];

const specificColors: Record<
	string,
	{ pill: string; box: string; eventBg: string; eventText: string }
> = {
	issue: {
		pill: 'bg-purple-100 text-purple-700',
		box: 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-900',
		eventBg: '#a855f7',
		eventText: '#ffffff'
	},
	development: {
		pill: 'bg-blue-100 text-blue-700',
		box: 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-900',
		eventBg: '#3b82f6',
		eventText: '#ffffff'
	},
	chore: {
		pill: 'bg-red-100 text-red-700',
		box: 'bg-red-50 hover:bg-red-100 border-red-200 text-red-900',
		eventBg: '#ef4444',
		eventText: '#ffffff'
	},
	personal: {
		pill: 'bg-gray-100 text-gray-700',
		box: 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-900',
		eventBg: '#6b7280',
		eventText: '#ffffff'
	},
	work: {
		pill: 'bg-yellow-100 text-yellow-700',
		box: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200 text-yellow-900',
		eventBg: '#eab308',
		eventText: '#1f2937'
	}
};

function getStringHash(str: string): number {
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	return Math.abs(hash);
}

function getColorForType(type: string) {
	const normalizedType = type.toLowerCase().trim();
	if (specificColors[normalizedType]) {
		return specificColors[normalizedType];
	}
	const index = getStringHash(normalizedType) % colorPalette.length;
	return colorPalette[index];
}

export function getPillColor(type: string) {
	if (!type) return 'bg-slate-100 text-slate-700';
	return getColorForType(type).pill;
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
	return getColorForType(types[0]).box;
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
	const types = getTypes(typeString);
	if (types.length === 0) return { background: '#64748b', text: '#ffffff' };
	const color = getColorForType(types[0]);
	return { background: color.eventBg, text: color.eventText };
}

export const formatDate = (dateStr: string) => {
		if (!dateStr) return '';
		const date = new Date(dateStr);
		if (isNaN(date.getTime())) return dateStr;
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		}).format(date);
	};