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

// This service essentially inherits from uI, but UI supposed to be too abstract 
// do deal with things like clicks and classes
angular.module('Ui').service('WebUi', function(Logger, Ui, Grid, Game) {

   var ex = Ui
     , that = {}

   ex.squareClicked = function(square) {
      Ui.squareSelected(square);
   }

   ex.styleBackground = function() {
      Grid.forEach( function(square) {
         square.background = Game.isBlack( square ) ?
            'black-space' : 'white-space';
      })
   }

   ex.getSquareBackground = function(square){
      if (Game.pieceIsMoveable(square) && square.piece.isSelected) {
         return 'selected-space';
      }
      if (Game.pieceIsMoveable(square) && square.mouseOver) {
         return 'selectable-space';
      }
      if (Game.squareIsReachable(square) && square.mouseOver) {
         return 'selectable-space';
      }
   }

   return ex;
});
