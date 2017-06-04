var scene;
var renderer;
var camera;
var WIDTH;
var HEIGHT;
var spaceShip;
var terrain;
var terrain2;

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
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.enabled= true;
  document.body.appendChild(renderer.domElement);

}

function createLights() {
  var hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9)
  var shadowLight = new THREE.PointLight(0x111111, 30);
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

// creating holder for cubes
var SpaceShip = function () {
  var that = this;
  var loader = new THREE.JSONLoader();
  loader.load('/models/ovni.json', function (geometry) {
    var materials = [
      /*  new THREE.MeshBasicMaterial({
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
        })*/
      new THREE.MeshPhongMaterial({
        color: 0xd13a00,
        shading: THREE.FlatShading
      }),
      new THREE.MeshPhongMaterial({
        color: 0x1d274c,
        shading: THREE.FlatShading
      }),
      new THREE.MeshPhongMaterial({
        color: 0x1c494d,
        shading: THREE.FlatShading
      }),
      new THREE.MeshPhongMaterial({
        color: 0xffb200,
        shading: THREE.FlatShading
      }),
      new THREE.MeshPhongMaterial({
        color: 0xffb200,
        shading: THREE.FlatShading
      })
    ];
    that.mesh = new THREE.Mesh(geometry, materials);
    that.mesh.castShadow = true;
    scene.add(that.mesh);
  });

}

function createSpaceShip() {
  spaceShip = new SpaceShip();
}

////////////////////////////////////sea//////////////////////////
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


function createTerrain() {
  terrain = new Terrain();
 
  terrain.mesh.position.y = -3;
 
  scene.add(terrain.mesh);
  
  console.log(terrain);
  
}
function createTerrain2() {
  terrain2 = new Terrain();

  terrain2.mesh.position.y = -3;
  terrain2.mesh.position.z = -100;
 
  scene.add(terrain2.mesh);
  console.log(terrain2.color);
}
var mousePos = {
  x: 0,
  y: 0
};

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

function updatePlane() {
  // ajout d'un timeOut sinon ça ne marche pas le modèle est pas chargé !
  setTimeout(function () {
    // let's move the spaceShip between -100 and 100 on the horizontal axis, 
    // and between 25 and 175 on the vertical axis,
    // depending on the mouse position which ranges between -1 and 1 on both axes;
    // to achieve that we use a normalize function (see below)	
    var targetX = normalize(mousePos.x, -1, 1, -4, 4);
    var targetY = normalize(mousePos.y, -1, 1, -3, 3);
    // Move the plane at each frame by adding a fraction of the remaining distance
    spaceShip.mesh.position.y += (targetY - spaceShip.mesh.position.y) * 0.1;
    spaceShip.mesh.position.x += (targetX - spaceShip.mesh.position.x) * 0.1;
    // Rotate the plane proportionally to the remaining distance
    spaceShip.mesh.rotation.z = (targetY - spaceShip.mesh.position.y) * 0.1;
    spaceShip.mesh.rotation.x = (spaceShip.mesh.position.y - targetY) * 0.05;
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
  terrain.mesh.position.z += 0.2;
  terrain2.mesh.position.z += 0.2;
  /*if(terrain.mesh.position.z >= 100){
    terrain.mesh.position.z = 0;
  }*/
  
  updatePlane();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}



window.addEventListener('load', init, false);

function init() {
  document.addEventListener('mousemove', handleMouseMove, false);
  createScene();
  createLights();
  createSpaceShip();
  createTerrain();
  createTerrain2();
  render();
}