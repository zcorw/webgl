const VSHADER_SOURCE = 
  'attribute vec4 a_Position;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '}\n';

const FSHADER_SOURCE = 
  'precision mediump float;\n' +
  'uniform float u_Width;\n' +
  'uniform float u_Height;\n' +
  'uniform float u_Green;\n' +
  'void main() {\n' +
  '  gl_FragColor = vec4(gl_FragCoord.x/u_Width, u_Green, gl_FragCoord.y/u_Height, 1.0);\n' +
  '}\n';

function main() {
  const canvas = document.getElementById('webgl');
  const gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }
  
  const u_Width = gl.getUniformLocation(gl.program, 'u_Width');
  const u_Height = gl.getUniformLocation(gl.program, 'u_Height');
  gl.uniform1f(u_Width, gl.drawingBufferWidth);
  gl.uniform1f(u_Height, gl.drawingBufferHeight);

  let offset = 0;
  let multi = 0.3;
  let speed = 0.01;
  let increase = 0.01;
  const tick = () => {
    const u_Green = gl.getUniformLocation(gl.program, 'u_Green');
    gl.uniform1f(u_Green, multi);
    draw(gl, multi, offset);
    offset += speed;
    if (multi > 0.8) {
      increase = -0.01;
    } else if (multi < 0){
      increase = 0.01;
    }
    multi += increase;
    requestAnimationFrame(tick);
  }
  tick();
}

function draw(gl, multi, offset) {
  const n = initVertexBuffers(gl, multi, offset);
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }
  // Specify the color for clearing <canvas>
  gl.clearColor(1, 1, 1, 1);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the rectangle
  gl.drawArrays(gl.LINE_STRIP, 0, n);
}

function createSin(multi, offset, step) {
  const _point = [];
  for (let n = -1; n < 1; n += step) {
    _point.push(n);
    _point.push(Math.sin(Math.PI * (n  + offset)) * multi);
  }
  return Float32Array.from(_point);
}

function initVertexBuffers(gl, multi, offset) {
  const vertices = createSin(multi, offset, 0.01);
  const n = vertices.length / 2;

  const vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return false;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  return n;
}