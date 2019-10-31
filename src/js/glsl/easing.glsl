#ifndef HALF_PI
  #define HALF_PI 1.5707963267948966
#endif

#ifndef PI
  #define PI 3.141592653589793
#endif

float linear(float t){
  return t;
}

// Sine
float easeOutSine(float t) {
  return sin(t * HALF_PI);
}

float easeInSine(float t) {
  return sin((t - 1.0) * HALF_PI) + 1.0;
}

float easeInOutSine(float t) {
  return -0.5 * (cos(PI * t) - 1.0);
}

// Quad
float easeInQuad(float t){
  return t * t;
}

float easeOutQuad(float t){
  return t * (2.0 - t);
}

float easeInOutQuad(float t){
  return t < 0.5 ? 2.0 * t * t : -1.0 + (4.0 - 2.0 * t) * t;
}

// Cubic
float easeInCubic(float t){
  return t * t * t;
}

float easeOutCubic(float t){
  float f = t - 1.0;
  return f * f * f + 1.0;
}

float easeInOutCubic(float t) {
  return t < 0.5
    ? 4.0 * t * t * t
    : 0.5 * pow(2.0 * t - 2.0, 3.0) + 1.0;
}



