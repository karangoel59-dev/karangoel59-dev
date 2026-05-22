import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			manifest: {
				name: 'Karangoel59 Dev',
				short_name: 'DevApp',
				description: 'My Developer Dashboard',
				theme_color: '#ffffff',
				background_color: '#ffffff',
				display: 'standalone',
				icons: [
					{
						src: '/icon.jpeg',
						sizes: '192x192',
						type: 'image/jpeg'
					},
					{
						src: '/icon.jpeg',
						sizes: '512x512',
						type: 'image/jpeg'
					}
				]
			}
		})
	]
});
