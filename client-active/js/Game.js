var PlatfomerGame = PlatformerGame || {};

//title screen
PlatformerGame.Game = function(){};

PlatformerGame.Game.prototype = {
  create: function() {

    this.getUsername();
    //console.log("username:" + username);

    var players = {};
    //console.log("username2:" + this.game.Preload.username);
    
    this.platforms;
    this.cursors;

    this.stars;
    this.score = 0;
    this.scoreText;


    this.map = this.game.add.tilemap('level1');

    this.map.addTilesetImage('gameTiles', 'gameTiles');

    //this.blockedLayer = this.map.createLayer('objectLayer');
    this.blockedLayer = this.map.createLayer('blockedLayer');
    //this.foregroundLayer = this.map.createLayer('foregroundLayer');

    this.map.setCollisionBetween(1, 100000, true, 'blockedLayer');

    //this.blockedLayer.body.immovable = true;
    this.blockedLayer.resizeWorld();
    //  We're going to be using physics, so enable the Arcade Physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.playerGroup = this.game.add.group();
    // The player and its settings
    //player = this.game.add.sprite(32, this.game.world.height - 150, 'dude');
    //player = this.playerGroup.create(32, this.game.world.height - 150, 'dude');
    //player["id"] = username;
    totalPlayers = 0;
    player = this.spawnPlayer(username, 32, this.game.world.height - 150, 'dude')
    players["username"] = username;
    //this.spawnPlayer("player1", 32, this.game.world.height - 150, 'dude')

    //  Finally some stars to collect
    this.stars = this.game.add.group();

    //  We will enable physics for any star that is created in this group
    this.stars.enableBody = true;

    //  Here we'll create 12 of them evenly spaced apart
    for (var i = 0; i < 0; i++)
    {
        //  Create a star inside of the 'stars' group
        var star = this.stars.create(i * 70, 0, 'star');

        //  Let gravity do its thing
        star.body.gravity.y = 300;

        //  This just gives each star a slightly random bounce value
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

    //  The score
    this.scoreText = this.game.add.text(16, 16, this.name, { fontSize: '32px', fill: '#000' });

    //  Our controls.
    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.lastSentMove = 4; // 0 = stop, 1 = left, 2= up, 3= right, 4=?
    lastRecievedMove = 4;
    tick = 1;

    this.playerNames = this.game.add.group();     
  },

  update: function() {
    tick++;

    this.game.physics.arcade.collide(this.playerGroup, this.blockedLayer);
    //this.game.physics.arcade.collide(player2, this.blockedLayer);
    //this.game.physics.arcade.collide(this.stars, this.platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    //this.game.physics.arcade.overlap(player, this.stars, this.collectStar, null, this);

    //  Reset the players velocity (movement)
this.lastSentMove = -1;
    if (this.cursors.up.isDown && player.body.blocked.down) {
        if (this.lastSentMove != 2) {
            this.sendMove(username, player.body.x, player.body.y, 2);
            this.lastSentMove = 2;
        }
    }
    else if (this.cursors.left.isDown) { // don't send the same move
        if (this.lastSentMove != 1) {
            this.sendMove(username, player.body.x, player.body.y, 1);
            this.lastSentMove = 1;
        }
    }
    else if (this.cursors.right.isDown) {
        if (this.lastSentMove != 3) {
            this.sendMove(username, player.body.x, player.body.y, 3);
            this.lastSentMove = 3;
        }
    }
    else {
        if (this.lastSentMove != 0) {
            this.sendMove(username, player.body.x, player.body.y, 0);
            this.lastSentMove = 0;
        }

    }


    playerData = this.getData(username);
    if (players["totalPlayers"] > totalPlayers) {
        
        for (var user in players) {
            if (user != "totalPlayers") {
                var found = false;
                this.playerGroup.forEach(function(player) {            
                    if (player["id"] == user) {
                        found = true;
                    }
                }, this);
                if (!found) {
console.log("spawning " + user);
console.log("at x:" +  players[user]["x"]);
console.log("at y:" +  players[user]["y"]);
                    this.spawnPlayer(user, players[user]["x"], players[user]["y"], 'dude');
                }
            }            
        }
    }


    this.playerGroup.forEach(function(currentPlayer) {

        if (tick % 121 == 0) {
            //currentPlayer.reset(currentPlayer.x, currentPlayer.y);
            currentPlayer.body.x = players[currentPlayer["id"]]["x"];
            currentPlayer.body.y = players[currentPlayer["id"]]["y"];
     //       currentPlayer.body.reset(players[currentPlayer["id"]]["x"], players[currentPlayer["id"]]["y"]);
            currentPlayer.body.moves = true;
        }

        currentPlayer.body.velocity.x = 0;

        lastRecievedMove = -1;

        if (players[currentPlayer["id"]] && players[currentPlayer["id"]]["lastMove"]) {
            lastRecievedMove = players[currentPlayer["id"]]["lastMove"];
        }
        if (lastRecievedMove == 1) {
            //  Move to the left
            currentPlayer.body.velocity.x = -150;

            currentPlayer.animations.play('left');
        }
        else if (lastRecievedMove == 3) {
            //  Move to the left
            currentPlayer.body.velocity.x = 150;

            currentPlayer.animations.play('right');
        }
        else if (lastRecievedMove == 2) {
            currentPlayer.body.velocity.y = -350;

        }
        else if (lastRecievedMove == 0) {
            //  Stand still
            currentPlayer.animations.stop();

            currentPlayer.frame = 4;
        }
 
        if (tick % 120 == 0 ) {
            console.log("currentPlayer is " + currentPlayer["id"]);
            console.log("setting currentPlayer.x: " + parseInt(currentPlayer.body.x) + " to: " + parseInt(players[currentPlayer["id"]]["x"]));
            console.log("setting currentPlayer.y: " + parseInt(currentPlayer.body.y) + " to: " + parseInt(players[currentPlayer["id"]]["y"]));
            currentPlayer.body.moves = false;
            //currentPlayer.x = players[currentPlayer["id"]]["x"];
            //currentPlayer.y = players[currentPlayer["id"]]["y"];
            //currentPlayer.body.reset(players[currentPlayer["id"]]["x"], players[currentPlayer["id"]]["y"]);
        }

        if (currentPlayer["label"]) {
            currentPlayer["label"].x = currentPlayer.x;
            currentPlayer["label"].y = currentPlayer.y;
        }
    }, this);
       
  },

  spawnPlayer : function(username, x, y, sprite) {
console.log("spAWENING: " + username + ","+ x + "," +  y);
    newPlayer = this.game.add.sprite(32, 400, 'dude');
    newPlayer["id"] = username;
    this.game.physics.arcade.enable(newPlayer);
    newPlayer.body.bounce.y = 0;
    newPlayer.body.gravity.y = 300;
    newPlayer.body.collideWorldBounds = true;
    newPlayer.animations.add('left', [0, 1, 2, 3], 10, true);
    newPlayer.animations.add('right', [5, 6, 7, 8], 10, true);
//    newPlayer.anchor.setTo(0.5, 0.5);
    this.playerGroup.add(newPlayer);
    playerName = this.game.add.text(newPlayer.x-10, newPlayer.y, username + "", { font: '14px Arial', fill: '#FFF', align: 'center' });
    playerName["id"] = username;
    newPlayer["label"] = playerName;
    totalPlayers++;
    return newPlayer;
  },

  collectStar : function(player, star) {
    
    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    this.score += 10;
    this.scoreText.text = 'Score: ' + this.score;

  },

  sendMove : function(username, x, y, move) {

    var data="username="+username+"&x="+x+"&y="+y+"&move="+move;

    var request = new XMLHttpRequest();
    request.open('POST', 'http://myperfectgame.com/node/sendMove', true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
  
    request.send(data);
    },
    getData : function(username) {

        var data="username="+username;

        var request = new XMLHttpRequest();


        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
                var myArr = JSON.parse(request.responseText);
                if (null != myArr[username]["lastMove"]) {
                    players = myArr;
                    
                    lastRecievedMove = myArr[username]["lastMove"];
                    if (tick== -1 && tick % 100 == 0) {
                        player.x = myArr[username]["x"];
                        player.y = myArr[username]["y"];
                    }
                }
            }
        }
        request.open('GET', 'http://myperfectgame.com/node/getData' + "?" + data, false);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send(data);

    },

  getUsername : function() {

    var data="";
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState == 4 && request.status == 200) {
        var myArr = JSON.parse(request.responseText);
        if (null != myArr["username"]) {
          username = myArr["username"];
          //totalPlayers = myArr["totalPlayers"];        
          }
        }
      }
      request.open('GET', 'http://myperfectgame.com/node/getUsername', false);
      request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      request.send(data);
    },




    distanceBetweenTwoPoints: function(a, b) {
        var xs = b.x - a.x;
        xs = xs * xs;

        var ys = b.y - a.y;
        ys = ys * ys;

        return Math.sqrt(xs + ys);
    },

};
