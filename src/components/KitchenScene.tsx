import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Cabinet } from "./Cabinet";
import { Room } from "./Room";
import type { CabinetConfig, CameraViewType, RoomConfig } from "../types";
import { useEffect, useRef } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

interface KitchenSceneProps {
  cabinets: CabinetConfig[];
  selectedCabinetId: string | null;
  onSelectCabinet: (id: string | null) => void;
  onPositionChange: (id: string, position: [number, number, number]) => void;
  cameraView: CameraViewType;
  snapToGrid: boolean;
  gridSize: number;
  roomConfig: RoomConfig;
}

const CAMERA_POSITIONS: Record<
  CameraViewType,
  { position: [number, number, number]; target: [number, number, number] }
> = {
  free: { position: [3, 3, 3], target: [0, 1, 0] },
  front: { position: [0, 1.5, 5], target: [0, 1, 0] },
  back: { position: [0, 1.5, -5], target: [0, 1, 0] },
  left: { position: [-5, 1.5, 0], target: [0, 1, 0] },
  right: { position: [5, 1.5, 0], target: [0, 1, 0] },
  top: { position: [0, 8, 0], target: [0, 0, 0] },
  isometric: { position: [4, 4, 4], target: [0, 1, 0] },
};

function Scene({
  cabinets,
  selectedCabinetId,
  onSelectCabinet,
  onPositionChange,
  cameraView,
  snapToGrid,
  gridSize,
  roomConfig,
}: KitchenSceneProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  // Keyboard controls for moving selected cabinet
  useEffect(() => {
    if (!selectedCabinetId) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const selectedCabinet = cabinets.find((c) => c.id === selectedCabinetId);
      if (!selectedCabinet) return;

      const [x, y, z] = selectedCabinet.position;
      const step = event.shiftKey ? 0.01 : snapToGrid ? gridSize : 0.1;
      let newPos: [number, number, number] = [x, y, z];

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          newPos = [x - step, y, z];
          break;
        case "ArrowRight":
          event.preventDefault();
          newPos = [x + step, y, z];
          break;
        case "ArrowUp":
          event.preventDefault();
          newPos = [x, y, z - step];
          break;
        case "ArrowDown":
          event.preventDefault();
          newPos = [x, y, z + step];
          break;
        case "PageUp":
          event.preventDefault();
          newPos = [x, y + step, z];
          break;
        case "PageDown":
          event.preventDefault();
          newPos = [x, Math.max(0, y - step), z];
          break;
      }

      if (newPos !== selectedCabinet.position) {
        onPositionChange(selectedCabinetId, newPos);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedCabinetId, cabinets, snapToGrid, gridSize, onPositionChange]);

  useEffect(() => {
    if (controlsRef.current && cameraView !== "free") {
      const { position, target } = CAMERA_POSITIONS[cameraView];

      // Smoothly animate camera
      controlsRef.current.object.position.set(...position);
      controlsRef.current.target.set(...target);
      controlsRef.current.update();
    }
  }, [cameraView]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />
      <pointLight position={[0, 3, 0]} intensity={0.5} />

      {/* Environment for reflections */}
      <Environment preset="apartment" />

      {/* Room (Floor and Walls) - clicking on it deselects cabinets */}
      <group
        onClick={(e) => {
          e.stopPropagation();
          onSelectCabinet(null);
        }}
      >
        <Room config={roomConfig} />
      </group>

      {/* Cabinets */}
      {cabinets.map((cabinet) => (
        <Cabinet
          key={cabinet.id}
          config={cabinet}
          isSelected={cabinet.id === selectedCabinetId}
          onSelect={() => onSelectCabinet(cabinet.id)}
          onPositionChange={onPositionChange}
          snapToGrid={snapToGrid}
          gridSize={gridSize}
        />
      ))}

      {/* Camera controls */}
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.05}
        enabled={cameraView === "free"}
      />
    </>
  );
}

export function KitchenScene(props: KitchenSceneProps) {
  return (
    <div style={{ width: "100%", height: "calc(100vh - 60px)" }}>
      <Canvas
        camera={{ position: [3, 3, 3], fov: 50 }}
        shadows
        gl={{ antialias: true }}
      >
        <Scene {...props} />
      </Canvas>
    </div>
  );
}
