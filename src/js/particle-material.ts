import { ShaderMaterial, TextureLoader } from 'three'
import vertexShader from './vertex-shader'
import fragmentShader from './fragment-shader'
// import { loadTexture } from './helper'

export default new ShaderMaterial({
  uniforms: {
    uTime: { type: 'f', value: 1.0 },
    uTexture1: { type: 't', value: new TextureLoader().load('./cat-1.jpg') },
    uTexture2: { type: 't', value: new TextureLoader().load('./cat-2.jpg') },
    uTextureMap: { type: 't', value: new TextureLoader().load('./cloud.png') }
  },
  vertexShader,
  fragmentShader,
  lights: false
})
