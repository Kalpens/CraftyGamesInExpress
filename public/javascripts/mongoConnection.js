/**
 * Created by Kalpens on 6/5/2017.
 */

// Fill table with data
function populateJumperTable() {
    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/jumperusers/jumperuserlist', function( data ) {
        // Stick our jumper data object into jumperuser array
        jumperUserList = data;
        //Sort data
        data.sort(function (a, b) {  return b.score - a.score;  });
        counter = 0;
        tableContent += '<tr><th>Pos</th><th>UserName</th><th>Score</th></tr>';
        $.each(data, function(){
            //VERY VERY BAD WAY to limit 10 scores displayed....
            if(counter != 10){
            counter++;
            tableContent += '<tr>';
            tableContent += '<td>' + counter + '</td>';
            tableContent += '<td>' + this.username + '</td>';
            tableContent += '<td>' + this.score + '</td>';
            tableContent += '</tr>';
            }
        });
        // Inject the whole content string into our existing HTML table
        $('#jumperUserList').html(tableContent);
    });
};
//Adding of user
function addJumperUser(event, userName, score) {
    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    if(userName === '' || score === 0)
        errorCount++;

    // Check and make sure errorCount's still at 0
    if(errorCount === 0) {

        // If it is, compile all album info into one object
        var newJumperUser = {
            'userName': userName,
            'score': score
        };

        // Use AJAX to post the object to our addalbum service
        $.ajax({
            type: 'POST',
            data: newJumperUser,
            url: '/jumperusers/addjumperuser',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {
                return true;
            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

function populateFljuppyTable() {
    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/fljuppyusers/fljuppyuserlist', function( data ) {
        // Stick our jumper data object into jumperuser array
        fljuppyUserList = data;
        //Sort data
        data.sort(function (a, b) {  return b.score - a.score;  });
        counter = 0;
        tableContent += '<tr><th>Pos</th><th>UserName</th><th>Score</th><th>Difficulity</th></tr>';
        $.each(data, function(){
            //VERY VERY BAD WAY to limit 10 scores displayed....
            if(counter != 10){
                counter++;
                tableContent += '<tr id="jumperRow">';
                tableContent += '<td>' + counter + '</td>';
                tableContent += '<td>' + this.username + '</td>';
                tableContent += '<td>' + this.score + '</td>';
                tableContent += '<td>' + this.difficulity + '</td>';
                tableContent += '</tr>';
            }
        });
        // Inject the whole content string into our existing HTML table
        $('#fljuppyUserList').html(tableContent);
    });
};

//Adding of user
function addFljuppyUser(event, userName, score, difficulity) {
    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    if(userName === '' || score < 0)
        errorCount++;

    // Check and make sure errorCount's still at 0
    if(errorCount === 0) {

        // If it is, compile all album info into one object
        var newFljuppyUser = {
            'userName': userName,
            'score': score,
            'difficulity': difficulity
        };

        // Use AJAX to post the object to our addalbum service
        $.ajax({
            type: 'POST',
            data: newFljuppyUser,
            url: '/fljuppyusers/addfljuppyuser',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {
                return true;
            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill username field');
        return false;
    }
};