angular.module('Ui', ['Logger', 'Game', 'Grid']);
angular.module('Ui').service('Ui', function(Logger, Game,
   WHITE_WINS, BLACK_WINS) {

   var ex = {}
     , that = {}

   that.turnOver = function() {
      that.showStatus();
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

   that.showStatus = function() {
      ex.showMessage('It is ' + Game.whoseTurn().name + '\'s turn.');
   }

   ex.init = function() {
      Game.init();
      Game.startGame();
      that.showStatus();
      that.modelUpdateHandler(Game.getModel());
      Game.gameLoop( that.turnOver, that.gameOver );
   }

   ex.startGame = function() {}

   ex.squareSelected = function(square) {
      Game.squareChosen(square);
   }

   ex.setMessageHandler = function(f) {
      that.messageHandler = f;
      return this;
   }

   ex.onModelUpdate = function(f) {
      that.modelUpdateHandler = f;
      return this;
   }

   // Outgoing interactions
   ex.showMessage = function(message) {
      that.messageHandler && that.messageHandler(message);
   }

   ex.endTurn = function() {
      var success = Game.endTurn();
      if (!success) {
         ex.showMessage('You can\'t end your turn yet!');
      };
   }

   return ex;
});
