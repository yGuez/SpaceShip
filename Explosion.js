var Explosion = function () {

    var geom = new THREE.TetrahedronGeometry(0.5, 2);
    var mat = new THREE.MeshToonMaterial({
        color: 0xffb200,
      });
    this.groupExplosion = new THREE.Group();   
    for (var j = 0; j < 7; j++) {
        this.mesh = new THREE.Mesh(geom, mat);
        this.groupExplosion.add(this.mesh);        
    }

}

/*Explosion.prototype.kill = function() {
    scene.remove(this.groupExplosion);
}*/

Explosion.prototype.animate = function(positionX, positionY, positionZ) {
    var that = this;
    this.groupExplosion.position.x = positionX;
    this.groupExplosion.position.y = positionY;
    this.groupExplosion.position.z = positionZ;
    var randX = getRandom(-3, 3);
    var randY = getRandom(-3, 3);
    for (var i = 0; i < this.groupExplosion.children.length; i++) {
      TweenMax.to(this.groupExplosion.children[i].position, 0.5, {x:randX, y:randY});  
      TweenMax.to(this.groupExplosion.children[i].scale, 0.5, {x:"0.1", y:"0.1", z:"0.1", ease:Power2.easeOut, onComplete: function(){
      scene.remove(that.groupExplosion);
    }});        
    }
}

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}