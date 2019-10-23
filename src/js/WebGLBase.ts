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

    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight

    this.context = (this.canvas.getContext('webgl') ||
      this.canvas.getContext('experimental-webgl')) as WebGLRenderingContext

    this.context.clearColor(0.0, 0.0, 0.0, 1.0)
    this.context.clearDepth(1.0)

    this.context.clear(
      this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT
    )
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

  createProgram(): WebGLBase {
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

  setBufferData(data: Float32Array): WebGLBuffer {
    const buffer: WebGLBuffer | null = this.context.createBuffer()

    if (buffer === null) {
      throw new Error('can not create Buffer')
    }

    this.context.bindBuffer(this.context.ARRAY_BUFFER, buffer)
    this.context.bufferData(
      this.context.ARRAY_BUFFER,
      data,
      this.context.STATIC_DRAW
    )

    this.context.bindBuffer(this.context.ARRAY_BUFFER, null)

    return buffer
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
