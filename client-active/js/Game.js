var PlatfomerGame = PlatformerGame || {};

//title screen
PlatformerGame.Game = function(){};

PlatformerGame.Game.prototype = {
  create: function() {
    console.log("dispausername2:" + displayName); 
    this.getUsername(displayName);
    console.log("username:" + username);

    var players = {};
    console.log("dispausername2:" + finalDisplayName); //this.game.Preload.username);
    
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
    player = this.spawnPlayer(username, finalDisplayName, 32, this.game.world.height - 150, 'dude')
    players["username"] = username;
    //this.spawnPlayer("player1", 32, this.game.world.height - 150, 'dude')

    //  Finally some stars to collect
    this.coins = this.game.add.group();

    //  We will enable physics for any star that is created in this group
    this.coins.enableBody = true;

    //  The score
    this.scoreText = this.game.add.text(16, 16, "Your score: 0", { fontSize: '32px', fill: '#FFF' });

    //  Our controls.
    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.lastSentMove = 4; // 0 = stop, 1 = left, 2= up, 3= right, 4=?
    lastRecievedMove = 4;
    tick = 1;

    this.playerNames = this.game.add.group(); 
    players["coin"] = {};
    players["coin"]["x"] = 500;
    players["coin"]["y"] = 32;
    coinx = 500;
    coiny=32;
    this.createCoin();    
  },

  update: function() {
    tick++;

    this.game.physics.arcade.collide(this.playerGroup, this.blockedLayer);
    //this.game.physics.arcade.collide(player2, this.blockedLayer);
    this.game.physics.arcade.collide(this.coins, this.blockedLayer);

    //  Checks to see if the player overlaps with any of the coins, if he does call the collectCoin function
    this.game.physics.arcade.overlap(player, this.coins, this.collectCoin, null, this);

    //  Reset the players velocity (movement)
this.lastSentMove = -1;
    if (this.cursors.up.isDown && player.body.blocked.down) {
        if (this.lastSentMove != 2) {
            this.sendMove(username, player.body.x, player.body.y, 2, this.score);
            this.lastSentMove = 2;
        }
    }
    else if (this.cursors.left.isDown) { // don't send the same move
        if (this.lastSentMove != 1) {
            this.sendMove(username, player.body.x, player.body.y, 1, this.score);
            this.lastSentMove = 1;
        }
    }
    else if (this.cursors.right.isDown) {
        if (this.lastSentMove != 3) {
            this.sendMove(username, player.body.x, player.body.y, 3, this.score);
            this.lastSentMove = 3;
        }
    }
    else {
        if (this.lastSentMove != 0) {
            this.sendMove(username, player.body.x, player.body.y, 0, this.score);
            this.lastSentMove = 0;
        }

    }


    playerData = this.getData(username);
    if (players["totalPlayers"] > totalPlayers) {
        
        for (var user in players) {
            if (user != "totalPlayers" && user != "coin") {
                var found = false;
                this.playerGroup.forEach(function(player) {            
                    if (player["id"] == user) {
                        found = true;
                    }
                }, this);
                if (!found) {
//console.log("spawning " + user);
//console.log("at x:" +  players[user]["x"]);
//console.log("at y:" +  players[user]["y"]);
                    this.spawnPlayer(user, players[user]["displayName"], players[user]["x"], players[user]["y"], 'dude');
                }
            }  
        }
    }


    this.playerGroup.forEach(function(currentPlayer) {

        if (tick % 121 == 0) {
            //currentPlayer.reset(currentPlayer.x, currentPlayer.y);
            currentPlayer.body.x = players[currentPlayer["id"]]["x"];
            currentPlayer.body.y = players[currentPlayer["id"]]["y"];
            //currentPlayer.body.reset(players[currentPlayer["id"]]["x"], players[currentPlayer["id"]]["y"]);
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
//            console.log("currentPlayer is " + currentPlayer["id"]);
//            console.log("setting currentPlayer.x: " + parseInt(currentPlayer.body.x) + " to: " + parseInt(players[currentPlayer["id"]]["x"]));
 //           console.log("setting currentPlayer.y: " + parseInt(currentPlayer.body.y) + " to: " + parseInt(players[currentPlayer["id"]]["y"]));
            currentPlayer.body.moves = false;
            //currentPlayer.x = players[currentPlayer["id"]]["x"];
            //currentPlayer.y = players[currentPlayer["id"]]["y"];
       //     currentPlayer.body.reset(players[currentPlayer["id"]]["x"], players[currentPlayer["id"]]["y"]);
            //getScores();
        }

        if (currentPlayer["label"]) {
            currentPlayer["label"].x = currentPlayer.x - 10;
            currentPlayer["label"].y = currentPlayer.y;
        }
    }, this);
       
  },

  spawnPlayer : function(username, displayName, x, y, sprite) {
//console.log("spAWENING: " + username + ","+ x + "," +  y);
    newPlayer = this.game.add.sprite(33, 400, 'dude');
    newPlayer["id"] = username;
    this.game.physics.arcade.enable(newPlayer);
    newPlayer.body.bounce.y = 0;
    newPlayer.body.gravity.y = 300;
    newPlayer.body.collideWorldBounds = true;
    newPlayer.animations.add('left', [0, 1, 2, 3], 10, true);
    newPlayer.animations.add('right', [5, 6, 7, 8], 10, true);
//    newPlayer.anchor.setTo(0.5, 0.5);
    this.playerGroup.add(newPlayer);
    playerName = this.game.add.text(newPlayer.x - 10, newPlayer.y, displayName + "", { font: '14px Arial', fill: '#FFF', align: 'center' });
    playerName["id"] = username;
    newPlayer["label"] = playerName;
    //newPlayer["displayName"] = displayName;
    totalPlayers++;
    return newPlayer;
  },

  collectCoin : function(player, coin) {
    
    // Removes the star from the screen
    coin.kill();

    //  Add and update the score
    this.score += 100;
    this.scoreText.text = 'Your score: ' + this.score;
    coinx = players["coin"]["x"];
    coiny = players["coin"]["y"];
    this.createCoin();

  },
  createCoin : function() {
    
    var coin = this.coins.create(coinx, coiny, 'coin');    

        //  Let gravity do its thing
        coin.body.gravity.y = 300;

        //  This just gives each star a slightly random bounce value
        coin.body.bounce.y = 0.7 + Math.random() * 0.2;
  },


  sendMove : function(username, x, y, move, score) {

    var data="username="+username+"&x="+x+"&y="+y+"&move="+move+"&score="+score;

    var request = new XMLHttpRequest();
    request.open('POST', 'http://myperfectgame.com/node/v2/sendMove', true);
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
        request.open('GET', 'http://myperfectgame.com/node/v2/getData' + "?" + data, false);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send(data);

    },

  getUsername : function(displayName) {

    var data="displayName="+ displayName;
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState == 4 && request.status == 200) {
        var myArr = JSON.parse(request.responseText);
        if (null != myArr["username"]) {
          username = myArr["username"];
          finalDisplayName = myArr["displayName"];
 //         player["label"].text = myArr["displayName"];
          
          //totalPlayers = myArr["totalPlayers"];        
          }
        }
      }
      request.open('GET', 'http://myperfectgame.com/node/v2/getUsername' + "?" + data, false);
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
