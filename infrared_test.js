
var GrovePi = require('node-grovepi').GrovePi;

var Commands = GrovePi.commands
var Board = GrovePi.board

var Digital = GrovePi.sensors.base.Digital

module.exports = function(RED) {
    var board = new Board({
         debug: true,
         onError: function(err){
           console.error('GrovePiBoard.js: Something went wrong');
           console.error(err)
         },
         onInit: function(res) {
         }
    });

    board.init();

    var fs =  require('fs');

    if (!fs.existsSync("/dev/ttyAMA0")) { // unlikely if not on a Pi
        throw "Info : Node ignored because /dev/ttyAMA0 doesn't exist.";
    }

    function infrared(n) {
        RED.nodes.createNode(this,n);
        this.pin = n.pin;
        this.sensor = n.sensor;
        var node = this;

        var digital = new Digital(node.pin);
        board.pinMode(node.pin, 'input');

        var oldVal;
        var interval = setInterval(function() {
            var value;

            var writeRet = board.writeBytes(Commands.dRead.concat([node.pin, Commands.unused, Commands.unused]))
            if (writeRet) {
                board.wait(100)
                value = board.readByte()[0]
            } else {
                value = false
            }

            if(typeof value !== 'undefined' && value !== false && value !== oldVal) {
                node.send({ topic:"pi/"+node.pin, payload:value });
                node.buttonState = value;
                node.status({fill:"green",shape:"dot",text:value.toString()});
                oldVal = value;
            }
        }, 100);

        node.on('close', function() {
            node.status({fill:"grey",shape:"ring",text:"Closed"});
            this.sensor(function(){
                 done();
            });
            clearInterval(interval);
        });

        RED.nodes.registerType("grovepi-infrared",Button);

  }
