<script setup lang="ts">
const VERTEX_SHADER = `
attribute vec2 position;
varying vec2 vUv;
void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision mediump float;

uniform float uTime;
uniform float uScrollVelocity;
uniform vec2 uResolution;

varying vec2 vUv;

// Random Noise Generator
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
    vec2 uv = vUv;
    
    // 1. Scroll Distortion (Stretch UVs based on velocity)
    float distortionStrength = clamp(abs(uScrollVelocity) * 0.002, 0.0, 0.1);
    uv.y += sin(uv.x * 10.0 + uTime) * distortionStrength;

    // 2. Scanlines (Industrial Monitor Effect)
    float scanline = sin(uv.y * 800.0 - uTime * 2.0) * 0.04;
    
    // 3. Chromatic Aberration (RGB Split on Grain)
    float rOffset = 0.002 + distortionStrength * 0.02;
    float bOffset = -0.002 - distortionStrength * 0.02;
    
    float noiseR = random(uv + vec2(rOffset, rOffset) + uTime * 1.5);
    float noiseG = random(uv + uTime * 1.5);
    float noiseB = random(uv + vec2(bOffset, bOffset) + uTime * 1.5);
    
    vec3 color = vec3(noiseR, noiseG, noiseB);

    // 4. Vignette (Darken corners)
    float dist = distance(vUv, vec2(0.5));
    float vignette = smoothstep(0.8, 0.2, dist * (1.0 + distortionStrength * 2.0));

    // Combine: 
    // We output a dark color with varying alpha to overlay on the site
    // The grain will be mostly gray/black, reducing brightness of the Electric Yellow background
    float alpha = (0.12 + scanline) * vignette; // Base alpha + scanlines * vignette
    
    // Boost alpha during high scroll to simulate "signal stress"
    alpha += distortionStrength * 0.5;

    gl_FragColor = vec4(color * 0.2, alpha); 
}
`;

const canvasRef = shallowRef<HTMLCanvasElement | null>(null);
let scrollRef = 0;
let lastScrollRef = 0;
let animationFrameId: number;
let program: WebGLProgram | null = null;
let gl: WebGLRenderingContext | null = null;

const createShader = (type: number, source: string) => {
  if (!gl) return null;
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
};

onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  gl = canvas.getContext("webgl");
  if (!gl) return;

  const vertexShader = createShader(gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragmentShader = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);

  if (!vertexShader || !fragmentShader) return;

  program = gl.createProgram();
  if (!program) return;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.useProgram(program);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const positions = new Float32Array([
    -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
  ]);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  const positionLocation = gl.getAttribLocation(program, "position");
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  const uTimeLocation = gl.getUniformLocation(program, "uTime");
  const uScrollVelocityLocation = gl.getUniformLocation(
    program,
    "uScrollVelocity",
  );
  const uResolutionLocation = gl.getUniformLocation(program, "uResolution");

  const startTime = performance.now();

  const resize = () => {
    if (!canvas || !gl) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uResolutionLocation, canvas.width, canvas.height);
  };
  window.addEventListener("resize", resize);
  resize();

  const render = () => {
    if (!gl) return;
    const currentTime = (performance.now() - startTime) / 1000;

    const currentScroll = window.scrollY;
    const velocity = currentScroll - lastScrollRef;
    lastScrollRef = currentScroll;

    scrollRef += (velocity - scrollRef) * 0.1;

    gl.uniform1f(uTimeLocation, currentTime);
    gl.uniform1f(uScrollVelocityLocation, scrollRef);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
    animationFrameId = requestAnimationFrame(render);
  };

  render();
});

onUnmounted(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("resize", () => {});
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    if (gl && program) gl.deleteProgram(program);
  }
});
</script>

<template>
  <canvas
    ref="canvasRef"
    class="fixed inset-0 z-50 pointer-events-none mix-blend-multiply opacity-60 w-full h-full"
  />
</template>
