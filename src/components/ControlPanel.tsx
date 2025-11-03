import type {
  CabinetConfig,
  DoorType,
  HandleType,
  CameraViewType,
  RoomConfig,
} from "../types";
import {
  DEFAULT_MATERIALS,
  HANDLE_COLORS,
  FLOOR_COLORS,
  WALL_COLORS,
} from "../constants";
import "./ControlPanel.css";

interface ControlPanelProps {
  selectedCabinet: CabinetConfig | null;
  onAddCabinet: () => void;
  onUpdateCabinet: (id: string, updates: Partial<CabinetConfig>) => void;
  onDeleteCabinet: (id: string) => void;
  cameraView: CameraViewType;
  onCameraViewChange: (view: CameraViewType) => void;
  snapToGrid: boolean;
  onSnapToGridChange: (snap: boolean) => void;
  gridSize: number;
  roomConfig: RoomConfig;
  onRoomConfigChange: (updates: Partial<RoomConfig>) => void;
}

export function ControlPanel({
  selectedCabinet,
  onAddCabinet,
  onUpdateCabinet,
  onDeleteCabinet,
  cameraView,
  onCameraViewChange,
  snapToGrid,
  onSnapToGridChange,
  gridSize,
  roomConfig,
  onRoomConfigChange,
}: ControlPanelProps) {
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

  return (
    <div className="control-panel">
      <div className="panel-section">
        <h2>Kitchen Designer</h2>
        <button onClick={onAddCabinet} className="btn-primary">
          + Add Cabinet
        </button>
      </div>

      <div className="panel-section">
        <h3>Room Setup</h3>

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
              FLOOR_COLORS.find((c) => c.color === roomConfig.floorColor)?.id ||
              "light-oak"
            }
            onChange={(e) => {
              const color = FLOOR_COLORS.find((c) => c.id === e.target.value);
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

              <h4>Wall Opacity</h4>
              <label>
                {Math.round(roomConfig.wallOpacity * 100)}%
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={roomConfig.wallOpacity}
                  onChange={(e) =>
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
                      onRoomConfigChange({ showNorthWall: e.target.checked })
                    }
                  />
                  <span>North Wall</span>
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={roomConfig.showSouthWall}
                    onChange={(e) =>
                      onRoomConfigChange({ showSouthWall: e.target.checked })
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
      </div>

      <div className="panel-section">
        <h3>Camera View</h3>
        <div className="button-grid">
          {(
            [
              "free",
              "front",
              "back",
              "left",
              "right",
              "top",
              "isometric",
            ] as CameraViewType[]
          ).map((view) => (
            <button
              key={view}
              onClick={() => onCameraViewChange(view)}
              className={cameraView === view ? "btn-active" : "btn-secondary"}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="panel-section">
        <h3>Positioning</h3>
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

      {selectedCabinet ? (
        <>
          <div className="panel-section">
            <h3>Selected Cabinet</h3>
            <button
              onClick={() => onDeleteCabinet(selectedCabinet.id)}
              className="btn-danger"
            >
              Delete Cabinet
            </button>
          </div>

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
                  handleDimensionChange("width", parseFloat(e.target.value))
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
                  handleDimensionChange("height", parseFloat(e.target.value))
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
                  handleDimensionChange("depth", parseFloat(e.target.value))
                }
              />
            </label>
          </div>

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

          <div className="panel-section">
            <h4>Door Material</h4>
            <select
              value={selectedCabinet.doorMaterial.id}
              onChange={(e) => handleMaterialChange("door", e.target.value)}
              className="select-input"
            >
              {DEFAULT_MATERIALS.map((mat) => (
                <option key={mat.id} value={mat.id}>
                  {mat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="panel-section">
            <h4>Body Material</h4>
            <select
              value={selectedCabinet.bodyMaterial.id}
              onChange={(e) => handleMaterialChange("body", e.target.value)}
              className="select-input"
            >
              {DEFAULT_MATERIALS.map((mat) => (
                <option key={mat.id} value={mat.id}>
                  {mat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="panel-section">
            <h4>Door Type</h4>
            <div className="button-grid">
              {(["swing", "sliding", "folding"] as DoorType[]).map((type) => (
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
              ))}
            </div>
          </div>

          <div className="panel-section">
            <h4>Handle Type</h4>
            <div className="button-grid">
              {(["bar", "knob", "edge", "none"] as HandleType[]).map((type) => (
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
              ))}
            </div>
          </div>

          {selectedCabinet.handle.type !== "none" && (
            <div className="panel-section">
              <h4>Handle Color</h4>
              <select
                value={
                  HANDLE_COLORS.find(
                    (c) => c.color === selectedCabinet.handle.color
                  )?.id || "chrome"
                }
                onChange={(e) => handleHandleColorChange(e.target.value)}
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
      ) : (
        <div className="panel-section">
          <p className="hint-text">Click on a cabinet to select and edit it</p>
        </div>
      )}
    </div>
  );
}
