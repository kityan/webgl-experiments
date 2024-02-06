precision mediump float;
attribute vec3 a_color;
attribute vec2 a_position;
varying vec3 theColor;
uniform mat4 u_transform;

void main() {

  theColor = a_color;

  vec4 transformedPosition = u_transform * vec4(a_position.xy, 0.0, 1.0);

  float zToDivideBy = 1.0 + transformedPosition.z * 0.25;

  gl_Position = vec4(transformedPosition.xy / zToDivideBy, transformedPosition.zw);

}