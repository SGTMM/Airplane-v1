uniform float time;
uniform float toggle;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

void main(){
    vec3 baseColor = vec3(0.05,0.2,0.01);
    vec3 topColor = vec3(0.5,0.5,0.1);
    vec3 colorSmooth = mix(baseColor, topColor, vUv.y + time); 
    gl_FragColor = vec4(colorSmooth, 1.0);
}

