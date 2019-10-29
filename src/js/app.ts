import WebGLBase from './WebGLBase'
import vertexShaderSource from './vertex-shader'
import fragmentShaderSource from './fragment-shader'
import Mat4 from './Mat4'
import Triangle from './Triangle'
import Square from './Square'
import { loadImage } from './helper'

const base: WebGLBase = new WebGLBase({
  selector: '#app'
})
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
const textureCoord: Float32Array = new Float32Array([
  0.0,
  0.0,
  1.0,
  0.0,
  0.0,
  1.0,
  1.0,
  1.0
])

const vMat: Float32Array = Mat4.lookAt([0.0, 0.0, 1], [0, 0, 0], [0, 1, 0])
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
// console.log(square.position, square.index)

async function init(): Promise<void> {
  const texture1: HTMLImageElement | HTMLCanvasElement = await loadImage(
    'cat-1.jpg'
  )
  const texture2: HTMLImageElement | HTMLCanvasElement = await loadImage(
    'cat-2.jpg'
  )

  base
    .createProgram(vertexShaderSource, fragmentShaderSource)
    .registerUniform({
      name: 'mvpMatrix',
      data: projectionViewMat,
      type: 'mat4'
    })
    .registerTexture({
      name: 'texture1',
      image: texture1
    })
    .registerTexture({
      name: 'texture2',
      image: texture2
    })
    .registerVertexAttrByName({
      name: 'position',
      size: 3,
      data: square.position
    })
    .registerVertexAttrByName({
      name: 'textureCoord',
      size: 2,
      data: textureCoord
    })
    .registerVertexAttrByName({
      name: 'color',
      size: 4,
      data: color
    })
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
}

window.addEventListener('resize', (): void => {
  const projectionViewMat: Float32Array = Mat4.multiply(
    Mat4.lookAt([0.0, 0.0, 1], [0, 0, 0], [0, 1, 0]),
    Mat4.perspective(90, window.innerWidth / window.innerHeight, 0.1, 100)
  )

  base
    .setCanvasSize(window.innerWidth, window.innerHeight)
    .clear()
    .registerUniform({
      name: 'mvpMatrix',
      data: projectionViewMat,
      type: 'mat4'
    })
    .drawElements('TRIANGLES', square.index.length)
    .flush()
})

init()
