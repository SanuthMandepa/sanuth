/**
 * GLSL for the three hero portrait treatments.
 *
 * me.png is a cutout: the subject is opaque and everything around it has
 * alpha 0 (with rgb 0,0,0). Every mode therefore has to gate on tex.a. Reading
 * luminance alone paints the transparent surround as the darkest tone on the
 * ramp, which shows up as a black halo round the subject.
 */

/* Maps image brightness onto the orange ramp: dark tones stay deep brown,
   midtones burn orange, highlights go amber. */
const RAMP = /* glsl */ `
vec3 ramp(float b, vec3 dark, vec3 mid, vec3 light) {
  vec3 c = mix(dark, mid, smoothstep(0.05, 0.5, b));
  return mix(c, light, smoothstep(0.5, 0.92, b));
}
`;

/* The cutout is a bust: it ends in a straight line across the chest. Fading
   the bottom stops that hard horizontal cut from reading as a mistake, and
   doubles as a safety net for the distortion modes, which can pull pixels
   slightly past the cutout edge. */
const EDGE = /* glsl */ `
float edgeFade(vec2 uv) {
  vec2 d = min(uv, 1.0 - uv);
  float sides = smoothstep(0.0, 0.03, min(d.x, d.y));
  float bottom = smoothstep(0.0, 0.22, uv.y);
  return sides * bottom;
}
`;

/* ---------------------------------------------------------------- particles */

export const particlesVertex = /* glsl */ `
uniform sampler2D uTexture;
uniform float uTime;
uniform vec2  uMouse;
uniform float uSize;
uniform float uPixelRatio;
uniform float uIntro;

varying float vBright;
varying float vAlpha;
varying vec3  vColor;

${EDGE}

void main() {
  vec3 pos = position;
  vec4 tex = texture2D(uTexture, uv);
  float bright = dot(tex.rgb, vec3(0.299, 0.587, 0.114));

  // Depth from luminance, so the portrait reads as relief, not a flat sheet.
  pos.z += bright * 0.32;

  // Idle breathing.
  pos.z += sin(uTime * 0.7 + pos.x * 2.2 + pos.y * 1.4) * 0.035;

  // Cursor pushes points away and lifts them toward the camera.
  vec2 away = pos.xy - uMouse;
  float d = length(away);
  float force = smoothstep(0.85, 0.0, d);
  vec2 dir = d > 0.0001 ? away / d : vec2(0.0, 1.0);
  pos.xy += dir * force * 0.5;
  pos.z  += force * 0.75;

  // Entry: points fly in from scattered depth.
  float scatter = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
  pos.z += (1.0 - uIntro) * (scatter - 0.5) * 6.0;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uPixelRatio * (0.42 + bright) * (3.0 / -mv.z);

  vBright = bright;
  vColor = tex.rgb;
  // The cutout's alpha is what isolates the subject.
  vAlpha = tex.a * edgeFade(uv) * uIntro;
}
`;

export const particlesFragment = /* glsl */ `
uniform vec3 uDark;
uniform vec3 uMid;
uniform vec3 uLight;

uniform float uTint;

varying float vBright;
varying float vAlpha;
varying vec3  vColor;

${RAMP}

void main() {
  if (vAlpha < 0.02) discard;

  // Round the square point sprite off and soften its edge.
  vec2 c = gl_PointCoord - 0.5;
  float d2 = dot(c, c);
  if (d2 > 0.25) discard;
  float edge = smoothstep(0.25, 0.04, d2);

  // Blend the ramp back toward the real photo so the face stays recognisable
  // rather than reading as a flat orange silhouette.
  vec3 col = mix(vColor, ramp(vBright, uDark, uMid, uLight), uTint);
  gl_FragColor = vec4(col, vAlpha * edge);
}
`;

/* ------------------------------------------------------------------ liquid */

export const planeVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const liquidFragment = /* glsl */ `
uniform sampler2D uTexture;
uniform float uTime;
uniform vec2  uMouse;
uniform float uHover;
uniform float uIntro;
uniform vec3  uDark;
uniform vec3  uMid;
uniform vec3  uLight;

varying vec2 vUv;

${RAMP}
${EDGE}

void main() {
  vec2 uv = vUv;
  float t = uTime * 0.35;

  // Continuous flow, so the surface is never completely still.
  uv.x += sin(uv.y * 9.0 + t) * 0.010 + sin(uv.x * 6.0 - t * 1.3) * 0.006;
  uv.y += cos(uv.x * 8.0 + t * 0.9) * 0.008;

  // Pointer ripple, decaying with distance.
  vec2 toM = uv - uMouse;
  float d = length(toM);
  float ripple = sin(d * 34.0 - uTime * 4.5) * exp(-d * 6.5) * 0.05 * uHover;
  uv += (d > 0.0001 ? toM / d : vec2(0.0)) * ripple;

  // Channel split widens with the ripple for a bit of energy. Alpha comes from
  // the untinted centre sample so the cutout edge never fringes.
  float split = 0.004 + 0.008 * uHover;
  vec4 mid = texture2D(uTexture, uv);
  float r = texture2D(uTexture, uv + vec2(split, 0.0)).r;
  float b = texture2D(uTexture, uv - vec2(split, 0.0)).b;
  vec3 col = vec3(r, mid.g, b);

  float bright = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(col, ramp(bright, uDark, uMid, uLight), 0.62);

  gl_FragColor = vec4(col, mid.a * edgeFade(uv) * uIntro);
}
`;

/* ---------------------------------------------------------------- halftone */

export const halftoneFragment = /* glsl */ `
uniform sampler2D uTexture;
uniform float uTime;
uniform vec2  uMouse;
uniform float uGrid;
uniform float uIntro;
uniform vec3  uDark;
uniform vec3  uMid;
uniform vec3  uLight;

varying vec2 vUv;

${RAMP}
${EDGE}

void main() {
  // Sample once per cell so every dot carries a single flat tone.
  vec2 cell = (floor(vUv * uGrid) + 0.5) / uGrid;
  vec4 tex = texture2D(uTexture, cell);
  if (tex.a < 0.15) discard;

  float bright = dot(tex.rgb, vec3(0.299, 0.587, 0.114));

  // Dark tones make big dots, light tones make small ones, and the floor keeps
  // even the brightest highlight visible rather than dropping out.
  float radius = 0.16 + (1.0 - bright) * 0.36;

  radius += smoothstep(0.3, 0.0, distance(cell, uMouse)) * 0.2;
  radius += sin(uTime * 1.8 + cell.x * 22.0 + cell.y * 15.0) * 0.022;

  float dist = length(fract(vUv * uGrid) - 0.5);
  float alpha = smoothstep(radius, radius - 0.12, dist);

  gl_FragColor = vec4(ramp(bright, uDark, uMid, uLight),
                      alpha * tex.a * edgeFade(vUv) * uIntro);
}
`;
