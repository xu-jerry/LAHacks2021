let fontFamily = "courier new";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({fontFamily});
  console.log('Default font set to %s', `fontFamily: ${fontFamily}`);
});