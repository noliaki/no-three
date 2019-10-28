import WebGLBase from './WebGLBase'
import vertexShaderSource from './vertex-shader'
import fragmentShaderSource from './fragment-shader'
import Mat4 from './Mat4'
import Triangle from './Triangle'
import Square from './Square'

const base: WebGLBase = new WebGLBase('#app')
const triangle: Triangle = new Triangle([0, 0, 0], 8)
const square: Square = new Square([0, 0, 0], 1)
const square2: Square = new Square([1, 1, 0], 1)
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
  1,
  0,
  0.5,
  1,
  1
])

const vMat: Float32Array = Mat4.lookAt([0.0, 0.0, 5.0], [0, 0, 0], [0, 1, 0])
const pMat: Float32Array = Mat4.perspective(
  90,
  window.innerWidth / window.innerHeight,
  0.1,
  100
)

const projectionViewMat: Float32Array = Mat4.multiply(vMat, pMat)

// const position: Float32Array = new Float32Array(
//   square2.position.length + square.position.length
// )
// const index: Float32Array = new Float32Array(
//   square.index.length + square2.index.length
// )

// for (let i = 0; i < position.length; i++) {
//   if (i >= square.position.length) {
//     position[i] = square2.position[i - square.position.length]
//   } else {
//     position[i] = square.position[i]
//   }
// }

// for (let i = 0; i < index.length; i++) {
//   if (i >= square.index.length) {
//     index[i] = square2.index[i - square.index.length] + square.count
//   } else {
//     index[i] = square.index[i]
//   }
// }

// console.log(position, index)
console.log(square.position, square.index)

base
  .createProgram(vertexShaderSource, fragmentShaderSource)
  .registerUniform('mvpMatrix', projectionViewMat, 'mat4')
  .registerVertexAttrByName('position', 3, square.position)
  .registerVertexAttrByName('color', 4, color)
  .bindBuffer(
    base.createBufferObj(square.index, 'ELEMENT_ARRAY_BUFFER', 'STATIC_DRAW'),
    'ELEMENT_ARRAY_BUFFER'
  )
  .drawElements('TRIANGLES', square.index.length)
  // .registerUniform(
  //   'mvpMatrix',
  //   Mat4.multiply(
  //     Mat4.translate([-Math.random() + 0.5, -Math.random() + 0.5, 0]),
  //     projectionViewMat
  //   ),
  //   'mat4'
  // )
  // .drawArrays()
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
