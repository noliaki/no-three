import Vec3, { Vector3 } from './Vec3'

export default class Mat4 {
  static stride: number = 4 * 4

  static create = (): Float32Array => {
    // 1, 0, 0, 0,
    // 0, 1, 0, 0,
    // 0, 0, 1, 0,
    // 0, 0, 0, 1
    return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
  }

  static multiply(a: Float32Array, b: Float32Array): Float32Array {
    const dest: Float32Array = this.create()

    dest[0] = a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12]
    dest[1] = a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13]
    dest[2] = a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14]
    dest[3] = a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15]

    dest[4] = a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12]
    dest[5] = a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13]
    dest[6] = a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14]
    dest[7] = a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15]

    dest[8] = a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12]
    dest[9] = a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13]
    dest[10] = a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14]
    dest[11] = a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15]

    dest[12] = a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12]
    dest[13] = a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13]
    dest[14] = a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14]
    dest[15] = a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15]

    return dest
  }

  static lookAt(eye: Vector3, target: Vector3, up: Vector3): Float32Array {
    const dest: Float32Array = this.create()

    let zVec: Vector3 = Vec3.sub(eye, target)

    if (Vec3.lenSq(zVec) === 0) {
      zVec[2] = 1
    }

    zVec = Vec3.normalize(zVec)
    let xVec: Vector3 = Vec3.cross(up, zVec)

    if (Vec3.lenSq(xVec) === 0) {
      if (Math.abs(up[2]) === 1) {
        zVec[0] += 0.0001
      } else {
        zVec[2] += 0.0001
      }

      zVec = Vec3.normalize(zVec)
      xVec = Vec3.cross(up, zVec)
    }

    xVec = Vec3.normalize(xVec)

    const yVec: Vector3 = Vec3.cross(zVec, xVec)

    dest[0] = xVec[0]
    dest[1] = xVec[1]
    dest[2] = xVec[2]

    dest[4] = yVec[0]
    dest[5] = yVec[1]
    dest[6] = yVec[2]

    dest[8] = zVec[0]
    dest[9] = zVec[1]
    dest[10] = zVec[2]

    dest[12] = -(xVec[0] * eye[0] + xVec[1] * eye[1] + xVec[2] * eye[2])
    dest[13] = -(yVec[0] * eye[0] + yVec[1] * eye[1] + yVec[2] * eye[2])
    dest[14] = -(zVec[0] * eye[0] + zVec[1] * eye[1] + zVec[2] * eye[2])

    return dest
  }

  static perspective(
    fov: number,
    aspect: number,
    near: number,
    far: number
  ): Float32Array {
    const dest: Float32Array = this.create()

    const t: number = near * Math.tan((fov * Math.PI) / 360)
    const r: number = t * aspect
    const a = r * 2
    const b = t * 2
    const c = far - near

    dest[0] = (near * 2) / a
    dest[5] = (near * 2) / b
    dest[10] = -(far + near) / c
    dest[11] = -1
    dest[14] = -(far * near * 2) / c
    dest[15] = 0

    return dest
  }

  static translate(v: Vector3): Float32Array {
    const dest: Float32Array = this.create()

    dest[12] = dest[0] * v[0] + dest[4] * v[1] + dest[8] * v[2] + dest[12]
    dest[13] = dest[1] * v[0] + dest[5] * v[1] + dest[9] * v[2] + dest[13]
    dest[14] = dest[2] * v[0] + dest[6] * v[1] + dest[10] * v[2] + dest[14]
    dest[15] = dest[3] * v[0] + dest[7] * v[1] + dest[11] * v[2] + dest[15]

    return dest
  }

  static rotate(radian: number, axis: Vector3): Float32Array {
    const dest: Float32Array = this.create()

    const sq: number = Vec3.len(axis)
    const normalAxis: Vector3 = sq !== 1 ? Vec3.normalize(axis) : axis
    const cosA: number = Math.cos(radian)
    const sinA: number = Math.sin(radian)
    const revCosA: number = 1 - cosA

    const s: number = dest[0] * dest[0] * revCosA + cosA
    const t: number = dest[1] * dest[0] * revCosA + normalAxis[2] * sinA
    const u: number = dest[2] * dest[0] * revCosA - normalAxis[1] * sinA

    const v: number = dest[0] * dest[1] * revCosA - normalAxis[2] * sinA
    const w: number = dest[1] * dest[1] * revCosA + cosA
    const x: number = dest[2] * dest[1] * revCosA + normalAxis[0] * sinA

    const y: number = dest[0] * dest[2] * revCosA + normalAxis[1] * sinA
    const z: number = dest[1] * dest[2] * revCosA - normalAxis[0] * sinA
    const a: number = dest[2] * dest[2] * revCosA + cosA

    // if (radian) {

    // }

    dest[0] = dest[0] * s + dest[4] * t + dest[8] * u
    dest[1] = dest[1] * s + dest[5] * t + dest[9] * u
    dest[2] = dest[2] * s + dest[6] * t + dest[10] * u
    dest[3] = dest[3] * s + dest[7] * t + dest[11] * u

    dest[4] = dest[0]

    return dest
  }
}
