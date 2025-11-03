import type { CabinetConfig } from "../types";
import "./CabinetList.css";

interface CabinetListProps {
  cabinets: CabinetConfig[];
  selectedCabinetId: string | null;
  onSelectCabinet: (id: string) => void;
}

export function CabinetList({
  cabinets,
  selectedCabinetId,
  onSelectCabinet,
}: CabinetListProps) {
  if (cabinets.length === 0) {
    return (
      <div className="cabinet-list">
        <h3>Cabinet List</h3>
        <p className="empty-state">No cabinets added yet</p>
      </div>
    );
  }

  return (
    <div className="cabinet-list">
      <h3>Cabinet List ({cabinets.length})</h3>
      <div className="cabinet-list-items">
        {cabinets.map((cabinet, index) => {
          const isSelected = cabinet.id === selectedCabinetId;
          return (
            <div
              key={cabinet.id}
              className={`cabinet-item ${isSelected ? "selected" : ""}`}
              onClick={() => onSelectCabinet(cabinet.id)}
            >
              <div className="cabinet-item-header">
                <span className="cabinet-number">#{index + 1}</span>
                <span className="cabinet-type">{cabinet.doorType} door</span>
              </div>
              <div className="cabinet-dimensions">
                <div className="dimension">
                  <span className="dimension-label">W:</span>
                  <span className="dimension-value">
                    {(cabinet.width * 100).toFixed(0)}cm
                  </span>
                </div>
                <div className="dimension">
                  <span className="dimension-label">H:</span>
                  <span className="dimension-value">
                    {(cabinet.height * 100).toFixed(0)}cm
                  </span>
                </div>
                <div className="dimension">
                  <span className="dimension-label">D:</span>
                  <span className="dimension-value">
                    {(cabinet.depth * 100).toFixed(0)}cm
                  </span>
                </div>
              </div>
              <div className="cabinet-position">
                Position: ({cabinet.position[0].toFixed(2)},{" "}
                {cabinet.position[1].toFixed(2)},{" "}
                {cabinet.position[2].toFixed(2)})m
              </div>
              <div className="cabinet-doors">
                {cabinet.numberOfDoors}{" "}
                {cabinet.numberOfDoors === 1 ? "door" : "doors"}
                {" · "}
                {cabinet.handle.type} handle
              </div>
            </div>
          );
        })}
      </div>
      <p className="cabinet-list-note">
        Click a cabinet to select it. This list will be used for cost
        estimation.
      </p>
    </div>
  );
}
