/**
 * x' = x * cos b - y * sin b;
 * y' = x * sin b - y * cos b;
 * z` = z;
 */
const r_VSHADER_SOURCE = 
  'attribute vec4 a_Position;\n' +
  'uniform float u_SinB, u_CosB;\n' +
  'void main() {\n' +
  '  gl_Position.x = a_Position.x * u_CosB - a_Position.y * u_SinB;\n' +
  '  gl_Position.y = a_Position.x * u_SinB + a_Position.y * u_CosB;\n' +
  '  gl_Position.z = a_Position.z;\n' +
  '  gl_Position.w = 1.0;\n' +
  '}\n';

const r_FSHADER_SOURCE = 
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
  '}\n';

// 旋转
function rotateAction(angle) {
  const radian = Math.PI * angle / 180.0;
  const cosB = Math.cos(radian);
  const sinB = Math.sin(radian);
  const canvas = document.getElementById('rotate');
  const gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  // Initialize shaders
  if (!initShaders(gl, r_VSHADER_SOURCE, r_FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  const n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  const u_CosB = gl.getUniformLocation(gl.program, 'u_CosB');
  const u_SinB = gl.getUniformLocation(gl.program, 'u_SinB');
  gl.uniform1f(u_CosB, cosB);
  gl.uniform1f(u_SinB, sinB);

  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the rectangle
  gl.drawArrays(gl.TRIANGLES, 0, n);
}