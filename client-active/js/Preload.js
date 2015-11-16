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
    this.game.load.image('gameTiles', 'assets/gameTiles.png');
    this.game.load.image('coin', 'assets/coin.png');
    this.game.load.spritesheet('dude', 'assets/dude.png', 32, 48);

    this.username;
    
  },
  create: function() {
    this.state.start('Player');
  },
}
