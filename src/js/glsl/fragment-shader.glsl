varying vec4 vColor;
varying vec2 vUv;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform sampler2D filterTexture;
uniform float uTime;

const float maxDelay = 0.5;
const float duration = 0.5;

void main(){
  float time = (sin(uTime / 50.0) + 1.0) / 2.0;

  float uvVol = (vUv.x + vUv.y) / 2.0;
  float delay = (snoise(vec3(vUv, uTime / 100.0)) + 1.0) / 2.0;
  float progress = clamp(time - delay * maxDelay, 0.0, duration) / duration;
  // float progress = clamp(time - delay * maxDelay, 0.0, duration) / duration;

  float filterEffect = snoise(vec3(vUv, uTime / 80.0)) * (1.0 - pow(abs(time * 2.0 - 1.0), 2.0));
  // float filterEffect = 2.0 * (progress >= 0.5 ? 1.0 - progress : progress);
  vec4 filterColor = texture2D(filterTexture, vUv + filterEffect);
  float filterAvgColor = (filterColor.x + filterColor.y + filterColor.z) / 3.0;
  vec2 targetUv = vUv + filterAvgColor * filterEffect;
  vec4 fromColor = texture2D(texture1, targetUv);
  vec4 toColor = texture2D(texture2, targetUv);

  gl_FragColor = mix(fromColor, toColor, progress);
}


// varying vec2 vUv;
// uniform sampler2D uTexture1;
// uniform sampler2D uTexture2;
// uniform sampler2D uTextureMap;
// uniform float uTime;

// const float maxDelay = 0.1;
// const float duration = 1.0 - maxDelay;

// void main() {
//   float delay = (distance(vUv.x, 0.5) / 0.5 + distance(vUv.y, 0.5) / 0.5) / 2.0;
//   float progressTime = (sin(uTime / 30.0) + 1.0) / 2.0;
//   float progress = clamp(progressTime - delay * maxDelay, 0.0, duration) / duration;
//   float peek = abs(step(0.5, progress) - progress) / 0.5 + 1.0;

//   float noise = (snoise(vec3(vUv.x, vUv.y, uTime / 100.0)) + 1.0) / 2.0;
//   // vec4 mapColor = texture2D(uTextureMap, vUv + (noise / (2.0 * peek + 1.0)));
//   vec4 mapColor = texture2D(uTextureMap, vUv * (noise * peek));
//   float colorAvg = (((mapColor.r + mapColor.g + mapColor.b) / 3.0) * 2.0) - 1.0;
//   vec4 beforeColor = texture2D(uTexture1, vUv + progressTime * colorAvg * delay * 5.0);
//   vec4 afterColor = texture2D(uTexture2, vUv + (1.0 - progressTime) * colorAvg * delay * 5.0);

//   gl_FragColor = mix(beforeColor, afterColor, progressTime);
//   // gl_FragColor = vec4(vec3((noise + 1.0) / 2.0), 1.0);
// }
