import noise3D from './glsl/noise3D.glsl'
import main from './glsl/fragment-shader.glsl'
import easing from './glsl/easing.glsl'

// export default ['precision mediump float;', easing, noise3D, main].join('\n')
export default `
precision mediump float;
${easing}
${noise3D}
${main}
`
