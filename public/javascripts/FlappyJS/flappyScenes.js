var screenWidth = 1280;
var screenHeight = 800;
var score = 0;
var spawnIntensity = 100;
Crafty.defineScene('FlappyGame', function () {
    Crafty.init(screenWidth,screenHeight, document.getElementById('game'));

    Crafty.background('#000000 url(/images/background-scenery.png) no-repeat center center');
    Crafty.sprite("images/Player/player_idle.png", {player:[0,1,80,110]});

    var assetsObj = {
        "sprites": {
            // This spritesheet has 16 images, in a 2 by 8 grid
            // The dimensions are 453x256
            "images/Flappy/FlappyBird.png": {
                // This is the width of each image in pixels
                tile: 717,
                // The height of each image
                tileh: 610,
                // We give names to two individual images
                map: {
                    flappy_start: [0, 0],
                    flappy_middle1: [0, 1],
                    flappy_middle2: [1, 0],
                    flappy_end: [1, 1],
                }
            }
        }
    };

    Crafty.load(assetsObj, {});



//Left wall
    Crafty.e("2D, DOM, Color, solid, left")
        .attr({x: 0, y: 0, w: 0, h: screenHeight})
        .color('black');
//Right wall
    Crafty.e("2D, DOM, Color, solid, right")
        .attr({x: screenWidth, y: 0, w: 0, h: screenHeight})
        .color('black');
//Top wall
    Crafty.e("2D, DOM, Color, solid, top")
        .attr({x: 0, y: 0, w: screenWidth, h: 0})
        .color('black');
//Bottom wall
    Crafty.e("2D, DOM, Color, solid, bottom")
        .attr({x: 0, y: screenHeight, w: screenWidth, h: 0})
        .color('black');


    var bird = Crafty.e('Bird, 2D, Canvas, Solid, Jumper, Gravity, Collision, flappy_start, SpriteAnimation')
        .attr({x: 200, y: screenHeight/1.5 -80, w: 40, h: 40})
        .gravity()
        .gravityConst(800)
        .bind('KeyUp', function(e) {
            if (e.key == Crafty.keys.UP_ARROW) {
                this.jump();
                this.rotation = -50;
            }
        })
        .reel("flying", 1000, [
            [0, 0], [0, 1], [1, 0], [1, 1], [1, 0], [0, 1], [0, 0]
        ])
        .animate("flying", -1)
        //Does not allow jumping if feet are not above ground
        .bind("EnterFrame", function(){
            //Pauses game upon reaching bottom
            if (this.y > screenHeight || this.y < 0){
                gameOver();
            }
            this.canJump = true;
            this.rotation = this.rotation + 1
        })
        .bind("CheckJumping", function(ground) {
                this.canJump = true;

        })
        //This prevents from going out of screen
        .bind('Moved', function(evt){
            if (this.hit('solid'))
                this[evt.axis] = evt.oldValue;
        });
    function spawn()
    {
        var randomy = getRandomArbitrary(0, 700);
        var tubeWidth = 80;
        Crafty.e('tube, 2D, DOM, Color, Collision')
            .attr({x: 1280, y: 0, w: 80, h: randomy})
            .color("red")
            .onHit('Bird', function(hitDatas) { // on collision with floor
                gameOver();
            })
            .bind("EnterFrame", function() {
                this.x = this.x - 3;
                if(this.x == -100)
                    this.destroy();
            });
        Crafty.e('tube, 2D, DOM, Color, Collision')
            .attr({x: 1280, y: randomy + 150, w: 80, h: 800})
            .color("red")
            .onHit('Bird', function(hitDatas) { // on collision with floor
                gameOver();
            })
            .bind("EnterFrame", function() {
                this.x = this.x - 3;
                if(this.x == -100)
                    this.destroy();
            });
    }
    Crafty.e('spawner, 2D')
        .bind("EnterFrame", function(){
            if (Crafty.frame() % spawnIntensity == 0)
                spawn();
        });
    function gameOver(){
        Crafty.pause();
    }
});
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
