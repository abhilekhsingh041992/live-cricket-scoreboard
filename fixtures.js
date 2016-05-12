

var fixturesUrl = "http://synd.cricbuzz.com/j2me/1.0/sch_calender.xml";


function addScheduleMatch(description, status, time) {
	var rows = document.getElementById(fixturesTableId);
	
	var node = document.createElement("div");

	var firstSpan = document.createElement("span");
	firstSpan.classList.add('match-detail');
	firstSpan.innerHTML = description;

	var secondSpan = document.createElement("span");
	secondSpan.classList.add('match-status'); 
	secondSpan.innerHTML = status;

	var thirdSpan = document.createElement("span");
	thirdSpan.classList.add('match-time'); 
	thirdSpan.innerHTML = time;

	node.appendChild(firstSpan);
	node.appendChild(secondSpan);
	node.appendChild(thirdSpan);
	
	node.classList.add('schedule-match-description');

    rows.appendChild(node);
}

function getFixtures(xmlDoc) {
	var matches = xmlDoc.getElementsByTagName("mch");
	for(var i in matches) {
		var match = matches[i];
		if(!(match instanceof Node)) continue;

		var matchDesc = match.getAttribute("desc");
		var matchStatus = match.getAttribute("vnu");
		var matchTime = match.getAttribute("tm") + " " + match.getAttribute("ddt") 
						+ match.getAttribute("mnth_yr");

		addScheduleMatch(matchDesc, matchStatus, matchTime);
	}
}


function setFixtures(url) {
	getDataFromUrl(url, function(xmlDoc) {
		getFixtures(xmlDoc);
	}, function(errorMessage) {
      renderStatus('Some network issue.' + errorMessage);
    });
}


var fixturesTableId = "fixtures-status-table";

setFixtures(fixturesUrl);


