import * as THREE from "three";
import { useEffect, useRef, useState, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { useTimer } from "use-timer";
import {
    Bloom,
    DepthOfField,
    EffectComposer,
    Noise,
    Vignette,
} from "@react-three/postprocessing";

const ENTIRE_SCENE = 0,
    BLOOM_SCENE = 1;

const bloomLayer = new THREE.Layers();
bloomLayer.set(BLOOM_SCENE);

const materials = {};
const darkMaterial = new THREE.MeshBasicMaterial({ color: "black" });

const vert = `
    varying vec3 vNormal;
    varying vec3 camPos;
    varying vec2 vUv;

    void main() {
    vNormal = normal;
    vUv = uv;
    camPos = cameraPosition;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
`;

const frag = `
#define NUM_OCTAVES 5
#define M_PI 3.1415926535897932384626433832795
uniform vec4 resolution;
varying vec3 vNormal;
uniform sampler2D perlinnoise;
uniform sampler2D sparknoise;
uniform float time;
uniform vec3 color0;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 color4;
uniform vec3 color5;
varying vec3 camPos;
varying vec2 vUv;

float setOpacity(float r, float g, float b, float tonethreshold) {
  float tone = (r + g + b) / 3.0;
  float alpha = 1.0;
  if(tone<tonethreshold) {
    alpha = 0.0;
  }
  return alpha;
}

vec3 rgbcol(vec3 col) {
  return vec3(col.r/255.0,col.g/255.0,col.b/255.0);
}

vec2 rotate(vec2 v, float a) {
  float s = sin(a);
  float c = cos(a);
  mat2 m = mat2(c, -s, s, c);
  return m * v;
}

vec2 UnityPolarCoordinates (vec2 UV, vec2 Center, float RadialScale, float LengthScale){
  //https://twitter.com/Cyanilux/status/1123950519133908995/photo/1
  vec2 delta = UV - Center;
  float radius = length(delta) * 2. * RadialScale;
  float angle = atan(delta.x, delta.y) * 1.0/6.28 * LengthScale;
  return vec2(radius, angle);
}

void main() {
  vec2 olduv = gl_FragCoord.xy/resolution.xy ;
  vec2 uv = vUv ; 
  vec2 imguv = uv;
  float scale = 1.;
  olduv *= 0.5 + time; 
  olduv.y = olduv.y ;
  vec2 p = olduv*scale;
  vec4 txt = texture2D(perlinnoise, olduv);
  float gradient = dot(normalize( -camPos ), normalize( vNormal ));
  float pct = distance(vUv,vec2(0.5));

  vec3 rgbcolor0 = rgbcol(color0);
  vec3 rgbcolor1 = rgbcol(color1);
  vec3 rgbcolor2 = rgbcol(color2);
  vec3 rgbcolor5 = rgbcol(color5);

  // set solid background
  float y = smoothstep(0.16,0.525,pct);
  vec3 backcolor = mix(rgbcolor0, rgbcolor5, y);

  gl_FragColor = vec4(backcolor,1.);

  // set polar coords
  vec2 center = vec2(0.5);
  vec2 cor = UnityPolarCoordinates(vec2(vUv.x,vUv.y), center, 1., 1.);

  // set textures
  vec2 newUv = vec2(cor.x + time,cor.x*0.2+cor.y);
  vec3 noisetex = texture2D(perlinnoise,mod(newUv,1.)).rgb;    
  vec3 noisetex2 = texture2D(sparknoise,mod(newUv,1.)).rgb;    


  // set textures tones
  float tone0 =  1. - smoothstep(0.3,0.6,noisetex.r);
  float tone1 =  smoothstep(0.3,0.6,noisetex2.r);


  // set opacity for each tone
  float opacity0 = setOpacity(tone0,tone0,tone0,.29);
  float opacity1 = setOpacity(tone1,tone1,tone1,.49);

  //set final render
  if(opacity1>0.0){
    gl_FragColor = vec4(rgbcolor2,0.)*vec4(opacity1);
  } else if(opacity0>0.0){
    gl_FragColor = vec4(rgbcolor1,0.)*vec4(opacity0);
  }   
}
`;

const vertcylinder = `
    varying vec2 vUv;

    void main() {
        vUv = uv;
        vec3 pos = vec3(position.x/1.,position.y,position.z/1.);
        if(pos.y >= 1.87){
            pos = vec3(position.x*(sin((position.y - 0.6)*1.27)-0.16),position.y,position.z*(sin((position.y - 0.6)*1.27)-0.16));
        } else{
            pos = vec3(position.x*(sin((position.y/2. -  .01)*.11)+0.75),position.y,position.z*(sin((position.y/2. -  .01)*.11)+0.75));
        }
        gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
    }
`;

const fragcylinder = `
    varying vec2 vUv;
    uniform sampler2D perlinnoise;
    uniform vec3 color4;
    uniform float time;
    varying vec3 vNormal;

    vec3 rgbcol(vec3 col) {
        return vec3(col.r/255.0,col.g/255.0,col.b/255.0);
    }

    void main() {
        vec3 noisetex = texture2D(perlinnoise,mod(1.*vec2(vUv.y-time*2.,vUv.x + time*1.),1.)).rgb;    
        gl_FragColor = vec4(noisetex.r);

        if(gl_FragColor.r >= 0.5){
            gl_FragColor = vec4(rgbcol(color4),gl_FragColor.r);
        }else{
            gl_FragColor = vec4(0.);
        }
        gl_FragColor *= vec4(sin(vUv.y) - 0.1);
        gl_FragColor *= vec4(smoothstep(0.3,0.628,vUv.y));

    }

`;

const vertflame = `
    varying vec2 vUv;
    varying vec3 camPos;
    varying vec3 vNormal;
    varying vec3 nois;
    uniform sampler2D noise;
    uniform float time;

    void main() {
        vUv = uv;
        camPos = cameraPosition;
        vNormal = normal;
        vec3 pos = vec3(position.x/1.,position.y,position.z/1.);
        vec3 noisetex = texture2D(noise,mod(1.*vec2(vUv.y-time*2.,vUv.x + time*1.),1.)).rgb;
        if(pos.y >= 1.87){
            pos = vec3(position.x*(sin((position.y - 0.64)*1.27)-0.12),position.y,position.z*(sin((position.y - 0.64)*1.27)-0.12));
        } else{
            pos = vec3(position.x*(sin((position.y/2. -  .01)*.11)+0.79),position.y,position.z*(sin((position.y/2. -  .01)*.11)+0.79));
        }
        pos.xz *= noisetex.r;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
    }
`;

const fragflame = `
    varying vec2 vUv;
    uniform sampler2D perlinnoise;
    uniform sampler2D noise;
    uniform vec3 color4;
    uniform float time;
    varying vec3 camPos;
    varying vec3 vNormal;
    varying vec3 nois;

    vec3 rgbcol(vec3 col) {
        return vec3(col.r/255.0,col.g/255.0,col.b/255.0);
    }

      
    void main() {
        // vec3 noisetex = texture2D(perlinnoise,mod(1.*vec2(vUv.y-time*2.,vUv.x + time*1.),1.)).rgb;    
        // gl_FragColor += vec4(sin((vUv.y - time)*(20. + vUv.y)));
        vec3 noisetex = texture2D(noise,mod(1.*vec2(vUv.y-time*2.,vUv.x + time*1.),1.)).rgb;
        // nois = noisetex;
        gl_FragColor = vec4(noisetex.r);

        if(gl_FragColor.r >= 0.44){
            gl_FragColor = vec4(rgbcol(color4),gl_FragColor.r);
        }
        // else if(gl_FragColor.r >= 0.9){
        //     // gl_FragColor = vec4(rgbcol(color4),gl_FragColor.r)*0.5;
        // }
        else{
            gl_FragColor = vec4(0.);
        }
        gl_FragColor *= vec4(smoothstep(0.2,0.628,vUv.y));
        // gl_FragColor = vec4(vUv.y - 0.3 );
        // gl_FragColor = 1. - vec4(dot(normalize(vNormal),normalize(camPos)).r);
    }

`;

let options = {
    exposure: 2.8,
    bloomStrength: 3.5,
    bloomRadius: 0.39,
    color0: [0, 0, 0],
    color1: [81, 14, 5],
    color2: [181, 156, 24],
    color3: [66, 66, 66],
    color4: [79, 79, 79],
    color5: [64, 27, 0],
};

// let options = {
//   exposure: 2.8,
//   bloomStrength: 3.5,
//   //   bloomStrength: 0,
//   bloomRadius: 0.39,
//   color0: [15, 0, 10],
//   color1: [13, 6, 5],
//   color2: [137, 56, 10],
//   color3: [166, 166, 166],
//   color4: [237, 149, 67],
//   color5: [20, 0, 51],
// };

const width = window.innerWidth,
    height = window.innerHeight;

const FireBall = ({ ballRef }: any) => {
    const [material, set_material] = useState<any>({});

    const [material2, set_material2] = useState<any>({});

    const [material3, set_material3] = useState<any>({});

    const materialr1 = useRef<any>();
    const materialr2 = useRef<any>();
    const materialr3 = useRef<any>();

    useEffect(() => {
        setMaterials();
        animatBloom(0);
    }, []);

    function updateDraw(deltaTime = 100) {
        if (!material?.uniforms) return;

        material.uniforms.time.value = -deltaTime / (1000 * 2);
        material2.uniforms.time.value = -deltaTime / (3000 * 2);
        material3.uniforms.time.value = -deltaTime / (3000 * 2);
        material.uniforms.color5.value = new THREE.Vector3(...options.color5);
        material2.uniforms.color4.value = new THREE.Vector3(...options.color4);
        material3.uniforms.color4.value = new THREE.Vector3(...options.color5);
        material.uniforms.color3.value = new THREE.Vector3(...options.color3);
        material.uniforms.color2.value = new THREE.Vector3(...options.color2);
        material.uniforms.color1.value = new THREE.Vector3(...options.color1);
        material.uniforms.color0.value = new THREE.Vector3(...options.color0);
    }

    function animatBloom(deltaTime = 100) {
        requestAnimationFrame(animatBloom);

        updateDraw(deltaTime);

        // console.log(materialr1?.current?.uniforms);

        // if (materialr1?.current) {
        //     console.log(materialr1.current.uniforms.time);

        //     materialr1.current.uniforms = material.uniforms;
        // }
    }

    const setMaterials = () => {
        material.uniforms = {
            time: {
                type: "f",
                value: 0.0,
            },
            perlinnoise: {
                type: "t",
                value: new THREE.TextureLoader().load(
                    "https://raw.githubusercontent.com/pizza3/asset/master/noise9.jpg"
                ),
            },
            sparknoise: {
                type: "t",
                value: new THREE.TextureLoader().load(
                    "https://raw.githubusercontent.com/pizza3/asset/master/sparklenoise.jpg"
                ),
            },
            color5: {
                value: new THREE.Vector3(...options.color5),
            },
            color4: {
                value: new THREE.Vector3(...options.color4),
            },
            color3: {
                value: new THREE.Vector3(...options.color3),
            },
            color2: {
                value: new THREE.Vector3(...options.color2),
            },
            color1: {
                value: new THREE.Vector3(...options.color1),
            },
            color0: {
                value: new THREE.Vector3(...options.color0),
            },
            resolution: { value: new THREE.Vector2(width, height) },
        };

        material2.uniforms = {
            perlinnoise: {
                type: "t",
                value: new THREE.TextureLoader().load(
                    "https://raw.githubusercontent.com/pizza3/asset/master/water-min.jpg"
                ),
            },
            color4: {
                value: new THREE.Vector3(...options.color4),
            },
            time: {
                type: "f",
                value: 0.0,
            },
            noise: {
                type: "t",
                value: new THREE.TextureLoader().load(
                    "https://raw.githubusercontent.com/pizza3/asset/master/noise9.jpg"
                ),
            },
        };

        material3.uniforms = {
            perlinnoise: {
                type: "t",
                value: new THREE.TextureLoader().load(
                    "https://raw.githubusercontent.com/pizza3/asset/master/water-min.jpg"
                ),
            },
            color4: {
                value: new THREE.Vector3(...options.color5),
            },
            time: {
                type: "f",
                value: 0.0,
            },
            noise: {
                type: "t",
                value: new THREE.TextureLoader().load(
                    "https://raw.githubusercontent.com/pizza3/asset/master/noise9.jpg"
                ),
            },
        };

        set_material({ ...material });

        set_material2({ ...material2 });

        set_material3({ ...material3 });
    };

    if (!material.uniforms) return <></>;

    return (
        <>
            <mesh
                rotation={[0, Math.PI / 2, 0]}
                scale={[0.08, 0.08, 0.08]}
                position={[0, 0, 0.1]}
                ref={ballRef}
            >
                <mesh scale={[0.78, 0.78, 0.78]} position={[1, 0, 0]}>
                    <sphereGeometry args={[1, 30, 30]} />

                    <shaderMaterial
                        ref={materialr1}
                        uniforms={material.uniforms}
                        vertexShader={vert}
                        fragmentShader={frag}
                    />
                </mesh>

                <mesh
                    position={[1.5, 1.7, 1.5]}
                    rotation={[0, 0, -Math.PI / 2]}
                    scale={[1 + -4.05, 0, 0]}
                >
                    <cylinderGeometry args={[1.11, 0, 5.3, 50, 50, true]} />

                    <shaderMaterial
                        ref={materialr2}
                        uniforms={material2.uniforms}
                        // wireframe:true,
                        vertexShader={vertcylinder}
                        fragmentShader={fragcylinder}
                        transparent={true}
                        depthWrite={false}
                        side={THREE.DoubleSide}
                    />
                </mesh>

                <mesh
                    position={[1 + -4.78, 0, 0]}
                    scale={[2, 2, 2]}
                    rotation={[0, 0, -Math.PI / 2]}
                >
                    <cylinderGeometry args={[1, 0, 5.3, 50, 50, true]} />

                    <shaderMaterial
                        ref={materialr3}
                        uniforms={material3.uniforms}
                        // wireframe:true,
                        vertexShader={vertflame}
                        fragmentShader={fragflame}
                        transparent={true}
                        depthWrite={false}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            </mesh>

            {/* <Suspense fallback={null}>
                <EffectComposer>
                    <Bloom radius={0.1} intensity={1000} />
                </EffectComposer>
            </Suspense> */}
        </>
    );
};

export default FireBall;
