//Accepts a value [numTeeth] reprosenting the nuber of teeth on the gear,
//[numSpokes] reprosents the 0 <= number of spokes <= 2x num teeth,
//rgb is a 3 adress array to change the rgb values for the grar parts. 



//build the object, including geometry (triangle vertices)
//and possibly colors and normals for each vertex
function stocksettGear(numTeeth, numSpokes,rgb = [0.5,0.4,0.0]) {
	const vertices = [];
	const colors = [];
	const normals = [];


	////////////////////////////
	//Making gear triangles

	var n = numTeeth * 2;
	var rad = 1.0;
	var outRad = rad * 1.2;
	var innerRad = rad * .8;
	var angInc = 2*3.14159/n;
	var spokes = numSpokes;
	var ang = 0;
	var z = 0.1;

	var i;       //  coin face, front
	for (i = 0; i < n; i++) {
		var norm = calcNormal(rad*Math.cos(ang), rad*Math.sin(ang), z,
				rad*Math.cos(ang+angInc/2), rad*Math.sin(ang+angInc/2), z,
				innerRad*Math.cos(ang+angInc/2), innerRad*Math.sin(ang+angInc/2), z);

		vertices.push(rad*Math.cos(ang), rad*Math.sin(ang), z,
				rad*Math.cos(ang+angInc), rad*Math.sin(ang+angInc), z,
				innerRad*Math.cos(ang+angInc), innerRad*Math.sin(ang+angInc), z)
		colors.push( rgb[0], rgb[1], rgb[2],  
				rgb[0], rgb[1], rgb[2],  
				rgb[0], rgb[1], rgb[2]);

		normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2])

		var norm = calcNormal(rad*Math.cos(ang), rad*Math.sin(ang), z,
				innerRad*Math.cos(ang+angInc), innerRad*Math.sin(ang+angInc), z,
				innerRad*Math.cos(ang), innerRad*Math.sin(ang), z);



		vertices.push(rad*Math.cos(ang), rad*Math.sin(ang), z,
				innerRad*Math.cos(ang+angInc), innerRad*Math.sin(ang+angInc), z,
				innerRad*Math.cos(ang), innerRad*Math.sin(ang), z);
		colors.push( rgb[0], rgb[1], rgb[2],  
				rgb[0], rgb[1], rgb[2],  
				rgb[0], rgb[1], rgb[2]);


		normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2])
		var norm = calcNormal(0,0,z,
				angInc*Math.cos(ang),angInc*Math.sin(ang),z,
				angInc*Math.cos(ang+angInc),angInc*Math.sin(ang+angInc),z);

		vertices.push(0,0,z,
				angInc*Math.cos(ang),angInc*Math.sin(ang),z,
				angInc*Math.cos(ang+angInc),angInc*Math.sin(ang+angInc),z)

		colors.push( rgb[0], rgb[1], rgb[2],  
				rgb[0], rgb[1], rgb[2],  
				rgb[0], rgb[1], rgb[2]);
		//       normals.push(0,0,1, 0,0,1, 0,0,1  );
		normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2])


		ang += angInc;
	}

	ang = 0;
	for (i = 0; i < n; i++) {
		var norm = calcNormal(rad*Math.cos(ang), rad*Math.sin(ang), -z,
				rad*Math.cos(ang+angInc/2), rad*Math.sin(ang+angInc/2), -z,
				innerRad*Math.cos(ang+angInc/2), innerRad*Math.sin(ang+angInc/2), -z);


		vertices.push(rad*Math.cos(ang), rad*Math.sin(ang), -z,
				rad*Math.cos(ang+angInc), rad*Math.sin(ang+angInc), -z,
				innerRad*Math.cos(ang+angInc), innerRad*Math.sin(ang+angInc), -z)

		colors.push( rgb[0], rgb[1], rgb[2],  
				rgb[0], rgb[1], rgb[2],  
				rgb[0], rgb[1], rgb[2]);


		normals.push(norm[0],norm[1],-norm[2], norm[0],norm[1],-norm[2], norm[0],norm[1],-norm[2])
		//   normals.push(0,0,-1, 0,0,-1, 0,0,-1  );     

		var norm = calcNormal(rad*Math.cos(ang), rad*Math.sin(ang), -z,
				innerRad*Math.cos(ang+angInc), innerRad*Math.sin(ang+angInc), -z,
				innerRad*Math.cos(ang), innerRad*Math.sin(ang), -z);
		vertices.push(rad*Math.cos(ang), rad*Math.sin(ang), -z,
				innerRad*Math.cos(ang+angInc), innerRad*Math.sin(ang+angInc), -z,
				innerRad*Math.cos(ang), innerRad*Math.sin(ang), -z);
		colors.push( rgb[0], rgb[1], rgb[2],  
				rgb[0], rgb[1], rgb[2],  
				rgb[0], rgb[1], rgb[2]);


		normals.push(norm[0],norm[1],-norm[2], norm[0],norm[1],-norm[2], norm[0],norm[1],-norm[2])
		//       normals.push(0,0,-1, 0,0,-1, 0,0,-1  );
		var norm = calcNormal(0,0,-z,
				angInc*Math.cos(ang),angInc*Math.sin(ang),-z,
				angInc*Math.cos(ang+angInc),angInc*Math.sin(ang+angInc),-z);

		vertices.push(0,0,-z,
				angInc*Math.cos(ang),angInc*Math.sin(ang),-z,
				angInc*Math.cos(ang+angInc),angInc*Math.sin(ang+angInc),-z)

		colors.push( rgb[0], rgb[1], rgb[2],  
				rgb[0], rgb[1], rgb[2],  
				rgb[0], rgb[1], rgb[2]);
		normals.push(norm[0],norm[1],-norm[2], norm[0],norm[1],-norm[2], norm[0],norm[1],-norm[2])

		//       normals.push(0,0,-1, 0,0,-1, 0,0,-1  );


		ang += angInc;
	}   




	var r;
	for (r = 0; r < 2; r++) {
		ang = 0;
		var drawTooth = false;

		for ( i = 0; i < n; i++) {       // face of the teeth

			var norm = calcNormal(rad*Math.cos(ang), rad*Math.sin(ang), z,
					rad*Math.cos(ang+angInc), rad*Math.sin(ang+angInc), z,
					outRad*Math.cos(ang+angInc*.8), outRad*Math.sin(ang+angInc*.8), z/2)
					drawTooth = !drawTooth;
			if (drawTooth) {



				vertices.push(rad*Math.cos(ang), rad*Math.sin(ang), z,
						rad*Math.cos(ang+angInc), rad*Math.sin(ang+angInc), z,
						outRad*Math.cos(ang+angInc*.8), outRad*Math.sin(ang+angInc*.8), z/2)

				colors.push( rgb[0], rgb[1], rgb[2],  
						rgb[0], rgb[1], rgb[2],  
						rgb[0], rgb[1], rgb[2]);
				if (z > 0)
					normals.push(-norm[0],-norm[1],-norm[2], -norm[0],-norm[1],-norm[2], -norm[0],-norm[1],-norm[2])
					else
						normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2])

						var norm = calcNormal(rad*Math.cos(ang), rad*Math.sin(ang), z,
								outRad*Math.cos(ang+angInc*.8), outRad*Math.sin(ang+angInc*.8), z/2,
								outRad*Math.cos(ang+angInc*.2), outRad*Math.sin(ang+angInc*.2), z/2);


				vertices.push(
						rad*Math.cos(ang), rad*Math.sin(ang), z,
						outRad*Math.cos(ang+angInc*.8), outRad*Math.sin(ang+angInc*.8), z/2,
						outRad*Math.cos(ang+angInc*.2), outRad*Math.sin(ang+angInc*.2), z/2);


				colors.push( rgb[0], rgb[1], rgb[2],  
						rgb[0], rgb[1], rgb[2],  
						rgb[0], rgb[1], rgb[2]);
				if (z > 0)
					normals.push(-norm[0],-norm[1],-norm[2], -norm[0],-norm[1],-norm[2], -norm[0],-norm[1],-norm[2])
					else
						normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2])
			}

			if (i % Math.ceil(n/spokes) == 0) { //spoke face

				var norm = calcNormal(angInc * Math.cos(ang), angInc*Math.sin(ang), z,
						angInc *  Math.cos(ang+angInc), angInc * Math.sin(ang+angInc), z,
						innerRad*Math.cos(ang+angInc), innerRad*Math.sin(ang+angInc), z)

						vertices.push(
								angInc * Math.cos(ang), angInc*Math.sin(ang), z,
								angInc *  Math.cos(ang+angInc), angInc * Math.sin(ang+angInc), z,
								innerRad*Math.cos(ang+angInc), innerRad*Math.sin(ang+angInc), z)

						colors.push( rgb[0], rgb[1], rgb[2],  
								rgb[0], rgb[1], rgb[2],  
								rgb[0], rgb[1], rgb[2]);
				if (z > 0)
					normals.push(-norm[0],-norm[1],-norm[2], -norm[0],-norm[1],-norm[2], -norm[0],-norm[1],-norm[2])
					else
						normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2])

						var norm = calcNormal(angInc*Math.cos(ang), angInc*Math.sin(ang), z,
								innerRad*Math.cos(ang+angInc), innerRad*Math.sin(ang+angInc), z,
								innerRad*Math.cos(ang), innerRad*Math.sin(ang), z);



				vertices.push(
						angInc*Math.cos(ang), angInc*Math.sin(ang), z,
						innerRad*Math.cos(ang+angInc), innerRad*Math.sin(ang+angInc), z,
						innerRad*Math.cos(ang), innerRad*Math.sin(ang), z);

				colors.push( rgb[0], rgb[1], rgb[2],  
						rgb[0], rgb[1], rgb[2],  
						rgb[0], rgb[1], rgb[2]);              
				if (z > 0)
					normals.push(-norm[0],-norm[1],-norm[2], -norm[0],-norm[1],-norm[2], -norm[0],-norm[1],-norm[2])
					else
						normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2])
			}
			ang += angInc;
		}
		z = -z;
	}


	//  z = -z;  BUG 1




	ang = 0;                          // coin edge
	var drawTooth = true;
	for (i = 0; i < n; i++) {
		drawTooth = !drawTooth;
		var norm = calcNormal( rad*Math.cos(ang),rad*Math.sin(ang),-z,
				rad*Math.cos(ang+angInc),rad*Math.sin(ang+angInc),-z,
				rad*Math.cos(ang+angInc),rad*Math.sin(ang+angInc),z);
		if (drawTooth) {

			vertices.push(
					rad*Math.cos(ang),rad*Math.sin(ang),-z,
					rad*Math.cos(ang+angInc),rad*Math.sin(ang+angInc),-z,
					rad*Math.cos(ang+angInc),rad*Math.sin(ang+angInc),z)

			colors.push( rgb[0], rgb[1], rgb[2],  
					rgb[0], rgb[1], rgb[2],  
					rgb[0], rgb[1], rgb[2]);
			normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2])

			var norm = calcNormal(rad*Math.cos(ang),rad*Math.sin(ang),-z,
					rad*Math.cos(ang+angInc),rad*Math.sin(ang+angInc),z,
					rad*Math.cos(ang),rad*Math.sin(ang),z);


			vertices.push(
					rad*Math.cos(ang),rad*Math.sin(ang),-z,
					rad*Math.cos(ang+angInc),rad*Math.sin(ang+angInc),z,
					rad*Math.cos(ang),rad*Math.sin(ang),z);

			colors.push( rgb[0], rgb[1], rgb[2],  
					rgb[0], rgb[1], rgb[2],  
					rgb[0], rgb[1], rgb[2]);
			normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2])            
		} 
		if (i % Math.ceil(n/spokes) != 0) {



			//inner gear surfac
			//         var norm = [rad*Math.cos(ang+angInc/2),rad*Math.sin(ang+angInc/2), 0];
			var norm = calcNormal( innerRad*Math.cos(ang),innerRad*Math.sin(ang),-z,
					innerRad*Math.cos(ang+angInc),innerRad*Math.sin(ang+angInc),-z,
					innerRad*Math.cos(ang+angInc),innerRad*Math.sin(ang+angInc),z);


			vertices.push(
					innerRad*Math.cos(ang),innerRad*Math.sin(ang),-z,
					innerRad*Math.cos(ang+angInc),innerRad*Math.sin(ang+angInc),-z,
					innerRad*Math.cos(ang+angInc),innerRad*Math.sin(ang+angInc),z);

			colors.push( rgb[0], rgb[1], rgb[2],  
					rgb[0], rgb[1], rgb[2],  
					rgb[0], rgb[1], rgb[2]);
			normals.push(-norm[0],-norm[1],norm[2], -norm[0],-norm[1],norm[2], -norm[0],-norm[1],norm[2])

			var norm = calcNormal( innerRad*Math.cos(ang),innerRad*Math.sin(ang),-z,
					innerRad*Math.cos(ang+angInc),innerRad*Math.sin(ang+angInc),z,
					innerRad*Math.cos(ang),innerRad*Math.sin(ang),z);

			vertices.push(
					innerRad*Math.cos(ang),innerRad*Math.sin(ang),-z,
					innerRad*Math.cos(ang+angInc),innerRad*Math.sin(ang+angInc),z,
					innerRad*Math.cos(ang),innerRad*Math.sin(ang),z);

			colors.push( rgb[0], rgb[1], rgb[2],  
					rgb[0], rgb[1], rgb[2],  
					rgb[0], rgb[1], rgb[2]);
			normals.push(-norm[0],-norm[1],norm[2], -norm[0],-norm[1],norm[2], -norm[0],-norm[1],norm[2]) 

			//inner top
			//        var norm = [rad*Math.cos(ang+angInc/2),rad*Math.sin(ang+angInc/2), 0];
			var norm = calcNormal(angInc*Math.cos(ang),angInc*Math.sin(ang),-z,
					angInc*Math.cos(ang+angInc),angInc*Math.sin(ang+angInc),-z,
					angInc*Math.cos(ang+angInc),angInc*Math.sin(ang+angInc),z)

			vertices.push(                                   
					angInc*Math.cos(ang),angInc*Math.sin(ang),-z,
					angInc*Math.cos(ang+angInc),angInc*Math.sin(ang+angInc),-z,
					angInc*Math.cos(ang+angInc),angInc*Math.sin(ang+angInc),z)

			colors.push( rgb[0], rgb[1], rgb[2],  
					rgb[0], rgb[1], rgb[2],  
					rgb[0], rgb[1], rgb[2]);
			normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2])

			var norm = calcNormal(angInc*Math.cos(ang),angInc*Math.sin(ang),-z,
					angInc*Math.cos(ang+angInc),angInc*Math.sin(ang+angInc),z,
					angInc*Math.cos(ang),angInc*Math.sin(ang),z)

			vertices.push(
					angInc*Math.cos(ang),angInc*Math.sin(ang),-z,
					angInc*Math.cos(ang+angInc),angInc*Math.sin(ang+angInc),z,
					angInc*Math.cos(ang),angInc*Math.sin(ang),z)

			colors.push( rgb[0], rgb[1], rgb[2],  
					rgb[0], rgb[1], rgb[2],  
					rgb[0], rgb[1], rgb[2]);
			normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2]) 




		}
		ang += angInc;
	}


	ang = 0;
	drawTooth = false;     // tooth roof
	for (i = 0; i < n; i++) {
		drawTooth = !drawTooth;
		if (drawTooth) {

			var norm = calcNormal(  outRad*Math.cos(ang + angInc*.2),outRad*Math.sin(ang + angInc*.2),-z/2,
					outRad*Math.cos(ang+angInc*.8),outRad*Math.sin(ang+angInc*.8),-z/2,
					outRad*Math.cos(ang+angInc*.8),outRad*Math.sin(ang+angInc*.8),z/2)

					//      var norm = [outRad*Math.cos(ang+angInc/2),outRad*Math.sin(ang+angInc/2),0];
					vertices.push(
							outRad*Math.cos(ang + angInc*.2),outRad*Math.sin(ang + angInc*.2),-z/2,
							outRad*Math.cos(ang+angInc*.8),outRad*Math.sin(ang+angInc*.8),-z/2,
							outRad*Math.cos(ang+angInc*.8),outRad*Math.sin(ang+angInc*.8),z/2)

					colors.push( rgb[0], rgb[1], rgb[2],  
							rgb[0], rgb[1], rgb[2],  
							rgb[0], rgb[1], rgb[2]);
			normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2])

			var norm = calcNormal( outRad*Math.cos(ang + angInc*.2),outRad*Math.sin(ang+ angInc*.2),-z/2,
					outRad*Math.cos(ang+angInc*.8),outRad*Math.sin(ang+angInc*.8),z/2,
					outRad*Math.cos(ang+angInc*.2),outRad*Math.sin(ang+angInc*.2),z/2)

			vertices.push(
					outRad*Math.cos(ang + angInc*.2),outRad*Math.sin(ang+ angInc*.2),-z/2,
					outRad*Math.cos(ang+angInc*.8),outRad*Math.sin(ang+angInc*.8),z/2,
					outRad*Math.cos(ang+angInc*.2),outRad*Math.sin(ang+angInc*.2),z/2)

			colors.push( rgb[0], rgb[1], rgb[2],  
					rgb[0], rgb[1], rgb[2],  
					rgb[0], rgb[1], rgb[2]);
			normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2])             

		}
		ang += angInc;
	}

	ang = 0;

	drawTooth = false;
	for ( i = 0; i < n; i++) {   // tooth walls
		drawTooth = !drawTooth;
		if (drawTooth) {


			// BUG 3   norm vs. normal  
			var norm = calcNormal(  rad*Math.cos(ang),   rad*Math.sin(ang),-z,
					outRad*Math.cos(ang + angInc*.2),outRad*Math.sin(ang+angInc*.2),-z/2,
					outRad*Math.cos(ang+angInc*.2),outRad*Math.sin(ang+angInc*.2),z/2)


					vertices.push(
							rad*Math.cos(ang),   rad*Math.sin(ang),-z,
							outRad*Math.cos(ang + angInc*.2),outRad*Math.sin(ang+angInc*.2),-z/2,
							outRad*Math.cos(ang+angInc*.2),outRad*Math.sin(ang+angInc*.2),z/2)
					colors.push( rgb[0], rgb[1], rgb[2],  
							rgb[0], rgb[1], rgb[2],  
							rgb[0], rgb[1], rgb[2]);
			normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2])

			var norm = calcNormal(rad*Math.cos(ang),   rad*Math.sin(ang),-z,
					outRad*Math.cos(ang+angInc*.2),outRad*Math.sin(ang+angInc*.2),z/2,
					rad*Math.cos(ang),   rad*Math.sin(ang),z)

			vertices.push(
					rad*Math.cos(ang),   rad*Math.sin(ang),-z,
					outRad*Math.cos(ang+angInc*.2),outRad*Math.sin(ang+angInc*.2),z/2,
					rad*Math.cos(ang),   rad*Math.sin(ang),z)
			colors.push( rgb[0], rgb[1], rgb[2],  
					rgb[0], rgb[1], rgb[2],  
					rgb[0], rgb[1], rgb[2]);        
			normals.push(norm[0],norm[1],norm[2], norm[0],norm[1],norm[2], norm[0],norm[1],norm[2])    



			var norm = calcNormal( rad*Math.cos(ang+angInc),   rad*Math.sin(ang+angInc),-z,
					outRad*Math.cos(ang+angInc*.8),outRad*Math.sin(ang+angInc*.8),-z/2,
					outRad*Math.cos(ang+angInc*.8),outRad*Math.sin(ang+angInc*.8),z/2 );



			vertices.push(
					rad*Math.cos(ang+angInc),   rad*Math.sin(ang+angInc),-z,
					outRad*Math.cos(ang+angInc*.8),outRad*Math.sin(ang+angInc*.8),-z/2,
					outRad*Math.cos(ang+angInc*.8),outRad*Math.sin(ang+angInc*.8),z/2)
			colors.push( rgb[0], rgb[1], rgb[2],  
					rgb[0], rgb[1], rgb[2],  
					rgb[0], rgb[1], rgb[2]);      
			normals.push(-norm[0],-norm[1],norm[2], -norm[0],-norm[1],norm[2], -norm[0],-norm[1],norm[2])             

			var norm = calcNormal(  rad*Math.cos(ang+angInc),   rad*Math.sin(ang+angInc),-z,
					outRad*Math.cos(ang+angInc*.8),outRad*Math.sin(ang+angInc*.8),z/2,
					rad*Math.cos(ang+angInc),   rad*Math.sin(ang+angInc),z)

			vertices.push(
					rad*Math.cos(ang+angInc),   rad*Math.sin(ang+angInc),-z,
					outRad*Math.cos(ang+angInc*.8),outRad*Math.sin(ang+angInc*.8),z/2,
					rad*Math.cos(ang+angInc),   rad*Math.sin(ang+angInc),z)
			colors.push( rgb[0], rgb[1], rgb[2],  
					rgb[0], rgb[1], rgb[2],  
					rgb[0], rgb[1], rgb[2]);       
			normals.push(-norm[0],-norm[1],norm[2], -norm[0],-norm[1],norm[2], -norm[0],-norm[1],norm[2])    


		}
		var norm2 = calcNormal( angInc*Math.cos(ang),   angInc*Math.sin(ang),-z,
				innerRad*Math.cos(ang),innerRad*Math.sin(ang),-z,
				innerRad*Math.cos(ang),innerRad*Math.sin(ang),z);


		if (i % Math.ceil(n/spokes) == 0) { //side spoke

			vertices.push(
					angInc*Math.cos(ang),   angInc*Math.sin(ang),-z,
					innerRad*Math.cos(ang),innerRad*Math.sin(ang),-z,
					innerRad*Math.cos(ang),innerRad*Math.sin(ang),z);
			colors.push( rgb[0], rgb[1], rgb[2],  
					rgb[0], rgb[1], rgb[2],  
					rgb[0], rgb[1], rgb[2]);       
			normals.push(norm2[0],norm2[1],norm2[2], norm2[0],norm2[1],norm[2], norm2[0],norm2[1],norm2[2])

			var norm2 = calcNormal(angInc*Math.cos(ang),   angInc*Math.sin(ang),-z,
					innerRad*Math.cos(ang),innerRad*Math.sin(ang),z,
					angInc*Math.cos(ang),   angInc*Math.sin(ang),z);

			vertices.push(
					angInc*Math.cos(ang),   angInc*Math.sin(ang),-z,
					innerRad*Math.cos(ang),innerRad*Math.sin(ang),z,
					angInc*Math.cos(ang),   angInc*Math.sin(ang),z);
			colors.push( rgb[0], rgb[1], rgb[2],  
					rgb[0], rgb[1], rgb[2],  
					rgb[0], rgb[1], rgb[2]);       
			normals.push(norm2[0],norm2[1],norm2[2], norm2[0],norm2[1],norm2[2], norm2[0],norm2[1],norm2[2])    


		}    
		var norm2 = calcNormal( angInc*Math.cos(ang+angInc),   angInc*Math.sin(ang+angInc),-z,
				innerRad*Math.cos(ang+angInc),innerRad*Math.sin(ang+angInc),-z,
				innerRad*Math.cos(ang+angInc),innerRad*Math.sin(ang+angInc),z) 

				if (i % Math.ceil(n/spokes) == 0) { //side spoke
					vertices.push(
							angInc*Math.cos(ang+angInc),   angInc*Math.sin(ang+angInc),-z,
							innerRad*Math.cos(ang+angInc),innerRad*Math.sin(ang+angInc),-z,
							innerRad*Math.cos(ang+angInc),innerRad*Math.sin(ang+angInc),z)
					colors.push( rgb[0], rgb[1], rgb[2],  
							rgb[0], rgb[1], rgb[2],  
							rgb[0], rgb[1], rgb[2]);       
					normals.push(-norm2[0],-norm2[1],norm2[2], -norm2[0],-norm2[1],norm2[2], -norm2[0],-norm2[1],norm2[2])             

					var norm2 = calcNormal(angInc*Math.cos(ang+angInc),   angInc*Math.sin(ang+angInc),-z,
							innerRad*Math.cos(ang+angInc),innerRad*Math.sin(ang+angInc),z,
							angInc*Math.cos(ang+angInc),   angInc*Math.sin(ang+angInc),z)

					vertices.push(
							angInc*Math.cos(ang+angInc),   angInc*Math.sin(ang+angInc),-z,
							innerRad*Math.cos(ang+angInc),innerRad*Math.sin(ang+angInc),z,
							angInc*Math.cos(ang+angInc),   angInc*Math.sin(ang+angInc),z)
					colors.push( rgb[0], rgb[1], rgb[2],  
							rgb[0], rgb[1], rgb[2],  
							rgb[0], rgb[1], rgb[2]);       
					normals.push(-norm2[0],-norm2[1],norm2[2], -norm2[0],-norm2[1],norm2[2], -norm2[0],-norm2[1],norm2[2])    

				}         


		ang += angInc;
	}










	return [vertices,colors,normals]
}




















function calcNormal(x1, y1,  z1,
		x2,  y2,  z2,
		x3,  y3,  z3) {

	var ux = x2-x1, uy = y2-y1, uz = z2-z1;
	var vx = x3-x1, vy = y3-y1, vz = z3-z1;

	return [ uy * vz - uz * vy,
	         uz * vx - ux * vz,
	         ux * vy - uy * vx];
}
