function Sphere(recDepth) {
    this.vertexBuffer = gl.createBuffer();
    this.colorBuffer = gl.createBuffer();
    this.elemBuffer = gl.createBuffer();
    this.vertices = [];
    this.colors = [];
    this.lines= [];

    this.changeRecursion(recDepth);
}

// Berechnung der Eckpunkte für die gegebene Rekursionstiefe
Sphere.prototype.changeRecursion = function(newRecDepth) {
    this.vertices = [];
    this.colors = [];
    this.lines= [];

    var cubeV = [
        vec3.fromValues( 1.0,  1.0,  1.0), // Vorderseite oben rechts
        vec3.fromValues(-1.0, -1.0,  1.0), // Vorderseite unten links
        vec3.fromValues(-1.0,  1.0, -1.0), // Hinterseite oben links
        vec3.fromValues( 1.0, -1.0, -1.0)  // Hinterseite unten rechts
    ];

    // Basispunkte auf Einheitskugel normieren
    vec3.normalize(cubeV[0], cubeV[0]);
    vec3.normalize(cubeV[1], cubeV[1]);
    vec3.normalize(cubeV[2], cubeV[2]);
    vec3.normalize(cubeV[3], cubeV[3]);

    // Beginn der Rekursion für grundlegende Flächen
    this.recursion(newRecDepth, cubeV[0], cubeV[2], cubeV[1]);
    this.recursion(newRecDepth, cubeV[1], cubeV[0], cubeV[3]);
    this.recursion(newRecDepth, cubeV[3], cubeV[0], cubeV[2]);
    this.recursion(newRecDepth, cubeV[2], cubeV[3], cubeV[1]);

    // Berechnung von Farben in Bezug auf die Punktposition
    for(var i = 0; i < this.vertices.length; i += 3){
        this.colors.push((this.vertices[i  ] + 1) / 2);
        this.colors.push((this.vertices[i+1] + 1) / 2);
        this.colors.push((this.vertices[i+2] + 1) / 2);
        this.colors.push(1.0);
    }

    // Buffer an shaderProgram binden
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
    this.vertexBuffer.itemSize = 3;
    this.vertexBuffer.numItems = this.vertices.length / 3;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);
    this.colorBuffer.itemSize = 4;
    this.colorBuffer.numItems = this.colors.length / 4;

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elemBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.lines), gl.STATIC_DRAW);
}

// Unterteilung eines Dreiecks in vier Dreiecke
Sphere.prototype.recursion = function(depth, v1, v2, v3){
    // Abbruch der Rekursion und Speichern des endgültigen Dreiecks
    if (depth === 0){
        var i = this.vertices.length/3;
        this.lines.push(i, i+1, i+1, i+2, i+2, i);

        this.vertices.push(v1[0],v1[1],v1[2],
                           v2[0],v2[1],v2[2],
                           v3[0],v3[1],v3[2]
                          );
        return;
    }

    // Berechnung des Mittelpunkts zwischen zwei Punkten
    var s1 = this.calcMidPoint(v2, v3);
    var s2 = this.calcMidPoint(v1, v3);
    var s3 = this.calcMidPoint(v1, v2);

    // Rekursion für die neuen Unterdreiecke starten
    this.recursion(depth-1, s1, s3, s2);
    this.recursion(depth-1, s3, v1, s2);
    this.recursion(depth-1, s2, v3, s1);
    this.recursion(depth-1, s1, v2, s3);
}

// Berechnung des Mittelpunkts zwischen zwei Punkten
Sphere.prototype.calcMidPoint = function(a, b) {
    var result = [];
    result[0] = a[0] + b[0]; ///2;
    result[1] = a[1] + b[1]; ///2;
    result[2] = a[2] + b[2]; ///2;
    vec3.normalize(result, result);
    return result;
};

// Zeichnen der Kugel
Sphere.prototype.draw = function() {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, this.colorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // Umschalten zwischen Vollansicht und Drahtgitteransicht
    if(wireFrames) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elemBuffer);
        gl.drawElements(gl.LINES, this.lines.length, gl.UNSIGNED_SHORT,0);
    }else{
        gl.drawArrays(gl.TRIANGLES, 0, this.vertexBuffer.numItems);
    }
}
