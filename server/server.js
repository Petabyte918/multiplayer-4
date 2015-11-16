var express = require('express');
var bodyParser = require("body-parser");
var request = require('request');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));

var i = 0;

var players = {};
players["totalPlayers"] = 1;

app.get('/test', function (req, res) {
    //console.log('/test');
    var name = "player" + i;
    res.cookie('user', name, { maxAge: 900000, httpOnly: false });
    res.send("Cookie set: " + name);
    i++;
})


/////////////////////////  bitslap's birthday bash


app.get('/v2/getUsername', function (req, res) {                                                      
    console.log('/v2/getUsername');
    var name = "player" + i;
    var displayName = name;
    if (req.query.displayName != null) { // req.query for GET requests
        displayName = req.query.displayName;
        if (displayName.length > 19) {
            displayName = displayName.slice(0, 17) + "...";
        }
    }
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type', 'application/json');
    i++;
    players["totalPlayers"] = i;
    res.send(JSON.stringify({ "username": name, "displayName": displayName }, null, 3));
    players[name] = {};
    players[name]["displayName"] = displayName;
    players[name]["lastMove"] = 0;
    players[name]["x"] = 32;
    players[name]["y"] = 458;
    players[name]["score"] = 0;
    console.log("Registered " + name + ", displayName " + displayName);
})


app.get('/v1/getUsername', function (req, res) { 

    console.log('/v1/getUsername');
    var name = "player" + i;
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type', 'application/json');       
    i++;                                                                        
    players["totalPlayers"] = i;
    res.send(JSON.stringify({ username: name }, null, 3));
    players[name] = {};
    players[name]["lastMove"] = 0;
    players[name]["x"] = 32;
    players[name]["y"] = 458;
    players[name]["score"] = 0;
    console.log("Registered " + name);
})


app.get('/v[12]/addCoin', function (req, res) { 
    console.log("/addCoin");
    if (!players["coin"]) {
        players["coin"] = {}
    }
    players["coin"]["x"] = parseInt(req.query.x);
    players["coin"]["y"] = parseInt(req.query.y);
   // console.log("added coin at "+     players["coin"]["x"] + "," +     players["coin"]["y"] );
    res.send("Success");
})
           
                                                                                                                              
app.get('/v[12]/getData', function (req, res) {                                                                                               
 //   console.log('/getData');
    res.header("Access-Control-Allow-Origin", "*"); //important, otherwise its not working 
    res.setHeader('Content-Type', 'application/json');
    var move = -1;
    if (req.query.username != null) { // req.query for GET requests
        player = req.query.username;
 //     console.log("/getData for " + player + " (lastMove=" + players[player]["lastMove"] + ")");
        if (null != players[player]) {
            move = players[player]["lastMove"];
        }
    }
    var data = "";
//    for (player in players) {
//      data += JSON.stringify(player: {username:player, x:player["x"], y:player["y"], move:player["move"]});
//    }
//console.log(JSON.stringify(players));
    res.send(JSON.stringify(players, null, 3));  
})                                                                                                                                   
     
app.post('/v[12]/sendMove', function (req, res) {

   var move = null;
    if (req.body["username"] != null && req.body["move"] != null ) { //&& null != players[req.body["username"]]) {
    //  console.log("/sendMove for " + req.body["username"] + " (" + req.body["move"] + ")");
        move = req.body["move"];
        player = req.body["username"];
        players[player]["lastMove"] = move;
        players[player]["x"] = req.body["x"];
        players[player]["y"] = req.body["y"];
      
    }
    res.setHeader('Content-Type', 'application/json');
    res.header("Access-Control-Allow-Origin", "*"); //important, otherwise its not working 
    res.send(JSON.stringify({ move: move }, null, 3));

})   

app.get('/v[12]/getScores', function (req, res) {                                                      
   // console.log('/getScores');                                                                                    
    res.header("Access-Control-Allow-Origin", "*"); //important, otherwise its not working
    res.setHeader('Content-Type', 'application/json');                                                                
    var fs = require('fs');                                                                                           
    var obj = {};        
    obj["highscores"] = {};  
    var all = JSON.parse(obj);
    for (var user in players) {
        if (user != "totalPlayers" && user != "coin") {
             var name = players[user]["username"];
             var score = players[user]["score"];
             all['highscores'].push({"name":name,"score": parseInt(score)});  
         }
    }

    res.send(all);
})   

// -------------------------------------------------------------------------------
// Other games:

// 1hgj-20
app.get('/getHighscores', function (req, res) { 
    console.log('/getHighscores');
    res.header("Access-Control-Allow-Origin", "*"); //important, otherwise its not working                                           
    res.setHeader('Content-Type', 'application/json');

    // Declare variables                                                                 
    var fs = require('fs');                                                              
    var obj;                                                                             
                                                                                         
    // Read the file and send to the callback                                            
    fs.readFile('./highscores.json', handleFile)                                         
                                                                                         
    // Write the callback function                                                       
    function handleFile(err, data) {                                                     
        if (err) throw err                                                               
        obj = JSON.parse(data);                                                          
        res.send(obj);                                                                   
    }   
})


app.post('/submitHighscore', function (req, res) {
    console.log("/submitHighscore");
    res.header("Access-Control-Allow-Origin", "*"); //important, otherwise its not working  
    // Declare variables
    var fs = require('fs');
    var obj;

    // Read the file and send to the callback
    fs.readFile('./highscores.json', handleFile)

    // Write the callback function
    function handleFile(err, data) {
        if (err) throw err
        obj = calcNewHighscores(data);
        writeToFile(obj);
        res.send(obj);
    }
    
    function calcNewHighscores(data) {
        var name = req.body["name"];                                                     
        var score = req.body["score"];
        var all = JSON.parse(data);
        all['highscores'].push({"name":name,"score": parseInt(score)});
        console.log("adding " + name + " with score: " + score);
        return all;
    }

    function writeToFile(data) {
        var path = './highscores.json';

        fs.writeFile(path, JSON.stringify(data, null, 4), function(err) {

            if(err) {
                console.log(err);
            } else {
                console.log("JSON (" + data + ") saved to " + path);
            }       
        }); 
    }
});


var server = app.listen(9000, function () {

    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)

})

