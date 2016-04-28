// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function(params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = +!this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


    /*
             _             _     _
         ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
        / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
        \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
        |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

     */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var counter = 0;
      var row = this.get(rowIndex);
      // loop over rowIndex row and counter++ for any 1's
      for (var i = 0; i < row.length; i++) {
        if (row[i] === 1) {
          counter++;
        }
      }
      return !(counter < 2);
    },

    //this.attributes[key] === array of values; (a row)
    //this.attributes[key][0] === a column value

    // column navigation:
    //this.attributes[key0][0]
    //this.attributes[key1][0]
    //etc

    //for loop to go through the keys:
    //for(var key in this.attribute) {}

    //for loop to go through the rows:
    //for var i=0; this.attributes[key].length

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      // loop over rowIndex row and counter++ for any 1's
      for (var key in this.attributes) {
        var counter = 0;
        for (var i = 0; i < this.attributes[key].length; i++) {
          if (this.attributes[key][i] === 1) {
            counter++;
          }
        }
        if (counter > 1) {
          return true;
        }
      }
      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {

      var counter = 0;

      // iterate through keys, each time checking colIndex
      for (var key in this.attributes) {
        if (this.attributes[key][colIndex] === 1) {
          counter++;
        }
      }
      return !(counter < 2);
    },


    // test if any columns on this board contain conflicts

    hasAnyColConflicts: function() {
      var result = false;

      //key0.length === how many columns we must check

      // iterate through each key, checking this.attributes[key0][0]. then this.attributes[key1][0]. etc.

      // iterate through key0 to final column #
      for (var i = 0; i < this.attributes[0].length; i++) {
        var counter = 0;
        // iterate through all keys, going down one row at a time
        for (var key in this.attributes) {
          if (this.attributes[key][i] === 1) {
            counter++;
          }
        }
        if (counter > 1) {
          return true;
        }
      }

      return false;
    },

    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var counter = 0;
      for (var key in this.attributes) {
        if (this.attributes[key][Number(key) + majorDiagonalColumnIndexAtFirstRow] === 1) {
          counter++;
        }
      }
      return counter > 1 ? true : false;
    },

    hasAnyMajorDiagonalConflicts: function() {
      var leftColumn = false;
      // CHECKS TOP ROW
      for (var i = 0; i < this.attributes[0].length; i++) {
        if (this.hasMajorDiagonalConflictAt(i)) {
          return true;
        }
      }

      // CHECKS LEFT COLUMN
      var testarr = [];

      //iterate through single diagonal, pushing values to array
      var row = this.attributes;
      var subroutine = function(startKey) {
        var pieces = 0;
        indCounter = 0;
        for (var i = 0; i < row[0].length - startKey; i++) {
          if (row[i + startKey][indCounter] === 1) {
            pieces++;
          }
          indCounter++;
          if (pieces > 1) {
            leftColumn = true;
          }
        }
      };
      for (var startKey = 0; startKey < row[0].length; startKey++) {
        subroutine(startKey);
      }

      return leftColumn;
    },


    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var counter = 0;
      var index = minorDiagonalColumnIndexAtFirstRow;
      // loops through the rows in the outter array
      for (var key in this.attributes) {
        // if the current square has a piece on it
        if (this.attributes[key][index] === 1) {
          // increment counter
          counter++;
        }
        index--;
      }
      return counter > 1 ? true : false;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var row = this.attributes;
      var rightColumn = false;
      // CHECKS TOP ROW
      for (var i = 0; i < row[0].length; i++) {
        if (this.hasMinorDiagonalConflictAt(i)) {
          return true;
        }
      }

      // CHECKS RIGHT COLUMN
      //iterate through single minor diagonal, pushing values to array

      var subroutine = function(startKey) {
        var pieces = 0;
        var indCounter = row[0].length;
        for (var i = 0; i < row[0].length - startKey; i++) {
          if (row[i + startKey][indCounter] === 1) {
            pieces++;
          }
          indCounter--;
          if (pieces > 1) {
            rightColumn = true;
          }
        }
      };
      for (var startKey = 0; startKey < row[0].length; startKey++) {
        subroutine(startKey);
      }

      return rightColumn;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
