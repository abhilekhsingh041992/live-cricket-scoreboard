

/* Util functions */
function getDataFromUrl(url, callback, errorCallback) {
  var x = new XMLHttpRequest();
  x.open('GET', url);
  x.onload = function() {
    var response = x.responseXML;
    callback(response);
  };
  x.onerror = function() {
    errorCallback('Network error.');
  };
  x.send();
}

function convertXmlToText(xml) {
	return new XMLSerializer().serializeToString(xml.documentElement);
}




/*
	**************************************

	Other api's:
		http://cricscore-api.appspot.com/ -- only live scores

		http://synd.cricbuzz.com/j2me/1.0/sch_calender.xml -- contains everything
		http://synd.cricbuzz.com/score-gadget/gadget-scores-feed.xml

	Starsport's api:
		http://www.starsports.com/syndicationdata/livematches/livematches.json?callback=JsonData&_=1454047994818


	**************************************
*/
var liveScoreUrl = "http://synd.cricbuzz.com/j2me/1.0/livematches.xml";
var matchDetailsLink = "http://www.cricbuzz.com/live-cricket-scores/"

/*
	<match id="1" type="T20" srs="India tour of Australia, 2016" mchDesc="AUS vs IND" mnum="1st T20I" vcity="Adelaide" vcountry="Australia" grnd="Adelaide Oval" inngCnt="1" datapath="http://synd.cricbuzz.com/j2me/1.0/match/2016/2016_AUS_IND/AUS_IND_JAN26/">
	 <state mchState="inprogress" status="Aus elect to field" TW="Aus" decisn="Fielding" addnStatus="" splStatus="">
	</state>
	<Tm id="4" Name="Aus" sName="AUS" flag="1"/>
	<Tm id="2" Name="Ind" sName="IND" flag="1"/>
	
	<Tme Dt="Jan 26 2016" stTme="08:38" enddt="Jan 26 2016"/>		

	<mscr>
		<inngsdetail noofovers="50" rrr="0" crr="8.48" cprtshp="0(0)"/>
	<btTm id="2" sName="IND">
			<Inngs desc="Inns" r="41" Decl="0" FollowOn="0" ovrs="4.5" wkts="2"/>
	</btTm>
	<blgTm id="4" sName="AUS">
	</blgTm>

	</mscr>
	</match>
*/

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

function addMatch(id, description, state, status, type, firstTeamScore, secondTeamScore) {
	var rows = document.getElementById(liveScoresTableId);
	if((state == "complete") || (state == "Result")) {
		rows = document.getElementById(resultsTableId);
	} 

	var firstLine = description + " - " + type + " Match ";
	var secondLine = status;
	var thirdLine = "";
	if(firstTeamScore != "") {
		thirdLine = firstTeamScore + " vs " + secondTeamScore;
	}

	var node = document.createElement("div");

	var firstSpan = document.createElement("span");
	firstSpan.classList.add('match-detail');
	firstSpan.innerHTML = firstLine;

	var secondSpan = document.createElement("span");
	secondSpan.classList.add('match-status'); 
	secondSpan.innerHTML = secondLine;

	var thirdSpan = document.createElement("span");
	thirdSpan.classList.add('match-score'); 
	thirdSpan.innerHTML = thirdLine;

	var detailLink = document.createElement("a");
	detailLink.setAttribute("href", matchDetailsLink + id);
	detailLink.setAttribute("target", "_blank");
	detailLink.innerHTML = "view details";
	detailLink.classList.add('detail-link');

	if(id > 15000) {
		node.appendChild(detailLink);
	}
	

	node.appendChild(firstSpan);
	node.appendChild(secondSpan);
	node.appendChild(thirdSpan);
	
	node.classList.add('match-description');

    rows.appendChild(node);
}


function getScore(btTm) {
	var inngs = btTm.getElementsByTagName("Inngs");
	if (typeof inngs != "undefined") {
		var score = btTm.getAttribute("sName") + "  ";

		var cnt = 0;
		for(i in inngs) {
			var inng = inngs[i];
			if(!(inng instanceof Node)) continue;

			if(cnt > 0) {
				console.log(cnt);
				score += "<br />   ";
			}

			score += inng.getAttribute("r") + "/" + inng.getAttribute("wkts");
			score += "  (" + inng.getAttribute("ovrs") + " ov) ";
			
			cnt+=1;
		}
		
		return score;
	}
} 

function getMatches(xmlDoc) {
	var matches = xmlDoc.getElementsByTagName("match");
	for(var i in matches) {
		var match = matches[i];
		if(!(match instanceof Node)) continue;

		var matchType = match.getAttribute("type");
		var matchDesc = match.getAttribute("mchDesc");

		var matchState = match.getElementsByTagName("state")[0].getAttribute("mchState");
		var matchStatus = match.getElementsByTagName("state")[0].getAttribute("status");
		var mscr = match.getElementsByTagName("mscr")[0];
		var firstTeamScore = "";
		var secondTeamScore = "";

		if (typeof mscr != "undefined") {
			var btTm = mscr.getElementsByTagName("btTm")[0];
			firstTeamScore = getScore(btTm);
			
			var blgTm = mscr.getElementsByTagName("blgTm")[0];
			secondTeamScore = getScore(blgTm);
		}

		addMatch(match.id, matchDesc, matchState, matchStatus, matchType, firstTeamScore, secondTeamScore);
	}
}


function setScore(url) {
	getDataFromUrl(url, function(xmlDoc) {
		getMatches(xmlDoc);
	}, function(errorMessage) {
      renderStatus('Some network issue.' + errorMessage);
    });
}


var liveScoresTableId = "live-score-status-table";
var resultsTableId = "results-status-table";

setScore(liveScoreUrl);








