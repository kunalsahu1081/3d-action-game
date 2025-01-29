import * as THREE from "three";
import FireBall from "../fireball/fireball";

const TurretComponent = () => {
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

    return (
        <mesh position={[-1.5, 0, 0.45]} rotation={[0, Math.PI / 2 + 0.1, 0]}>
            <extrudeGeometry args={[cShape, settings]} />
            <meshStandardMaterial {...material_properties_2} />

            <FireBall />
        </mesh>
    );
};

export default TurretComponent;
