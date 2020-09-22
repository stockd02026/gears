/**
 * @author Gordon McCreary
 * @param {Number} numTeeth The number of teeth for the gear.
 * @param {Number} numSpokes The number of spokes for the gear.
 * @param {Number} radius The radius of the gear.
 * @param {Number} width The width of the gear.
 * @throws Error when numTeeth < 4.
 * @throws Error when numSpokes < 3.
 */
function gordonGear(numTeeth, numSpokes, radius, width) {
    if (numTeeth < 4) {
        throw new Error('numTeeth must be at least 4.');
    }
    if (numSpokes < 3) {
        throw new Error('numSpokes must be at least 3.');
    }

    const vertices = [];
    const colors = [];
    const normals = [];

    // Create a triangle.
    let addTri = (x1, y1, z1, x2, y2, z2, x3, y3, z3, c, f) => {
        vertices.push(x1, y1, z1, x2, y2, z2, x3, y3, z3);
        colors.push(c.red, c.green, c.blue, c.red, c.green, c.blue, c.red, c.green, c.blue);
        let n = calcNormalGM(x1, y1, z1, x2, y2, z2, x3, y3, z3);
        normals.push(n.x, n.y, n.z, n.x, n.y, n.z, n.x, n.y, n.z);

        if (f) {
            vertices.push(x1, y1, -z1, x2, y2, -z2, x3, y3, -z3);
            colors.push(c.red, c.green, c.blue, c.red, c.green, c.blue, c.red, c.green, c.blue);
            normals.push(-n.x, -n.y, -n.z, -n.x, -n.y, -n.z, -n.x, -n.y, -n.z);
        }
    };

    // Create a quadrilateral.
    let addQuad = (
                    x1, y1, z1, // Top Left
                    x2, y2, z2, // Top Right
                    x3, y3, z3, // Bottom Left
                    x4, y4, z4, // Bottom Right
                    c, f) => {
        addTri(x1, y1, z1, x2, y2, z2, x3, y3, z3, c, f);
        addTri(x4, y4, z4, x3, y3, z3, x2, y2, z2, c, f);
    }

    var mainColor = {red: 182 / 255, green: 194 / 255, blue: 185 / 255};
    var extraColor = {red: 242 / 255, green: 232 / 255, blue: 82 / 255};


    // extraColor cylinders
    let circleDetail = 200;
    for (let i = 0; i < circleDetail; i++) {
        let oR = radius * 0.85;
        let oT = radius * 0.1;
        let iR = radius * 0.2;
        let iT = radius * 0.15
        let angS = i * ((2 * Math.PI) / (circleDetail));
        let angE = (i + 1) * ((2 * Math.PI) / (circleDetail));

        // Outer cylinder.
        addQuad( // Faces
            oR * Math.cos(angS), oR * Math.sin(angS), width / 2,
            oR * Math.cos(angE), oR * Math.sin(angE), width / 2,
            (oR - oT) * Math.cos(angS), (oR - oT) * Math.sin(angS), width / 2,
            (oR - oT) * Math.cos(angE), (oR - oT) * Math.sin(angE), width / 2,
            extraColor,
            true
        );
        addQuad( // Outer edges
            oR * Math.cos(angS), oR * Math.sin(angS), -width / 2,
            oR * Math.cos(angE), oR * Math.sin(angE), -width / 2,
            oR * Math.cos(angS), oR * Math.sin(angS), width / 2,
            oR * Math.cos(angE), oR * Math.sin(angE), width / 2,
            extraColor,
            false
        );
        addQuad( // Inner edges
            (oR - oT) * Math.cos(angS), (oR - oT) * Math.sin(angS), width / 2,
            (oR - oT) * Math.cos(angE), (oR - oT) * Math.sin(angE), width / 2,
            (oR - oT) * Math.cos(angS), (oR - oT) * Math.sin(angS), -width / 2,
            (oR - oT) * Math.cos(angE), (oR - oT) * Math.sin(angE), -width / 2,
            extraColor,
            false
        );

        // Inner cylinder.
        addQuad( // Faces
            iR * Math.cos(angS), iR * Math.sin(angS), width / 2,
            iR * Math.cos(angE), iR * Math.sin(angE), width / 2,
            (iR - iT) * Math.cos(angS), (iR - iT) * Math.sin(angS), width / 2,
            (iR - iT) * Math.cos(angE), (iR - iT) * Math.sin(angE), width / 2,
            extraColor,
            true
        );
        addQuad( // Outer edges
            iR * Math.cos(angS), iR * Math.sin(angS), -width / 2,
            iR * Math.cos(angE), iR * Math.sin(angE), -width / 2,
            iR * Math.cos(angS), iR * Math.sin(angS), width / 2,
            iR * Math.cos(angE), iR * Math.sin(angE), width / 2,
            extraColor,
            false
        );
        addQuad( // Inner edges
            (iR - iT) * Math.cos(angS), (iR - iT) * Math.sin(angS), width / 2,
            (iR - iT) * Math.cos(angE), (iR - iT) * Math.sin(angE), width / 2,
            (iR - iT) * Math.cos(angS), (iR - iT) * Math.sin(angS), -width / 2,
            (iR - iT) * Math.cos(angE), (iR - iT) * Math.sin(angE), -width / 2,
            extraColor,
            false
        );
    }

    // mainColor cylinders
    for (let i = 0; i < circleDetail; i++) {
        let oR = radius * 0.75;
        let oT = radius * 0.1;
        let iR = radius * 0.3;
        let iT = radius * 0.1
        let angS = i * ((2 * Math.PI) / (circleDetail));
        let angE = (i + 1) * ((2 * Math.PI) / (circleDetail));

        // Outer cylinder.
        addQuad( // Faces
            oR * Math.cos(angS), oR * Math.sin(angS), width / 2.5,
            oR * Math.cos(angE), oR * Math.sin(angE), width / 2.5,
            (oR - oT) * Math.cos(angS), (oR - oT) * Math.sin(angS), width / 2.5,
            (oR - oT) * Math.cos(angE), (oR - oT) * Math.sin(angE), width / 2.5,
            mainColor,
            true
        );
        addQuad( // Outer edges
            oR * Math.cos(angS), oR * Math.sin(angS), -width / 2.5,
            oR * Math.cos(angE), oR * Math.sin(angE), -width / 2.5,
            oR * Math.cos(angS), oR * Math.sin(angS), width / 2.5,
            oR * Math.cos(angE), oR * Math.sin(angE), width / 2.5,
            mainColor,
            false
        );
        addQuad( // Inner edges
            (oR - oT) * Math.cos(angS), (oR - oT) * Math.sin(angS), width / 2.5,
            (oR - oT) * Math.cos(angE), (oR - oT) * Math.sin(angE), width / 2.5,
            (oR - oT) * Math.cos(angS), (oR - oT) * Math.sin(angS), -width / 2.5,
            (oR - oT) * Math.cos(angE), (oR - oT) * Math.sin(angE), -width / 2.5,
            mainColor,
            false
        );

        // Inner cylinder.
        addQuad( // Faces
            iR * Math.cos(angS), iR * Math.sin(angS), width / 3,
            iR * Math.cos(angE), iR * Math.sin(angE), width / 3,
            (iR - iT) * Math.cos(angS), (iR - iT) * Math.sin(angS), width / 3,
            (iR - iT) * Math.cos(angE), (iR - iT) * Math.sin(angE), width / 3,
            mainColor,
            true
        );
        addQuad( // Outer edges
            iR * Math.cos(angS), iR * Math.sin(angS), -width / 3,
            iR * Math.cos(angE), iR * Math.sin(angE), -width / 3,
            iR * Math.cos(angS), iR * Math.sin(angS), width / 3,
            iR * Math.cos(angE), iR * Math.sin(angE), width / 3,
            mainColor,
            false
        );
        addQuad( // Inner edges
            (iR - iT) * Math.cos(angS), (iR - iT) * Math.sin(angS), width / 3,
            (iR - iT) * Math.cos(angE), (iR - iT) * Math.sin(angE), width / 3,
            (iR - iT) * Math.cos(angS), (iR - iT) * Math.sin(angS), -width / 3,
            (iR - iT) * Math.cos(angE), (iR - iT) * Math.sin(angE), -width / 3,
            mainColor,
            false
        );
    }

    // Teeth
    for (let i = 0; i < numTeeth * 2; i++) {
        if (i % 2) {
            let oR = radius;
            let oT = radius * 0.15;
            let angS = i * ((2 * Math.PI) / (numTeeth * 2));
            let angE = (i + 1) * ((2 * Math.PI) / (numTeeth * 2));
            let angR = 0.2 * ((2 * Math.PI) / (numTeeth * 2));

            addQuad( // Faces
                oR * Math.cos(angS + angR), oR * Math.sin(angS + angR), width / 3,
                oR * Math.cos(angE - angR), oR * Math.sin(angE- angR), width / 3,
                (oR - oT) * Math.cos(angS), (oR - oT) * Math.sin(angS), width / 2.5,
                (oR - oT) * Math.cos(angE), (oR - oT) * Math.sin(angE), width / 2.5,
                mainColor,
                true
            );
            addQuad( // Outer edges
                oR * Math.cos(angS + angR), oR * Math.sin(angS + angR), -width / 3,
                oR * Math.cos(angE - angR), oR * Math.sin(angE- angR), -width / 3,
                oR * Math.cos(angS + angR), oR * Math.sin(angS + angR), width / 3,
                oR * Math.cos(angE - angR), oR * Math.sin(angE- angR), width / 3,
                mainColor,
                false
            );
            addQuad( // Wall
                oR * Math.cos(angS + angR), oR * Math.sin(angS + angR), -width / 3,
                oR * Math.cos(angS + angR), oR * Math.sin(angS + angR), width / 3,
                (oR - oT) * Math.cos(angS), (oR - oT) * Math.sin(angS), -width / 2.5,
                (oR - oT) * Math.cos(angS), (oR - oT) * Math.sin(angS), width / 2.5,
                mainColor,
                false
            );
            addQuad( // Walls
                oR * Math.cos(angE - angR), oR * Math.sin(angE- angR), width / 3,
                oR * Math.cos(angE - angR), oR * Math.sin(angE- angR), -width / 3,
                (oR - oT) * Math.cos(angE), (oR - oT) * Math.sin(angE), width / 2.5,
                (oR - oT) * Math.cos(angE), (oR - oT) * Math.sin(angE), -width / 2.5,
                mainColor,
                false
            );
        }
    }

    // Spokes
    for (let i = 0; i < numSpokes * 2; i++) {
        let oR = radius * 0.75;
        let oT = radius * 0.45;
        let oC = radius * 0.2;
        let angS = i * ((2 * Math.PI) / (numSpokes * 2));
        let angE = (i + 1) * ((2 * Math.PI) / (numSpokes * 2));
        let angR = 0.5 * ((2 * Math.PI) / (numTeeth * 2));

        if (i % 2) {
            addQuad( // Faces
                oR * Math.cos(angS), oR * Math.sin(angS), width / 3,
                oR * Math.cos(angE), oR * Math.sin(angE), width / 3,
                (oR - oT) * Math.cos(angS), (oR - oT) * Math.sin(angS), width / 3,
                (oR - oT) * Math.cos(angE), (oR - oT) * Math.sin(angE), width / 3,
                mainColor,
                true
            );
        } else {
            addTri( // Edges
                oR * Math.cos(angS + angR), oR * Math.sin(angS + angR), width / 3,
                (oR - oC) * Math.cos(angS), (oR - oC) * Math.sin(angS), width / 3,
                oR * Math.cos(angS), oR * Math.sin(angS), width / 3,
                mainColor,
                true
            );
            addTri( // Edges
                oR * Math.cos(angE), oR * Math.sin(angE), width / 3,
                (oR - oC) * Math.cos(angE), (oR - oC) * Math.sin(angE), width / 3,
                oR * Math.cos(angE - angR), oR * Math.sin(angE - angR), width / 3,
                mainColor,
                true
            );
            addQuad( // Edges
                (oR - oC) * Math.cos(angS), (oR - oC) * Math.sin(angS), width / 3,
                (oR - oC) * Math.cos(angS), (oR - oC) * Math.sin(angS), -width / 3,
                (oR - oT) * Math.cos(angS), (oR - oT) * Math.sin(angS), width / 3,
                (oR - oT) * Math.cos(angS), (oR - oT) * Math.sin(angS), -width / 3,
                mainColor,
                false
            );
            addQuad( // Edges
                (oR - oC) * Math.cos(angE), (oR - oC) * Math.sin(angE), -width / 3,
                (oR - oC) * Math.cos(angE), (oR - oC) * Math.sin(angE), width / 3,
                (oR - oT) * Math.cos(angE), (oR - oT) * Math.sin(angE), -width / 3,
                (oR - oT) * Math.cos(angE), (oR - oT) * Math.sin(angE), width / 3,
                mainColor,
                false
            );
            addQuad( // Edges
                oR * Math.cos(angS + angR), oR * Math.sin(angS + angR), width / 3,
                oR * Math.cos(angS + angR), oR * Math.sin(angS + angR), -width / 3,
                (oR - oC) * Math.cos(angS), (oR - oC) * Math.sin(angS), width / 3,
                (oR - oC) * Math.cos(angS), (oR - oC) * Math.sin(angS), -width / 3,
                mainColor,
                false
            );
            addQuad( // Edges
                oR * Math.cos(angE - angR), oR * Math.sin(angE - angR), -width / 3,
                oR * Math.cos(angE - angR), oR * Math.sin(angE - angR), width / 3,
                (oR - oC) * Math.cos(angE), (oR - oC) * Math.sin(angE), -width / 3,
                (oR - oC) * Math.cos(angE), (oR - oC) * Math.sin(angE), width / 3,
                mainColor,
                false
            );
        }
    }

    return [vertices,colors,normals];
}

function calcNormalGM(x1, y1,  z1,
                    x2,  y2,  z2,
                    x3,  y3,  z3) {
              
    var ux = x2-x1, uy = y2-y1, uz = z2-z1;
    var vx = x3-x1, vy = y3-y1, vz = z3-z1;

    return {x: uy * vz - uz * vy,
            y: uz * vx - ux * vz,
            z: ux * vy - uy * vx};
}