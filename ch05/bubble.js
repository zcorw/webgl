const VSHADER_SOURCE =
  'void main() {\n' +
  '  gl_Position = vec4(0, 0, 0, 1);\n' +
  '  gl_PointSize = 300.0;\n' +
  '}\n';
const FSHADER_SOURCE =
  'precision mediump float;\n' +
  'void main() {\n' +
  '  float d = distance(gl_PointCoord, vec2(0.5, 0.5));\n' +
  '  if (d < 0.5) {\n' +
  '    gl_FragColor = vec4(0.0, 1.0, 1.0, d / 0.5);\n' +
  '  } else {\n' +
  '    discard;\n' +
  '  }\n' +
  '}\n';

function main() {
  var canvas = document.getElementById('webgl');
  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the rectangle
  gl.drawArrays(gl.POINTS, 0, 1);
}