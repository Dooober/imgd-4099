uniform float frame;
uniform vec2 res;
uniform vec2 mouse_pos;
uniform bool mouse_click;
uniform bool key_down;

void main() {
	vec2 p = gl_FragCoord.xy / res;
	vec2 mouse = mouse_pos.xy / res;
	vec3 color = vec3(0.0);
	if (mouse_click) {
		color.g = 1.0;
	}
	if (key_down) {
		color.g = 1.0;
	}
	gl_FragColor = vec4(abs(sin(frame/30)),color.g,mouse.x,1.0);
}