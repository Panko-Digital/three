import type { CabinetConfig } from "../types";
import {
  calculateCabinetCost,
  calculateTotalProjectCost,
  formatAUD,
} from "../utils/costCalculations";
import "./CostEstimator.css";

interface CostEstimatorProps {
  cabinets: CabinetConfig[];
  selectedCabinetId: string | null;
}

export function CostEstimator({
  cabinets,
  selectedCabinetId,
}: CostEstimatorProps) {
  if (cabinets.length === 0) {
    return (
      <div className="cost-estimator">
        <h3>Cost Estimation</h3>
        <p className="empty-state">Add cabinets to see cost estimates</p>
      </div>
    );
  }

  const projectCost = calculateTotalProjectCost(cabinets);
  const selectedCabinet = cabinets.find((c) => c.id === selectedCabinetId);
  const selectedCost = selectedCabinet
    ? calculateCabinetCost(selectedCabinet)
    : null;

  return (
    <div className="cost-estimator">
      <h3>Cost Estimation</h3>

      {/* Project Total Summary */}
      <div className="cost-summary">
        <div className="cost-summary-row total">
          <span className="cost-label">Project Total</span>
          <span className="cost-value">
            {formatAUD(projectCost.cabinetsTotal)}
          </span>
        </div>
        <div className="cost-summary-meta">
          {projectCost.totalCabinets}{" "}
          {projectCost.totalCabinets === 1 ? "cabinet" : "cabinets"}
        </div>
      </div>

      {/* Selected Cabinet Details */}
      {selectedCabinet && selectedCost && (
        <div className="selected-cabinet-cost">
          <h4>Selected Cabinet Cost</h4>
          <div className="cost-breakdown">
            <div className="cost-item">
              <span className="cost-item-label">Door Material</span>
              <span className="cost-item-value">
                {formatAUD(selectedCost.doorMaterialCost)}
              </span>
            </div>
            <div className="cost-item-detail">
              {selectedCabinet.doorMaterial.name} •{" "}
              {selectedCabinet.numberOfDoors} door
              {selectedCabinet.numberOfDoors > 1 ? "s" : ""}
            </div>

            <div className="cost-item">
              <span className="cost-item-label">Body Material</span>
              <span className="cost-item-value">
                {formatAUD(selectedCost.bodyMaterialCost)}
              </span>
            </div>
            <div className="cost-item-detail">
              {selectedCabinet.bodyMaterial.name} •{" "}
              {(selectedCabinet.width * 100).toFixed(0)}×
              {(selectedCabinet.height * 100).toFixed(0)}×
              {(selectedCabinet.depth * 100).toFixed(0)}cm
            </div>

            <div className="cost-item">
              <span className="cost-item-label">Handles</span>
              <span className="cost-item-value">
                {formatAUD(selectedCost.handlesCost)}
              </span>
            </div>
            <div className="cost-item-detail">
              {selectedCabinet.handle.type} • {selectedCabinet.numberOfDoors}{" "}
              unit
              {selectedCabinet.numberOfDoors > 1 ? "s" : ""}
            </div>

            <div className="cost-item">
              <span className="cost-item-label">Hardware & Fixtures</span>
              <span className="cost-item-value">
                {formatAUD(selectedCost.hardwareCost)}
              </span>
            </div>
            <div className="cost-item-detail">
              Hinges, brackets, shelving, fixings
              {selectedCost.doorTypeMultiplier > 1 && (
                <span className="multiplier-note">
                  {" "}
                  (×{selectedCost.doorTypeMultiplier.toFixed(1)} for{" "}
                  {selectedCabinet.doorType} doors)
                </span>
              )}
            </div>

            <div className="cost-divider"></div>

            <div className="cost-item total">
              <span className="cost-item-label">Cabinet Total</span>
              <span className="cost-item-value">
                {formatAUD(selectedCost.total)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* All Cabinets List */}
      <div className="all-cabinets-cost">
        <h4>All Cabinets</h4>
        <div className="cabinet-cost-list">
          {projectCost.cabinetsBreakdown.map((item, index) => {
            const cabinet = cabinets.find((c) => c.id === item.cabinetId);
            if (!cabinet) return null;

            const isSelected = cabinet.id === selectedCabinetId;

            return (
              <div
                key={item.cabinetId}
                className={`cabinet-cost-item ${isSelected ? "selected" : ""}`}
              >
                <div className="cabinet-cost-header">
                  <span className="cabinet-cost-number">#{index + 1}</span>
                  <span className="cabinet-cost-amount">
                    {formatAUD(item.cost.total)}
                  </span>
                </div>
                <div className="cabinet-cost-details">
                  {(cabinet.width * 100).toFixed(0)}×
                  {(cabinet.height * 100).toFixed(0)}×
                  {(cabinet.depth * 100).toFixed(0)}cm •{" "}
                  {cabinet.doorMaterial.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="cost-note">
        <p>
          💡 Prices are estimates in AUD and include materials, hardware, and
          fixtures. Installation and delivery not included.
        </p>
      </div>
    </div>
  );
}
