interface IBoundary {
    height: number;
    width: number;
    thickness: number;
}

const Boundary = ({ height, width, thickness }: IBoundary) => {
    const material_properties: any = {
        metalness: 0.9,
        roughness: 0.05,
        envMapIntensity: 0.9,
        clearcoat: 1,
        transparent: true,
        // transmission: 0.95,
        opacity: 0.5,
        reflectivity: 0.2,
        refractionRatio: 0.985,
        ior: 0.9,
    };

    const cylinder_properties = [0.5, 0.5, 0.1, 32, 32, false];

    const cylinder_properties_1 = [
        ...cylinder_properties,
        Math.PI / 2,
        Math.PI / 2,
    ];

    const cylinder_properties_2 = [
        ...cylinder_properties,
        -1 * Math.PI,
        Math.PI / 2,
    ];

    const cylinder_properties_3 = [...cylinder_properties, 0, Math.PI / 2];

    const cylinder_properties_4 = [
        ...cylinder_properties,
        (-1 * Math.PI) / 2,
        Math.PI / 2,
    ];

    return (
        <>
            <mesh position={[-(height / 2 - 0.25), 0, 0]}>
                {/* Left Boundary Material */}
                <boxGeometry args={[thickness, height - 1, 0.1]} />

                {/* Material Properties */}
                <meshPhysicalMaterial {...material_properties} />
            </mesh>

            <mesh position={[height / 2 - 0.25, 0, 0]}>
                {/* Right Boundary Material */}
                <boxGeometry args={[thickness, height - 1, 0.1]} />

                {/* Material Properties */}
                <meshPhysicalMaterial {...material_properties} />
            </mesh>

            <mesh
                rotation={[0, 0, Math.PI / 2]}
                position={[0, width / 2 - 0.25, 0]}
            >
                {/* Top Boundary Material */}
                <boxGeometry args={[thickness, width - 1, 0.1]} />

                {/* Material Properties */}
                <meshPhysicalMaterial {...material_properties} />
            </mesh>

            <mesh
                rotation={[0, 0, Math.PI / 2]}
                position={[0, -(width / 2 - 0.25), 0]}
            >
                {/* Bottom Boundary Material */}
                <boxGeometry args={[thickness, width - 1, 0.1]} />

                {/* Material Properties */}
                <meshPhysicalMaterial {...material_properties} />
            </mesh>

            {/* Rounded Corners */}

            <mesh
                rotation={[Math.PI / 2, 0, 0]}
                position={[height / 2 - 0.5, height / 2 - 0.5, 0]}
            >
                <cylinderGeometry args={cylinder_properties_1} />

                <meshPhysicalMaterial {...material_properties} />
            </mesh>

            <mesh
                rotation={[Math.PI / 2, 0, 0]}
                position={[-(height / 2 - 0.5), height / 2 - 0.5, 0]}
            >
                <cylinderGeometry args={cylinder_properties_2} />

                <meshPhysicalMaterial {...material_properties} />
            </mesh>

            <mesh
                rotation={[Math.PI / 2, 0, 0]}
                position={[height / 2 - 0.5, -(height / 2 - 0.5), 0]}
            >
                <cylinderGeometry args={cylinder_properties_3} />

                <meshPhysicalMaterial {...material_properties} />
            </mesh>

            <mesh
                rotation={[Math.PI / 2, 0, 0]}
                position={[-(height / 2 - 0.5), -(height / 2 - 0.5), 0]}
            >
                <cylinderGeometry args={cylinder_properties_4} />

                <meshPhysicalMaterial {...material_properties} />
            </mesh>
        </>
    );
};

export default Boundary;
