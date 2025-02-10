import * as THREE from "three";
import FireBall from "../fireball/fireball";
import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";

const TurretComponent = ({ targetRef }: any) => {
    const [moveBall, setMoveBall] = useState(false);
    const ballRef = useRef<any>();

    const texture = new THREE.TextureLoader().load(
        "src/assets/character-texture.png",
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

    const cShape = new THREE.Shape();

    (function f(ctx) {
        ctx.absarc(0, 0, 0.05, 0, Math.PI * 2);
    })(cShape);

    const holePath = new THREE.Path();

    (function f(ctx) {
        ctx.absarc(0, 0, 0.035, 0, Math.PI * 2);
    })(holePath);

    cShape.holes.push(holePath);

    const settings: any = {};
    settings.depth = 1.5;
    settings.bevelEnabled = false;

    useFrame(({ clock }) => {
        if (moveBall && ballRef.current.position.z > -10) {
            ballRef.current.position.z -= 0.5;

            console.log(ballRef.current.position.z);

            if (
                Math.abs(
                    -ballRef.current.position.z - targetRef.current.position.x
                ) < 1
            ) {
                ballRef.current.position.z = 0;
                ballRef.current.rotation.z = 0;
                setMoveBall(false);
            }
        } else if (moveBall) {
            ballRef.current.position.z = 0;
            ballRef.current.rotation.z = 0;
            setMoveBall(false);
        }
    });

    const handleClickEvent = (event: any) => {
        if (event.keyCode == 13) {
            setMoveBall(true);
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", handleClickEvent);

        return () => {
            window.removeEventListener("keydown", handleClickEvent);
        };
    }, []);

    return (
        <mesh position={[-1.5, 0, 0.5]} rotation={[0, Math.PI / 2 + 0.1, 0]}>
            <extrudeGeometry args={[cShape, settings]} />
            <meshStandardMaterial {...material_properties_2} />

            <FireBall ballRef={ballRef} />
        </mesh>
    );
};

export default TurretComponent;
