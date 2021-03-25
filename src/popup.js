// Initialize button with user's preferred color
let changeColor = document.getElementById("changeColor");
let remove = document.getElementById("remove");

chrome.storage.sync.get("color", ({ color }) => {
    changeColor.style.backgroundColor = color;
});

// get previous colors
window.onload = async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setup,
    });
}

// When the button is clicked, refresh page with script active
changeColor.addEventListener("click", async () => {
    chrome.storage.sync.get("active", ({active}) => {
        active = !active;
        chrome.storage.sync.set({ active });
    });
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

function refreshPage() {
    chrome.storage.sync.get("active", ({ active }) => {
        // different cases for whether we want script to be active
        if (active) {
            chrome.storage.sync.get("prevColor", ({ prevColor }) => {
                document.body.style.backgroundColor = RGBToHex(hexToRGB(prevColor));
                });
        }
        else {
            chrome.storage.sync.get("prevColor", ({ prevColor }) => {
                document.body.style.backgroundColor = prevColor;
                });
        }
    });

    // helper functions for color manipulation
    function RGBToHex(rgb) {
        // Choose correct separator
        let sep = rgb.indexOf(",") > -1 ? "," : " ";
        // Turn "rgb(r,g,b)" into [r,g,b]
        rgb = rgb.substr(4).split(")")[0].split(sep);
        console.log(rgb[0]);
        console.log(rgb[1]);
        console.log(rgb[2]);

        // changing colors HERE
        let diff = 100;
        rgb[0] = Math.max(0, rgb[0] - diff);
        rgb[1] = Math.max(0, rgb[1] - diff);
        rgb[2] = Math.max(0, rgb[2] - diff);

        let r = (+rgb[0]).toString(16),
            g = (+rgb[1]).toString(16),
            b = (+rgb[2]).toString(16);
        

        if (r.length == 1)
            r = "0" + r;
        if (g.length == 1)
            g = "0" + g;
        if (b.length == 1)
            b = "0" + b;
        
        return "#" + r + g + b;
    }

    function hexToRGB(h) {
        let r = 0, g = 0, b = 0;

        // 3 digits
        if (h.length == 4) {
          r = "0x" + h[1] + h[1];
          g = "0x" + h[2] + h[2];
          b = "0x" + h[3] + h[3];
      
        // 6 digits
        } else if (h.length == 7) {
          r = "0x" + h[1] + h[2];
          g = "0x" + h[3] + h[4];
          b = "0x" + h[5] + h[6];
        }
        return "rgb("+ +r + "," + +g + "," + +b + ")";
    }
}

function resetCSS() {
    // reset CSS
    document.querySelectorAll('style,link[rel="stylesheet"]').forEach(item => item.remove());

    // insert new CSS
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
    chrome.storage.sync.get("setup", (setup)=>{
        if (setup === true) {
            return;
        }
    });
    let prevColor = document.body.style.backgroundColor;
    if (prevColor === undefined || prevColor === "") {
        prevColor = "#FFFFFF";
    }
    chrome.storage.sync.set({ prevColor });
    let active = false;
    chrome.storage.sync.set({ active });
    let setup = true;
    chrome.storage.sync.set({ setup });
}