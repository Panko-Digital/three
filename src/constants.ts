import type { MaterialConfig } from './types';
import config from './config.json';

export const DEFAULT_MATERIALS: MaterialConfig[] = config.materials.cabinet;

export const BENCHTOP_MATERIALS: MaterialConfig[] = config.materials.benchtop;

export const HANDLE_COLORS = config.handles.colors;

export const CABINET_DEFAULTS = config.defaults.cabinet;

export const BENCHTOP_DEFAULTS = config.defaults.benchtop;

export const FLOOR_COLORS = config.colors.floor;

export const WALL_COLORS = config.colors.wall;

export const ROOM_DEFAULTS = config.defaults.room;

// Pricing Configuration (AUD)
export const MATERIAL_PRICES = config.pricing.materials;

export const HANDLE_PRICES = config.pricing.handles;

export const CABINET_HARDWARE_COSTS = config.pricing.cabinetHardware;

// Door type multipliers (some door types require more hardware)
export const DOOR_TYPE_MULTIPLIERS = config.pricing.doorTypeMultipliers;

// Benchtop material prices per square meter (AUD)
export const BENCHTOP_PRICES = config.pricing.benchtop.materials;

// Benchtop installation costs
export const BENCHTOP_INSTALLATION = config.pricing.benchtop.installation;

