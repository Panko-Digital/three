# Cabinet Movement & Positioning Guide

## Overview
The kitchen designer now includes comprehensive cabinet positioning features with multiple input methods for precise placement.

## Movement Methods

### 1. **Mouse Dragging** (Free Movement)
- **Select** a cabinet by clicking on it (green outline appears)
- **Drag** the selected cabinet by clicking and dragging anywhere on the canvas
- Cabinet moves on a horizontal plane at its current height
- Works in any camera view

### 2. **Keyboard Controls** (Precise Nudging)
When a cabinet is selected, use these keyboard shortcuts:

| Key | Action | Notes |
|-----|--------|-------|
| `←` Arrow Left | Move left (X-) | |
| `→` Arrow Right | Move right (X+) | |
| `↑` Arrow Up | Move forward (Z-) | |
| `↓` Arrow Down | Move backward (Z+) | |
| `Page Up` | Move up (Y+) | Raise cabinet height |
| `Page Down` | Move down (Y-) | Lower cabinet (min Y=0) |
| `Shift` + Arrow | Fine control | 1cm steps instead of 10cm |

### 3. **UI Sliders** (Visual Control)
In the control panel when a cabinet is selected:
- **X Position**: -5m to +5m (left to right)
- **Y Position**: 0m to 3m (floor to ceiling)
- **Z Position**: -5m to +5m (back to front)

All sliders respect the grid snapping setting.

## Grid Snapping

### Toggle Grid Snap
- **Checkbox**: "Snap to Grid (0.1m)" in the Positioning section
- **When ON**: All movements snap to 10cm (0.1m) grid
- **When OFF**: Smooth continuous movement

### Grid Size
- Default: 0.1m (10cm) - industry standard
- Applied to:
  - Mouse dragging
  - Keyboard movements (except Shift+Arrow)
  - UI slider steps

## Use Cases

### Wall-Mounted Cabinets
1. Add a cabinet
2. Use `Page Up` to raise it to desired height (e.g., Y = 1.5m)
3. Position horizontally with arrow keys or mouse

### Base Cabinets
1. Add a cabinet
2. Keep at Y = 0 (floor level)
3. Arrange with mouse dragging for quick layout

### Precise Alignment
1. Enable "Snap to Grid"
2. Use arrow keys for exact positioning
3. Use sliders to verify exact measurements

### Free-Form Design
1. Disable "Snap to Grid"
2. Use mouse for organic placement
3. Use Shift+Arrow keys for micro-adjustments

## Tips

- **Select First**: Must select a cabinet before moving with keyboard
- **Camera Views**: Use orthographic views (Front, Top, Left) for precise alignment
- **Isometric View**: Best for general layout and dragging
- **Free Camera**: Use for visualizing the final design
- **Floor Protection**: Cabinets can't be moved below Y=0 (floor level)

## Technical Details

### Coordinate System
- **X-axis**: Left (-) to Right (+)
- **Y-axis**: Down (-) to Up (+)
- **Z-axis**: Back (-) to Front (+)
- **Origin**: Center of the floor grid

### Movement Increments
- **Grid Snap On**: 0.1m steps
- **Grid Snap Off (normal)**: 0.1m steps for keyboard
- **Grid Snap Off (Shift)**: 0.01m (1cm) fine steps
- **Mouse**: Continuous (respects snap setting)

### Performance
- Real-time position updates
- Smooth dragging with raycasting
- No lag even with multiple cabinets
