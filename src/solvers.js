/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other

// initialize
// rows
// togglePiece
// hasAnyRooksConflicts
// _isInBounds

window.findNRooksSolution = function(n) {
  var solution = [];
  var board = new Board({ n: n });
  console.log("New board: ", board);

  var getSolutions = function(rowsLeft) {
    // if all rows exhausted
    if (rowsLeft === 0) {
      // increment solution count
      console.log("rowsleft 0! answer: ", board);
      return board;
      // stop
    }

    // iterate over possible decisions
    for (var i = 0; i < n; i++) {
      // place a piece 
      board.togglePiece(n - rowsLeft, i);
      console.log("toggled: ", board)
        // if no conflicts on board
      if (!board.hasAnyRooksConflicts()) {
        // recurse into remaining problem 
        getSolutions(rowsLeft - 1);
      }
      // unplace a piece
      board.togglePiece(n - rowsLeft, i);
    }
  };
  getSolutions(n);

  // var solution = solution || 'No solution.';
  console.log("final board: ", board)
  return board;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = 0;
  var board = new Board({ n: n });

  var getSolutions = function(rowsLeft) {
    // if all rows exhausted
    if (rowsLeft === 0) {
      // increment solution count
      solutionCount++;
      // stop
      return;
    }

    // iterate over possible decisions
    for (var i = 0; i < n; i++) {
      // place a piece 
      board.togglePiece(n - rowsLeft, i);
      // if no conflicts on board
      if (!board.hasAnyRooksConflicts()) {
        // recurse into remaining problem 
        getSolutions(rowsLeft - 1);
      }
      // unplace a piece
      board.togglePiece(n - rowsLeft, i);
    }


    // remove piece
  };
  getSolutions(n);

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = undefined; //fixme

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
