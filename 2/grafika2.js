



const vertexShaderTxt = `
    precision mediump float;

    attribute vec2 vertPosition;
    attribute vec3 vertColor;

    varying vec3 fragColor;

    void main() {
        fragColor = vertColor;
        gl_Position = vec4(vertPosition, 0.0, 1.0);
    }

`

const fragmentShaderTxt = `
    precision mediump float;
    varying vec3 fragColor;
    void main() {
        gl_FragColor = vec4(fragColor, 1.0); // R,G,B, opacity
    }
`


let Triangle = function() {
    let canvas = document.getElementById('main-canvas');
    let gl = canvas.getContext('webgl');
    if (!gl) {
        alert('webgl not supported');
    }

    gl.clearColor(0.5, 0.9, 0.9, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let vertexShader = gl.createShader(gl.VERTEX_SHADER);
    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderTxt);
    gl.shaderSource(fragmentShader, fragmentShaderTxt);

    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    let program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    gl.detachShader(program, vertexShader);
    gl.detachShader(program, fragmentShader);

    gl.validateProgram(program);

    let hexagonVert = [        // X, Y        
    0.0, 0.5,   1.0, 0.0, 0.0,        
    -0.43, 0.25,     1.0, 1.0, 0.0,        
    -0.43, -0.25,   0.0, 1.0, 0.0,        
    0.0, -0.5, 0.0,  1.0, 1.0,        
    0.43, -0.25, 0.0,    0.0, 1.0,        
    0.43, 0.25, 1.0,    0.0, 1.0,    ];



    const triangleVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(hexagonVert), gl.STATIC_DRAW);


    const posAttrLocation = gl.getAttribLocation(program, 'vertPosition');
    const colorAttrLocation = gl.getAttribLocation(program, 'vertColor');

    gl.vertexAttribPointer(
        posAttrLocation,
        2,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        0
    );

    gl.vertexAttribPointer(
        colorAttrLocation,
        3,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,
        2 * Float32Array.BYTES_PER_ELEMENT,
    );

    gl.enableVertexAttribArray(colorAttrLocation);
    gl.enableVertexAttribArray(posAttrLocation);


    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 6);

    const colorBtn = document.querySelector("#btn");
    colorBtn.addEventListener("click", change);

    function change() {

    const randomColor = [Math.random(), Math.random(), Math.random()];

    let hexagonVert = [
        // X, Y
        0.0, 0.5,   ...randomColor,       
        -0.43, 0.25,     ...randomColor,       
        -0.43, -0.25,   ...randomColor,        
        0.0, -0.5,  ...randomColor,       
        0.43, -0.25,     ...randomColor,       
        0.43, 0.25,    ...randomColor,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(hexagonVert), gl.STATIC_DRAW);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 6);
    }


}