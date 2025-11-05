import { useRef, useEffect, useCallback } from "react";
import type { Group } from "three";
import { Raycaster, Vector3, Plane, Vector2 } from "three";
import type { CabinetConfig } from "../types";
import { useThree } from "@react-three/fiber";

interface CabinetProps {
  config: CabinetConfig;
  isSelected: boolean;
  onSelect: () => void;
  onPositionChange: (id: string, position: [number, number, number]) => void;
  onDragStateChange?: (isDragging: boolean) => void;
  snapToGrid: boolean;
  gridSize: number;
  showShadows: boolean;
}
export function Cabinet({
  config,
  isSelected,
  onSelect,
  onPositionChange,
  onDragStateChange,
  snapToGrid,
  gridSize,
  showShadows,
}: CabinetProps) {
  const groupRef = useRef<Group>(null);
  const { camera, gl } = useThree();
  const isDragging = useRef(false);
  const dragPlaneY = useRef(config.position[1]);
  const hasCabinetBeenClicked = useRef(false);

  const snapToGridValue = useCallback(
    (value: number) => {
      if (!snapToGrid) return value;
      return Math.round(value / gridSize) * gridSize;
    },
    [snapToGrid, gridSize]
  );

  useEffect(() => {
    if (!groupRef.current || !isSelected) return;

    const handlePointerDown = () => {
      if (!hasCabinetBeenClicked.current) return; // Only drag if cabinet was clicked
      if (!groupRef.current) return;
      isDragging.current = true;
      dragPlaneY.current = config.position[1];
      gl.domElement.style.cursor = "move";
      onDragStateChange?.(true); // Notify that dragging started
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!isDragging.current || !groupRef.current) return;

      // Calculate world position from mouse
      const rect = gl.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Create raycaster
      const raycaster = new Raycaster();
      raycaster.setFromCamera(new Vector2(x, y), camera);

      // Create a plane at the current Y position
      const planeNormal = new Vector3(0, 1, 0);
      const planePoint = new Vector3(0, dragPlaneY.current, 0);
      const plane = new Plane(planeNormal, -planePoint.dot(planeNormal));

      // Find intersection
      const intersection = new Vector3();
      raycaster.ray.intersectPlane(plane, intersection);

      if (intersection) {
        const newX = snapToGridValue(intersection.x);
        const newZ = snapToGridValue(intersection.z);
        onPositionChange(config.id, [newX, dragPlaneY.current, newZ]);
      }
    };

    const handlePointerUp = () => {
      isDragging.current = false;
      hasCabinetBeenClicked.current = false;
      gl.domElement.style.cursor = "auto";
      onDragStateChange?.(false); // Notify that dragging stopped
    };

    const domElement = gl.domElement;
    domElement.addEventListener("pointerdown", handlePointerDown);
    domElement.addEventListener("pointermove", handlePointerMove);
    domElement.addEventListener("pointerup", handlePointerUp);
    domElement.addEventListener("pointerleave", handlePointerUp);

    return () => {
      domElement.removeEventListener("pointerdown", handlePointerDown);
      domElement.removeEventListener("pointermove", handlePointerMove);
      domElement.removeEventListener("pointerup", handlePointerUp);
      domElement.removeEventListener("pointerleave", handlePointerUp);
    };
  }, [
    isSelected,
    config.id,
    config.position,
    camera,
    gl,
    snapToGridValue,
    onPositionChange,
    onDragStateChange,
  ]);

  const {
    position,
    rotation,
    width,
    height,
    depth,
    doorMaterial,
    bodyMaterial,
    doorType,
    handle,
    numberOfDoors,
  } = config;

  const doorWidth = width / numberOfDoors;

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={[0, (rotation * Math.PI) / 180, 0]}
      onClick={(e) => {
        e.stopPropagation();
        hasCabinetBeenClicked.current = true;
        onSelect();
      }}
      onPointerDown={(e) => {
        if (isSelected) {
          e.stopPropagation();
          hasCabinetBeenClicked.current = true;
        }
      }}
    >
      {/* Cabinet body */}
      <mesh
        position={[0, height / 2, 0]}
        castShadow={showShadows}
        receiveShadow={showShadows}
      >
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={bodyMaterial.color}
          metalness={bodyMaterial.metalness || 0.5}
          roughness={bodyMaterial.roughness || 0.5}
        />
      </mesh>

      {/* Selection outline */}
      {isSelected && (
        <mesh position={[0, height / 2, 0]}>
          <boxGeometry args={[width + 0.02, height + 0.02, depth + 0.02]} />
          <meshBasicMaterial color="#00ff00" wireframe />
        </mesh>
      )}

      {/* Doors */}
      {Array.from({ length: numberOfDoors }).map((_, i) => {
        const doorX = -width / 2 + doorWidth / 2 + i * doorWidth;
        const doorZ = depth / 2 + 0.01; // Slightly in front of body

        return (
          <group key={i} position={[doorX, height / 2, doorZ]}>
            {/* Door panel */}
            <mesh castShadow={showShadows} receiveShadow={showShadows}>
              <boxGeometry args={[doorWidth - 0.01, height - 0.04, 0.02]} />
              <meshStandardMaterial
                color={doorMaterial.color}
                metalness={doorMaterial.metalness || 0.5}
                roughness={doorMaterial.roughness || 0.5}
              />
            </mesh>

            {/* Door handle */}
            {handle.type === "bar" && (
              <mesh
                position={[doorWidth / 3, 0, 0.02]}
                castShadow={showShadows}
              >
                <boxGeometry args={[0.02, height * 0.3, 0.02]} />
                <meshStandardMaterial
                  color={handle.color}
                  metalness={0.9}
                  roughness={0.1}
                />
              </mesh>
            )}
            {handle.type === "knob" && (
              <mesh
                position={[doorWidth / 3, 0, 0.03]}
                castShadow={showShadows}
              >
                <sphereGeometry args={[0.02, 16, 16]} />
                <meshStandardMaterial
                  color={handle.color}
                  metalness={0.9}
                  roughness={0.1}
                />
              </mesh>
            )}
            {handle.type === "edge" && (
              <mesh
                position={[doorWidth / 2 - 0.02, 0, 0]}
                castShadow={showShadows}
              >
                <boxGeometry args={[0.03, height * 0.4, 0.03]} />
                <meshStandardMaterial
                  color={handle.color}
                  metalness={0.9}
                  roughness={0.1}
                />
              </mesh>
            )}

            {/* Visual indicator for door type */}
            {doorType === "sliding" && (
              <mesh position={[0, height / 2 + 0.01, 0]}>
                <boxGeometry args={[doorWidth - 0.02, 0.01, 0.03]} />
                <meshStandardMaterial color="#888888" />
              </mesh>
            )}
            {doorType === "folding" && (
              <>
                <mesh position={[-doorWidth / 4, 0, 0.015]}>
                  <boxGeometry args={[0.005, height - 0.04, 0.025]} />
                  <meshStandardMaterial color="#666666" />
                </mesh>
              </>
            )}
          </group>
        );
      })}
    </group>
  );
}
