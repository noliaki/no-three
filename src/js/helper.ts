import { Vector3, Math as ThreeMath, TextureLoader, Texture } from 'three'

const UA: string = navigator.userAgent.toLocaleLowerCase()
const PI: number = Math.PI
const PI2: number = PI * 2

export function isPC(): boolean {
  return !/(iphone|ipad|ipod|android)/i.test(UA)
}

export function getRandomPointOnSphere(r: number): Vector3 {
  const u: number = ThreeMath.randFloat(0, 1)
  const v: number = ThreeMath.randFloat(0, 1)
  const theta: number = PI2 * u
  const phi: number = Math.acos(2 * v - 1)

  return new Vector3(
    r * Math.sin(theta) * Math.sin(phi),
    r * Math.cos(theta) * Math.sin(phi),
    r * Math.cos(phi)
  )
}

export function loadTexture(src: string): Promise<Texture> {
  return new Promise((resolve: (texture: Texture) => void): void => {
    const textureLoader: TextureLoader = new TextureLoader()
    textureLoader.load(src, resolve)
  })
}
