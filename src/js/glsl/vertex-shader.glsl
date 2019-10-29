attribute vec3 position;
attribute vec4 color;
attribute vec2 textureCoord;
uniform mat4 mvpMatrix;
varying vec4 vColor;
varying vec2 vUv;

void main(void){
  vColor = color;
  vUv = textureCoord;
  gl_Position = mvpMatrix * vec4(position, 1.0);
}


// uniform float uTime;
// uniform sampler2D uTexture;
// varying vec2 vUv;

// const float PI = 3.141592653589793238462643383279502884197169399375105820;
// const float PI2 = 2.0 * PI;

// void main(){
//   vUv = position.xy + 0.5;
//   vec4 transform = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//   // transform.x *= sin(uTime / 200.0) * 2.0;
//   // transform.y *= cos(uTime / 250.0) * 1.0;
//   gl_Position = transform;
// }
