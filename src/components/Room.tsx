import type { RoomConfig } from "../types";
import { DoubleSide } from "three";
import { Line } from "@react-three/drei";

interface RoomProps {
  config: RoomConfig;
}

export function Room({ config }: RoomProps) {
  const {
    width,
    length,
    height,
    floorColor,
    wallColor,
    wallOpacity,
    showWalls,
    showNorthWall,
    showSouthWall,
    showEastWall,
    showWestWall,
    showShadows,
  } = config;

  const halfWidth = width / 2;
  const halfLength = length / 2;
  const halfHeight = height / 2;

  return (
    <group>
      {/* Floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow={showShadows}
      >
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial
          color={floorColor}
          side={DoubleSide}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Floor border outline */}
      <Line
        points={[
          [-halfWidth, 0, -halfLength],
          [halfWidth, 0, -halfLength],
          [halfWidth, 0, halfLength],
          [-halfWidth, 0, halfLength],
          [-halfWidth, 0, -halfLength],
        ]}
        color="#555555"
        lineWidth={2}
      />

      {showWalls && (
        <>
          {/* North Wall (positive Z) */}
          {showNorthWall && (
            <>
              <mesh
                position={[0, halfHeight, halfLength]}
                castShadow={showShadows}
                receiveShadow={showShadows}
              >
                <planeGeometry args={[width, height]} />
                <meshStandardMaterial
                  color={wallColor}
                  side={DoubleSide}
                  roughness={0.9}
                  metalness={0}
                  transparent={wallOpacity < 1}
                  opacity={wallOpacity}
                />
              </mesh>
              {/* North wall outline */}
              <Line
                points={[
                  [-halfWidth, 0, halfLength],
                  [halfWidth, 0, halfLength],
                  [halfWidth, height, halfLength],
                  [-halfWidth, height, halfLength],
                  [-halfWidth, 0, halfLength],
                ]}
                color="#666666"
                lineWidth={2}
              />
            </>
          )}

          {/* South Wall (negative Z) */}
          {showSouthWall && (
            <>
              <mesh
                position={[0, halfHeight, -halfLength]}
                rotation={[0, Math.PI, 0]}
                castShadow={showShadows}
                receiveShadow={showShadows}
              >
                <planeGeometry args={[width, height]} />
                <meshStandardMaterial
                  color={wallColor}
                  side={DoubleSide}
                  roughness={0.9}
                  metalness={0}
                  transparent={wallOpacity < 1}
                  opacity={wallOpacity}
                />
              </mesh>
              {/* South wall outline */}
              <Line
                points={[
                  [-halfWidth, 0, -halfLength],
                  [halfWidth, 0, -halfLength],
                  [halfWidth, height, -halfLength],
                  [-halfWidth, height, -halfLength],
                  [-halfWidth, 0, -halfLength],
                ]}
                color="#666666"
                lineWidth={2}
              />
            </>
          )}

          {/* East Wall (positive X) */}
          {showEastWall && (
            <>
              <mesh
                position={[halfWidth, halfHeight, 0]}
                rotation={[0, -Math.PI / 2, 0]}
                castShadow={showShadows}
                receiveShadow={showShadows}
              >
                <planeGeometry args={[length, height]} />
                <meshStandardMaterial
                  color={wallColor}
                  side={DoubleSide}
                  roughness={0.9}
                  metalness={0}
                  transparent={wallOpacity < 1}
                  opacity={wallOpacity}
                />
              </mesh>
              {/* East wall outline */}
              <Line
                points={[
                  [halfWidth, 0, -halfLength],
                  [halfWidth, 0, halfLength],
                  [halfWidth, height, halfLength],
                  [halfWidth, height, -halfLength],
                  [halfWidth, 0, -halfLength],
                ]}
                color="#666666"
                lineWidth={2}
              />
            </>
          )}

          {/* West Wall (negative X) */}
          {showWestWall && (
            <>
              <mesh
                position={[-halfWidth, halfHeight, 0]}
                rotation={[0, Math.PI / 2, 0]}
                castShadow={showShadows}
                receiveShadow={showShadows}
              >
                <planeGeometry args={[length, height]} />
                <meshStandardMaterial
                  color={wallColor}
                  side={DoubleSide}
                  roughness={0.9}
                  metalness={0}
                  transparent={wallOpacity < 1}
                  opacity={wallOpacity}
                />
              </mesh>
              {/* West wall outline */}
              <Line
                points={[
                  [-halfWidth, 0, -halfLength],
                  [-halfWidth, 0, halfLength],
                  [-halfWidth, height, halfLength],
                  [-halfWidth, height, -halfLength],
                  [-halfWidth, 0, -halfLength],
                ]}
                color="#666666"
                lineWidth={2}
              />
            </>
          )}
        </>
      )}

      {/* Floor dimension markers */}
      {/* Width marker (along X axis - Red) */}
      <Line
        points={[
          [-halfWidth, 0.01, -halfLength],
          [halfWidth, 0.01, -halfLength],
        ]}
        color="#ff6b6b"
        lineWidth={3}
      />

      {/* Length marker (along Z axis - Cyan) */}
      <Line
        points={[
          [halfWidth, 0.01, -halfLength],
          [halfWidth, 0.01, halfLength],
        ]}
        color="#4ecdc4"
        lineWidth={3}
      />
    </group>
  );
}
