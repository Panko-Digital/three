# Kitchen Designer 3D

A professional kitchen joinery design tool built with React 19, Three.js, and React Three Fiber. This application allows users to design custom kitchens with full 3D visualization and customization options.

## Key Features Added

### 🏠 Room Configuration
- Set room dimensions (width, length, ceiling height)
- Choose from 9 floor colors (wood tones, tiles, concrete)
- Select from 6 wall colors
- Toggle individual walls (North, South, East, West)
- Visual dimension markers on floor
- Realistic room boundaries and outlines

### 🖱️ Mouse Dragging
- Click and drag selected cabinets anywhere on the horizontal plane
- Smooth, intuitive movement
- Maintains cabinet height during drag operations

### ⌨️ Keyboard Controls
- **Arrow Keys**: Move cabinets left/right/forward/back
- **Page Up/Down**: Raise or lower cabinet height
- **Shift + Arrow**: Fine control with 1cm precision
- Perfect for exact alignment and wall-mounted cabinets

### 📐 Grid Snapping
- Toggle-able snap-to-grid (10cm default)
- Ensures clean, aligned layouts when enabled
- Smooth free-form movement when disabled

## Features

### 🏗️ Cabinet Management
- **Add Multiple Cabinets**: Dynamically add cabinets to your kitchen design
- **Customizable Dimensions**: Adjust width (0.3m - 2.0m), height (0.5m - 2.5m), and depth (0.3m - 0.8m)
- **Multiple Doors**: Configure 1-4 doors per cabinet

### 🎨 Material & Finish Options
- **Door Materials**: Choose from 7 premium finishes
  - White Gloss
  - Black Matt
  - Oak Wood
  - Walnut
  - Grey
  - Navy Blue
  - Sage Green
- **Body Materials**: Separate material selection for cabinet bodies
- **Metalness & Roughness**: Realistic PBR materials with proper reflections

### 🚪 Door Types
- **Swing Doors**: Traditional hinged doors
- **Sliding Doors**: Space-saving sliding mechanism with rail indicators
- **Folding Doors**: Bi-fold style doors with visible hinges

### 🔧 Handle Options
- **Handle Types**:
  - Bar handles (vertical)
  - Knobs (spherical)
  - Edge pulls (integrated)
  - No handle (handleless design)
- **Handle Finishes**:
  - Chrome
  - Brass
  - Matte Black
  - Gold

### 📷 Camera Controls
- **Free Orbit**: Full 360° camera control with mouse
- **Preset Views**:
  - Front elevation
  - Back elevation
  - Left elevation
  - Right elevation
  - Top/Plan view
  - Isometric view

### 🎯 Interactive Features
- **Click to Select**: Click any cabinet to select and edit
- **Visual Selection**: Green wireframe indicates selected cabinet
- **Real-time Updates**: All changes reflect immediately in 3D view
- **Professional Grid**: Floor grid for spatial reference

## Technology Stack

- **React 19**: Latest React with modern hooks
- **Three.js**: 3D rendering engine
- **React Three Fiber**: React renderer for Three.js
- **React Three Drei**: Useful helpers and abstractions
- **TypeScript**: Full type safety
- **Vite**: Fast build tool and dev server

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Usage

### Setting Up Your Room
1. **Configure Room Dimensions**: Set width (2-10m), length (2-10m), and height (2-4m)
2. **Choose Floor Color**: Select from wood tones, tiles, or concrete finishes
3. **Configure Walls**: Toggle walls on/off, choose wall color, show/hide individual walls
4. **View Dimension Markers**: Red line = width (X), Cyan line = length (Z)

### Adding & Moving Cabinets
1. **Add a Cabinet**: Click "+ Add Cabinet" button
2. **Select Cabinet**: Click on any cabinet in the 3D view (green outline appears)
3. **Move with Mouse**: Click and drag the selected cabinet
4. **Move with Keyboard**:
   - Arrow keys: Move horizontally
   - Page Up/Down: Change height (for wall cabinets)
   - Shift + Arrow: Fine 1cm adjustments
5. **Position Controls**: Use sliders in the control panel for precise X/Y/Z positioning

### Designing Your Kitchen
1. **Base Cabinets**: Keep at Y=0 (floor level), arrange with mouse or arrows
2. **Wall Cabinets**: Select cabinet, press Page Up to raise to ~1.5-2.0m height
3. **Grid Snapping**: Enable "Snap to Grid" for aligned layouts
4. **Free Placement**: Disable snapping for organic arrangements

### Customization
### Customization
Use the control panel to adjust:
   - Position (X/Y/Z coordinates)
   - Dimensions (width/height/depth)
   - Number of doors
   - Materials
   - Door type
   - Handle style and color
4. **Change View**: Switch between camera presets or use free orbit mode
5. **Delete**: Select a cabinet and click "Delete Cabinet" to remove it

## Project Structure

```
src/
├── components/
│   ├── Cabinet.tsx          # 3D cabinet component
│   ├── KitchenScene.tsx     # Main 3D scene with lighting
│   ├── ControlPanel.tsx     # UI controls sidebar
│   └── ControlPanel.css     # Control panel styles
├── types.ts                 # TypeScript interfaces
├── constants.ts             # Material and color definitions
├── App.tsx                  # Main application component
├── App.css                  # Application layout
└── index.css                # Global styles
```

## Customization

### Adding New Materials
Edit `src/constants.ts` and add new entries to `DEFAULT_MATERIALS`:

```typescript
{
  id: 'custom-material',
  name: 'Custom Material',
  color: '#hexcolor',
  metalness: 0.5,
  roughness: 0.5
}
```

### Adding New Handle Colors
Add entries to `HANDLE_COLORS` in `src/constants.ts`.

### Modifying Camera Positions
Edit `CAMERA_POSITIONS` in `src/components/KitchenScene.tsx`.

## Performance

- Optimized 3D rendering with React Three Fiber
- Efficient re-renders using React 19 features
- Smooth camera transitions
- Professional lighting with environment maps

## Future Enhancements

- Save/Load kitchen designs
- Export to various formats (JSON, PNG, 3D models)
- Countertop customization
- Appliance placement
- Measurements and dimensions overlay
- Cost estimation
- Material texture mapping
- Custom cabinet shapes
- Wall placement and room boundaries
- Cabinet alignment tools (snap to align)
- Duplicate/copy cabinets
- Collision detection
- Undo/redo functionality

## Additional Documentation

- **ROOM_SETUP_GUIDE.md** - Complete guide on room configuration
- **MOVEMENT_GUIDE.md** - Detailed guide on positioning and movement
- **MOVEMENT_UPDATE.md** - Technical details of the positioning system

## License

MIT
