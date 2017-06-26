var score = new Score();
Particules = function () {
    var geometry = new THREE.TorusGeometry(10, 3, 16, 100);
    var sphere = new THREE.SphereGeometry(0.5, 5, 5);
    var matYellow = new THREE.MeshBasicMaterial({
        color: 0xffb200,
        vertexColors: THREE.FaceColors
    })
    /*var matOrange = new THREE.MeshBasicMaterial({
      color: 0xff8c00,
      vertexColors: THREE.FaceColors
    })*/
    this.mesh = new THREE.Mesh(geometry, matYellow);
    this.group = new THREE.Group();
    for (var j = 0; j < 100; j++) {
        var matOrange = new THREE.MeshBasicMaterial({
            color: 0xff8c00,
            vertexColors: THREE.FaceColors
        })
        this.sphereMesh = new THREE.Mesh(sphere, matOrange);
        /*this.sphereMesh.position.x = Math.random() * 2000 - 1000;
        this.sphereMesh.position.y = Math.random() * 2000 - 1000;
        this.sphereMesh.position.z = Math.random() * 2000 - 1000;

        this.sphereMesh.rotation.x = Math.random() * 360 * ( Math.PI / 180 );
        this.sphereMesh.rotation.y = Math.random() * 360 * ( Math.PI / 180 );*/
        this.group.add(this.sphereMesh);
    }

    this.group.add(this.mesh);
    this.posY = [];
    this.posX = [];
    this.posZ = [];
    this.offset = new THREE.Vector3((Math.random() - 0.5) * 0.025, (Math.random() - 0.5) * 0.025, 0);
    for (var i = 0; i < this.group.children.length; i++) {
        this.posY.push(this.group.children[i].position.y = getRandom(-6, 6));
        this.posX.push(this.group.children[i].position.x = getRandom(-6, 6));
        this.posZ.push(Math.random() * 1 - 0);
    }
    console.log('part', this.group.children[2]);
}

Particules.prototype.move = function () {
    for (var i = 0; i < this.group.children.length; i++) {
        var pt = curve.getPoint(1 - (counter + this.posZ[i]) % 1);
        this.group.children[i].position.set(pt.x + this.posX[i], pt.y + this.posY[i], pt.z);
    }
    counter += 0.0003;
}

Particules.prototype.collision = function (collider, x, y, z) {
    var concatPos = collider.position.x + collider.position.y + collider.position.z;
    var colliderMesh = Math.round(concatPos * 100) / 100;
    for (var i = 0; i < this.group.children.length; i++) {
        // var ray =  new THREE.Ray(this.group.children[i].position, new THREE.Vector3(this.group.children[i].position.x, this.group.children[i].position.y, collider.position.z).normalize());
        // var distance = this.group.children[i].position.distanceTo(collider.position);
        if (this.group.children[i].position.distanceTo(collider.position) <= 1.5) {
            //  this.group.children[i].material.color.setHex(0xf600ff);
            // this.group.children[i].material.color.setHex(0xf600ff);
            score.add(1);
            this.group.children[i].visible = false;
            var explosion = new Explosion();
            scene.add(explosion.groupExplosion);
            explosion.animate(x,y,z);
            // this.group.children.splice(i, -1);
            
            // delete this.group.children[i];
            
        }
        
    }
    /*this.group.children.map(function(x, i, a2){
        if(x.position.distanceTo(collider.position) <= 0.5){
            a2.splice(i, 1);
        }
    })
*/
}