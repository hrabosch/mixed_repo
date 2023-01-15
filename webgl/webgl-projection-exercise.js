function WebGLBox(gl) {
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
    }`;

    // Fragment shader program
    const fsSource = `
    varying lowp vec4 vColor;

    void main(void) {
        gl_FragColor = vColor;
    }`;

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
    gl.useProgram(programInfo.program);

    this.positionLocation = gl.getAttribLocation(programInfo.program, "position");
    this.colorLocation = gl.getUniformLocation(programInfo.program, "color");

    // Early depth testing allows the depth test to run before the fragment shader runs. 
    // Whenever it is clear a fragment isn't going to be visible (it is behind other objects) 
    // we can prematurely discard the fragment. - https://learnopengl.com/Advanced-OpenGL/Depth-testing
    gl.enable(gl.DEPTH_TEST);
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

WebGLBox.prototype.draw = function (settings, gl) {

    const data = new Float32Array([
        settings.left,
        settings.bottom,
        settings.depth,
        settings.right,
        settings.bottom,
        settings.depth,
        settings.left,
        settings.top,
        settings.depth,

        settings.left,
        settings.top,
        settings.depth,
        settings.right,
        settings.bottom,
        settings.depth,
        settings.right,
        settings.top,
        settings.depth,
    ]);

    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    gl.enableVertexAttribArray(this.positionLocation);
    gl.vertexAttribPointer(this.positionLocation, 3, gl.FLOAT, false, 0, 0);
    gl.uniform4fv(this.colorLocation, settings.color);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
};


 // Setup the canvas and WebGL context
 const canvas = document.getElementById("myCanvas");
 const gl = canvas.getContext("webgl");

 if (gl === null) {
     alert(
         "Cannot init WebGL."
     );
 }

var box = new WebGLBox(gl);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

box.draw({
    top: 0.5,             // x
    bottom: -0.5,            // x
    left: -0.5,            // y
    right: 0.5,             // y

    depth: 0,               // z
    color: [1, 0.4, 0.4, 1] // red
}, gl);

box.draw({

    top: 0.9,             // x
    bottom: 0,               // x
    left: -0.9,            // y
    right: 0.9,             // y

    depth: 0.5,             // z
    color: [0.4, 1, 0.4, 1] // green
}, gl);

box.draw({

    top: 1,               // x
    bottom: -1,              // x
    left: -1,              // y
    right: 1,               // y

    depth: -1.5,            // z
    color: [0.4, 0.4, 1, 1] // blue
}, gl);