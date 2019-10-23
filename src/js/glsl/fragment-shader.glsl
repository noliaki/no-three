varying vec2 vUv;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform sampler2D uTextureMap;
uniform float uTime;

const float maxDelay = 0.1;
const float maxDuration = 1.0 - maxDelay;

void main() {
  float delay = (distance(vUv.x, 0.5) / 0.5 + distance(vUv.y, 0.5) / 0.5) / 2.0;
  float progressTime = (sin(uTime / 30.0) + 1.0) / 2.0;
  float progress = clamp(progressTime - delay * maxDelay, 0.0, maxDuration) / maxDuration;
  float peek = abs(step(0.5, progress) - progress) / 0.5 + 1.0;

  float noise = (snoise(vec3(vUv.x, vUv.y, uTime / 100.0)) + 1.0) / 2.0;
  // vec4 mapColor = texture2D(uTextureMap, vUv + (noise / (2.0 * peek + 1.0)));
  vec4 mapColor = texture2D(uTextureMap, vUv * (noise * peek));
  float colorAvg = (((mapColor.r + mapColor.g + mapColor.b) / 3.0) * 2.0) - 1.0;
  vec4 beforeColor = texture2D(uTexture1, vUv + progressTime * colorAvg * delay * 5.0);
  vec4 afterColor = texture2D(uTexture2, vUv + (1.0 - progressTime) * colorAvg * delay * 5.0);

  gl_FragColor = mix(beforeColor, afterColor, progressTime);
  // gl_FragColor = vec4(vec3((noise + 1.0) / 2.0), 1.0);
}
