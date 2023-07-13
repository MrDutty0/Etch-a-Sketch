updateGrid();
listenForButtons();
listenForInput();

let lastColoredNode = null;

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
            if(button.id === "clear") {
                clearGrid();
            }
        });
    });
}

function clearGrid() {
    const gridContainer = document.getElementById("grid-container");

    for(const row of Array.from(gridContainer.children)) { //loop through rows
        for(const gridElement of Array.from(row.children)) { //loop through elements of row
            gridElement.removeAttribute("data-color-origin");
            //set to the default values:
            gridElement.style.filter = ""; 
            gridElement.style.backgroundColor = "";
        }
    }
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
            if(event.buttons !== 1) return; //if the first mouse button is not being held
            
            makeColorChangesBySelectedMode(event);
            event.preventDefault();
        });
        element.addEventListener("mousedown", event => {
            if(event.button != 0) return; //if pressed button isn't the first one

            makeColorChangesBySelectedMode(event);
            event.preventDefault();
        });
    }); 
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
    const inputColorInHex = document.getElementById("color-pick").value;
    return hexToRgb(inputColorInHex);
}

function hexToRgb(inHex) {
    const r = parseInt(inHex.slice(1,3), 16);
    const g = parseInt(inHex.slice(3,5), 16);
    const b = parseInt(inHex.slice(5), 16);

    return `rgb(${r}, ${g}, ${b})`;
}

function getRainbowColor(event) {
    const colors = [
        "rgb(255, 50, 50)",    // red
        "rgb(255, 165, 0)",   // orange
        "rgb(255, 255, 0)",   // yellow
        "rgb(0, 255, 0)",     // green
        "rgb(0, 0, 255)",     // blue
        "rgb(75, 0, 130)",    // indigo
        "rgb(147, 0, 255)"    // violet
      ];

    const colorIndex = {
        "red" : 0,
        "orange" : 1,
        "yellow" : 2,
        "green" : 3,
        "blue" : 4,
        "indigo" : 5,
        "violet" : 6
    };
    let nextColorIndex = 0;
    if(lastColoredNode) { //if grid is colored at all
        const lastColorOrigin = lastColoredNode.getAttribute("data-color-origin");
        if(lastColorOrigin) {// if last colored node has data-color-origin attribute
            nextColorIndex = (colorIndex[lastColorOrigin] + 1) % 7;   
        }
    }

    event.target.setAttribute("data-color-origin", getKeyByValue(colorIndex, nextColorIndex)) //set element's data-color-origin attribute
    const newColor = randomizeColor(colors[nextColorIndex]);

    return newColor;
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

function randomizeColor(rgbColor) {
    const newColorsValues = [];
    for(let rgbValue of rgbColor.slice(4, -1).split(","))
    {
        const randNum = Math.floor(Math.random() * 25);
        
        newColorsValues.push(Math.abs(+rgbValue - randNum));
    }
    const newColor = `rgb(${newColorsValues[0]}, ${newColorsValues[1]}, ${newColorsValues[2]})`;
    return newColor;
}

function getBrightness(event) {
    const fullBrightnessText = event.target.style.filter;
    if(!fullBrightnessText) return null;
    const brightnessValue = fullBrightnessText.slice(fullBrightnessText.indexOf("(") + 1, -2);
    return brightnessValue;
}

function makeDarkened(event) {
    const currentBrightness = getBrightness(event);
    if(currentBrightness) {
        event.target.style.filter = `brightness(${Math.max(20, currentBrightness - 8)}%)`;
    } else {
        event.target.style.filter = `brightness(${100}%)`;
    }
}

function makeColorChangesBySelectedMode(event) {
    const colorMode = getClickedButtonType();

    switch (colorMode) {
        case "rainbow":
            changeBackgroundColor(event, getRainbowColor(event)); 
            lastColoredNode = event.target;
            break;

        case "fill":
            if(event.type === "mousedown") {
                const currColor = event.target.style.backgroundColor;
                makeFill(getElementRowIndex(event), event.target, getInputColor(), currColor);
            }
            break;

        case "darkening":
            makeDarkened(event);
            lastColoredNode = event.target;
            //no need to add break because default action changes the background 

        default:
            changeBackgroundColor(event, getInputColor());
    }
}

function makeFill(currIndex, element, colorToPaintWith, colorToPaintOn, defaultColor = "rgb(253, 248, 242)") {
    if(!element) return;

    const currColor = element.style.backgroundColor;

    if(currColor === defaultColor || (currColor === colorToPaintOn && (colorToPaintWith !== colorToPaintOn))) {
        element.style.backgroundColor = colorToPaintWith;
    } else return;

    //Go horizontally
    const allSiblings = Array.from(element.parentElement.children); 
    if(inRange(currIndex - 1)) {
        const leftSibling = allSiblings[currIndex - 1];
        makeFill(currIndex - 1, leftSibling, colorToPaintWith, colorToPaintOn);
    }
    if(inRange(currIndex + 1)) {
        const rightSibling = allSiblings[currIndex + 1];
        makeFill(currIndex + 1, rightSibling, colorToPaintWith, colorToPaintOn);
    }

    //go vertically
    const aboveParentSibling = element.parentElement.previousElementSibling;
    const belowParentSibling = element.parentElement.nextElementSibling;

    if(aboveParentSibling) { // if parent element above exists
        const aboveElement = Array.from(aboveParentSibling.children)[currIndex];
        makeFill(currIndex, aboveElement, colorToPaintWith, colorToPaintOn);
    }

    if(belowParentSibling) { // if parent element above exists
        const belowElement = Array.from(belowParentSibling.children)[currIndex];
        makeFill(currIndex, belowElement, colorToPaintWith, colorToPaintOn);
    }
}

function inRange(index) {
    const gridRange = document.getElementById("grid-size").value;
    return index >= 0 && index < gridRange;
}

function getElementRowIndex(event) {
    const elementToFind = event.target;
    const allSiblings = Array.from(elementToFind.parentElement.children); 

    const elementIndex = allSiblings.indexOf(elementToFind);
    return elementIndex;
}

function changeBackgroundColor(event, color) {
    event.target.style.backgroundColor = color;
}