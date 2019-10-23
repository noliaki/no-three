import noise3D from './glsl/noise3D.glsl'
import main from './glsl/fragment-shader.glsl'

export default [noise3D, main].join('\n')
