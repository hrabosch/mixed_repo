let cubeRotation = 0.0;
let deltaTime = 0;

main();

function main(){
    const canvas = document.getElementById("myCanvas");
    const gl = canvas.getContext("webgl");

    print("init")
    if (gl === null) {
        alert("Cannot init WebGL.");
        return;
    }

    // Black and full opaque
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT)

    
   // Set up the cube geometry
   const positions = [
      // Front face
      -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
  
      // Back face
      -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,
  
      // Top face
      -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,
  
      // Bottom face
      -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,
  
      // Right face
      1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,
  
      // Left face
      -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
    ];
  
 
   const indices = [
      0, 1, 2,   0, 2, 3,  // front
      4, 5, 6,   4, 6, 7,  // back
      4, 5, 1,   4, 1, 0,  // left
      7, 6, 2,   7, 2, 3,  // right
      4, 0, 3,   4, 3, 7,  // top
      5, 1, 2,   5, 2, 6   // bottom   
   ];
 
   const colors = [
      1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,  // front
      0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,  // back
      0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,  // left
      1, 1, 0,   1, 1, 0,   1, 1, 0,   1, 1, 0,  // right
      0, 1, 1,   0, 1, 1,   0, 1, 1,   0, 1, 1,  // top
      1, 0, 1,   1, 0, 1,   1, 0, 1,   1, 0, 1   // bottom
   ];

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
    vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
    vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
  },
  uniformLocations: {
    projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
    modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
  },
};

   // Set up the buffer objects
   const positionBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    
   const indexBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
   gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

   const colorBuffer = gl.createBuffer();
   gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);


drawScene(gl, programInfo);

let then = 0;

// Draw the scene repeatedly
function render(now) {
  now *= 0.001; // convert to seconds
  deltaTime = now - then;
  then = now;

  drawScene(gl, programInfo, cubeRotation);
  cubeRotation += deltaTime;

  requestAnimationFrame(render);
}
requestAnimationFrame(render);
}

function initShaderProgram(gl, vsSource, fsSource) {
   const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
   const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
 
   // Create the shader program
 
   const shaderProgram = gl.createProgram();
   gl.attachShader(shaderProgram, vertexShader);
   gl.attachShader(shaderProgram, fragmentShader);
   gl.linkProgram(shaderProgram);
 
   // If creating the shader program failed, alert
 
   if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
     alert(
       `Unable to initialize the shader program: ${gl.getProgramInfoLog(
         shaderProgram
       )}`
     );
     return null;
   }
 
   return shaderProgram;
 }
 
 function loadShader(gl, type, source) {
   const shader = gl.createShader(type);
 
   // Send the source to the shader object
 
   gl.shaderSource(shader, source);
 
   // Compile the shader program
 
   gl.compileShader(shader);
 
   // See if it compiled successfully
 
   if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
     alert(
       `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
     );
     gl.deleteShader(shader);
     return null;
   }
 
   return shader;
 }

 function drawScene(gl, programInfo, cubeRotation) {
   gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
   gl.clearDepth(1.0); // Clear everything
   gl.enable(gl.DEPTH_TEST); // Enable depth testing
   gl.depthFunc(gl.LEQUAL); // Near things obscure far things
 
   // Clear the canvas before we start drawing on it.
 
   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
 
   // Create a perspective matrix, a special matrix that is
   // used to simulate the distortion of perspective in a camera.
   // Our field of view is 45 degrees, with a width/height
   // ratio that matches the display size of the canvas
   // and we only want to see objects between 0.1 units
   // and 100 units away from the camera.
 
   const fieldOfView = (45 * Math.PI) / 180; // in radians
   const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
   const zNear = 0.1;
   const zFar = 100.0;
   const projectionMatrix = mat4.create();
 
   // note: glmatrix.js always has the first argument
   // as the destination to receive the result.
   mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);
 
   // Set the drawing position to the "identity" point, which is
   // the center of the scene.
   const modelViewMatrix = mat4.create();
 
   // Now move the drawing position a bit to where we want to
   // start drawing the square.
   mat4.translate(
     modelViewMatrix, // destination matrix
     modelViewMatrix, // matrix to translate
     [-0.0, 0.0, -6.0]
   ); // amount to translate
 
   mat4.rotate(
     modelViewMatrix, // destination matrix
     modelViewMatrix, // matrix to rotate
     cubeRotation, // amount to rotate in radians
     [0, 0, 1]
   ); // axis to rotate around (Z)
   mat4.rotate(
     modelViewMatrix, // destination matrix
     modelViewMatrix, // matrix to rotate
     cubeRotation * 0.7, // amount to rotate in radians
     [0, 1, 0]
   ); // axis to rotate around (Y)
   mat4.rotate(
     modelViewMatrix, // destination matrix
     modelViewMatrix, // matrix to rotate
     cubeRotation * 0.3, // amount to rotate in radians
     [1, 0, 0]
   ); // axis to rotate around (X)
 
   // Tell WebGL how to pull out the positions from the position
   // buffer into the vertexPosition attribute.
   setPositionAttribute(gl, programInfo);
 
   setColorAttribute(gl, programInfo);
 
   // Tell WebGL which indices to use to index the vertices
   //gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
 
   // Tell WebGL to use our program when drawing
   gl.useProgram(programInfo.program);
 
   // Set the shader uniforms
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
 
 // Tell WebGL how to pull out the positions from the position
 // buffer into the vertexPosition attribute.
 function setPositionAttribute(gl, programInfo) {
   const numComponents = 3;
   const type = gl.FLOAT; // the data in the buffer is 32bit floats
   const normalize = false; // don't normalize
   const stride = 0; // how many bytes to get from one set of values to the next
   // 0 = use type and numComponents above
   const offset = 0; // how many bytes inside the buffer to start from
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
 
 // Tell WebGL how to pull out the colors from the color buffer
 // into the vertexColor attribute.
 function setColorAttribute(gl, programInfo) {
   const numComponents = 4;
   const type = gl.FLOAT;
   const normalize = false;
   const stride = 0;
   const offset = 0;
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