let colorSegment = document.getElementById("colorButtonDiv");
let selectedClassName = "currentColor";
const presetButtonColors = ["#3aa757", "#e8453c", "#f9bb2d", "#4688f1"];

// Reacts to a button click by marking the selected button and saving
// the selection
function handleButtonClick(event) {
  // Remove styling from the previously selected color
  let currentColor = event.target.parentElement.querySelector(
    `.${selectedClassName}`
  );
  if (currentColor && currentColor !== event.target) {
    currentColor.classList.remove(selectedClassName);
  }

  // Mark the button as selected
  let color = event.target.dataset.color;
  event.target.classList.add(selectedClassName);
  chrome.storage.sync.set({ color });
}

// Add a button to the segment for each supplied color
function constructOptions(buttonColors) {
  chrome.storage.sync.get("color", (data) => {
    let currentColorSelection = data.color;
    // For each color we were provided…
    for (let buttonColor of buttonColors) {
      // …create a button with that color…
      let button = document.createElement("button");
      button.dataset.color = buttonColor;
      button.style.backgroundColor = buttonColor;

      // …mark the currentColor selected color…
      if (buttonColor === currentColorSelection) {
        button.classList.add(selectedClassName);
      }

      // …and register a listener for when that button is clicked
      button.addEventListener("click", handleButtonClick);
      colorSegment.appendChild(button);
    }
  });
}

// Initialize the segment by constructing the color options
constructOptions(presetButtonColors);