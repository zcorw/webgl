/**
 * x' = x * Sx;
 * y' = y * Sy;
 * z` = z * Sz;
 */
const z_VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_xformMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position * u_xformMatrix;\n' +
  '}\n';

const z_FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
  '}\n';

// 缩放
function zoomAction(zoom) {
  const xformMatrix = new Float32Array([
    zoom, 0.0, 0.0, 0.0,
    0.0, zoom, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, 1.0,
  ]);
  const canvas = document.getElementById('zoom');
  const gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  // Initialize shaders
  if (!initShaders(gl, z_VSHADER_SOURCE, z_FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  const n = initVertexBuffers(gl);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }
  const u_xformMatrix = gl.getUniformLocation(gl.program, 'u_xformMatrix');
  gl.uniformMatrix4fv(u_xformMatrix, false, xformMatrix);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, n);
}