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
    0, 100,
    0, 1, 0, // 2nd - green
    100, 0,
    0, 0, 1, // 3rd - blue
    100, 100,
    1, 0, 0, // 3rd - blue
    0, 100,
    0, 1, 0, // 3rd - blue
    100, 0,
    0, 0, 1, // 3rd - blue
  ]

  //   var width = 100;
  //   var height = 150;
  //   var thickness = 30;
  //   let x = 0
  //   let y = 0

  //   const _data = [
  //     // left column
  //     x, y,
  //     x + thickness, y,
  //     x, y + height,
  //     x, y + height,
  //     x + thickness, y,
  //     x + thickness, y + height,

  //     // top rung
  //     x + thickness, y,
  //     x + width, y,
  //     x + thickness, y + thickness,
  //     x + thickness, y + thickness,
  //     x + width, y,
  //     x + width, y + thickness,

  //     // middle rung
  //     x + thickness, y + thickness * 2,
  //     x + width * 2 / 3, y + thickness * 2,
  //     x + thickness, y + thickness * 3,
  //     x + thickness, y + thickness * 3,
  //     x + width * 2 / 3, y + thickness * 2,
  //     x + width * 2 / 3, y + thickness * 3,
  // ]

  // const data = []

  // for (let i = 0; i < _data.length; i+=2) {
  //   // координаты литеры F из примера https://webglfundamentals.org/webgl/lessons/webgl-2d-translation.html в системе с нулем top-left
  //   data.push(_data[i], -_data[i+1], 0.5,0.5,0.8)

  // }

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
    gl.drawArrays(gl.TRIANGLES, 0, data.length / 5)
    requestAnimationFrame(draw)
  }

  draw()

}

