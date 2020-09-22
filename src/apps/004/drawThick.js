import { createProgram } from '../../misc/utils'
import vertexShaderSourceThinBorders from './vertexThinBorders.glsl'
import fragmentShaderSource from './fragment.glsl'


export default function drawThick(gl, { path, normals, thickness }) {

    const program = createProgram(gl, vertexShaderSourceThinBorders, fragmentShaderSource)
    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const lineNormalAttributeLocation = gl.getAttribLocation(program, "a_lineNormal");
    const lineMiterAttributeLocation = gl.getAttribLocation(program, "a_lineMiter");
    const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
    const colorUniformLocation = gl.getUniformLocation(program, "u_color");
    const thicknessUniformLocation = gl.getUniformLocation(program, "u_thickness");

    gl.useProgram(program);
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    gl.uniform3f(colorUniformLocation, 0.4, 0.4, 0.6);
    gl.uniform1f(thicknessUniformLocation, thickness);

    const stride = 5 * Float32Array.BYTES_PER_ELEMENT;
    const dataBuffer = gl.createBuffer();

    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, dataBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, stride, 0);

    gl.enableVertexAttribArray(lineNormalAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, dataBuffer);
    gl.vertexAttribPointer(lineNormalAttributeLocation, 2, gl.FLOAT, false, stride, 2 * Float32Array.BYTES_PER_ELEMENT);

    gl.enableVertexAttribArray(lineMiterAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, dataBuffer);
    gl.vertexAttribPointer(lineMiterAttributeLocation, 1, gl.FLOAT, false, stride, 4 * Float32Array.BYTES_PER_ELEMENT);

    const data = []
    for (let i = 0, qty = path.length; i < qty - 1; i++) {
        data.push(

            ...path[i], ...normals[i][0], normals[i][1],
            ...path[i], ...normals[i][0], -normals[i][1],
            ...path[i + 1], ...normals[i + 1][0], normals[i + 1][1],

            ...path[i], ...normals[i][0], -normals[i][1],
            ...path[i + 1], ...normals[i + 1][0], normals[i + 1][1],
            ...path[i + 1], ...normals[i + 1][0], -normals[i + 1][1],
        )
    }

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, (path.length - 1) * 6);

}