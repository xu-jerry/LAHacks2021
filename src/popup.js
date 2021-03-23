// Initialize button with user's preferred color
let changeColor = document.getElementById("changeColor");
let changeBack = document.getElementById("changeBack");
let remove = document.getElementById("remove");

chrome.storage.sync.get("color", ({ color }) => {
    changeColor.style.backgroundColor = color;
});

// get previous colors
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

// remove CSS
remove.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: resetCSS,
    });
});


// The body of this function will be executed as a content script inside the
// current page
function setPageBackgroundColor() {
    chrome.storage.sync.get("color", ({ color }) => {
    document.body.style.backgroundColor = color;
    });
}


/*
function setPageBackgroundColor() {
    chrome.storage.sync.get("prevColor", ({ prevColor }) => {
        document.body.style.backgroundColor = prevColor;
        });
}
*/

function resetCSS() {
    document.querySelectorAll('style,link[rel="stylesheet"]').forEach(item => item.remove());
}

function setPageBackgroundColorBack() {
    chrome.storage.sync.get("prevColor", ({ prevColor }) => {
    document.body.style.backgroundColor = prevColor;
    });
}

function getPageBackgroundColor() {
    let prevColor = document.body.style.backgroundColor;
    /*
    if (!prevColor) {
        prevColor = '#FFFFFF';
    }
    */
    chrome.storage.sync.set({ prevColor });
    console.log(prevColor);
}