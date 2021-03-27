// Initialize button with user's preferred color
let changeColor = document.getElementById("changeColor");
let remove = document.getElementById("remove");
let darken = document.getElementById("darken");

chrome.storage.sync.get("color", ({ color }) => {
    changeColor.style.backgroundColor = color;
});

// get previous colors and font families
window.onload = async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: setup,
    });
}

// When the button is clicked, refresh page with script active

changeColor.addEventListener("mouseup", async () => {
    // adjust this later
    let diff = changeColor.value;
    chrome.storage.sync.set({ diff });


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

darken.addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.storage.sync.get("darkenActive", ({ darkenActive }) => {
        if (!darkenActive) {
            darken.style.backgroundColor = 'gray';
        }
        else {
            darken.style.backgroundColor = 'lightgray';
        }
    });

    chrome.scripting. executeScript({
        target: {tabId: tab.id },
        function: switchDarkenActive,
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
  ////////////////////////
  // font stuff
  ////////////////////////
  chrome.storage.sync.get("active", ({ active }) => {
        // different cases for whether we want script to be active
        if (active) {
            chrome.storage.sync.get("fontFamily", ({ fontFamily }) => {
                document.body.style.fontFamily = fontFamily;
            });
        }
        else {
            chrome.storage.sync.get("prevFontFamily", ({ prevFontFamily }) => {
                document.body.style.fontFamily = prevFontFamily;
            });
        }
  });
  ////////////////////////
  // color stuff
  ////////////////////////
    chrome.storage.sync.get("darkenActive", ({ darkenActive }) => {
        if (darkenActive) {
            chrome.storage.sync.get("diff", ({ diff }) => {
                chrome.storage.sync.get("prevColor", ({ prevColor }) => {
                    var elems = document.body.getElementsByTagName("div");
                    Array.prototype.forEach.call(elems, function (elem) {
                        let backgroundColor = elem.style.backgroundColor;
                        if (backgroundColor === undefined || backgroundColor === "") {
                            backgroundColor = "#FFFFFF";
                        }
                        if (elem.style.prevColor === undefined) {
                            elem.style.prevColor = backgroundColor;
                        }
                        console.log("prev background color: " + elem.style.prevColor);
                        elem.style.backgroundColor = RGBToHex(hexToRGB(elem.style.prevColor), diff);
                        console.log("background color: " + elem.style.prevColor);
                    });
                    newColor = RGBToHex(hexToRGB(prevColor), diff);
                    document.body.style.backgroundColor = newColor;
                    document.body.style.color = invertHex(newColor);
                });
            });
        }
        else {
            darken.disabled = true;
            chrome.storage.sync.get("prevColor", ({ prevColor }) => {
                document.body.style.backgroundColor = prevColor;
            });
            console.log(prevColor);
        }
    });

    // helper functions for color manipulation
    function RGBToHex(rgb, diff) {
        // Choose correct separator
        let sep = rgb.indexOf(",") > -1 ? "," : " ";
        // Turn "rgb(r,g,b)" into [r,g,b]
        rgb = rgb.substr(4).split(")")[0].split(sep);

        let r = (+rgb[0]).toString(16),
        g = (+rgb[1]).toString(16),
        b = (+rgb[2]).toString(16);

        // changing colors, making sure colors are in bounds
        rgb[0] = Math.max(0, rgb[0] - diff);
        rgb[1] = Math.max(0, rgb[1] - diff);
        rgb[2] = Math.max(0, rgb[2] - diff);

        rgb[0] = Math.min(255, rgb[0]);
        rgb[1] = Math.min(255, rgb[1]);
        rgb[2] = Math.min(255, rgb[2]);


        r = (+rgb[0]).toString(16),
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
        // not hex form
        else {
            return h;
        }

        return "rgb("+ +r + "," + +g + "," + +b + ")";
    }
    // invert the hex color
    function invertHex(h){
        let r = 0, g = 0, b = 0;

        // 3 digits
        if (h.length == 4) {
          r = 17*parseInt(h[1],16);
          g = 17*parseInt(h[2],16);
          b = 17*parseInt(h[3],16);
      
        // 6 digits
        } else if (h.length == 7) {
          r = 16*parseInt(h[1],16) + parseInt(h[2],16);
          g = 16*parseInt(h[3],16) + parseInt(h[4],16);
          b = 16*parseInt(h[5],16) + parseInt(h[6],16);
        }
        // not hex form
        else {
            return h;
        }
        // invert
        r = (255-r).toString(16);
        g = (255-g).toString(16);
        b = (255-b).toString(16);
        //convert back to hex form
        return "#" + r + g + b;
    }
}


// The body of this function will be executed as a content script inside the
// current page
function setPageBackgroundColor() {
    chrome.storage.sync.get("color", ({ color }) => {
    document.body.style.backgroundColor = color;
    });
}

function setPageTextColor() {
    chrome.storage.sync.get("color", ({ color }) => {
    document.body.style.color = color;
    });
}

function setPageFontFamily() {
    chrome.storage.sync.get("fontFamily", ({ fontFamily }) => {
        document.body.style.fontFamily = fontFamily;
        console.log(fontFamily);
    });
}


function switchDarkenActive() {
    chrome.storage.sync.get("darkenActive", ({ darkenActive }) => {
        darkenActive = !darkenActive;
        chrome.storage.sync.set({ darkenActive });
    });
}

/* this one is not good because it uses prevcolor. use other setPageBackgroundColor function above

function setPageBackgroundColor() {
    chrome.storage.sync.get("prevColor", ({ prevColor }) => {
        document.body.style.backgroundColor = prevColor;
        });

}
*/

function resetCSS() {
    // reset CSS
    document.querySelectorAll('style,link[rel="stylesheet"]').forEach(item => item.remove());

    // insert new CSS
    /*
    var cssId = 'myCss';  // you could encode the css path itself to generate id..
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://www.w3schools.com/w3css/4/w3.css';
    link.media = 'all';
    head.appendChild(link);
    */
}


function setup() {
    let prevFontFamily = document.body.style.fontFamily;
    chrome.storage.sync.set({ prevFontFamily });

    // need to somehow fix this being run more than once
    /*
    chrome.storage.local.get("prevColor", () => {
        if (!(chrome.runtime.lastError))
        {
            console.log("break");
            console.log(chrome.runtime.lastError);
            //console.log(prevColor);
            return;
        }

        let prevColor = document.body.style.backgroundColor;
        console.log(prevColor);
    
        // if no prevColor, assume white
        if (prevColor === undefined || prevColor === "") {
            prevColor = "#FFFFFF";
        }
    
        console.log(prevColor);
        chrome.storage.sync.set({ prevColor });
    
        let diff = 0;
        chrome.storage.sync.set({ diff });
        let setup = true;
        chrome.storage.sync.set({ setup });
    });
    */
    let prevColor = document.body.style.backgroundColor;

    // if no prevColor, assume white
    if (prevColor === undefined || prevColor === "") {
        prevColor = "#FFFFFF";
    }

    chrome.storage.sync.set({ prevColor });

    let prevTextColor = document.body.style.color;
    // if no prevTextColor, assume black
    if (prevTextColor === undefined || prevTextColor === "") {
        prevTextColor = "#000000"
    }

    chrome.storage.sync.set({ prevTextColor });

    let diff = 0;
    chrome.storage.sync.set({ diff });
    let setup = true;
    chrome.storage.sync.set({ setup });
    let darkenActive = false;
    chrome.storage.sync.set({ darkenActive });
}