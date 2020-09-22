import { createProgram } from '../../misc/utils'
import vertexShaderSourceThin from './vertexThin.glsl'
import fragmentShaderSource from './fragment.glsl'

export default function drawThin(gl, { path }) {

    const program = createProgram(gl, vertexShaderSourceThin, fragmentShaderSource)
    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    const colorUniformLocation = gl.getUniformLocation(program, "u_color");

    gl.useProgram(program);
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    gl.uniform3f(colorUniformLocation, 1, 1, 1);

    const line = path.flat()
    const dataBuffer = gl.createBuffer();
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, dataBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(line), gl.STATIC_DRAW);
    gl.drawArrays(gl.LINE_STRIP, 0, line.length / 2);

}