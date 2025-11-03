# Kitchen Cabinet Design Software

A 3D kitchen cabinet design tool built with React 19, TypeScript, Three.js, and Vite.

## Features

- **3D Cabinet Visualization**: Real-time 3D rendering using Three.js and React Three Fiber
- **Material Customization**: Choose from 7 different materials with PBR properties
- **Handle Options**: 4 handle types (bar, knob, edge, none) in 4 colors
- **Door Types**: Swing, sliding, and folding doors with visual indicators
- **Interactive Controls**: Mouse dragging and keyboard controls for cabinet positioning
- **Grid Snapping**: Precise placement with configurable grid snapping
- **Room Configuration**: Customizable floor dimensions, colors, and wall opacity
- **Cost Estimation**: Real-time pricing in AUD for materials, hardware, and labor
- **Cabinet Management**: Add, duplicate, delete, and rotate cabinets
- **Multiple Camera Views**: Free camera or preset elevations (front, back, left, right, top, isometric)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the application.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Testing

This project uses Vitest for unit testing with comprehensive coverage.

### Run Tests

```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test -- --run

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

### Test Coverage

The project includes 22 comprehensive tests for the Cabinet component covering:
- Rendering in various configurations
- Door types (swing, sliding, folding)
- Handle types (bar, knob, edge, none)
- Selection states
- Grid snapping
- Material properties
- Callbacks and interactions

See [TESTING.md](./TESTING.md) for detailed testing documentation.

## Technology Stack

- **React 19**: Latest React with modern hooks
- **TypeScript**: Type-safe development
- **Three.js**: 3D graphics rendering
- **React Three Fiber**: React renderer for Three.js
- **@react-three/drei**: Useful helpers for React Three Fiber
- **Vite**: Fast build tool and dev server
- **Vitest**: Unit testing framework
- **Testing Library**: React component testing utilities

## Project Structure

```
src/
├── components/
│   ├── Cabinet.tsx         # 3D cabinet component with interactions
│   ├── CabinetList.tsx     # List of all cabinets
│   ├── ControlPanel.tsx    # Side panel with all controls
│   ├── CostEstimator.tsx   # Cost calculation and display
│   ├── KitchenScene.tsx    # Main 3D scene
│   ├── NavBar.tsx          # Top navigation with camera views
│   └── Room.tsx            # Floor and walls
├── utils/
│   └── costCalculations.ts # Pricing logic
├── types.ts                # TypeScript interfaces
├── constants.ts            # Material and pricing configs
└── App.tsx                 # Root component
```

## Development

### Code Quality

```bash
# Lint code
npm run lint

# Type check
npm run build
```

---

## React + Vite Template Information

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
