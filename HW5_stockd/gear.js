  //Besides my own gear, i am using; gear_modelAdib, gear_modelHeimbuch,
  //gordongear, and alex_gear_model.

//stocksettGear currently set to copper.

//Changes made to gear_ model, class name changed to stocksettGear,
//Accepts a value [numTeeth] reprosenting the nuber of teeth on the gear,
//[numSpokes] reprosents (0 <= number of spokes <= 2x num teeth) spokes,
//rgb is a 3 adress array to change the rgb values for the grar parts.

//flyout comments are next to variables to chenge these values.

main();


function main() {

	const canvas = document.querySelector('#glcanvas');
	const gl = canvas.getContext('webgl', {antialias: true}  );

	// If we don't have a GL context, give up now
	if (!gl) {
		alert('Unable to initialize WebGL. Your browser or machine may not support it.');
		return;
	}


	var angle_x = 0;
	var angle_y = 0;
	var angle_z = 0;
	var look_x = 0;
	var look_y = 0;
	var look_z = 0;
	var inc = .08;
	var time = 0;
	var dim = 0;


	// Vertex shader program, runs on GPU, once per vertex

	const vsSource = `
			precision mediump int;
	precision mediump float;

	// Scene transformations
	uniform mat4 u_PVM_transform; // Projection, view, model transform
	uniform mat4 u_VM_transform;  // View, model transform

	// Light model
	uniform vec3 u_Light_position;
	uniform vec3 u_Light_color;
	uniform float u_Shininess;
	uniform vec3 u_Ambient_color;

	// Original model data
	attribute vec3 a_Vertex;
	attribute vec3 a_Color;
	attribute vec3 a_Vertex_normal;

	// Data (to be interpolated) that is passed on to the fragment shader
	varying vec3 v_Vertex;
	varying vec4 v_Color;
	varying vec3 v_Normal;

	void main() {

		// Perform the model and view transformations on the vertex and pass this
		// location to the fragment shader.
		v_Vertex = vec3( u_VM_transform * vec4(a_Vertex, 1.0) );

		// Perform the model and view transformations on the vertex's normal vector
		// and pass this normal vector to the fragment shader.
		v_Normal = vec3( u_VM_transform * vec4(a_Vertex_normal, 0.0) );

		// Pass the vertex's color to the fragment shader.
		v_Color = vec4(a_Color, 1.0);

		// Transform the location of the vertex for the rest of the graphics pipeline
		gl_Position = u_PVM_transform * vec4(a_Vertex, 1.0);
	}
	`;

	// Fragment shader program, runs on GPU, once per potential pixel

	const fsSource = `
			precision mediump int;
	precision mediump float;

	// Light model
	uniform vec3 u_Light_position;
	uniform vec3 u_Light_color;
	uniform float u_Shininess;
	uniform vec3 u_Ambient_color;

	// Data coming from the vertex shader
	varying vec3 v_Vertex;
	varying vec4 v_Color;
	varying vec3 v_Normal;

	void main() {

		vec3 to_light;
		vec3 vertex_normal;
		vec3 reflection;
		vec3 to_camera;
		float cos_angle;
		vec3 diffuse_color;
		vec3 specular_color;
		vec3 ambient_color;
		vec3 color;

		// Calculate the ambient color as a percentage of the surface color
		ambient_color = u_Ambient_color * vec3(v_Color);

		// Calculate a vector from the fragment location to the light source
		to_light = u_Light_position - v_Vertex;
		to_light = normalize( to_light );

		// The vertex's normal vector is being interpolated across the primitive
		// which can make it un-normalized. So normalize the vertex's normal vector.
		vertex_normal = normalize( v_Normal );

		// Calculate the cosine of the angle between the vertex's normal vector
		// and the vector going to the light.
		cos_angle = dot(vertex_normal, to_light);
		cos_angle = clamp(cos_angle, 0.0, 1.0);

		// Scale the color of this fragment based on its angle to the light.
		diffuse_color = vec3(v_Color) * cos_angle;

		// Calculate the reflection vector
		reflection = 2.0 * dot(vertex_normal,to_light) * vertex_normal - to_light;

		// Calculate a vector from the fragment location to the camera.
		// The camera is at the origin, so negating the vertex location gives the vector
		to_camera = -1.0 * v_Vertex;

		// Calculate the cosine of the angle between the reflection vector
		// and the vector going to the camera.
		reflection = normalize( reflection );
		to_camera = normalize( to_camera );
		cos_angle = dot(reflection, to_camera);
		cos_angle = clamp(cos_angle, 0.0, 1.0);
		cos_angle = pow(cos_angle, u_Shininess);

		// The specular color is from the light source, not the object
		if (cos_angle > 0.0) {
			specular_color = u_Light_color * cos_angle;
			diffuse_color = diffuse_color * (1.0 - cos_angle);
		} else {
			specular_color = vec3(0.0, 0.0, 0.0);
		}

		color = ambient_color*u_Light_color + diffuse_color*u_Light_color + specular_color*u_Light_color;

		gl_FragColor = vec4(color, v_Color.a);
	}
	`;
	// Initialize a shader program; this is where all 
	// the lighting for the objects, if any, is established.
	const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

	// Tell WebGL to use our program when drawing
	gl.useProgram(shaderProgram);

	// Collect all the info needed to use the shader program.
	// Look up locations of attributes and uniforms used by
	// our shader program  
	const programInfo = {
			program: shaderProgram,
			locations: {
		a_Vertex: gl.getAttribLocation(shaderProgram, 'a_Vertex'),
		a_Color: gl.getAttribLocation(shaderProgram, 'a_Color'),
		a_Vertex_normal: gl.getAttribLocation(shaderProgram, 'a_Vertex_normal'),

		u_VM_transform: gl.getUniformLocation(shaderProgram, 'u_VM_transform'),
		u_Light_position: gl.getUniformLocation(shaderProgram, 'u_Light_position'),
		u_Light_color: gl.getUniformLocation(shaderProgram, 'u_Light_color'), 
		u_Shininess: gl.getUniformLocation(shaderProgram, 'u_Shininess'),

		u_PVM_transform: gl.getUniformLocation(shaderProgram, 'u_PVM_transform'), 
		u_Ambient_color: gl.getUniformLocation(shaderProgram, 'u_Ambient_color'), 

	},
	};

	// add an event handler so we can interactively rotate the model
	document.addEventListener('keydown', 

			function key_event(event) {

		if(event.keyCode == 37) {   //left
			angle_y -= 3;
		} else if(event.keyCode == 38) {  //top
			angle_x -= 3;
		} else if(event.keyCode == 39) {  //right
			angle_y += 3;
		} else if(event.keyCode == 40) {  //bottom
			angle_x += 3;
		} else if(event.keyCode == 70 && inc < 1) {  //bottom
			inc += .02;
		}else if(event.keyCode == 83 && inc > .04) {  //bottom
			inc -= .02;
		}else if(event.keyCode == 98) {  //bottom
			look_y -= .2;
		}else if(event.keyCode == 100) {  //bottom
			look_x -= .2;
		}else if(event.keyCode == 102) {  //bottom
			look_x += .2;
		}else if(event.keyCode == 104) {  //bottom
			look_y += .2;
		}else if(event.keyCode == 96) {  //bottom
			look_z -= .2;
		}else if(event.keyCode == 101) {  //bottom
			look_z += .2;
		}

		drawScene(gl, programInfo, buffersCollection, angle_x, angle_y);
		return false;
	})

    var numTeeth = 20;    //tooth count
	var numSpokes = 4;    //spokes
	var rgb = [.7,.7,.7]; //color

	// build the object(s) we'll be drawing, put the data in buffers
	const buffers = initBuffers(gl,programInfo, stocksettGear(numTeeth, numSpokes, rgb));
	const buffers1 = initBuffers(gl,programInfo, stocksettGear(numTeeth/2, numTeeth, [.5,.5,.5]));
	const buffers2 = initBuffers(gl,programInfo, keroGear(numTeeth, 8));
	const buffers3 = initBuffers(gl,programInfo, nheimb(numTeeth, numSpokes));
	const buffers4 = initBuffers(gl,programInfo, gordonGear(20, 7, 1, 0.2));
	const buffers5 = initBuffers(gl,programInfo, alexGear(numTeeth/2, numSpokes));
	
	const buffers6 = initBuffers(gl,programInfo, stocksettGear(numTeeth/2, numTeeth, [.6,.6,.7]));
	const buffers7 = initBuffers(gl,programInfo, stocksettGear(numTeeth*2, numTeeth, [.6,.6,.7]));
	const buffers8 = initBuffers(gl,programInfo, gordonGear(numTeeth*2, 7, 1, 0.2));
    const buffers9 = initBuffers(gl,programInfo, alexGear(numTeeth*2, numSpokes));
	const buffers10 =  initBuffers(gl,programInfo, stocksettGear(numTeeth*2, numSpokes*2, [.5,.5,.5]));//big
    const buffers11 = initBuffers(gl,programInfo, keroGear(numTeeth*2, 8));
	const buffers12 = initBuffers(gl,programInfo, keroGear(numTeeth*2, 8));
    const buffers13 = initBuffers(gl,programInfo, nheimb(numTeeth*4, numSpokes*2));
    const buffers14 = initBuffers(gl,programInfo, nheimb(numTeeth*4, numSpokes*2));
    const buffers15 = initBuffers(gl,programInfo, stocksettGear(13, numSpokes, rgb));
    const buffers16 = initBuffers(gl,programInfo, gordonGear(numTeeth/2, 7, 1, 0.2));
    const buffers17 = initBuffers(gl,programInfo, floor(numTeeth, numTeeth*2));

	buffersCollection = {};
	buffersCollection.gear = buffers;
	buffersCollection.gear1 = buffers1;
	buffersCollection.gear2 = buffers2;
	buffersCollection.gear3 = buffers3;
	buffersCollection.gear4 = buffers4;
	buffersCollection.gear5 = buffers5;
	buffersCollection.gear6 = buffers6;
	buffersCollection.gear7 = buffers7;
	buffersCollection.gear8 = buffers8;
	buffersCollection.gear9 = buffers9;
	buffersCollection.gear10 = buffers10;
	buffersCollection.gear11 = buffers11;
	buffersCollection.gear12 = buffers12;
    buffersCollection.gear13 = buffers13;
	buffersCollection.gear14 = buffers14;
	buffersCollection.gear15 = buffers15;
	buffersCollection.gear16 = buffers16;
	buffersCollection.gear17 = buffers17;




	//enableAttributes(gl,buffers,programInfo)

	// Draw the scene
	

self.animate = function () {
	angle_z+=inc*13;
	time+=inc*dim;
	if (time > 100) {//Begain while moving code.
		time = 0;
	}

	if (dim < 1) {
		dim += .002;
	} else { //Start then move code.

//			time+=inc;
//	if (time > 100) {
//		time = 0;
	
	}

   drawScene(gl, programInfo, buffersCollection, angle_x, angle_y, angle_z,look_x,look_y,look_z,time,dim);

      requestAnimationFrame(self.animate);
    
  };
animate();
}

//
// initBuffers
//
// Initialize the buffers we'll need. For this demo, we just
// have one object -- a simple two-dimensional square.
//
function initBuffers(gl,programInfo, gearData) {                   //<------------change values here

	var numTeeth = 20;    //tooth count
	var numSpokes = 4;    //spokes
	var rgb = [.5,.4,.0]; //color


	//gearData = stocksettGear(numTeeth, numSpokes);
	vertices = gearData[0];
	colors = gearData[1]; 
	normals = gearData[2]; 

	// Create  buffers for the object's vertex positions
	const vertexBuffer = gl.createBuffer();

	// Select the positionBuffer as the one to apply buffer
	// operations to from here out.
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

	// Now pass the list of vertices to the GPU to build the
	// shape. We do this by creating a Float32Array from the
	// JavaScript array, then use it to fill the current buffer.
	gl.bufferData(gl.ARRAY_BUFFER,
			new Float32Array(vertices),
			gl.STATIC_DRAW);


	// do likewise for colors
	const colorBuffer = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);  

	gl.bufferData(gl.ARRAY_BUFFER,
			new Float32Array(colors),
			gl.STATIC_DRAW); 


	const normalBuffer = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);  

	gl.bufferData(gl.ARRAY_BUFFER,
			new Float32Array(normals),
			gl.STATIC_DRAW);                               

	return {
		// each vertex in buffer has 3 floats
		num_vertices: vertices.length / 3,
		vertex: vertexBuffer,
		color: colorBuffer,
		normal: normalBuffer
	};

}



function enableAttributes(gl,buffers,programInfo) { 

	const numComponents = 3;
	const type = gl.FLOAT;
	const normalize = false;
	const stride = 0;
	const offset = 0;

	// Tell WebGL how to pull vertex positions from the vertex
	// buffer. These positions will be fed into the shader program's
	// "a_vertex" attribute.

	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertex);
	gl.vertexAttribPointer(
			programInfo.locations.a_Vertex,
			numComponents,
			type,
			normalize,
			stride,
			offset);
	gl.enableVertexAttribArray(
			programInfo.locations.a_Vertex);


	// likewise connect the colors buffer to the "a_color" attribute
	// in the shader program
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
	gl.vertexAttribPointer(
			programInfo.locations.a_Color,
			numComponents,
			type,
			normalize,
			stride,
			offset);
	gl.enableVertexAttribArray(
			programInfo.locations.a_Color);  

	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
	gl.vertexAttribPointer(
			programInfo.locations.a_Vertex_normal,
			numComponents,
			type,
			normalize,
			stride,
			offset);
	gl.enableVertexAttribArray(
			programInfo.locations.a_Vertex_normal);          

}


//
// Draw the scene.
//
function drawScene(gl, programInfo, buffersCollection, angle_x, 
angle_y, angle_z, look_x, look_y,look_z,time,dim) {
	gl.clearColor(0, 0, 0, 1);  // Clear to white, fully opaque
	gl.clearDepth(1.0);                 // Clear everything
	gl.enable(gl.DEPTH_TEST);           // Enable depth testing
	gl.depthFunc(gl.LEQUAL);  
	          // Near things obscure far things

	// Clear the canvas before we start drawing on it.

	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


	//make transform to implement interactive rotation


	var matrix = new Learn_webgl_matrix();
	var pvm_transform = matrix.create();
	var lookat = matrix.create();
	var translate = matrix.create();
	var rotate_x_matrix = matrix.create();
	var rotate_y_matrix = matrix.create();
	var rotate_z_matrix = matrix.create();
	var transform = matrix.create(); 
	var scale = matrix.create();


var camera_location = [0+look_x,-1+look_y,-2];
//var camera_location = [0,0,0];

var control_points = [
                         [1, -1,   0],
                         [0, 40,   11],
                         [-8, 35, 20],
                         [1, -1,  0],                                                                           
                       ];


function weight(time) {
       return [  Math.pow(1-time,3), 3*Math.pow(1-time,2)*time, 3*(1-time)*Math.pow(time,2), Math.pow(time,3) ];
   }

   weights = weight(time/100);
   
   for (cp = 0; cp < 4; cp++ ) {
         
         camera_location[0] += weights[cp] * control_points[cp][0];
         camera_location[1] += weights[cp] * control_points[cp][1];
         camera_location[2] += weights[cp] * control_points[cp][2];

   }                     //replace eye and at with theese values to debug.
                         

	matrix.lookAt(lookat, camera_location[0],camera_location[1],camera_location[2],
	                    // 0+look_x,-1+look_y,-2, 
	                    // 0+look_x,10+look_y,-3,
	                    
	                     0,25,-3,
	                     0,1,0);

	var proj = matrix.createFrustum(-1,1,-1,1,1,9000);

//self.drawHeelper = function(transform,pvm_transform, proj, lookat,
//			rotate_x_matrix, rotate_y_matrix,translate, rotate_z_matrix, scale, buffers) {

self.drawHeelper = function(transform,pvm_transform, proj, lookat,
			tx,ty,tz,rx,ry,rz,sx,sy,sz, buffers) {
				 enableAttributes(gl,buffers,programInfo);
	matrix.translate(translate, tx, ty, tz);
	matrix.rotate(rotate_x_matrix, rx, 1, 0, 0);
	matrix.rotate(rotate_y_matrix, ry, 0, 1, 0);
	matrix.rotate(rotate_z_matrix, rz, 0, 0,-1);
	matrix.scale(scale,sx,sy,sz);

	matrix.multiplySeries(pvm_transform, proj, lookat,
			rotate_x_matrix, rotate_y_matrix,translate, rotate_z_matrix, scale);
	// Combine the two rotations into a single transformation
	matrix.multiplySeries(transform, lookat,
			rotate_x_matrix, rotate_y_matrix,translate, rotate_z_matrix, scale);
	// Set the shader program's uniform
	gl.uniformMatrix4fv(programInfo.locations.u_VM_transform, 
			false, transform);
	gl.uniformMatrix4fv(programInfo.locations.u_PVM_transform, 
			false, pvm_transform);    
    { // now tell the shader (GPU program) to draw some triangles
		const offset = 0;
		gl.drawArrays(gl.TRIANGLES, offset, buffers.num_vertices);
	}
				
			};
 

	gl.uniform3f(programInfo.locations.u_Light_position, -3, 0, -2.0); //<------------------change values here

	gl.uniform3f(programInfo.locations.u_Light_color, dim,  dim, dim);

	gl.uniform3f(programInfo.locations.u_Ambient_color, .1,  .1, .1);

	gl.uniform1f(programInfo.locations.u_Shininess, 64.0);

self.gearFactory = function(add_x, add_y, add_z, rot_x, rot_y, flag) {
   
   ////////////////////////////////gear 

   if (flag == 1) {
   	buffers = buffersCollection.gear;
    enableAttributes(gl,buffers,programInfo);

	drawHeelper(transform,pvm_transform, proj, lookat,
    -1 +add_x, .0+add_y, -.1+add_z,angle_x+rot_x,angle_y+rot_y,
    angle_z*4, 0.2,0.2,0.2, buffers);	
   } 
	///////////////////////////////gear 1


     buffers = buffersCollection.gear1;

    enableAttributes(gl,buffers,programInfo);
	
	drawHeelper(transform,pvm_transform, proj, lookat,
			-.67+add_x, 0.01+add_y, -.2+add_z, angle_x+rot_x,
			angle_y+rot_y,-angle_z*8,0.1,0.1,2, buffers);
	///////////////////////////////gear 2


     buffers = buffersCollection.gear2;

    enableAttributes(gl,buffers,programInfo);
	
	drawHeelper(transform,pvm_transform, proj, lookat,
		.65+add_x, -.0+add_y, -.1+add_z,angle_x+rot_x,
		 angle_y+rot_y, -angle_z, 0.2,0.2,0.2, buffers);
	///////////////////////////////gear 3


     buffers = buffersCollection.gear3;

    enableAttributes(gl,buffers,programInfo);	
    
    drawHeelper(transform,pvm_transform, proj, lookat,
		0.0+add_x, .15+add_y, 0+add_z,angle_x+rot_x, angle_y+rot_y,
			-angle_z*2, 0.1,0.1,2, buffers);
	///////////////////////////////gear 4


     buffers = buffersCollection.gear4;

    enableAttributes(gl,buffers,programInfo);

	drawHeelper(transform,pvm_transform, proj, lookat,
			.238+add_x, -.021+add_y, -.1+add_z,  angle_x+rot_x,
			angle_y+rot_y, angle_z,0.2,0.2,0.4, buffers);
	///////////////////////////////gear 5


     buffers = buffersCollection.gear5;

    enableAttributes(gl,buffers,programInfo);
		
	drawHeelper(transform,pvm_transform, proj, lookat,
        0.02+add_x, -.2+add_y, 0+add_z, angle_x+rot_x,
        angle_y+rot_y,-angle_z*2,0.1,0.1,2, buffers);
	///////////////////////////////gear 6


     buffers = buffersCollection.gear6;

    enableAttributes(gl,buffers,programInfo);

	drawHeelper(transform,pvm_transform, proj, lookat,
			-.1+add_x, -.036+add_y, 0+add_z, angle_x+rot_x,
			angle_y+rot_y, angle_z*2,0.1,0.1,2.4, buffers);
	///////////////////////////////gear 7


     buffers = buffersCollection.gear7;

    enableAttributes(gl,buffers,programInfo);

	drawHeelper(transform,pvm_transform, proj, lookat,
			 -.1+add_x, -.036+add_y, -.26+add_z,angle_x+rot_x,
			 angle_y+rot_y,angle_z*2,0.4,0.4,0.2, buffers);
	///////////////////////////////gear 8


     buffers = buffersCollection.gear8;

    enableAttributes(gl,buffers,programInfo);

drawHeelper(transform,pvm_transform, proj, lookat,
			 0.02+add_x, -.68+add_y, 0+add_z,angle_x+rot_x,
			 angle_y+rot_y, angle_z*.5,0.4,0.4,0.2, buffers);
	///////////////////////////////gear 9


     buffers = buffersCollection.gear9;

    enableAttributes(gl,buffers,programInfo);

	drawHeelper(transform,pvm_transform, proj, lookat,
			0+add_x, .65+add_y, 0+add_z,angle_x+rot_x,
			angle_y+rot_y,angle_z*.5,0.4,0.4,0.2, buffers);
		///////////////////////////////gear 10


     buffers = buffersCollection.gear10;

    enableAttributes(gl,buffers,programInfo);

	drawHeelper(transform,pvm_transform, proj, lookat,
			-.67+add_x, 0.01+add_y, -.42+add_z, angle_x+rot_x,
			angle_y+rot_y, -angle_z*4,0.8,0.8,0.2, buffers);
	///////////////////////////////gear 11


     buffers = buffersCollection.gear11;

    enableAttributes(gl,buffers,programInfo);
	
	drawHeelper(transform,pvm_transform, proj, lookat,
			 .68+add_x, .69+add_y, -.1+add_z, angle_x+rot_x,
			  angle_y+rot_y, angle_z/2,0.4,0.4,0.2, buffers);
		///////////////////////////////gear 12


     buffers = buffersCollection.gear12;

    enableAttributes(gl,buffers,programInfo);

	drawHeelper(transform,pvm_transform, proj, lookat,
			.68+add_x, -.68+add_y, -.1+add_z, angle_x+rot_x,
			 angle_y+rot_y,angle_z/2,0.4,0.4,0.2,  buffers);
		///////////////////////////////gear 13


     buffers = buffersCollection.gear13;

    enableAttributes(gl,buffers,programInfo);

	drawHeelper(transform,pvm_transform, proj, lookat,
			-.7+add_x, -.62+add_y, -.1+add_z,angle_x+rot_x,
			 angle_y+rot_y,-angle_z*2,0.4,0.4,0.2, buffers);

	///////////////////////////////gear 14


    buffers = buffersCollection.gear14;

    enableAttributes(gl,buffers,programInfo);
	
	drawHeelper(transform,pvm_transform, proj, lookat,
			 -.7+add_x, .62+add_y, -.1+add_z, angle_x+rot_x,
			 angle_y+rot_y,-angle_z*2,0.4,0.4,0.2, buffers);
//////////////////////////////////// if gear 16
if (flag == 0) {
    buffers = buffersCollection.gear15;
    enableAttributes(gl,buffers,programInfo);
   	
   	drawHeelper(transform,pvm_transform, proj, lookat,
    -.925 +add_x, -.045+add_y, -.1+add_z,angle_x+rot_x,angle_y+rot_y,
    angle_z*6.15385, 0.13,0.13,0.2, buffers);	

   }


};
self.colFactory = function(add_x, add_y, add_z, rot_x, rot_y,flag) {
		///////////////////////////////gear pillor


     buffers = buffersCollection.gear16;

    enableAttributes(gl,buffers,programInfo);
	
	drawHeelper(transform,pvm_transform, proj, lookat,
			0.01+add_x, -1.17+add_y, -1.5+add_z, angle_x+rot_x,
			angle_y+rot_y,flag*angle_z*2,0.1,0.1,22.5, buffers);
};

////////////////////////////////////////floor
self.floor = function(add_x, add_y, add_z, rot_x, rot_y, ) {
     buffers = buffersCollection.gear17;

    enableAttributes(gl,buffers,programInfo);
	
	drawHeelper(transform,pvm_transform, proj, lookat,
			0.01+add_x, -1.17+add_y, -1.45+add_z, angle_x+rot_x,
			angle_y+rot_y,0, 1,1,1, buffers);
};
floor(-9,-2.5,-2,0,0);

//for (t=1; t <= 3;t++ ) {

	//colFactory(-9+(4.5*t),0,0,0,0);
//}
//colFactory(0,0,0,0,0);
 var l = 180;
for (i = 0; i < 4; i++) {	
       
	for (j = 0; j < 17; j++) {
         l = 180;
	    var o = -1;
	    var m =-2;
                
		if (j % 2 == 0) {
			l = 0;
			o=1;
			m = 2;

		}
		colFactory(m,1.95+(j*2.18),0,0,0,o);
		colFactory(m,.6+(j*2.18),0,0,0,o);
		//gearFactory(0,j*2.09,m,0,l,o);
	
		for (k = 1; k < 6; k++) {
			 var p =2.25*k +1;
			
		if (j % 2 == 0) {
			l =180;
			var n = 0;
			 o = 0;
			 m = i +.2;
			 n = ( (j+1)*.1) +(j* 2.09);
		 if (k % 2 == 0) {
			 l = 0;
             m = -i;
             n= j*2.09;
             o=1;
			 }
		 } else {
			 l =0;
			 m = -(i) +.2;
			 n = ( (j+1)*.1) +(j* 2.09);
             o=1;
        
		 if (k % 2 == 0) {
		 	l=180;
             o = 0;
			 m = (i) ;
			 n= j*2.09;
			 } 
		 }
        gearFactory(-p, n,m,0,l,o);
        gearFactory(p, n,m,0,l,o);
			 
		}
	}
}



}


//
// Initialize a shader program, so WebGL knows how to draw our data
// BOILERPLATE CODE, COPY AND PASTE
function initShaderProgram(gl, vsSource, fsSource) {
	const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
	const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

	// Create the shader program

	const shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	// If creating the shader program failed, alert
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
		return null;
	}

	return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.  BOILERPLATE CODE, COPY AND PASTE
//
function loadShader(gl, type, source) {
	const shader = gl.createShader(type);

	// Send the source to the shader object
	gl.shaderSource(shader, source);

	// Compile the shader program
	gl.compileShader(shader);

	// See if it compiled successfully
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
		gl.deleteShader(shader);
		return null;
	}

	return shader;
}



/*
//  build the object, including geometry (triangle vertices)
//  and possibly colors and normals for each vertex
function createGear() {
    const vertices = [];
    const colors = [];
    var i;
    var x = -0.5, y = 0, z = 0;
    var r = 0.1, g = 0.5, b = 0.9;


    for (i = 0; i < 10; i++) {

         vertices.push(x,y,z)
         vertices.push(x+0.2,y,z)
         vertices.push(x+0.1,y+0.3,z)     

         colors.push(r,g,b);
         colors.push(r,g,b); 
         colors.push(r,g,b);

         r += 0.2
         g += 0.2
         b += 0.2
         if (r > 1)
             r -= 1
         if (g > 1)
             g -= 1
         if (b > 1)
             b -= 1                          


         x += 0.1   
         z += -0.05
    }
    return [vertices,colors]
}
 */