updateGrid();
listenForButtons();
listenForInput();

function updateGrid() {
    const gridSize = document.getElementById("grid-size").value;

    updateGridSizeText(gridSize);
    createGrid(gridSize);
    listenForGrid();
}

function listenForInput() {
    const input = document.getElementById("grid-size");

    input.addEventListener("input", e => {
        removeGrid();
        updateGrid();
    });
}

function updateGridSizeText(gridSize) {
    const gridSizeText = document.getElementById("current-size");
    gridSizeText.textContent = `${gridSize} x ${gridSize}`;
}

function removeGrid() {
    const gridContainer = document.getElementById("grid-container");

    while(gridContainer.firstChild) {
        gridContainer.removeChild(gridContainer.firstChild);
    }
}

function listenForButtons() {
    const buttons = document.getElementsByTagName("button");

    Array.from(buttons).forEach(button => {
        button.addEventListener("click", e => {
            makeButtonClickOnce(button); 
        });
    });
}

function makeButtonClickOnce(currentButton) {
    if(currentButton.id === "clear") {
        return
    }

    currentButton.classList.toggle("clicked");

    const clickedButtons = document.getElementsByClassName("clicked");
    if(clickedButtons.length) {
        Array.from(clickedButtons).forEach(clickedButton => {
            if(clickedButton != currentButton) {
                clickedButton.classList.remove("clicked");
            }
        });
    }
}

let chosenColor = "rgb(0, 0, 0)";

function createGrid(size) {
    const gridContainer = document.getElementById("grid-container");

    const gridRow = document.createElement("div");
    gridRow.classList.add("grid-row");

    const gridElement = document.createElement("div");
    gridElement.classList.add("grid-element");
    gridElement.classList.add("grid-borders");

    // Add elements to gridRow
    for (let i = 0; i < size; i++) {
        const element = gridElement.cloneNode();
        gridRow.appendChild(element);
    }

    // Add rows to gridContainer
    for (let i = 0; i < size; i++) {
        const row = gridRow.cloneNode(true);
        gridContainer.appendChild(row);
    }
}

function listenForGrid() {
    const gridElements = document.getElementsByClassName("grid-element");

    Array.from(gridElements).forEach(element => {
        element.addEventListener("mouseenter", paint);
    });
}

function paint(e) {
    const currentColor = e.target.style.backgroundColor;
    e.target.style.backgroundColor = getColor(currentColor);
}

function getColor(currentColor) {
    if(!currentColor) {        
        return chosenColor
    }

    splitColor(chosenColor);
}

function splitColor(colorText) {
    const insideParentheses = colorText.slice(4, colorText.length - 1);
    return insideParentheses.split(",");
}