document.getElementById('start').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const interval = parseInt(document.getElementById('interval').value, 10);
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: async (interval) => {
      console.debug('sending start message from content script to service worker');
      const response = await chrome.runtime.sendMessage({ start: true, interval: interval * 1000 });
      console.debug('response from service worker', response);
    },
    args: [interval]
  });
  window.close();
});

document.getElementById('stop').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: async () => {
      console.debug('sending stop message from content script to service worker');
      const response = await chrome.runtime.sendMessage({ stop: true });
      console.debug('response from service worker', response);
    }
  });
  window.close();
});
