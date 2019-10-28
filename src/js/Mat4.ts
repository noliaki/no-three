import Vec3, { Vector3 } from './Vec3'

export default class Mat4 {
  static STRIDE: number = 4 * 4
  static EPSILON = 0.000001

  static create = (): Float32Array => {
    // 1, 0, 0, 0,
    // 0, 1, 0, 0,
    // 0, 0, 1, 0,
    // 0, 0, 0, 1
    return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
  }

  static clone(original?: Float32Array): Float32Array {
    const dest: Float32Array = this.create()

    if (!original) return dest

    dest.forEach(
      (val: number, index: number): number => (dest[index] = original[index])
    )

    return dest
  }

  static multiply(
    a: Float32Array,
    b: Float32Array,
    out?: Float32Array
  ): Float32Array {
    const dest: Float32Array = this.clone(out)

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

  static lookAt(
    eye: Vector3,
    target: Vector3,
    up: Vector3,
    out?: Float32Array
  ): Float32Array {
    const dest: Float32Array = this.clone(out)

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
    far: number,
    out?: Float32Array
  ): Float32Array {
    const dest: Float32Array = this.clone(out)

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

  static translate(v: Vector3, out?: Float32Array): Float32Array {
    const dest: Float32Array = this.clone(out)

    const x: number = v[0]
    const y: number = v[1]
    const z: number = v[2]

    dest[12] = dest[0] * x + dest[4] * y + dest[8] * z + dest[12]
    dest[13] = dest[1] * x + dest[5] * y + dest[9] * z + dest[13]
    dest[14] = dest[2] * x + dest[6] * y + dest[10] * z + dest[14]
    dest[15] = dest[3] * x + dest[7] * y + dest[11] * z + dest[15]

    return dest
  }

  static scale(v: Vector3, out?: Float32Array): Float32Array {
    const dest: Float32Array = this.clone(out)

    const x: number = v[0]
    const y: number = v[1]
    const z: number = v[2]

    dest[0] *= x
    dest[1] *= x
    dest[2] *= x
    dest[3] *= x

    dest[4] *= y
    dest[5] *= y
    dest[6] *= y
    dest[7] *= y

    dest[8] *= z
    dest[9] *= z
    dest[10] *= z
    dest[11] *= z

    return dest
  }

  static rotate(
    radian: number,
    axis: Vector3,
    out?: Float32Array
  ): Float32Array {
    const dest: Float32Array = this.clone(out)

    const x: number = Vec3.normalize(axis)[0]
    const y: number = Vec3.normalize(axis)[1]
    const z: number = Vec3.normalize(axis)[2]

    const c: number = Math.cos(radian)
    const s: number = Math.sin(radian)
    const t: number = 1 - c

    const a00: number = dest[0]
    const a01: number = dest[1]
    const a02: number = dest[2]
    const a03: number = dest[3]
    const a10: number = dest[4]
    const a11: number = dest[5]
    const a12: number = dest[6]
    const a13: number = dest[7]
    const a20: number = dest[8]
    const a21: number = dest[9]
    const a22: number = dest[10]
    const a23: number = dest[11]

    const b00: number = x * x * t + c
    const b01: number = y * x * t + z * s
    const b02: number = z * x * t - y * s
    const b10: number = x * y * t - z * s
    const b11: number = y * y * t + c
    const b12: number = z * y * t + x * s
    const b20: number = x * z * t + y * s
    const b21: number = y * z * t - x * s
    const b22: number = z * z * t + c

    dest[0] = a00 * b00 + a10 * b01 + a20 * b02
    dest[1] = a01 * b00 + a11 * b01 + a21 * b02
    dest[2] = a02 * b00 + a12 * b01 + a22 * b02
    dest[3] = a03 * b00 + a13 * b01 + a23 * b02
    dest[4] = a00 * b10 + a10 * b11 + a20 * b12
    dest[5] = a01 * b10 + a11 * b11 + a21 * b12
    dest[6] = a02 * b10 + a12 * b11 + a22 * b12
    dest[7] = a03 * b10 + a13 * b11 + a23 * b12
    dest[8] = a00 * b20 + a10 * b21 + a20 * b22
    dest[9] = a01 * b20 + a11 * b21 + a21 * b22
    dest[10] = a02 * b20 + a12 * b21 + a22 * b22
    dest[11] = a03 * b20 + a13 * b21 + a23 * b22

    return dest
  }

  static rotateX(radian: number): Float32Array {
    const dest: Float32Array = this.create()

    const cos: number = Math.cos(radian)
    const sin: number = Math.sin(radian)

    dest[0] = cos
    dest[2] = sin
    dest[8] = -sin
    dest[10] = cos

    return dest
  }
}
