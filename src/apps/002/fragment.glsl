  precision mediump float;
  uniform vec2 u_resolution;

/* 
  float plot(vec2 st) {    
      //return 1.0 - step(0.0025, abs(st.y - st.x));
      return smoothstep(0.005, 0.0, abs(st.y - st.x));
      
  }

  float plot2(vec2 st, float pct){
  return  smoothstep( pct-0.005, pct, st.y) -
          smoothstep( pct, pct+0.005, st.y);
  return  step( pct, st.y) ;
}
 */

  void main() {

    vec2 st = (2.0 * gl_FragCoord.xy/u_resolution) - 1.0;
    
    /*  
      float pct = plot(st);
      vec3 color = vec3(pct);
	    gl_FragColor = vec4(color,1.0)*vec4(0,1,0,1);    
     */

/*     float y = pow(st.x,0.5);
    float pct = plot2(st,y);
    vec3 color = pct*vec3(0.0,1.0,0.0); */


    // gl_FragColor = vec4(color,1.0)*vec4(0,1,0,1);    

    float c =  
        smoothstep(0.49, 0.5, sqrt(st.x * st.x + st.y * st.y))
       - smoothstep(0.7, 0.71, sqrt(st.x * st.x + st.y * st.y));

/*      c =  
        step(0.5, sqrt(st.x * st.x + st.y * st.y))
       - step(0.51, sqrt(st.x * st.x + st.y * st.y));        */

    gl_FragColor = vec4(0,c,0,1);
    
    /* gl_FragColor = vec4(0, 
      smoothstep(0.005, 0.0, st.x)
      ,0,1);     */


  }