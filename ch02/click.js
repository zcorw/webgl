var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' + // attribute variable
  'attribute float a_PointSize;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = a_PointSize;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';

function random(max, min = 1) {
  const n = Math.random() * max;
  return n < min ? min : n;
}

function main() {
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  const points = [];
  const colors = [];
  canvas.addEventListener('mousedown', (ev) => {
    const clientX = ev.clientX;
    const clientY = ev.clientY;
    const rect = canvas.getBoundingClientRect();
    const x = (clientX - rect.left - canvas.width / 2) / (canvas.width / 2);
    const y = (canvas.height / 2 - (clientY - rect.top)) / (canvas.height / 2);
    points.push([x, y, random(10, 5)]);
    colors.push([random(1, 0.3), random(1, 0.3), random(1, 0.3), 1.0]);
    gl.clear(gl.COLOR_BUFFER_BIT);
    const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    const a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
    const u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    points.forEach((point, i) => {
      const rgba = colors[i];
      gl.vertexAttrib2f(a_Position, point[0], point[1]);
      gl.vertexAttrib1f(a_PointSize, point[2]);
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      gl.drawArrays(gl.POINTS, 0, 1);
    })
  })
}