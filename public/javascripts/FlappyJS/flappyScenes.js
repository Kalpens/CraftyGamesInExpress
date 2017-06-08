var screenWidth = 1280;
var screenHeight = 800;
var score = 0;
//Lower intensity == more pipes
var spawnIntensity = 150;
var minSpawnHeight = 50;
var maxSpawnHeight = 500;
var gravityConst = 800;
var difficulity = false;
//The higher speed, the higher pipes move
var speed = 3;
Crafty.defineScene('FlappyGame', function () {
    Crafty.init(screenWidth,screenHeight, document.getElementById('game'));
    Crafty.background('#000000 url(/images/background-scenery.png) no-repeat center center');
    if(difficulity){
        minSpawnHeight = 0;
        maxSpawnHeight = 700;
        spawnIntensity = 80;
        speed = 5;
    }
    Crafty.audio.add("die", "audio/FlappyAudio/die.wav");
    Crafty.audio.add("hit", "audio/FlappyAudio/hit.wav");
    Crafty.audio.add("point", "audio/FlappyAudio/point.wav");
    Crafty.audio.add("wing", "audio/FlappyAudio/wing.wav");

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
                    flappy_end: [1, 1]
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

    var scoreText = Crafty.e('2D, DOM, Text')
        .attr({
            x: screenWidth - 150,
            y: 10,
            z: 100
        })
        .textFont({
            size: '30px',
            weight: 'bold'
        });
    scoreText.text('Score:' + score);

    var bird = Crafty.e('Bird, 2D, Canvas, Solid, Jumper, Gravity, Collision, flappy_start, SpriteAnimation')
        .attr({x: 200, y: screenHeight/6, w: 40, h: 40})
        .gravity()
        .gravityConst(gravityConst)
        .bind('KeyUp', function(e) {
            if (e.key == Crafty.keys.UP_ARROW) {
                this.jump();
                this.rotation = -50;
                Crafty.audio.play("wing");
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
                Crafty.audio.play("die");
                gameOver();
            }
            this.canJump = true;
            this.rotation = this.rotation + 1
        })
        .bind("CheckJumping", function(ground) {
                this.canJump = true;

        });
    function spawn()
    {
        var randomy = getRandomArbitrary(minSpawnHeight, maxSpawnHeight);
        var tubeWidth = 80;
        Crafty.e('tube, 2D, DOM, Collision, pipeDown')
            .attr({x: 1280, y: 0, w: 80, h: randomy})
            .onHit('Bird', function(hitDatas) { // on collision with floor
                gameOver();
            })
            .bind("EnterFrame", function() {
                this.x = this.x - speed;
                if(this.x == -100)
                    this.destroy();
                if(this.x == bird.x) {
                    score++;
                    scoreText.text('Score:' + score);
                    Crafty.audio.togglePause('wing');
                    Crafty.audio.play("point");
                }
            });
        Crafty.e('tube, 2D, DOM, Collision, pipeUp')
            .attr({x: 1280, y: randomy + 150, w: 80, h: 800 - randomy})
            .onHit('Bird', function(hitDatas) { // on collision with floor
                Crafty.audio.togglePause('point');
                Crafty.audio.togglePause('wing');
                Crafty.audio.play("hit");
                gameOver();
            })
            .bind("EnterFrame", function() {
                this.x = this.x - speed;
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
        Crafty.enterScene('JumperGameOver');
    }
    function getRandomArbitrary(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
});

Crafty.defineScene('StartScreen', function () {
    Crafty.init(screenWidth,screenHeight, document.getElementById('game'));
    Crafty.background('#000000 url(/images/background-scenery.png) no-repeat center center');

    Crafty.e('2D, DOM, Text')
        .attr({
            x: screenWidth / 2 - 100,
            y: screenHeight / 5,
            z: 100
        })
        .text('Fljuppy')
        .textAlign()
        .textFont({
            size: '80px'
        });

    Crafty.e('2D, Canvas, Text, Mouse')
        .attr({ x: screenWidth / 2 - 20 ,
                y: screenHeight / 2.5,})
        .text('Play')
        .textFont({size:'40px', weight:'bold'})
        .textColor('Orange')
        .bind('Click', function(MouseEvent){
            score = 0;
            var all = Crafty.debug();
            for (e in all) all[e].destroy();
            Crafty.enterScene('FlappyGame');
        });
    var hard = Crafty.e('2D, Canvas, Text, Mouse')
        .attr({ x: screenWidth / 2 + 60 ,
            y: screenHeight / 2,})
        .text('Hard')
        .textFont({size:'40px', weight:'bold'})
        .textColor('Black')
        .bind('Click', function(MouseEvent){
            difficulity = true;
            this.textColor('Blue');
            easy.textColor('Black');
        });
    var easy = Crafty.e('2D, Canvas, Text, Mouse')
        .attr({ x: screenWidth / 2 - 100 ,
            y: screenHeight / 2,})
        .text('Easy')
        .textFont({size:'40px', weight:'bold'})
        .textColor('Blue')
        .bind('Click', function(MouseEvent){
            difficulity = false;
            this.textColor('Blue');
            hard.textColor('Black');
        });

    function startGane(){
        Crafty.pause();
    }
});
Crafty.defineScene('JumperGameOver', function () {

    Crafty.init(screenWidth,screenHeight, document.getElementById('game'));
    Crafty.background('#000000 url(/images/background-lava.jpg) no-repeat center center');
    Crafty.e('2D, DOM, Text').attr({x:280, y:200}).text("GAME OVER").textFont({size:'60px', weight:'bold'}).textColor('red');
    Crafty.e("2D, Canvas, Text").attr({x:250, y:400}).text('Your score: ' + score).textFont({size:'40px', weight:'bold'}).textColor('red');
    Crafty.e('2D, Canvas, Text, Mouse')
        .attr({x:230, y:500})
        .text('Play again')
        .textFont({size:'60px', weight:'bold'})
        .textColor('yellow')
        .bind('Click', function(MouseEvent){
            score = 0;
            var all = Crafty.debug();
            for (e in all) all[e].destroy();
            Crafty.enterScene('FlappyGame');
        });
    Crafty.e('2D, Canvas, Text, Mouse')
        .attr({x:380, y:500})
        .text('View High Scores')
        .textFont({size:'20px', weight:'bold'})
        .textColor('red')
        .bind('Click', function(MouseEvent){
            score = 0;
            var all = Crafty.debug();
            for (e in all) all[e].destroy();
            Crafty.enterScene('FlappyGame');
        });
});
