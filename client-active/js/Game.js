var PlatfomerGame = PlatformerGame || {};

//title screen
PlatformerGame.Game = function(){};

PlatformerGame.Game.prototype = {
  create: function() {

    console.log("username:" + username);

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

    // The player and its settings
    player = this.game.add.sprite(32, this.game.world.height - 150, 'dude');
    //player.scale.setTo(0.5, 0.5);

    //  We need to enable physics on the player
    this.game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

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
    totalPlayers = 1;
    tick = 1;
     
  },

  update: function() {
    tick++;

// send the data; dont collide here

    //  Collide the player and the stars with the platforms
    this.game.physics.arcade.collide(player, this.blockedLayer);
    this.game.physics.arcade.collide(this.stars, this.platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.game.physics.arcade.overlap(player, this.stars, this.collectStar, null, this);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (this.cursors.left.isDown) { // don't send the same move
        if (this.lastSentMove != 1) {
            this.sendMove(username, player.x, player.y, 1);
            this.lastSentMove = 1;
        }
    }
    else if (this.cursors.right.isDown) {
        if (this.lastSentMove != 3) {
            this.sendMove(username, player.x, player.y, 3);
            this.lastSentMove = 3;
        }
    }
    else
    {
        if (this.lastSentMove != 0) {

            this.sendMove(username, player.x, player.y, 0);
            this.lastSentMove = 0;
        }
        
    }
    
    //  Allow the player to jump if they are touching the ground.
    if (this.cursors.up.isDown && player.body.blocked.down) {
        if (this.lastSentMove != 2) {
            this.sendMove(username, player.x, player.y, 2);
            this.lastSentMove = 2;
        }
    }

    playerData = this.getData(username);

    if (lastRecievedMove == 1) {
        //  Move to the left
        player.body.velocity.x = -150;

        player.animations.play('left');
    }
    else if (lastRecievedMove == 3) {
        //  Move to the left
        player.body.velocity.x = 150;

        player.animations.play('right');
    }
    else if (lastRecievedMove == 2) {
        player.body.velocity.y = -350;

    }
    else if (lastRecievedMove == 0) {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }


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
    request.open('POST', 'http://myperfectgame.com:9000/sendMove', true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
//    request.onload = function() {
 //     if (request.status >= 200 && request.status < 400){
  //      // Success!
   //     // here you could go to the leaderboard or restart your game .
    //  } else {
     //   // We reached our target server, but it returned an error

      //}
    //};  
    request.send(data);
    },
    getData : function(username) {

        var data="username="+username;

        var request = new XMLHttpRequest();


        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
                var myArr = JSON.parse(request.responseText);
                console.log(myArr);
                console.log(myArr[username]);
                console.log(lastRecievedMove);
                if (null != myArr[username]["lastMove"]) {
                    players = myArr;
                    
                    lastRecievedMove = myArr[username]["lastMove"];
                    if (tick== -1 && tick % 100 == 0) {
                        player.x = myArr[username]["x"];
                        player.y = myArr[username]["y"];
                    }
                    totalPlayers = myArr["totalPlayers"];
                }
            }
        }
        request.open('GET', 'http://myperfectgame.com:9000/getData' + "?" + data, true);
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
