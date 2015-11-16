var PlatfomerGame = PlatformerGame || {};

//title screen
PlatformerGame.Player = function(){};

PlatformerGame.Player.prototype = {
  create: function() {

    var person = getCookie("name");
    if (person == "" || person == "null" || person == null) {
        person = "BitslapFan";
    } 
    displayName = askForDisplayName(person); // this could be a form instead. or a popup

    this.state.start('Game');
  },

  update: function() {
  },

};
