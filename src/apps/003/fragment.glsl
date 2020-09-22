  precision mediump float;
  uniform vec2 u_resolution;


  float plot2(vec2 st, float yValue){
  return  smoothstep( yValue-0.005, yValue, st.y) -
          0.9 * smoothstep( yValue, yValue+0.005, st.y);
}


  void main() {

    vec2 st = (2.0 * gl_FragCoord.xy/u_resolution) - 1.0;

    float yValue = -3.0 * pow(st.x,2.0);
    float v = plot2(st,yValue);
    vec3 color = v*vec3(0.0, 1.0, 0.0);

    gl_FragColor = vec4(color, 1.0);    

  }