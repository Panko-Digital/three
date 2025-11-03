import { useState } from "react";
import "./App.css";
import { KitchenScene } from "./components/KitchenScene";
import { ControlPanel } from "./components/ControlPanel";
import { NavBar } from "./components/NavBar";
import type {
  CabinetConfig,
  BenchtopConfig,
  CameraViewType,
  RoomConfig,
  ItemType,
} from "./types";
import {
  DEFAULT_MATERIALS,
  BENCHTOP_MATERIALS,
  HANDLE_COLORS,
  ROOM_DEFAULTS,
  FLOOR_COLORS,
  WALL_COLORS,
  BENCHTOP_DEFAULTS,
} from "./constants";

function App() {
  const [cabinets, setCabinets] = useState<CabinetConfig[]>([]);
  const [benchtops, setBenchtops] = useState<BenchtopConfig[]>([]);
  const [selectedCabinetId, setSelectedCabinetId] = useState<string | null>(
    null
  );
  const [selectedBenchtopId, setSelectedBenchtopId] = useState<string | null>(
    null
  );
  const [selectedItemType, setSelectedItemType] = useState<ItemType | null>(
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
      rotation: 0,
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

  const handleDuplicateCabinet = (id: string) => {
    const cabinetToDuplicate = cabinets.find((c) => c.id === id);
    if (!cabinetToDuplicate) return;

    // Calculate new position - place it to the right of the original cabinet
    const [x, y, z] = cabinetToDuplicate.position;
    const offset = cabinetToDuplicate.width + 0.05; // 5cm gap

    // Place duplicate to the right (flush against the original with small gap)
    const newX = x + offset;

    const newCabinet: CabinetConfig = {
      ...cabinetToDuplicate,
      id: `cabinet-${Date.now()}`,
      position: [newX, y, z],
    };

    setCabinets([...cabinets, newCabinet]);
    setSelectedCabinetId(newCabinet.id);
    setSelectedItemType("cabinet");
  };

  // Benchtop handlers
  const handleAddBenchtop = () => {
    const newBenchtop: BenchtopConfig = {
      id: `benchtop-${Date.now()}`,
      position: [benchtops.length * 0.8, 0.9, 0], // Position at standard cabinet height
      rotation: 0,
      width: BENCHTOP_DEFAULTS.width,
      depth: BENCHTOP_DEFAULTS.depth,
      thickness: BENCHTOP_DEFAULTS.thickness,
      material: BENCHTOP_MATERIALS[0],
      overhang: BENCHTOP_DEFAULTS.overhang,
    };

    setBenchtops([...benchtops, newBenchtop]);
    setSelectedBenchtopId(newBenchtop.id);
    setSelectedCabinetId(null);
    setSelectedItemType("benchtop");
  };

  const handleUpdateBenchtop = (
    id: string,
    updates: Partial<BenchtopConfig>
  ) => {
    setBenchtops(
      benchtops.map((benchtop) =>
        benchtop.id === id ? { ...benchtop, ...updates } : benchtop
      )
    );
  };

  const handleDeleteBenchtop = (id: string) => {
    setBenchtops(benchtops.filter((benchtop) => benchtop.id !== id));
    if (selectedBenchtopId === id) {
      setSelectedBenchtopId(null);
      setSelectedItemType(null);
    }
  };

  const handleDuplicateBenchtop = (id: string) => {
    const benchtopToDuplicate = benchtops.find((b) => b.id === id);
    if (!benchtopToDuplicate) return;

    const [x, y, z] = benchtopToDuplicate.position;
    const offset = benchtopToDuplicate.width + 0.05;
    const newX = x + offset;

    const newBenchtop: BenchtopConfig = {
      ...benchtopToDuplicate,
      id: `benchtop-${Date.now()}`,
      position: [newX, y, z],
    };

    setBenchtops([...benchtops, newBenchtop]);
    setSelectedBenchtopId(newBenchtop.id);
    setSelectedItemType("benchtop");
  };

  const handlePositionChange = (
    id: string,
    position: [number, number, number]
  ) => {
    if (selectedItemType === "cabinet") {
      handleUpdateCabinet(id, { position });
    } else if (selectedItemType === "benchtop") {
      handleUpdateBenchtop(id, { position });
    }
  };

  const handleSelectItem = (id: string | null, type: ItemType | null) => {
    if (type === "cabinet") {
      setSelectedCabinetId(id);
      setSelectedBenchtopId(null);
    } else if (type === "benchtop") {
      setSelectedBenchtopId(id);
      setSelectedCabinetId(null);
    } else {
      setSelectedCabinetId(null);
      setSelectedBenchtopId(null);
    }
    setSelectedItemType(type);
  };

  const handleRoomConfigChange = (updates: Partial<RoomConfig>) => {
    setRoomConfig({ ...roomConfig, ...updates });
  };

  const selectedCabinet =
    cabinets.find((c) => c.id === selectedCabinetId) || null;

  const selectedBenchtop =
    benchtops.find((b) => b.id === selectedBenchtopId) || null;

  return (
    <div className="app-container">
      <NavBar cameraView={cameraView} onCameraViewChange={setCameraView} />
      <KitchenScene
        cabinets={cabinets}
        benchtops={benchtops}
        selectedCabinetId={selectedCabinetId}
        selectedBenchtopId={selectedBenchtopId}
        onSelectItem={handleSelectItem}
        onPositionChange={handlePositionChange}
        cameraView={cameraView}
        snapToGrid={snapToGrid}
        gridSize={gridSize}
        roomConfig={roomConfig}
      />
      <ControlPanel
        cabinets={cabinets}
        benchtops={benchtops}
        selectedCabinet={selectedCabinet}
        selectedBenchtop={selectedBenchtop}
        selectedItemType={selectedItemType}
        onAddCabinet={handleAddCabinet}
        onAddBenchtop={handleAddBenchtop}
        onUpdateCabinet={handleUpdateCabinet}
        onUpdateBenchtop={handleUpdateBenchtop}
        onDeleteCabinet={handleDeleteCabinet}
        onDeleteBenchtop={handleDeleteBenchtop}
        onDuplicateCabinet={handleDuplicateCabinet}
        onDuplicateBenchtop={handleDuplicateBenchtop}
        onSelectItem={handleSelectItem}
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
