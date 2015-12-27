// Модель представления
var view = {
  displayMessage: function(msg) {
    // метод для вывода действий пользователя
    var messageArea = document.getElementById("messageArea");
    messageArea.innerHTML = msg;
  },
  displayHit: function(location) {
    // метод для вывода изображения в соответствующей клетке при попадании
    var cell = document.getElementById(location);
    //Добавляем клас к элементу при попадании
    cell.setAttribute("class", "hit");
  },
  displayMiss: function(location) {
    // метод для вывода изображения в соответствующей клетке при промахе
    var cell = document.getElementById(location);
    //Добавляем клас к элементу при промахе
    cell.setAttribute("class", "miss");
  },
  gameOver: function(gameOverMsg) {
    if (model.shipsSunk === 3) {
      var gameOverMsg = document.getElementById("input-form").style.visibility = "hidden";
    }
  }
};
//Модель состояния
var model = {
  boardSize: 7,
  numShips: 3,
  shipsSunk: 0,
  shipLength: 3,
  ships: [{
    locations: [0, 0, 0],
    hits: ["", "", ""]
  }, {
    locations: [0, 0, 0],
    hits: ["", "", ""]
  }, {
    locations: [0, 0, 0],
    hits: ["", "", ""]
  }],
  fire: function(guess) {
    for (var i = 0; i < this.numShips; i++) {
      var ship = this.ships[i];
      var index = ship.locations.indexOf(guess);
      if (index >= 0) {
        ship.hits[index] = "hit";
        view.displayHit(guess);
        view.displayMessage("HIT!");
        if (this.isSunk(ship)) {
          view.displayMessage("You sank my battleship!");
          this.shipsSunk++;
          if (this.shipsSunk === this.numShips) {
            view.gameOver();
          };
        }
        return true;
      }
    }
    view.displayMiss(guess);
    view.displayMessage("You missed.");
    return false;
  },
  isSunk: function(ship) {
    for (var i = 0; i < this.shipLength; i++) {
      if (ship.hits[i] !== "hit") {
        return false;
      }
    }
    return true;
  },
  // Добавление кораблей, проверяет не пересекаются ли корабли, добавляеткол-во кораблей, указанных в numShips
  generateShipsLocation: function() {
    var locations;
    for (var i = 0; i < this.numShips; i++) {
      do {
        locations = this.generateShip();
      } while (this.collision(locations));
      this.ships[i].locations = locations;
    };
  },
  // Генерация кораблей
  generateShip: function() {
    var direction = Math.floor(Math.random() * 2);
    var row, col;

    if (direction === 1) {
      // сгенерить начальную позицию горизонтально корабля
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
    } else {
      // сгенерить начальную позицию вертикального корабля
      row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
      col = Math.floor(Math.random() * this.boardSize);
    }
    var newShipLocations = [];
    for (var i = 0; i < this.shipLength; i++) {
      if (direction === 1) {
        // добавить в массив для горизонтального корабля
        newShipLocations.push(row + "" + (col + i));
      } else {
        // добавить в массив для вертикального корабля
        newShipLocations.push((row + i) + "" + col);
      }
    };
    return newShipLocations;
  },
  collision: function(locations) {
for (var i = 0; i < this.numShips; i++) {
var ship = model.ships[i];
for (var j = 0; j < locations.length; j++) {
if (ship.locations.indexOf(locations[j]) >= 0) {
return true;
}
}
}
return false;
}
};
// Модель контроллера
var controller = {
  guesses: 0,
  processGuess: function(guess) {
    var location = parseGuess(guess);
    if (location) {
      this.guesses++;
      var hit = model.fire(location);
      if (hit && model.shipsSunk === model.numShips) {
        view.displayMessage("You sank all my battleships, in " +
          this.guesses + " guesses");
      }
    }
  }
};


function parseGuess(guess) {
  var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
  if (guess === null || guess.length !== 2) {
    alert("Oops, please enter a letter and a number on the board.");
  } else {
    firstChar = guess.charAt(0);
    var row = alphabet.indexOf(firstChar);
    var column = guess.charAt(1);
    if (isNaN(row) || isNaN(column)) {
      alert("Oops, that isn't on the board.");
    } else if (row < 0 || row >= model.boardSize ||
      column < 0 || column >= model.boardSize) {
      alert("Oops, that's off the board!");
    } else {
      return row + column;
    }
  }
  return null;
}

//Обработчик события

function init() {
  var fireButton = document.getElementById("fireButton");
  fireButton.onclick = handleFireButon;
  var guessInput = document.getElementById("guessInput");
  guessInput.onkeypress = handleKeyPress;
  model.generateShipsLocation();
};

function handleFireButon() {
  var guessInput = document.getElementById("guessInput");
  var guess = guessInput.value.toUpperCase();
  controller.processGuess(guess);
  guessInput.value = "";
};

function handleKeyPress(e) {
  var fireButton = document.getElementById("fireButton");
  if (e.keyCode === 13) {
    fireButton.click();
    return false;
  }
}

window.onload = init;
