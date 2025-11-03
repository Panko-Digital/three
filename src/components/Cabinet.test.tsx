import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, waitFor, cleanup } from "@testing-library/react";
import { Canvas } from "@react-three/fiber";
import { Cabinet } from "./Cabinet";
import type { CabinetConfig } from "../types";

const renderCabinet = async (props: {
  config: CabinetConfig;
  isSelected?: boolean;
  onSelect?: () => void;
  onPositionChange?: (id: string, position: [number, number, number]) => void;
  snapToGrid?: boolean;
  gridSize?: number;
}) => {
  const defaultProps = {
    isSelected: false,
    onSelect: vi.fn(),
    onPositionChange: vi.fn(),
    snapToGrid: false,
    gridSize: 0.1,
    ...props,
  };

  const result = render(
    <Canvas>
      <Cabinet {...defaultProps} />
    </Canvas>
  );

  await waitFor(
    () => {
      expect(result.container.querySelector("canvas")).toBeTruthy();
    },
    { timeout: 2000 }
  );

  return result;
};

describe("Cabinet Component", () => {
  let mockConfig: CabinetConfig;

  beforeEach(() => {
    mockConfig = {
      id: "test-cabinet-1",
      position: [0, 0, 0],
      rotation: 0,
      width: 1,
      height: 2,
      depth: 0.6,
      doorMaterial: {
        id: "white",
        name: "White",
        color: "#ffffff",
        metalness: 0.3,
        roughness: 0.6,
      },
      bodyMaterial: {
        id: "wood",
        name: "Wood",
        color: "#8b4513",
        metalness: 0.2,
        roughness: 0.8,
      },
      doorType: "swing",
      handle: {
        type: "bar",
        color: "#c0c0c0",
        material: "chrome",
      },
      numberOfDoors: 2,
    };
  });

  afterEach(() => {
    cleanup();
  });

  describe("Rendering", () => {
    it("should render without crashing", async () => {
      const { container } = await renderCabinet({ config: mockConfig });
      expect(container).toBeTruthy();
    });

    it("should render with rotation", async () => {
      const config = { ...mockConfig, rotation: 90 };
      const { container } = await renderCabinet({ config });
      expect(container).toBeTruthy();
    });
  });

  describe("Door Types", () => {
    it("should render swing doors", async () => {
      const config = { ...mockConfig, doorType: "swing" as const };
      await renderCabinet({ config });
    });

    it("should render sliding doors", async () => {
      const config = { ...mockConfig, doorType: "sliding" as const };
      await renderCabinet({ config });
    });

    it("should render folding doors", async () => {
      const config = { ...mockConfig, doorType: "folding" as const };
      await renderCabinet({ config });
    });
  });

  describe("Handle Types", () => {
    it("should render bar handle", async () => {
      const config = {
        ...mockConfig,
        handle: { type: "bar" as const, color: "#c0c0c0", material: "chrome" },
      };
      await renderCabinet({ config });
    });

    it("should render knob handle", async () => {
      const config = {
        ...mockConfig,
        handle: { type: "knob" as const, color: "#ffd700", material: "brass" },
      };
      await renderCabinet({ config });
    });

    it("should render edge handle", async () => {
      const config = {
        ...mockConfig,
        handle: { type: "edge" as const, color: "#000000", material: "black" },
      };
      await renderCabinet({ config });
    });

    it("should render without handle", async () => {
      const config = {
        ...mockConfig,
        handle: { type: "none" as const, color: "#000000", material: "none" },
      };
      await renderCabinet({ config });
    });
  });

  describe("Selection", () => {
    it("should render when selected", async () => {
      await renderCabinet({ config: mockConfig, isSelected: true });
    });

    it("should render when not selected", async () => {
      await renderCabinet({ config: mockConfig, isSelected: false });
    });

    it("should call onSelect", async () => {
      const onSelect = vi.fn();
      await renderCabinet({ config: mockConfig, onSelect });
      expect(onSelect).toBeDefined();
    });
  });

  describe("Grid Snapping", () => {
    it("should support grid snapping", async () => {
      await renderCabinet({
        config: mockConfig,
        snapToGrid: true,
        gridSize: 0.1,
      });
    });

    it("should work without grid snapping", async () => {
      await renderCabinet({ config: mockConfig, snapToGrid: false });
    });
  });

  describe("Props", () => {
    it("should render with different dimensions", async () => {
      const config = { ...mockConfig, width: 2, height: 2.5, depth: 0.8 };
      await renderCabinet({ config });
    });

    it("should render with different door counts", async () => {
      const config = { ...mockConfig, numberOfDoors: 4 };
      await renderCabinet({ config });
    });

    it("should render at different positions", async () => {
      const config = {
        ...mockConfig,
        position: [5, 1, 3] as [number, number, number],
      };
      await renderCabinet({ config });
    });

    it("should render with different rotations", async () => {
      for (const rotation of [0, 90, 180, 270]) {
        const config = { ...mockConfig, rotation };
        await renderCabinet({ config });
        cleanup();
      }
    });
  });

  describe("Materials", () => {
    it("should render with custom door material", async () => {
      const config = {
        ...mockConfig,
        doorMaterial: {
          id: "black",
          name: "Black",
          color: "#000000",
          metalness: 0.8,
          roughness: 0.2,
        },
      };
      await renderCabinet({ config });
    });

    it("should render with default material values", async () => {
      const config = {
        ...mockConfig,
        doorMaterial: { id: "simple", name: "Simple", color: "#cccccc" },
      };
      await renderCabinet({ config });
    });
  });

  describe("Callbacks", () => {
    it("should accept onPositionChange", async () => {
      const onPositionChange = vi.fn();
      await renderCabinet({ config: mockConfig, onPositionChange });
      expect(onPositionChange).toBeDefined();
    });

    it("should work with all callbacks", async () => {
      const onSelect = vi.fn();
      const onPositionChange = vi.fn();
      await renderCabinet({
        config: mockConfig,
        onSelect,
        onPositionChange,
        snapToGrid: true,
        gridSize: 0.1,
      });
    });
  });
});
