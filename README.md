# Markdown Dashboard (karangoel59-dev)

A powerful, SvelteKit-based personal dashboard and knowledge management system that reads, indexes, and visualizes your local Markdown files.

## 🚀 Features

- **Markdown-Driven Knowledge Base:** Upload local directories containing markdown files and images. The app uses [MarkdownDB](https://github.com/flowershow/markdowndb) to parse frontmatter and content, treating your files as a queryable database.
- **Multi-Dataset Support:** Isolate different areas of your life (e.g., "Work Vault", "Personal Vault"). Upload multiple folders and easily switch between them. Each dataset gets its own dedicated SQLite database.
- **Dynamic Views:**
  - **Bookmarks & Links:** Manage and browse links extracted from your markdown metadata.
  - **Notebooks & Journals:** Dedicated views for taking notes, logging activities, and rendering parsed markdown content.
  - **Schedule & Calendar:** Visualize tasks and events over time using [Schedule-X](https://schedule-x.dev/) and Gantt charts.
- **AI Commentator:** Integrated AI-driven insights that interact with your data.
- **Modern UI:** Built with Svelte 5 runes, Tailwind CSS, Lucide icons, and full Dark/Light mode support.

## 🛠️ Tech Stack

- **Framework:** [Svelte 5](https://svelte.dev/5) + [SvelteKit](https://kit.svelte.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Database:** [MarkdownDB](https://markdowndb.com/) (SQLite)
- **Icons:** [Lucide Svelte](https://lucide.dev/)
- **Components:** Custom Material UI-style modals, snackbars, and responsive layouts.

## 📦 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v20+ recommended) installed.

### Installation

1. Clone the repository and navigate to the project directory.
2. Install the dependencies:

```bash
npm install
```

### Running the App

Start the development server:

```bash
npm run dev
```

Open your browser to `http://localhost:5173`. 

### Using the App

1. Click on the **Data Source** button in the top navigation bar.
2. Click **Upload New Folder** and select a directory on your computer containing `.md` files and images.
3. The app will parse the files, initialize a new SQLite database for that dataset, and instantly populate your dashboard.
4. You can upload multiple directories and switch between them in the **Manage Data Source** modal.

## 📁 Project Structure

- `src/lib/components/` - Reusable UI components (Modals, Snackbars, Calendar, etc.)
- `src/lib/server/` - Backend logic including `tasks.ts` (MarkdownDB initialization and queries) and `dataset.ts` (multi-database management).
- `src/routes/` - SvelteKit routes for the dashboard pages and API endpoints (uploading, dataset switching, data clearing).
- `data/` - Auto-generated folder where SQLite databases (`*.db`) and synchronized files are stored.

## 📝 Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run check`: Runs Svelte checks and TypeScript validation.
- `npm run format`: Formats code using Prettier.
- `npm run lint`: Lints code using ESLint.

## 📄 License

This project is private and for personal use.
