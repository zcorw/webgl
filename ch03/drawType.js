const VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute float a_Size;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = 10.0;\n' +
  '}\n';

const FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
  '}\n';

function main() {
  const canvas = document.getElementById('webgl');
  const gl = getWebGLContext(canvas);

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }
  const n = initVertexBuffers(gl);

  const buttonList = ['points', 'line', 'line_strip', 'line_loop', 'triangles', 'triangle_strip', 'triangle_fan'];
  buttonList.forEach((id) => {
    document.getElementById(id).addEventListener('click', () => {
      switch (id) {
        case 'points':
          draw(gl, n, gl.POINTS);
          break;
        case 'line':
          draw(gl, n, gl.LINES);
          break;
        case 'line_strip':
          draw(gl, n, gl.LINE_STRIP);
          break;
        case 'line_loop':
          draw(gl, n, gl.LINE_LOOP);
          break;
        case 'triangles':
          draw(gl, n, gl.TRIANGLES);
          break;
        case 'triangle_strip':
          draw(gl, n, gl.TRIANGLE_STRIP);
          break;
        case 'triangle_fan':
          draw(gl, n, gl.TRIANGLE_FAN);
          break;
      }
    })
  })

  draw(gl, n, gl.POINTS)
}

function draw(gl, n, type) {
  gl.clearColor(0, 0, 0, 1);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the rectangle
  gl.drawArrays(type, 0, n);
}

function initVertexBuffers(gl) {
  const vertices = new Float32Array([
    -0.8, 0.5, -0.5, -0.5, -0.2, 0.5, 0.1, -0.5
  ]);
  const n = 4;

  const vertexBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // 开辟存储空间，第三个参数可选：gl.STATIC_DRAW \ gl.STREAM_DRAW \ gl.DYNAMIC_DRAW
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STREAM_DRAW);
  const a_Position = gl.getAttribLocation(gl.program, 'a_Position');

  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  return n;
}