type Target =
  | 'ARRAY_BUFFER'
  | 'ELEMENT_ARRAY_BUFFER'
  | 'COPY_READ_BUFFER'
  | 'COPY_WRITE_BUFFER'
  | 'TRANSFORM_FEEDBACK_BUFFER'
  | 'UNIFORM_BUFFER'
  | 'PIXEL_PACK_BUFFER'
  | 'PIXEL_UNPACK_BUFFER'

type Usage =
  | 'STATIC_DRAW'
  | 'DYNAMIC_DRAW'
  | 'STREAM_DRAW'
  | 'STATIC_READ'
  | 'DYNAMIC_READ'
  | 'STREAM_READ'
  | 'STATIC_COPY'
  | 'DYNAMIC_COPY'
  | 'STREAM_COPY'

type Mode =
  | 'POINTS'
  | 'LINE_STRIP'
  | 'LINE_LOOP'
  | 'LINES'
  | 'TRIANGLE_STRIP'
  | 'TRIANGLE_FAN'
  | 'TRIANGLES'

type DrayElType = 'UNSIGNED_BYTE' | 'UNSIGNED_SHORT' | 'UNSIGNED_INT'

export default class WebGLBase {
  private canvas: HTMLCanvasElement | null
  private context: WebGLRenderingContext
  private vertexShader: WebGLShader | null = null
  private fragmentShader: WebGLShader | null = null
  private program: WebGLProgram | null = null

  constructor(selector: string) {
    this.canvas = document.querySelector(selector)
    if (this.canvas === null) {
      throw new Error(`${selector} is not found`)
    }

    // this.canvas.width = window.innerWidth
    // this.canvas.height = window.innerHeight

    this.setCanvasSize(window.innerWidth, window.innerHeight)

    this.context = (this.canvas.getContext('webgl') ||
      this.canvas.getContext('experimental-webgl')) as WebGLRenderingContext

    this.clear()
  }

  setCanvasSize(width: number, height: number): WebGLBase {
    if (this.canvas === null) {
      return this
    }

    this.canvas.width = width
    this.canvas.height = height

    return this
  }

  clear(): WebGLBase {
    this.context.clearColor(0.0, 0, 0, 1.0)
    this.context.clearDepth(1.0)
    this.context.clear(
      this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT
    )

    return this
  }

  createVertexShader(shaderSource: string): WebGLBase {
    this.vertexShader = this.createShader(
      shaderSource,
      this.context.VERTEX_SHADER
    )

    return this
  }

  createFragmentShader(shaderSource: string): WebGLBase {
    this.fragmentShader = this.createShader(
      shaderSource,
      this.context.FRAGMENT_SHADER
    )

    return this
  }

  createProgram(
    vertexShaderSource: string,
    fragmentShaderSource: string
  ): WebGLBase {
    this.createVertexShader(vertexShaderSource)
    this.createFragmentShader(fragmentShaderSource)

    if (this.vertexShader === null) {
      throw new Error('vertex shader is not created')
    }

    if (this.fragmentShader === null) {
      throw new Error('fragment shader is not created')
    }

    this.program = this.context.createProgram()

    if (this.program === null) {
      throw new Error('can not create program')
    }

    this.context.attachShader(this.program, this.vertexShader)
    this.context.attachShader(this.program, this.fragmentShader)

    this.context.linkProgram(this.program)

    if (
      !this.context.getProgramParameter(this.program, this.context.LINK_STATUS)
    ) {
      throw new Error('can not link program')
    }

    this.context.useProgram(this.program)

    return this
  }

  getAttrLocation(attrName: string): number {
    if (this.program === null) {
      throw new Error('program is not created')
    }

    return this.context.getAttribLocation(this.program, attrName)
  }

  getUniformLocation(attrName: string): WebGLUniformLocation | null {
    if (this.program === null) {
      throw new Error('program is not created')
    }

    return this.context.getUniformLocation(this.program, attrName)
  }

  registerUniform(
    attrName: string,
    data: Float32Array,
    type: string = 'mat4'
  ): WebGLBase {
    switch (type) {
      case 'f1':
        this.context.uniform1fv(this.getUniformLocation(attrName), data)
        return this
      case 'f2':
        this.context.uniform2fv(this.getUniformLocation(attrName), data)
        return this
      case 'f3':
        this.context.uniform3fv(this.getUniformLocation(attrName), data)
        return this
      case 'f4':
        this.context.uniform4fv(this.getUniformLocation(attrName), data)
        return this

      case 'mat2':
        this.context.uniformMatrix2fv(
          this.getUniformLocation(attrName),
          false,
          data
        )
        return this
      case 'mat3':
        this.context.uniformMatrix3fv(
          this.getUniformLocation(attrName),
          false,
          data
        )
        return this
      case 'mat4':
        this.context.uniformMatrix4fv(
          this.getUniformLocation(attrName),
          false,
          data
        )
        return this
    }

    return this
  }

  drawArrays(
    mode: Mode = 'TRIANGLES',
    first: number = 0,
    count: number = 3
  ): WebGLBase {
    this.context.drawArrays(this.context[mode], first, count)

    return this
  }

  drawElements(
    mode: Mode = 'TRIANGLES',
    count: number = 3,
    type: DrayElType = 'UNSIGNED_SHORT',
    offset: number = 0
  ): WebGLBase {
    this.context.drawElements(
      this.context[mode],
      count,
      this.context[type],
      offset
    )

    return this
  }

  flush(): WebGLBase {
    this.context.flush()
    return this
  }

  createVbo(
    data: ArrayBuffer,
    target: Target = 'ARRAY_BUFFER',
    usage: Usage = 'STATIC_DRAW'
  ): WebGLBuffer {
    const buffer: WebGLBuffer | null = this.context.createBuffer()

    if (buffer === null) {
      throw new Error('can not create Buffer')
    }

    this.context.bindBuffer(this.context[target], buffer)
    this.context.bufferData(this.context[target], data, this.context[usage])

    this.context.bindBuffer(this.context[target], null)

    return buffer
  }

  createBufferObj(
    data: ArrayBuffer,
    target: Target = 'ELEMENT_ARRAY_BUFFER',
    usage: Usage = 'STATIC_DRAW'
  ) {
    const buffer: WebGLBuffer | null = this.context.createBuffer()

    if (buffer === null) {
      throw new Error('can not create Buffer')
    }

    this.context.bindBuffer(this.context[target], buffer)
    this.context.bufferData(this.context[target], data, this.context[usage])

    this.context.bindBuffer(this.context[target], null)

    return buffer
  }

  bindBuffer(buffer: WebGLBuffer, target: Target = 'ARRAY_BUFFER'): WebGLBase {
    this.context.bindBuffer(this.context[target], buffer)

    return this
  }

  enableVertexAttrByName(attrName: string): WebGLBase {
    return this.enableVertexAttr(this.getAttrLocation(attrName))
  }

  enableVertexAttr(location: number): WebGLBase {
    this.context.enableVertexAttribArray(location)

    return this
  }

  vertexAttrPointer(
    index: number,
    size: number,
    type: number,
    normalized: boolean = false,
    stride: number = 0,
    offset: number = 0
  ): WebGLBase {
    this.context.vertexAttribPointer(
      index,
      size,
      type,
      normalized,
      stride,
      offset
    )

    return this
  }

  registerVertexAttrByName(
    attrName: string,
    stride: number,
    data: ArrayBuffer,
    type: number = this.context.FLOAT
  ): WebGLBase {
    return this.bindBuffer(this.createVbo(data))
      .enableVertexAttrByName(attrName)
      .vertexAttrPointer(this.getAttrLocation(attrName), stride, type)
  }

  private createShader(shaderSource: string, shaderType: number): WebGLShader {
    const shader: WebGLShader | null = this.context.createShader(shaderType)

    if (shader === null) {
      throw new Error('can not create shader')
    }

    this.context.shaderSource(shader, shaderSource)
    this.context.compileShader(shader)

    if (!this.context.getShaderParameter(shader, this.context.COMPILE_STATUS)) {
      throw new Error('can not compile shader')
    }

    return shader
  }
}
