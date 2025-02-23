// searching.js

let searchingArray = [];
let searchingStop = false;
let searchDelay = 100;
const searchingContainer = document.getElementById("searching-container");

function updateSearchDelay() {
  searchDelay =
    500 - parseInt(document.getElementById("searching-speed").value);
}

function getSearchingSize() {
  const inputSize =
    parseInt(document.getElementById("searching-size").value) || 30;
  return Math.min(Math.max(inputSize, 10), 60); // Clamp between 10 and 60
}

function generateSearchingArray(sorted = false) {
  searchingStop = false;
  const size = getSearchingSize();
  searchingArray = [];
  searchingContainer.innerHTML = "";

  for (let i = 0; i < size; i++) {
    let value = Math.floor(Math.random() * 100) + 1;
    searchingArray.push(value);
  }

  if (sorted) {
    searchingArray.sort((a, b) => a - b);
  }

  for (let i = 0; i < size; i++) {
    const circle = document.createElement("div");
    circle.classList.add("circle");
    circle.innerHTML = `
      <span class="value">${searchingArray[i]}</span>
      <span class="index">${i}</span>
    `;
    searchingContainer.appendChild(circle);
  }
}

async function linearSearch(target) {
  const circles = document.querySelectorAll("#searching-container .circle");
  for (let i = 0; i < searchingArray.length; i++) {
    if (searchingStop) return;

    circles[i].style.transform = "scale(1.2)";
    circles[i].style.boxShadow = "0 0 20px #ff4500";
    circles[i].style.background = "linear-gradient(135deg, #ff4500, #ff8c00)";

    await sleep(searchDelay);

    if (searchingArray[i] === target) {
      circles[i].style.background = "linear-gradient(135deg, #00ff00, #008000)";
      circles[i].style.transform = "scale(1.3)";
      circles[i].style.boxShadow = "0 0 30px #00ff00";
      return;
    }

    circles[i].style.transform = "scale(1)";
    circles[i].style.background = "linear-gradient(135deg, #2a5298, #1e3c72)";
    circles[i].style.boxShadow = "0 4px 15px rgba(0,0,0,0.3)";
  }
  alert("Value not found!");
}

async function binarySearch(target) {
  const circles = document.querySelectorAll("#searching-container .circle");
  let low = 0,
    high = searchingArray.length - 1;

  while (low <= high) {
    if (searchingStop) return;
    let mid = Math.floor((low + high) / 2);

    // Highlight current search range
    for (let i = low; i <= high; i++) {
      circles[i].style.background = "linear-gradient(135deg, #4a00e0, #8e2de2)";
    }

    circles[mid].style.transform = "scale(1.2)";
    circles[mid].style.boxShadow = "0 0 20px #ff4500";
    circles[mid].style.background = "linear-gradient(135deg, #ff4500, #ff8c00)";

    await sleep(searchDelay);

    if (searchingArray[mid] === target) {
      circles[mid].style.background =
        "linear-gradient(135deg, #00ff00, #008000)";
      circles[mid].style.transform = "scale(1.3)";
      circles[mid].style.boxShadow = "0 0 30px #00ff00";
      return;
    }

    circles[mid].style.transform = "scale(1)";
    circles[mid].style.boxShadow = "0 4px 15px rgba(0,0,0,0.3)";

    if (searchingArray[mid] < target) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }

    // Reset non-active range
    for (let i = 0; i < searchingArray.length; i++) {
      if (i < low || i > high) {
        circles[i].style.background =
          "linear-gradient(135deg, #2a5298, #1e3c72)";
      }
    }
  }
  alert("Value not found!");
}

// Event listeners and initialization
document.getElementById("reset-searching").addEventListener("click", () => {
  const algo = document.getElementById("searching-algo-select").value;
  generateSearchingArray(algo === "binary");
});

document.getElementById("stop-searching").addEventListener("click", () => {
  searchingStop = true;
});

document
  .getElementById("searching-speed")
  .addEventListener("input", updateSearchDelay);

document
  .getElementById("start-searching")
  .addEventListener("click", async () => {
    updateSearchDelay();
    const algo = document.getElementById("searching-algo-select").value;
    const searchValue = parseInt(document.getElementById("search-value").value);
    if (isNaN(searchValue)) {
      alert("Please enter a valid number.");
      return;
    }
    if (algo === "linear") {
      await linearSearch(searchValue);
    } else if (algo === "binary") {
      await binarySearch(searchValue);
    }
  });

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Initial array generation
generateSearchingArray(false);
