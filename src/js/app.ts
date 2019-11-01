import WebGLBase from './WebGLBase'
import vertexShaderSource from './vertex-shader'
import fragmentShaderSource from './fragment-shader'
// import Mat4 from './Mat4'
// import Triangle from './Triangle'
import Square from './Square'
import { loadImage } from './helper'

// const triangle: Triangle = new Triangle([0, 0.5, 0], 2)
// const square2: Square = new Square([1, 1, 0], 1)
const base: WebGLBase = new WebGLBase({
  selector: '#app'
})
const square: Square = new Square([0, 0, 0], 2, 2)
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

let time: number = 0

async function init(): Promise<void> {
  const texture1: HTMLImageElement | HTMLCanvasElement = await loadImage(
    'cat-1.jpg'
  )
  const texture2: HTMLImageElement | HTMLCanvasElement = await loadImage(
    'cat-2.jpg'
  )
  const filterTexture: HTMLImageElement | HTMLCanvasElement = await loadImage(
    'cloud.png'
  )

  base
    .createProgram(vertexShaderSource, fragmentShaderSource)
    .registerUniform({
      name: 'uResolution',
      data: [window.innerWidth, window.innerHeight],
      type: '2fv'
    })
    .registerUniform({
      name: 'uImageResolution',
      data: [960, 640],
      type: '2fv'
    })
    .registerUniform({
      name: 'uTime',
      data: time,
      type: '1f'
    })
    .registerTexture({
      name: 'texture1',
      image: texture1
    })
    .registerTexture({
      name: 'texture2',
      image: texture2
    })
    .registerTexture({
      name: 'filterTexture',
      image: filterTexture
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
    .bindBuffer(
      base.createBufferObj(square.index, 'ELEMENT_ARRAY_BUFFER', 'STATIC_DRAW'),
      'ELEMENT_ARRAY_BUFFER'
    )
    .drawElements('TRIANGLES', square.index.length)
    .flush()

  update()
}

function update() {
  base
    .clear()
    .registerUniform({
      name: 'uTime',
      data: time++,
      type: '1f'
    })
    .drawElements('TRIANGLES', square.index.length)
    .flush()

  requestAnimationFrame(update)
}

window.addEventListener('resize', (): void => {
  base
    .setCanvasSize(window.innerWidth, window.innerHeight)
    .clear()
    .registerUniform({
      name: 'uResolution',
      data: [window.innerWidth, window.innerHeight],
      type: '2fv'
    })
    .drawElements('TRIANGLES', square.index.length)
    .flush()
})

init()
