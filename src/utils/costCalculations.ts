import type { CabinetConfig } from '../types';
import {
    MATERIAL_PRICES,
    HANDLE_PRICES,
    CABINET_HARDWARE_COSTS,
    DOOR_TYPE_MULTIPLIERS,
} from '../constants';

export interface CabinetCostBreakdown {
    doorMaterialCost: number;
    bodyMaterialCost: number;
    handlesCost: number;
    hardwareCost: number;
    subtotal: number;
    doorTypeMultiplier: number;
    total: number;
}

/**
 * Calculate the surface area of all doors on a cabinet
 */
function calculateDoorArea(cabinet: CabinetConfig): number {
    const doorWidth = cabinet.width / cabinet.numberOfDoors;
    const doorHeight = cabinet.height;
    const singleDoorArea = doorWidth * doorHeight;
    const totalDoorArea = singleDoorArea * cabinet.numberOfDoors;
    return totalDoorArea;
}

/**
 * Calculate the surface area of the cabinet body (excluding doors)
 * Includes top, bottom, two sides, and back
 */
function calculateBodyArea(cabinet: CabinetConfig): number {
    const { width, height, depth } = cabinet;

    // Top and bottom
    const topBottomArea = 2 * (width * depth);

    // Left and right sides
    const sidesArea = 2 * (depth * height);

    // Back panel
    const backArea = width * height;

    const totalBodyArea = topBottomArea + sidesArea + backArea;
    return totalBodyArea;
}

/**
 * Calculate the total cost breakdown for a single cabinet
 */
export function calculateCabinetCost(cabinet: CabinetConfig): CabinetCostBreakdown {
    // Calculate material costs
    const doorArea = calculateDoorArea(cabinet);
    const bodyArea = calculateBodyArea(cabinet);

    const doorMaterialPrice = MATERIAL_PRICES[cabinet.doorMaterial.id as keyof typeof MATERIAL_PRICES] || 0;
    const bodyMaterialPrice = MATERIAL_PRICES[cabinet.bodyMaterial.id as keyof typeof MATERIAL_PRICES] || 0;

    const doorMaterialCost = doorArea * doorMaterialPrice;
    const bodyMaterialCost = bodyArea * bodyMaterialPrice;

    // Calculate handle costs
    const handleType = cabinet.handle.type;

    let handlePricePerUnit = 0;
    const handlePrices = HANDLE_PRICES[handleType as keyof typeof HANDLE_PRICES];
    if (handlePrices) {
        // Match handle color to price
        if (cabinet.handle.color === '#C0C0C0') {
            handlePricePerUnit = handlePrices.chrome;
        } else if (cabinet.handle.color === '#B5A642') {
            handlePricePerUnit = handlePrices.brass;
        } else if (cabinet.handle.color === '#000000') {
            handlePricePerUnit = handlePrices.black;
        } else if (cabinet.handle.color === '#FFD700') {
            handlePricePerUnit = handlePrices.gold;
        } else {
            // Default to chrome
            handlePricePerUnit = handlePrices.chrome;
        }
    }

    const handlesCost = handlePricePerUnit * cabinet.numberOfDoors;

    // Calculate hardware costs (base cost for all fixtures)
    const baseHardwareCost =
        CABINET_HARDWARE_COSTS.hinges * cabinet.numberOfDoors + // Hinges per door
        CABINET_HARDWARE_COSTS.shelving +
        CABINET_HARDWARE_COSTS.brackets +
        CABINET_HARDWARE_COSTS.screws;

    // Apply door type multiplier
    const doorTypeMultiplier = DOOR_TYPE_MULTIPLIERS[cabinet.doorType];
    const hardwareCost = baseHardwareCost * doorTypeMultiplier;

    // Calculate totals
    const subtotal = doorMaterialCost + bodyMaterialCost + handlesCost + hardwareCost;
    const total = subtotal; // Could add markup, tax, etc. here

    return {
        doorMaterialCost,
        bodyMaterialCost,
        handlesCost,
        hardwareCost,
        subtotal,
        doorTypeMultiplier,
        total,
    };
}

/**
 * Calculate total project cost for all cabinets
 */
export function calculateTotalProjectCost(cabinets: CabinetConfig[]): {
    cabinetsTotal: number;
    cabinetsBreakdown: Array<{ cabinetId: string; cost: CabinetCostBreakdown }>;
    totalCabinets: number;
} {
    const cabinetsBreakdown = cabinets.map(cabinet => ({
        cabinetId: cabinet.id,
        cost: calculateCabinetCost(cabinet),
    }));

    const cabinetsTotal = cabinetsBreakdown.reduce(
        (sum, item) => sum + item.cost.total,
        0
    );

    return {
        cabinetsTotal,
        cabinetsBreakdown,
        totalCabinets: cabinets.length,
    };
}

/**
 * Format currency in AUD
 */
export function formatAUD(amount: number): string {
    return new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD',
        minimumFractionDigits: 2,
    }).format(amount);
}
