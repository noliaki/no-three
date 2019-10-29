export default class Square {
  public readonly x: number
  public readonly y: number
  public readonly z: number
  public readonly w: number

  public readonly position: Float32Array
  public readonly index: Int16Array

  public readonly count: number = 4

  constructor(position: [number, number, number] = [0, 0, 0], _w: number = 1) {
    this.x = position[0]
    this.y = position[1]
    this.z = position[2]
    this.w = _w

    const halfW: number = this.w / 2

    this.position = new Float32Array([
      this.x - halfW,
      this.y + halfW,
      this.z + 0,

      this.x + halfW,
      this.y + halfW,
      this.z + 0,

      this.x - halfW,
      this.y - halfW,
      this.z + 0,

      this.x + halfW,
      this.y - halfW,
      this.z + 0
    ])

    this.index = new Int16Array([0, 2, 1, 1, 2, 3])
  }
}
