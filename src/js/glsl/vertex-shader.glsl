attribute vec3 position;
attribute vec4 color;
attribute vec2 textureCoord;
// uniform mat4 mvpMatrix;
varying vec4 vColor;
varying vec2 vUv;

void main(void){
  vColor = color;
  vUv = textureCoord;
  gl_Position = vec4(position, 1.0);
}
