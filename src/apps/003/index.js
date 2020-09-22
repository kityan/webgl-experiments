import { prepareCanvas, createProgram, createRectForFragmentExperiments } from '../../misc/utils'
import vertexShaderSource from './vertex.glsl'
import fragmentShaderSource from './fragment.glsl'


export default function () {

  createRectForFragmentExperiments(vertexShaderSource, fragmentShaderSource)
  
}

