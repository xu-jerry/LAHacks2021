let color = '#3aa757';
let fontFamily = "courier new";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  chrome.storage.sync.set({fontFamily});
  console.log('Default background color set to %cgreen', `color: ${color}`);
  console.log('Default font set to %s', `fontFamily: ${fontFamily}`);
});