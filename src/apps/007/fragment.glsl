precision mediump float;
uniform vec2 u_resolution;
varying vec3 theColor;

void main() {
  gl_FragColor = vec4(theColor, 1.0);
}