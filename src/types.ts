import { Vector3 } from 'three';

export type DoorType = 'swing' | 'sliding' | 'folding';
export type HandleType = 'bar' | 'knob' | 'edge' | 'none';
export type CameraViewType = 'free' | 'front' | 'back' | 'left' | 'right' | 'top' | 'isometric';
export type ItemType = 'cabinet' | 'benchtop';

export interface MaterialConfig {
    id: string;
    name: string;
    color: string;
    metalness?: number;
    roughness?: number;
    textureUrl?: string;
}

export interface DoorHandleConfig {
    type: HandleType;
    color: string;
    material: string;
}

export interface CabinetConfig {
    id: string;
    position: [number, number, number];
    rotation: number; // Rotation in degrees (0, 90, 180, 270)
    width: number;
    height: number;
    depth: number;
    doorMaterial: MaterialConfig;
    bodyMaterial: MaterialConfig;
    doorType: DoorType;
    handle: DoorHandleConfig;
    numberOfDoors: number;
}

export interface BenchtopConfig {
    id: string;
    position: [number, number, number];
    rotation: number; // Rotation in degrees (0, 90, 180, 270)
    width: number;
    depth: number;
    thickness: number;
    material: MaterialConfig;
    overhang: number; // How much it overhangs the cabinet edges
}

export interface KitchenConfig {
    cabinets: CabinetConfig[];
    snapToGrid: boolean;
    gridSize: number;
}

export interface RoomConfig {
    width: number; // X dimension
    length: number; // Z dimension
    height: number; // Y dimension (wall height)
    floorColor: string;
    wallColor: string;
    wallOpacity: number; // 0-1, where 1 is fully opaque
    showWalls: boolean;
    showNorthWall: boolean;
    showSouthWall: boolean;
    showEastWall: boolean;
    showWestWall: boolean;
    showShadows: boolean;
}

export interface CameraView {
    position: Vector3;
    target: Vector3;
    name: CameraViewType;
}
