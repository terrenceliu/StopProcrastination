var blockSites = [],			// Array of block sites urls
	easyMode = false,			
	blockSitesTime = [];		
	
function checkTab(tab) {
	/* 
		if current tab is blocked, then redirect 
	*/
	if(this.isBlocked(tab.url)){
		if(easyMode == false) {
			chrome.tabs.update(tab.id, {
				url: "https://www.google.com"	
			});
		}
		else {
			//activate timer for current tab
			tabTimer(tab);
		}
	}

	
}

function isBlocked(url) {
	/*
		Global Function
		Check if current url is in block site
	*/
	for (var i = 0; i < blockSites.length; i++) {
		//checck if the host of current url is in block site
		console.log("hostname: %s", getHostName(url));
		console.log("blockSite: %s", blockSites[i]);
		if(this.getHostName(url).indexOf(blockSites[i]) != -1) {
			return true;
		}
	}
	return false
}

function getHostName(href){
	/*	
		Global Function
		Get the hostname of a href string (strictly an url);
	*/
	var l = document.createElement('a');
	l.href = href;
	return l.hostname;
}

function tabTimer(tab) {
	/*
		Start timer when active tab is in block site
	*/
}

function main() {
	// initialize global array
	chrome.storage.sync.get({urlList:[]}, function(result){
		blockSites = result.urlList;
	});

	//create context menu
	chrome.contextMenus.create({
	    title: "block this site",
	    contexts: ['page'],
	    id: "blockCurrent",
	});

	// event: tab update
	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, currentTab) {
		//console.log("tab update");
		checkTab(currentTab);
	});

	// event: storage change
	chrome.storage.onChanged.addListener(function(changes, namespace){
		console.log("storage update");
		chrome.storage.sync.get({urlList:[]}, function(result){
			blockSites = result.urlList;
			console.log(blockSites);
		});
	});

	// event: right click
	chrome.contextMenus.onClicked.addListener(function(info, tab){
		if (info.menuItemId == 'blockCurrent'){
			//get current tab url
			var inputURL = tab.url;
			inputURL = getHostName(inputURL);
			//update current url to url list
			chrome.storage.sync.get({urlList: []}, function(result){
				
				if (!result.urlList.includes(inputURL)) {
					//update the url list
					result.urlList.push(inputURL);
					chrome.storage.sync.set({urlList: result.urlList}, function(){});
				}
				
			});
		}
	});
}

main();

