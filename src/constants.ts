import type { MaterialConfig } from './types';

export const DEFAULT_MATERIALS: MaterialConfig[] = [
    { id: 'white-gloss', name: 'White Gloss', color: '#FFFFFF', metalness: 0.8, roughness: 0.2 },
    { id: 'black-matt', name: 'Black Matt', color: '#1A1A1A', metalness: 0.1, roughness: 0.9 },
    { id: 'oak', name: 'Oak Wood', color: '#C19A6B', metalness: 0, roughness: 0.7 },
    { id: 'walnut', name: 'Walnut', color: '#5C4033', metalness: 0, roughness: 0.7 },
    { id: 'grey', name: 'Grey', color: '#808080', metalness: 0.3, roughness: 0.6 },
    { id: 'navy', name: 'Navy Blue', color: '#001F3F', metalness: 0.4, roughness: 0.5 },
    { id: 'sage', name: 'Sage Green', color: '#9CAF88', metalness: 0.2, roughness: 0.6 },
];

export const HANDLE_COLORS = [
    { id: 'chrome', name: 'Chrome', color: '#C0C0C0' },
    { id: 'brass', name: 'Brass', color: '#B5A642' },
    { id: 'black', name: 'Matte Black', color: '#000000' },
    { id: 'gold', name: 'Gold', color: '#FFD700' },
];

export const CABINET_DEFAULTS = {
    width: 0.6,
    height: 0.9,
    depth: 0.6,
};

export const FLOOR_COLORS = [
    { id: 'light-oak', name: 'Light Oak', color: '#D4A574' },
    { id: 'dark-oak', name: 'Dark Oak', color: '#8B6914' },
    { id: 'walnut', name: 'Walnut', color: '#5C4033' },
    { id: 'ash', name: 'Ash Grey', color: '#B8B8B8' },
    { id: 'maple', name: 'Maple', color: '#E8C89C' },
    { id: 'white-tile', name: 'White Tile', color: '#F5F5F5' },
    { id: 'grey-tile', name: 'Grey Tile', color: '#696969' },
    { id: 'black-tile', name: 'Black Tile', color: '#2C2C2C' },
    { id: 'concrete', name: 'Concrete', color: '#A9A9A9' },
];

export const WALL_COLORS = [
    { id: 'white', name: 'White', color: '#FFFFFF' },
    { id: 'off-white', name: 'Off-White', color: '#F8F8F8' },
    { id: 'light-grey', name: 'Light Grey', color: '#D3D3D3' },
    { id: 'warm-grey', name: 'Warm Grey', color: '#C0C0C0' },
    { id: 'beige', name: 'Beige', color: '#F5F5DC' },
    { id: 'cream', name: 'Cream', color: '#FFFDD0' },
];

export const ROOM_DEFAULTS = {
    width: 4,    // 4m wide
    length: 5,   // 5m long
    height: 2.7, // 2.7m ceiling height (standard)
};
