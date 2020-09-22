  precision mediump float;
  attribute vec3 a_color;
  attribute vec2 a_position;
  varying vec3 theColor;
  uniform vec2 u_resolution;

  void main() {

    vec2 zeroToOne = a_position / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
    theColor = a_color;

    gl_Position = vec4(clipSpace * vec2(1, -1), 0.0, 1.0);
  }