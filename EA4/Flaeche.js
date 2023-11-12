 // Das Canvas- und WebGL-Rendering-Kontext abrufen
 var canvas = document.getElementById('canvas3');
 var gl = canvas.getContext('experimental-webgl');

 // Überprüfen, ob WebGL unterstützt wird
 if (!gl) {
   console.error('WebGL-Initialisierung fehlgeschlagen. Ihr Browser unterstützt es möglicherweise nicht.');
 }

 // WebGL-Rendering-Konfiguration einrichten
 gl.clearColor(0.95, 0.95, 0.95, 1);
 gl.frontFace(gl.CCW);
 gl.enable(gl.CULL_FACE);
 gl.cullFace(gl.BACK);

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

 // Fragment-Shader-Quellcode zum Zeichnen von Linien
 var fsLinesSource = `
   precision mediump float;
   varying vec4 color;

   void main() {
     // Linienfarbe: Flieder
     gl_FragColor = vec4(0.8, 0.6, 0.8, 1.0);
   }
 `;

 // Vertex- und Fragment-Shaders erstellen und kompilieren
 var vs = gl.createShader(gl.VERTEX_SHADER);
 gl.shaderSource(vs, vsSource);
 gl.compileShader(vs);

 var fsLines = gl.createShader(gl.FRAGMENT_SHADER);
 gl.shaderSource(fsLines, fsLinesSource);
 gl.compileShader(fsLines);

 // Programm für das Zeichnen von Linien erstellen und verlinken
 var progLines = gl.createProgram();
 gl.attachShader(progLines, vs);
 gl.attachShader(progLines, fsLines);
 gl.linkProgram(progLines);

 // Datenarrays für Vertices und Linien-Indices erstellen
 var vertices, indicesLines;
 createVertexData();

 // WebGL-Buffer für Vertex-Positionen erstellen und Daten übergeben
 var vboPos = gl.createBuffer();
 gl.bindBuffer(gl.ARRAY_BUFFER, vboPos);
 gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

 // Attributposition für Position abrufen und aktivieren
 var posAttrib = gl.getAttribLocation(progLines, 'pos');
 gl.vertexAttribPointer(posAttrib, 3, gl.FLOAT, false, 0, 0);
 gl.enableVertexAttribArray(posAttrib);

 // Attributposition für Farbe abrufen
 var colAttrib = gl.getAttribLocation(progLines, 'col');

 // WebGL-Buffer für Linien-Indices erstellen und Daten übergeben
 var iboLines = gl.createBuffer();
 gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboLines);
 gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indicesLines, gl.STATIC_DRAW);
 iboLines.numberOfElements = indicesLines.length;

 // Canvas löschen
 gl.clear(gl.COLOR_BUFFER_BIT);

 // Linien zeichnen
 gl.useProgram(progLines);
 gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboLines);
 gl.drawElements(gl.LINES, iboLines.numberOfElements, gl.UNSIGNED_SHORT, 0);

 // Funktion zum Erstellen von Vertex-Daten für eine parametrische Fläche
 function createVertexData() {
   var n = 10;
   var m = 90;
   vertices = new Float32Array(3 * (n + 1) * (m + 1));
   indicesLines = new Uint16Array(2 * 2 * n * m);

   var iLines = 0;

   for (var i = 0, u = 0; i <= n; i++, u += Math.PI / n) {
     for (var j = 0, v = 0; j <= m; j++, v += Math.PI / m) {
       var iVertex = i * (m + 1) + j;

       var x = Math.cos(v) * Math.sqrt(Math.abs(Math.sin(2 * u))) * Math.cos(u);
       var y = Math.cos(v) * Math.sqrt(Math.abs(Math.cos(2 * u))) * Math.sin(u);
       var z = x * x - y * y + 2 * x * y * Math.tan(v);

       vertices[iVertex * 3] = x;
       vertices[iVertex * 3 + 1] = y;
       vertices[iVertex * 3 + 2] = z;

       if (j > 0 && i > 0) {
         indicesLines[iLines++] = iVertex - 1;
         indicesLines[iLines++] = iVertex;
         indicesLines[iLines++] = iVertex - (m + 1);
         indicesLines[iLines++] = iVertex;
       }
     }
   }
 }