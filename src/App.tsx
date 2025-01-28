import { Canvas } from "@react-three/fiber";
import { GUI } from "lil-gui";
import "./App.css";
import { useEffect, useRef, useState } from "react";
import Boundary from "./components/BoundaryComponent/Boundary";
import CameraController from "./components/cameraController";
import CharacterComponent from "./components/CharacterComponent/character-component";

function App() {
    const ref = useRef<any>();

    const [row_count] = useState(21);
    const [col_count] = useState(21);

    useEffect(() => {
        const gui = new GUI();

        if (ref?.current) {
            ref.current.rotation.y = Math.PI / 2;

            gui.add(ref.current.rotation, "x", 0, Math.PI * 2);
            gui.add(ref.current.rotation, "y", 0, Math.PI * 2);
            gui.add(ref.current.rotation, "z", 0, Math.PI * 2);
        }

        return () => {
            gui.destroy();
        };
    }, [ref.current]);

    return (
        <>
            <div id="canvas-container" className="canvasContainer">
                <Canvas className="canvasElement">
                    <CameraController />

                    <mesh ref={ref}>
                        {/* <planeGeometry
                            args={[row_count, col_count, row_count, col_count]}
                        /> */}

                        {/* <boxGeometry args={[1, 1, 1]} /> */}

                        {/* <meshStandardMaterial /> */}

                        <directionalLight position={[20, 0, 20]} />

                        <ambientLight position={[20, 20, 0]} />

                        {/* <tubeGeometry /> */}

                        <Boundary
                            height={row_count}
                            width={col_count}
                            thickness={0.5}
                        />

                        <CharacterComponent />
                    </mesh>
                </Canvas>
            </div>
        </>
    );
}

export default App;
