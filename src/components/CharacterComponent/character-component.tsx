import * as THREE from "three";
import PrismComponent from "../PrismComponent/PrismComponent";
import FrontCurve, { SideCurve } from "../frontCurve/front-curve";
import TurretComponent from "../turretComponent/turret-component";

import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

const CharacterComponent = ({ targetRef }: any) => {
    const caRef = useRef<any>();
    const [prev_angle, set_prev_angle] = useState(0);
    const [rotate_left, set_rotate_left] = useState(false);
    const [rotate_right, set_rotate_right] = useState(false);

    const texture = new THREE.TextureLoader().load(
        "src/assets/character-texture.png",
        function (tx: any) {
            tx.anisotropy = 0;
            tx.magFilter = THREE.NearestFilter;
            tx.minFilter = THREE.LinearFilter;
        }
    );

    const texture_2 = new THREE.TextureLoader().load(
        "src/assets/army-camouflage-tank-turret-armor-background-d-illustration-89183250.png",
        function (tx: any) {
            tx.anisotropy = 0;
            tx.magFilter = THREE.NearestFilter;
            tx.minFilter = THREE.LinearFilter;
        }
    );

    const material_properties_2: any = {
        map: texture,
        roughness: 0.25,
        metalness: 0.75,
        fog: true,
    };

    const material_properties_3: any = {
        map: texture_2,
        roughness: 0.25,
        metalness: 0.75,
        fog: true,
    };

    useFrame(({ clock }) => {
        if (rotate_left) {
            if (prev_angle - caRef.current.rotation.z >= Math.PI / 2) {
                caRef.current.rotation.z = prev_angle - Math.PI / 2;

                set_rotate_left(false);
                set_prev_angle(caRef.current.rotation.z);
            } else {
                caRef.current.rotation.z -= 0.01;
            }
        }

        if (rotate_right) {
            if (caRef.current.rotation.z - prev_angle >= Math.PI / 2) {
                caRef.current.rotation.z = prev_angle + Math.PI / 2;

                set_rotate_right(false);
                set_prev_angle(caRef.current.rotation.z);
            } else {
                caRef.current.rotation.z += 0.01;
            }
        }
    });

    const handleClickEvent = (event: any) => {
        if (event.keyCode == 39) {
            set_rotate_right(false);
            // set_prev_angle(caRef.current.rotation.z);
            set_rotate_left(true);
        }
        if (event.keyCode == 37) {
            set_rotate_left(false);
            // set_prev_angle(caRef.current.rotation.z);
            set_rotate_right(true);
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", handleClickEvent);

        return () => {
            window.removeEventListener("keydown", handleClickEvent);
        };
    }, [rotate_left, rotate_right]);

    return (
        <>
            <mesh position={[0, 0, 0]}>
                <mesh position={[0.35, 0, 0]}>
                    <mesh
                        rotation={[0, Math.PI / 4, Math.PI / 2]}
                        position={[0.35, 0, 0.01]}
                    >
                        <boxGeometry args={[1, 0.5, 0.05]} />
                        <meshStandardMaterial {...material_properties_2} />
                    </mesh>

                    <mesh
                        rotation={[0, (-1 * Math.PI) / 6, Math.PI / 2]}
                        position={[0.4, 0, -0.25]}
                    >
                        <boxGeometry args={[1, 0.35, 0.05]} />
                        <meshStandardMaterial {...material_properties_2} />
                    </mesh>

                    <mesh
                        position={[0.2, 0.49, -0.16]}
                        rotation={[-Math.PI / 2, 0, 0]}
                    >
                        <PrismComponent
                            vertices={[
                                { x: 0, y: 0 },
                                { x: 0.31, y: 0 },
                                { x: 0, y: 0.176 },
                            ]}
                            height={0.01}
                        />
                        <meshStandardMaterial {...material_properties_2} />
                    </mesh>

                    <mesh
                        position={[0.2, -0.5, -0.16]}
                        rotation={[-Math.PI / 2, 0, 0]}
                    >
                        <PrismComponent
                            vertices={[
                                { x: 0, y: 0 },
                                { x: 0.31, y: 0 },
                                { x: 0, y: 0.176 },
                            ]}
                            height={0.01}
                        />
                        <meshStandardMaterial {...material_properties_2} />
                    </mesh>

                    <mesh
                        position={[0.15, -0.49, -0.16]}
                        rotation={[Math.PI / 2, 0, 0]}
                    >
                        <PrismComponent
                            vertices={[
                                { x: 0, y: 0 },
                                { x: 0.35, y: 0 },
                                { x: 0, y: 0.35 },
                            ]}
                            height={0.01}
                        />
                        <meshStandardMaterial {...material_properties_2} />
                    </mesh>

                    <mesh
                        position={[0.15, 0.5, -0.16]}
                        rotation={[Math.PI / 2, 0, 0]}
                    >
                        <PrismComponent
                            vertices={[
                                { x: 0, y: 0 },
                                { x: 0.35, y: 0 },
                                { x: 0, y: 0.35 },
                            ]}
                            height={0.01}
                        />
                        <meshStandardMaterial {...material_properties_2} />
                    </mesh>
                </mesh>

                <mesh rotation={[0, 0, Math.PI]} position={[-0.35, 0, 0]}>
                    <mesh
                        rotation={[0, Math.PI / 4, Math.PI / 2]}
                        position={[0.35, 0, 0.01]}
                    >
                        <boxGeometry args={[1, 0.5, 0.05]} />
                        <meshStandardMaterial {...material_properties_2} />
                    </mesh>

                    <mesh
                        rotation={[0, (-1 * Math.PI) / 6, Math.PI / 2]}
                        position={[0.4, 0, -0.25]}
                    >
                        <boxGeometry args={[1, 0.35, 0.05]} />
                        <meshStandardMaterial {...material_properties_2} />
                    </mesh>

                    <mesh
                        position={[0.2, 0.49, -0.16]}
                        rotation={[-Math.PI / 2, 0, 0]}
                    >
                        <PrismComponent
                            vertices={[
                                { x: 0, y: 0 },
                                { x: 0.31, y: 0 },
                                { x: 0, y: 0.176 },
                            ]}
                            height={0.01}
                        />
                        <meshStandardMaterial {...material_properties_2} />
                    </mesh>

                    <mesh
                        position={[0.2, -0.5, -0.16]}
                        rotation={[-Math.PI / 2, 0, 0]}
                    >
                        <PrismComponent
                            vertices={[
                                { x: 0, y: 0 },
                                { x: 0.31, y: 0 },
                                { x: 0, y: 0.176 },
                            ]}
                            height={0.01}
                        />
                        <meshStandardMaterial {...material_properties_2} />
                    </mesh>

                    <mesh
                        position={[0.15, -0.49, -0.16]}
                        rotation={[Math.PI / 2, 0, 0]}
                    >
                        <PrismComponent
                            vertices={[
                                { x: 0, y: 0 },
                                { x: 0.35, y: 0 },
                                { x: 0, y: 0.35 },
                            ]}
                            height={0.01}
                        />
                        <meshStandardMaterial {...material_properties_2} />
                    </mesh>

                    <mesh
                        position={[0.15, 0.5, -0.16]}
                        rotation={[Math.PI / 2, 0, 0]}
                    >
                        <PrismComponent
                            vertices={[
                                { x: 0, y: 0 },
                                { x: 0.35, y: 0 },
                                { x: 0, y: 0.35 },
                            ]}
                            height={0.01}
                        />
                        <meshStandardMaterial {...material_properties_2} />
                    </mesh>
                </mesh>

                <mesh position={[0, 0, -0.335]}>
                    <boxGeometry args={[1.22, 1, 0.05]} />
                    <meshStandardMaterial {...material_properties_2} />
                </mesh>

                <mesh position={[0, 0, 0.18]}>
                    <boxGeometry args={[1.08, 1, 0.05]} />
                    <meshStandardMaterial {...material_properties_2} />
                </mesh>

                <mesh
                    position={[0, 0.475, -0.08]}
                    rotation={[Math.PI / 2, 0, 0]}
                >
                    <boxGeometry args={[1.1, 0.5, 0.05]} />
                    <meshStandardMaterial {...material_properties_2} />
                </mesh>

                <mesh
                    position={[0, -0.475, -0.08]}
                    rotation={[Math.PI / 2, 0, 0]}
                >
                    <boxGeometry args={[1.1, 0.5, 0.05]} />
                    <meshStandardMaterial {...material_properties_2} />
                </mesh>

                <mesh ref={caRef} rotation={[0, 0, 0]} position={[0, 0, -0.05]}>
                    <mesh
                        position={[0.3, 0.3, -0.1]}
                        rotation={[Math.PI / 2, 0, 0]}
                    >
                        <FrontCurve />
                        <meshStandardMaterial {...material_properties_3} />
                    </mesh>

                    <mesh
                        position={[-0.2, -0.3, -0.1]}
                        rotation={[-Math.PI / 2, 0, Math.PI]}
                    >
                        <FrontCurve />
                        <meshStandardMaterial {...material_properties_3} />
                    </mesh>

                    <mesh
                        position={[-0.15, -0.35, -0.1]}
                        rotation={[-Math.PI / 2, 0, Math.PI]}
                    >
                        <SideCurve />
                        <meshStandardMaterial {...material_properties_2} />
                    </mesh>

                    <mesh
                        position={[-0.15, 0.25, -0.1]}
                        rotation={[-Math.PI / 2, 0, Math.PI]}
                    >
                        <SideCurve />
                        <meshStandardMaterial {...material_properties_2} />
                    </mesh>

                    <mesh position={[0.05, 0, 0.525]} rotation={[0, 0, 0]}>
                        <boxGeometry args={[0.5, 0.5, 0.05]} />
                        <meshStandardMaterial {...material_properties_2} />
                    </mesh>

                    <mesh
                        position={[0.05, -0.25, 0.4]}
                        rotation={[Math.PI / 2, 0, 0]}
                    >
                        <boxGeometry args={[0.5, 0.2, 0.05]} />
                        <meshStandardMaterial {...material_properties_3} />
                    </mesh>

                    <mesh
                        position={[0.05, 0.25, 0.4]}
                        rotation={[Math.PI / 2, 0, 0]}
                    >
                        <boxGeometry args={[0.5, 0.2, 0.05]} />
                        <meshStandardMaterial {...material_properties_3} />
                    </mesh>

                    <TurretComponent targetRef={targetRef} />
                </mesh>

                {/* <meshStandardMaterial {...material_properties} /> */}
            </mesh>
        </>
    );
};

export default CharacterComponent;
