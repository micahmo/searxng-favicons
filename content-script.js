// Get local storage with (on service worker inspect page)
//  chrome.storage.local.get(console.log)
// Clear local storage with
//  chrome.storage.local.clear(console.log)

async function update() {
    while (true) {
        realUpdate();
        await new Promise(r => setTimeout(r, 2000));
    }
}

function realUpdate() {
    console.log("SearXNG Favicons: Fetching");
    document.querySelectorAll('*').forEach(function(element) {
        if (element.classList.contains("url_wrapper") && !element.innerHTML.toString().includes("favicons")) {
            chrome.storage.local.get(element.toString(), function(result) {
                if (result[element]) {
                    console.log("SearXNG: Found cached favicon for " + element);
                    element.innerHTML = '<img src="' + result[element] + '&sz=20" style="margin-right: 10px;">' + element.innerHTML;
                }
                else {
                    console.log("SearXNG: Loading favicon for " + element);
                    element.innerHTML = '<img src="https://www.google.com/s2/favicons?domain=' + element + '&sz=20" style="margin-right: 10px;">' + element.innerHTML;
                    chrome.storage.local.set({[element.toString()]: 'https://www.google.com/s2/favicons?domain=' + element}, function() {
                        console.log("Saved real name for " + element + " in local storage: " + 'https://www.google.com/s2/favicons?domain=' + element);
                    });
                }
            });
        }
        
       
    });
}

chrome.runtime.onMessage.addListener(function (message, sender, response) {
    if (message.action == "update") {
        realUpdate();
    }
});

update();
