function floor(one, two) {
	const vertices = [];
	const colors = [];
	const normals = [];



for (i = 0; i<one;i++) {
	for (j = 0;j<two;j++) {
		vertices.push(i,j,0, i+1,j,0, i,j+1,0 );
		colors.push(.5,.5,.5,.5,.5,.5,.5,.5,.5);
	    normals.push(0,0,1, 0,0,1, 0,0,1);

		vertices.push(i+1,j+1,0, i+1,j,0, i,j+1,0 );
		colors.push(.5,.5,.0,.5,.5,.0,.5,.5,.0);
		normals.push(0,0,1, 0,0,1, 0,0,1);

		
	}
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
