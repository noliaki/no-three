export default class Mat4 {
  static stride: number = 4 * 4

  static create = (): Float32Array => {
    return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
  }

  static multiply(a: Float32Array, b: Float32Array): Float32Array {
    const dest: Float32Array = new Float32Array(this.stride)

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
}
