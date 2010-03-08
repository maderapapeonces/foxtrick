/**
 * ratingstoclipboard.js
 * Copies matchratings to the clipboard (table style)
 * @author spambot
 */

var FoxtrickCopyRatingsToClipboard = {

    MODULE_NAME : "CopyRatingsToClipboard",
	MODULE_CATEGORY : Foxtrick.moduleCategories.MATCHES,
	PAGES : new Array('match'), 
	DEFAULT_ENABLED : true,
	NEW_AFTER_VERSION : "0.5.1.1",	
	LATEST_CHANGE : "Copy links moved to rating table.",
	LATEST_CHANGE_CATEGORY : Foxtrick.latestChangeCategories.FIX,

	init : function() {
    },
    
	run : function( page, doc ) {
		try {
			var isprematch = (doc.getElementById("ctl00_CPMain_pnlPreMatch")!=null);
			if (isprematch) return;

			var table = Foxtrick.Matches._getRatingsTable(doc);
			if (!table) {
				return;
			}

			var tableHeader = table.parentNode.getElementsByClassName("tblBox")[0];
			var homeHeader = table.getElementsByTagName("th")[1];
			var awayHeader = table.getElementsByTagName("th")[2];

			var copyBoth = doc.createElement("span");
			copyBoth.className = "ft_copy_rating";
			copyBoth.appendChild(doc.createTextNode(Foxtrickl10n.getString("Copy")));
			copyBoth.title = Foxtrickl10n.getString("foxtrick.tweaks.copyratings");
			copyBoth.setAttribute("team1", "true");
			copyBoth.setAttribute("team2", "true");
			copyBoth.addEventListener("click", this.createRatings, false);
			tableHeader.appendChild(copyBoth);

			var copyHome = doc.createElement("span");
			copyHome.className = "ft_copy_rating";
			copyHome.appendChild(doc.createTextNode("(" + Foxtrickl10n.getString("Copy") + ")"));
			copyHome.title = Foxtrickl10n.getString("foxtrick.tweaks.copyratings.home");
			copyHome.setAttribute("team1", "true");
			copyHome.setAttribute("team2", "false");
			copyHome.addEventListener("click", this.createRatings, false);
			homeHeader.appendChild(copyHome);

			var copyAway = doc.createElement("span");
			copyAway.className = "ft_copy_rating";
			copyAway.appendChild(doc.createTextNode("(" + Foxtrickl10n.getString("Copy") + ")"));
			copyAway.title = Foxtrickl10n.getString("foxtrick.tweaks.copyratings.away");
			copyAway.setAttribute("team1", "true");
			copyAway.setAttribute("team2", "false");
			copyAway.addEventListener("click", this.createRatings, false);
			awayHeader.appendChild(copyAway);
		}
		catch (e) {
			Foxtrick.dumpError(e);
		}
	},
	
	change : function( page, doc ) {
	},
	
	createRatings : function( ev ) {
	try {
		var team1=ev.target.parentNode.getAttribute('team1')=='true';
		var team2=ev.target.parentNode.getAttribute('team2')=='true';
		
        var _d = Foxtrickl10n.getString("foxtrick.matchdetail.defence" );
        var _m = Foxtrickl10n.getString("foxtrick.matchdetail.midfield" );
        var _a = Foxtrickl10n.getString("foxtrick.matchdetail.attack" );
        
		var doc = ev.target.ownerDocument;
        
        var headder = doc.getElementsByTagName('h1')[0].innerHTML;  
        headder=Foxtrick.trim(headder);
        var start = Foxtrick.strrpos(headder, '<span>(') +7;
        var end = Foxtrick.strrpos(headder, ')</span>');
        
        var matchlink=doc.getElementById('mainWrapper').getElementsByTagName('h2')[0].getElementsByTagName('a')[0];
		var gameid = FoxtrickHelper.getMatchIdFromUrl(matchlink.href);// headder.substr(start, end-start);
        
        start = Foxtrick.strrpos(headder, ' - ');
        var gameresult_h = Foxtrick.trim(headder.substr(start-2, 2));
        var gameresult_a = Foxtrick.trim(headder.substr(start+3, 2));            
        
        
        var ad = '\n[table]\n';
        var table = doc.getElementById('mainBody').getElementsByTagName('h2')[0].parentNode.getElementsByTagName('table')[0].cloneNode(true);
		for (var row=0; row<table.rows.length; ++row) {
				if(!team1 && table.rows[row].cells.length>=2) table.rows[row].cells[1].innerHTML='###';
				if(!team2 && table.rows[row].cells.length>=3) table.rows[row].cells[2].innerHTML='###';
		}
		
        var youth = '';
        //if (Foxtrick.strrpos(table.rows[0].cells[1].innerHTML, 'isYouth=True')) youth = 'youth';
        if (matchlink.href.search('isYouth=True')!=-1) youth = 'youth';
        
        for (var row = 0; row < table.rows.length; row ++) {
            if (row != table.rows.length-3 )  {
                try {
                    // if ( table.rows[row].cells[1] && table.rows[row].cells[1].innerHTML.indexOf( '' ) != -1 ) {} else {
                    //no hatstats detailes and no pic/mots/normal, i hope :)
                    ad += '[tr]\n\n[th]';
                    if ((table.rows[row].cells[0]) && row == 0) {ad += '['+  youth + 'matchid=' + gameid + ']';}
                      else 
                        if (table.rows[row].cells[0]) {ad += table.rows[row].cells[0].textContent;}
                    if (row == 0) ad += '[/th]\n[th]'; else ad += '[/th]\n[td]';
                    if (table.rows[row].cells[1]) {
                        if (row == 0) {
							var teamlink = table.rows[row].cells[1].getElementsByTagName('a')[0];
							if (teamlink)
								ad += teamlink.innerHTML + ((team2==true)?(' - ' + gameresult_h):'') + '[br]['+youth+'teamid='+FoxtrickHelper.getTeamIdFromUrl(teamlink.href)+']';
                        } else {
                            ad += table.rows[row].cells[1].textContent.replace(_d, '[br]'+_d).replace(_m, '[br]'+_m).replace(_a, '[br]'+_a);
                        }
                    }
                    if (row == 0) ad += '[/th]\n[th]'; else ad += '[/td]\n[td]';
                    if (table.rows[row].cells[2]) {
                        if (row == 0) {
                        	var teamlink = table.rows[row].cells[2].getElementsByTagName('a')[0];
                            if (teamlink)
								ad += teamlink.innerHTML + ((team1==true)?(' - ' + gameresult_a):'') + '[br]['+youth+'teamid='+FoxtrickHelper.getTeamIdFromUrl(teamlink.href)+']';
                        } else {
                            ad += table.rows[row].cells[2].textContent.replace(_d, '[br]'+_d).replace(_m, '[br]'+_m).replace(_a, '[br]'+_a);
                        }
                    }

                    if (row == 0) ad += '[/th]\n\n[/tr]\n'; else ad += '[/td]\n\n[/tr]\n';
                    // }
					
				} catch (e) {}
            }
        }
		ad = ad.replace(/\[td\]###\[\/td\]/gi,'');
        ad += '\n[/table]\n';
        
        if(!(team1 && team2)) {
            var ad_s = ad.split('[/tr]');
            for (var i = 0; i < ad_s.length; i++){
                if (i == 10) ad_s[i] = '[tr]';
                ad_s[i] = ad_s[i].replace(/\[th\]\[\/th\]/gi,'');
                ad_s[i] = ad_s[i].replace(/\[td\]\[\/td\]/gi,'');
            }
            ad = ad_s.join('[/tr]').replace(/\[tr\]\[\/tr\]/,'');
        }    
	} catch(e) {Foxtrick.dump('ratingscopied error: '+e+'\n');}
		try {

			if (FoxtrickPrefs.getBool( "copyfeedback" )) 
				Foxtrick.alert(Foxtrickl10n.getString("foxtrick.tweaks.ratingscopied"));
			Foxtrick.copyStringToClipboard(ad);
			
		} catch (e) {
			Foxtrick.alert('ratingscopied '+e);
		}
        
	}
};
