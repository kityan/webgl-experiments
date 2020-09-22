// на основе: https://github.com/mattdesl/three-line-2d/blob/master/shaders/basic.js
precision mediump float;

uniform float u_thickness;
uniform vec2 u_resolution;
attribute float a_lineMiter;
attribute vec2 a_lineNormal;
attribute vec2 a_position;

void main() {
    vec2 zeroToOne = a_position / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;  
    clipSpace = clipSpace + vec2(
      a_lineNormal.x * ((-u_thickness / u_resolution.x)) * a_lineMiter,
      a_lineNormal.y * ((-u_thickness / u_resolution.y)) * a_lineMiter
    );
    gl_Position = vec4(clipSpace * vec2(1, -1), 0.0, 1.0);
}