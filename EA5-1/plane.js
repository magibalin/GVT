var plane = (function() {
    // Funktion zur Erstellung der Vertex-Daten für die Ebene
    function createVertexData() {
        var n = 100; // Anzahl der Schritte für 'u'
        var m = 100; // Anzahl der Schritte für 'v'

        // Positionen der Vertices
        this.vertices = new Float32Array(3 * (n + 1) * (m + 1));
        var vertices = this.vertices;

        // Normale der Vertices
        this.normals = new Float32Array(3 * (n + 1) * (m + 1));
        var normals = this.normals;

        // Index-Daten für Linien
        this.indicesLines = new Uint16Array(2 * 2 * n * m);
        var indicesLines = this.indicesLines;

        // Index-Daten für Dreiecke
        this.indicesTris = new Uint16Array(3 * 2 * n * m);
        var indicesTris = this.indicesTris;

        // Schrittweite für 'u' und 'v'
        var du = 20 / n;
        var dv = 20 / m;

        // Counter für Einträge in den Index-Arrays
        var iLines = 0;
        var iTris = 0;

        // Schleife für 'u'
        for (var i = 0, u = -10; i <= n; i++, u += du) {
            // Schleife für 'v'
            for (var j = 0, v = -10; j <= m; j++, v += dv) {
                var iVertex = i * (m + 1) + j;

                // Setzen der Vertex-Positionen
                var x = u;
                var y = 0;
                var z = v;

                vertices[iVertex * 3] = x;
                vertices[iVertex * 3 + 1] = y;
                vertices[iVertex * 3 + 2] = z;

                // Berechnen und Setzen der Normalen
                normals[iVertex * 3] = 0;
                normals[iVertex * 3 + 1] = 1;
                normals[iVertex * 3 + 2] = 0;

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

    // Rückgabe der Methode zum Erstellen der Vertex-Daten
    return {
        createVertexData: createVertexData
    };
})();
