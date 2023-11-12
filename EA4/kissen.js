var canvas = document.getElementById('canvas1');
var gl = canvas.getContext('experimental-webgl');

// WebGL-Initialisierung überprüfen
if (!gl) {
  console.error('WebGL-Initialisierung fehlgeschlagen. Ihr Browser unterstützt es möglicherweise nicht.');
}

// WebGL-Konfiguration
gl.clearColor(0.95, 0.95, 0.95, 1); // Hintergrundfarbe setzen
gl.frontFace(gl.CCW); // Gesichtsausrichtung im Uhrzeigersinn
gl.enable(gl.CULL_FACE); // Backface Culling aktivieren
gl.cullFace(gl.BACK); // Backfaces entfernen

// Vertex-Shader-Quellcode
var vsSource = `
  attribute vec3 pos;
  attribute vec4 col;
  varying vec4 color;

  void main() {
    color = col;
    gl_Position = vec4(0.5 * pos, 1.0);
  }
`;

// Fragment-Shader-Quellcode
var fsSource = `
  precision mediump float;
  varying vec4 color;

  void main() {
    gl_FragColor = color;
  }
`;

// Fragment-Shader-Quellcode für die Farbfüllung (Rosafarbe)
var fsColorSource = `
  precision mediump float;
  varying vec4 color;

  void main() {
    // Rosafarbe für die Füllung
    gl_FragColor = vec4(1.0, 0.5, 0.8, 1.0);
  }
`;

// Fragment-Shader-Quellcode für die Linienfarbe (Königsblau)
var fsLineSource = `
  precision mediump float;
  varying vec4 color;

  void main() {
    // Königsblaue Farbe für die Linien
    gl_FragColor = vec4(0.0, 0.22, 0.66, 1.0);
  }
`;

// WebGL-Shader erstellen und kompilieren
var vs = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vs, vsSource);
gl.compileShader(vs);

var fs = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fs, fsSource);
gl.compileShader(fs);

var fsColor = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fsColor, fsColorSource);
gl.compileShader(fsColor);

var fsLine = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fsLine, fsLineSource);
gl.compileShader(fsLine);

// WebGL-Shaderprogramme erstellen und verknüpfen
var prog = gl.createProgram();
gl.attachShader(prog, vs);
gl.attachShader(prog, fs);
gl.linkProgram(prog);
gl.useProgram(prog);

var progColor = gl.createProgram();
gl.attachShader(progColor, vs);
gl.attachShader(progColor, fsColor);
gl.linkProgram(progColor);

var progLine = gl.createProgram();
gl.attachShader(progLine, vs);
gl.attachShader(progLine, fsLine);
gl.linkProgram(progLine);

var isFilled = false;

var vertices, indicesLines, indicesTris;
createVertexData();

var vboPos = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vboPos);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

var posAttrib = gl.getAttribLocation(prog, 'pos');
gl.vertexAttribPointer(posAttrib, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(posAttrib);

var colAttrib = gl.getAttribLocation(prog, 'col');

var iboLines = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboLines);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicesLines, gl.STATIC_DRAW);
iboLines.numberOfElements = indicesLines.length;

var iboTris = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboTris);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicesTris, gl.STATIC_DRAW);
iboTris.numberOfElements = indicesTris.length;

gl.clear(gl.COLOR_BUFFER_BIT);

drawLines();

var toggleButton1 = document.getElementById('toggleButton1');
toggleButton1.addEventListener('click', function() {
    window.location.href = 'https://magibalin.github.io/GVT/Links/EA4aKissen.html';  // Link setzen
    isFilled = false;  // Variable zurücksetzen
    drawLines();  // Linien zeichnen
});

function drawLines() {
  if (isFilled) {
    gl.useProgram(progLine);
  } else {
    gl.useProgram(prog);
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboLines);
  gl.drawElements(gl.LINES, iboLines.numberOfElements, gl.UNSIGNED_SHORT, 0);
}

function drawFilled() {
  gl.useProgram(progColor);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboTris);
  gl.drawElements(gl.TRIANGLES, iboTris.numberOfElements, gl.UNSIGNED_SHORT, 0);
}

function createVertexData() {
  var n = 80;
  var m = 50;
  vertices = new Float32Array(3 * (n + 1) * (m + 1));
  indicesLines = new Uint16Array(2 * 2 * n * m);
  indicesTris = new Uint16Array(3 * 2 * n * m);

  var a = 0.2; // Konstante für das Aussehen des Drops

  var iLines = 0;
  var iTris = 0;

  for (var i = 0, u = -Math.PI / 2; i <= n; i++, u += Math.PI / n) {
    for (var j = 0, v = 0; j <= m; j++, v += 2 * Math.PI / m) {
      var iVertex = i * (m + 1) + j;

      var x = Math.cos(v) * Math.sin(u);
      var y = Math.sin(v) * Math.cos(u);
      var z = Math.cos(u - a);

      vertices[iVertex * 3] = x;
      vertices[iVertex * 3 + 1] = y;
      vertices[iVertex * 3 + 2] = z;

      if (j > 0 && i > 0) {
        indicesLines[iLines++] = iVertex - 1;
        indicesLines[iLines++] = iVertex;
        indicesLines[iLines++] = iVertex - (m + 1);
        indicesLines[iLines++] = iVertex;
      }

      if (j > 0 && i > 0) {
        indicesTris[iTris++] = iVertex;
        indicesTris[iTris++] = iVertex - 1;
        indicesTris[iTris++] = iVertex - (m + 1);

        indicesTris[iTris++] = iVertex - 1;
        indicesTris[iTris++] = iVertex - (m + 1) - 1;
        indicesTris[iTris++] = iVertex - (m + 1);
      }
    }
  }
}
