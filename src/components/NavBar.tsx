import { Undo2, Redo2 } from "lucide-react";
import type { CameraViewType, KitchenDesignFile } from "../types";
import "./NavBar.css";

interface NavBarProps {
  cameraView: CameraViewType;
  onCameraViewChange: (view: CameraViewType) => void;
  onExport: () => void;
  onImport: (data: KitchenDesignFile) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function NavBar({
  cameraView,
  onCameraViewChange,
  onExport,
  onImport,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}: NavBarProps) {
  const handleImportClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          onImport(data);
        } catch {
          alert("Invalid design file.");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <nav className="nav-bar">
      <div className="nav-logo">
        <h1>Kitchen Designer - Panko</h1>
      </div>

      <div className="nav-history">
        <button
          className="nav-btn nav-btn-history"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          aria-label="Undo"
        >
          <Undo2 size={18} />
        </button>
        <button
          className="nav-btn nav-btn-history"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Shift+Z)"
          aria-label="Redo"
        >
          <Redo2 size={18} />
        </button>
      </div>

      <div className="nav-views">
        <span className="nav-label">Camera view</span>
        <div className="nav-button-group">
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
              className={`nav-btn ${
                cameraView === view ? "nav-btn-active" : ""
              }`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="nav-actions">
        <button className="nav-btn nav-btn-export" onClick={onExport}>
          ⬇ Export
        </button>
        <button className="nav-btn nav-btn-import" onClick={handleImportClick}>
          ⬆ Import
        </button>
      </div>
    </nav>
  );
}
