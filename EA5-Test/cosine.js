var cone = (function() {
    function createVertexData() {
        // Anzahl der Vertices und Segmente definieren
        var n = 50, m = 100;
        // Anzahl der Vertices berechnen
        var numVertices = (n + 1) * (m + 1);
        // Arrays für die Vertices, Normalen und Indizes für Linien und Dreiecke erstellen
        var vertices = new Float32Array(3 * numVertices);
        var normals = new Float32Array(3 * numVertices);
        var indicesLines = new Uint16Array(2 * 2 * n * m);
        var indicesTris = new Uint16Array(3 * 2 * n * m);

        // Variablen für Schleifeninitialisierung
        var iLines = 0, iTris = 0;
        // Schrittgröße für u und v berechnen
        var du = 2 * Math.PI / n;
        var dv = 2 * Math.PI / m;

        // Offset-Werte für die Positionierung der Form festlegen
        var offsetX = +1; // X-Position
        var offsetY = 0;  // Y-Position
        var offsetZ = -1; // Z-Position

        // Schleife zur Erstellung der Vertices und Normalen
        for (var i = 0, u = -Math.PI; i <= n; i++, u += du) {
            for (var j = 0, v = -Math.PI; j <= m; j++, v += dv) {
                var iVertex = i * (m + 1) + j;

                // Vertex-Koordinaten berechnen
                var x = Math.cos(u) + offsetX;
                var y = Math.cos(v) + offsetY;
                var z = Math.cos(u + v) + offsetZ;

                // Vertex-Positionen setzen
                vertices[iVertex * 3] = x;
                vertices[iVertex * 3 + 1] = y;
                vertices[iVertex * 3 + 2] = z;

                // Normale berechnen
                var nx = -Math.cos(v) * Math.sin(u);
                var ny = -Math.cos(u) * Math.sin(v);
                var nz = Math.sin(u + v);

                // Normale setzen
                normals[iVertex * 3] = nx;
                normals[iVertex * 3 + 1] = ny;
                normals[iVertex * 3 + 2] = nz;

                // Indizes für Linien erstellen
                if (j > 0 && i > 0) {
                    indicesLines[iLines++] = iVertex - 1;
                    indicesLines[iLines++] = iVertex;
                    indicesLines[iLines++] = iVertex - (m + 1);
                    indicesLines[iLines++] = iVertex;
                }

                // Indizes für Dreiecke erstellen
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

        // Vertex-Daten setzen
        this.vertices = vertices;
        this.normals = normals;
        this.indicesLines = indicesLines;
        this.indicesTris = indicesTris;
    }

    // Die Funktion createVertexData wird zurückgegeben
    return {
        createVertexData: createVertexData
    };
})();
