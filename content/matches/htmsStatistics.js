/** * htmsStatistics.js * adds some statistics on matches based on HTMS web site info * @author taised */////////////////////////////////////////////////////////////////////////////////Foxtrick.htmsStatistics = {		MODULE_NAME : "htmsStatistics",	MODULE_CATEGORY : Foxtrick.moduleCategories.MATCHES,	PAGES : new Array('match'), 	DEFAULT_ENABLED : true,	init : function() {	},	run : function( page, doc ) { 		try {			var isprematch = (doc.getElementById("ctl00_CPMain_pnlPreMatch")!=null);			if (isprematch) return;						var ratingstable = Foxtrick.Matches._getRatingsTable(doc);			if (ratingstable == null) return; dump('got table\n')			if (Foxtrick.Matches._isWalkOver(ratingstable)) return;			if (!Foxtrick.Matches._isCorrectLanguage(ratingstable)) { // incorrect language				var row = ratingstable.insertRow(8);				var cell = row.insertCell(0);				cell.setAttribute("colspan" , 3);				cell.innerHTML = Foxtrickl10n.getString( "foxtrick.matches.wronglang" );				return;			}			var midfieldLevel=new Array(Foxtrick.Matches._getStatFromCell(ratingstable.rows[1].cells[1]), Foxtrick.Matches._getStatFromCell(ratingstable.rows[1].cells[2]));			midfieldLevel[0]++;			midfieldLevel[1]++;			var rdefence=new Array(Foxtrick.Matches._getStatFromCell(ratingstable.rows[2].cells[1]), Foxtrick.Matches._getStatFromCell(ratingstable.rows[2].cells[2]));			rdefence[0]++;			rdefence[1]++;			var cdefence=new Array(Foxtrick.Matches._getStatFromCell(ratingstable.rows[3].cells[1]), Foxtrick.Matches._getStatFromCell(ratingstable.rows[3].cells[2]));			cdefence[0]++;			cdefence[1]++;			var ldefence=new Array(Foxtrick.Matches._getStatFromCell(ratingstable.rows[4].cells[1]), Foxtrick.Matches._getStatFromCell(ratingstable.rows[4].cells[2]));			ldefence[0]++;			ldefence[1]++;			var rattack=new Array(Foxtrick.Matches._getStatFromCell(ratingstable.rows[5].cells[1]), Foxtrick.Matches._getStatFromCell(ratingstable.rows[5].cells[2]));			rattack[0]++;			rattack[1]++;			var cattack=new Array(Foxtrick.Matches._getStatFromCell(ratingstable.rows[6].cells[1]), Foxtrick.Matches._getStatFromCell(ratingstable.rows[6].cells[2]));			cattack[0]++;			cattack[1]++;			var lattack=new Array(Foxtrick.Matches._getStatFromCell(ratingstable.rows[7].cells[1]), Foxtrick.Matches._getStatFromCell(ratingstable.rows[7].cells[2]));			lattack[0]++;			lattack[1]++;			dump('got rating:'+lattack+'\n');			var tactics;			var tacticsLevel;			if (ratingstable.rows.length > 12) {				tactics=new Array(Foxtrick.Matches._getTacticsFromCell(ratingstable.rows[14].cells[1]), Foxtrick.Matches._getTacticsFromCell(ratingstable.rows[14].cells[2]));				tacticsLevel=new Array(Foxtrick.Matches._getTacticsLevelFromCell(ratingstable.rows[15].cells[1]), Foxtrick.Matches._getTacticsLevelFromCell(ratingstable.rows[15].cells[2]));			}			else  {				tactics=new Array(Foxtrick.Matches._getTacticsFromCell(ratingstable.rows[10].cells[1]), Foxtrick.Matches._getTacticsFromCell(ratingstable.rows[10].cells[2]));				tacticsLevel=new Array(Foxtrick.Matches._getTacticsLevelFromCell(ratingstable.rows[11].cells[1]), Foxtrick.Matches._getTacticsLevelFromCell(ratingstable.rows[11].cells[2]));			}            dump('Tactics:['+ tactics + '], TacticsLevel:[' +tacticsLevel +']'+ '\n');						//Creating params for link			var lang=FoxtrickPrefs.getString("htLanguage");             if (lang!='it') lang='en';			var params='&TAM='+midfieldLevel[0]+'&TBM='+midfieldLevel[1];			params+='&TARD='+rdefence[0]+'&TBRD='+rdefence[1];			params+='&TACD='+cdefence[0]+'&TBCD='+cdefence[1];			params+='&TALD='+ldefence[0]+'&TBLD='+ldefence[1];			params+='&TARA='+rattack[0]+'&TBRA='+rattack[1];			params+='&TACA='+cattack[0]+'&TBCA='+cattack[1];			params+='&TALA='+lattack[0]+'&TBLA='+lattack[1];			if (tactics[0]=='aow') {				params+='&TATAC=AOW';			}			if (tactics[0]=='aim') {				params+='&TATAC=AIM';			}			if (tactics[1]=='aow') {				params+='&TBTAC=AOW';			}			if (tactics[1]=='aim') {				params+='&TBTAC=AOW';			}			Foxtrick.LOG(tactics[0]+' - '+tactics[1]);						//Inserting a blank line			var row = ratingstable.insertRow(ratingstable.rows.length);			var cell = row.insertCell(0);			cell.innerHTML='&nbsp;';						//Inserting header cell			row = ratingstable.insertRow(ratingstable.rows.length);			cell = row.insertCell(0);			cell.className='ch';			cell.innerHTML = Foxtrickl10n.getString( "foxtrick.htmsStatistics.prediction" );						//Inserting cell with bar			cell = row.insertCell(1);			cell.setAttribute("colspan", 2);			cell.setAttribute('align', 'center');			cell.innerHTML = '<a class="inner" target="_stats" href="http://www.fantamondi.it/HTMS/index.php?page=predictor&lang='+lang+params+'"><img src="chrome://foxtrick/content/resources/linkicons/htms.png"></a>';					} catch (e) {			dump('ratings.js run: '+e+"\n");		}	},};