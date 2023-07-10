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

    input.addEventListener("input", event => {
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
        button.addEventListener("click", event => {
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
        element.addEventListener("mouseenter", event => {
            if(event.buttons === 1) {
                event.target.style.backgroundColor = getColorToPaint();
            }
            event.preventDefault();
        });
        element.addEventListener("mousedown", event => {
            if(event.button != 0) return; //if pressed button isn't the first one

            if(isPaintingEnabled()) {
                event.target.style.backgroundColor = getColorToPaint();
            } 
            // if fill bucket is enabled
            else {
                //do later                
            }
            event.preventDefault();
        });
    }); 
}

function isPaintingEnabled() {
    // console.log(getClickedButtonType());
    return getClickedButtonType() !== "fill";
}

function getClickedButtonType() {
    const clickedButtons = document.getElementsByClassName("clicked");
    let clickedButtonType = null;

    if(clickedButtons.length) {
        clickedButtonType = clickedButtons[0].id;
    }

    return clickedButtonType;
}

function getInputColor() {
    const input = document.getElementById("color-pick");
    return input.value;
}

function getColorToPaint() {
    const colorMode = getClickedButtonType();

    if(!colorMode) {
        return getInputColor();
    }
}