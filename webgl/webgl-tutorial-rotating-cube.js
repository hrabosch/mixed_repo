let cubeRotation = 0.0;
let deltaTime = 0;

main();
function main() {
  const canvas = document.getElementById("myCanvas");
  const gl = canvas.getContext("webgl");

  if (gl === null) {
    alert(
      "Cannot init WebGL."
    );
    return;
  }

  // Vertex shader program
  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;

  // Fragment shader program
  const fsSource = `
    varying lowp vec4 vColor;

    void main(void) {
      gl_FragColor = vColor;
    }
  `;

  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
      vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(
        shaderProgram,
        "uProjectionMatrix"
      ),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
    },
  };
  const buffers = initBuffers(gl);

  let then = 0;

  function render(now) {
    // TODO value from input
    now *= 0.001;
    deltaTime = now - then;
    then = now;

    drawScene(gl, programInfo, buffers, cubeRotation);
    cubeRotation += deltaTime;

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      `Cannnot init shader program: ${gl.getProgramInfoLog(
        shaderProgram
      )}`
    );
    return null;
  }

  return shaderProgram;
}

function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      `Cannot compile shaders: ${gl.getShaderInfoLog(shader)}`
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function initBuffers(gl) {
  const positionBuffer = initPositionBuffer(gl);

  const colorBuffer = initColorBuffer(gl);

  const indexBuffer = initIndexBuffer(gl);

  return {
    position: positionBuffer,
    color: colorBuffer,
    indices: indexBuffer,
  };
}

function initPositionBuffer(gl) {
  const positionBuffer = gl.createBuffer();
  const positions = [
    -1.0, -1.0, 1.0, 
    1.0, -1.0, 1.0, 
    1.0, 1.0, 1.0, 
    -1.0, 1.0, 1.0,

    -1.0, -1.0, -1.0,
    -1.0, 1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, -1.0, -1.0,

    -1.0, 1.0, -1.0,
    -1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0, -1.0,

    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0, 1.0,
    -1.0, -1.0, 1.0,

    1.0, -1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, 1.0, 1.0,
    1.0, -1.0, 1.0,

    -1.0, -1.0, -1.0,
    -1.0, -1.0, 1.0,
    -1.0, 1.0, 1.0,
    -1.0, 1.0, -1.0
  ];

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  return positionBuffer;
}

function initColorBuffer(gl) {
  const colorBuffer = gl.createBuffer();
  // TODO values from input
  // Line per Cube face
  const faceColors = [
    [0.863, 0.863, 0.863, 1.0], // Gainsboro
    [0.827, 0.827, 0.827, 1.0], // LightGrey
    [0.753, 0.753, 0.753, 1.0], // Silver
    [0.663, 0.663, 0.663, 1.0], // Dark grey
    [0.502, 0.502, 0.502, 1.0], // Gray
    [0.412, 0.412, 0.412, 1.0], // DimGray
  ];

  var colors = [];

  // Use each face color for each position of face (4 verticies)
  for (var j = 0; j < faceColors.length; ++j) {
    const c = faceColors[j];
    colors = colors.concat(c, c, c, c);
  }

  console.log(colors)
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  return colorBuffer;
}

function initIndexBuffer(gl) {
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

  // Triangles
  const indices = [
    0,1,2, 0,2,3, // front
    4,5,6, 4,6,7, // back
    8,9,10, 8,10,11, // top
    12,13,14, 12,14,15, // bottom
    16,17,18, 16,18,19, // right
    20,21,22, 20,22,23, // left
  ];
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  );

  return indexBuffer;
}

function drawScene(gl, programInfo, buffers, cubeRotation) {
  // CLean up of GL
  gl.clearColor(0.0, 0.0, 0.0, 1.0); 
  gl.clearDepth(1.0); 
  gl.enable(gl.DEPTH_TEST); 
  gl.depthFunc(gl.LEQUAL); 
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const fieldOfView = (45 * Math.PI) / 180;
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.5;
  const zFar = 1000.0;
  const projectionMatrix = mat4.create();

  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  const modelViewMatrix = mat4.create();
  
  mat4.translate(
    modelViewMatrix, 
    modelViewMatrix, 
    [-0.0, 0.0, -6.0]
  );

  // TODO value from input
  const rotationZ = 1;
  mat4.rotate(
    modelViewMatrix, 
    modelViewMatrix, 
    cubeRotation*rotationZ,
    [0, 0, 1]
  ); 

  // TODO value from input
  const rotationY = 0.6;
  mat4.rotate(
    modelViewMatrix,
    modelViewMatrix,
    cubeRotation * rotationY,
    [0, 1, 0]
  );

  // TODO value from input
  const rotationX = 0.3;
  mat4.rotate(
    modelViewMatrix,
    modelViewMatrix,
    cubeRotation * rotationX,
    [1, 0, 0]
  );

  setPositionAttribute(gl, buffers, programInfo);
  setColorAttribute(gl, buffers, programInfo);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
  gl.useProgram(programInfo.program);

  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix
  );

  {
    const vertexCount = 36;
    const type = gl.UNSIGNED_SHORT;
    const offset = 0;
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  }
}

function setPositionAttribute(gl, buffers, programInfo) {
  const numComponents = 3;
  const type = gl.FLOAT; 
  const normalize = false;
  const stride = 0;
  const offset = 0;

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
} 

function setColorAttribute(gl, buffers, programInfo) {
  const numComponents = 4;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexColor,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
}