# Daily Journal

> A beautiful desktop journaling app for morning reflections and evening reviews

Version: **1.1.0**

## Overview

Daily Journal is an Electron-based desktop application that helps you maintain a consistent journaling practice. The app features a book-like interface with morning and evening journal sections displayed side-by-side, making it easy to plan your day and reflect on your experiences.

## Features

- **Morning Journal** - Start your day with gratitude, intentions, goals, and affirmations
- **Evening Journal** - Reflect on highlights, challenges, learnings, accomplishments, and improvements
- **Book-Style Layout** - Side-by-side journal pages that grow together as you write
- **Custom Title Bar** - Draggable title bar with gradient design
- **Local Storage** - All entries saved locally on your machine
- **Journal History** - View, edit, and delete past entries
- **Date Display** - Automatic local timezone formatting
- **Responsive Design** - Clean, modern UI with Tailwind CSS

## Tech Stack

- **Electron** - Desktop app framework
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Tailwind CSS v4** - Styling
- **Lucide React** - Icons
- **shadcn/ui** - UI components

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/journal-app.git
cd journal-app
```

2. Install dependencies:
```bash
npm install
```

3. Run in development mode:
```bash
npm run dev
```

The app will automatically launch in an Electron window.

## Scripts

- `npm run dev` - Start development server and launch Electron app
- `npm run build` - Build for production and package with electron-builder
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Building for Distribution

### macOS
```bash
npm run build
```

This will create a `.dmg` installer in the `release` directory.

## Project Structure

```
journal-app/
├── electron/          # Electron main process
│   ├── main.ts       # Main process entry
│   └── preload.ts    # Preload script
├── src/
│   ├── components/   # React components
│   │   ├── MorningJournal.tsx
│   │   ├── EveningJournal.tsx
│   │   ├── JournalHistory.tsx
│   │   ├── TitleBar.tsx
│   │   └── ui/       # shadcn/ui components
│   ├── lib/          # Utilities
│   ├── types/        # TypeScript types
│   └── App.tsx       # Main app component
└── package.json
```

## Data Storage

Journal entries are stored locally in JSON format at:
- **macOS**: `~/Library/Application Support/journal-app/journal-data.json`
- **Windows**: `%APPDATA%/journal-app/journal-data.json`
- **Linux**: `~/.config/journal-app/journal-data.json`

## Recent Updates (v1.1.0)

- Added custom draggable title bar with gradient design
- Implemented fixed title bar with scrollable content area
- Reorganized header: centered app title with right-aligned navigation
- Updated journal cards to grow together maintaining equal heights
- Optimized spacing and layout for better visual hierarchy
- Fixed date formatting to use local timezone
- Configured `npm run dev` to automatically launch Electron app
- Improved scrolling behavior and overflow handling

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
