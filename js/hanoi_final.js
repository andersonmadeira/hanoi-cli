function Hanoi(n) {
  var solutionSteps = 0;
  var numberOfDisks = n;
  // raw data
	var disks = [[], [], []];
	while(n > 0) {
		disks[0].push(n);
		n--;
	}
	// public stuff
	return {
  	// retorna o estado atual da torre de hanoi como uma string.
    toString: function () {
  	  str = '[1]:  [2]:  [3]:\n----------------\n';
      k = numberOfDisks - 1;
      while(k >= 0) {
        str += disks[0][k] != undefined ? ' ' + disks[0][k] + '    ' : ' |    ';
        str += disks[1][k] != undefined ? ' ' + disks[1][k] + '    ' : ' |    ';
        str += disks[2][k] != undefined ? ' ' + disks[2][k] + '    ' : ' |    ';
        str += '\n';
        k--;
      }
      return str;
  	},
  	getNumberOfDisks: function() {
      return numberOfDisks;
  	},
  	restart: function () {
      var disks = [[], [], []];
      var n = this.getNumberOfDisks();
    	while(n > 0) {
    		disks[0].push(n);
    		n--;
    	}
      solutionSteps = 0;
  	},
  	// obtêm o disco que está no topo da torre peg
  	getTop: function(peg) {
  	  return disks[peg-1].length > 0  ?  disks[peg-1][disks[peg-1].length-1]  :  0;
  	},
  	// avalia se é possível mover o disco do topo da torre sPeg para a torre destino dPeg
  	canMove: function(sPeg, dPeg) {
  	  if (sPeg == dPeg || disks[sPeg-1].length == 0)
        return false;
      else if (this.getTop(dPeg) == 0)
        return true;
      else
        return this.getTop(sPeg) < this.getTop(dPeg);
  	},
  	// move o disco no topo da torre sPeg para a torre dPeg
  	move: function(sPeg, dPeg, verbose) {
  	  if (this.canMove(sPeg, dPeg)) {
        disks[dPeg-1].push(disks[sPeg-1].pop());
        solutionSteps++;
  	  }
      if (verbose)
        return this.toString();
    },
    // checa se o jogo foi solucionado
    isSolved: function() {
      k = numberOfDisks - 1;
      while (k >= 0) {
        if (disks[2][k] != numberOfDisks - k)
          return false;
        k--;
      }
      return true;
    },
    getSolutionSteps: function () {
      return solutionSteps;
    }
  }
};

/** 
 * @depracated: supposed to be cli only, GUI project moved to another branch.
function GameApp(hanoi) {
  var hanoi = hanoi;
  var canvas = document.getElementById('drawing_area');
	var ctx = canvas.getContext('2d');
	var SEP = 10;
	var BORDER = 10;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  var baseSize = (canvas.width - (3*SEP)) - (2*BORDER) / 3;

	drawFunction();

  function drawFunction() {
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 1;
    for (var i = 0; i < 3; i++) {
      ctx.rect(10, (canvas.height - 120), (canvas.width - 20), 5);
    }
  //  ctx.fillStyle = 'white';
  //  ctx.fillRect(0, 0, canvas.width, canvas.height);


    //ctx.rect(10, 10, 10, 10);
    ctx.stroke();
    ctx.fillStyle = 'blue';
    ctx.font = hanoi.getNumberOfDisks()*10+"px Droid Sans";
    ctx.fillText(hanoi.getNumberOfDisks()+'Disks', canvas.width / 2, canvas.height / 2);
  }

  return {
    onResizeWindow: function () {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      drawFunction();
    }
  };
}*/


// + almost zero function calls in core algorithm
// + simpler, faster
// + returns steps taken for the solution
// - more memory usage
/// @TODO: na linha 261, melhorar o loop pra ele verificar somente os que estão no topo e não todos os discos
function solve_hanoi_v4(h) {
  numberOfDisks = h.getNumberOfDisks();
  // on_top[3] = 1
  // disco 3 está em torre 1
  on_top = {};
  on_top[1] = 1;
  sPeg = 1;
  dPeg = 3;
  // loop control vars
  steps = 0;
  maxSteps = Math.pow(2, numberOfDisks) - 1;
  //console.log('You must do in '+maxSteps+' max steps');
  // end
  tmpDisk = 0;

  while (true) {
    for (var k = 1; k <= numberOfDisks; k++) {
      if (typeof on_top[k] !== 'undefined') {
        sPeg = on_top[k];
        // begin - get the next destination peg
        if (numberOfDisks % 2 == 1)
          dPeg = (sPeg == 1 ? 3 : sPeg-1);
        else
          dPeg = (sPeg == 3 ? 1 : sPeg+1);
        // end
        do {
          if(h.canMove(sPeg, dPeg)) {
            tmpDisk = h.getTop(dPeg);
            if (tmpDisk != 0) {
              delete on_top[tmpDisk];
            }
            on_top[k] = dPeg;
            //console.log(h.move(sPeg, dPeg, true));
            h.move(sPeg, dPeg);
            tmpDisk = h.getTop(sPeg);
            if (tmpDisk != 0) {
              on_top[tmpDisk] = sPeg;
            }
            steps++;
            if (steps == maxSteps) {
              return steps;
            }
            // se ele chegou aqui é sinal que ele já encontrou um peg destino para mover
            // então break e não procura por outro peg
            break;
          }
          // begin - get the next destination peg
          if (numberOfDisks % 2 == 1)
            dPeg = (dPeg == 1 ? 3 : dPeg-1);
          else
            dPeg = (dPeg == 3 ? 1 : dPeg+1);
          // end
        } while (dPeg != sPeg);
      }
    }
  }
}

$(document).ready(function() {
	h = new Hanoi(prompt('Enter number of disks?'));
  /** 
   * @depracated: supposed to be cli only.
   */
	//g = new GameApp(h);

	// resize the canvas to fill browser window dynamically
  //window.addEventListener('resize', g.onResizeWindow, false);

  console.log('Before:');
  console.log(h.toString());
  d = new Date();
  totalSteps = solve_hanoi_v4(h);
  d2 = new Date();
  console.log('After:');
  console.log(h.toString());
  console.log('Solution done in '+totalSteps+' steps');
  console.log('Time elapsed: '+(d2.getTime()-d.getTime())+' milliseconds.');
});

/// BEGIN
/// @OLD_STUFF:

function solve_hanoi_v1(h) {
  numberOfDisks = h.getNumberOfDisks();
  // on_top[3] = 1
  // disco 3 está em torre 1
  on_top = {};
  on_top[1] = 1;
  sPeg = 1;
  dPeg = 3;
  tmpDisk = 0;

  getNextPeg = numberOfDisks % 2 == 1 ? getLeftPeg : getRightPeg;
  while (!h.isSolved()) {
    for (var k = 1; k <= numberOfDisks; k++) {
      if (on_top[k] != undefined) {
        sPeg = on_top[k];
        dPeg = getNextPeg(sPeg);
        if(h.canMove(sPeg, dPeg)) {
          tmpDisk = h.getTop(dPeg);
          if (tmpDisk != 0) {
            delete on_top[tmpDisk];
          }
          on_top[k] = dPeg;
          console.log(h.move(sPeg, dPeg, true));
          tmpDisk = h.getTop(sPeg);
          if (tmpDisk != 0) {
            on_top[tmpDisk] = sPeg;
          }
        }
        else {
          dPeg = getNextPeg(dPeg);
          if (h.canMove(sPeg, dPeg)) {
            tmpDisk = h.getTop(dPeg);
            if (tmpDisk != 0)
              delete on_top[tmpDisk];
            on_top[k] = dPeg;
            console.log(h.move(sPeg, dPeg, true));
            tmpDisk = h.getTop(sPeg);
            if (tmpDisk != 0) {
              on_top[tmpDisk] = sPeg;
            }
          }
        }
      }
    }

  }
  if (h.isSolved()) {
    console.log('Solution done in '+h.getSolutionSteps()+' steps.');
    console
  }

  function getLeftPeg(sPeg) {
    return sPeg == 1 ? 3 : sPeg-1;
  }

  function getRightPeg(sPeg) {
    return sPeg == 3 ? 1 : sPeg+1;
  }
}

function solve_hanoi_v2(h) {
  numberOfDisks = h.getNumberOfDisks();
  // on_top[3] = 1
  // disco 3 está em torre 1
  on_top = {};
  on_top[1] = 1;
  sPeg = 1;
  dPeg = 3;
  tmpDisk = 0;

  getNextPeg = numberOfDisks % 2 == 1 ? getLeftPeg : getRightPeg;
  while (!h.isSolved()) {
    for (var k = 1; k <= numberOfDisks; k++) {
      if (on_top[k] != undefined) {
        sPeg = on_top[k];
        dPeg = getNextPeg(sPeg);
        do {
          if(h.canMove(sPeg, dPeg)) {
            tmpDisk = h.getTop(dPeg);
            if (tmpDisk != 0) {
              delete on_top[tmpDisk];
            }
            on_top[k] = dPeg;
            console.log(h.move(sPeg, dPeg, true));
            tmpDisk = h.getTop(sPeg);
            if (tmpDisk != 0) {
              on_top[tmpDisk] = sPeg;
            }
            break;
          }
          dPeg = getNextPeg(dPeg);
        } while (dPeg != sPeg);
      }
    }
  }
  if (h.isSolved()) {
    console.log('Solution done in '+h.getSolutionSteps()+' steps.');
    console
  }

  function getLeftPeg(sPeg) {
    return sPeg == 1 ? 3 : sPeg-1;
  }

  function getRightPeg(sPeg) {
    return sPeg == 3 ? 1 : sPeg+1;
  }
}

function solve_hanoi_v3(h) {
  numberOfDisks = h.getNumberOfDisks();
  // on_top[3] = 1
  // disco 3 está em torre 1
  on_top = {};
  on_top[1] = 1;
  sPeg = 1;
  dPeg = 3;
  tmpDisk = 0;

  while (!h.isSolved()) {
    for (var k = 1; k <= numberOfDisks; k++) {
      if (on_top[k] != undefined) {
        sPeg = on_top[k];
        // begin - get the next destination peg
        if (numberOfDisks % 2 == 1)
          dPeg = (sPeg == 1 ? 3 : sPeg-1);
        else
          dPeg = (sPeg == 3 ? 1 : sPeg+1);
        // end
        do {
          if(h.canMove(sPeg, dPeg)) {
            tmpDisk = h.getTop(dPeg);
            if (tmpDisk != 0) {
              delete on_top[tmpDisk];
            }
            on_top[k] = dPeg;
            //console.log(h.move(sPeg, dPeg, true));
            h.move(sPeg, dPeg);
            tmpDisk = h.getTop(sPeg);
            if (tmpDisk != 0) {
              on_top[tmpDisk] = sPeg;
            }
            break;
          }
          // begin - get the next destination peg
          if (numberOfDisks % 2 == 1)
            dPeg = (dPeg == 1 ? 3 : dPeg-1);
          else
            dPeg = (dPeg == 3 ? 1 : dPeg+1);
          // end
        } while (dPeg != sPeg);
      }
    }
  }
  if (h.isSolved()) {
    console.log('Solution done in '+h.getSolutionSteps()+' steps.');
    console
  }
}

// END