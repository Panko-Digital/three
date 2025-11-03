import { useState } from "react";
import "./App.css";
import { KitchenScene } from "./components/KitchenScene";
import { ControlPanel } from "./components/ControlPanel";
import type { CabinetConfig, CameraViewType, RoomConfig } from "./types";
import {
  DEFAULT_MATERIALS,
  HANDLE_COLORS,
  ROOM_DEFAULTS,
  FLOOR_COLORS,
  WALL_COLORS,
} from "./constants";

function App() {
  const [cabinets, setCabinets] = useState<CabinetConfig[]>([]);
  const [selectedCabinetId, setSelectedCabinetId] = useState<string | null>(
    null
  );
  const [cameraView, setCameraView] = useState<CameraViewType>("isometric");
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize] = useState(0.1); // 10cm grid

  const [roomConfig, setRoomConfig] = useState<RoomConfig>({
    width: ROOM_DEFAULTS.width,
    length: ROOM_DEFAULTS.length,
    height: ROOM_DEFAULTS.height,
    floorColor: FLOOR_COLORS[0].color,
    wallColor: WALL_COLORS[0].color,
    showWalls: true,
    showNorthWall: true,
    showSouthWall: true,
    showEastWall: true,
    showWestWall: true,
    wallOpacity: 1.0,
  });

  const handleAddCabinet = () => {
    const newCabinet: CabinetConfig = {
      id: `cabinet-${Date.now()}`,
      position: [cabinets.length * 0.8, 0, 0],
      width: 0.6,
      height: 0.9,
      depth: 0.6,
      doorMaterial: DEFAULT_MATERIALS[0],
      bodyMaterial: DEFAULT_MATERIALS[0],
      doorType: "swing",
      handle: {
        type: "bar",
        color: HANDLE_COLORS[0].color,
        material: "metal",
      },
      numberOfDoors: 2,
    };

    setCabinets([...cabinets, newCabinet]);
    setSelectedCabinetId(newCabinet.id);
  };

  const handleUpdateCabinet = (id: string, updates: Partial<CabinetConfig>) => {
    setCabinets(
      cabinets.map((cabinet) =>
        cabinet.id === id ? { ...cabinet, ...updates } : cabinet
      )
    );
  };

  const handleDeleteCabinet = (id: string) => {
    setCabinets(cabinets.filter((cabinet) => cabinet.id !== id));
    if (selectedCabinetId === id) {
      setSelectedCabinetId(null);
    }
  };

  const handlePositionChange = (
    id: string,
    position: [number, number, number]
  ) => {
    handleUpdateCabinet(id, { position });
  };

  const handleRoomConfigChange = (updates: Partial<RoomConfig>) => {
    setRoomConfig({ ...roomConfig, ...updates });
  };

  const selectedCabinet =
    cabinets.find((c) => c.id === selectedCabinetId) || null;

  return (
    <div className="app-container">
      <KitchenScene
        cabinets={cabinets}
        selectedCabinetId={selectedCabinetId}
        onSelectCabinet={setSelectedCabinetId}
        onPositionChange={handlePositionChange}
        cameraView={cameraView}
        snapToGrid={snapToGrid}
        gridSize={gridSize}
        roomConfig={roomConfig}
      />
      <ControlPanel
        selectedCabinet={selectedCabinet}
        onAddCabinet={handleAddCabinet}
        onUpdateCabinet={handleUpdateCabinet}
        onDeleteCabinet={handleDeleteCabinet}
        cameraView={cameraView}
        onCameraViewChange={setCameraView}
        snapToGrid={snapToGrid}
        onSnapToGridChange={setSnapToGrid}
        gridSize={gridSize}
        roomConfig={roomConfig}
        onRoomConfigChange={handleRoomConfigChange}
      />
    </div>
  );
}

export default App;
