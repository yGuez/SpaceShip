var SpaceShip = function () {
  var that = this;
  var loader = new THREE.JSONLoader();
  loader.load('/models/ovni.json', function (geometry) {
    var materials = [
      new THREE.MeshBasicMaterial({
        color: 0xd13a00,
        vertexColors: THREE.FaceColors
      }),
      new THREE.MeshBasicMaterial({
        color: 0x1d274c,
        vertexColors: THREE.FaceColors
      }),
      new THREE.MeshBasicMaterial({
        color: 0x1c494d,
        vertexColors: THREE.FaceColors
      }),
      new THREE.MeshBasicMaterial({
        color: 0xffb200,
        vertexColors: THREE.FaceColors
      }),
      new THREE.MeshBasicMaterial({
        color: 0xffb200,
        vertexColors: THREE.FaceColors
      })
    ];
    that.mesh = new THREE.Mesh(geometry, materials);
    that.mesh.castShadow = true;
    scene.add(that.mesh);
    that.mesh.position.z = -10;
  });
}