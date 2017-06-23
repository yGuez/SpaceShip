var Explosion = function () {
    var geom = new THREE.TetrahedronGeometry(0.5, 0);
    var mat = new THREE.MeshBasicMaterial({
        color: 0x1d274c,
        vertexColors: THREE.FaceColors
      });
    this.groupExplosion = new THREE.Group();   
    for (var j = 0; j < 10; j++) {
        this.mesh = new THREE.Mesh(geom, mat);
        this.groupExplosion.add(this.mesh);        
    }
}

Explosion.prototype.animate = function(positionX, positionY, positionZ) {
    this.groupExplosion.position.x = positionX;
    this.groupExplosion.position.y = positionY;
    this.groupExplosion.position.z = positionZ;
    var randX = getRandom(-3, 3);
    var randY = getRandom(-3, 3);
    for (var i = 0; i < this.groupExplosion.children.length; i++) {
      TweenMax.to(this.groupExplosion.children[i].position, 1, {x:randX, y:randY});  
      TweenMax.to(this.groupExplosion.children[i].scale, 1, {x:"0.1", y:"0.1"});        
    }
}

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}