import { prepareCanvas, createProgram } from '../../misc/utils'
import vertexShaderSource from './vertex.glsl'
import fragmentShaderSource from './fragment.glsl'
import { createButton, setRectangle, m4, randomInt } from "./utils"


export default function () {

  const minFramesDiff = 15 // ms, для throttle
  const maxRotatedAngle = 45 // degree
  const maxTiltedAngle = 45 // degree
  const speed = 3  // degree per frame

  let rotated = false
  let tilted = false

  let currentRotatedAngle = 0
  let currentTiltedAngle = 0
  let lastFrameDts = 0 // ms

  const setRotated = v => rotated = v
  const setTitled = v => tilted = v

  const message = document.createElement('div')
  message.style.position = "absolute"
  message.style.zIndex = "20"
  message.style.display = "flex"
  message.style.gap = "10px"

  const button1 = createButton("set rotated")
  button1.addEventListener("click", e => {
    e.stopPropagation()
    setRotated(!rotated)
    button1.innerText = !rotated ? " set rotated " : "unset rotated"
  })
  message.appendChild(button1)

  const button2 = createButton("set titled")
  button2.addEventListener("click", e => {
    e.stopPropagation()
    setTitled(!tilted)
    button2.innerText = !tilted ? " set tilted " : "unset tilted"
  })
  message.appendChild(button2)


  const gl = prepareCanvas(message)
  const program = createProgram(gl, vertexShaderSource, fragmentShaderSource)

  const colorAttributeLocation = gl.getAttribLocation(program, "a_color")
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position")
  const transformUniformLocation = gl.getUniformLocation(program, "u_transform")


  gl.useProgram(program)

  const data = []
  const rectQty = 50
  for (let i = 0; i < rectQty; i++) {
    const r = Math.random(), g = Math.random(), b = Math.random()
    setRectangle(data, randomInt(300), randomInt(300), randomInt(300), randomInt(300), r, g, b)
  }

  const stride = 5 * Float32Array.BYTES_PER_ELEMENT

  const dataBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, dataBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)

  gl.enableVertexAttribArray(positionAttributeLocation)
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, stride, 0)

  gl.enableVertexAttribArray(colorAttributeLocation)
  gl.vertexAttribPointer(colorAttributeLocation, 3, gl.FLOAT, false, stride, 2 * Float32Array.BYTES_PER_ELEMENT)


  const draw = (initial) => {

    if (initial !== true && (Date.now() - lastFrameDts < minFramesDiff)) {
      // throttle
      requestAnimationFrame(draw)
      return
    }

    lastFrameDts = Date.now()

    let changed = false

    // z-rotation animation
    if (rotated && currentRotatedAngle < maxRotatedAngle) {
      currentRotatedAngle += speed
      if (currentRotatedAngle > maxRotatedAngle) { currentRotatedAngle = maxRotatedAngle }
      changed = true
    }
    if (!rotated && currentRotatedAngle > 0) {
      currentRotatedAngle -= speed
      if (currentRotatedAngle < 0) { currentRotatedAngle = 0 }
      changed = true
    }

    // x-rotation animation (tilt)
    if (tilted && currentTiltedAngle < maxTiltedAngle) {
      currentTiltedAngle += speed
      if (currentTiltedAngle > maxTiltedAngle) { currentTiltedAngle = maxTiltedAngle }
      changed = true
    }
    if (!tilted && currentTiltedAngle > 0) {
      currentTiltedAngle -= speed
      if (currentTiltedAngle < 0) { currentTiltedAngle = 0 }
      changed = true
    }    


    if (changed || initial === true) {

      const a1 = (currentRotatedAngle / 180.0) * 3.1415926
      const s1 = Math.sin(a1)
      const c1 = Math.cos(a1)

      const a2 = (currentTiltedAngle / 180.0) * 3.1415926
      const s2 = Math.sin(a2)
      const c2 = Math.cos(a2)

      const m4Rotate = [
        c1, -s1, 0, 0,
        s1, c1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1,
      ]

      const m4Tilt = [
        1, 0, 0, 0,
        0, c2, s2, 0,
        0, -s2, c2, 0,
        0, 0, 0, 1,
      ]

      const depth = 1000

      const m4Project = [
        2 / gl.canvas.width, 0, 0, 0,
        0, 2 / gl.canvas.height, 0, 0,
        0, 0, 2 / depth, 0,
        0, 0, 0, 1,
      ]


      const m = m4.multiply(m4Project, m4.multiply(m4Tilt, m4Rotate))

      gl.uniformMatrix4fv(transformUniformLocation, false, m)

      gl.drawArrays(gl.TRIANGLES, 0, data.length / 5)
    }

    requestAnimationFrame(draw)

  }

  draw(true)

}



