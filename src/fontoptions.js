let fontFamilySegment = document.getElementById("fontFamilyButtonDiv");
let selectedFontFamily = "currentFontFamily";
const presetButtonFontFamilies = ["courier new", "arial", "times new roman", "impact"]

// Reacts to a button click by marking the selected button and saving
// the selection
function handleButtonClick(event) {
  // Remove styling from the previously selected font family
  let currentFontFamily = event.target.parentElement.querySelector(
    `.${selectedFontFamily}`
  );
  if (currentFontFamily && currentFontFamily !== event.target) {
    currentFontFamily.classList.remove(selectedFontFamily);
  }

  // Mark the button as selected
  let fontFamily = event.target.dataset.fontFamily;
  event.target.classList.add(selectedFontFamily);
  chrome.storage.sync.set({ fontFamily });
}

// Add a button to the segment for each supplied font family
function constructOptions(buttonFontFamilies) {
  chrome.storage.sync.get("fontFamily", (data) => {
    let currentFontFamilySelection = data.fontFamily;
    // For each font family we were provided…
    for (let buttonFontFamily of buttonFontFamilies) {
      // …create a button with that font family
      let button = document.createElement("button");
      button.dataset.fontFamily = buttonFontFamily;
      button.style.fontFamily = buttonFontFamily;
      button.innerHTML = "text";

      // …mark the currentFontFamily selected font family
      if (buttonFontFamily === currentFontFamilySelection) {
        button.classList.add(selectedFontFamily);
      }

      // …and register a listener for when that button is clicked
      button.addEventListener("click", handleButtonClick);
      fontFamilySegment.appendChild(button);
    }
  });
}

// Initialize the segment by constructing the color options
constructOptions(presetButtonFontFamilies);