import noise3D from './glsl/noise3D.glsl'
import main from './glsl/fragment-shader.glsl'

export default ['precision mediump float;', noise3D, main].join('\n')
