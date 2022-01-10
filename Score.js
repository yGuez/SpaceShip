var Score = function() {
    this.number = document.getElementById('score');
    this.point = parseInt(1);
    
}

Score.prototype.add = function(num){
    this.point += parseInt(num);
    this.number.innerHTML = this.point;
}