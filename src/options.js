let colorSegment = document.getElementById("colorButtonDiv");
let selectedColor = "currentColor";
const presetButtonColors = ["#3aa757", "#e8453c", "#f9bb2d", "#4688f1"];

// Reacts to a button click by marking the selected button and saving
// the selection
function handleColorClick(event) {
  // Remove styling from the previously selected color
  let currentColor = event.target.parentElement.querySelector(
    `.${selectedColor}`
  );
  if (currentColor && currentColor !== event.target) {
    currentColor.classList.remove(selectedColor);
  }

  // Mark the button as selected
  let color = event.target.dataset.color;
  event.target.classList.add(selectedColor);
  chrome.storage.sync.set({ color });
}

// Add a button to the page for each supplied color
function constructOptions(buttonColors) {
  chrome.storage.sync.get("color", (data) => {
    let currentColorSelection = data.color;
    // For each color we were provided…
    for (let buttonColor of buttonColors) {
      // …create a button with that color…
      let button = document.createElement("button");
      button.dataset.color = buttonColor;
      button.style.backgroundColor = buttonColor;

      // …mark the currentColorly selected color…
      if (buttonColor === currentColorSelection) {
        button.classList.add(selectedColor);
      }

      // …and register a listener for when that button is clicked
      button.addEventListener("click", handleColorClick);
      colorSegment.appendChild(button);
    }
  });
}

// Initialize the page by constructing the color options
constructOptions(presetButtonColors);