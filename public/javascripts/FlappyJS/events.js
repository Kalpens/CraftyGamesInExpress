$( "#easyBtn" ).click(function() {
    $( "#hardBtn" ).css('color', 'white');
    $( "#easyBtn" ).css('color', 'red');
    difficulity = false;
});
$( "#hardBtn" ).click(function() {
    $( "#easyBtn" ).css('color', 'white');
    $( "#hardBtn" ).css('color', 'red');
    difficulity = true;
});
$( "#startBtn" ).click(function() {
    $('#startScreen').hide();
    $('body').append('<div id="game" style="margin:0 auto; border: thin solid black"> </div>');
    Crafty.enterScene('FlappyGame');
});