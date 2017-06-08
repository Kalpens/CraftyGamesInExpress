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
        },
        "images/Flappy/pipeUp.png": {
            // This is the width of each image in pixels
            tile: 52,
            // The height of each image
            tileh: 320,
            // We give names to two individual images
            map: {
                pipeUp: [0, 0]
            }
        },
        "images/Flappy/pipeDown.png": {
            // This is the width of each image in pixels
            tile: 52,
            // The height of each image
            tileh: 320,
            // We give names to two individual images
            map: {
                pipeDown: [0, 0]
            }
        }
    }
};

Crafty.load(assetsObj);

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