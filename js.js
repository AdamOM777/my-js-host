'use strict';

var ifr;

function getStatus(ok) {
	console.info("getStatus");
	console.log("Letar kakor!!");
	console.error("-? kaka uid_vf");
	console.error("-? kaka epost");
	console.error("-? kaka uid_temp");
	console.error("-? kaka order");
	const xhr = new XMLHttpRequest ();
	
	function reqListener() {
		  let X;
	     try {
				X = JSON.parse(xhr.responseText);
			} catch(e) {

				alert("5: " + xhr.responseText);
				console.log("5: " + xhr.responseText);
				return;
			}
		
		ok(X);
	}
	
	const fd = new FormData();
	fd.append("rutin", "getStatus");
	xhr.addEventListener("load", reqListener);
	xhr.open('POST', '/order/post.php', true);
	//xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
	xhr.send(fd);
}

//function add_saasCont_and_iframe(what, t, uid) {
function add_saasCont_and_iframe() {
	console.log("Addar rot-divven saasOrderContainer.");

	var sty = 
		"display:none; width:100%;	height:100%;top:0; right:0; left:0;" +
		"position:fixed; z-index: 30;	background-color: rgba(10,10,10,.2);" +
		"font-size: calc(0.7rem + 0.5vw)";
	
	const cnt = document.createElement("div");
	cnt.setAttribute("id","saasOrderContainer");
	cnt.setAttribute("style", sty);
	document.body.appendChild(cnt);
	
	sty = "max-width: 600px;" +
	"position: absolute;" +
	"top: 50%;" +
	"left: 50%;" +
	"-webkit-transform: translate(-50%,-50%);" +
	"-ms-transform: translate(-50%,-50%);" +
	"transform: translate(-50%,-50%);" +
	"background-color: #fff;" +
	"margin: 0 auto;" +
	"overflow: auto;" +
	"height: 97%;" +
	"width: 95%;" +
	"box-shadow: 0 0 14px rgba(0,0,0,.24),0 14px 28px rgba(0,0,0,.38);" +
	"border-radius: 2px;" +
	"cursor: default;";
	
	ifr = document.createElement("iframe");
			
	ifr.onload = function() { 
		
		console.info("iFrame.onload - Nyss addad saasOrderContainer har fÃ¥tt en iframe som laddat index som kÃ¶rt IIFE i form.js");
		console.log("(ELLER, den nyss reloadade documenten i iframen)");
		// KÃ¶rs vid fÃ¶rsta anrop OCH efter stÃ¤ng/Ã–ppna pÃ¥ nytt
		//console.clear();

		function back(X) {
			//console.clear();
			console.dir(X);
			
			
			console.error("Vi har fÃ¥tt ett resultat av POST > getStatus ovan");
			
			if(X.error) console.error(X.error);
			
			if(X.order_old) {
				alert("Ordern fanns inte eller Ã¤r arkiverad. Logga in fÃ¶r att se dessa..");
			}
			
			//if(X.uid_temp) {
			if(X.orderNr) { // Vi har fÃ¥tt en tom order om saknas. 
				//Antagligen pga av cookie men ordern har nu en annan status
				// Om det var en temp sÃ¥ har POST raderat denna cookie nu
				//console.error("Vi har fÃ¥tt en komplett temp_order!");
			
				ifr.contentWindow.ifr_load_form(false, false, X);
				return;
			}
			
			if(X.aktiva && X.aktiva>1) {
				console.error("X.aktiva: Finns " + X.aktiva + " ordrar");
				console.dir(X.orders);
				//return;
			}
			
			if(X.orders && X.orders.length>0) {

				console.log("Kaka fanns, vi Ã¤r tillbaks fr saas");
				console.log("Vi har hÃ¤mtat user_data som nu sparas i SS");
				console.log("Finns det aktiva ordrar sÃ¥ ska vi fram med en pop nu med ordrarna");
				console.log("Fanns bara en sÃ¥ auto-poppar vi den");
				
				console.error("Finns en el fler ordrar!", X.orders);

				//window.sessionStorage.setItem("currOrders", JSON.stringify(X.orders));
				
				console.log("Nu fÃ¥r ifr_load_form i form.js ta Ã¶ver. Vi skickar med what, t, uid");
				ifr.contentWindow.ifr_load_form(false, false, X.orders[0].uid);
				return;
			}
			//console.clear();
			if(X.nokaka) console.error("Kaka saknas, vi gick inte till saas. Vi drar oss tillbaks o lÃ¥ter hemsidan visas ostÃ¶rt.");
			//console.error("God morgon! Nu ska kalmarsodra@mekonomenbilverkstad.se gÃ¶ra en mail/passw login");
		}
		
		//console.clear();
		console.error("PF eller nytt besÃ¶k (ovanligt vid fÃ¶rfs.) eller nyreggad fÃ¶rf ");
		console.log("Kanske postnord Ã¶ppnar sidan efter ett par mÃ¥nader sen fÃ¶rra ordern");
		console.error("Vi lÃ¥ter post.php kika efter secure-kakor - func:getStatus");
		
		// Leta kakor
		getStatus(function(X){			
			back(X);
		});

		
	}; // END ifr.onload 

	ifr.setAttribute("src","/order/index.php");
	ifr.setAttribute("style", sty);

	// HÃ¤r bÃ¶rjar det hÃ¤nda grejjer...
	console.log("Rot-divven fÃ¥r en iframe som laddar order/index.php")
	cnt.appendChild(ifr);

}

//function load_form(what, t, uid) { // Denna Ã¤r den enda func som Ã¤r global (kan kÃ¶ras fr hemsida)
function load_form(what, t) { // Denna Ã¤r den enda func som Ã¤r global (kan kÃ¶ras fr hemsida)	
	console.clear();
	
	console.error("load_form utanfÃ¶r iframe kÃ¶rs med what/t:",what,t);
			
	if(t.id == "demobutton2") {
		console.error("FristÃ¥ende men genom hemsidesknapp");
		console.log("Ett sep tillÃ¤ggsskript skript som hanterar detta bara fÃ¶r A6?");
		return;
	}
	
	// Leta kakor!!
	getStatus(function(X){ console.error(" Denna kÃ¶r vi enbart om SS currOrders saknas?! Och/eller titta pÃ¥ Ã¥lder pÃ¥ statusen?");
		
		console.dir(X);
		
		if(X.error) alert(X.error);
		
		if(X.orders && X.orders.length>0) {
			console.log("Det finns en eller flera ordrar");
			console.dir(X.orders);
			if(X.orders[0]) {
				//ifr.contentWindow.ifr_load_form(false, t, X.orders[0].uid);
				ifr.contentWindow.ifr_load_form(what, t, X.orders[0].uid);
				return;
			}
		}
		
		
		if(X.orderNr) {
			ifr.contentWindow.ifr_load_form(false, false, X);
			return;
		}
		
		// Om en knapp pÃ¥ hems klickat OCH det redn finns aktiva orders
		if(window.sessionStorage.getItem("currOrders")) {
			//alert("SkrÃ¤p?");
			//const O = JSON.parse(window.localStorage.getItem("currOrders"));
			const O = JSON.parse(window.sessionStorage.getItem("currOrders"));
			console.dir(O);
			if(O[0]) {
				//ifr.contentWindow.ifr_load_form(false, t, O[0].uid);
				//return;
			}
		}
		
		console.error("Ingen order-kaka & ingen uid_temp-kaka");
		ifr.contentWindow.ifr_load_form(what);
		
	});
	
	/*
		
	if(window.localStorage.getItem("currOrder")) {
		ifr.contentWindow.ifr_load_form(false, t, window.localStorage.getItem("currOrder"));
		return;
	}
	
	// Bort med denna tror jag
	if(document.cookie.indexOf('order=')>-1) {

		console.error("Det finns en order-cookie!");

		var match = document.cookie.match(new RegExp('(^| )order=([^;]+)'));
		
		ifr.contentWindow.ifr_load_form(what, t, match[2]); 
		return;
	
	}
	 */
}

	
! async function foo(t, e) {
	console.info("foo");
	console.log("IIFE i order/js.js som laddas fÃ¶re </body> (hemsides-add-skript)");
	var widget = document.getElementById("demobutton2");
	
	if(widget) {
		console.error("Widget finns")
		widget.style.display = "none";
		
		widget.innerText = "LOG IN";
		//if(window.localStorage.getItem("savedUser") && !window.localStorage.getItem("uid_temp")) {
		if(window.localStorage.getItem("savedUser")) {
			var V = JSON.parse(window.localStorage.getItem("savedUser"));
			widget.innerText = V.f_name;
			widget.style.display = null;
		}
		
		// LATERS...
		//console.log("Denna hemsida har user-widgeten. Den ska visa om kunden Ã¤r inlogga pÃ¥ riktikg el fake");
		//console.log("fÃ¶r en ny besÃ¶kare sÃ¥ ska den visa? Login? Meny?");
		//console.log("Ska 'Kontakta oss/Hitta din nyckel knappar andas info om att det finns en aktu order?' ");
		
	}

	add_saasCont_and_iframe();
		
}(window, (function() {
   return function(t) {
      var e = {};
}}))
	
		
//window.load_form = load_form; no need....
	
