/**
 * GLSL for the halftone hero portrait.
 *
 * The portrait is a cutout: the subject is opaque and everything around it has
 * alpha 0 (with rgb 0,0,0). The shader has to gate on tex.a, because reading
 * luminance alone paints the transparent surround as the darkest tone on the
 * ramp, which shows up as a black halo round the subject.
 */

export const planeVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const halftoneFragment = /* glsl */ `
uniform sampler2D uTexture;
uniform float uTime;
uniform vec2  uMouse;
uniform float uGrid;      // cells down the height of the plane
uniform float uAspect;    // plane width / height, keeps cells square
uniform vec2  uTexSize;   // source pixels, for the unsharp tap spacing
uniform float uIntro;
uniform vec3  uDark;
uniform vec3  uMid;
uniform vec3  uLight;

varying vec2 vUv;

/* Deep brown through burnt orange to amber. Deliberately gentle: in a halftone
   the dot SIZE is what carries the image, so a violently saturated colour ramp
   on top just fights it and turns skin into a vibrating red blur. */
vec3 ramp(float b) {
  vec3 c = mix(uDark, uMid, smoothstep(0.02, 0.62, b));
  return mix(c, uLight, smoothstep(0.66, 0.98, b));
}

/* Luminance of a single texture sample. */
float lumAt(sampler2D tex, vec2 uv) {
  return dot(texture2D(tex, uv).rgb, vec3(0.299, 0.587, 0.114));
}

/* The cutout is a bust, ending in a straight line across the chest. Fading the
   bottom stops that hard horizontal cut from reading as a mistake. */
float edgeFade(vec2 uv) {
  vec2 d = min(uv, 1.0 - uv);
  return smoothstep(0.0, 0.02, min(d.x, d.y)) * smoothstep(0.0, 0.2, uv.y);
}

void main() {
  // Cells are square in world space: scaling x by the plane aspect stops the
  // dots turning into ovals on a non-square plane.
  vec2 grid = vec2(uGrid * uAspect, uGrid);
  vec2 cellId = floor(vUv * grid);
  vec2 cellUv = (cellId + 0.5) / grid;

  vec4 tex = texture2D(uTexture, cellUv);
  if (tex.a < 0.12) discard;

  float lum = dot(tex.rgb, vec3(0.299, 0.587, 0.114));

  // Unsharp mask. Skin sits in a narrow band of luminance, so without local
  // contrast the eyes, nose and mouth all resolve to nearly the same dot size
  // and the face reads as a blur. Subtracting a small blur puts the edges back.
  vec2 texel = 2.0 / uTexSize;
  float blur = 0.25 * (
      lumAt(uTexture, cellUv + vec2(texel.x, 0.0))
    + lumAt(uTexture, cellUv - vec2(texel.x, 0.0))
    + lumAt(uTexture, cellUv + vec2(0.0, texel.y))
    + lumAt(uTexture, cellUv - vec2(0.0, texel.y)));
  lum += (lum - blur) * 1.1;

  // Then an S-curve across the range the subject actually occupies, so the
  // midtones spread out instead of bunching.
  lum = clamp((lum - 0.05) / 0.82, 0.0, 1.0);
  lum = smoothstep(0.04, 0.96, lum);

  // Dark tones make big dots. No floor on the radius, so highlights open right
  // up and the modelling of the face survives.
  float radius = (1.0 - lum) * 0.52;
  radius += smoothstep(0.24, 0.0, distance(cellUv, uMouse)) * 0.18;
  radius += sin(uTime * 1.5 + cellId.x * 0.8 + cellId.y * 0.6) * 0.016;

  float dist = length(fract(vUv * grid) - 0.5);

  // Screen-space derivative keeps the dot edge exactly one pixel wide however
  // dense the grid gets, so it stays crisp instead of blurring.
  float aa = fwidth(dist) * 0.9;
  float alpha = smoothstep(radius + aa, max(radius - aa, 0.0), dist);

  gl_FragColor = vec4(ramp(lum), alpha * tex.a * edgeFade(vUv) * uIntro);
}
`;
