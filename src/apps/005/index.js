import { prepareCanvas, createProgram } from '../../misc/utils'
import vertexShaderSource from './vertex.glsl'
import fragmentShaderSource from './fragment.glsl'


export default function () {

  const gl = prepareCanvas()
  const program = createProgram(gl, vertexShaderSource, fragmentShaderSource)

  const colorAttributeLocation = gl.getAttribLocation(program, "a_color")
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position")
  const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution")
  const rotationAngleUniformLocation = gl.getUniformLocation(program, "u_rotationAngle")


  gl.useProgram(program)
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height)

  const data = [
    0, 0, 
      1, 0, 0, // 1st - red
    0, 150, 
      0, 1, 0, // 2nd - green
    250, 0,
       0, 0, 1, // 3rd - blue
  ]

  const stride = 5 * Float32Array.BYTES_PER_ELEMENT

  const dataBuffer = gl.createBuffer()
  gl.enableVertexAttribArray(positionAttributeLocation)
  gl.bindBuffer(gl.ARRAY_BUFFER, dataBuffer)
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, stride, 0)

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)

  gl.enableVertexAttribArray(colorAttributeLocation)
  gl.vertexAttribPointer(colorAttributeLocation, 3, gl.FLOAT, false, stride, 2 * Float32Array.BYTES_PER_ELEMENT)
  gl.bindBuffer(gl.ARRAY_BUFFER, dataBuffer)


  let angle = 0
  const draw = () => {
    angle = angle < 360 ? angle + 1 : 0
    gl.uniform1f(rotationAngleUniformLocation, angle)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
    requestAnimationFrame(draw)
  }

  draw()

}

