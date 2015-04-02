angular.module('myApp', ['myAppControllers','ngRoute']);

angular.module('myApp')
   .constant('myAppLinks', {
      home: {
         text:'Home',
         href:'#'
      }
   })
   .constant('BOARDSIZE', 8)
;

angular.module('myApp')
   .controller('appCtrl', function($scope, myAppLinks) {
      $scope.bannerLinks = myAppLinks;
   })
   .controller('BoardController', function() {})
;

angular.module('myApp')
   .config(['$routeProvider', function($routeProvider) {
      $routeProvider.otherwise({
         templateUrl: 'app/views/home.html',
         controller: 'viewCtrl'
      });
   }])
;

angular.module('myAppControllers', ['Game', 'Logger', 'Ui']);
angular.module('myAppControllers')
   .controller('viewCtrl', function($scope, $sce, Game, Logger, Grid, WebUi) {

      $scope.messages = [];
      WebUi.setMessageHandler( function(message) {
         $scope.messages.unshift(message);
      });

      WebUi.init();
      $scope.squareClicked = WebUi.squareClicked;

      // This is weird. probably needs a refactor.
      Game.styleSquares( function(square) {
         square.background = Game.isBlack( square ) ?
            'black-space' : 'white-space';
      })

      $scope.getSquareBackground = function(square){
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


      var roundOverCB = function() {
         $scope.message = 'It is ' + Game.whoseTurn().name + '\'s turn.';
      }

      var gameOverCB = function() {
         $scope.message = 'Game Over! The winner is ' + Game.whoWon().name;
      }

      $scope.grid = Game.getGrid();
      Game.gameLoop();
      $scope.getSymbol = function(square) {
         return $sce.trustAsHtml( square );
      };
   });
