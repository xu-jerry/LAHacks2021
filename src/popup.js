// Initialize button with user's preferred color
let changeColor = document.getElementById("changeColor");
let changeBack = document.getElementById("changeBack");
let remove = document.getElementById("remove");

chrome.storage.sync.get("color", ({ color }) => {
    changeColor.style.backgroundColor = color;
});
changeBack.style.backgroundColor = "red";

// get previous colors and font families
window.onload = async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setup,
    });
}

// When the button is clicked, refresh page with script active
changeColor.addEventListener("click", async () => {
    active = true;
    chrome.storage.sync.set({ active });
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: refreshPage,
    });
});

changeFontFamily.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting. executeScript({
        target: {tabId: tab.id },
        function: setPageFontFamily,
    });
});

// change color and font family back when second button is pressed

changeBack.addEventListener("click", async () => {
    active = false;
    chrome.storage.sync.set({ active });
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: refreshPage,
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

/*

// The body of this function will be executed as a content script inside the
// current page
function setPageBackgroundColor() {
    chrome.storage.sync.get("color", ({ color }) => {
    document.body.style.backgroundColor = color;
    });
}
*/


function refreshPage() {
    chrome.storage.sync.get("active", ({ active }) => {
        // different cases for whether we want script to be active
        if (active) {
            chrome.storage.sync.get("color", ({ color }) => {
                document.body.style.backgroundColor = color;
                });
            chrome.storage.sync.get("fontFamily", ({ fontFamily }) => {
                document.body.style.fontFamily = fontFamily;
            });
        }
        else {
            chrome.storage.sync.get("prevColor", ({ prevColor }) => {
                document.body.style.backgroundColor = prevColor;
                });
            chrome.storage.sync.get("prevFontFamily", ({ prevFontFamily }) => {
                document.body.style.fontFamily = prevFontFamily;
            });
        }
    });
}

function setPageFontFamily() {
    chrome.storage.sync.get("fontFamily", ({ fontFamily }) => {
        document.body.style.fontFamily = fontFamily;
        console.log(fontFamily);
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
    /*
    let cur = document.body.style;
    cur.backgroundColor = 'gray';
    */
    var cssId = 'myCss';  // you could encode the css path itself to generate id..
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://www.w3schools.com/w3css/4/w3.css';
    link.media = 'all';
    head.appendChild(link);
}


function setup() {
  let prevColor = document.body.style.backgroundColor;
  chrome.storage.sync.set({ prevColor });
  let active = false;
  chrome.storage.sync.set({ active });
  let prevFontFamily = document.body.style.fontFamily;
  chrome.storage.sync.set({ prevFontFamily });
}