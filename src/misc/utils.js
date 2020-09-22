import classes from './styles.scss'

function _createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }
    console.warn(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function _createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }
    console.warn(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

let _clickCallback = null

export function prepareCanvas(message, clickCallback) {
    
    const _c = document.querySelector('canvas')
    if (_c) { _c.remove() }
    const _d = document.querySelector(`div.${classes.message}`)
    if (_d) { _d.remove() }

    const canvas = document.createElement('canvas')
    document.querySelector('body').appendChild(canvas)
    const gl = canvas.getContext('webgl')
    if (!gl) { throw 'no webgl context' }
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (_clickCallback) {
        window.removeEventListener('click', _clickCallback)
        _clickCallback = null
    }
    if (clickCallback) {
        window.addEventListener('click', clickCallback)
        _clickCallback = clickCallback
    }



    if (message) {
        const div = document.createElement('div')
        div.classList.add(classes.message)
        div.innerHTML = message
        document.querySelector('body').appendChild(div)
    }

    return gl
}

export function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
    const vertexShader = _createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = _createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    return _createProgram(gl, vertexShader, fragmentShader);
}


export function createRectForFragmentExperiments(vertexShaderSource, fragmentShaderSource) {
    const gl = prepareCanvas()
    const program = createProgram(gl, vertexShaderSource, fragmentShaderSource)

    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

    gl.useProgram(program);
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);


    const positions = [
        0, 0,
        gl.canvas.width, 0,
        0, gl.canvas.height,
        0, gl.canvas.height,
        gl.canvas.width, 0,
        gl.canvas.width, gl.canvas.height,
    ];

    const positionsBuffer = gl.createBuffer();
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionsBuffer);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, positions.length / 2);

}