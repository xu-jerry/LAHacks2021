// Initialize button with user's preferred color
let changeColor = document.getElementById("changeColor");
let changeBack = document.getElementById("changeBack");

chrome.storage.sync.get("color", ({ color }) => {
    changeColor.style.backgroundColor = color;
});

window.onload = async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getPageBackgroundColor,
    });
}

// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setPageBackgroundColor,
    });
});

// change color back when second button is pressed
changeBack.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setPageBackgroundColorBack,
    });
});


// The body of this function will be executed as a content script inside the
// current page
function setPageBackgroundColor() {
    chrome.storage.sync.get("color", ({ color }) => {
    document.body.style.backgroundColor = color;
    });
}

function setPageBackgroundColorBack() {
    chrome.storage.sync.get("prevColor", ({ prevColor }) => {
    document.body.style.backgroundColor = prevColor;
    });
}

function getPageBackgroundColor() {
    let prevColor = document.body.style.backgroundColor;
    chrome.storage.sync.set({ prevColor });
    console.log(prevColor);
}