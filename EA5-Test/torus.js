var torus = (function() {
    // Funktion zur Erstellung der Vertex-Daten für den Torus
    function createVertexData() {
        var n = 16; // Anzahl der Schritte für 'u'
        var m = 32; // Anzahl der Schritte für 'v'

        // Positionen der Vertices
        this.vertices = new Float32Array(3 * (n + 1) * (m + 1));
        var vertices = this.vertices;

        // Normalen der Vertices
        this.normals = new Float32Array(3 * (n + 1) * (m + 1));
        var normals = this.normals;

        // Index-Daten für Linien
        this.indicesLines = new Uint16Array(2 * 2 * n * m);
        var indicesLines = this.indicesLines;

        // Index-Daten für Dreiecke
        this.indicesTris = new Uint16Array(3 * 2 * n * m);
        var indicesTris = this.indicesTris;

        // Schrittweiten für 'u' und 'v'
        var du = 2 * Math.PI / n;
        var dv = 2 * Math.PI / m;
        var r = 0.3; // Radius des Torus
        var R = 0.5; // Großer Radius des Torus

        // Counter für Einträge in den Index-Arrays
        var iLines = 0;
        var iTris = 0;

        // Offset-Werte für Positionierung
        var offsetX = -0.8; // X-Position
        var offsetY = 0;    // Y-Position
        var offsetZ = 1;    // Z-Position

        // Schleife für Winkel 'u'
        for (var i = 0, u = 0; i <= n; i++, u += du) {
            // Schleife für Winkel 'v'
            for (var j = 0, v = 0; j <= m; j++, v += dv) {
                var iVertex = i * (m + 1) + j;

                // Berechnung der Vertex-Positionen
                var x = (R + r * Math.cos(u)) * Math.cos(v) + offsetX;
                var y = (R + r * Math.cos(u)) * Math.sin(v) + offsetY;
                var z = r * Math.sin(u) + offsetZ;

                // Setzen der Vertex-Positionen
                vertices[iVertex * 3] = x;
                vertices[iVertex * 3 + 1] = y;
                vertices[iVertex * 3 + 2] = z;

                // Berechnung und Setzen der Normalen
                var nx = Math.cos(u) * Math.cos(v);
                var ny = Math.cos(u) * Math.sin(v);
                var nz = Math.sin(u);
                normals[iVertex * 3] = nx;
                normals[iVertex * 3 + 1] = ny;
                normals[iVertex * 3 + 2] = nz;

                // Setzen der Indizes für Linien
                if (j > 0 && i > 0) {
                    indicesLines[iLines++] = iVertex - 1;
                    indicesLines[iLines++] = iVertex;
                    indicesLines[iLines++] = iVertex - (m + 1);
                    indicesLines[iLines++] = iVertex;
                }

                // Setzen der Indizes für Dreiecke
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

    // Rückgabe der Methode zum Erstellen der Vertex-Daten für den Torus
    return {
        createVertexData: createVertexData
    };
})();
