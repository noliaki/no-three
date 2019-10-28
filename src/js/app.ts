import WebGLBase from './WebGLBase'
import vertexShaderSource from './vertex-shader'
import fragmentShaderSource from './fragment-shader'
import Mat4 from './Mat4'

const base: WebGLBase = new WebGLBase('#app')
const position: Float32Array = new Float32Array([
  0.0,
  1.0,
  0.0,
  1.0,
  0.0,
  0.0,
  -1.0,
  0.0,
  0.0
])
const color: Float32Array = new Float32Array([
  1,
  0,
  0,
  1,
  0,
  1,
  0,
  1,
  0,
  0,
  1,
  1
])

const vMat: Float32Array = Mat4.lookAt([0.0, 1.0, 10.0], [0, 0, 0], [0, 1, 0])
const pMat: Float32Array = Mat4.perspective(
  90,
  window.innerWidth / window.innerHeight,
  0.1,
  100
)

const projectionViewMat: Float32Array = Mat4.multiply(vMat, pMat)

base
  .createProgram(vertexShaderSource, fragmentShaderSource)
  .registerVertexAttrByName('position', 3, position)
  .registerVertexAttrByName('color', 4, color)
  .registerUniform(
    'mvpMatrix',
    Mat4.multiply(
      projectionViewMat,
      Mat4.translate([-Math.random() + 0.5, -Math.random() + 0.5, 0])
    ),
    'mat4'
  )
  .drawArrays()
  .registerUniform(
    'mvpMatrix',
    Mat4.multiply(
      projectionViewMat,
      Mat4.translate([-Math.random() + 0.5, -Math.random() + 0.5, 0])
    ),
    'mat4'
  )
  .drawArrays()
  .flush()

window.addEventListener('resize', (): void => {
  base
    .setCanvasSize(window.innerWidth, window.innerHeight)
    .clear()
    .registerUniform(
      'mvpMatrix',
      Mat4.multiply(
        projectionViewMat,
        Mat4.translate([-Math.random() + 0.5, -Math.random() + 0.5, 0])
      ),
      'mat4'
    )
    .drawArrays()
    .registerUniform(
      'mvpMatrix',
      Mat4.multiply(
        projectionViewMat,
        Mat4.translate([-Math.random() + 0.5, -Math.random() + 0.5, 0])
      ),
      'mat4'
    )
    .drawArrays()
    .flush()
})
