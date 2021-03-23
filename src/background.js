let color = '#3aa757';
let fontFamily = "courier new, monospace";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color });
  console.log('Default background color set to %cgreen', `color: ${color}`);
  console.log('Default font set to %cfont', `font: ${font}`);
});