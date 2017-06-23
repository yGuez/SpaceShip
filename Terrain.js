Terrain = function () {
    var geometry = new THREE.PlaneGeometry(20, 100, 12, 12);
    // rotate the geometryetry on the x axis
    geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

    var _this = this
    this.color = Math.random();
    this.mat = new THREE.MeshPhongMaterial({
        color: 0xffb200,
        shading: THREE.FlatShading
    });
    // important: by merging vertices we ensure the continuity of the waves
    geometry.mergeVertices();

    // get the vertices
    var l = geometry.vertices.length;

    // create an array to store new data associated to each vertex
    this.waves = [];

    for (var i = 0; i < l; i++) {
        // get each vertex
        var v = geometry.vertices[i];
        v.y = Math.random() * (.2 - .1 + 1) + .1;
    }
    this.mesh = new THREE.Mesh(geometry, this.mat);
    this.mesh.receiveShadow = true;
}