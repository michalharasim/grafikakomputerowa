const vertexShaderTxt = `
    precision mediump float;

    attribute vec3 vertPosition;
    attribute vec3 vertColor;

    varying vec3 fragColor;

    uniform mat4 mWorld;
    uniform mat4 mView;
    uniform mat4 mProj;

    void main()
    {
        fragColor = vertColor;
        gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);
    }
`;

const fragmentShaderTxt = `
    precision mediump float;

    varying vec3 fragColor;

    void main()
    {
        gl_FragColor = vec4(fragColor, 1.0); // R,G,B, opacity
    }
`;

const mat4 = glMatrix.mat4;


class Triangle {
  constructor() {
    this.canvas = document.getElementById("main-canvas");
    this.gl = this.canvas.getContext("webgl");

    if (!this.gl) {
      alert("WebGL not supported");
      return;
    }

    this.gl.clearColor(0.5, 0.5, 0.9, 1.0); // R,G,B, opacity
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);

    this.newProgram = this.createShader(vertexShaderTxt, fragmentShaderTxt);
    this.vBuffer = this.setVertices();
    this.iBuffer = this.setIndices();

    this.attrLocation();

    this.initializeMatrix();

    this.identityMatrix = mat4.create();
    this.loop();
  }

  attrLocation() {
    this.posAttrLocation = this.gl.getAttribLocation(
        this.newProgram,
        "vertPosition"
      );
      this.colorAttrLocation = this.gl.getAttribLocation(
        this.newProgram,
        "vertColor"
      );
  
      this.gl.useProgram(this.newProgram);
  
      this.matWorldUniformLocation = this.gl.getUniformLocation(
        this.newProgram,
        "mWorld"
      );
      this.matViewUniformLocation = this.gl.getUniformLocation(
        this.newProgram,
        "mView"
      );
      this.matProjUniformLocation = this.gl.getUniformLocation(
        this.newProgram,
        "mProj"
      );
  }

    initializeMatrix() {

    this.worldMatrix = mat4.create();
    this.viewMatrix = mat4.create();
    mat4.lookAt(this.viewMatrix, [0, 0, -10], [0, 0, 0], [0, 1, 0]);
    this.projMatrix = mat4.create();
    mat4.perspective(
      this.projMatrix,
      glMatrix.glMatrix.toRadian(45),
      this.canvas.width / this.canvas.height,
      0.1,
      1000.0
    );
    
    this.gl.uniformMatrix4fv(
        this.matWorldUniformLocation,
        false,
        this.worldMatrix
      );
  
      this.gl.uniformMatrix4fv(
        this.matViewUniformLocation,
        false,
        this.viewMatrix
      );
  
      this.gl.uniformMatrix4fv(
        this.matProjUniformLocation,
        false,
        this.projMatrix
      );
  }

  createShader(vertexShaderSource, fragmentShaderSource) {
    const vertexShader = this.loadShader(
      this.gl.VERTEX_SHADER,
      vertexShaderSource
    );
    const fragmentShader = this.loadShader(
      this.gl.FRAGMENT_SHADER,
      fragmentShaderSource
    );

    const newProgram = this.gl.createProgram();
    this.gl.attachShader(newProgram, vertexShader);
    this.gl.attachShader(newProgram, fragmentShader);
    this.gl.linkProgram(newProgram);

    return newProgram;
  }

  loadShader(type, source) {
    const myShader = this.gl.createShader(type);
    this.gl.shaderSource(myShader, source);
    this.gl.compileShader(myShader);
    return myShader;
  }

  setVertices() {
    const boxVertices = [
        // Top
        -1.0, 1.0, -1.0, 0.5, 0.5, 0.5, -1.0, 1.0, 1.0, 0.5, 0.5, 0.5, 1.0, 1.0,
        1.0, 0.5, 0.5, 0.5, 1.0, 1.0, -1.0, 0.5, 0.5, 0.5,
  
        // Left
        -1.0, 1.0, 1.0, 0.75, 0.25, 0.5, -1.0, -1.0, 1.0, 0.75, 0.25, 0.5, -1.0,
        -1.0, -1.0, 0.75, 0.25, 0.5, -1.0, 1.0, -1.0, 0.75, 0.25, 0.5,
  
        // Right
        1.0, 1.0, 1.0, 0.25, 0.25, 0.75, 1.0, -1.0, 1.0, 0.25, 0.25, 0.75, 1.0,
        -1.0, -1.0, 0.25, 0.25, 0.75, 1.0, 1.0, -1.0, 0.25, 0.25, 0.75,
  
        // Front
        1.0, 1.0, 1.0, 1.0, 0.0, 0.15, 1.0, -1.0, 1.0, 1.0, 0.0, 0.15, -1.0, -1.0,
        1.0, 1.0, 0.0, 0.15, -1.0, 1.0, 1.0, 1.0, 0.0, 0.15,
  
        // Back
        1.0, 1.0, -1.0, 0.0, 1.0, 0.15, 1.0, -1.0, -1.0, 0.0, 1.0, 0.15, -1.0,
        -1.0, -1.0, 0.0, 1.0, 0.15, -1.0, 1.0, -1.0, 0.0, 1.0, 0.15,
  
        // Bottom
        -1.0, -1.0, -1.0, 0.5, 0.5, 1.0, -1.0, -1.0, 1.0, 0.5, 0.5, 1.0, 1.0,
        -1.0, 1.0, 0.5, 0.5, 1.0, 1.0, -1.0, -1.0, 0.5, 0.5, 1.0,
      ];
    const vBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(boxVertices),
      this.gl.STATIC_DRAW
    );
    return vBuffer;
  }

  setIndices() {
    const boxIndices = [
      // Top
      0, 1, 2, 0, 2, 3,

      // Left
      5, 4, 6, 6, 4, 7,

      // Right
      8, 9, 10, 8, 10, 11,

      // Front
      13, 12, 14, 15, 14, 12,

      // Back
      16, 17, 18, 16, 18, 19,

      // Bottom
      21, 20, 22, 22, 20, 23,
    ];

    const iBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(boxIndices),
      this.gl.STATIC_DRAW
    );
    return iBuffer;
  }

  loop() {
    const loop = () => {
      const angle = (performance.now() / 240 / 8) * 2 * Math.PI;

      mat4.rotate(this.worldMatrix, this.identityMatrix, angle, [1, 2, 0]);
      this.gl.uniformMatrix4fv(
        this.matWorldUniformLocation,
        false,
        this.worldMatrix
      );

      this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vBuffer);
      this.gl.vertexAttribPointer(
        this.posAttrLocation,
        3,
        this.gl.FLOAT,
        false,
        6 * Float32Array.BYTES_PER_ELEMENT,
        0
      );
      this.gl.vertexAttribPointer(
        this.colorAttrLocation,
        3,
        this.gl.FLOAT,
        false,
        6 * Float32Array.BYTES_PER_ELEMENT,
        3 * Float32Array.BYTES_PER_ELEMENT
      );
      this.gl.enableVertexAttribArray(this.posAttrLocation);
      this.gl.enableVertexAttribArray(this.colorAttrLocation);
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.iBuffer);
      this.gl.drawElements(this.gl.TRIANGLES, 36, this.gl.UNSIGNED_SHORT, 0);

      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}