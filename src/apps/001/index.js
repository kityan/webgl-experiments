import { prepareCanvas, createProgram } from '../../misc/utils'
import vertexShaderSource from './vertex.glsl'
import fragmentShaderSource from './fragment.glsl'


export default function () {

  const gl = prepareCanvas()
  const program = createProgram(gl, vertexShaderSource, fragmentShaderSource)

  const colorAttributeLocation = gl.getAttribLocation(program, "a_color");
  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

  gl.useProgram(program);
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);


  const data = []

  const rectQty = 50
  for (let i = 0; i < rectQty; i++) {
    const r = Math.random(), g = Math.random(), b = Math.random()
    setRectangle(data, randomInt(300), randomInt(300), randomInt(300), randomInt(300), r, g, b);
  }

  const stride = 5 * Float32Array.BYTES_PER_ELEMENT;

  const dataBuffer = gl.createBuffer();
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, dataBuffer);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, stride, 0);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

  gl.enableVertexAttribArray(colorAttributeLocation);
  gl.vertexAttribPointer(colorAttributeLocation, 3, gl.FLOAT, false, stride, 2 * Float32Array.BYTES_PER_ELEMENT);
  gl.bindBuffer(gl.ARRAY_BUFFER, dataBuffer);

  gl.drawArrays(gl.TRIANGLES, 0, 6 * rectQty);
  
}



function randomInt(range) {
  return Math.floor(Math.random() * range);
}

function setRectangle(positions, x, y, width, height, r, g, b) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
  positions.push(
    x1, y1, r, g, b,
    x2, y1, r, g, b,
    x1, y2, r, g, b,
    x1, y2, r, g, b,
    x2, y1, r, g, b,
    x2, y2, r, g, b
  )
}