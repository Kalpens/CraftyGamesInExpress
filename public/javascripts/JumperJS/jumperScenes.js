var screenWidth = 750;
var screenHeight = 880;
var score = 0;

Crafty.defineScene('JumperGame', function () {
var hitCounter = 0;
var spawnpointy = -50;
var spawnpointsx = [100, 200, 300, 400, 500, 600];
var doubleJumps = 0;

Crafty.init(screenWidth,screenHeight, document.getElementById('game'));
Crafty.background('#000000 url(/images/background-clouds.png) no-repeat center center');
Crafty.audio.add("jump", "audio/JumperAudio/jump.wav");
Crafty.audio.add("swoosh", "audio/JumperAudio/swoosh.mp3");
//Paddle sprite
Crafty.sprite("images/paddle_red.png", {paddle:[0,0,620,120]});
    var assetsObj = {
        "sprites": {
            "images/Player/player.png": {
                // This is the width of each image in pixels
                tile: 80,
                // The height of each image
                tileh: 110,
                // We give names to two individual images
                map: {
                    player_idle: [0, 0],
                    player_left: [0, 1],
                    player_right: [0, 2]
                }
            },
            "images/Player/fire.png": {
                // This is the width of each image in pixels
                tile: 512,
                // The height of each image
                tileh: 512,
                // We give names to two individual images
                map: {
                    fire_1: [0, 0],
                    fire_2: [1, 0],
                    fire_3: [2, 0],
                    fire_4: [0, 1],
                    fire_5: [1, 1],
                    fire_6: [2, 1]
                }
            }
        }
    };

    Crafty.load(assetsObj);
//Floor
Crafty.e('floor, 2D, Canvas, Solid, Color')
    .attr({x: 0, y: screenHeight/1.5 - 10, w: screenWidth, h: 10})
    .color('grey');
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

//Player
var player1 = Crafty.e('Player, 2D, Canvas, Color, Solid, Twoway, Gravity, Collision, GroundAttacher, player_idle, SpriteAnimation')
    .attr({x: 20, y: screenHeight/1.5 -80, w: 40, h: 55})
    .twoway(250)
    .gravity('Solid')
    .reel("stale", 1, [[0, 0]])
    .reel("left", 1, [[1, 0]])
    .reel("right", 1, [[2, 0]])
    .animate("stale", -1)
	//Does not allow jumping if feet are not above ground
    .bind("CheckLanding", function(ground) {
        if (this.y + this.h > ground.y + this.dy) {
            this.canLand = false;
        }
    })
	//Checks if landed, if it did, then jumps
	.bind("LandedOnGround", function() {
			this.jump();
			score++;
			scoreText.text('Score:' + score);
			Crafty.audio.play("jump");
			//After every 10 jumps adds a doublejump
			if(score % 10 == 0){
				doubleJumps++;
				doublejumpText.text('Doublejumps:' + doubleJumps);
			}
	})
	//Checks and allows doublejumps if criteria is met
	.bind("CheckJumping", function(ground) {
    if (!ground && doubleJumps > 0) { 
        this.canJump = true;
    }
	})
    .bind("EnterFrame", function(){
		//Pauses game upon reaching bottom
		if (this.y > screenHeight - 80){
            gameOver();
        }
    })
    //Checks for arrow up keypress and deducts doublejumps
    .bind('KeyUp', function(e) {
        if (e.key == Crafty.keys.UP_ARROW) {
            if(doubleJumps > 0){
				doubleJumps--;
				Crafty.audio.play("swoosh");
				doublejumpText.text('Doublejumps:' + doubleJumps);
			}
         }
        if (e.key == Crafty.keys.LEFT_ARROW) {
              this.animate("stale", -1);
         }
        if (e.key == Crafty.keys.RIGHT_ARROW) {
            this.animate("stale", -1);
        }
  })
    .bind('KeyDown', function(e) {
        if (e.key == Crafty.keys.LEFT_ARROW) {
            this.animate("left", -1);
        }
        if (e.key == Crafty.keys.RIGHT_ARROW) {
            this.animate("right", -1);
        }
    })
	//This prevents from going out of screen
    .bind('Moved', function(evt){
        if (this.hit('solid'))
            this[evt.axis] = evt.oldValue;
    });

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
	
var doublejumpText = Crafty.e('2D, DOM, Text')
    .attr({
        x: screenWidth - 260,
        y: 40,
        z: 100
    })
    .textFont({
    size: '30px',
    weight: 'bold'
});

scoreText.text('Score:' + score);
doublejumpText.text('Doublejumps:' + doubleJumps);
for(a = 0; a < 35; a++){
    Crafty.e('fire, 2D, DOM, fire_1, SpriteAnimation')
        .attr({x:  (25 * a) - 25, y: screenHeight-50, w: 80, h: 80})
        .reel("onFire", 1000, [
            [0, 0],
            [1, 0],
            [2, 0],
            [0, 1],
            [1, 1],
            [2, 1] ])
        .animate("onFire", -1);
}
function drop()
{
    var randomx = spawnpointsx[getRandomArbitrary(0, spawnpointsx.length)];
	var paddleWidth = 80 - score/2;
    Crafty.e('paddle, 2D, DOM, Solid, Gravity, Collision')
        .attr({x: randomx, y: spawnpointy, w: paddleWidth, h: 10})
        .gravity()
        .gravityConst(30)
		.onHit('floor', function(hitDatas) { // on collision with floor
        for (var i = 0; i < hitDatas.length; ++i) { // for each floor hit
          hitDatas[i].obj.destroy(); // destroy the floor
        }
      })
        .bind("EnterFrame", function() {
            if (this.y > screenHeight - 20)
                this.destroy();
        });
}
Crafty.e('spawner, 2D')
.bind("EnterFrame", function(){
    spawnIntensity = score * 2;
    if(score < 8)
    spawnIntensity = 16;
    if (Crafty.frame() % spawnIntensity == 0)
        drop();
});
function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function gameOver() {
  Crafty.pause();
  var all = Crafty.debug();
  for (e in all) all[e].destroy();
  Crafty.enterScene('JumperGameOver');
}

});

//Game Over Scene
Crafty.defineScene('JumperGameOver', function () {

Crafty.init(screenWidth,screenHeight, document.getElementById('game'));
Crafty.background('#000000 url(/images/background-lava.jpg) no-repeat center center');
Crafty.e('2D, DOM, Text').attr({x:280, y:200}).text("GAME OVER").textFont({size:'60px', weight:'bold'}).textColor('red');
Crafty.e("2D, Canvas, Text").attr({x:250, y:400}).text('Your score: ' + score).textFont({size:'40px', weight:'bold'}).textColor('red');
Crafty.e('2D, Canvas, Text, Mouse')
    .attr({x:230, y:500})
    .text('Play again')
    .textFont({size:'20px', weight:'bold'})
    .textColor('red')
    .bind('Click', function(MouseEvent){
        score = 0;
        var all = Crafty.debug();
        for (e in all) all[e].destroy();
        Crafty.enterScene('JumperGame');
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
        Crafty.enterScene('ViewScores');
  });
    addScore();
});

Crafty.defineScene('ViewScores', function () {

    Crafty.init(screenWidth,screenHeight, document.getElementById('game'));
    Crafty.background('#000000 url(/images/background-scoreboard.png) no-repeat center center');
    //Adding table to game div
    $('#game').append('<table id="jumperUserList" width="320" border="1"></table>');
    populateJumperTable();
    Crafty.e('2D, Canvas, Text, Mouse')
        .attr({x:295, y:330})
        .text('Play again')
        .textFont({size:'35px', weight:'bold'})
        .textColor('black')
        .bind('Click', function(MouseEvent){
            score = 0;
            var all = Crafty.debug();
            for (e in all) all[e].destroy();
            $("#jumperUserList").remove();
            Crafty.enterScene('JumperGame');
        });
});
Crafty.defineScene('JumperStart', function () {

    Crafty.init(screenWidth,screenHeight, document.getElementById('game'));
    Crafty.background('#000000 url(/images/background-start.png) no-repeat center center');
    Crafty.e('2D, Canvas, Text, Mouse')
        .attr({x:310, y:450})
        .text('Play')
        .textFont({size:'60px', weight:'bold'})
        .textColor('red')
        .bind('Click', function(MouseEvent){
            score = 0;
            var all = Crafty.debug();
            for (e in all) all[e].destroy();
            Crafty.enterScene('JumperGame');
        });
});

function addScore() {
    var txt;
    var person = prompt("Please enter your userName:", "");
    if (person == null || person == "") {
        alert("Your high score will not be saved!");
    } else{
        addJumperUser(event, person, score);
    }
}