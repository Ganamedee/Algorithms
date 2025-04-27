# Algorithm Visualizer

An interactive web tool designed to make learning fundamental computer science algorithms easier and more intuitive by visualizing their execution step-by-step.

**Live Demo:** [https://visualalgo.vercel.app](https://visualalgo.vercel.app)

## What it Does

Algorithm Visualizer provides a dynamic way to understand how different algorithms operate. You can select sorting algorithms and watch bars rearrange, choose searching algorithms and see elements being compared, or visualize pathfinding algorithms exploring a grid. Controls for speed and data size allow you to observe the practical implications of algorithm efficiency.

## Key Features

*   **Sorting Algorithms Visualized:** Bubble Sort, Selection Sort, Insertion Sort, Quick Sort.
*   **Searching Algorithms Visualized:** Linear Search, Binary Search (Array is automatically sorted).
*   **Pathfinding Algorithms Visualized:** A* (A-Star) Search, Dijkstra's Algorithm (side-by-side comparison).
*   **Interactive Controls:** Select algorithms, adjust data size, control speed, start/stop/reset actions, and input search values.
*   **Clear Visual Feedback:** Elements change color/style to indicate comparisons, swaps, visited nodes, and final paths.
*   **Algorithm Information:** Click the 'ⓘ' buttons to view modals explaining algorithm categories and their time/space complexities.

## How it Works

*   **Frontend:** The application is built using standard HTML, CSS, and vanilla JavaScript.
*   **Visualization:** Sorting/Searching use direct DOM manipulation; Pathfinding uses the HTML Canvas API.
*   **Algorithm Logic:** Core algorithms are implemented in JavaScript, using `async/await` and `setTimeout` to control visualization speed.
*   **Backend:** A minimal Node.js Express server serves the static web files.