varying vec4 vColor;
varying vec2 vUv;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform sampler2D filterTexture;
uniform float uTime;
uniform float uProgress;
uniform vec2 uResolution;
uniform vec2 uImageResolution;

const float maxDelay = 0.5;
const float duration = 1.0 - maxDelay;

vec2 imageRatio(vec2 resolution, vec2 imageResolution) {
  return vec2(
    min((resolution.x / resolution.y) / (imageResolution.x / imageResolution.y), 1.0),
    min((resolution.y / resolution.x) / (imageResolution.y / imageResolution.x), 1.0)
  );
}

vec2 imageUv(vec2 resolution, vec2 imageResolution, vec2 uv){
  vec2 ratio = imageRatio(resolution, imageResolution);

  return vec2(
    uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    uv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );
}

void main(){
  vec2 ratio = imageRatio(uResolution, uImageResolution);
  vec2 uv = imageUv(uResolution, uImageResolution, vUv);
  // float time = uProgress;//pow(sin(uProgress / 100.0), 2.0);
  float uvVol = (
    // pow((uv.x * 2.0) - 1.0, 2.0) +
    // pow((uv.y * 2.0) - 1.0, 2.0)
    // uv.x + uv.y
    fract(floor(uv.x / (ratio.x * 0.3))) +
    fract(floor(uv.y / (ratio.y * 0.3)))
    ) / 2.0;
  // float delay = uvVol;
  // float time = easeInOutCubic(uTime);
  float noise = snoise(vec3(uv, uTime / 1000.0));
  float delay = uvVol;//pow(sin(uvVol + noise), 2.0);
  float progress = easeInOutCubic(clamp(uProgress - delay * maxDelay, 0.0, duration) / duration);
  float revProgress = 1.0 - progress;
  float filterVol = 1.0 - pow(abs(progress * 2.0 - 1.0), 2.0);

  vec4 filterColor = texture2D(filterTexture, uv + (filterVol * noise) / 90.0);

  float filterAvgColor = (filterColor.x + filterColor.y + filterColor.z) / 3.0;
  vec4 fromColor = texture2D(texture1, uv + progress * filterAvgColor * noise);
  vec4 toColor = texture2D(texture2, uv + revProgress * filterAvgColor * noise);

  gl_FragColor = mix(fromColor, toColor, progress);
}
