var scene;
var renderer;
var camera;
var WIDTH;
var HEIGHT;

// setup the scene, camera, engine
function createScene() {
  scene = new THREE.Scene();
  var render_blur = false;
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;
  camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 1000);
  camera.position.z = 10;
  // do not forget to add antialiasing, cubes looks very bad without it
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  // renderer.setClearColor(new THREE.Color(0x111111, 1.0));
  renderer.setSize(WIDTH , HEIGHT);
  document.body.appendChild(renderer.domElement);

}

// creating holder for cubes
var SpaceShip = function () {
  var cube = new THREE.BoxGeometry( 1, 1, 1 );
  var material = new THREE.MeshBasicMaterial({
    color: 0xff0000,
    vertexColors: THREE.FaceColors
  });
  this.mesh = new THREE.Mesh(cube, material);
}
function createSpaceShip(){ 
	spaceShip = new SpaceShip();
	//spaceShip.mesh.scale.set(.25,.25,.25);
	//spaceShip.mesh.position.y = -100;
	scene.add(spaceShip.mesh);
}



var mousePos={x:0, y:0};

// now handle the mousemove event

function handleMouseMove(event) {

	// here we are converting the mouse position value received 
	// to a normalized value varying between -1 and 1;
	// this is the formula for the horizontal axis:
	
	var tx = -1 + (event.clientX / WIDTH)*2;

	// for the vertical axis, we need to inverse the formula 
	// because the 2D y-axis goes the opposite direction of the 3D y-axis
	
	var ty = 1 - (event.clientY / HEIGHT)*2;
	mousePos = {x:tx, y:ty};

}

function updatePlane(){
	// let's move the spaceShip between -100 and 100 on the horizontal axis, 
	// and between 25 and 175 on the vertical axis,
	// depending on the mouse position which ranges between -1 and 1 on both axes;
	// to achieve that we use a normalize function (see below)	
	var targetX = normalize(mousePos.x,-1,1,-4, 4);
	var targetY = normalize(mousePos.y,-1,1,-3, 3);
	// Move the plane at each frame by adding a fraction of the remaining distance
	spaceShip.mesh.position.y += (targetY - spaceShip.mesh.position.y)*0.1;
	spaceShip.mesh.position.x += (targetX - spaceShip.mesh.position.x)*0.1;
  // Rotate the plane proportionally to the remaining distance
	spaceShip.mesh.rotation.z = (targetY-spaceShip.mesh.position.y)*0.1;
	spaceShip.mesh.rotation.x = (spaceShip.mesh.position.y-targetY)*0.05;
}

function normalize(v,vmin,vmax,tmin, tmax){
	var nv = Math.max(Math.min(v,vmax), vmin);
	var dv = vmax-vmin;
	var pc = (nv-vmin)/dv;
	var dt = tmax-tmin;
	var tv = tmin + (pc*dt);
	return tv;
}

function render() {
  updatePlane();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}



window.addEventListener('load', init, false);

function init() {
  document.addEventListener('mousemove', handleMouseMove, false);
  createScene();
  createSpaceShip();
  render();
}