import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform vec2 u_resolution;
  varying vec2 vUv;

  // Simplex noise function (simplified)
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 st = gl_FragCoord.xy / u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;

    // Base warp
    float noise = snoise(st * 3.0 + u_time * 0.2);
    
    // Mouse warp
    float dist = distance(st, u_mouse);
    float mouseEffect = smoothstep(0.5, 0.0, dist);
    
    vec2 warpedSt = st + noise * 0.1 + mouseEffect * 0.2 * normalize(st - u_mouse);
    
    // Create metallic waves
    float wave = snoise(warpedSt * 5.0 - u_time * 0.1);
    float wave2 = snoise(warpedSt * 10.0 + u_time * 0.3);
    
    float f = smoothstep(0.0, 0.8, wave * 0.5 + wave2 * 0.5);
    
    // Mix dark colors (red/orange accent with pitch black)
    vec3 color1 = vec3(0.02, 0.02, 0.02); // Pitch black
    vec3 color2 = vec3(0.6, 0.1, 0.0); // Deep red/orange
    vec3 color3 = vec3(1.0, 0.3, 0.0); // Bright orange accent
    
    vec3 finalColor = mix(color1, color2, f);
    finalColor = mix(finalColor, color3, smoothstep(0.7, 1.0, f) * mouseEffect);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

function LiquidMetal() {
  const meshRef = useRef();
  const uniforms = useMemo(() => ({
    u_time: { value: 0 },
    u_mouse: { value: new THREE.Vector2(0, 0) },
    u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      uniforms.u_time.value = state.clock.getElapsedTime();
      // Smooth mouse tracking
      uniforms.u_mouse.value.lerp(new THREE.Vector2(
        (state.pointer.x + 1) / 2 * (window.innerWidth / window.innerHeight),
        (state.pointer.y + 1) / 2
      ), 0.05);
    }
  });

  useEffect(() => {
    const handleResize = () => {
      uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [uniforms]);

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}

const VfxBackground = () => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 0, 1] }} style={{ width: '100%', height: '100%' }}>
        <LiquidMetal />
      </Canvas>
    </div>
  );
};

export default VfxBackground;
