uniform vec2 res;
uniform float frame;
uniform bool mouse_click;
uniform bool key_down;

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

void main() {
    vec2 p = gl_FragCoord.xy/res.xy;
    vec3 color = vec3(0.1, p.x, p.y);
    float s = frame/20.0;

    // Large waves
    float n = max(0., noise(vec2(s, p.y*0.4)) - 0.5) * 1.5;

    // Small waves
    n += (noise(vec2(s*10., p.y*5.))) * 0.15;

    // Apply noise
    float xpos = p.x - n * n * 0.25;
    if (mouse_click || key_down) {
        color = mix(color, vec3(xpos, p.x, p.y), 0.3);
        color = mix(color, vec3(random(vec2(p.y*frame))), n*0.3);    
    }
    
    gl_FragColor = vec4(color,1.);
}