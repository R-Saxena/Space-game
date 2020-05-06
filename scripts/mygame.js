//creating canvas Element
var canvas_width = 630;
var canvas_height = 580;
var canvasElement = $("<canvas id='space_game' width='" + canvas_width + "' height='" + canvas_height + "'></canvas>");
var canvas  = canvasElement.get(0).getContext("2d");
canvasElement.appendTo('body');
var score = 0;
var lvl = 0;
var life = 3;

// player info
var player = {
    color: "#1A1",
    x: canvas_width - 30,
    y: canvas_height - 40,
    width: 32,
    height: 32,
    draw: function () {
        canvas.fillStyle = this.color;
        canvas.fillRect(this.x, this.y, this.width, this.height);
    }
};

var playerBullets = [];

function Bullet(I) {
    
    I.active = true;
    I.xvel = 0;
    I.yvel = -I.speed;
    I.width = 3;
    I.height = 10;
    I.color = "#FF0";
    
    I.inBounds = function () {
      
        return I.x >= 0 && I.x <= canvas_width && I.y >= 0 && I.y <= canvas_height;
    };
    
    I.draw = function () {
        canvas.fillStyle = this.color;
        canvas.fillRect(this.x, this.y, this.width, this.height);
    };
    
    I.update = function () {
        I.x += I.xvel;
        I.y += I.yvel;
        
        I.active = I.active && I.inBounds();
    };
    
    return I;
}

player.shooting = function () {
    
   // Sound.play("shoot");
    
    var bulletPosition = this.midpoint();
    playerBullets.push(Bullet({
        speed: (15 + lvl),
        x: bulletPosition.x,
        y: bulletPosition.y
    }));
};


player.midpoint = function () {
    return {
        x: this.x + this.width / 2,
        y: this.y + this.height / 2
    };
};
 
player.sprite = Sprite("player");
player.draw = function () {
    this.sprite.draw(canvas, this.x, this.y);
};

//enemy details
var enemies_type_1 = [];
function Enemy_1(I) {
    I = I || {};
    I.active = true;
    I.age = Math.floor(Math.random() * 120);
    I.color = "#A2B";
    I.x = canvas_width / 4 + Math.random() * canvas_width / 2;
    I.y = 0;
    I.xvel = 0;
    I.yvel = 2;
    I.width = 32;
    I.height = 32;
    
    I.inBounds = function () {
        return I.x >= 0 && I.x <= canvas_width && I.y >= 0 && I.y <= canvas_height;
    };
    I.sprite = Sprite("enemy");
    I.draw = function () {
        this.sprite.draw(canvas, this.x, this.y);
    };
    
    I.update =  function () {
        I.x += I.xvel;
        I.y += I.yvel + lvl;
        
        I.xvel = 3 * Math.sin(I.age * Math.PI / 64);
        
        I.age += 1;
        I.active = I.active && I.inBounds();
    };
    
    I.explode = function () {
       // Sound.play("explosion");
        this.active = false;
    };
    
    return I;
}

var enemies_type_2 = [];
function Enemy_2(I) {
    I = I || {};
    I.active = true;
    I.age = Math.floor(Math.random() * 120);
    I.color = "#A2B";
    I.x = canvas_width / 4 + Math.random() * canvas_width / 2;
    I.y = 0;
    I.xvel = 0;
    I.yvel = 2;
    I.width = 32;
    I.height = 32;
    
    I.inBounds = function () {
        return I.x >= 0 && I.x <= canvas_width && I.y >= 0 && I.y <= canvas_height;
    };
    I.sprite = Sprite("enemy2");
    I.draw = function () {
        this.sprite.draw(canvas, this.x, this.y);
    };
    
    I.update =  function () {
        I.x += I.xvel;
        I.y += I.yvel + lvl;
        
        I.xvel = 3 * Math.sin(I.age * Math.PI / 64);
        
        I.age += 1;
        I.active = I.active && I.inBounds();
    };
    
    I.explode = function () {
       // Sound.play("explosion");
        this.active = false;
    };
    
    return I;
}

player.explode = function () {
    this.active = false;
};

var display = function () {
    canvas.fillStyle = "#FFF";
    canvas.font = "24px Helvetica";
	canvas.textAlign = "left";
	canvas.textBaseline = "top";
	canvas.fillText("Score: " + score, canvas_width - 130, 32);
};

var level = function () {
    canvas.fillStyle = "#FFF";
    canvas.font = "24px Helvetica";
	canvas.textAlign = "left";
	canvas.textBaseline = "top";
	canvas.fillText("LEVEL : " + (lvl + 1), 32, 32);
};

var lives = function(){
     canvas.fillStyle = "#FFF";
    canvas.font = "24px Helvetica";
	canvas.textAlign = "centre";
	canvas.textBaseline = "top";
	canvas.fillText("LIFE : " + life, ((canvas_width - 80) / 2), 32);  
};

function checks(a){
    return a.y + a.height > canvas_height;
}

function collides(a, b) {
    
    return a.x < b.x + b.width && a.x + a.width  > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}


var intr = 0;
function handleCollisions() {
    
    playerBullets.forEach(function (Bullet) {
        enemies_type_1.forEach(function (Enemy_1) {
            if (collides(Bullet, Enemy_1)) {
                Enemy_1.explode();
                Bullet.active = false;
                score += 10;
                intr += 1;
            }
            if (intr >= 15) {
                lvl += 1;
                intr = 0;
            }
        });
    });
    
    playerBullets.forEach(function (Bullet) {
        enemies_type_2.forEach(function (Enemy_2) {
            if (collides(Bullet, Enemy_2)) {
                Enemy_2.explode();
                Bullet.active = false;
                score += 20;
                intr += 1;
            }
            if (intr >= 15)
                {
                    lvl += 1;
                    intr = 0;
                }
        });
    });
    
    enemies_type_1.forEach(function (Enemy_1) {
        if (collides(Enemy_1, player)) {
            Enemy_1.explode();
            player.explode();
        }
        if(checks(Enemy_1)) {
               life -= 1;
               Enemy_1.explode();
        }
    });
    
    enemies_type_2.forEach(function (Enemy_2) {
        if (collides(Enemy_2, player)) {
            Enemy_2.explode();
            player.explode();
        }
        if(checks(Enemy_2)) {
               life -= 1;
               Enemy_2.explode();
        }
    });
}


// draw function
function draw() {
    
    canvas.clearRect(0, 0, canvas_width, canvas_height);
    
    player.draw();
    
    playerBullets.forEach(function (bullet) {
        bullet.draw();
    });
    
    enemies_type_1.forEach(function (Enemy_1) {
        Enemy_1.draw();
    });
    
    enemies_type_2.forEach(function (Enemy_2) {
        Enemy_2.draw();
    });
    
    display();
    level();
    lives();
}

var ableToShoot = 0;
// update function    
function update() {
    if (keydown.space) {
        ableToShoot += 1;
        if (ableToShoot > 2) {ableToShoot = 2; }
    }
    if (!keydown.space) {
        ableToShoot = 0;
    }
    
    if (ableToShoot ===  1) {
        player.shooting();

    }
    
    if (keydown.left) {
        player.x -= (5 + lvl);
    }
    
    if (keydown.right) {
        player.x += (5 + lvl);
    }
    
    player.x = player.x.clamp(0, canvas_width - player.width);
    
    playerBullets.forEach(function (bullet) {
        bullet.update();
    });
    
    playerBullets = playerBullets.filter(function (bullet) {
       
        return bullet.active;
        
    });
    
    enemies_type_1.forEach(function (Enemy_1) {
        Enemy_1.update();
    });
    
    enemies_type_1 = enemies_type_1.filter(function (Enemy_1) {
       
        return Enemy_1.active;
        
    });
    
    if (Math.random() < 0.02) {
        enemies_type_1.push(Enemy_1());
    }
    
    enemies_type_2.forEach(function (Enemy_2) {
        Enemy_2.update();
    });
    
    enemies_type_2 = enemies_type_2.filter(function (Enemy_2) {
       
        return Enemy_2.active;
        
    });
    
    if (Math.random() < 0.01) {
        enemies_type_2.push(Enemy_2());
    }
    
    handleCollisions();
}

function gameover() {
    if((life === 0) || (player.active === false)){
        clearInterval(loop);
        localStorage.setItem("score",score);
        setTimeout(function () {
        window.location.href="gameover.html";
    }, 200);
    }
}

// Set Interval
var FPS = 30;
var loop =  setInterval(function () {
    update();
    draw();
    gameover();
}, 1000 / FPS);



