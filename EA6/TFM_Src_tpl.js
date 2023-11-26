var app = (function () {

    var gl;

    // Das Shader-Programm-Objekt wird auch verwendet, um Attribut- und Uniform-Positionen zu speichern.
    var prog;

    // Array von Modell-Objekten.
    var models = [];

    // Das Modell, auf das die Benutzereingabe abzielt.
    var interactiveModel;

	var animationRunning = true; // Variable, um den Animationsstatus zu verfolgen
	var animationSpeed = 0.01; // Geschwindigkeit der Animation
var updateInterval = 20; // Zeitintervall für die Aktualisierung der Kugelpositionen 

    var camera = {
        // Anfangsposition der Kamera.
        eye: [0, 1, 4],
        // Punkt, auf den geschaut wird.
        center: [0, 0, 0],
        // Roll- und Pitchwinkel der Kamera.
        up: [0, 1, 0],
        // Öffnungswinkel in Bogenmaß gegeben.
        // Bogenmaß = Grad*2*PI/360.
        fovy: 60.0 * Math.PI / 180,
        // Abmessungen der Kamera-Nähebene:
        // Wert für links, rechts, oben, unten in der Projektion.
        lrtb: 2.0,
        // Ansichtsmatrix.
        vMatrix: mat4.create(),
        // Projektionsmatrix.
        pMatrix: mat4.create(),
        // Projektionstypen: ortho, perspective, frustum.
        projectionType: "perspective",
        // Winkel zur Z-Achse der Kamera beim Umrunden des Zentrums
        // gegeben in Bogenmaß.
        zAngle: 0,
        // Abstand in der XZ-Ebene vom Zentrum beim Umrunden.
        distance: 4,
    };
	function start() {
		init();
     	render();
		
	}
	
	function initKeyboardEvents() {
		window.onkeydown = function(evt) {
			var key = evt.which ? evt.which : evt.keyCode;
			var c = String.fromCharCode(key);
			// Überprüfen Sie, ob die gedrückte Taste "k" ist
			if (c === 'K') {
                toggleAnimation();
            }
		};
	}

	function toggleAnimation() {
        animationRunning = !animationRunning;
    }

    function init() {
        initWebGL();
        initShaderProgram();
        initUniforms();
        initModels();
		initKeyboardEvents(); // Fügen Sie die Tastaturereignis-Initialisierung hinzu
        initPipline();
    }

    function initWebGL() {
        // Canvas und WebGL-Kontext abrufen.
        canvas = document.getElementById('canvas');
        gl = canvas.getContext('experimental-webgl');
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    }
	
	var scaleFactor = 2; // Faktor, um die Szene zu vergrößern
    /**
     * Pipeline-Parameter initialisieren, die sich nicht mehr ändern werden.
     * Wenn sich die Projektion oder der Viewport ändert, muss ihre Einrichtung in der Render-Funktion erfolgen.
     */
    function initPipline() {
        gl.clearColor(.95, .95, .95, 1);

        // Backface-Culling.
        gl.frontFace(gl.CCW);
        gl.enable(gl.CULL_FACE);
        gl.cullFace(gl.BACK);

        // Tiefen(Z)-Buffer.
        gl.enable(gl.DEPTH_TEST);

        // Polygon-Offset der gerasterten Fragmente.
        gl.enable(gl.POLYGON_OFFSET_FILL);
        gl.polygonOffset(0.5, 0);

        // Viewport einstellen.
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

        // Kamera initialisieren.
        // Seitenverhältnis der Projektion festlegen.
        camera.aspect = gl.viewportWidth / gl.viewportHeight;
    }

	function initShaderProgram() {
		// Init vertex shader.
		var vs = initShader(gl.VERTEX_SHADER, "vertexshader");
		// Init fragment shader.
		var fs = initShader(gl.FRAGMENT_SHADER, "fragmentshader");
		// Link shader into a shader program.
		prog = gl.createProgram();
		gl.attachShader(prog, vs);
		gl.attachShader(prog, fs);
		gl.bindAttribLocation(prog, 0, "aPosition");
		gl.linkProgram(prog);
		gl.useProgram(prog);
	}

	/**
	 * Create and init shader from source.
	 * 
	 * @parameter shaderType: openGL shader type.
	 * @parameter SourceTagId: Id of HTML Tag with shader source.
	 * @returns shader object.
	 */
	function initShader(shaderType, SourceTagId) {
		var shader = gl.createShader(shaderType);
		var shaderSource = document.getElementById(SourceTagId).text;
		gl.shaderSource(shader, shaderSource);
		gl.compileShader(shader);
		if(!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			console.log(SourceTagId + ": " + gl.getShaderInfoLog(shader));
			return null;
		}
		return shader;
	}

	function initUniforms() {
		// Projection Matrix.
		prog.pMatrixUniform = gl.getUniformLocation(prog, "uPMatrix");

		// Model-View-Matrix.
		prog.mvMatrixUniform = gl.getUniformLocation(prog, "uMVMatrix");
		
	}

	function initModels() {
        // fillstyle
        var fs = "fillwireframe";
        createModel("torus", fs, [0, 0, 0], [0, 0, 0], [2, 2, 2]);
        createModel("plane", "wireframe",  [0, -.8, 0], [0, 0, 0], 
            [4, 4, 4]);
        createModel("sphere", fs, [1, -.3, -1], [0, 0, 0], 
            [.3, .3, .3]);
        createModel("sphere", fs, [-1, -.3, -1], [0, 0, 0], 
            [.2, .2, .2]);
        createModel("sphere", fs, [1, -.3, 1], [0, 0, 0], 
            [.3, .3, .3]);
        createModel("sphere", fs, [-1, -.3, 1], [0, 0, 0], 
            [.2, .2, .2]);
    
			
        // Select one model that can be manipulated interactively by user.
        interactiveModel = models[0];



 // Hier füge die Funktion updateSpherePositions() hinzu
 setInterval(updateSpherePositions, 15); // 100 FPS - Du kannst die Zeitintervalle anpassen
 setInterval(updateSpherePositions2, 15); // 100 FPS - Du kannst die Zeitintervalle anpassen




    }



// Platz für die Funktion updateSpherePositions()
var animationAngle = 10; // Winkel für die Animationsberechnung
var radius = 1.1; // Radius der Kreisbahnen
var animationSpeed = 0.0025; // Geschwindigkeit der Animation
var sphereDistance = 2; // Abstand zwischen den Kugeln


function updateSpherePositions() {
	if (animationRunning) {
		animationAngle += animationSpeed;

		var torusCenter = [0.2, 0.7, 0.2]; // Zentrum des Torus

		for (var i = 2; i < models.length; i++) {
			var offset = (i - 2) * Math.PI / 1; // Versatz für jede Kugel	
		
			var z = torusCenter[2];
			var x = torusCenter[0] + radius * Math.cos(animationAngle + offset);
			var y = torusCenter[1] + radius * Math.sin(animationAngle + offset);
			
			
			models[i].translate = [y + 0.5, z, x];
		}
}

}

function updateSpherePositions2() {
	if (animationRunning) {
		animationAngle += animationSpeed;

		var torusCenter = [0.2, 0.7, 0.2]; // Zentrum des Torus

		for (var i = 4; i < models.length; i++) {
			var offset = (i - 2) * Math.PI / 1; // Versatz für jede Kugel
		
			var z = torusCenter[2];
			var x = torusCenter[0] + radius * Math.sin(animationAngle + offset);
			var y = torusCenter[1] + radius * Math.cos(animationAngle + offset);
			models[i].translate = [y - 1.5, z, x];

			

			
		}
}

}

function init() {
	initWebGL();
	initShaderProgram();
	initUniforms();
	initModels();
	initPipline();
	initKeyboardEvents(); // Tastaturereignis-Initialisierung hinzugefügt
}






	/**
	 * Create model object, fill it and push it in models array.
	 * 
	 * @parameter geometryname: string with name of geometry.
	 * @parameter fillstyle: wireframe, fill, fillwireframe.
	 */
	function createModel(geometryname, fillstyle, translate, rotate, scale) {
		var model = {};
		model.fillstyle = fillstyle;
		initDataAndBuffers(model, geometryname);
		initTransformations(model, translate, rotate, scale);

		models.push(model);
	}

	/**
	 * Set scale, rotation and transformation for model.
	 */
	function initTransformations(model, translate, rotate, scale) {
		// Store transformation vectors.
		model.translate = translate;
		model.rotate = rotate;
		model.scale = scale;

		// Create and initialize Model-Matrix.
		model.mMatrix = mat4.create();

		// Create and initialize Model-View-Matrix.
		model.mvMatrix = mat4.create();
	}

	/**
	 * Init data and buffers for model object.
	 * 
	 * @parameter model: a model object to augment with data.
	 * @parameter geometryname: string with name of geometry.
	 */
	function initDataAndBuffers(model, geometryname) {
		// Provide model object with vertex data arrays.
		// Fill data arrays for Vertex-Positions, Normals, Index data:
		// vertices, normals, indicesLines, indicesTris;
		// Pointer this refers to the window.
		this[geometryname]['createVertexData'].apply(model);

		// Setup position vertex buffer object.
		model.vboPos = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, model.vboPos);
		gl.bufferData(gl.ARRAY_BUFFER, model.vertices, gl.STATIC_DRAW);
		// Bind vertex buffer to attribute variable.
		prog.positionAttrib = gl.getAttribLocation(prog, 'aPosition');
		gl.enableVertexAttribArray(prog.positionAttrib);

		// Setup normal vertex buffer object.
		model.vboNormal = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, model.vboNormal);
		gl.bufferData(gl.ARRAY_BUFFER, model.normals, gl.STATIC_DRAW);
		// Bind buffer to attribute variable.
		prog.normalAttrib = gl.getAttribLocation(prog, 'aNormal');
		gl.enableVertexAttribArray(prog.normalAttrib);

		// Setup lines index buffer object.
		model.iboLines = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboLines);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, model.indicesLines, 
			gl.STATIC_DRAW);
		model.iboLines.numberOfElements = model.indicesLines.length;
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

		// Setup triangle index buffer object.
		model.iboTris = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboTris);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, model.indicesTris, 
			gl.STATIC_DRAW);
		model.iboTris.numberOfElements = model.indicesTris.length;
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
	}

	function initEventHandler() {
		// Rotation step.
		var deltaRotate = Math.PI / 36;
		var deltaTranslate = 0.05;

		

		window.onkeydown = function(evt) {
			var key = evt.which ? evt.which : evt.keyCode;
			var c = String.fromCharCode(key);
			// console.log(evt);
			// Use shift key to change sign.
			var sign = evt.shiftKey ? -1 : 1;

			

			// Change projection of scene.
		  // Rotate interactive Model.
		  switch(c) {
			case('X'):
				interactiveModel.rotate[0] += sign * deltaRotate;
				break;
			case('Y'):
				interactiveModel.rotate[1] += sign * deltaRotate;
				break;
			case('Z'):
				interactiveModel.rotate[2] += sign * deltaRotate;
				break;
			}
			// Camera move and orbit.
			switch(c) {
				case('C'):
					// Orbit camera.
					camera.zAngle += sign * deltaRotate;
					break;
				case('H'):
					// Move camera up and down.
					camera.eye[1] += sign * deltaTranslate;
					break;
				case('D'):
					// Camera distance to center.
					camera.distance += sign * deltaTranslate;
					break;
				case('V'):
					// Camera fovy in radian.
					camera.fovy += sign * 5 * Math.PI / 180;
					break;
				case('B'):
					// Camera near plane dimensions.
					camera.lrtb += sign * 0.1;
					break;
			}
			// Render the scene again on any key pressed.
			render();
		};
	}

	/**
	 * Run the rendering pipeline.
	 */
	function render() {
		// Clear framebuffer and depth-/z-buffer.
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		setProjection();

		calculateCameraOrbit();

		// Set view matrix depending on camera.
		mat4.lookAt(camera.vMatrix, camera.eye, camera.center, camera.up);

		// Loop over models.
		for(var i = 0; i < models.length; i++) {
			// Update modelview for model.
			updateTransformations(models[i]);

			// Set uniforms for model.
			gl.uniformMatrix4fv(prog.mvMatrixUniform, false, models[i].mvMatrix);
			
			draw(models[i]);

			if (animationRunning) {
				// Wenn die Animation läuft, führen Sie die Aktualisierung der Kugelpositionen durch
				updateSpherePositions();
				updateSpherePositions2();
				
			}

		}

		requestAnimationFrame(render);

	}

	function calculateCameraOrbit() {
		// Calculate x,z position/eye of camera orbiting the center.
		var x = 0, z = 2;
		camera.eye[x] = camera.center[x];
		camera.eye[z] = camera.center[z];
		camera.eye[x] += camera.distance * Math.sin(camera.zAngle);
		camera.eye[z] += camera.distance * Math.cos(camera.zAngle);
	}

	function setProjection() {
		// Set projection Matrix.
		switch(camera.projectionType) {
			case("ortho"):
				var v = camera.lrtb;
				mat4.ortho(camera.pMatrix, -v, v, -v, v, -10, 10);
				break;
			case("frustum"):
				var v = camera.lrtb;
				mat4.frustum(camera.pMatrix, -v/2, v/2, -v/2, v/2, 1, 10);
				break;
			case("perspective"):
				mat4.perspective(camera.pMatrix, camera.fovy, 
					camera.aspect, 1, 10);
				break;
		}
		// Set projection uniform.
		gl.uniformMatrix4fv(prog.pMatrixUniform, false, camera.pMatrix);
	}

	/**
	 * Update model-view matrix for model.
	 */
	function updateTransformations(model) {
	
		// Use shortcut variables.
		var mMatrix = model.mMatrix;
		var mvMatrix = model.mvMatrix;
		
		//mat4.copy(mvMatrix, camera.vMatrix);		***********************************************
// Reset matrices to identity.         
mat4.identity(mMatrix);
mat4.identity(mvMatrix);

 // Translate.
 mat4.translate(mMatrix, mMatrix, model.translate);
 // Rotate.
 mat4.rotateX(mMatrix, mMatrix, model.rotate[0]);
 mat4.rotateY(mMatrix, mMatrix, model.rotate[1]);
 mat4.rotateZ(mMatrix, mMatrix, model.rotate[2]);
 // Scale
 mat4.scale(mMatrix, mMatrix, model.scale);

 

  // Combine view and model matrix
        // by matrix multiplication to mvMatrix.        
        mat4.multiply(mvMatrix, camera.vMatrix, mMatrix);

	
		

	}

	function draw(model) {
		// Setup position VBO.
		gl.bindBuffer(gl.ARRAY_BUFFER, model.vboPos);
		gl.vertexAttribPointer(prog.positionAttrib, 3, gl.FLOAT, false, 
			0, 0);

		// Setup normal VBO.
		gl.bindBuffer(gl.ARRAY_BUFFER, model.vboNormal);
		gl.vertexAttribPointer(prog.normalAttrib, 3, gl.FLOAT, false, 0, 0);

		// Setup rendering tris.
		var fill = (model.fillstyle.search(/fill/) != -1);
		if(fill) {
			gl.enableVertexAttribArray(prog.normalAttrib);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboTris);
			gl.drawElements(gl.TRIANGLES, model.iboTris.numberOfElements, 
				gl.UNSIGNED_SHORT, 0);
		}

		// Setup rendering lines.
		var wireframe = (model.fillstyle.search(/wireframe/) != -1);
		if(wireframe) {
			gl.disableVertexAttribArray(prog.normalAttrib);
			gl.vertexAttrib3f(prog.normalAttrib, 0, 0, 0);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.iboLines);
			gl.drawElements(gl.LINES, model.iboLines.numberOfElements, 
				gl.UNSIGNED_SHORT, 0);
		}
	}

	// App interface.
	return {
		start : start
	}

}());