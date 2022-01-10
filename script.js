var scene;
var renderer;
var camera;
var WIDTH;
var HEIGHT;
var spaceShip = {};
var terrain;
var terrain2;
var tunel;
var particules;
var explosion;
var counter = 0;
var tangent = new THREE.Vector3();
var axis = new THREE.Vector3();
var up = new THREE.Vector3(0, 1, 0);


function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}
// setup the scene, camera, engine
function createScene() {
  scene = new THREE.Scene();
  var render_blur = false;
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;
  camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 1000);
  camera.position.z = 0.25;
  scene.fog = new THREE.Fog(0x152841, 1, 200);
  // do not forget to add antialiasing, cubes looks very bad without it
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  // renderer.setClearColor(new THREE.Color(0x111111, 1.0));
  renderer.setSize(WIDTH, HEIGHT);
  // renderer.shadowMap.enabled = true;
  container = document.getElementById('world');
  container.appendChild(renderer.domElement);
}

function createLights() {
  var hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .3)
  var shadowLight = new THREE.PointLight(0x111111, 20);
  shadowLight.position.set(1, 3, 3);
  // Allow shadow casting 
  shadowLight.castShadow = true;
  // define the visible area of the projected shadow
  // only for debugging
  // these six values define the boundaries of the yellow box seen above
  shadowLight.shadow.camera.near = 2;
  shadowLight.shadow.camera.far = 5;
  shadowLight.shadow.camera.left = -0.5;
  shadowLight.shadow.camera.right = 0.5;
  shadowLight.shadow.camera.top = 0.5;
  shadowLight.shadow.camera.bottom = -0.5;
  // define the resolution of the shadow; the higher the better, 
  // but also the more expensive and less performant
  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;
  scene.add(shadowLight);
  scene.add(hemisphereLight);
}

function createSpaceShip() {
  spaceShip = new SpaceShip();
}


function createParticules() {
  particules = new Particules();
  scene.add(particules.group);
  particules.mesh.scale.set(0.1, 0.1, 0.1);


}

function createTunel() {
  tunel = new Tunnel();
  scene.add(tunel.tubeMesh);
  console.log(tunel.tubeMesh);
}
/////////mouse///////////////////////////////////////////////
var mousePos = {
  x: 0,
  y: 0
};

function creatExplosion() {
  explosion = new Explosion();
  scene.add(explosion.groupExplosion);

}

function contact(x, y, z) {
  if (particules.collision(spaceShip.mesh)) {
    console.log('hhh')
    creatExplosion();
    explosion.animate(x, y, z);
  }

}
// now handle the mousemove event
function handleMouseMove(event) {
  // here we are converting the mouse position value received 
  // to a normalized value varying between -1 and 1;
  // this is the formula for the horizontal axis:
  var tx = -1 + (event.clientX / WIDTH) * 2;
  // for the vertical axis, we need to inverse the formula 
  // because the 2D y-axis goes the opposite direction of the 3D y-axis
  var ty = 1 - (event.clientY / HEIGHT) * 2;
  mousePos = {
    x: tx,
    y: ty
  };

}

// var socket = io.connect('192.168.1.62:48080');
// socket.on('message', function (message) {
//   console.log('Le serveur a un message pour vous : ' + message);
// })
var mouve = {
  x: 0,
  y: 0
};
function mouveCon() {
  // socket.on('coordo', function (coordo) {
  //   x = 1 + coordo.mouveX;
  //   y = 1 + coordo.mouveY;
  //   mouve = {
  //     x: x,
  //     y: y
  //   }
  // });
  window.addEventListener("mousemove", (event) => {

    x = (event.clientX - (window.innerWidth / 2)) * 0.01;
    y = -(event.clientY - (window.innerHeight / 2)) * 0.01;
    mouve = {
      x: x,
      y: y
    }
  });
}


function updatePlane() {
  // ajout d'un timeOut sinon ça ne marche pas le modèle est pas chargé !
  setTimeout(function () {
    // let's move the spaceShip between -100 and 100 on the horizontal axis, 
    // and between 25 and 175 on the vertical axis,
    // depending on the mouse position which ranges between -1 and 1 on both axes;
    // to achieve that we use a normalize function (see below)	
    /*var targetX = normalize(mousePos.x, -1, 1, -4, 4);
    var targetY = normalize(mousePos.y, -1, 1, -3, 3);*/
    var targetX = mouve.x;
    var targetY = mouve.y;

    // let ovni = scene.getObjectByName(model.name)

    if (ovni) {
      // Move the plane at each frame by adding a fraction of the remaining distance
      ovni.position.y += (targetY - ovni.position.y) * 0.1;
      ovni.position.x += (targetX - ovni.position.x) * 0.1;
      // // Rotate the plane proportionally to the remaining distance

      ovni.rotation.z = (targetY - ovni.position.y) * 0.1;
      ovni.rotation.x = (ovni.position.y - targetY) * 0.05;
      // /* var concat = spaceShip.mesh.position.x + spaceShip.mesh.position.y + spaceShip.mesh.position.z;
      //  console.log('po', Math.round(concat));*/
      particules.collision(ovni, ovni.position.x, ovni.position.y, ovni.position.z);
    }

    // contact(spaceShip.mesh.position.x, spaceShip.mesh.position.y, spaceShip.mesh.position.z);


  }, 100);

}

function normalize(v, vmin, vmax, tmin, tmax) {
  var nv = Math.max(Math.min(v, vmax), vmin);
  var dv = vmax - vmin;
  var pc = (nv - vmin) / dv;
  var dt = tmax - tmin;
  var tv = tmin + (pc * dt);
  return tv;
}

function render() {
  tunel.updateMaterialOffset();
  particules.move();
  updatePlane();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

window.addEventListener('load', init, false);

function init() {
  document.addEventListener('mousemove', handleMouseMove, false);
  mouveCon();
  createScene();
  createLights();
  createSpaceShip();
  createParticules();
  createTunel();
  render();
}