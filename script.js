const operationStack = [];//empty stack

const moveUnit = 169;
const colSize = 3;
const initialRowSize = 3;

let currentRows = 0
let currentColor = 0
let srcBox;

//undo the situation and come to previous one
function handleUndo () {
  console.log("Undo called");
  if (!operationStack.length) {
    alert('No more undo operations possible');
    return;
  }

  swapBoxes(operationStack.pop());  
}

//Create Row in a table
function createRowElement(colors, texts) {
  const tr = document.createElement("tr")

  const td1 = document.createElement("td")
  const div1 = document.createElement("div")
  div1.innerText = `R${currentRows}`
  td1.appendChild(div1)   //r1c1
  
  const td2 = document.createElement("td")
  const div2 = document.createElement("div")
  div2.style.backgroundColor = colors[0]
  div2.innerText = texts[0]
  div2.className = "box"
  div2.draggable = true
  div2.id = texts[0] / 100
  addEventListenerToElement(div2)
  td2.className = "item"
  td2.appendChild(div2)   //r1c2

  const td3 = document.createElement("td")
  const div3 = document.createElement("div")
  div3.style.backgroundColor = colors[1]
  div3.innerText = texts[1]
  div3.className = "box"
  div3.draggable = true
  div3.id = texts[1] / 100
  addEventListenerToElement(div3)
  td3.className = "item"
  td3.appendChild(div3) //r1c3

  const td4 = document.createElement("td")
  const div4 = document.createElement("div")
  div4.style.backgroundColor = colors[2]
  div4.innerText = texts[2]
  div4.className = "box"
  div4.draggable = true
  div4.id = texts[2] / 100
  addEventListenerToElement(div4)
  td4.className = "item"
  td4.appendChild(div4)  //r1c4

  tr.appendChild(td1)
  tr.appendChild(td2)
  tr.appendChild(td3)
  tr.appendChild(td4)

  return tr
}

// To get the different color in every table cell
function getColor(color_number){
  init = 3*color_number
  return [`hsl(${(init - 2) * 137.508},50%,75%)`, `hsl(${(init - 1) * 137.508},50%,75%)`, `hsl(${init * 137.508},50%,75%)`];
}

//Differnt numbers on every table cell
function getText(row_number){
  init = 3*row_number
  return [100*(init-2), 100*(init-1), 100*init]
}

//Function for clicking the add button and create a new row with differentand with different number
function handleAddRow() {
  console.log("Add Row called")

  currentRows = currentRows + 1
  let texts = getText(currentRows)

  currentColor = currentColor + 1
  let colors = getColor(currentColor)
  
  let row_element = createRowElement(colors, texts)
  let table = document.getElementById("table")
  table.appendChild(row_element)

}

//Swapping 
function swapBoxes([src, dest]) {
  console.log("swap called", src, dest);
  
  const tempContent = src.innerHTML;
  const tempBG = src.style.backgroundColor;

  src.innerHTML = dest.innerHTML; src.style.backgroundColor = dest.style.backgroundColor;
  dest.innerHTML = tempContent; dest.style.backgroundColor = tempBG;
}


function dragStart(e) {
  console.log("drag started")
  this.style.opacity = '0.4';
  srcBox = this;
  e.dataTransfer.effectAllowed = 'move';
}
function dragEnter(e) {
  console.log("drag enter")
  e.preventDefault();
  e.target.classList.add('drag-over');
}

function dragEnd(e){
  console.log("drag end")
  this.style.opacity = '1';
  items.forEach(function (item) {
      item.classList.remove('over');
    });
}

function dragOver(e) {
  console.log("drag over")
  e.preventDefault();
  return false;
}


function dragLeave(e) {
  console.log("drag leave")
  this.classList.remove('over');
}

function handleDrop(e) {
  e.stopPropagation(); // stops the browser from redirecting.
  console.log("operation stack -> ", operationStack)
  if (srcBox !== this) {
    operationStack.push([srcBox, this]); 
    swapBoxes(operationStack[operationStack.length - 1])
    handleAnimation(srcBox, getFinalDestination(srcBox.id, this.id))
  }
  return false;    
}

//events for performing drag and drop
function addEventListenerToElement(box) {
  box.addEventListener('dragstart',dragStart);
  box.addEventListener('dragenter', dragEnter);
  box.addEventListener('dragover', dragOver);
  box.addEventListener('dragleave', dragLeave);
  box.addEventListener('dragleave', dragEnd);
  box.addEventListener('drop', handleDrop);
}


document.addEventListener('DOMContentLoaded', (event) => {
  /* drop targets */
  let boxes = document.querySelectorAll('.item .box');
  boxes.forEach(box => addEventListenerToElement(box));
});

// initialize table with 1 rows
for(i=0; i<1;i++) handleAddRow()
console.log("Table initialized with 1 elements")


// Adding Animation
const getX = x => (x - 1) % colSize;

const getY = y => Math.floor((y-1) / 3);

const getDist = (src, dest) => `${(dest - src) * moveUnit}px`;

// Receives ID of the boxes, 
const getFinalDestination = (srcId, destId) => [ 
  getDist(getX(srcId), getX(destId)), 
  getDist(getY(srcId), getY(destId))
]
 
const handleAnimation = (box, [xDist, yDist]) => {
  console.log(getDist(getY(5), getY(6)), getY(5), getY(6));
  console.log('handle Animation called', box, xDist, yDist);
  box.style.zIndex = 3;
  
  box.animate([
    {left: xDist, top: yDist},
    {left: '0px', top: '0px'},
  ], {
    duration: 3000
  });
}
