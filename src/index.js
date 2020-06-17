let steps = [];
let stepsUndo = [];

let deletedClassName = [];
let compareSteps = [];

//let arr = new Array();

//let obj = new Object();

let wonTitleElement = document.querySelector(".won-title");
let wonMessageElement = document.querySelector(".won-message");
let undoButton = document.querySelector(".undo-btn");
let redoButton = document.querySelector(".redo-btn");
let restartButton = document.querySelector(".restart-btn");
   
cellAll = document.querySelectorAll('.cell');

undoButton.addEventListener("click", undo);
redoButton.addEventListener("click", redo);
restartButton.addEventListener("click", restart);

let players = [
    { name: "cross", className: "ch", plural: "Crosses" },
    { name: "toe", className: "r", plural: "Toes" }
];
let winClasses = ["horizontal", "vertical", "diagonal-right", "diagonal-left"];

let cells = document.getElementsByClassName('cell');
let rows = document.getElementsByClassName('row');
let arrCells = Array.from(cells);
let arrRows = Array.from(rows);

//save process
///////////////////
/*let save = JSON.parse(localStorage.getItem("step"));

if (save && save.length > 0) {
    let savedSteps = save[0];
    let savedStepsUndo = save[1];
    savedSteps = steps;
    if (savedStepsUndo && savedStepsUndo.length > 0) {
        stepsUndo = savedStepsUndo;
    }
}
///////////////////
window.addEventListener('storage', function (event) {
    if (event.key === "step" && event.oldValue !== event.newValue) {
        let save = event.newValue;
        let savedStepsUndo = JSON.parse(save)[1];
        savedSteps = JSON.parse(save)[0];
        if (savedSteps) {
            savedSteps = steps;
        }
            if (savedStepsUndo && savedStepsUndo.length > 0) {
            stepsUndo = savedStepsUndo;
        }
    }
});*/

///////////////////
/*function updLS() {
  localStorage.setItem('step', JSON.stringify([steps, stepsUndo]));
}*/
///////////////////


field.querySelectorAll(".row").forEach(e => {
    let cells = e.querySelectorAll(".cell");
    cells.forEach(c => {
        c.addEventListener("click", cellClickHandler); // add cross or toes into cells
    });
});


let counter = 0;

function cellClickHandler(e) {
    step(e);
}


//undo
function undo() {

    if (counter === 1) {
        undoButton.disabled = true;
    } else {
        if(wonMessageElement.innerHTML.length !== 0){
            undoButton.disabled = false;
        }
    }

    redoButton.disabled = false;

    let lastItemUndo = steps.pop();

    stepsUndo.push(lastItemUndo);
    //updLS();
    let lastItemUndoId = document.getElementById(lastItemUndo);
    

    deletedClassName.push(lastItemUndoId.className);


    lastItemUndoId.className = 'cell'

    counter--;

    undoButton.classList.add('undoStop');
}

function redo() {

    compareSteps.length = 0;

    for (let k = 0; k < steps.length; k++) {
        compareSteps.push(steps[k]);
    }

    if (steps.length === compareSteps.length) {
       
            undoButton.disabled = false;
            redoButton.disabled = false;
      
    } else {
        
            undoButton.disabled = true;
            redoButton.disabled = true;
       
    }

    
    if (stepsUndo.length === 1) {
        redoButton.disabled = true;
    }

    if (stepsUndo.length !== 0) {



        let lastItemRedo = stepsUndo.pop();

        let lastItemRedoId = document.getElementById(lastItemRedo);

        if ((lastItemRedoId.classList[1] !== 'ch') && (lastItemRedoId.classList[1] !== 'r')) {

            let deletedClassNameLast = deletedClassName.pop();


            lastItemRedoId.className = deletedClassNameLast;
            steps.push(lastItemRedo);
            //updLS();
            counter++;
        } else {
            stepsUndo.length = 0;
            counter+=2;
        }
        
    }

    undoButton.classList.remove('undoStop');

   
}



function restart() {
    field.querySelectorAll(".cell").forEach(e => {
        players.forEach(p => e.classList.remove(p.className));
        winClasses.forEach(p => e.classList.remove(p));
        e.classList.remove("win");
    });
    undoButton.disabled = true;
    redoButton.disabled = true;
    wonTitleElement.classList.add("hidden");

    steps.length = 0;
    stepsUndo.length = 0;
    deletedClassName.length = 0;

    undoButton.classList.remove('undoStop');
    counter = 0;
    coun = 0;
    wonMessageElement.textContent = "";


    //localStorage.clear();
}


function step(e) {
    if(wonMessageElement.innerHTML.length === 0){
        undoButton.disabled = false;
    }

    if (!wonTitleElement.classList.contains("hidden")) {
        player = false;
    } //block cells after the win

    else if (e.target.className === 'cell') {

        player = players;

        if (counter % 2 === 0) {
            player = players[0];
            e.target.classList.add('ch');
        }
        else {
            player = players[1];
            e.target.classList.add('r');
        }


        steps.push(e.target.id);

        if (undoButton.classList.length === 3) {
            steps.length = 0;
            stepsUndo.length = 0;

            cellAll.forEach(elems => {
                if (elems.classList.length === 2) {
                    steps.push(elems.id);
                    stepsUndo.push(elems.id);
                    //localStorage.setItem("step", JSON.stringify([steps, stepsUndo]));

                }

            });

        } /*else {
            localStorage.setItem("step", JSON.stringify([steps, stepsUndo]));
        }*/

        counter++;
    }

    redoButton.disabled = true;


    horizontal();
    vertical();
    leftDiagonal();
    rightDiagonal();
    draw();

}
//horizontal
function horizontal() {
    let count = 0;
    for (let i = 0; i < COLS_COUNT; i++) {
        let array = Array.from(arrRows[i].children);

        count = 0;
        for (let CELL of array) {
            if (CELL.className === 'cell ' + player.className) {
                count++;
            }
            if (count === COLS_COUNT) {
                // console.log("win - HORIZONTAL");
                end(player);

                array.forEach(el => {
                    el.classList.add('win', 'horizontal');
                });
            }
        }
    }

    return;
}
//vertical
function vertical() {
    let count = 0;
    
    for (let i = 0; i < COLS_COUNT; i++) {
        let array = [];
        count = 0;
        for (let a = i; a < (COLS_COUNT * COLS_COUNT) - (COLS_COUNT - i - 1); a += COLS_COUNT) {
            array.push(arrCells[a]);
        }
       

        for (let CELL of array) {
            if (CELL.className === 'cell ' + player.className) {
                count++;
                
            }
            if (count === COLS_COUNT) {
                //console.log("win - VERTICAL");
                end(player);

                array.forEach(el => {
                    el.classList.add('win', 'vertical');
                });
            }
        }
    }
    return;
}
//leftDiagonal
function leftDiagonal() {
    let count = 0;
    let array = [];
    let i;
    for (i = COLS_COUNT - 1; i < ((COLS_COUNT - 1) * COLS_COUNT) + 1; i += COLS_COUNT - 1) {
        array.push(arrCells[i]);
    }
    

    for (let CELL of array) {
       
        if (CELL.className === 'cell ' + player.className) {
            count++;
            
        }
    }
    if (count === COLS_COUNT) {
        //console.log("win - leftDiagonal");
        end(player);
        array.forEach(el => {
            el.classList.add('win', 'diagonal-left');
        });
    }
    return;
}
//rightDiagonal
function rightDiagonal() {
    let count = 0;
    let array = [];
    let i;
    for (i = 0; i < COLS_COUNT * COLS_COUNT + 1; i += COLS_COUNT + 1) {
        array.push(arrCells[i]);
    }
    

    for (let CELL of array) {
        
        if (CELL.className === 'cell ' + player.className) {
            count++;
            
        }
    }
    if (count === COLS_COUNT) {
        //console.log("win - rightDiagonal");
        end(player);
        array.forEach(el => {
            el.classList.add('win', 'diagonal-right');
        });
    }
    return;
}

//draw
let coun = 0;
function draw() {


    let arrayForDraw = [];
    for (i = 0; i < COLS_COUNT * COLS_COUNT; i++) {
        if (arrCells[i].classList.length === 2) {
            arrayForDraw.push(arrCells[i]);
            if (arrCells.length === arrayForDraw.length) {
                coun = 1;
            }
        }
    }

    if ((wonMessageElement.innerHTML.length == 0) && (coun === 1)) {
        wonTitleElement.classList.remove("hidden");
        undoButton.disabled = true;
        wonMessageElement.textContent = "It's a draw!";
    }
    return;

}

//end
function end(player) {
    wonTitleElement.classList.remove("hidden");
    if (player) {
        wonMessageElement.textContent = player.plural + " won!";
    }

    redoButton.disabled = true;
    undoButton.disabled = true;
    //localStorage.clear();
}
