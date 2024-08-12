document.addEventListener('DOMContentLoaded', function() {
  const playerNameInput = document.getElementById('playerName');
  const playerNameDisplay = document.getElementById('playerNameDisplay');
  const actionsLeftDisplay = document.getElementById('actionsLeft');
  const startGameButton = document.getElementById('startGameButton');
  const startScreen = document.getElementById('startScreen');
  const playerInfo = document.getElementById('playerInfo');
  const gameBoard = document.getElementById('game-board');
  const centerImage = 'Assets/Assets/Stargate.png';
  const oasisImage = 'Assets/Assets/Oasis marker.png'; 
  const playerImage = 'Assets/Assets/Player.png';
  const moveButton = document.getElementById('moveButton');
  const digButton = document.getElementById('digButton');
  let isMoving = false;
  let isDigging = false;
  let gameStarted = false;
  let actionsLeft = 3;  
  let waterSupply = 5;  
  let foundParts = 0;   
  const totalParts = 3; 
  
  startGameButton.addEventListener('click', function() {
    const playerName = playerNameInput.value || 'Player 1';
    playerNameDisplay.textContent = playerName;
    startScreen.style.display = 'none';
    playerInfo.style.display = 'block';
 
});

  function updateActionsLeftDisplay() {
    actionsLeftDisplay.textContent = actionsLeft;
  }

  updateActionsLeftDisplay();  

  function useAction() {
    if (checkGameOver()) {
      return;
    }
    actionsLeft -= 1;
    updateActionsLeftDisplay();
    if (actionsLeft <= 0) {
      setTimeout(() => {
        alert("You have used all your actions for this turn.");
        endTurn();
      }, 0);
      
    }
  }

  function endTurn() {
    actionsLeft = 3;
    waterSupply -= 1; 
    updateWaterDisplay(); 
    checkGameOver();
    console.log("Turn has ended. Water left: ", waterSupply);
}

function updateWaterDisplay() {
  const waterDisplay = document.getElementById('waterCount');
  waterDisplay.textContent = waterSupply; 
}

function updatePartsDisplay() {
  console.log('Updating parts display');
  const partsDisplay = document.getElementById('partsCount');
  if (!partsDisplay) {
    console.error('partsCount element not found!');
    return;
  }
  partsDisplay.textContent = `${foundParts}/${totalParts}`;
  console.log(`Updated parts display to ${foundParts}/${totalParts}`);
}



  
  const layouts = [
    {
      partsAndClues: {
        'Assets/Assets/Item 1.png': [{row: 1, col: 1}, {row: 1, col: 3, clue: 'Assets/Assets/Item 1 - clue_LEFT.png'}, {row: 3, col: 1, clue: 'Assets/Assets/Item 1 - clue_UP.png'}],
        'Assets/Assets/Item 2.png': [{row: 4, col: 1}, {row: 0, col: 0, clue: 'Assets/Assets/Item 2 - clue_DOWN.png'}, {row: 4, col: 3, clue: 'Assets/Assets/Item 2 - clue_LEFT.png'}],
        'Assets/Assets/Item 3.png': [{row: 4, col: 2}, {row: 4, col: 0, clue: 'Assets/Assets/Item 3 - clue_RIGHT.png'}, {row: 0, col: 2, clue: 'Assets/Assets/Item 3 - clue_DOWN.png'}]
      }
    },

    {
      partsAndClues: {
        
        'Assets/Assets/Item 1.png': [{row: 4, col: 1}, {row: 4, col: 0, clue: 'Assets/Assets/Item 1 - clue_RIGHT.png'}, {row: 0, col: 1, clue: 'Assets/Assets/Item 1 - clue_DOWN.png'}],
        'Assets/Assets/Item 2.png': [{row: 4, col: 3}, {row: 4, col: 4, clue: 'Assets/Assets/Item 2 - clue_LEFT.png'}, {row: 0, col: 3, clue: 'Assets/Assets/Item 2 - clue_DOWN.png'}],
        'Assets/Assets/Item 3.png': [{row: 1, col: 4}, {row: 0, col: 4, clue: 'Assets/Assets/Item 3 - clue_DOWN.png'}, {row: 1, col: 0, clue: 'Assets/Assets/Item 3 - clue_RIGHT.png'}]
      }
    },
    {
      partsAndClues: {
        
        'Assets/Assets/Item 1.png': [{row: 0, col: 1}, {row: 4, col: 1, clue: 'Assets/Assets/Item 1 - clue_UP.png'}, {row: 0, col: 4, clue: 'Assets/Assets/Item 1 - clue_LEFT.png'}],
        'Assets/Assets/Item 2.png': [{row: 2, col: 0}, {row: 2, col: 3, clue: 'Assets/Assets/Item 2 - clue_LEFT.png'}, {row: 4, col: 0, clue: 'Assets/Assets/Item 2 - clue_UP.png'}],
        'Assets/Assets/Item 3.png': [{row: 3, col: 3}, {row: 3, col: 1, clue: 'Assets/Assets/Item 3 - clue_RIGHT.png'}, {row: 0, col: 3, clue: 'Assets/Assets/Item 3 - clue_DOWN.png'}]
      }
    }

  ];
  const playerState = {
    position: 12, 
    isMoving: false,
    isDigging: false
  };

function addPlayerToCell(cell) {

  const playerImg = document.querySelector('.player');
  if (playerImg) {
    playerImg.parentNode.removeChild(playerImg);
  }


  const img = document.createElement('img');
  img.src = playerImage;
  img.className = 'player';
  cell.appendChild(img);
}

  const selectedLayout = layouts[Math.floor(Math.random() * layouts.length)];
  
 
  const gridSize = 5;
  const grid = new Array(gridSize * gridSize).fill('');

  
  Object.entries(selectedLayout.partsAndClues).forEach(([partSrc, positions]) => {
  
    const partIndex = positions[0].row * gridSize + positions[0].col;
    grid[partIndex] = partSrc; 

   
    positions.slice(1).forEach(position => {
      const clueIndex = position.row * gridSize + position.col;
      grid[clueIndex] = position.clue; 
    });
  });


  const centerIndex = Math.floor(gridSize * gridSize / 2);
  grid[centerIndex] = centerImage;


  const freeIndices = grid.map((src, index) => src === '' ? index : null).filter(index => index !== null);

  
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * freeIndices.length);
    const oasisIndex = freeIndices.splice(randomIndex, 1)[0]; 
    grid[oasisIndex] = oasisImage;
  }
  const stargateCell = document.querySelector(`[data-row="${centerIndex / gridSize}"][data-col="${centerIndex % gridSize}"]`);
  const oasisCells = [];
  
  
  grid.forEach((src, i) => {
    const cell = document.createElement('div');
    cell.className = 'grid-item';
    cell.dataset.row = Math.floor(i / gridSize); 
    cell.dataset.col = i % gridSize; 

    const back = document.createElement('div');
    back.className = 'back';
    cell.appendChild(back); 
  
    if (src !== '') {
      const img = document.createElement('img');
      img.src = src;
      img.className = 'front';
  
      if (src === centerImage||src === oasisImage) {
        img.style.display = 'block';
        back.style.display = 'none';
      } else {
        img.style.display = 'none';
        back.style.display = 'block'; 
        cell.classList.add('flipped');
      }
      cell.appendChild(img); 
    } else {
      back.style.display = 'block'; 
    }
    
    if (src === centerImage) {
   
      cell.addEventListener('click', function() {
        if (!gameStarted) {
        
          const img = cell.querySelector('.front');
          img.src = playerImage;
          img.style.display = 'block';
          back.style.display = 'none';
          gameStarted = true; 
         
          alert("The game begins! Now you can explore the oasis.");
        }
      });
    } 
    else if (src === oasisImage) {
    
      oasisCells.push(cell);
      cell.addEventListener('click', function() {
        if (gameStarted && playerState.isDigging) {
     
          const oasisBackImg = document.createElement('img');
          oasisBackImg.className = 'oasis-back';
          oasisBackImg.style.display = 'none'; 
          back.appendChild(oasisBackImg); 
  
       
          const isBackImgVisible = oasisBackImg.style.display === 'block';
          oasisBackImg.style.display = isBackImgVisible ? 'none' : 'block';
          playerState.isDigging = false; 
          digButton.textContent = 'Dig'; 
        }
      });
    }
      
    
    gameBoard.appendChild(cell);

   
  });

const droughtIndex = Math.floor(Math.random() * oasisCells.length);
oasisCells.forEach((cell, index) => {
  const back = cell.querySelector('.back');
  const oasisBackImg = cell.querySelector('.oasis-back');
  if (!oasisBackImg) {
    const img = document.createElement('img');
    img.src = index === droughtIndex ? 'Assets/Assets/Drought.png' : 'Assets/Assets/Oasis.png';
    img.style.display = 'none'; 
    back.appendChild(img); 
  }
});

function assignOasisBackImages() {
 
  const droughtIndex = Math.floor(Math.random() * oasisCells.length);
  oasisCells.forEach((cell, index) => {
    const oasisBackImg = document.createElement('img');
    oasisBackImg.className = 'oasis-back';
    oasisBackImg.style.display = 'none'; 
    oasisBackImg.src = index === droughtIndex ? 'Assets/Assets/Drought.png' : 'Assets/Assets/Oasis.png';
    cell.appendChild(oasisBackImg); 
  });
}
assignOasisBackImages();

function handleOasisClick(cell) {
  if (gameStarted && isDigging) {
   
    const oasisBackImg = cell.querySelector('.oasis-back');
    oasisBackImg.style.display = 'block'; 

    const oasisFrontImg = cell.querySelector('img.front');
    if (oasisFrontImg) {
      oasisFrontImg.remove(); 
    }
    
    if (oasisBackImg.src.includes('Oasis.png')) {
      waterSupply += 1; 
      alert("You've found an Oasis! Water supply increased.");
    } else if (oasisBackImg.src.includes('Drought.png')) {
      waterSupply -= 1; 
      alert("It's a Drought! Water supply decreased.");
    }
    updateWaterDisplay(); 
    useAction(); 
    playerState.isDigging = false; 
    digButton.textContent = 'Dig'; 
  }
}

// 为每个绿洲格子添加点击事件
oasisCells.forEach(cell => {
  cell.addEventListener('click', function() {
    handleOasisClick(cell);
  });
});
function flipCard(cell) {
  if (cell.classList.contains('flipped')) {
      const img = cell.querySelector('.front');
      const back = cell.querySelector('.back');
      img.style.display = img.style.display === 'none' ? 'block' : 'none';
      back.style.display = back.style.display === 'none' ? 'block' : 'none';
      cell.classList.toggle('flipped');
      

    
    const imgFileName = img.src.split('/').pop();
    console.log(imgFileName); 

    
    if (['Item%201.png', 'Item%202.png', 'Item%203.png'].includes(imgFileName)) {
          foundParts += 1;
          updatePartsDisplay();
          if (foundParts >= totalParts) {
              checkGameOver();
          }
      }
  }
}




function clearHighlights() {
  allCells.forEach(cell => {
    cell.classList.remove('highlight-movable', 'highlight');
  });
}


digButton.addEventListener('click', () => {
  if (!gameStarted) {
    alert("Please click on the Stargate to begin the game.");
    return;
  }

  if (actionsLeft > 0) {
    // Toggle digging mode
    isDigging = !isDigging;

    if (isDigging) {
      digButton.classList.add('active'); // Optional: add an 'active' class to visually indicate digging mode
      // You can also add any visual cues to indicate that the player is in dig mode
    } else {
      digButton.classList.remove('active'); // Remove the visual cue for digging mode
      // And/Or reset any digging mode visuals here
    }
  } else {
    alert("You have no actions left.");
  }
});

function getCellByPosition(position) {
  const row = Math.floor(position / gridSize);
  const col = position % gridSize;
  return document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
}


function highlightMovableCells() {

  clearHighlights();


  const currentPos = playerState.position;
  const currentRow = Math.floor(currentPos / gridSize);
  const currentCol = currentPos % gridSize;

  allCells.forEach(cell => {
    const cellRow = parseInt(cell.dataset.row, 10);
    const cellCol = parseInt(cell.dataset.col, 10);
    if (cellRow === currentRow || cellCol === currentCol) {
      cell.classList.add('highlight-movable'); 
    }
  });
}
const allCells = document.querySelectorAll('.grid-item');

allCells.forEach(cell => {
  cell.addEventListener('click', () => {
    console.log('Cell clicked!');
    if (!gameStarted) {
      alert("Please click on the Stargate to begin the game.");
      return; 
    }
    const cellIndex = parseInt(cell.dataset.row, 10) * gridSize + parseInt(cell.dataset.col, 10);

    
    if (isMoving && cell.classList.contains('highlight-movable')) {
      movePlayerToNewPosition(cellIndex); 
      isMoving = false; 
    }

    
    if (isDigging && cellIndex === playerState.position && actionsLeft > 0) {
      flipCard(cell); // Perform the dig action
      useAction(); // This will decrement the action count
      isDigging = false; // Reset digging flag
      digButton.classList.remove('active');
    }
  });
});

function movePlayerToNewPosition(newPos) {

  if (playerState.position !== newPos) {
    playerState.position = newPos;
    const newCell = document.querySelector(`[data-row="${Math.floor(newPos / gridSize)}"][data-col="${newPos % gridSize}"]`);
    addPlayerToCell(newCell);
    clearHighlights();
    newCell.classList.add('highlight');
    useAction(); 
  }
}
//Move button



moveButton.addEventListener('click', () => {
  if (!gameStarted) {
    alert("Please click on the Stargate to begin the game.");
    return;
  }
  if (!isMoving) {
    highlightMovableCells();
    isMoving = true;
    // Don't use action yet. Wait until the player actually moves.
  } else {
    clearHighlights();
    isMoving = false;
  }
});


function highlightRowAndColumn(row, col) {

  document.querySelectorAll('.highlight').forEach(cell => {
    cell.classList.remove('highlight');
  });


  const allCells = document.querySelectorAll('.grid-item');
  allCells.forEach(cell => {
    const cellRow = parseInt(cell.dataset.row, 10);
    const cellCol = parseInt(cell.dataset.col, 10);
    if (cellRow === row || cellCol === col) {
      cell.classList.add('highlight');
    }
  });
}


allCells.forEach(cell => {
 cell.addEventListener('click', (event) => {
    const row = parseInt(cell.dataset.row, 10);
    const col = parseInt(cell.dataset.col, 10);
    const cellIndex = row * gridSize + col;

    if (isMoving) {
      if (cell.classList.contains('highlight-movable')) {
        movePlayerToNewPosition(cellIndex); 
      
        isMoving = false;
      }
    } else if (isDigging && cellIndex === playerState.position) {
    
      flipCard(cell); 
   
      isDigging = false; 
    }
  });
});

function clearHighlights() {
  allCells.forEach(cell => {
    cell.classList.remove('highlight-movable', 'highlight');
  });
}
 

function removeHighlightFromCells() {
  document.querySelectorAll('.highlight').forEach(cell => {
    cell.classList.remove('highlight');
 
    cell.removeEventListener('click', movePlayer);
  });
}

let playerPosition = 12;
const playerImageElement = document.createElement('img');
playerImageElement.src = playerImage; 
playerImageElement.id = 'player'; 


function movePlayer(event) {
  if (!isMoving) {
    return;
  }
  const targetCell = event.target.closest('.grid-item'); 
  const targetRow = parseInt(targetCell.dataset.row, 10);
  const targetCol = parseInt(targetCell.dataset.col, 10);
  const targetPosition = targetRow * gridSize + targetCol;


  if (isMovable(playerState.position, targetPosition, gridSize)) {

    removePlayerImage(playerState.position);
     
     playerState.position = targetPosition;
    
    addPlayerImage(targetPosition);

    
    isMoving = false;
    moveButton.classList.remove('active');
    removeHighlightFromCells();
  }
}

function addPlayerImage(position) {
  const row = Math.floor(position / gridSize);
  const col = position % gridSize;
  const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
  if (cell && !cell.querySelector('.player')) {
    cell.appendChild(playerImageElement);
  }
}


function removePlayerImage(position) {
  const row = Math.floor(position / gridSize);
  const col = position % gridSize;
  const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
  const playerImg = cell.querySelector('.player');
  if (playerImg) {
    cell.removeChild(playerImg);
  }
}


function isMovable(currentPosition, targetPosition, gridSize) {
  const currentRow = Math.floor(currentPosition / gridSize);
  const currentCol = currentPosition % gridSize;
  const targetRow = Math.floor(targetPosition / gridSize);
  const targetCol = targetPosition % gridSize;

  return (
    (currentRow === targetRow && Math.abs(currentCol - targetCol) === 1) || (currentCol === targetCol && Math.abs(currentRow - targetRow) === 1) );
}

function checkGameOver() {
  if (foundParts >= totalParts) {
      alert("🎉 Congratulations! You've found all parts and won the game! 🎉");
  } else if(waterSupply <= 0){
      alert("😢 Game Over! You've run out of water and failed to find all parts. 😢");
      moveButton.disabled = true;
      digButton.disabled = true;
      return true; 
    }
    return false; 
 
}


});