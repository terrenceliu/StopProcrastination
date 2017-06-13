function addURL(url) {
	/*
	Update the url list in storage area when user submits a new url to url list.
	*/

	var inputURL = document.querySelector('.urlIn').value;

	// check url
	if (!isURL(inputURL)) {
		alert('Wrong URL');
	}
	else {
		// parse the host name 
		// inputURL = parseURL(inputURL);
		// store
		chrome.storage.sync.get({urlList: []}, function(result){
			if (!result.urlList.includes(inputURL)) {
				//update the url list
				result.urlList.push(inputURL);
				chrome.storage.sync.set({urlList: result.urlList}, function(){
					//console.log('update urlList complete');
				});
			}
		});
	}

	function isURL(str) {
		var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
			'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
			'((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
			'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
			'(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
			'(\\#[-a-z\\d_]*)?$','i'); // fragment locator
		return pattern.test(str);
	}

	function getHostName(href){
		/*
			Get the hostname of a href string (strictly an url);
		*/
		var l = document.createElement('a');
		l.href = href;
		return l.hostname;
	}
}

function removeURL(index) {
	/*
	Remove the url from url list when user submits an url to delete
	*/

	chrome.storage.sync.get({urlList: [], urlTime: []}, function(result){
		//var deleteURL = result.urlList[index];
		result.urlList.splice(index, 1);
		chrome.storage.sync.set({urlList: result.urlList}, function(){
					console.log('update urlList complete');
		});
	});

}

/*
function setMode() {
	
	// Switch between Easy & Hard Mode
	chrome.storage.sync.get(easyMode: true, function(result){
		chrome.storage.sync.set({easyMode: !(result.easyMode)}, function(){
			consol.log('update mode complete');
		});
	});
}
*/

function setLength() {
	/*
	Set time interval under hard mode
	*/
}

function reset(){
	/*
	reset the storage space
	*/
	chrome.storage.sync.clear(function() {
		console.log('cleared storage!');
	});
	var div = document.getElementById('displayList');
	div.innerHTML = '';
}

function displayList() {
	/*
		Dynamically create a list that contains block sites url and a button
	*/
	var resultList = [];
	var length = 0;
	chrome.storage.sync.get({urlList:[]}, function(result){
		 resultList = result.urlList;
		 //console.log(resultList);
		 length = resultList.length

		//create display
		var div = document.getElementsByClassName('displayList');
		//console.log(div);
		for (var i = 0; i < div.length; i++) {
			div[i].innerHTML = '';
		}
		var tbl = document.createElement('table');
		tbl.setAttribute('class', 'table table-striped');
		var tbd = document.createElement('tbody');

		//console.log(resultList);
		//console.log(length);
		for (var i = 0; i < length; i++) {
			var tr = document.createElement('tr');
			var td_1 = document.createElement('td');
			var td_2 = document.createElement('td');
			td_1.appendChild(document.createTextNode(resultList[i]));
			td_2.appendChild(document.createElement('button'));
			tr.appendChild(td_1);
			tr.appendChild(td_2);
			tbd.appendChild(tr);
		}
		tbl.appendChild(tbd);
		for (var i = 0; i < div.length; i++) {
			div[i].appendChild(tbl);
		}
	});
}

function openTab(buttonId, tabId) {
	//console.log(buttonId, tabId);
	var i, tabcontent, tablink;
	tabcontent = document.getElementsByClassName('tabcontent');
	//console.log(tabcontent);
	for (i=0; i<tabcontent.length; i++) {
		//console.log(tabcontent[i].style.display);
		tabcontent[i].style.display = 'none';
	}
	tablinks = document.getElementsByClassName('tablink');
	for (i = 0; i < tablinks.length; i++) {
		//console.log(tablinks[i].className);
		if(tablinks[i].className.includes('active')) {
			tablinks[i].className = tablinks[i].className.replace(' active', '');
		}
	}
	
	document.getElementById(tabId).style.display = 'block';
	document.getElementById(buttonId).className += ' active';
	//event.currentTarget.className += ' active';
}

function main() {


	document.addEventListener('DOMContentLoaded', function() {
		document.querySelector('.urlSubmit').addEventListener('click',addURL);
		document.querySelector('.clear').addEventListener('click', reset);
		
		// nav bar event listener
		document.querySelector('#tab_home').addEventListener('click', function() {
			openTab('tab_home', 'front_home');
		});
		document.querySelector('#tab_setting').addEventListener('click', function() {
			openTab('tab_setting', 'front_setting');
			displayList();
		});
		document.querySelector('#tab_report').addEventListener('click', function() {
			openTab('tab_report', 'front_report');
		});
		document.querySelector('#tab_about').addEventListener('click', function() {
			openTab('tab_about', 'front_about');
		});
	});

	/*
	document.addEventListener('DOMContentLoaded', function() {
		document.querySelector('.clear').addEventListener('click', reset);
	})
	*/

	chrome.storage.onChanged.addListener(function(changes, namespace){
		displayList();
	})

	displayList();

	
}

main();


