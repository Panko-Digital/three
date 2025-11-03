import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Cabinet } from "./Cabinet";
import { Benchtop } from "./Benchtop";
import { Room } from "./Room";
import type {
  CabinetConfig,
  BenchtopConfig,
  CameraViewType,
  RoomConfig,
  ItemType,
} from "../types";
import { useEffect, useRef, useState } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

interface KitchenSceneProps {
  cabinets: CabinetConfig[];
  benchtops: BenchtopConfig[];
  selectedCabinetId: string | null;
  selectedBenchtopId: string | null;
  onSelectItem: (id: string | null, type: ItemType | null) => void;
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
  benchtops,
  selectedCabinetId,
  selectedBenchtopId,
  onSelectItem,
  onPositionChange,
  cameraView,
  snapToGrid,
  gridSize,
  roomConfig,
}: KitchenSceneProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [isDraggingCabinet, setIsDraggingCabinet] = useState(false);

  // Keyboard controls for moving selected cabinet or benchtop
  useEffect(() => {
    const selectedId = selectedCabinetId || selectedBenchtopId;
    if (!selectedId) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const selectedCabinet = cabinets.find((c) => c.id === selectedId);
      const selectedBenchtop = benchtops.find((b) => b.id === selectedId);
      const selectedItem = selectedCabinet || selectedBenchtop;

      if (!selectedItem) return;

      const [x, y, z] = selectedItem.position;
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

      if (newPos !== selectedItem.position) {
        onPositionChange(selectedId, newPos);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    selectedCabinetId,
    selectedBenchtopId,
    cabinets,
    benchtops,
    snapToGrid,
    gridSize,
    onPositionChange,
  ]);

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
          onSelectItem(null, null);
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
          onSelect={() => onSelectItem(cabinet.id, "cabinet")}
          onPositionChange={onPositionChange}
          onDragStateChange={setIsDraggingCabinet}
          snapToGrid={snapToGrid}
          gridSize={gridSize}
        />
      ))}

      {/* Benchtops */}
      {benchtops.map((benchtop) => (
        <Benchtop
          key={benchtop.id}
          config={benchtop}
          isSelected={benchtop.id === selectedBenchtopId}
          onSelect={() => onSelectItem(benchtop.id, "benchtop")}
          onPositionChange={onPositionChange}
          onDragStateChange={setIsDraggingCabinet}
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
        enabled={cameraView === "free" && !isDraggingCabinet}
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
