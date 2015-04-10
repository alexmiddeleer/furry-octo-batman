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
   .controller('viewCtrl', function($scope, $sce, Game, Logger, WebUi) {
      $scope.messages = [];
      WebUi.setMessageHandler( function(message) {
         $scope.messages.unshift(message);
      });
      WebUi.onModelUpdate( function( grid ) {
         $scope.grid = grid;
         WebUi.styleBackground();
      });
      WebUi.init();
      WebUi.styleBackground();
      $scope.squareClicked = WebUi.squareClicked;
      $scope.getSquareBackground = WebUi.getSquareBackground;
      $scope.getSymbol = function(square) {
         return $sce.trustAsHtml( square );
      };
   });
