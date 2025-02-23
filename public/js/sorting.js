// sorting.js

let sortingArray = [];
let sortingStop = false;
let sortDelay = 50;
const sortingContainer = document.getElementById("sorting-container");

function updateSortDelay() {
  sortDelay = 500 - parseInt(document.getElementById("sorting-speed").value);
}

function getSortingSize() {
  return parseInt(document.getElementById("sorting-size").value) || 50;
}

function generateSortingArray() {
  sortingStop = false;
  const size = getSortingSize();
  const containerWidth = sortingContainer.clientWidth - 40; // Account for padding
  const barWidth = Math.floor((containerWidth - (size - 1) * 2) / size); // Account for gaps

  sortingArray = [];
  sortingContainer.innerHTML = "";
  sortingContainer.style.display = "flex";
  sortingContainer.style.alignItems = "flex-end";

  for (let i = 0; i < size; i++) {
    let value = Math.floor(Math.random() * 290) + 10;
    sortingArray.push(value);
    const bar = document.createElement("div");
    bar.classList.add("bar");
    bar.style.height = value + "px";
    bar.style.width = barWidth + "px";
    bar.style.marginRight = i < size - 1 ? "2px" : "0"; // Add gap between bars except for last one
    sortingContainer.appendChild(bar);
  }
}

generateSortingArray();

document
  .getElementById("reset-sorting")
  .addEventListener("click", generateSortingArray);
document.getElementById("stop-sorting").addEventListener("click", () => {
  sortingStop = true;
});
document
  .getElementById("sorting-speed")
  .addEventListener("input", updateSortDelay);

document.getElementById("start-sorting").addEventListener("click", async () => {
  updateSortDelay();
  const algo = document.getElementById("sorting-algo-select").value;
  if (algo === "bubble") {
    await bubbleSort();
  } else if (algo === "selection") {
    await selectionSort();
  } else if (algo === "insertion") {
    await insertionSort();
  } else if (algo === "quick") {
    await quickSort(0, sortingArray.length - 1);
  }
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Bubble Sort
async function bubbleSort() {
  let bars;
  for (let i = 0; i < sortingArray.length - 1; i++) {
    if (sortingStop) return;
    for (let j = 0; j < sortingArray.length - i - 1; j++) {
      if (sortingStop) return;
      bars = document.querySelectorAll("#sorting-container .bar");
      bars[j].style.background = "#ff4500";
      bars[j + 1].style.background = "#ff4500";
      await sleep(sortDelay);
      if (sortingArray[j] > sortingArray[j + 1]) {
        [sortingArray[j], sortingArray[j + 1]] = [
          sortingArray[j + 1],
          sortingArray[j],
        ];
        bars[j].style.height = sortingArray[j] + "px";
        bars[j + 1].style.height = sortingArray[j + 1] + "px";
      }
      bars[j].style.background = "linear-gradient(to top, #ffd700, #ffb700)";
      bars[j + 1].style.background =
        "linear-gradient(to top, #ffd700, #ffb700)";
    }
  }
}

// Selection Sort
async function selectionSort() {
  let bars;
  for (let i = 0; i < sortingArray.length; i++) {
    if (sortingStop) return;
    let minIdx = i;
    bars = document.querySelectorAll("#sorting-container .bar");
    bars[minIdx].style.background = "#ff4500";
    for (let j = i + 1; j < sortingArray.length; j++) {
      if (sortingStop) return;
      bars[j].style.background = "#ff4500";
      await sleep(sortDelay);
      if (sortingArray[j] < sortingArray[minIdx]) {
        bars[minIdx].style.background =
          "linear-gradient(to top, #ffd700, #ffb700)";
        minIdx = j;
        bars[minIdx].style.background = "#ff4500";
      } else {
        bars[j].style.background = "linear-gradient(to top, #ffd700, #ffb700)";
      }
    }
    if (minIdx !== i) {
      [sortingArray[i], sortingArray[minIdx]] = [
        sortingArray[minIdx],
        sortingArray[i],
      ];
      bars[i].style.height = sortingArray[i] + "px";
      bars[minIdx].style.height = sortingArray[minIdx] + "px";
    }
    bars[minIdx].style.background = "linear-gradient(to top, #ffd700, #ffb700)";
  }
}

// Insertion Sort
async function insertionSort() {
  let bars = document.querySelectorAll("#sorting-container .bar");
  for (let i = 1; i < sortingArray.length; i++) {
    if (sortingStop) return;
    let key = sortingArray[i];
    let j = i - 1;
    bars[i].style.background = "#ff4500";
    await sleep(sortDelay);

    while (j >= 0 && sortingArray[j] > key) {
      if (sortingStop) return;
      sortingArray[j + 1] = sortingArray[j];
      bars[j + 1].style.height = sortingArray[j + 1] + "px";
      bars[j].style.background = "#ff4500";
      await sleep(sortDelay);
      bars[j].style.background = "linear-gradient(to top, #ffd700, #ffb700)";
      j--;
    }
    sortingArray[j + 1] = key;
    bars[j + 1].style.height = key + "px";
    bars[i].style.background = "linear-gradient(to top, #ffd700, #ffb700)";
  }
}

// Quick Sort (recursive)
async function quickSort(low, high) {
  if (sortingStop) return;
  if (low < high) {
    let pi = await partition(low, high);
    await quickSort(low, pi - 1);
    await quickSort(pi + 1, high);
  }
}

async function partition(low, high) {
  let bars = document.querySelectorAll("#sorting-container .bar");
  let pivot = sortingArray[high];
  bars[high].style.background = "#00ff00"; // pivot
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (sortingStop) return;
    bars[j].style.background = "#ff4500";
    await sleep(sortDelay);

    if (sortingArray[j] < pivot) {
      i++;
      // Swap elements
      [sortingArray[i], sortingArray[j]] = [sortingArray[j], sortingArray[i]];
      // Update heights
      bars[i].style.height = sortingArray[i] + "px";
      bars[j].style.height = sortingArray[j] + "px";
    }
    bars[j].style.background = "linear-gradient(to top, #ffd700, #ffb700)";
  }

  // Place pivot in correct position
  [sortingArray[i + 1], sortingArray[high]] = [
    sortingArray[high],
    sortingArray[i + 1],
  ];
  bars[i + 1].style.height = sortingArray[i + 1] + "px";
  bars[high].style.height = sortingArray[high] + "px";
  bars[high].style.background = "linear-gradient(to top, #ffd700, #ffb700)";

  return i + 1;
}
