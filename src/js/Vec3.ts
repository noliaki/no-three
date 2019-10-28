export type Vector3 = [number, number, number]

export default class Vec3 {
  static sub(v: Vector3, w: Vector3): Vector3 {
    return v.map(
      (element: number, index: number): number => element - w[index]
    ) as Vector3
  }

  static len(v: Vector3): number {
    return Math.sqrt(this.lenSq(v))
  }

  static lenSq(v: Vector3): number {
    return v.reduce((acc: number, current: number): number => {
      acc += current * current

      return acc
    }, 0)
  }

  static multiplyScalar(v: Vector3, scalar: number): Vector3 {
    return v.map((element: number): number => element * scalar) as Vector3
  }

  static divideScalar(v: Vector3, scalar: number): Vector3 {
    return this.multiplyScalar(v, 1 / scalar)
  }

  static normalize(v: Vector3): Vector3 {
    return this.divideScalar(v, this.len(v) || 1)
  }

  static cross(v: Vector3, w: Vector3): Vector3 {
    return [
      v[1] * w[2] - v[2] * w[1],
      v[2] * w[0] - v[0] * w[2],
      v[0] * w[1] - v[1] * w[0]
    ]
  }
}
