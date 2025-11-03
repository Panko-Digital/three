import type { CameraViewType } from "../types";
import "./NavBar.css";

interface NavBarProps {
  cameraView: CameraViewType;
  onCameraViewChange: (view: CameraViewType) => void;
}

export function NavBar({ cameraView, onCameraViewChange }: NavBarProps) {
  return (
    <nav className="nav-bar">
      <div className="nav-logo">
        <h1>Designer</h1>
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
    </nav>
  );
}
