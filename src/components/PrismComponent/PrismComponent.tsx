import * as THREE from "three";

interface IPrismComponent {
    vertices: any[];
    height: number;
}

const PrismComponent = ({ vertices, height }: IPrismComponent) => {
    const Shape = new THREE.Shape();

    (function f(ctx) {
        ctx.moveTo(vertices[0].x, vertices[0].y);
        for (var i = 1; i < vertices.length; i++) {
            ctx.lineTo(vertices[i].x, vertices[i].y);
        }
        ctx.lineTo(vertices[0].x, vertices[0].y);
    })(Shape);

    const settings: any = {};
    settings.depth = height;
    settings.bevelEnabled = false;

    return (
        <>
            <extrudeGeometry args={[Shape, settings]} />
        </>
    );
};

export default PrismComponent;
