# Room Setup & Configuration Guide

## Overview
The kitchen designer now includes comprehensive room configuration features, allowing you to define your actual kitchen space with customizable dimensions, flooring, and walls.

## Room Features

### 🏠 Room Dimensions
Define your kitchen space with precise measurements:

| Dimension | Range | Default | Purpose |
|-----------|-------|---------|---------|
| **Width (X-axis)** | 2m - 10m | 4m | Left to right dimension |
| **Length (Z-axis)** | 2m - 10m | 5m | Front to back dimension |
| **Height (Ceiling)** | 2.0m - 4.0m | 2.7m | Floor to ceiling height |

### 🎨 Floor Configuration
Choose from 9 professional flooring options:

**Wood Finishes:**
- Light Oak - #D4A574
- Dark Oak - #8B6914
- Walnut - #5C4033
- Ash Grey - #B8B8B8
- Maple - #E8C89C

**Tile Finishes:**
- White Tile - #F5F5F5
- Grey Tile - #696969
- Black Tile - #2C2C2C
- Concrete - #A9A9A9

### 🧱 Wall Configuration

**Wall Color Options:**
- White - #FFFFFF
- Off-White - #F8F8F8
- Light Grey - #D3D3D3
- Warm Grey - #C0C0C0
- Beige - #F5F5DC
- Cream - #FFFDD0

**Individual Wall Control:**
- North Wall (back of room)
- South Wall (front of room)
- East Wall (right side)
- West Wall (left side)

Each wall can be toggled independently for optimal visibility when placing cabinets.

## Visual Features

### Dimension Markers
The room includes colored reference lines on the floor:
- **Red Line**: Width (X-axis) - along the front edge
- **Cyan Line**: Length (Z-axis) - along the right edge

### Wall Outlines
When walls are visible, grey outlines show:
- Floor-to-ceiling edges
- Wall corners
- Room boundaries

### Floor Border
A dark grey outline marks the floor perimeter, making the room boundaries clear.

## Using Room Setup

### Setting Up Your Kitchen Space

1. **Measure Your Real Kitchen**
   - Width: Measure left to right
   - Length: Measure front to back
   - Height: Measure floor to ceiling

2. **Configure in the App**
   - Open the "Room Setup" section
   - Adjust width slider (2-10m)
   - Adjust length slider (2-10m)
   - Adjust height slider (2.0-4.0m)

3. **Choose Flooring**
   - Select from dropdown menu
   - Preview updates instantly
   - Match your real kitchen's floor

4. **Configure Walls**
   - Toggle "Show Walls" checkbox
   - Select wall color
   - Toggle individual walls for better view access

### Room Configuration Workflow

**For New Kitchen Design:**
1. Start with room dimensions first
2. Choose floor color
3. Enable walls for reference
4. Begin adding cabinets within the room space

**For Renovation Planning:**
1. Input exact room measurements
2. Match floor and wall colors to existing space
3. Visualize new cabinets in the real environment

**For Client Presentations:**
1. Set accurate room dimensions
2. Use realistic floor/wall colors
3. Show walls for context
4. Hide walls for detailed cabinet views

### Camera Views for Room Setup

Different camera angles work best for different tasks:

- **Top View**: Perfect for checking room dimensions and floor layout
- **Isometric**: Best for overall room visualization with walls
- **Front/Side Views**: Ideal for wall-mounted cabinet placement
- **Free Camera**: Explore room from any angle

### Hiding Walls

Toggle off individual walls to:
- Access interior corners
- Place wall-mounted cabinets
- View from outside the room
- Take clean screenshots

**Example Configurations:**

**U-Shaped Kitchen:**
- Hide North wall to access back cabinets
- Keep South/East/West walls visible

**Galley Kitchen:**
- Hide East and West walls
- Keep North and South for reference

**Island Kitchen:**
- Show all walls for full context
- Or hide one wall for easy access

## Room & Cabinet Interaction

### Cabinet Placement Within Room
- Cabinets can be positioned anywhere within floor bounds
- Floor dimensions define usable space
- Wall height indicates maximum cabinet height

### Using Walls as Reference
- Walls help visualize cabinet placement against actual room
- Wall outlines show exact mounting points
- Height reference for upper cabinets

### Dimension Markers
Floor markers help with:
- Measuring cabinet runs
- Checking clearances
- Planning work triangle
- Ensuring proper spacing

## Best Practices

### Standard Kitchen Dimensions
- **Small Kitchen**: 2.5m × 3m
- **Medium Kitchen**: 3.5m × 4m
- **Large Kitchen**: 4m × 5m+
- **Ceiling Height**: 2.4m - 2.7m (standard), 3m+ (high ceiling)

### Working Space Requirements
- **Walkway**: Minimum 1m clearance
- **Work Triangle**: 4m - 6m total (sink/stove/fridge)
- **Counter Runs**: Base cabinets 0.6m deep + 1m walkway = 1.6m

### Cabinet to Wall Placement
- Base cabinets: Align against walls (0.05m - 0.1m gap)
- Upper cabinets: 1.5m - 1.8m from floor
- Between uppers and base: 0.5m - 0.6m backsplash area

## Technical Details

### Coordinate System
- **Origin**: Center of floor (0, 0, 0)
- **Floor**: Y = 0
- **X-axis**: -width/2 to +width/2
- **Z-axis**: -length/2 to +length/2
- **Y-axis**: 0 to height

### Room Components
- **Floor**: Horizontal plane with chosen color
- **Walls**: Vertical planes at room boundaries
- **Outlines**: Line geometry for visual reference
- **Markers**: Colored lines for dimension visualization

### Rendering
- Floor uses `meshStandardMaterial` with:
  - Roughness: 0.8 (realistic floor finish)
  - Metalness: 0.1 (slight sheen)
- Walls use `meshStandardMaterial` with:
  - Roughness: 0.9 (matte finish)
  - Metalness: 0 (no reflection)
  - Double-sided rendering

### Performance
- Room geometry is optimized
- Only visible walls are rendered
- Line geometry is lightweight
- No performance impact with multiple cabinets

## UI Controls Location

All room setup controls are in the **Control Panel** under **"Room Setup"** section, located at the top of the panel for easy access.

**Order of Controls:**
1. Kitchen Designer (Add Cabinet button)
2. **Room Setup** ← New section
   - Dimensions sliders
   - Floor color dropdown
   - Wall controls
3. Camera View
4. Positioning
5. Selected Cabinet details

## Future Enhancements

Potential additions to room configuration:
- [ ] Windows and door placement
- [ ] Wall texture mapping
- [ ] Floor tile patterns
- [ ] Ceiling visualization
- [ ] Light fixture placement
- [ ] Room presets (common sizes)
- [ ] Import room dimensions from file
- [ ] 3D room scanning integration
- [ ] Wall thickness configuration
- [ ] Corner details and trim

## Troubleshooting

**Cabinets outside room bounds:**
- Check room dimensions
- Use Top view to see floor boundaries
- Reposition cabinets within floor area

**Walls blocking view:**
- Toggle off the obstructing wall
- Use "Show Walls" checkbox to hide all
- Switch to Free camera mode

**Floor color not visible:**
- Adjust lighting if too dark
- Try different camera angles
- Check if cabinets are covering floor

**Wall height issues:**
- Ensure ceiling height matches your space
- Upper cabinets should be below ceiling
- Standard height is 2.7m

---

**Version**: 1.0.0  
**Date**: November 4, 2025  
**Status**: Complete & Tested
