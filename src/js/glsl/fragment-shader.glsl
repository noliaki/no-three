varying vec4 vColor;
varying vec2 vUv;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform sampler2D filterTexture;
uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uImageResolution;

const float maxDelay = 0.5;
const float duration = 1.0 - maxDelay;

vec2 imageUv(vec2 resolution, vec2 imageResolution, vec2 uv){
  vec2 ratio = vec2(
    min((resolution.x / resolution.y) / (imageResolution.x / imageResolution.y), 1.0),
    min((resolution.y / resolution.x) / (imageResolution.y / imageResolution.x), 1.0)
  );

  return vec2(
    uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    uv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );
}

void main(){
  vec2 uv = imageUv(uResolution, uImageResolution, vUv);
  float time = (sin(uTime / 100.0 - HALF_PI) + 1.0) / 2.0;
  float uvVol = (uv.x + uv.y) / 2.0;
  // float delay = uvVol;
  float delay = sin(uv.x + abs(snoise(vec3(uv, uTime / 1000.0))) / 2.0);
  float progress = clamp(time - delay * maxDelay, 0.0, duration) / duration;
  float revProgress = 1.0 - progress;
  float noise = snoise(vec3(uv, uTime / 100.0));
  float filterVol = 1.0 - pow(abs(progress * 2.0 - 1.0), 2.0);

  vec4 filterColor = texture2D(filterTexture, uv + (filterVol * noise) / 10.0);

  float filterAvgColor = ((filterColor.x + filterColor.y + filterColor.z) / 3.0) * 2.0 - 1.0;
  vec4 fromColor = texture2D(texture1, uv + progress * filterAvgColor);
  vec4 toColor = texture2D(texture2, uv + revProgress * filterAvgColor);

  gl_FragColor = mix(fromColor, toColor, progress);
}
