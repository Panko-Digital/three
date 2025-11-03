import { useState } from "react";
import type {
  CabinetConfig,
  BenchtopConfig,
  DoorType,
  HandleType,
  RoomConfig,
  ItemType,
} from "../types";
import {
  DEFAULT_MATERIALS,
  BENCHTOP_MATERIALS,
  HANDLE_COLORS,
  FLOOR_COLORS,
  WALL_COLORS,
} from "../constants";
import { CabinetList } from "./CabinetList";
import { CostEstimator } from "./CostEstimator";
import "./ControlPanel.css";

interface ControlPanelProps {
  cabinets: CabinetConfig[];
  benchtops: BenchtopConfig[];
  selectedCabinet: CabinetConfig | null;
  selectedBenchtop: BenchtopConfig | null;
  selectedItemType: ItemType | null;
  onAddCabinet: () => void;
  onAddBenchtop: () => void;
  onUpdateCabinet: (id: string, updates: Partial<CabinetConfig>) => void;
  onUpdateBenchtop: (id: string, updates: Partial<BenchtopConfig>) => void;
  onDeleteCabinet: (id: string) => void;
  onDeleteBenchtop: (id: string) => void;
  onDuplicateCabinet: (id: string) => void;
  onDuplicateBenchtop: (id: string) => void;
  onSelectItem: (id: string | null, type: ItemType | null) => void;
  snapToGrid: boolean;
  onSnapToGridChange: (snap: boolean) => void;
  gridSize: number;
  roomConfig: RoomConfig;
  onRoomConfigChange: (updates: Partial<RoomConfig>) => void;
}

export function ControlPanel({
  cabinets,
  benchtops,
  selectedCabinet,
  selectedBenchtop,
  selectedItemType,
  onAddCabinet,
  onAddBenchtop,
  onUpdateCabinet,
  onUpdateBenchtop,
  onDeleteCabinet,
  onDeleteBenchtop,
  onDuplicateCabinet,
  onDuplicateBenchtop,
  onSelectItem,
  snapToGrid,
  onSnapToGridChange,
  gridSize,
  roomConfig,
  onRoomConfigChange,
}: ControlPanelProps) {
  // Accordion state
  const [openSections, setOpenSections] = useState({
    itemType: true,
    list: true,
    details: true,
    room: false,
    cost: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };
  const handleMaterialChange = (type: "door" | "body", materialId: string) => {
    if (!selectedCabinet) return;
    const material = DEFAULT_MATERIALS.find((m) => m.id === materialId);
    if (!material) return;

    onUpdateCabinet(selectedCabinet.id, {
      [type === "door" ? "doorMaterial" : "bodyMaterial"]: material,
    });
  };

  const handleDoorTypeChange = (doorType: DoorType) => {
    if (!selectedCabinet) return;
    onUpdateCabinet(selectedCabinet.id, { doorType });
  };

  const handleHandleTypeChange = (handleType: HandleType) => {
    if (!selectedCabinet) return;
    onUpdateCabinet(selectedCabinet.id, {
      handle: { ...selectedCabinet.handle, type: handleType },
    });
  };

  const handleHandleColorChange = (colorId: string) => {
    if (!selectedCabinet) return;
    const handleColor = HANDLE_COLORS.find((c) => c.id === colorId);
    if (!handleColor) return;

    onUpdateCabinet(selectedCabinet.id, {
      handle: { ...selectedCabinet.handle, color: handleColor.color },
    });
  };

  const handleDimensionChange = (
    dimension: "width" | "height" | "depth",
    value: number
  ) => {
    if (!selectedCabinet) return;
    onUpdateCabinet(selectedCabinet.id, { [dimension]: value });
  };

  const handleNumberOfDoorsChange = (numberOfDoors: number) => {
    if (!selectedCabinet) return;
    onUpdateCabinet(selectedCabinet.id, { numberOfDoors });
  };

  const handlePositionChange = (axis: 0 | 1 | 2, value: number) => {
    if (!selectedCabinet) return;
    const newPosition: [number, number, number] = [...selectedCabinet.position];
    newPosition[axis] = value;
    onUpdateCabinet(selectedCabinet.id, { position: newPosition });
  };

  const handleRotate = (direction: "left" | "right") => {
    if (!selectedCabinet) return;
    const currentRotation = selectedCabinet.rotation || 0;
    let newRotation = currentRotation;

    if (direction === "left") {
      newRotation = (currentRotation - 90) % 360;
    } else {
      newRotation = (currentRotation + 90) % 360;
    }

    // Normalize to 0-359 range
    if (newRotation < 0) newRotation += 360;

    onUpdateCabinet(selectedCabinet.id, { rotation: newRotation });
  };

  // Benchtop handlers
  const handleBenchtopMaterialChange = (materialId: string) => {
    if (!selectedBenchtop) return;
    const material = BENCHTOP_MATERIALS.find((m) => m.id === materialId);
    if (!material) return;
    onUpdateBenchtop(selectedBenchtop.id, { material });
  };

  const handleBenchtopDimensionChange = (
    dimension: "width" | "depth" | "thickness" | "overhang",
    value: number
  ) => {
    if (!selectedBenchtop) return;
    onUpdateBenchtop(selectedBenchtop.id, { [dimension]: value });
  };

  const handleBenchtopPositionChange = (axis: 0 | 1 | 2, value: number) => {
    if (!selectedBenchtop) return;
    const newPosition: [number, number, number] = [
      ...selectedBenchtop.position,
    ];
    newPosition[axis] = value;
    onUpdateBenchtop(selectedBenchtop.id, { position: newPosition });
  };

  const handleBenchtopRotate = (direction: "left" | "right") => {
    if (!selectedBenchtop) return;
    const currentRotation = selectedBenchtop.rotation || 0;
    let newRotation = currentRotation;

    if (direction === "left") {
      newRotation = (currentRotation - 90) % 360;
    } else {
      newRotation = (currentRotation + 90) % 360;
    }

    if (newRotation < 0) newRotation += 360;
    onUpdateBenchtop(selectedBenchtop.id, { rotation: newRotation });
  };

  return (
    <div className="control-panel">
      {/* Item Type Selection Accordion */}
      <div className="panel-section">
        <div
          className="accordion-header"
          onClick={() => toggleSection("itemType")}
        >
          <h2>Add Items</h2>
          <span className="accordion-icon">
            {openSections.itemType ? "▼" : "▶"}
          </span>
        </div>
        {openSections.itemType && (
          <div className="accordion-content">
            <div
              style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}
            >
              <button
                onClick={onAddCabinet}
                className="btn-primary"
                style={{ flex: 1 }}
              >
                + Cabinet
              </button>
              <button
                onClick={onAddBenchtop}
                className="btn-primary"
                style={{ flex: 1 }}
              >
                + Benchtop
              </button>
            </div>
            {(selectedCabinet || selectedBenchtop) && (
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => {
                    if (selectedItemType === "cabinet" && selectedCabinet) {
                      onDuplicateCabinet(selectedCabinet.id);
                    } else if (
                      selectedItemType === "benchtop" &&
                      selectedBenchtop
                    ) {
                      onDuplicateBenchtop(selectedBenchtop.id);
                    }
                  }}
                  className="btn-secondary"
                  style={{ flex: 1 }}
                >
                  Duplicate
                </button>
                <button
                  onClick={() => {
                    if (selectedItemType === "cabinet" && selectedCabinet) {
                      onDeleteCabinet(selectedCabinet.id);
                    } else if (
                      selectedItemType === "benchtop" &&
                      selectedBenchtop
                    ) {
                      onDeleteBenchtop(selectedBenchtop.id);
                    }
                  }}
                  className="btn-danger"
                  style={{ flex: 1 }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Item List Accordion */}
      <div className="panel-section">
        <div className="accordion-header" onClick={() => toggleSection("list")}>
          <h3>Items ({cabinets.length + benchtops.length})</h3>
          <span className="accordion-icon">
            {openSections.list ? "▼" : "▶"}
          </span>
        </div>
        {openSections.list && (
          <div className="accordion-content">
            <CabinetList
              cabinets={cabinets}
              selectedCabinetId={selectedCabinet?.id || null}
              onSelectCabinet={(id) => onSelectItem(id, "cabinet")}
            />
            {benchtops.length > 0 && (
              <>
                <h4 style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>
                  Benchtops
                </h4>
                <div className="cabinet-list">
                  {benchtops.map((benchtop) => (
                    <div
                      key={benchtop.id}
                      className={`cabinet-item ${
                        selectedBenchtop?.id === benchtop.id ? "selected" : ""
                      }`}
                      onClick={() => onSelectItem(benchtop.id, "benchtop")}
                    >
                      <span>{benchtop.material.name}</span>
                      <span className="cabinet-size">
                        {benchtop.width.toFixed(1)}×{benchtop.depth.toFixed(1)}m
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Cost Estimator Accordion */}
      <div className="panel-section">
        <div className="accordion-header" onClick={() => toggleSection("cost")}>
          <h3>Cost Estimate</h3>
          <span className="accordion-icon">
            {openSections.cost ? "▼" : "▶"}
          </span>
        </div>
        {openSections.cost && (
          <div className="accordion-content">
            <CostEstimator
              cabinets={cabinets}
              selectedCabinetId={selectedCabinet?.id || null}
            />
          </div>
        )}
      </div>

      {/* Room Setup Accordion */}
      <div className="panel-section">
        <div className="accordion-header" onClick={() => toggleSection("room")}>
          <h3>Room Setup</h3>
          <span className="accordion-icon">
            {openSections.room ? "▼" : "▶"}
          </span>
        </div>
        {openSections.room && (
          <div className="accordion-content">
            <div className="room-dimensions">
              <label>
                Width (X): {roomConfig.width.toFixed(1)}m
                <input
                  type="range"
                  min="2"
                  max="10"
                  step="0.5"
                  value={roomConfig.width}
                  onChange={(e) =>
                    onRoomConfigChange({ width: parseFloat(e.target.value) })
                  }
                />
              </label>
              <label>
                Length (Z): {roomConfig.length.toFixed(1)}m
                <input
                  type="range"
                  min="2"
                  max="10"
                  step="0.5"
                  value={roomConfig.length}
                  onChange={(e) =>
                    onRoomConfigChange({ length: parseFloat(e.target.value) })
                  }
                />
              </label>
              <label>
                Height (Ceiling): {roomConfig.height.toFixed(1)}m
                <input
                  type="range"
                  min="2.0"
                  max="4.0"
                  step="0.1"
                  value={roomConfig.height}
                  onChange={(e) =>
                    onRoomConfigChange({ height: parseFloat(e.target.value) })
                  }
                />
              </label>
            </div>

            <div className="color-section">
              <h4>Floor Color</h4>
              <select
                value={
                  FLOOR_COLORS.find((c) => c.color === roomConfig.floorColor)
                    ?.id || "light-oak"
                }
                onChange={(e) => {
                  const color = FLOOR_COLORS.find(
                    (c) => c.id === e.target.value
                  );
                  if (color) onRoomConfigChange({ floorColor: color.color });
                }}
                className="select-input"
              >
                {FLOOR_COLORS.map((color) => (
                  <option key={color.id} value={color.id}>
                    {color.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="wall-controls">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={roomConfig.showWalls}
                  onChange={(e) =>
                    onRoomConfigChange({ showWalls: e.target.checked })
                  }
                />
                <span>Show Walls</span>
              </label>

              {roomConfig.showWalls && (
                <>
                  <h4>Wall Color</h4>
                  <select
                    value={
                      WALL_COLORS.find((c) => c.color === roomConfig.wallColor)
                        ?.id || "white"
                    }
                    onChange={(e) => {
                      const color = WALL_COLORS.find(
                        (c) => c.id === e.target.value
                      );
                      if (color) onRoomConfigChange({ wallColor: color.color });
                    }}
                    className="select-input"
                  >
                    {WALL_COLORS.map((color) => (
                      <option key={color.id} value={color.id}>
                        {color.name}
                      </option>
                    ))}
                  </select>

                  <h4 style={{ marginTop: "1em" }}>Wall Opacity</h4>
                  <label>
                    {Math.round(roomConfig.wallOpacity * 100)}%
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={roomConfig.wallOpacity}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        onRoomConfigChange({
                          wallOpacity: parseFloat(e.target.value),
                        })
                      }
                    />
                  </label>

                  <h4>Individual Walls</h4>
                  <div className="wall-toggles">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={roomConfig.showNorthWall}
                        onChange={(e) =>
                          onRoomConfigChange({
                            showNorthWall: e.target.checked,
                          })
                        }
                      />
                      <span>North Wall</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={roomConfig.showSouthWall}
                        onChange={(e) =>
                          onRoomConfigChange({
                            showSouthWall: e.target.checked,
                          })
                        }
                      />
                      <span>South Wall</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={roomConfig.showEastWall}
                        onChange={(e) =>
                          onRoomConfigChange({ showEastWall: e.target.checked })
                        }
                      />
                      <span>East Wall</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={roomConfig.showWestWall}
                        onChange={(e) =>
                          onRoomConfigChange({ showWestWall: e.target.checked })
                        }
                      />
                      <span>West Wall</span>
                    </label>
                  </div>
                </>
              )}
            </div>

            <div style={{ marginTop: "1rem" }}>
              <h4>Positioning</h4>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={snapToGrid}
                  onChange={(e) => onSnapToGridChange(e.target.checked)}
                />
                <span>Snap to Grid ({gridSize}m)</span>
              </label>
              <div className="keyboard-hints">
                <p className="hint-title">Keyboard Shortcuts:</p>
                <p>← → ↑ ↓: Move on ground</p>
                <p>Page Up/Down: Move up/down</p>
                <p>Shift + Arrow: Fine control</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Item Details Accordion - Cabinet or Benchtop */}
      {(selectedCabinet || selectedBenchtop) && (
        <div className="panel-section">
          <div
            className="accordion-header"
            onClick={() => toggleSection("details")}
          >
            <h3>
              {selectedItemType === "cabinet" ? "Cabinet" : "Benchtop"} Details
            </h3>
            <span className="accordion-icon">
              {openSections.details ? "▼" : "▶"}
            </span>
          </div>
          {openSections.details && (
            <div className="accordion-content">
              {selectedItemType === "cabinet" && selectedCabinet && (
                <>
                  {/* Position Controls */}
                  <div className="panel-section">
                    <h4>Position (m)</h4>
                    <label>
                      X: {selectedCabinet.position[0].toFixed(2)}m
                      <input
                        type="range"
                        min="-5"
                        max="5"
                        step={gridSize}
                        value={selectedCabinet.position[0]}
                        onChange={(e) =>
                          handlePositionChange(0, parseFloat(e.target.value))
                        }
                      />
                    </label>
                    <label>
                      Y (Height): {selectedCabinet.position[1].toFixed(2)}m
                      <input
                        type="range"
                        min="0"
                        max="3"
                        step={gridSize}
                        value={selectedCabinet.position[1]}
                        onChange={(e) =>
                          handlePositionChange(1, parseFloat(e.target.value))
                        }
                      />
                    </label>
                    <label>
                      Z: {selectedCabinet.position[2].toFixed(2)}m
                      <input
                        type="range"
                        min="-5"
                        max="5"
                        step={gridSize}
                        value={selectedCabinet.position[2]}
                        onChange={(e) =>
                          handlePositionChange(2, parseFloat(e.target.value))
                        }
                      />
                    </label>
                  </div>

                  {/* Rotation */}
                  <div className="panel-section">
                    <h4>Rotation</h4>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <button
                        onClick={() => handleRotate("left")}
                        className="btn-secondary"
                        style={{ flex: 1 }}
                      >
                        ↺ Rotate Left
                      </button>
                      <span
                        style={{
                          fontSize: "1.2rem",
                          fontWeight: "bold",
                          minWidth: "45px",
                          textAlign: "center",
                        }}
                      >
                        {selectedCabinet.rotation || 0}°
                      </span>
                      <button
                        onClick={() => handleRotate("right")}
                        className="btn-secondary"
                        style={{ flex: 1 }}
                      >
                        Rotate Right ↻
                      </button>
                    </div>
                  </div>

                  {/* Dimensions */}
                  <div className="panel-section">
                    <h4>Dimensions</h4>
                    <label>
                      Width: {selectedCabinet.width.toFixed(2)}m
                      <input
                        type="range"
                        min="0.3"
                        max="2.0"
                        step="0.1"
                        value={selectedCabinet.width}
                        onChange={(e) =>
                          handleDimensionChange(
                            "width",
                            parseFloat(e.target.value)
                          )
                        }
                      />
                    </label>
                    <label>
                      Height: {selectedCabinet.height.toFixed(2)}m
                      <input
                        type="range"
                        min="0.5"
                        max="2.5"
                        step="0.1"
                        value={selectedCabinet.height}
                        onChange={(e) =>
                          handleDimensionChange(
                            "height",
                            parseFloat(e.target.value)
                          )
                        }
                      />
                    </label>
                    <label>
                      Depth: {selectedCabinet.depth.toFixed(2)}m
                      <input
                        type="range"
                        min="0.3"
                        max="0.8"
                        step="0.05"
                        value={selectedCabinet.depth}
                        onChange={(e) =>
                          handleDimensionChange(
                            "depth",
                            parseFloat(e.target.value)
                          )
                        }
                      />
                    </label>
                  </div>

                  {/* Number of Doors */}
                  <div className="panel-section">
                    <h4>Number of Doors</h4>
                    <div className="button-grid">
                      {[1, 2, 3, 4].map((num) => (
                        <button
                          key={num}
                          onClick={() => handleNumberOfDoorsChange(num)}
                          className={
                            selectedCabinet.numberOfDoors === num
                              ? "btn-active"
                              : "btn-secondary"
                          }
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Door Material */}
                  <div className="panel-section">
                    <h4>Door Material</h4>
                    <select
                      value={selectedCabinet.doorMaterial.id}
                      onChange={(e) =>
                        handleMaterialChange("door", e.target.value)
                      }
                      className="select-input"
                    >
                      {DEFAULT_MATERIALS.map((mat) => (
                        <option key={mat.id} value={mat.id}>
                          {mat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Body Material */}
                  <div className="panel-section">
                    <h4>Body Material</h4>
                    <select
                      value={selectedCabinet.bodyMaterial.id}
                      onChange={(e) =>
                        handleMaterialChange("body", e.target.value)
                      }
                      className="select-input"
                    >
                      {DEFAULT_MATERIALS.map((mat) => (
                        <option key={mat.id} value={mat.id}>
                          {mat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Door Type */}
                  <div className="panel-section">
                    <h4>Door Type</h4>
                    <div className="button-grid">
                      {(["swing", "sliding", "folding"] as DoorType[]).map(
                        (type) => (
                          <button
                            key={type}
                            onClick={() => handleDoorTypeChange(type)}
                            className={
                              selectedCabinet.doorType === type
                                ? "btn-active"
                                : "btn-secondary"
                            }
                          >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* Handle Type */}
                  <div className="panel-section">
                    <h4>Handle Type</h4>
                    <div className="button-grid">
                      {(["bar", "knob", "edge", "none"] as HandleType[]).map(
                        (type) => (
                          <button
                            key={type}
                            onClick={() => handleHandleTypeChange(type)}
                            className={
                              selectedCabinet.handle.type === type
                                ? "btn-active"
                                : "btn-secondary"
                            }
                          >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* Handle Color */}
                  {selectedCabinet.handle.type !== "none" && (
                    <div className="panel-section">
                      <h4>Handle Color</h4>
                      <select
                        value={
                          HANDLE_COLORS.find(
                            (c) => c.color === selectedCabinet.handle.color
                          )?.id || "chrome"
                        }
                        onChange={(e) =>
                          handleHandleColorChange(e.target.value)
                        }
                        className="select-input"
                      >
                        {HANDLE_COLORS.map((color) => (
                          <option key={color.id} value={color.id}>
                            {color.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              )}

              {selectedItemType === "benchtop" && selectedBenchtop && (
                <>
                  {/* Position Controls */}
                  <div className="panel-section">
                    <h4>Position (m)</h4>
                    <label>
                      X: {selectedBenchtop.position[0].toFixed(2)}m
                      <input
                        type="range"
                        min="-5"
                        max="5"
                        step={gridSize}
                        value={selectedBenchtop.position[0]}
                        onChange={(e) =>
                          handleBenchtopPositionChange(
                            0,
                            parseFloat(e.target.value)
                          )
                        }
                      />
                    </label>
                    <label>
                      Y (Height): {selectedBenchtop.position[1].toFixed(2)}m
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step={gridSize}
                        value={selectedBenchtop.position[1]}
                        onChange={(e) =>
                          handleBenchtopPositionChange(
                            1,
                            parseFloat(e.target.value)
                          )
                        }
                      />
                    </label>
                    <label>
                      Z: {selectedBenchtop.position[2].toFixed(2)}m
                      <input
                        type="range"
                        min="-5"
                        max="5"
                        step={gridSize}
                        value={selectedBenchtop.position[2]}
                        onChange={(e) =>
                          handleBenchtopPositionChange(
                            2,
                            parseFloat(e.target.value)
                          )
                        }
                      />
                    </label>
                  </div>

                  {/* Rotation */}
                  <div className="panel-section">
                    <h4>Rotation</h4>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <button
                        onClick={() => handleBenchtopRotate("left")}
                        className="btn-secondary"
                        style={{ flex: 1 }}
                      >
                        ↺ Rotate Left
                      </button>
                      <span
                        style={{
                          fontSize: "1.2rem",
                          fontWeight: "bold",
                          minWidth: "45px",
                          textAlign: "center",
                        }}
                      >
                        {selectedBenchtop.rotation || 0}°
                      </span>
                      <button
                        onClick={() => handleBenchtopRotate("right")}
                        className="btn-secondary"
                        style={{ flex: 1 }}
                      >
                        Rotate Right ↻
                      </button>
                    </div>
                  </div>

                  {/* Dimensions */}
                  <div className="panel-section">
                    <h4>Dimensions</h4>
                    <label>
                      Width: {selectedBenchtop.width.toFixed(2)}m
                      <input
                        type="range"
                        min="0.3"
                        max="3.0"
                        step="0.1"
                        value={selectedBenchtop.width}
                        onChange={(e) =>
                          handleBenchtopDimensionChange(
                            "width",
                            parseFloat(e.target.value)
                          )
                        }
                      />
                    </label>
                    <label>
                      Depth: {selectedBenchtop.depth.toFixed(2)}m
                      <input
                        type="range"
                        min="0.3"
                        max="1.0"
                        step="0.05"
                        value={selectedBenchtop.depth}
                        onChange={(e) =>
                          handleBenchtopDimensionChange(
                            "depth",
                            parseFloat(e.target.value)
                          )
                        }
                      />
                    </label>
                    <label>
                      Thickness:{" "}
                      {(selectedBenchtop.thickness * 1000).toFixed(0)}mm
                      <input
                        type="range"
                        min="0.02"
                        max="0.08"
                        step="0.01"
                        value={selectedBenchtop.thickness}
                        onChange={(e) =>
                          handleBenchtopDimensionChange(
                            "thickness",
                            parseFloat(e.target.value)
                          )
                        }
                      />
                    </label>
                    <label>
                      Overhang: {(selectedBenchtop.overhang * 1000).toFixed(0)}
                      mm
                      <input
                        type="range"
                        min="0"
                        max="0.05"
                        step="0.005"
                        value={selectedBenchtop.overhang}
                        onChange={(e) =>
                          handleBenchtopDimensionChange(
                            "overhang",
                            parseFloat(e.target.value)
                          )
                        }
                      />
                    </label>
                  </div>

                  {/* Material */}
                  <div className="panel-section">
                    <h4>Material</h4>
                    <select
                      value={selectedBenchtop.material.id}
                      onChange={(e) =>
                        handleBenchtopMaterialChange(e.target.value)
                      }
                      className="select-input"
                    >
                      {BENCHTOP_MATERIALS.map((mat) => (
                        <option key={mat.id} value={mat.id}>
                          {mat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* No Selection Message */}
      {!selectedCabinet && !selectedBenchtop && (
        <div className="panel-section">
          <p className="hint-text">
            Click on a cabinet or benchtop to select and edit it
          </p>
        </div>
      )}
    </div>
  );
}
