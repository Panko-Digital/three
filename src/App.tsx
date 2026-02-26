import { useState, useCallback, useEffect } from "react";
import "./App.css";
import { KitchenScene } from "./components/KitchenScene";
import { ControlPanel } from "./components/ControlPanel";
import { NavBar } from "./components/NavBar";
import { useHistory } from "./useHistory";
import type {
  CabinetConfig,
  BenchtopConfig,
  CameraViewType,
  RoomConfig,
  ItemType,
  KitchenDesignFile,
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

interface KitchenState {
  cabinets: CabinetConfig[];
  benchtops: BenchtopConfig[];
  roomConfig: RoomConfig;
}

const initialRoomConfig: RoomConfig = {
  width: ROOM_DEFAULTS.width,
  length: ROOM_DEFAULTS.length,
  height: ROOM_DEFAULTS.height,
  floorColor: FLOOR_COLORS[0].color,
  wallColor: WALL_COLORS[0].color,
  showWalls: true,
  showNorthWall: false,
  showSouthWall: true,
  showEastWall: true,
  showWestWall: true,
  wallOpacity: 1.0,
  showShadows: true,
};

function App() {
  const [cabinets, setCabinets] = useState<CabinetConfig[]>([]);
  const [benchtops, setBenchtops] = useState<BenchtopConfig[]>([]);
  const [selectedCabinetId, setSelectedCabinetId] = useState<string | null>(
    null,
  );
  const [selectedBenchtopId, setSelectedBenchtopId] = useState<string | null>(
    null,
  );
  const [selectedItemType, setSelectedItemType] = useState<ItemType | null>(
    null,
  );
  const [cameraView, setCameraView] = useState<CameraViewType>("free");
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize] = useState(0.1);
  const [roomConfig, setRoomConfig] = useState<RoomConfig>(initialRoomConfig);

  // --- History (undo/redo) ---
  const history = useHistory<KitchenState>();
  const [, setHistoryTick] = useState(0); // forces re-render for canUndo/canRedo

  const getState = useCallback(
    (): KitchenState => ({ cabinets, benchtops, roomConfig }),
    [cabinets, benchtops, roomConfig],
  );

  // Push initial state once on mount
  useEffect(() => {
    history.pushState({
      cabinets: [],
      benchtops: [],
      roomConfig: initialRoomConfig,
    });
  }, [history.pushState]);

  const pushHistory = useCallback(
    (state: KitchenState, debounceMs = 0) => {
      history.pushState(state, debounceMs);
      setHistoryTick((t) => t + 1);
    },
    [history],
  );

  const handleUndo = useCallback(() => {
    const prev = history.undo(getState());
    if (!prev) return;
    setCabinets(prev.cabinets);
    setBenchtops(prev.benchtops);
    setRoomConfig(prev.roomConfig);
    setSelectedCabinetId(null);
    setSelectedBenchtopId(null);
    setSelectedItemType(null);
    setHistoryTick((t) => t + 1);
  }, [history, getState]);

  const handleRedo = useCallback(() => {
    const next = history.redo();
    if (!next) return;
    setCabinets(next.cabinets);
    setBenchtops(next.benchtops);
    setRoomConfig(next.roomConfig);
    setSelectedCabinetId(null);
    setSelectedBenchtopId(null);
    setSelectedItemType(null);
    setHistoryTick((t) => t + 1);
  }, [history]);

  // Keyboard shortcuts: Cmd/Ctrl+Z for undo, Cmd/Ctrl+Shift+Z for redo
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if (mod && e.key === "z" && e.shiftKey) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleUndo, handleRedo]);

  // --- Cabinet handlers ---
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
      handle: { type: "bar", color: HANDLE_COLORS[0].color, material: "metal" },
      numberOfDoors: 2,
    };
    const next = [...cabinets, newCabinet];
    setCabinets(next);
    setSelectedCabinetId(newCabinet.id);
    setSelectedItemType("cabinet");
    pushHistory({ cabinets: next, benchtops, roomConfig });
  };

  const handleUpdateCabinet = (id: string, updates: Partial<CabinetConfig>) => {
    const next = cabinets.map((c) => (c.id === id ? { ...c, ...updates } : c));
    setCabinets(next);
    // Debounce slider-style updates (position, dimensions)
    pushHistory({ cabinets: next, benchtops, roomConfig }, 500);
  };

  const handleDeleteCabinet = (id: string) => {
    const next = cabinets.filter((c) => c.id !== id);
    setCabinets(next);
    if (selectedCabinetId === id) setSelectedCabinetId(null);
    pushHistory({ cabinets: next, benchtops, roomConfig });
  };

  const handleDuplicateCabinet = (id: string) => {
    const src = cabinets.find((c) => c.id === id);
    if (!src) return;
    const [x, y, z] = src.position;
    const newCab: CabinetConfig = {
      ...src,
      id: `cabinet-${Date.now()}`,
      position: [x + src.width + 0.05, y, z],
    };
    const next = [...cabinets, newCab];
    setCabinets(next);
    setSelectedCabinetId(newCab.id);
    setSelectedItemType("cabinet");
    pushHistory({ cabinets: next, benchtops, roomConfig });
  };

  // --- Benchtop handlers ---
  const handleAddBenchtop = () => {
    const newBt: BenchtopConfig = {
      id: `benchtop-${Date.now()}`,
      position: [benchtops.length * 0.8, 0.9, 0],
      rotation: 0,
      width: BENCHTOP_DEFAULTS.width,
      depth: BENCHTOP_DEFAULTS.depth,
      thickness: BENCHTOP_DEFAULTS.thickness,
      material: BENCHTOP_MATERIALS[0],
      overhang: BENCHTOP_DEFAULTS.overhang,
    };
    const next = [...benchtops, newBt];
    setBenchtops(next);
    setSelectedBenchtopId(newBt.id);
    setSelectedCabinetId(null);
    setSelectedItemType("benchtop");
    pushHistory({ cabinets, benchtops: next, roomConfig });
  };

  const handleUpdateBenchtop = (
    id: string,
    updates: Partial<BenchtopConfig>,
  ) => {
    const next = benchtops.map((b) => (b.id === id ? { ...b, ...updates } : b));
    setBenchtops(next);
    pushHistory({ cabinets, benchtops: next, roomConfig }, 500);
  };

  const handleDeleteBenchtop = (id: string) => {
    const next = benchtops.filter((b) => b.id !== id);
    setBenchtops(next);
    if (selectedBenchtopId === id) {
      setSelectedBenchtopId(null);
      setSelectedItemType(null);
    }
    pushHistory({ cabinets, benchtops: next, roomConfig });
  };

  const handleDuplicateBenchtop = (id: string) => {
    const src = benchtops.find((b) => b.id === id);
    if (!src) return;
    const [x, y, z] = src.position;
    const newBt: BenchtopConfig = {
      ...src,
      id: `benchtop-${Date.now()}`,
      position: [x + src.width + 0.05, y, z],
    };
    const next = [...benchtops, newBt];
    setBenchtops(next);
    setSelectedBenchtopId(newBt.id);
    setSelectedItemType("benchtop");
    pushHistory({ cabinets, benchtops: next, roomConfig });
  };

  const handlePositionChange = (
    id: string,
    position: [number, number, number],
  ) => {
    if (selectedItemType === "cabinet") handleUpdateCabinet(id, { position });
    else if (selectedItemType === "benchtop")
      handleUpdateBenchtop(id, { position });
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
    const next = { ...roomConfig, ...updates };
    setRoomConfig(next);
    pushHistory({ cabinets, benchtops, roomConfig: next }, 500);
  };

  // --- Export / Import ---
  const handleExport = () => {
    const design: KitchenDesignFile = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      roomConfig,
      cabinets,
      benchtops,
    };
    const blob = new Blob([JSON.stringify(design, null, 2)], {
      type: "application/json",
    });
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const ts = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `panko-kitchen-design-${ts}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (data: KitchenDesignFile) => {
    if (!data.cabinets || !data.benchtops || !data.roomConfig) {
      alert("Invalid design file: missing required data.");
      return;
    }
    setCabinets(data.cabinets);
    setBenchtops(data.benchtops);
    setRoomConfig(data.roomConfig);
    setSelectedCabinetId(null);
    setSelectedBenchtopId(null);
    setSelectedItemType(null);
    pushHistory({
      cabinets: data.cabinets,
      benchtops: data.benchtops,
      roomConfig: data.roomConfig,
    });
  };

  const selectedCabinet =
    cabinets.find((c) => c.id === selectedCabinetId) || null;
  const selectedBenchtop =
    benchtops.find((b) => b.id === selectedBenchtopId) || null;

  return (
    <div className="app-container">
      <NavBar
        cameraView={cameraView}
        onCameraViewChange={setCameraView}
        onExport={handleExport}
        onImport={handleImport}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={history.canUndo()}
        canRedo={history.canRedo()}
      />
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
