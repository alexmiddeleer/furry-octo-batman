angular.module('Ui', ['Logger', 'Game']);
angular.module('Ui').service('Ui', function(Logger, Game) {

   var ex = {}
     , that = {}

   // Incoming interactions
   ex.init = function() {
      Game.init();
      Game.startGame();
      ex.showMessage('It is ' + Game.whoseTurn().name + '\'s turn.');
   }

   ex.startGame = function() {}
   ex.endTurn = function() {}
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
angular.module('Ui').service('WebUi', function(Logger, Ui) {

   // This service essentially inherits from Ui
   var ex = Ui
     , that = {}

   ex. squareClicked = function(square) {
      Ui.squareSelected(square);
   }

   return ex;
});
