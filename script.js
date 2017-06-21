var scene;
var renderer;
var camera;
var WIDTH;
var HEIGHT;
var spaceShip;
var terrain;
var terrain2;
var tunel;
var counter = 0;
var tangent = new THREE.Vector3();
var axis = new THREE.Vector3();
var up = new THREE.Vector3(0, 1, 0);

// setup the scene, camera, engine
function createScene() {
  scene = new THREE.Scene();
  var render_blur = false;
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;
  camera = new THREE.PerspectiveCamera(45, WIDTH / HEIGHT, 0.1, 1000);
  camera.position.z = 0.25;
  scene.fog = new THREE.Fog(0x152841, 1, 400);
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
      /* new THREE.MeshPhongMaterial({
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
       })*/
    ];
    that.mesh = new THREE.Mesh(geometry, materials);
    that.mesh.castShadow = true;
    scene.add(that.mesh);
    that.mesh.position.z = -10;
    // that.mesh.scale.set(0.1,0.1,0.1);
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
///////////////////////////tunel//////////////////////////////////
Tunnel = function () {
  // Empty array to store the points along the path
  points = [];

  // Define points along Z axis to create a curve
  for (var i = 0; i < 3; i += 1) {
    points.push(new THREE.Vector3(0, 0, -500 * (i / 2)));
    console.log(points);
  }

  // Set custom Y position for the last point
  points[2].y = -60;

  // Create a curve based on the points
  curve = new THREE.CatmullRomCurve3(points);
  // Define the curve type

  // Empty geometry
  var geometry = new THREE.Geometry();
  // Create vertices based on the curve
  geometry.vertices = curve.getPoints(70);
  // Create a line from the points with a basic line material
  this.splineMesh = new THREE.Line(geometry, new THREE.LineBasicMaterial());

  // Create a material for the tunnel with a custom texture
  // Set side to BackSide since the camera is inside the tunnel
  var texture = new THREE.TextureLoader();
  var map = texture.load("/images/etoiles.jpg");
  this.tubeMaterial = new THREE.MeshStandardMaterial({
    side: THREE.BackSide,
    map: map
  });


  this.tubeMaterial.map.wrapS = THREE.RepeatWrapping;
  this.tubeMaterial.map.wrapT = THREE.RepeatWrapping;
  this.tubeMaterial.map.repeat.set(30, 6);


  // Create a tube geometry based on the curve
  this.tubeGeometry = new THREE.TubeGeometry(curve, 70, 9, 50, false);
  // Create a mesh based on the tube geometry and its material
  this.tubeMesh = new THREE.Mesh(this.tubeGeometry, this.tubeMaterial);
  // Push the tube into the scene
  console.log('tubepositio', this.tubeGeometry);

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

Particules = function () {
  var geometry = new THREE.TorusGeometry(10, 3, 16, 100);
  var sphere = new THREE.SphereGeometry(0.5,5, 5);
  var matYellow = new THREE.MeshBasicMaterial({
    color: 0xffb200,
    vertexColors: THREE.FaceColors
  })
  var matOrange = new THREE.MeshBasicMaterial({
    color: 0xff8c00,
    vertexColors: THREE.FaceColors
  })
  this.mesh = new THREE.Mesh(geometry, matYellow);
   this.group = new THREE.Group();
  for ( var j = 0; j < 100; j ++ ) {
    this.sphereMesh = new THREE.Mesh(sphere, matOrange);
    /*this.sphereMesh.position.x = Math.random() * 2000 - 1000;
    this.sphereMesh.position.y = Math.random() * 2000 - 1000;
    this.sphereMesh.position.z = Math.random() * 2000 - 1000;

    this.sphereMesh.rotation.x = Math.random() * 360 * ( Math.PI / 180 );
    this.sphereMesh.rotation.y = Math.random() * 360 * ( Math.PI / 180 );*/
    this.group.add(this.sphereMesh );
  }

 
  this.group.add(this.mesh);
  this.posY =  [];
  this.posX =  [];
  this.posZ = [];
  this.offset = new THREE.Vector3((Math.random()-0.5)*0.025, (Math.random()-0.5)*0.025, 0);
  for (var i = 0; i < this.group.children.length; i++) {
     this.posY.push(this.group.children[i].position.y = Math.random() * 12 - 12);
     this.posX.push(this.group.children[i].position.x = Math.random() * 12 - 12);
    // this.posZ.push(this.group.children[i].position.z = Math.random() * 500 - 1);
    
  }
}

Particules.prototype.move = function () {
  /*if (counter <= 1) {*/
    
      
    for (var i = 0; i < this.group.children.length; i++) {
      var pt = curve.getPoint(1 - (counter += 0.01)%1);
     this.group.children[i].position.set(pt.x + this.posX[i], pt.y + this.posY[i], pt.z);   
  } 
    
    
    // tangent = curve.getTangentAt(counter).normalize();
    // axis.crossVectors(up, tangent).normalize();
    // var radians = Math.acos(up.dot(tangent));
    // this.mesh.quaternion.setFromAxisAngle(axis, radians);
    // counter += 0.001;

  /*} else {
    counter = 0;
  }*/
  
}

function createParticules() {
  torus = new Particules();
  scene.add(torus.group);
  // torus.mesh.position.z = -300;
  torus.mesh.scale.set(0.1, 0.1, 0.1);
}

function createTunel() {
  tunel = new Tunnel();
  scene.add(tunel.tubeMesh);
  //tunel.tubeMesh.scale.set(500, 500, 500);
  console.log(tunel.tubeMesh);
}
/////////mouse///////////////////////////////////////////////
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
var socket = io.connect('http://172.26.2.185:48080');
socket.on('message', function (message) {
  console.log('Le serveur a un message pour vous : ' + message);
})
var mouve = {
  x: 0,
  y: 0
};

function mouveCon() {

  socket.on('coordo', function (coordo) {
    x = 1 + coordo.mouveX;
    y = 1 + coordo.mouveY;
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
    var targetX = mouve.x / 100;
    var targetY = mouve.y / 100;

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
  tunel.updateMaterialOffset();
  torus.move();
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