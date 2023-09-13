@fragment 
fn fs( @builtin(position) pos : vec4f ) -> @location(0) vec4f {
  var p : vec2f = -1. + (pos.xy / res) * 2.;
  var color: vec4f = vec4f(0.);

  // Oscillator
  let sec = frame / 60.;
  let freq = .5;
  let eq = sin(sec*freq)*.5; // sin = 1

  // Relative mouse pos
  let pMouse: mat2x2<f32> = mat2x2(p.x, p.y, mouse.x, mouse.y);
  let det = determinant(pMouse); // determinant = 2
  let invDet = determinant(transpose(pMouse)); // transpose = 3

  let size = det*invDet*0.1;

  // Audio effect
  let pAudio = vec3f(p.x, 0., p.y);
  let cr = cross(pAudio, audio); // cross = 4
  let len = length(cr); // length = 5
  let isqrt = inverseSqrt(len); // inverseSqrt = 6
  let audioEffect = trunc(cos(isqrt)); // cos = 7, trunc = 8

  // Creating the space effect
  p *= 70. - circle(p*10., abs(eq*100.)); // abs = 9
  p = fract(p); // fract = 10

  // Red
  color.x = circle(p, size);

  // Green
  p.x += eq;
  color.y = circle(p, 0.005);

  // Blue
  p.y += eq;
  color.z = circle(p, audioEffect);
  
  
  return color;
}

fn circle(_p: vec2f, _radius: f32) -> f32{
    let l = _p-vec2f(0.5);
    return 1.-smoothstep(_radius-(_radius*0.01), // smoothstep = 11
                         _radius+(_radius*0.01),
                         dot(l,l)*4.0); // dot = 12
}
