export default class Triangle {
  public readonly x: number
  public readonly y: number
  public readonly z: number
  public readonly w: number

  public readonly position: Float32Array
  public readonly index: Int16Array

  public readonly count: number = 3

  constructor(position: [number, number, number] = [0, 0, 0], _w: number = 1) {
    this.x = position[0]
    this.y = position[1]
    this.z = position[2]
    this.w = _w

    const halfW: number = this.w / 2
    const offsetY: number =
      Math.sqrt(Math.pow(this.w, 2) - Math.pow(halfW, 2)) / 2

    this.position = new Float32Array([
      this.x + 0,
      this.y + offsetY,
      this.z + 0,
      this.x + halfW,
      this.y - offsetY,
      this.z + 0,
      this.x - halfW,
      this.y - offsetY,
      this.z + 0
    ])

    this.index = new Int16Array([0, 1, 2])
  }
}
