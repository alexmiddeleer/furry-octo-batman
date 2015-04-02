angular.module('Ui', ['Logger', 'Game', 'Grid']);
angular.module('Ui').service('Ui', function(Logger, Game) {

   var ex = {}
     , that = {}

   // Incoming interactions
   ex.init = function() {
      Game.init();
      Game.startGame();
      Game.gameLoop();
      ex.showMessage('It is ' + Game.whoseTurn().name + '\'s turn.');
   }

   ex.startGame = function() {}

   ex.endTurn = function() {
      ex.showMessage('It is ' + Game.whoseTurn().name + '\'s turn.');
   }

   ex.squareSelected = function(square) {
      Game.pieceChosen(square);
   }
   ex.setMessageHandler = function(f) {
      that.messageHandler = f;
   }

   // Outgoing interactions
   ex.showMessage = function(message) {
      that.messageHandler && that.messageHandler(message);
   }

   return ex;
});
