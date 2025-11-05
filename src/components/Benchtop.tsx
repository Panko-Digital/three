import { useRef, useEffect, useCallback } from "react";
import type { Group } from "three";
import { Raycaster, Vector3, Plane, Vector2 } from "three";
import type { BenchtopConfig } from "../types";
import { useThree } from "@react-three/fiber";

interface BenchtopProps {
  config: BenchtopConfig;
  isSelected: boolean;
  onSelect: () => void;
  onPositionChange: (id: string, position: [number, number, number]) => void;
  onDragStateChange?: (isDragging: boolean) => void;
  snapToGrid: boolean;
  gridSize: number;
  showShadows: boolean;
}

export function Benchtop({
  config,
  isSelected,
  onSelect,
  onPositionChange,
  onDragStateChange,
  snapToGrid,
  gridSize,
  showShadows,
}: BenchtopProps) {
  const groupRef = useRef<Group>(null);
  const { camera, gl } = useThree();
  const isDragging = useRef(false);
  const dragPlaneY = useRef(config.position[1]);
  const hasBenchtopBeenClicked = useRef(false);

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
      if (!hasBenchtopBeenClicked.current) return;
      if (!groupRef.current) return;
      isDragging.current = true;
      dragPlaneY.current = config.position[1];
      gl.domElement.style.cursor = "move";
      onDragStateChange?.(true);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!isDragging.current || !groupRef.current) return;

      const rect = gl.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new Raycaster();
      raycaster.setFromCamera(new Vector2(x, y), camera);

      const planeNormal = new Vector3(0, 1, 0);
      const planePoint = new Vector3(0, dragPlaneY.current, 0);
      const plane = new Plane(planeNormal, -planePoint.dot(planeNormal));

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
      hasBenchtopBeenClicked.current = false;
      gl.domElement.style.cursor = "auto";
      onDragStateChange?.(false);
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

  const { position, rotation, width, depth, thickness, material, overhang } =
    config;

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={[0, (rotation * Math.PI) / 180, 0]}
      onClick={(e) => {
        e.stopPropagation();
        hasBenchtopBeenClicked.current = true;
        onSelect();
      }}
      onPointerDown={(e) => {
        if (isSelected) {
          e.stopPropagation();
          hasBenchtopBeenClicked.current = true;
        }
      }}
    >
      {/* Benchtop surface */}
      <mesh
        position={[0, thickness / 2, 0]}
        castShadow={showShadows}
        receiveShadow={showShadows}
      >
        <boxGeometry
          args={[width + overhang * 2, thickness, depth + overhang * 2]}
        />
        <meshStandardMaterial
          color={material.color}
          metalness={material.metalness || 0.5}
          roughness={material.roughness || 0.5}
        />
      </mesh>

      {/* Selection outline */}
      {isSelected && (
        <mesh position={[0, thickness / 2, 0]}>
          <boxGeometry
            args={[
              width + overhang * 2 + 0.02,
              thickness + 0.02,
              depth + overhang * 2 + 0.02,
            ]}
          />
          <meshBasicMaterial color="#00ff00" wireframe />
        </mesh>
      )}

      {/* Edge detail - slight bevel on front edge */}
      <mesh
        position={[0, thickness / 2, (depth + overhang * 2) / 2]}
        castShadow={showShadows}
      >
        <boxGeometry args={[width + overhang * 2, thickness * 0.8, 0.01]} />
        <meshStandardMaterial
          color={material.color}
          metalness={(material.metalness || 0.5) + 0.1}
          roughness={(material.roughness || 0.5) - 0.1}
        />
      </mesh>
    </group>
  );
}
