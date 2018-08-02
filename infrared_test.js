
var GrovePi = require('node-grovepi').GrovePi;
var Commands = GrovePi.commands;
var Board = GrovePi.board
var Digital = GrovePi.sensors.base.Digital

module.exports = function(RED) {
    var board = new Board({
         debug: true,
         onError: function(err){
           console.error('GrovePiBoard.js: Something went wrong');
           console.error(err);
         },
         onInit: function(res) {
         }
    });
  };

    board.init();

    function infrared(n) {
        RED.nodes.createNode(this,n);
        this.pin = n.pin;
        this.sensor = n.sensor;
        var node = this;

        var digital = new Digital(node.pin);
        board.pinMode(node.pin, 'input');


        function inputlistener(msg){
          var out = Number(msg.payload);

          if(out == 0){
            msg.payload = "true";
          }else{
            msg.payload = "false";
          }
          node.send(msg);
        }
        //var oldVal;

        node.on('close', function() {
            node.status({fill:"grey",shape:"ring",text:"Closed"});
            this.sensor(function(){
                 done();
            });
            clearInterval(interval);
        });

        RED.nodes.registerType("grovepi-infrared",infrared);

  }
