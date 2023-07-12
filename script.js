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
    const input = document.getElementById("color-pick");
    return input.value;
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
                //...
                break;
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

function changeBackgroundColor(event, color) {
    event.target.style.backgroundColor = color;
}