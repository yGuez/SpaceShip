var Score = function() {
    this.number = document.getElementById('score');
    this.point = parseInt(1);
    
}

Score.prototype.add = function(){
    this.point += parseInt(1);
    this.number.innerHTML = this.point;
}