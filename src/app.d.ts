// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module '@event-calendar/core';
declare module '@event-calendar/day-grid';
declare module '@event-calendar/time-grid';
declare module '@event-calendar/list';

export {};
