const tasks = require('./src/lib/tasks.json');
function getDatesFromRange(dateStr) {
	if (!dateStr) return ['No Date'];

	const parts = dateStr.split('→').map((s) => s.trim());
	if (parts.length === 1) return [parts[0]];

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

const tasksByDate = tasks.reduce((acc, task) => {
	const dates = getDatesFromRange(task.Date);
	dates.forEach((date) => {
		if (!acc[date]) {
			acc[date] = [];
		}
		acc[date].push(task);
	});
	return acc;
}, {});

console.log(
	Object.keys(tasksByDate).filter((k) =>
		tasksByDate[k].some((t) => t.Task.includes('Data Capture 1'))
	)
);
console.log(tasks.find((t) => t.Task === 'Data Capture 1').Date);
