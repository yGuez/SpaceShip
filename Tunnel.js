Tunnel = function () {
    // Empty array to store the points along the path
    points = [];

    // Define points along Z axis to create a curve
    for (var i = 0; i < 3; i += 1) {
        points.push(new THREE.Vector3(0, 0, -500 * (i / 2)));
    }
    // Set custom Y position for the last point
    points[2].y = -60;
      // Create a curve based on the points
    curve = new THREE.CatmullRomCurve3(points);
    // Define the curve type
    // Empty geometry
    var geometry = new THREE.BufferGeometry();
    // Create vertices based on the curve
    geometry.vertices = curve.getPoints(70);
    // Create a line from the points with a basic line material
    this.splineMesh = new THREE.Line(geometry, new THREE.LineBasicMaterial());

    // Create a material for the tunnel with a custom texture
    // Set side to BackSide since the camera is inside the tunnel
    var texture = new THREE.TextureLoader();
    var map = texture.load("/images/stars.png");
    this.tubeMaterial = new THREE.MeshStandardMaterial({
        side: THREE.BackSide,
        map: map
        // alphaMap: map
    });

    this.tubeMaterial.map.wrapS = THREE.RepeatWrapping;
    this.tubeMaterial.map.wrapT = THREE.RepeatWrapping;
    this.tubeMaterial.map.repeat.set(30, 6);
    // Create a tube geometry based on the curve
    this.tubeGeometry = new THREE.TubeGeometry(curve, 170, 9, 50, false);
    // Create a mesh based on the tube geometry and its material
    this.tubeMesh = new THREE.Mesh(this.tubeGeometry, this.tubeMaterial);
    // Push the tube into the scene
    // Clone the original tube geometry
    // Because we will modify the visible one but we need to keep track of the original position of the vertices
    this.tubeGeometry_o = this.tubeGeometry.clone();
};

Tunnel.prototype.updateMaterialOffset = function () {
    // Update the offset of the material
    this.tubeMaterial.map.offset.x += 0.008;
    this.tubeMaterial.map.offset.y += -0.005;
    this.tubeMaterial.map.offset.z += -0.002;
};