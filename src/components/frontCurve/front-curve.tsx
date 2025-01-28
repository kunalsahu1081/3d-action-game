import * as THREE from "three";

export const FrontCurve = () => {
    const cShape = new THREE.Shape();

    (function f(ctx) {
        ctx.moveTo(0, 0.65);

        ctx.bezierCurveTo(0.2, 0.55, 0.2, 0.55, 0, 0.35);

        // ctx.moveTo(0.1, 0.35);

        // ctx.bezierCurveTo(0.2, 0.5, 0.2, 0.55, 0.1, 0.65);

        // ctx.moveTo(0, 0.65);
    })(cShape);

    const settings: any = {};
    settings.depth = 0.6;
    settings.bevelEnabled = false;

    return (
        <>
            <extrudeGeometry args={[cShape, settings]} />
        </>
    );
};

export const SideCurve = () => {
    const cShape = new THREE.Shape();

    (function f(ctx) {
        ctx.moveTo(0.05, 0.65);

        ctx.bezierCurveTo(0.25, 0.55, 0.25, 0.55, 0.05, 0.35);

        ctx.moveTo(-0.45, 0.35);

        ctx.bezierCurveTo(-0.65, 0.55, -0.65, 0.55, -0.45, 0.65);

        ctx.moveTo(0.05, 0.65);
    })(cShape);

    const holePath = new THREE.Path();

    (function f(ctx) {
        ctx.moveTo(-0.01, 0.59);

        ctx.bezierCurveTo(0.16, 0.55, 0.16, 0.55, -0.01, 0.41);

        ctx.moveTo(-0.38, 0.41);

        ctx.bezierCurveTo(-0.51, 0.55, -0.51, 0.55, -0.38, 0.59);

        ctx.moveTo(-0.01, 0.59);
    })(holePath);

    cShape.holes.push(holePath);

    const settings: any = {};
    settings.depth = 0.1;
    settings.bevelEnabled = false;

    return (
        <>
            <extrudeGeometry args={[cShape, settings]} />
        </>
    );
};

export default FrontCurve;
