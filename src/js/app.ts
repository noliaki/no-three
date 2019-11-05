import WebGLBase from './WebGLBase'
import vertexShaderSource from './vertex-shader'
import fragmentShaderSource from './fragment-shader'
import { TweenLite, Power0 } from 'gsap/all'
// import Mat4 from './Mat4'
// import Triangle from './Triangle'
import Square from './Square'
import { loadImage } from './helper'

// const triangle: Triangle = new Triangle([0, 0.5, 0], 2)
// const square2: Square = new Square([1, 1, 0], 1)
const base: WebGLBase = new WebGLBase({
  canvasEl: document.getElementById('app') as HTMLCanvasElement
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

let textures: (HTMLImageElement | HTMLCanvasElement)[] = []
let filterTextures: (HTMLImageElement | HTMLCanvasElement)[] = []
let index: number = 0

const time: { progress: number; value: number; forward: boolean } = {
  progress: 0,
  value: 0,
  forward: true
}

async function init(): Promise<void> {
  textures = await Promise.all([loadImage('cat-1.jpg'), loadImage('cat-2.jpg')])

  filterTextures = await Promise.all([
    loadImage('polygon.jpg'),
    loadImage('cloud.png')
  ])

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
      data: Date.now(),
      type: '1f'
    })
    .registerUniform({
      name: 'uProgress',
      data: time.value,
      type: '1f'
    })
    .registerTexture({
      name: 'texture1',
      image: textures[0]
    })
    .registerTexture({
      name: 'texture2',
      image: textures[1]
    })
    .registerTexture({
      name: 'filterTexture',
      image: filterTextures[index]
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
}

// function update() {
//   base
//     .clear()
//     .registerUniform({
//       name: 'uTime',
//       data: time++,
//       type: '1f'
//     })
//     .drawElements('TRIANGLES', square.index.length)
//     .flush()

//   requestAnimationFrame(update)
// }

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
;(document.getElementById('btn') as HTMLButtonElement).addEventListener(
  'click',
  (event: Event): void => {
    event.preventDefault()

    TweenLite.to(time, 2, {
      progress: time.forward ? 1 : 0,
      ease: Power0.easeNone,
      onUpdate(): void {
        base
          .clear()
          .registerUniform({
            name: 'uTime',
            data: time.value++,
            type: '1f'
          })
          .registerUniform({
            name: 'uProgress',
            data: time.progress,
            type: '1f'
          })
          .drawElements('TRIANGLES', square.index.length)
          .flush()
      },
      onComplete(): void {
        base
          .clear()
          .registerTexture({
            name: 'filterTexture',
            image: filterTextures[++index % textures.length]
          })
          .registerUniform({
            name: 'uProgress',
            data: time.progress,
            type: '1f'
          })
          .drawElements('TRIANGLES', square.index.length)
          .flush()
      }
    })

    time.forward = !time.forward
  },
  {
    capture: false
  }
)
