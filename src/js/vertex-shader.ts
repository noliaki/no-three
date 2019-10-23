import noise3D from './glsl/noise3D.glsl'
import hsvToRgb from './glsl/hsvToRgb.glsl'
import rotate3d from './glsl/rotate3d.glsl'
import main from './glsl/vertex-shader.glsl'

export default [noise3D, hsvToRgb, rotate3d, main].join('\n')
