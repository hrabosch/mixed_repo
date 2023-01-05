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

    var vertices = [
        -0.7,-0.1,0,
        -0.3,0.6,0,
        -0.3,-0.3,0,
        0.2,0.6,0,
        0.3,-0.3,0,
        0.7,0.6,0 
     ]

     
     // Buffer
     var vertex_buffer = gl.createBuffer();
     gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
     gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

     //gl.bindBuffer(gl.ARRAY_BUFFER, null);

     // Vertex
     var vertCode =
        'attribute vec3 coordinates;' +
        'void main(void) {' +
           ' gl_Position = vec4(coordinates, 1.0);' +
        '}';
     var vertShader = gl.createShader(gl.VERTEX_SHADER);

     gl.shaderSource(vertShader, vertCode);
     gl.compileShader(vertShader);

     // Fragment
     var fragCode =
        'void main(void) {' +
           'gl_FragColor = vec4(0.0, 0.0, 0.0, 0.1);' +
        '}';
     var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

     gl.shaderSource(fragShader, fragCode);
     gl.compileShader(fragShader);

     // Program to put shared and vertex together
     var shaderProgram = gl.createProgram();
     
     gl.attachShader(shaderProgram, vertShader);
     gl.attachShader(shaderProgram, fragShader);
     gl.linkProgram(shaderProgram);
     gl.useProgram(shaderProgram);

     // bind buffer to shaders
     gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

     var coord = gl.getAttribLocation(shaderProgram, "coordinates");
     gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
     gl.enableVertexAttribArray(coord);
     gl.clearColor(0.5, 0.5, 0.5, 0.9);
     gl.enable(gl.DEPTH_TEST);
     gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
     gl.viewport(0,0,canvas.width,canvas.height);
     gl.drawArrays(gl.TRIANGLE_STRIP, 0, 6);
}

