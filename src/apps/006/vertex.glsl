precision mediump float;
attribute vec3 a_color;
attribute vec2 a_position;
varying vec3 theColor;
uniform vec2 u_resolution;
uniform float u_rotationAngle;

// NOTE: допустимо ли осуществлять вычисления вне main? 
// NOTE: будут ли они выполнены только при инициализации или на каждой итерации? является ли оптимизацией? или выносить вообще в js?
float a = (u_rotationAngle / 180.0) * 3.1415926;
float s = sin(a);
float c = cos(a);
mat2 m = mat2(c, s, -s, c);

vec2 translation = vec2(100.0, 100.0);

void main() {

  theColor = a_color;

  vec2 rotatedPosition = (a_position + translation)* m;

  vec2 clipSpace = (rotatedPosition / u_resolution) * 2.0;

  gl_Position = vec4(clipSpace, 0.0, 1.0);

}