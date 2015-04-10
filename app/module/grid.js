angular.module('Grid', []);
angular.module('Grid').service('Grid', function() {
   var exports = {} 
     , that = {}
   
   exports.init = function(size) {
      that.size = size;
      that.grid = [];
      for (var y = 0; y < that.size; y++) {
         that.grid.push([]);
         for (var x = 0; x < that.size; x++) {
            that.grid[y].push({x:x, y:y});
         }
      }
      return this;
   }
 
   exports.getGrid = function() {
      return that.grid;
   }

   exports.setGrid = function(newGrid) {
      var size = Math.min( that.grid.length, newGrid.length );
      for (var y = 0; y < size; y++) {
         for (var x = 0; x < size; x++) {
            angular.copy(newGrid[x][y], that.grid[x][y]);
         }
      }
      return that.grid;
   }

   exports.forEach = function(f) {
      for (var y = 0; y < that.size; y++) {
         for (var x = 0; x < that.size; x++) {
            f(that.grid[x][y]);
         }
      }
      return this;
   }

   return exports;
});


