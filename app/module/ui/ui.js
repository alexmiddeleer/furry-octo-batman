angular.module('Ui', ['Logger', 'Game', 'Grid']);
angular.module('Ui').service('Ui', function(Logger, Game,
   WHITE_WINS, BLACK_WINS) {

   var ex = {}
     , that = {}

   that.turnOver = function() {
      ex.showMessage('It is ' + Game.whoseTurn().name + '\'s turn.');
   }

   that.gameOver = function(gameStatus) {
      if (gameStatus===WHITE_WINS){
         ex.showMessage(WHITE_PLAYER + ' wins!');
      } else if (gameStatus === BLACK_WINS) {
         ex.showMessage(BLACK_WINS + 'wins!');
      } else {
         ex.showMessage('Error! Nobody wins!');
         throw('It broke');
      }
   }

   ex.init = function() {
      Game.init();
      Game.startGame();
      ex.showMessage('It is ' + Game.whoseTurn().name + '\'s turn.');
      Game.gameLoop( that.turnOver, that.gameOver );
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
