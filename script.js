// setup the scene, camera, engine
function createScene() {
  var scene = new THREE.Scene();
  var render_blur = false;
  var _w = 500;
  var _h = 500;
  var camera = new THREE.PerspectiveCamera(45, _w / _h, 0.1, 1000);
  camera.position.z = 10;
  // do not forget to add antialiasing, cubes looks very bad without it
  var renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  // renderer.setClearColor(new THREE.Color(0x111111, 1.0));
  renderer.setSize(_w, _h);
  document.body.appendChild(renderer.domElement);

}

// creating holder for cubes
var create
var group = new THREE.Object3D();
var geometry = new THREE.BoxGeometry(1, 1, 1);
// setup material
var colors = [0x20a0aa, 0xfead13, 0xed4039];
var material = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  vertexColors: THREE.FaceColors
});
for (var i = 0; i < geometry.faces.length; i++) {
  geometry.faces[i].color.setHex(colors[Math.floor(i / 4)]);
}

var cubes = [];
// positions of cubes
var cubes_pos = [
  [-1, 1, -1],
  [-1, 1, 1],
  [1, 1, 1],
  [1, 1, -1],
  [1, -1, -1],
  [1, -1, 1],
  [-1, -1, 1],
  [-1, -1, -1]
];

// generating cubes
for (var k = 0; k < cubes_pos.length; k++) {
  var cube = new THREE.Mesh(geometry, material);
  cube.position.x = cubes_pos[k][0];
  cube.position.y = cubes_pos[k][1];
  cube.position.z = cubes_pos[k][2];

  cubes.push(cube);
  group.add(cube);
}
// setting start rotation for cubes

console.log(group);
// adding cubes to scene
scene.add(group);
var canvas = document.querySelector('canvas');
canvas.addEventListener("click", move, false);

function move() {
  for (var i = 0; i < group.children.length; i++) {
    group.children[i].rotation.x += 0.062;
    group.children[i].rotation.y += -0.078;

  }



}

function render() {
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();