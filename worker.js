const schedules = new Map();

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (sender?.tab?.id) {
      console.debug('received message from tab', sender.tab.id);
      if (request.start) {
	console.debug('start request', sender.tab.id, request);
	const intervalMs = request.interval ?? 2000;
	const intervalId = setInterval(() => {
	  chrome.tabs.reload(sender.tab.id, () => {
	    console.debug('refreshed tab', sender.tab.id);
	  });
	}, intervalMs);
	schedules.set(sender.tab.id, intervalId);
	sendResponse({ started: sender.tab.id });
      } else if (request.stop) {
	console.debug('stop request', sender.tab.id, request);
	const intervalId = schedules.get(sender.tab.id);
	if (intervalId != null) {
	  schedules.delete(sender.tab.id);
	  clearInterval(intervalId);
	}
	sendResponse({ stopped: sender.tab.id });
      } else {
	console.error('unexpected request', request);
      }
    } else {
      console.error('unexpected message without a tab ID', sender);
    }
  }
);
