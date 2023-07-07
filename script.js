const gridContainer = document.getElementById("grid-container");

const gridRow = document.createElement("div");
gridRow.classList.add("grid-row");

const gridElement = document.createElement("div");
gridElement.classList.add("grid-element");

createGrid(8); //user's input

function createGrid(size) {
    // add elemetns to gridRow
    for(let i = 0; i < size; i++) {
        const copy = gridElement.cloneNode(true);
        gridRow.appendChild(copy);
    }
    // add elemetns to gridContainer
    for(let i = 0; i < size; i++) {
        const copy = gridRow.cloneNode(true);
        gridContainer.appendChild(copy);
    }
}
