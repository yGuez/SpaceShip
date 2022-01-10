// var SpaceShip = function () {
//   var that = this;
//   var loader = new THREE.JSONLoader();
//   loader.load('/models/ovni.json', function (geometry) {
//     var materials = [
//       new THREE.MeshToonMaterial({
//         color: 0xd13a00,
//         vertexColors: THREE.FaceColors
//       }),
//       new THREE.MeshToonMaterial({
//         color: 0x1d274c,
//         vertexColors: THREE.FaceColors
//       }),
//       new THREE.MeshToonMaterial({
//         color: 0x1c494d,
//         vertexColors: THREE.FaceColors
//       }),
//       new THREE.MeshToonMaterial({
//         color: 0xffb200,
//         vertexColors: THREE.FaceColors
//       }),
//       new THREE.MeshToonMaterial({
//         color: 0xffb200,
//         vertexColors: THREE.FaceColors
//       })
//     ];
//     that.mesh = new THREE.Mesh(geometry, materials);
//     that.mesh.castShadow = true;
//     scene.add(that.mesh);
//     that.mesh.position.z = -10;
//   });
// }

var SpaceShip = function () {
  var that = this;

  model = new THREE.Object3D();
  var loader = new THREE.GLTFLoader();
  loader.load('/models/ovni-2.8.glb', function (gltf) {
    var materials = [
      new THREE.MeshToonMaterial({
        color: 0xd13a00,
        vertexColors: THREE.FaceColors
      }),
      new THREE.MeshToonMaterial({
        color: 0x1d274c,
        vertexColors: THREE.FaceColors
      }),
      new THREE.MeshToonMaterial({
        color: 0x1c494d,
        vertexColors: THREE.FaceColors
      }),
      new THREE.MeshToonMaterial({
        color: 0xffb200,
        vertexColors: THREE.FaceColors
      }),
      new THREE.MeshToonMaterial({
        color: 0xffb200,
        vertexColors: THREE.FaceColors
      })
    ];
    loader.load('/models/ovni-2.8.glb', function (gltf) {
      ovni = gltf.scene;
      ovni.name = 'toto'
      ovni.position.z = -10;
      // gltf.scene.traverse(function (child) {
      //   if ((child).isMesh) {
      //     const m = child
      //     m.receiveShadow = true
      //     m.castShadow = true
      //     m.position.z = -10;
      //     m.name = 'toto'

      //   }
      // })
      scene.add(ovni)
      // that.mesh = new THREE.Mesh(geometry, materials);
      // that.mesh.castShadow = true;
      // scene.add(that.mesh);


    },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
      },
      (error) => {
        console.log(error)
      }
    );
  })
}