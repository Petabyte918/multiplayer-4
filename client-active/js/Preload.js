var PlatformerGame = PlatformerGame || {};

//loading the game assets
PlatformerGame.Preload = function(){};

PlatformerGame.Preload.prototype = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);

    this.load.setPreloadSprite(this.preloadBar);

    //load game assets
    this.load.tilemap('level1', 'assets/multi.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('sky', 'assets/sky.png');
    this.game.load.image('gameTiles', 'assets/gameTiles.png');
    this.game.load.image('star', 'assets/star.png');
    this.game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    username = this.getUsername();
  },
  create: function() {
    this.state.start('Game');
  },
  getUsername : function() {

    var data="";
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState == 4 && request.status == 200) {
        var myArr = JSON.parse(request.responseText);
        console.log(myArr);
        console.log(myArr["username"]);
        if (null != myArr["username"]) {
          console.log("YAY! got username");
          username = myArr["username"];
          }
        }
      }
      request.open('GET', 'http://myperfectgame.com:9000/getUsername', true);
      request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      request.send(data);
    }

};
