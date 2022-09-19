/*
	Application name: S9 Client-side script
	Application URI: http://school9-nt.ru
	Description: school9-nt.ru client-side application
	Version: 6.0.0
	Author: Anton Koroteev
	Author URI: http://school9-nt.ru
*/

///////////////////////////////////////////////////////////////////////////
/////////////////////////////// MAIN SCRIPT ///////////////////////////////
///////////////////////////////////////////////////////////////////////////

//Some globals
var SLIDERTABLES 	= new Object;
var MENUS 	        = new Object;
var LAYERS          = new Object;
var OVERLAY			= null;
var MessageBox		= null;
var S9MSGR 			= null;
var PAGEGALLERY		= null;
var DASHBOARD		= null;
var VIEWPORT = {
		Width 	: getViewport_Dimensions('width'),
		Height 	: getViewport_Dimensions('height')
};
var LOADING_ANIMATION = null;
var BACKURL = null;
var LINKHASH = null;
var ROOT = null;
var LOWRESLAYOUT = false;

//Style colors
var RED 					= '#c11922';
var ORANGE 					= '#ffca55';
var LIGHT_BLUE				= '#2f57d3';
var ROYAL_BLUE 				= '#5c7be0';
var COBALT 					= '#1a5282';
var VIOLET 					= '#8761ea';
var WHITE 					= '#ffffff';
var BLACK 					= '#000000';
var SHADOW					= '#8b8b8b';

//Template server directory
const TEMPLATESDIR_URI = 'https://school9-nt.ru/assets/themes/school9_v3';

//Templates
const NAVIGATION_RIGHTARROW = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 26 30" enable-background="new 0 0 26 30" xml:space="preserve"><polygon class="svg-fill" points="25,15 12,29 1,29 14,15 1,1 11.9,1 "/></svg>';
const NAVIGATION_LEFTARROW = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 26 30" enable-background="new 0 0 26 30" xml:space="preserve"><polygon class="svg-fill" points="1,15 14,1 25,1 12,15 25,29 14.1,29 "/></svg>';

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// SERVICE FUNCTIONS ///////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

if(typeof String.prototype.trim === 'undefined'){
	String.prototype.trim = function(full){
		return (!full) ? this.replace(/^[\s\xa0]+|[\s\xa0]+$/, '') : this.replace(/^[\s\xa0\r\n\t]+|[\s\xa0\r\n\t]+$/, '');
	}
}

function logaction(eventtype, logphrase){
	if(typeof console === 'undefined') return false;
	
	try{
		switch(eventtype){
			case 'error' : console.error(logphrase); break;
			case 'info' : console.info(logphrase); break;
			case 'warn' : console.warn(logphrase); break;
			default : console.log(logphrase); break;
		}
	} catch(ex){
		return false;
	}
	
	return true;
}

function fetch_object(id){
	return document.getElementById(id) || false;
}

function fetch_tags(tag, root){
	return (root) ? root.getElementsByTagName(tag) : (document.getElementsByTagName(tag) || false);
}

function hasClass(cstring, cneedle){
	if(!cstring || !cneedle) return false;
	
	var strclasses = cstring.split(' ');
	for(var i = 0;i < strclasses.length;i++) if(strclasses[i] == cneedle) return true;
	return false;
}

function addClass(domobj, cladd){
	return (domobj.className == '') ? domobj.className = cladd : domobj.className += ' ' + cladd;
}

function removeClass(domobj, clremove){
	if(domobj.className && domobj.className != ''){
		var domobj_classes = domobj.className.split(' ');
		for(var i = 0;i < domobj_classes.length;i++){
			if(domobj_classes[i] == clremove) delete domobj_classes[i];
		}
		
		return domobj.className = domobj_classes.join(' ');
	}
	
	return false;
}

function getControlPosition(domobj){
	if(typeof domobj === 'undefined') return false;
	
	var domobj_box = domobj.getBoundingClientRect();
    var top = domobj_box.top + window.pageYOffset;
    var left = domobj_box.left + window.pageXOffset;
	
	return {'top': Math.floor(top), 'left': Math.floor(left)};
}

function getViewport_Dimensions(dimension){
	if(typeof dimension === 'undefined' || dimension == '') dimension = 'height';
	
	if(dimension == 'height'){
		return document.documentElement.clientHeight;
	} else if(dimension == 'width'){
		return document.documentElement.clientWidth;
	} else {
		return false;
	}
}

function inViewport(domobj){
	if(typeof domobj === 'undefined') return false;
	
	return getControlPosition(domobj).top > (window.pageYOffset || document.documentElement.scrollTop);
}

function registermenu(cid, showmarker, showactive, forcealign_vertical, forcealign_horizontal, lowreslayout_forcealign_vertical, lowreslayout_forcealign_horizontal, isfullscreen, hideonclick){
	//Register menu
	MENUS[cid] = new S9Menu(cid, showmarker, showactive, forcealign_vertical, forcealign_horizontal, lowreslayout_forcealign_vertical, lowreslayout_forcealign_horizontal, isfullscreen, hideonclick);
    return true;
}

function showHotline_Information(){
    return MessageBox.Show('<table class="newstext-table"><tbody><tr><td>Заместитель директора по УР 5-11 классы</td><td>Павлова Ирина Валерьевна</td><td>9292144248</td></tr><tr><td>Заместитель директора по УР 1-4 классы</td><td>Татаринова Лариса Евгеньевна</td><td>9222274211</td></tr><tr><td>Заместитель директора по ВР</td><td>Кириллова Любовь Васильевна</td><td>9222202186</td></tr><tr><td>Заместитель директора по ПВ</td><td>Пушкина Наталья Сергеевна</td><td>9226120073</td></tr><tr><td>Директор</td><td>Соколова Елена Григорьевна</td><td>9089244705</td></tr></tbody></table>Уважаемые родители! По всем вопросам организации обучения можно также обращаться по телефону 8(3435) 33-55-69 или на личную почту директора школы <a href="mailto:esokolova1970@mail.ru" title="">esokolova1970@mail.ru</a>', 'Телефоны "горячей линии"');
}


function switchLayer(layername, lazy = false){
    if(!layername || layername == '') return;
    
    if(PAGEGALLERY) PAGEGALLERY.galleryShutdown();
    if(OVERLAY) OVERLAY.hide();
    
    if(LAYERS[layername].is_displayed){
        if(!lazy){
            hideLayers();
            showLayer('content');
            window.history.pushState(null, '', BACKURL);
        } else {
            return true;
        }
    } else {
        hideLayers();
        showLayer(layername);
        if(layername == 'content'){
            window.history.pushState(null, '', BACKURL);
        } else {
            BACKURL = (!BACKURL) ? 'https://school9-nt.ru/' : document.location.href;
            window.history.pushState(null, '', 'https://school9-nt.ru/#' + layername);
        }
    }
    
    return true;
}

function showLayer(layername){
    if(typeof LAYERS[layername] === 'undefined') return;
    
    if(layername == 'content'){
        if(!LAYERS[layername].element){
            if(LAYERS['content_404'].element) layername = 'content_404';
        }
    }
    
    LAYERS[layername].element.style.display = LAYERS[layername].element_type;
    if(LAYERS[layername].show_backbutton){
        var sbsvg = fetch_object(LAYERS[layername].sidebar_button + '_svg');
        sbsvg.style.display = 'none';
        sbsvg.parentNode.title = 'Назад';
        fetch_object(LAYERS[layername].sidebar_button + '_svg_backbutton').style.display = 'block';
    }

    if(LAYERS[layername].sidebar_button){
        var sb = fetch_object(LAYERS[layername].sidebar_button);
        removeClass(sb, 'sb-hoverable');
        if(!hasClass(sb.className, 'sidebar-button-active')){
            addClass(sb, 'sidebar-button-active');
        }
    }

    LAYERS[layername].is_displayed = true;
    
    return true;
}

function hideLayers(suspend = false){
    for(let layer in LAYERS) hideLayer(layer, suspend);
    
    return true;
}

function hideLayer(layername, suspend = false){
    if(typeof LAYERS[layername] === 'undefined' || !LAYERS[layername].element) return;
    
    if(layername == 'content'){
        if(!LAYERS[layername].element){
            if(LAYERS['content_404'].element) layername = 'content_404';
        }
    }
    
    LAYERS[layername].element.style.display = 'none';
    if(!suspend){
        if(LAYERS[layername].show_backbutton){
            var sbsvg = fetch_object(LAYERS[layername].sidebar_button + '_svg');
            fetch_object(LAYERS[layername].sidebar_button + '_svg_backbutton').style.display = 'none';
            sbsvg.style.display = 'block';
            sbsvg.parentNode.title = LAYERS[layername].sidebar_button_title;
        }

        if(LAYERS[layername].sidebar_button){
            var sb = fetch_object(LAYERS[layername].sidebar_button);
            removeClass(sb, 'sidebar-button-active');
            if(!hasClass(sb.className, 'sb-hoverable')){
                addClass(sb, 'sb-hoverable');
            }
        }
    }

    if(!suspend) LAYERS[layername].is_displayed = false;
    
    return true;
}

function resumeSuspendedLayer(){
    for(let layer in LAYERS){
        if(LAYERS[layer].is_displayed && LAYERS[layer].element.style.display == 'none'){
            LAYERS[layer].element.style.display = LAYERS[layer].element_type;
        }
    }
    
    return true;
}

function setCSSvar(name, value){
    return (typeof ROOT !== 'undefined') ? ROOT.style.setProperty(name, value) : false;
}

function getCookie(cname){
    let cookies = document.cookie.split(';');
    for(let i = 0; i < cookies.length; i++){
        if(cookies[i].trim().startsWith(cname + '=')){
            return cookies[i].split('=')[1];
        }
    }
    
    return false;
}

function setCookie(cname, cval, cexpires, path){
    cname = encodeURIComponent(cname);
    cval = encodeURIComponent(cval);
    
    cexpires = (cexpires instanceof Date) ? cexpires.toUTCString() : '';
    path = (typeof path !== 'undefined') ? path : '/';
    
    document.cookie = cname + '=' + cval + '; path=' + path + '; expires=' + cexpires + '; samesite=lax';
    
    return true;
}

function s9clientApp_Init(){
	if(typeof console.time !== 'undefined') console.time('Initialization time');
	if(typeof console.group !== 'undefined') console.group('S9 Client-side application init log');
    
    //Set layout resolution
    LOWRESLAYOUT = window.matchMedia("screen and (max-width: 961px)").matches;
	
	//Detect fragment in URL
	if(document.location.hash) LINKHASH = document.location.hash.replace('#', '');
	
    //Get loading animation
	LOADING_ANIMATION = new Image();
	LOADING_ANIMATION.src = TEMPLATESDIR_URI + '/base/graphs/loadanimation.gif';
    
    //Init layers
    LAYERS = { 
                content: {  
                                element              : fetch_object('content_2-layer-container'),
                                element_type         : 'block', 
                                is_displayed         : false, 
                                sidebar_button       : null, 
                                sidebar_button_title : '', 
                                show_backbutton      : false
                        },
                content_404: {  
                                element              : fetch_object('content_404-layer-container'),
                                element_type         : 'block', 
                                is_displayed         : false, 
                                sidebar_button       : null, 
                                sidebar_button_title : '', 
                                show_backbutton      : false
                        },
                search: { 
                                element              : fetch_object('content_3-layer-container'),
                                element_type         : 'block', 
                                is_displayed         : false, 
                                sidebar_button       : 'sb-search', 
                                sidebar_button_title : 'Поиск', 
                                show_backbutton      : true
                        }, 
                photoalbum: { 
                                element              : fetch_object('content_4-layer-container'),
                                element_type         : 'block', 
                                is_displayed         : false, 
                                sidebar_button       : 'sb-photoalbum', 
                                sidebar_button_title : 'Фотоальбом', 
                                show_backbutton      : true
                            }, 
                video: { 
                                element              : fetch_object('content_5-layer-container'),
                                element_type         : 'block', 
                                is_displayed         : false, 
                                sidebar_button       : 'sb-video', 
                                sidebar_button_title : 'Видео',
                                show_backbutton      : true
                        }
            };
    
    //Get CSS vars
    ROOT = document.querySelector(':root');
    if(typeof ROOT === 'undefined'){
        logaction('info', 'No CSS variables found in root element.');
    }
    
	//Init slidertables
	var i = 0;
	var stable = fetch_object('slidertable-' + i);
	
	while(stable){
		var slidertable_obj = new slidertable(stable);
		if(slidertable_obj.state == 1) SLIDERTABLES[slidertable_obj.ID] = slidertable_obj;
		
		i++;
		stable = fetch_object('slidertable-' + i);
	}
	
	//Init overlay
	OVERLAY = new overlay();
	
	//Build a gallery on this page
	PAGEGALLERY = new s9pagegallery();
    PAGEGALLERY.Init();
	
	//Reparse links
	reparseLinks();
	
	//Init message boxes
	MessageBox = new s9msgbox();
	
	//Init Dashboard
    DASHBOARD = new s9dashboard();
    
    fetch_object('sb-search').onclick = function(){
        switchLayer('search');
        fetch_object('s').focus();
        
        return false;
    }
    
    fetch_object('sb-photoalbum').onclick = function(){
        switchLayer('photoalbum');
        PAGEGALLERY.Init_Photoalbum();
        
        return false;
    }
    
    fetch_object('sb-video').onclick = function(){
        switchLayer('video');
        PAGEGALLERY.Init_Videogallery();
        
        return false;
    }
    
    //Parse linkhash
    if(LINKHASH){
        if(LINKHASH.indexOf('video') == 0){
            switchLayer('video');
            PAGEGALLERY.Init_Videogallery();
        } else if(LINKHASH.indexOf('photoalbum') == 0){
            var hashparts = LINKHASH.split('/');
            if(typeof hashparts[1] !== 'undefined' && typeof hashparts[2] !== 'undefined'){
                PAGEGALLERY.photoalbum_ShowPage(hashparts[1], hashparts[2]);
            } else if(typeof hashparts[1] !== 'undefined'){
                PAGEGALLERY.photoalbum_ShowPage(hashparts[1], -1);
            } else {
                switchLayer('photoalbum');
                PAGEGALLERY.Init_Photoalbum();
            }
        } else if(LINKHASH.indexOf('search') == 0){
            switchLayer('search');
            fetch_object('s').focus();
        } else {
            switchLayer('content');
        }
    } else {
        switchLayer('content');
    }
	
	if(typeof console.groupEnd !== 'undefined') console.groupEnd();
	if(typeof console.timeEnd !== 'undefined') console.timeEnd('Initialization time');
}

function initFeedbackMessenger(){
	S9MSGR = new s9msgr();
}

//////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// GLOBAL EVENTS HANDLERS ///////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

function onBodyResize(){
	//Submenus hide
	for(let key in MENUS) MENUS[key].hide(true);
	
	//Recalculate viewport size
	VIEWPORT.Height = getViewport_Dimensions('height');
	VIEWPORT.Width = getViewport_Dimensions('width');
    
    //Reset layout mode
    LOWRESLAYOUT = window.matchMedia("screen and (max-width: 961px)").matches;
    
    //Initiate layout handling
    if(OVERLAY.displayed) OVERLAY.handleBodyResize();
    PAGEGALLERY.handleBodyResize();
    if(typeof DASHBOARD.handleBodyResize !== 'undefined') DASHBOARD.handleBodyResize();
}

document.onclick = function(e){
	//Submenus hide
	for(let key in MENUS) if(MENUS[key].expanded) MENUS[key].hide();
}

window.onscroll = window.onmousewheel = document.onmousewheel = function(e){
	if(OVERLAY.displayed && !OVERLAY.ismodal) OVERLAY.hide();
    
    for(let key in MENUS) if(MENUS[key].fullscreen && MENUS[key].expanded) {
        if(MENUS[key].offset > window.pageYOffset){
           window.scrollTo(0, MENUS[key].offset);
        }
    }
}

//////////////////////////////////////////////////////////////////////////////
/////////////////////////////// PAGE MODIFIERS ///////////////////////////////
//////////////////////////////////////////////////////////////////////////////

//Reparse links
function reparseLinks(){
	var links = fetch_tags('a');
	if(!links) return;
	
	//Loop through links
	for(var i = 0;i < links.length;i++){
		//Rebuild external links
		if(links[i].target == '_blank' && !hasClass(links[i].className, 'videolink_single') && !hasClass(links[i].className, 'imagelink_single') && !("noExternalIcon" in links[i].dataset)){
			//Figure out the kind of the link object
			var imgs = fetch_tags('img', links[i]);
			if(imgs.length == 0){
				//Create new link
				var n_link = document.createElement('a');
				n_link.href = links[i].href;
				n_link.title = (links[i].title != '') ? links[i].title + ' (Откроется в новом окне)' : 'Эта ссылка откроется в новом окне';
				n_link.target = links[i].target;
				n_link.innerHTML = links[i].innerHTML;
				
				//Create container for new link
				var c_link = document.createElement('span');
				c_link.className = 'link-external';
				
				//Add new link to DOM
				c_link.appendChild(n_link);
				links[i].parentNode.replaceChild(c_link, links[i]);
			} else links[i].title = (links[i].title != '') ? links[i].title + ' (Откроется в новом окне)' : 'Эта ссылка откроется в новом окне';
        } else if(hasClass(links[i].className, 'imagelink_single')){
            //Show single image
			links[i].onclick = function(e){
				PAGEGALLERY.showImage(this);
				e.preventDefault();
			}
        } else if(hasClass(links[i].className, 'videolink_single')){
			//Show video
			links[i].onclick = function(e){
				PAGEGALLERY.showVideo(this);
				e.preventDefault();
			}
		}
	}
}

/////////////////////////////////////////////////////////////////////////
/////////////////////////////// AJAX CORE ///////////////////////////////
/////////////////////////////////////////////////////////////////////////

function s9ajax(onprogress_userfunc, oncomplete_userfunc, onabort_userfunc, onerror_userfunc){
	this.response = null;
	this.status = null;
	this.exeption = null;
	this.state = null;
	
	var s9ajax_obj = null;
	var onProgress = function(){}
	var onComplete = function(){}
	var onAbort = function(){}
	var errorHandler = function(){}
	var REQUEST_TIMEOUT = 15000;
	var RESPONSE_CHECK_DELAY = 15;
	var REQUEST_TIME_ELAPSED = 0;
	
	var isAsync = true;
	var REQUEST_SET = false;
	var STATE_EXECUTION = false;
	var intid = null;
	
	//Try to get Ajax
	if(window.XMLHttpRequest){
		s9ajax_obj = new XMLHttpRequest();
		logaction('info', 'Found ajax interface XMLHttpRequest');
	} else if(window.ActiveXObject) {
		var axo_strings = new Array("Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.3.0", "Msxml2.XMLHTTP", "Microsoft.XMLHTTP");
		var i = 0;
		for(i = 0;i < axo_strings.length;i++){
			try{
				s9ajax_obj = new ActiveXObject(axo_strings(i));
			} catch(ex) {
				s9ajax_obj = false;
			}
			if(!s9ajax_obj){
				continue; 
			} else {
				logaction('info', 'Found ajax interface ' + axo_strings(i));
				break;
			}
		}
	}
	
	//No Ajax interface found
	if(!s9ajax_obj || typeof(s9ajax_obj) === 'undefined'){
		this.state = 0;
		logaction('error', 'Could not initialize ajax core. Interface not found.');
		return;
	}
	
	//Apply user functions on events
	if(onprogress_userfunc && typeof(onprogress_userfunc) == 'function') onProgress = onprogress_userfunc;
	if(oncomplete_userfunc && typeof(oncomplete_userfunc) == 'function') onComplete = oncomplete_userfunc;
	if(onabort_userfunc && typeof(onabort_userfunc) == 'function') onAbort = onabort_userfunc;
	if(onerror_userfunc && typeof(onerror_userfunc) == 'function') {
		errorHandler = onerror_userfunc;
	} else {
		errorHandler = function(){
			//Show low-level message for an error
			if(!logaction('error', "Во время выполнения произошла ошибка. [" + this.status + "] " + this.exeption)) alert("Во время выполнения произошла ошибка. [" + this.status + "] " + this.exeption);
		}
	}
	
	//Object created successfuly
	this.state = 1;
	
	//Core methods
	this.setRequest = function(url, async){
		if(REQUEST_SET) REQUEST_SET = false;
		if(this.state != 1) return false;
		
		//Set request mode
		isAsync = (typeof(async) == 'boolean') ? async : true;
		
		//Verify request url
		if(!url || typeof(url) != 'string') return false;
		
		//Open connection
		s9ajax_obj.open("POST", url, isAsync);
		s9ajax_obj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		s9ajax_obj.setRequestHeader('X-Requested-With', 'S9AJAX-ENGINE');
		
		REQUEST_SET = true;
		return true;
	}
		
	this.Execute = function(senddata){
		//Check function misuse
		if(!REQUEST_SET || this.state == 0 || STATE_EXECUTION) return;
		
		//Prepare postdata
		senddata = senddata || null;
		var postdata = '';
		if(typeof(senddata) == 'object' && senddata != null){
			for(var datakey in senddata){
				if(postdata == '') postdata = datakey + '=' + encodeURIComponent(senddata[datakey]); else postdata += '&' + datakey + '=' + encodeURIComponent(senddata[datakey]);
			}
		} else {
			postdata = null;
		}
		
		//Exec user function
		try{
			onProgress();
		} catch(ex) {
			logaction('error', 'User onProgress function failed to execute in ajax core. ' + ex);
		}
		
		//Send request
		STATE_EXECUTION = true;
		s9ajax_obj.send(postdata);
		
		//Handle response
		REQUEST_TIME_ELAPSED = 0;
		if(!isAsync) responseHandle.call(this); else intid = setInterval(responseHandle, RESPONSE_CHECK_DELAY);
	}
	
	var responseHandle = function(){
		//Prevent misuse
		if(!STATE_EXECUTION) return;
		
		//Check object status
		var r_state = s9ajax_obj.readyState;
		if(r_state == 4){
			//Stop response cheking
			if(isAsync) clearInterval(intid);
				
			//Check error status
			this.status = s9ajax_obj.status;
			if(this.status == 200 || this.status == 0){
				//Verify content type
				var c_type = s9ajax_obj.getResponseHeader('Content-Type').split(';');
				

				if(c_type && c_type[0].trim() == 'text/javascript'){
					//Make sure if response string is safe for eval
					var t_valid = isvalidJSONString(s9ajax_obj.responseText);
						
					//Parse response to JSON object
					//Yes, bad practice is good practice here :)
					this.response = (t_valid) ? eval('(' + s9ajax_obj.responseText + ')') : s9ajax_obj.responseText;
				} else {
					//If unknown header, save the raw response
					this.response = s9ajax_obj.responseText;
				}
					
				//Execute user function
				try{
					onComplete();
				} catch(ex) {
					//Show low-level message for an error
					logaction('error', 'User onComplete function failed to execute in ajax core: ' + ex);
				}
			} else {
				//We have an error
				//Set error description
				this.exeption = s9ajax_obj.statusText;
					
				//Execute user function
				try{
					errorHandler();
				} catch(ex) {
					//Show low-level message for an error
					logaction('error', "Во время выполнения произошла ошибка. [" + this.status + "] " + this.exeption);
				}
			}
			
			//Reset the system for another request
			STATE_EXECUTION = false;
			REQUEST_SET = false;
		}
		
		//Handle timeout
		if(isAsync){
			if(REQUEST_TIME_ELAPSED >= REQUEST_TIMEOUT){
				//Ensure that request need abording
				if(r_state != 4){
					//Stop response cheking
					clearInterval(intid);
				
					//Abort the request
					s9ajax_obj.abort();
					
					//Set status description
					this.exeption = "Время соединения истекло.";
					
					//Execute user function
					try{
						onAbort();	
					} catch(ex) {
						logaction('error', 'User onAbort function failed to execute in ajax core: ' + ex);
					}
					
					//Reset the system for another request
					STATE_EXECUTION = false;
					REQUEST_SET = false;
				}
			} else REQUEST_TIME_ELAPSED += RESPONSE_CHECK_DELAY;
		}
	}
	
	var isvalidJSONString = function(string){
		var stopchars = new RegExp(/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g);
		var json_str = String(string);
		
		//Replace certain Unicode chars
		stopchars.lastIndex = 0;
		if(stopchars.test(json_str)){
			json_str = json_str.replace(stopchars, function(a){
				return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);			
			});
		}
		
		//Replace JSON backslash pairs with @
		stopchars = new RegExp(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g);
		json_str = json_str.replace(stopchars, '@');
		
		//Replace all simple value strings with ]
		stopchars = new RegExp(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g);
		json_str = json_str.replace(stopchars, ']');
		
		//Delete all open brackets
		stopchars = new RegExp(/(?:^|:|,)(?:\s*\[)+/g);
		json_str = json_str.replace(stopchars, '');
		
		//Check remaining symbols
		stopchars = new RegExp(/^[\],:{}\s]*$/);
		return stopchars.test(json_str);
	}
	
}

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// MENUS ///////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

function S9Menu(controlid, showmarker, showactive, forcealign_vertical, forcealign_horizontal, lowreslayout_forcealign_vertical, lowreslayout_forcealign_horizontal, isfullscreen, hideonclick){
	this.expanded = false;
	this.control = fetch_object(controlid);
	
	this.align_vertical = (forcealign_vertical) ? forcealign_vertical  : 'bottom';
    this.align_vertical_lowres = (lowreslayout_forcealign_vertical) ? lowreslayout_forcealign_vertical  : 'bottom';
    this.align_horizontal = (forcealign_horizontal) ? forcealign_horizontal : 'left';
    this.align_horizontal_lowres = (lowreslayout_forcealign_horizontal) ? lowreslayout_forcealign_horizontal : 'left';
	this.show_control_marker = (showmarker) ? showmarker : true;
	this.show_active = showactive || false;
    this.fullscreen = isfullscreen || false;
    this.autohide = hideonclick || false;
    this.offset = 0;
    this.p = false;
    
    //This is to be finished in future when needed
	//if(this.show_control_marker) this.control.innerHTML += '';
	
	this.control.onmouseover = function(e){
        if(!MENUS[this.id].expanded) MENUS[this.id].itemsprepare(getControlPosition(MENUS[this.id].control));
        e.stopPropagation();
	}
	
	this.control.onclick = function(e){
		MENUS[this.id].expanded ? MENUS[this.id].hide() : MENUS[this.id].show();
		e.stopPropagation();
	}
    
    this.itemsprepared = false;
}

S9Menu.prototype.itemsprepare = function(cpos){
    if(!this.itemsprepared){
        this.items = fetch_object(this.control.id + '-items');
        this.menu_animation = new s9fx(this.items);
        
        //Menu should not hide after user clicks an item
        if(!this.autohide){
            this.items.onclick = function(e){
                e.stopPropagation();
            }
        }
        
        this.itemsprepared = true;
    }
    
    //Set the position of dropdown list
    //Vertical align
    if(LOWRESLAYOUT){
        //Vertical align
        switch(this.align_vertical_lowres){
            case 'top'.toLowerCase():
                this.items.style.top = cpos['top'] - this.items.offsetHeight + 'px';
                break;
            case 'middle'.toLowerCase():
                this.items.style.top = cpos['top'] - Math.floor(Math.abs(this.items.offsetHeight - this.control.offsetHeight) / 2) + 'px';
                break;
            case 'bottom'.toLowerCase():
                this.items.style.top = cpos['top'] + this.control.offsetHeight + 'px';
                break;
            default: break;
        }
    
        //Horizontal align
        switch(this.align_horizontal_lowres){
            case 'left'.toLowerCase():
                this.items.style.left = cpos['left'] - this.items.offsetWidth + 'px';
                break;
            case 'center'.toLowerCase():
                this.items.style.left = cpos['left'] - Math.floor(Math.abs(this.items.offsetWidth - this.control.offsetWidth) / 2) + 'px';
                break;
            case 'right'.toLowerCase():
                this.items.style.left = cpos['left'] + this.control.offsetWidth + 'px';
                break;
            default: break;
        }    
    } else {
        //Vertical align
        switch(this.align_vertical){
            case 'top'.toLowerCase():
                this.items.style.top = cpos['top'] - this.items.offsetHeight + 'px';
                break;
            case 'middle'.toLowerCase():
                this.items.style.top = cpos['top'] - Math.floor(Math.abs(this.items.offsetHeight - this.control.offsetHeight) / 2) + 'px';
                break;
            case 'bottom'.toLowerCase():
                this.items.style.top = cpos['top'] + this.control.offsetHeight + 'px';
                break;
            default: break;
        }

        //Horizontal align
        switch(this.align_horizontal){
            case 'left'.toLowerCase():
                this.items.style.left = cpos['left'] - this.items.offsetWidth + 'px';
                break;
            case 'center'.toLowerCase():
                this.items.style.left = cpos['left'] - Math.floor(Math.abs(this.items.offsetWidth - this.control.offsetWidth) / 2) + 'px';
                break;
            case 'right'.toLowerCase():
                this.items.style.left = cpos['left'] + this.control.offsetWidth + 'px';
                break;
            default: break;
        }
    }
}

S9Menu.prototype.show = function(){
    this.expanded = true;
    if(this.fullscreen) OVERLAY.hide();
	if(this.show_active) addClass(this.control, this.control.id + '-active');
	
	if('opacity' in this.items.style){
		this.menu_animation.setAnimation('opacity', 0, 1, 0.28, null, null, true, 25);
	} else if('filter' in this.items.style){
		this.menu_animation.setAnimation('filter', 0, 100, 28, 'alpha(opacity=', ')', true, 25);
	}
	
	this.menu_animation.renderFirstKeyframe();
	this.items.style.display = 'block';
    if(this.fullscreen){
        if(!LOWRESLAYOUT){
            this.items.style.width = (getViewport_Dimensions('width') - 60) + 'px';
        } else {
            this.items.style.width = '100%';
        }
        //The code bellow deals with strange browser bug:
        //the flex-column parent container does not expand 
        //to fit its child nodes width
    } else {
        if(this.items.id == 'videogallery-playlistsmenu_container-items' && !this.p){
            var cw = this.items.getBoundingClientRect();
            var uchilds = this.items.firstChild.childNodes;
            var uchilds_count = uchilds.length;
            var max = 0;
            for(let i = uchilds_count - 3; i < uchilds_count; i++){
                var ccw = uchilds[i].getBoundingClientRect();
                if(ccw.width > max) max = ccw.width;
            }
            
            this.items.style.width = (Math.ceil(cw.width + max)) + 'px';
            this.p = true;
        }
    }
	
	//Animate fade in
	this.menu_animation.animate('linear', 1);
    
    //Hide all background if menu is fullscreen
    if(this.fullscreen){
        hideLayers(true);
        this.offset = window.pageYOffset;
    }
    
}

S9Menu.prototype.hide = function(on_body_resize = false){
    if(LOWRESLAYOUT &&  on_body_resize) return;
    
    if(!this.expanded) return;
    
	this.expanded = false;
    
    //Show all background if menu is fullscreen
    if(this.fullscreen){
        resumeSuspendedLayer();
    }
    
	if(this.show_active) removeClass(this.control, this.control.id + '-active');
	this.items.style.display = 'none';
}

////////////////////////////////////////////////////////////////////////////
/////////////////////////////// SLIDERTABLES ///////////////////////////////
////////////////////////////////////////////////////////////////////////////

function slidertable(stable){
	this.ID = stable.id;
	this.rows = new Array;
	this.state = null;
	
	if(!stable || stable.childNodes.length <= 0){
		this.state = 0;
		return;
	}
	
	var i = 0;
	
	//Search invalid rows
	var invalidRows = new Array;
	for(let i = 0;i < stable.childNodes.length;i++){
		if((stable.childNodes[i].nodeName.toLowerCase() != 'a' 
			&& stable.childNodes[i].nodeName.toLowerCase() != 'div') 
		|| (stable.childNodes[i].nodeName.toLowerCase() == 'a' 
			&& (!stable.childNodes[i].id 
			|| stable.childNodes[i].id == ''))
		|| (stable.childNodes[i].nodeName.toLowerCase() == 'div' 
			&& (!stable.childNodes[i].className 
			|| (!hasClass(stable.childNodes[i].className, 'slidertable-head')  
				&& !hasClass(stable.childNodes[i].className, 'slidertable-body'))))) invalidRows.push(stable.childNodes[i]);
	}
	
	//Remove invalid rows if found
	if(invalidRows.length > 0) for(i = 0;i < invalidRows.length;i++) stable.removeChild(invalidRows[i]);
	
	//Memory saving
	invalidRows = null;
	
	//Build rows
	for(let i = 0;i < stable.childNodes.length;i++){
		if(hasClass(stable.childNodes[i].className, 'slidertable-head')){
			for(let j = 0;j < stable.childNodes[i].childNodes.length;j++){
				if(hasClass(stable.childNodes[i].childNodes[j].className, 'slidertable-marker') ){
					var imgc = stable.childNodes[i].childNodes[j];
				}
			}
			
			//Detect anchor
			var anchorname = '';
			var previndex = i - 1;
			previndex = (previndex < 0) ? 0 : previndex;
			if(stable.childNodes[previndex].nodeName.toLowerCase() == 'a' 
			&& stable.childNodes[previndex].id 
			&& stable.childNodes[previndex].id != '') anchorname = stable.childNodes[previndex].id;
			
			this.rows.push(new Array(stable.childNodes[i], imgc, stable.childNodes[i + 1], anchorname));
		}
	}
	
	//Some additional styling
	this.rows[this.rows.length - 1][2].style.borderTop = 'none';
	this.rows[this.rows.length - 1][0].style.borderBottom = '1px solid ' + LIGHT_BLUE;
	
	//Add event listeners
	for(let i = 0;i < this.rows.length;i++){
		this.rows[i][0].onclick = function(e){
			SLIDERTABLES[this.parentNode.id].slidertableRow_OpenClose(this);
			e.stopPropagation();
		}
		
		//Disable selection on row header
		this.rows[i][0].onselectstart = this.rows[i][0].onmousedown = function(){ return false; }
	}
	
	//Object successfuly created
	this.state = 1;
	
	//Handle fragment in URL
	if(LINKHASH){
		for(let i = 0;i < this.rows.length;i++) if(this.rows[i][3] == LINKHASH){
			this.rows[i][2].style.display = 'block';
			addClass(this.rows[i][1], 'stm-expanded');
			addClass(this.rows[i][0], 'sth-openned');
			break;
		}
	}
}

slidertable.prototype.slidertableRow_OpenClose = function(targetrow){
	for(let i = 0;i < this.rows.length;i++){
		if(this.rows[i][0] === targetrow){
			if(this.rows[i][2].style.display == 'none') {
				this.rows[i][2].style.display = 'block';
				removeClass(this.rows[i][1], 'stm-collapsed');
				addClass(this.rows[i][1], 'stm-expanded');
                addClass(this.rows[i][0], 'sth-openned');
				
				//If openned row has disappeared from the screen
				//Scroll the page
				if(!inViewport(targetrow)) window.scrollTo(0, getControlPosition(targetrow).top - 25);
			} else {
				this.rows[i][2].style.display = 'none';
                removeClass(this.rows[i][0], 'sth-openned');
				removeClass(this.rows[i][1], 'stm-expanded');
				addClass(this.rows[i][1], 'stm-collapsed');
			}
		} else {
			this.rows[i][2].style.display = 'none';
            removeClass(this.rows[i][0], 'sth-openned');
			removeClass(this.rows[i][1], 'stm-expanded');
			addClass(this.rows[i][1], 'stm-collapsed');
		}
		//this.rows[i][0].className = 'slidertable-head';
	}
}

//////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// FEEDBACK MESSENGER ///////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

function s9msgr(){
	var m_form = fetch_object('s9msgr-form');
    var st_form = fetch_object('s9msgr-sticket');
	if(!m_form) return;
	
	//Get controls
    var controls = new Object;
    controls = {
        session:{
            link: fetch_object('ms_session')
        },
        giventicket:{
            link: fetch_object('ms_giventicket'), 
            error: fetch_object('ms_giventicket-error')
        },
        givenname:{
            link: fetch_object('ms_givenname'), 
            error: fetch_object('ms_givenname-error')
        },
        givenmail:{
            link: fetch_object('ms_givenmail'), 
            error: fetch_object('ms_givenmail-error')
        },
		givenphone:{
            link: fetch_object('ms_givenphone'), 
            error: fetch_object('ms_givenphone-error')
        },
		giventheme:{
            link: fetch_object('ms_giventheme'), 
            error: fetch_object('ms_giventheme-error'), 
            div: fetch_object('giventheme_row')
        },
		givensolve:{
            link: fetch_object('ms_givensolve'), 
            error: fetch_object('ms_givensolve-error')
        }, 
        giventext:{
            link: fetch_object('ms_giventext'), 
            error: fetch_object('ms_giventext-error')
        }, 
        chosentheme:{
            link: fetch_object('ms_chosentheme'), 
            error: fetch_object('ms_chosentheme-error')
        }, 
        capcha:{
            link: fetch_object('c_image'), 
            refreshlink: fetch_object('c_refreshlink')
        }, 
        m_submit:{
            link: fetch_object('ms_submit')
        },  
        st_submit:{
            link: fetch_object('st_submit')
        }
    }
	
	if(!controls.m_submit.link) return;
	
	
	//Cannot proceed with out session
	if(typeof(controls.session.link.value) == 'undefined' || controls.session.link.value == '') return;
	
	var mailpattern = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
	var phonepattern = new RegExp(/^((8|\+7)[\- ]?)?(\(?\d{3,4}\)?[\- ]?)?[\d\- ]{7,10}$/);
	var namepattern = new RegExp(/^[a-zA-Zа-яА-ЯёЁ0-9\s_-]{1,50}$/);
    var ticketpattern = new RegExp(/^[A-F0-9]{32}$/);
    var service_ticketpattern = new RegExp(/^(S9)[0-9]{10}[-][A-Z]{4}((ADM)|(ADV)|(WEB)|(EJR)|(ESV)|(MSC))$/);
	
	//AJAX events function
	var ajaxOnProgress = function(){
		controls.givensolve.link.value = '';
        colorize('normal', controls.givensolve);
		controls.capcha.refreshlink.style.display = 'none';
        controls.capcha.link.innerHTML = '<img style="margin-top:35px;" src="' + LOADING_ANIMATION.src + '" alt="" />';
	}
	
	var ajaxOnComplete = function(){
		if(this.response['system_status'] == 'OK'){
			if(typeof(this.response['session']) != 'undefined') controls.session.link.value = this.response['session'];
			controls.capcha.link.innerHTML = '<img src="https://school9-nt.ru/files/s9msgrcache/capchas/' + this.response['c_imagename'] + '" alt="" />';
		} else if(this.response['system_status'] == 'ERROR'){
			controls.capcha.link.innerHTML = '<div style="margin-top:30px;">' + this.response['exeption'] + '</div>';
		}
		controls.capcha.refreshlink.style.display = 'inline';
	}
	
	var ajaxOnAbort = function(){
		controls.capcha.link.innerHTML = '<div style="margin-top:30px;">' + this.exeption + '</div>';
		controls.capcha.refreshlink.style.display = 'inline';
	}
	
	//Fire up AJAX core
	var c_updater = new s9ajax(ajaxOnProgress, ajaxOnComplete, ajaxOnAbort, null);
	if(c_updater.state != 1) return;
	
	
	//Define GUI logic
	var formvalidated = false;
    
    controls.giventicket.link.onblur = function(){
		controls.giventicket.link.value = controls.giventicket.link.value.trim();
		if(controls.giventicket.link.value != ''){
			if(!ticketpattern.test(controls.giventicket.link.value) && !service_ticketpattern.test(controls.giventicket.link.value)){
				colorize('error', controls.giventicket);
			} else {
				colorize('normal', controls.giventicket);
			}
		} else {
			colorize('normal', controls.giventicket);
		}
	}
	
	controls.givenname.link.onblur = function(){
		controls.givenname.link.value = controls.givenname.link.value.trim();
		if(controls.givenname.link.value != ''){
			if(!namepattern.test(controls.givenname.link.value)){
				colorize('error', controls.givenname);
			} else {
				colorize('normal', controls.givenname);
			}
		}
	}
	
	controls.givenmail.link.onblur = function(){
		if(controls.givenmail.link.value != ''){
			controls.givenmail.link.value = controls.givenmail.link.value.trim();
			if(!mailpattern.test(controls.givenmail.link.value)){
				colorize('error', controls.givenmail);
			} else {
				colorize('normal', controls.givenmail);
			}
		}
	}
	
	controls.givenphone.link.onblur = function(){
		controls.givenphone.link.value = controls.givenphone.link.value.trim();
		if(controls.givenphone.link.value != ''){
			if(!phonepattern.test(controls.givenphone.link.value)){
				colorize('error', controls.givenphone);
			} else {
				colorize('normal', controls.givenphone);
			}
		} else {
			colorize('normal', controls.givenphone);
		}
	}
	
	controls.chosentheme.link.onchange = function(){
		if(controls.chosentheme.link.options[controls.chosentheme.link.selectedIndex].value == '7') {
            controls.giventheme.div.style.display = 'block';
			controls.giventheme.link.focus();
		} else {
			controls.giventheme.link.value = '';
			controls.giventheme.div.style.display = 'none';
		}
		
		if(formvalidated && controls.chosentheme.link.options[controls.chosentheme.link.selectedIndex].value != '0'){
			colorize('normal', controls.chosentheme);
		}
	}
	
	controls.giventheme.link.onblur = function(){
		controls.giventheme.link.value = controls.giventheme.link.value.trim();
		if(formvalidated && controls.giventheme.link.value != '' && controls.chosentheme.link.options[controls.chosentheme.link.selectedIndex].value == '7'){
			colorize('normal', controls.giventheme);
		}
	}
	
	controls.capcha.refreshlink.onclick = function(e){
		//Cancel default action
		e = e || window.event;
		e.preventDefault ? e.preventDefault() : (e.returnValue = false);
		
		//Send update request
		var r_object = new Object;
		r_object['do'] = 'c_imageupdate';
		r_object['ms_session'] = controls.session.link.value;
		c_updater.setRequest('https://school9-nt.ru', true);
		c_updater.Execute(r_object);
	}
	
	controls.giventext.link.onblur = function(){
		controls.giventext.link.value = controls.giventext.link.value.trim(true);
		if(formvalidated && controls.giventext.link.value != '') colorize('normal', controls.giventext);
	}
	
	controls.givensolve.link.onblur = function(){
		controls.givensolve.link.value = controls.givensolve.link.value.trim();
		if(formvalidated && controls.givensolve.link.value != '') colorize('normal', controls.givensolve);
	}
    
    controls.st_submit.link.onclick = function(){
        if(controls.giventicket.link.value == '' || (!ticketpattern.test(controls.giventicket.link.value) && !service_ticketpattern.test(controls.giventicket.link.value))){
			colorize('error', controls.giventicket);
			return;
		} else {
            st_form.submit();
        }
    }
	
	controls.m_submit.link.onclick = function(){
		var p = true;
		
		//Verify phone and email
		if(controls.givenmail.link.value == '' || !mailpattern.test(controls.givenmail.link.value)){
			colorize('error', controls.givenmail);
			p = false;
		}
		
		if(controls.givenphone.link.value != ''){
			if(!phonepattern.test(controls.givenphone.link.value)){
				colorize('error', controls.givenphone);
				p = false;
			}
		}
		
		//Verify username
		if(controls.givenname.link.value == '' || !namepattern.test(controls.givenname.link.value)){
			colorize('error', controls.givenname);
			p = false;
		}
		
		//Verify theme
		if(controls.chosentheme.link.options[controls.chosentheme.link.selectedIndex].value == '0'){
			colorize('error', controls.chosentheme);
			p = false;
		} else if(controls.chosentheme.link.options[controls.chosentheme.link.selectedIndex].value == '7'){
			if(controls.giventheme.link.value == ''){
				colorize('error', controls.giventheme);
				p = false;
			}
		}
		
		//Verify message
		if(controls.giventext.link.value == '') {
            colorize('error', controls.giventext);
			p = false;
		}
		
		//Verify capcha solve
		if(controls.givensolve.link.value == ''){
			colorize('error', controls.givensolve);
			p = false;
		}
		
		//And finally submit form
		if(p) {
            for(let controlname in controls){
                if(controls[controlname].link.hasAttribute('disabled')) controls[controlname].link.removeAttribute('disabled');
            }
            m_form.submit(); 
        } else {
			formvalidated = true;
			return;
		}
	}
	
	var colorize = function(style, object){
		if(!object) return;
		
		switch(style){
			case 'normal':
				object.link.style.borderBottomColor = LIGHT_BLUE;
				if(object.error) object.error.style.display = 'none';
				break;
			case 'error':
				object.link.style.borderBottomColor = RED;
				if(object.error) object.error.style.display = 'block';
				break;
		}
	}
}

//////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// MESSAGE BOX ///////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

function s9msgbox(){
	
	this.Show = function(caption, title){
		if(typeof(caption) !== 'string' || !caption) return false;
		title = (typeof(title) !== 'string' || !title) ? '' : title;
		
		var messagebox_html = '<div class="s9overlay"><div class="centredboxframe"><div class="messagebox_container"><div class="messagebox_controls_container"><div class="messagebox_controls_titlebox">' + title + '</div><div id="messagebox_controls_closebutton" class="overlay-control" style="font-weight: bold;" title="Закрыть">&times;</div></div><div class="messagebox_captionbox">' + caption + '</div></div></div></div>';
		
		OVERLAY.show(messagebox_html, true);
		
		fetch_object('messagebox_controls_closebutton').onclick = function(){
			return MessageBox.Close();
		}
	}
	
	this.Close = function(){
		return OVERLAY.hide();
	}
}

//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// OVERLAY /////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

function overlay(){
	this.displayed = false;
	this.ismodal = false;
	var defaultOpacity = 0.75;
	
	//Add overlay div
	var c_overlay_screen = fetch_object('overlay_screen');
	var c_overlay = document.getElementById('overlay');
	
	if('opacity' in c_overlay_screen.style){
		c_overlay_screen.style.opacity = defaultOpacity;
	} else {
		if('filter' in c_overlay_screen.style){
			c_overlay_screen.style.filter = 'alpha(opacity=' + defaultOpacity * 100 + ')';
		} else if('KhtmlOpacity' in c_overlay_screen.style){
			c_overlay_screen.style.KhtmlOpacity = defaultOpacity;
		} else if('MozOpacity' in c_overlay_screen.style){
			c_overlay_screen.style.MozOpacity = defaultOpacity;
		}
	}
	
	c_overlay_screen.style.display = 'none';
	c_overlay.style.display = 'none';
	
	//Add event handlers
	c_overlay.onclick = function(){
		if(OVERLAY.displayed && !OVERLAY.ismodal) OVERLAY.hide(); else return;
	}
	
	this.show = function(displayhtml, isModal, opacity){
		if(this.displayed || !displayhtml || displayhtml == '') return;
		this.ismodal = (!isModal || typeof(isModal) != 'boolean') ? false : true;
		
		this.changeContent(displayhtml);
		if(opacity) this.changeOpacity(opacity);
		
		//Set display style and show overlay
        if(!LOWRESLAYOUT){
            c_overlay_screen.style.top = c_overlay.style.top = '0';
            c_overlay_screen.style.left = c_overlay.style.left = '60px';
        } else {
            c_overlay_screen.style.top = c_overlay.style.top = '40px';
            c_overlay_screen.style.left = c_overlay.style.left = '0';
        }
		c_overlay_screen.style.display = 'block';
		c_overlay.style.display = 'block';
		
		this.displayed = true;
	}
	
	this.changeContent = function(displayhtml){
		if(!displayhtml || displayhtml == '') return;
		
		if(typeof(displayhtml) === 'string'){
			c_overlay.innerHTML = displayhtml;
		} else if(typeof(displayhtml) === 'object'){
			c_overlay.innerHTML = '';
			c_overlay.appendChild(displayhtml);
		} else return;
	}
	
	this.changeOpacity = function(opacity){
		var transp = parseFloat(opacity);
		if(isNaN(transp) || transp < 0){
			logaction('error', "Can't change overlay opacity. Opacity value (" + transp + ") is NaN or less than zero.");
			return;
		}
		if(transp > 1 && transp < 10) transp = 1; else if(transp >= 10 && transp <= 100) transp = transp / 100;
		
		if('opacity' in c_overlay_screen.style){
			c_overlay_screen.style.opacity = transp;
		} else {
			if('filter' in c_overlay_screen.style){
				c_overlay_screen.style.filter = 'alpha(opacity=' + transp * 100 + ')';
			} else if('KhtmlOpacity' in c_overlay_screen.style){
				c_overlay_screen.style.KhtmlOpacity = transp;
			} else if('MozOpacity' in c_overlay_screen.style){
				c_overlay_screen.style.MozOpacity = transp;
			}
		}
	}
	
	this.hide = function(){
		if(!this.displayed) return;
		
		c_overlay.innerHTML = '';
		c_overlay.style.display = 'none';
		c_overlay_screen.style.display = 'none';
		
		this.displayed = false;
	}
    
    this.handleBodyResize = function(){
        if(!LOWRESLAYOUT){
            c_overlay_screen.style.top = c_overlay.style.top = '0';
            c_overlay_screen.style.left = c_overlay.style.left = '60px';
        } else {
            c_overlay_screen.style.top = c_overlay.style.top = '40px';
            c_overlay_screen.style.left = c_overlay.style.left = '0';
        }
    }
	
}

//////////////////////////////////////////////////////////////////////////////////
////////////////////////////////// PAGEGALLERY ///////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

function s9pagegallery(){
	//Private properties
    var GDATA = new Object;
    var AJAX_ENGINE = null;
	var galleryDisplayed = '';
    var currentPiece = 0;
	var currentImage = 0;
	var autoplaying = false;
    
    // Disclamer URL to show in UI
	var disclamerURL = '/faq/privacy-policy-disclaimer/';
    
    //Galleries patterns info
    var patternswidth = {
                            1 : 368,
                            2 : 184, 
                            3 : 184, 
                            4 : 184, 
                            5 : 184, 
                            6 : 368, 
                            7 : 184, 
                            8 : 368, 
                            9 : 368
                        };
	
	var gallerySlideshow_Title = null;
	var gallerySlideshow_Playbackswitch = null;
	var gallerySlideshow_Maximages = 0;
	var gallerySlideshow_Counter = '';
	var gallerySlideshow_Image = null;
	var	gallerySlideshow_Prevbutton = null;
	var	gallerySlideshow_Nextbutton = null;
	
	var gallerySlideshow_Loadinterval = null;
	var gallerySlideshow_Autoplayinterval = null;
	var gallerySlideshow_Loadcheckdelay = 15;
	var gallerySlideshow_Autoplaydelay = 8000;
    var gallerySlideshow_Imageload_Errors = 0;
    
    var gallerySlideshowControls_Playback = '&#9205;';
    var gallerySlideshowControls_Pause = '&#9208;';
    var gallerySlideshowControls_Photoalbum = '&#x2317;';
    
    var theBackgroundMosaic_Image = null;
    var theBackgroundMosaic_Loadinterval = null;
    var theBackgroundMosaic_Loadcheckdelay = 15;
    var theBackgroundMosaic_Loaded = false;
    
    var photoalbumInited = false;
    var photoalbumViewport = null;
    var photoalbumpageViewport = null;
    var photoalbumGalleries = new Array;
    
    var videogalleryInited = false;
    var videogalleryViewport = null;
    var videogalleryMenu = null;
    var videogalleryMenuItems = null;
    var videogalleryContent = null;
    var videogalleryPlaylists = new Object;
    var videogalleryContent_Data = new Object;
    
    var videogalleryTemplate_Videocover_width = 320;
    var videogalleryTemplate_Videocover_height = 180;
    var videogalleryCovers_Path = '/files/vdatacache/';
    
    this.Init = function(){
        //Init ajax
        AJAX_ENGINE = new s9ajax(null, null, null, null);
        
        //Init intesection observer for
        //lazy galleries loading
        var pagegallery_observer_options = {
            root: null, 
            rootMargin: '0px', 
            threshold: 0.05
        }
        
        try{
            const pagegallery_observer = new IntersectionObserver(pagegallery_observer_callback, pagegallery_observer_options);
            var pgcontainers = document.querySelectorAll('[data-galleryid]');
            var pgcnum = pgcontainers.length;
            for(let i = 0; i < pgcnum; i++){
                pagegallery_observer.observe(pgcontainers[i]);
            }
        } catch(e) {
            logaction('error', 'Error initializing Intersection Observer instance. Pagegalleries won\'t be shown. Please update or change your browser.');
        }
        
        if(!LOWRESLAYOUT) loadTheBackgroundMosaic();
    }
    
    var pagegallery_observer_callback = function(gallery_entries){
        var cent = gallery_entries.length;
        for(let i = 0; i < cent; i++){
            if(gallery_entries[i].intersectionRatio <= 0) continue;
            
            var tid = gallery_entries[i].target.getAttribute('data-galleryid');
            if(!GDATA['pagegallery_' + tid]){
                gallery_entries[i].target.innerHTML = '<div style="width: 100%; text-align: center;"><img src="' + LOADING_ANIMATION.src + '" alt="" /></div>';
                var pagegallery_raw = new s9ajax(null, assembleThePuzzle, null, null);
                if(pagegallery_raw.state == 1){
                    if(pagegallery_raw.setRequest('https://school9-nt.ru', true)){
                        var r_object = new Object;
                        r_object['do'] = 'get_pagegallery';
                        r_object['pid'] = tid;
                        pagegallery_raw.Execute(r_object);
                    }
                }
            }
        }
    }
    
    var assembleThePuzzle = function(showgallery = false){
        if(!showgallery && this.response['system_status'] != 'OK') return;
        
        var gallery = (!showgallery) ? this.response['pagegallery'] : showgallery;
        var domgallery = (!showgallery) ? fetch_object('photopuzzle-' + gallery['galleryid']) : fetch_object('photoalbumpage-photos');
        var domgallery_clientwidth = domgallery.clientWidth;
        var pieces = gallery['pieces'].length;
        var index = 1;
        
        domgallery.innerHTML = '';
        
        for(let i = 0; i < pieces; i++) gallery['pieces'][i]['placed'] = false;
        
        var restwidth = domgallery_clientwidth;
        for(let i = 0; i < pieces; i++){
            if(!gallery['pieces'][i]['placed']){
                domgallery.appendChild(createPuzzlepiece(gallery['pieces'][i], gallery['galleryid'], index, gallery['images']));
                
                restwidth -= patternswidth[gallery['pieces'][i]['pattern']];
                gallery['pieces'][i]['placed'] = true;
                index++;
                
                if(gallery['pieces'][i + 1]){
                    for(let j = i + 1; j < pieces; j++){
                        if(!gallery['pieces'][j]['placed'] && patternswidth[gallery['pieces'][j]['pattern']] > restwidth){
                            for(let k = j + 1; k < pieces; k++){
                                if(!gallery['pieces'][k]['placed'] && patternswidth[gallery['pieces'][k]['pattern']] <= restwidth){
                                    domgallery.appendChild(createPuzzlepiece(gallery['pieces'][k], gallery['galleryid'], index, gallery['images']));
                            
                                    gallery['pieces'][k]['placed'] = true;
                                    index++;
                                    break;
                                }
                            }
                            restwidth = domgallery_clientwidth;
                            break;
                        }
                    }
                }
            }
        }
        
        GDATA['pagegallery_' + gallery['galleryid']] = gallery;
    }
    
    var createPuzzlepiece = function(puzzlepiece_info, galleryid, index, galleryimages){
        var thepuzzlepiece = document.createElement('div');
        thepuzzlepiece.id = 'photopuzzle-' + galleryid + '_piece-' + index;
        addClass(thepuzzlepiece, 'photopuzzle-piece');
        addClass(thepuzzlepiece, 'pattern-' + puzzlepiece_info['pattern']);
        
        var images = puzzlepiece_info['images'].length;
        for(let i = 0; i < images; i++){
            thepuzzlepiece.appendChild(createPuzzlepiece_Image(puzzlepiece_info['images'][i], i + 1, galleryimages));
        }
        
        return thepuzzlepiece;
    }
    
    var createPuzzlepiece_Image = function(puzzlepieceimageid, index, galleryimages){
        var theimagebox = document.createElement('div');
        addClass(theimagebox, 'photopuzzle-imagebox');
        theimagebox.setAttribute('data-index', index);
        
        var images = galleryimages.length;
        var i = 0;
        for(i = 0; i < images; i++){
            if(galleryimages[i]['id'] == puzzlepieceimageid) break;
        }
        
        var thelink = document.createElement('a');
        thelink.id = puzzlepieceimageid;
        thelink.href = galleryimages[i]['imageremoteurl'];
        thelink.title = galleryimages[i]['title'];
        
        thelink.onclick = function(e){
            PAGEGALLERY.showGallery(this.id);
            e.preventDefault();
        }
        
        var theimage = document.createElement('img');
        theimage.src = galleryimages[i]['imagelocalurl'];
        theimage.alt = galleryimages[i]['title'];
        
        thelink.appendChild(theimage);
        theimagebox.appendChild(thelink);
        
        return theimagebox;
    }
    
    var loadTheBackgroundMosaic = function(){
        //Modify map
        var mosaicmap = fetch_object('backgroundMosaicMap');
        if(!mosaicmap) return;
        
        var areas = mosaicmap.childNodes.length;
        
        for(let i = 0; i < areas; i++){
            mosaicmap.childNodes[i].onclick = function(e){
                PAGEGALLERY.showImage(this);
                e.preventDefault();
            }
        }
        
        //Preload map
        theBackgroundMosaic_Image = new Image;
        theBackgroundMosaic_Image.setAttribute('usemap', '#backgroundMosaicMap');
        theBackgroundMosaic_Image.setAttribute('alt', '');
        theBackgroundMosaic_Image.src = TEMPLATESDIR_URI + '/base/graphs/_backgroundMosaic.webp?cached=' + mosaicmap.getAttribute('data-cached');
        
        //Check monitor load proccess
		theBackgroundMosaic_Loadinterval = setInterval(loadTheBackgroundMosaic_Complete, theBackgroundMosaic_Loadcheckdelay);
    }
    
    var loadTheBackgroundMosaic_Complete = function(){
        if(!theBackgroundMosaic_Image.complete) return;
        
        clearInterval(theBackgroundMosaic_Loadinterval);
        var theBackgroundMosaic = fetch_object('backgroundMosaic');
        theBackgroundMosaic.appendChild(theBackgroundMosaic_Image);
        
        fetch_object('backgroundMosaic-container').removeChild(fetch_object('backgroundMosaic-loading'));
        theBackgroundMosaic.style.display = 'block';
        
        theBackgroundMosaic_Loaded = true;
    }
    
    this.Init_Videogallery = function(){
        //Exit if already inited
        if(videogalleryInited) return;
        
        videogalleryViewport = fetch_object('content_5-layer');
        
        //Set loading animation
        videogalleryViewport.innerHTML = '<div id="videoGallery-loading" class="centredboxframe"><div class="loading">Загрузка...<br /><img src="' + LOADING_ANIMATION.src + '" alt="" /></div></div>';
        
        //Get playlists
        videogalleryPlaylists = ajaxRequest({ do: 'get_videogalleryplaylists' })['playlists'];
        
        //Videogallery template
        videogalleryViewport.innerHTML = '<div id="videogallery-playlists_container"><div id="videogallery-playlistsmenu_container"><div id="videogallery-playlistsmenu"></div><div id="videogallery-playlistsmenu_marker"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 414.3 236" style="enable-background:new 0 0 414.3 236;" xml:space="preserve"><polygon class="svg_fill" points="0,29.8 30.3,0 207.6,176.8 385,0 414.3,29.3 207.6,236 "/></svg></div></div></div><div id="videogallery-videos_container"></div>';
        videogalleryMenu = fetch_object('videogallery-playlistsmenu');
        videogalleryMenuItems = fetch_object('videogallery-playlistsmenu_container-items');
        videogalleryContent = fetch_object('videogallery-videos_container');
        
        //Register playlists menu
        registermenu('videogallery-playlistsmenu_container', false, false, 'bottom', 'left', 'bottom', 'left', false, true);
        
        //Set flag
        videogalleryInited = true;
        
        //Show popular playlist
        PAGEGALLERY.Videogallery_SwitchPlaylist(666);
    }
    
    this.Videogallery_SwitchPlaylist = function(playlistid){
        //Set loading content
        videogalleryContent.innerHTML = '<div id="videoGallery-loading" class="centredboxframe"><div class="loading">Пожалуйста, подождите...<br /><img src="' + LOADING_ANIMATION.src + '" alt="" /></div></div>';
        
        //Generate playlists menu items
        var playlists_html = '<ul>';
        
        //Add popular vids menu item
        if(playlistid != 666){
            playlists_html += '<li onclick="return PAGEGALLERY.Videogallery_SwitchPlaylist(666);"><h3>Популярные видео</h3></li>';
        } else {
            videogalleryMenu.innerHTML = '<h2>Популярные видео</h2>';
        }
        
        var pcount = videogalleryPlaylists.length;
        for(let i = 0; i < pcount; i++){
            if(videogalleryPlaylists[i]['id'] != playlistid){
                playlists_html += '<li onclick="return PAGEGALLERY.Videogallery_SwitchPlaylist(' + videogalleryPlaylists[i]['id'] + ');"><h3>' + videogalleryPlaylists[i]['title'] + ' (' + videogalleryPlaylists[i]['vidscount'] + ')</h3></li>';
            } else {
                videogalleryMenu.innerHTML = '<h2>' + videogalleryPlaylists[i]['title'] + '</h2>';
            }
        }
        playlists_html += '</ul>';
        videogalleryMenuItems.innerHTML = playlists_html;
        
        //Request server if no data in cache
        if(!videogalleryContent_Data[playlistid]){
            videogalleryContent_Data[playlistid] = ajaxRequest({ do: 'get_videogalleryplaylist', plid:  playlistid })['playlist'];
        }
        
        //Videos template
        var columns = Math.ceil(videogalleryContent_Data[playlistid].length / 2);
        
        var VIDEOS_TEMPLATE = '<div class="videogallery-videos" style="grid-template-columns: repeat(' + columns + ', ' + videogalleryTemplate_Videocover_width + 'px);">';
        var vcount = videogalleryContent_Data[playlistid].length;
        var vtitle = '';
        var vdesc = '';
        for(let i = 0; i < vcount; i++){
            if(videogalleryContent_Data[playlistid][i]['description'] == ''){
                vtitle = '';
                vdesc = 'Опубликовано: ' + videogalleryContent_Data[playlistid][i]['datepublished'] + '<br />Просмотров: ' + videogalleryContent_Data[playlistid][i]['viewCount'];
            } else {
                vtitle = 'Опубликовано: ' + videogalleryContent_Data[playlistid][i]['datepublished'] + '. Просмотров: ' + videogalleryContent_Data[playlistid][i]['viewCount'];
                vdesc = videogalleryContent_Data[playlistid][i]['description'];
            }
            VIDEOS_TEMPLATE += '<div class="video" title="' + vtitle + '" onclick="return PAGEGALLERY.showVideo(\'' + videogalleryContent_Data[playlistid][i]['ytid'] + '\');"><div class="videocover" style="background-image: url(' + videogalleryCovers_Path + videogalleryContent_Data[playlistid][i]['ytid'] + '_medium.jpg);"><div class="videoduration"><span>' + videogalleryContent_Data[playlistid][i]['duration'] + '</span></div></div><div class="videocaption"><span style="font-size: var(--fontsize-2);">' + videogalleryContent_Data[playlistid][i]['title'] + '</span><br /><span style="font-size: var(--fontsize-small);">' + vdesc + '</span></div></div>';
        }
        VIDEOS_TEMPLATE += '</div>';
        
        //Update viewport
        videogalleryContent.innerHTML = VIDEOS_TEMPLATE;
    }
    
    this.Init_Photoalbum = function(){
        //Already inited
        if(photoalbumInited) return;
        
        photoalbumViewport = fetch_object('photoalbum');
        photoalbumpageViewport = fetch_object('photoalbumpage');
        
        //Set loading animation
        photoalbumViewport.innerHTML = '<div id="photoAlbum-loading" class="centredboxframe"><div class="loading">Загрузка...<br /><img src="' + LOADING_ANIMATION.src + '" alt="" /></div></div>';
        
        //Get playlists
        photoalbumGalleries = ajaxRequest({ do: 'get_photoalbum' })['photoalbum'];
        
        //Init intesection observer for
        //lazy galleries loading
        var photoalbumyear_observer_options = {
            root: photoalbumViewport, 
            rootMargin: '0px', 
            threshold: 0.05
        }
        
        var photoalbumyear_observer = null;
        try{
            photoalbumyear_observer = new IntersectionObserver(photoalbumyear_observer_callback, photoalbumyear_observer_options);
        } catch(e) {
            logaction('error', 'Error initializing Intersection Observer instance. Photoalbum won\'t be shown. Please update or change your browser.');
            return;
        }
        
        photoalbumViewport.innerHTML = '';
        
        //Generate photoalbum
        var gheight = getViewport_Dimensions('height') - 100;
        var rows = Math.floor(gheight / 279);
        
        for(let i = 0; i < photoalbumGalleries.length; i++){
            var photoalbumyear = document.createElement('div');
            photoalbumyear.id = 'photoalbumyear-' + photoalbumGalleries[i]['year'];
            addClass(photoalbumyear, 'photoalbumyear');
            
            var photoalbum_yearsign = document.createElement('div');
            addClass(photoalbum_yearsign, 'photoalbum-yearsign');
            photoalbum_yearsign.innerHTML = photoalbumGalleries[i]['year'];
            
            if(i % 2 != 0) photoalbum_yearsign.style.backgroundColor = 'var(--color-light-blue)';
            
            var photoalbumyear_galleries = document.createElement('div');
            addClass(photoalbumyear_galleries, 'photoalbumyear-galleries');
            photoalbumyear_galleries.setAttribute('data-photoalbumindex', i);
            
            var ygcount = photoalbumGalleries[i]['galleries'].length;
            var gw = Math.ceil(ygcount / rows) * 372;
            photoalbumyear_galleries.style.width = gw + 'px';
            
            photoalbumyear.appendChild(photoalbum_yearsign);
            photoalbumyear.appendChild(photoalbumyear_galleries);
            
            photoalbumViewport.appendChild(photoalbumyear);
            
            photoalbumyear_observer.observe(photoalbumyear_galleries);
        }
        
        //Set flag
        photoalbumInited = true;
    }
    
    var photoalbumyear_observer_callback = function(years_entries){
        var yent = years_entries.length;
        for(let i = 0; i < yent; i++){
            if(years_entries[i].intersectionRatio <= 0) continue;
            
            var yearid = parseInt(years_entries[i].target.getAttribute('data-photoalbumindex'));
            if(photoalbumGalleries[yearid]['loaded']) continue;
            
            var ygcount = photoalbumGalleries[yearid]['galleries'].length;
            var yeartemplate = '';
            for(let j = 0; j < ygcount; j++){
                yeartemplate += '<div id="photoalbum-gallery-' + photoalbumGalleries[yearid]['galleries'][j]['id'] + '" class="photoalbum-gallery" style="background-image: url(' + photoalbumGalleries[yearid]['galleries'][j]['cover'] + ');" title="' + photoalbumGalleries[yearid]['galleries'][j]['description'] + ' ' + photoalbumGalleries[yearid]['galleries'][j]['datecreated'] + '" onClick="return PAGEGALLERY.photoalbum_ShowPage(\'' + photoalbumGalleries[yearid]['galleries'][j]['name'] + '\', -1);"><div class="photoalbum-gallery_caption"><span style="background-color: var(--color-light-blue);padding-left: 5px;padding-right: 5px;">' + photoalbumGalleries[yearid]['galleries'][j]['title'] + '</span></div></div>';
            }
            
            years_entries[i].target.innerHTML += yeartemplate;
            photoalbumGalleries[yearid]['loaded'] = true;
        }
    }
    
    this.photoalbum_ShowPage = function(pagename, startfrom){
        //Autoload photoalbum
        switchLayer('photoalbum', true);
        PAGEGALLERY.Init_Photoalbum();
        
        //Search gallery data
        var yearid = -1;
        var pageindex = -1;
        var ycount = photoalbumGalleries.length;
        for(let i = 0; i < ycount; i++){
            var gcount = photoalbumGalleries[i]['galleries'].length;
            for(let j = 0; j < gcount; j++){
                if(photoalbumGalleries[i]['galleries'][j]['name'] == pagename){
                    yearid = i;
                    pageindex = j;
                    break;
                }
            }
        }
        
        if(yearid < 0 || pageindex < 0) return;
        
        //Page template
        photoalbumpageViewport.innerHTML = '<div id="photoalbumpage-title_container"><div id="photoalbumpage-backbutton" title="Назад"><svg version="1.1" id="photoalbumpage_backbutton_svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 60 50" style="enable-background:new 0 0 60 50;" xml:space="preserve" class="svg-fill"><g><path d="M30.6,5.3c-11,0-20,9-20,20s9,20,20,20s20-9,20-20S41.6,5.3,30.6,5.3z M30.6,42.8C20.9,42.8,13,35,13,25.3S20.9,7.8,30.6,7.8s17.5,7.9,17.5,17.5S40.3,42.8,30.6,42.8z"/></g><polygon points="21.9,25.3 30,16.6 36.9,16.6 28.8,25.3 36.9,34 30.1,34 "/></svg></div><div id="photoalbumpage-title">' + photoalbumGalleries[yearid]['galleries'][pageindex]['title'] + '<br /><span style="font-size: var(--fontsize-3);">' + photoalbumGalleries[yearid]['galleries'][pageindex]['description'] + ' (' + photoalbumGalleries[yearid]['galleries'][pageindex]['datecreated'] + ')</span></div></div><div id="photoalbumpage-photos_container"><div id="photoalbumpage-photos"></div></div></div>';
        
        //Show page
        photoalbumViewport.style.display = 'none';
        photoalbumpageViewport.style.display = 'flex';
        
        fetch_object('photoalbumpage-photos').innerHTML = '<div id="photoAlbum-loading" class="centredboxframe"><div class="loading">Загрузка...<br /><img src="' + LOADING_ANIMATION.src + '" alt="" /></div></div>';
        
        //Get page data
        var photoalbumPagegallery = new Object;
        if(!GDATA['pagegallery_' + photoalbumGalleries[yearid]['galleries'][pageindex]['id']]){
            photoalbumPagegallery = ajaxRequest({ do: 'get_pagegallery', pid: photoalbumGalleries[yearid]['galleries'][pageindex]['id'] })['pagegallery'];
        } else {
            photoalbumPagegallery = GDATA['pagegallery_' + photoalbumGalleries[yearid]['galleries'][pageindex]['id']];
        }
        
        //Assemble the puzzle
        assembleThePuzzle(photoalbumPagegallery);
        
        //Correct link
        window.history.pushState(null, '', 'https://school9-nt.ru/#photoalbum/' + photoalbumGalleries[yearid]['galleries'][pageindex]['name']);
        
        //Back event
        fetch_object('photoalbumpage-backbutton').onclick = function(){
            //Close page
            photoalbumViewport.style.display = 'flex';
            photoalbumpageViewport.style.display = 'none';
            window.history.pushState(null, '', 'https://school9-nt.ru/#photoalbum');
        }
        
        //Start slideshow if requested
        if(startfrom > -1) PAGEGALLERY.showGallery(parseInt(startfrom));
    }
	
	this.showImage = function(target_object){
		//Execute default action
		//if something wrong with target object provided
		if(typeof(target_object) !== 'object'){
			logaction('error', "Can't show an image. Something is wrong with image object provided.");
			return;
		}
		
		//Let's try to get image description
		var title = '';
		var caption = null;
		var pid = '';
		var gid = null;
        
		var img = fetch_tags('img', target_object);
		if(img && img.length > 0){
			title = (img[0].alt && img[0].alt != '') ? img[0].alt : ''; 
            pid = (img[0].id && img[0].id != '') ? img[0].id : ''; //This needs to start gallery slideshow automatically
		}
		
        switch(target_object.nodeName.toLowerCase()){
            case 'figure':
                caption = fetch_object('figcaption', target_object);
                title = (caption && caption.innerHTML.trim() != '') ? caption.innerHTML.trim() : title;
                break;
            case 'a':
                title = (target_object.title && target_object.title.trim() != '') ? target_object.title.trim() : title;
                pid = (target_object.hasAttribute('data-pid')) ? target_object.getAttribute('data-pid') : pid;
                gid = (target_object.hasAttribute('data-gid')) ? target_object.getAttribute('data-gid') : target_object.id.split('-')[1];
                break;
            case 'area':
                title = 'Фотография из фотоальбома "' + target_object.getAttribute('data-gname') + '"';
                pid = (target_object.hasAttribute('data-pid')) ? target_object.getAttribute('data-pid') : pid;
                gid = (target_object.hasAttribute('data-gid')) ? target_object.getAttribute('data-gid') : target_object.id.split('-')[1];
                break;
            default: return;
        }
		
		showSingle(target_object.href, title, gid, pid, true);
	}
	
	this.showGallery = function(startimage){
        if(galleryDisplayed != '') return;
		
		//Establish the ID of the gallery the requested image from
	gallerySearch:
		for(gallery in GDATA){
            if(gallery == '_backgroundMosaic') continue;
            
			var gcount = GDATA[gallery]['images'].length;
			for(var i = 0; i < gcount; i++){
				if(GDATA[gallery]['images'][i]['id'] == startimage){
					galleryDisplayed = gallery;
					currentImage = i;
					gallerySlideshow_Maximages = gcount;
					break gallerySearch;
				}
			}
		}
		
		//If image not found in galleries
		if(galleryDisplayed == '') return;
		
		//Show loading progress
		OVERLAY.show('<div class="s9overlay"><div class="centredboxframe"><div class="loading">Пожалуйста, подождите...<br /><img src="' + LOADING_ANIMATION.src + '" alt="" /></div></div></div>');
		
		//Initiate loading images
		var lowerbound = currentImage - 2;
		var upperbound = currentImage + 3;
		if(gallerySlideshow_Maximages <= 5){
			lowerbound = 0;
			upperbound = gallerySlideshow_Maximages;
		}
		for(var i = lowerbound; i < upperbound; i++){
			if(i < 0){
				var ci = gallerySlideshow_Maximages + i;
				if(!GDATA[galleryDisplayed]['images'][ci]['domobj'] || !GDATA[galleryDisplayed]['images'][ci]['domobj'].srcset){
					GDATA[galleryDisplayed]['images'][ci]['domobj'] = new Image();
                    GDATA[galleryDisplayed]['images'][ci]['domobj'].onerror = function(){
                        return showGallery_onImageload_Error();
                    }
					GDATA[galleryDisplayed]['images'][ci]['domobj'].src = GDATA[galleryDisplayed]['images'][ci]['imageremoteurl'];
				}
			} else if(i >= gallerySlideshow_Maximages){
				var ci = i - gallerySlideshow_Maximages;
				if(!GDATA[galleryDisplayed]['images'][ci]['domobj'] || !GDATA[galleryDisplayed]['images'][ci]['domobj'].srcset){
					GDATA[galleryDisplayed]['images'][ci]['domobj'] = new Image();
                    GDATA[galleryDisplayed]['images'][ci]['domobj'].onerror = function(){
                        return showGallery_onImageload_Error();
                    }
					GDATA[galleryDisplayed]['images'][ci]['domobj'].src = GDATA[galleryDisplayed]['images'][ci]['imageremoteurl'];
				}
			} else {
				if(!GDATA[galleryDisplayed]['images'][i]['domobj']  || !GDATA[galleryDisplayed]['images'][i]['domobj'].srcset){
					GDATA[galleryDisplayed]['images'][i]['domobj'] = new Image();
                    GDATA[galleryDisplayed]['images'][i]['domobj'].onerror = function(){
                        return showGallery_onImageload_Error();
                    }
					GDATA[galleryDisplayed]['images'][i]['domobj'].src = GDATA[galleryDisplayed]['images'][i]['imageremoteurl'];
				}
			}
		}
		
		//Check monitor load proccess
		gallerySlideshow_Loadinterval = setInterval(showGallery_Complete, gallerySlideshow_Loadcheckdelay);
		
		//Default action
		return false;
	}
    
    var showGallery_onImageload_Error = function(){
        gallerySlideshow_Imageload_Errors++;
        
        if(gallerySlideshow_Imageload_Errors >= 3){
            //Stop loading
            clearInterval(gallerySlideshow_Loadinterval);
            
            //Shutdown gallery
            PAGEGALLERY.galleryShutdown();
            
            //Show message
            MessageBox.Show('<div style="padding: 10px;">Фотографии большого разрешения для этой галереи еще обрабатываются. Пожалуйста, попробуйте позже.</div>', 'Фотоальбом');
        }
    }
	
	var showGallery_Complete = function(){
		//Prevent missuse
		if(galleryDisplayed == '') return;
		
		//Check if gallery loading was aborded
		//User has closed loading overlay
		if(!OVERLAY.displayed){
			clearInterval(gallerySlideshow_Loadinterval);
			PAGEGALLERY.galleryShutdown();
			return;
		}
		
		//Check if the gallery is loaded
		var lowerbound = currentImage - 2;
		var upperbound = currentImage + 3;
		if(gallerySlideshow_Maximages <= 5){
			lowerbound = 0;
			upperbound = gallerySlideshow_Maximages;
		}
		for(var i = lowerbound;i < upperbound;i++){
			if(i < 0){
				if(!GDATA[galleryDisplayed]['images'][gallerySlideshow_Maximages + i]['domobj'].complete) return;
			} else if(i >= gallerySlideshow_Maximages){
				if(!GDATA[galleryDisplayed]['images'][i - gallerySlideshow_Maximages]['domobj'].complete) return;
			} else {
				if(!GDATA[galleryDisplayed]['images'][i]['domobj'].complete) return;
			}
		}
		
		//Well we're here and ready to display the gallery
		clearInterval(gallerySlideshow_Loadinterval);
		
		//Gallery HTML
		var gTemplate = '<div class="s9overlay"><div class="photoalbum_overlay-controlbox"><div class="photoalbum_overlay-controlbox_descriptionbox"><strong>' + GDATA[galleryDisplayed]['title'] + '</strong> | <span id="photoalbum-overlay-controlbox_imagetitle"></span></div><div id="photoalbum_overlay-controlbox_counter" class="photoalbum-overlay-controlbox_counterbox"></div><div id="photoalbum_overlay-controlbox_playbackswitch" class="overlay-control photoalbum_overlay-controlbox_button" title=""></div><div id="photoalbum_overlay-controlbox_exitbutton" class="overlay-control photoalbum_overlay-controlbox_button" style="font-weight: bold;" title="Закрыть">&times;</div></div><div class="centredboxframe"><div class="photoalbum_overlay_viewport"><div id="photoalbum_overlay_prevbutton" class="photoalbum_overlay_navbutton"><div>' + NAVIGATION_LEFTARROW + '</div></div><div id="photoalbum_overlay_image" class="photoalbum_overlay_image" style="cursor: pointer;"></div><div id="photoalbum_overlay_nextbutton" class="photoalbum_overlay_navbutton" style="margin-right: 10px;"><div>' + NAVIGATION_RIGHTARROW + '</div></div></div></div><div class="disclaimer-overlay-link" style="margin-top:-65px;margin-right:30px;">[ <a href="' + disclamerURL + '" title="">Политика конфиденциальности</a> ]</div></div>';
		
		//Here we have to hide overlay and show it again because the 
		//gallery overlay is modal instead of loading animation overlay
		OVERLAY.hide();
		OVERLAY.show(gTemplate, true);
		
		//Nessesary objects
		gallerySlideshow_Title = fetch_object('photoalbum-overlay-controlbox_imagetitle');
		gallerySlideshow_Playbackswitch = fetch_object('photoalbum_overlay-controlbox_playbackswitch');
		gallerySlideshow_Counter = fetch_object('photoalbum_overlay-controlbox_counter');
		gallerySlideshow_Image = fetch_object('photoalbum_overlay_image');
		gallerySlideshow_Prevbutton = fetch_object('photoalbum_overlay_prevbutton');
		gallerySlideshow_Nextbutton = fetch_object('photoalbum_overlay_nextbutton');
		
		autoplaying = false;
		gallerySlideshow_Playbackswitch.innerHTML = gallerySlideshowControls_Playback;
		gallerySlideshow_Playbackswitch.title = "Автоматическая смена фотографий";
		
		//Events
		fetch_object('photoalbum_overlay-controlbox_exitbutton').onclick = function(){
			return PAGEGALLERY.galleryShutdown();
		}
		
		gallerySlideshow_Prevbutton.onclick = function(){
			if(!autoplaying) return PAGEGALLERY.gallerySlideshow_PrevImage();
			return false;
		}
		
		gallerySlideshow_Nextbutton.onclick = function(){
			if(!autoplaying) return PAGEGALLERY.gallerySlideshow_NextImage();
			return false;
		}
		
		gallerySlideshow_Playbackswitch.onclick = function(){
			return PAGEGALLERY.gallerySlideshow_Switchplayback();
		}
		
		//Right and left arrow keys
		document.onkeyup = function(e){
			if(!autoplaying && galleryDisplayed != ''){		
				if(e.keyCode == 37) return PAGEGALLERY.gallerySlideshow_PrevImage();
				if(e.keyCode == 39) return PAGEGALLERY.gallerySlideshow_NextImage();
                if(e.keyCode == 27) return PAGEGALLERY.galleryShutdown();
			}
            
			//Prevent default action
			e.preventDefault();
		}
		
		//Start the slideshow
		gallerySlideshow_MakeCurrent();
	}
	
	this.gallerySlideshow_NextImage = function(){
		if(galleryDisplayed == '') return;
		
		currentImage++;
		if(currentImage >= gallerySlideshow_Maximages) currentImage = 0;
		
		//Check images preload
		if(gallerySlideshow_Maximages > 5){
			var ci = currentImage + 2;
			if(ci >= gallerySlideshow_Maximages) ci = ci - gallerySlideshow_Maximages;
			if(!GDATA[galleryDisplayed]['images'][ci]['domobj']){
				GDATA[galleryDisplayed]['images'][ci]['domobj'] = new Image();
				GDATA[galleryDisplayed]['images'][ci]['domobj'].src = GDATA[galleryDisplayed]['images'][ci]['imageremoteurl'];
			}
		}
		
		return gallerySlideshow_MakeCurrent();
	}
	
	this.gallerySlideshow_PrevImage = function(){
		if(galleryDisplayed == '') return;
		
		currentImage--;
		if(currentImage < 0) currentImage = gallerySlideshow_Maximages - 1;
		
		//Check images preload
		if(gallerySlideshow_Maximages > 5){
			var ci = currentImage - 2;
			if(ci < 0) ci = gallerySlideshow_Maximages + ci;
			if(!GDATA[galleryDisplayed]['images'][ci]['domobj']){
				GDATA[galleryDisplayed]['images'][ci]['domobj'] = new Image();
				GDATA[galleryDisplayed]['images'][ci]['domobj'].src = GDATA[galleryDisplayed]['images'][ci]['imageremoteurl'];
			}
		}
				
		return gallerySlideshow_MakeCurrent();
	}
	
	this.gallerySlideshow_Switchplayback = function(){
		//Prevent missuse
		if(galleryDisplayed == '') return;
		
		if(autoplaying){
			//Turn off slideshow auto playback
			clearInterval(gallerySlideshow_Autoplayinterval);
			
			//Turn on arrow buttons
            gallerySlideshow_Prevbutton.style.display = 'flex';
            gallerySlideshow_Nextbutton.style.display = 'flex';
			
			//Change button icon
			gallerySlideshow_Playbackswitch.innerHTML = gallerySlideshowControls_Playback;
			gallerySlideshow_Playbackswitch.title = "Автоматическая смена фотографий";
			
			//Set flag
			autoplaying = false;
		} else {
			//Turn on slideshow auto playback
			//Turn off arrow buttons
            gallerySlideshow_Prevbutton.style.display = 'none';
            gallerySlideshow_Nextbutton.style.display = 'none';
			
			//Change button icon
			gallerySlideshow_Playbackswitch.innerHTML = gallerySlideshowControls_Pause;
			gallerySlideshow_Playbackswitch.title = "Остановить автоматическую смену фотографий";
			
			//Set flag
			autoplaying = true;
			
			//Autoplay
			gallerySlideshow_Autoplayinterval = setInterval(PAGEGALLERY.gallerySlideshow_NextImage, gallerySlideshow_Autoplaydelay);
		}
		
	}
	
	this.galleryShutdown = function(){
		if(galleryDisplayed == '') return;
        
        //If autoplaying, stop
		if(autoplaying) clearInterval(gallerySlideshow_Autoplayinterval);
        
        //Modify address bar
        if(photoalbumpageViewport && photoalbumpageViewport.style.display == 'flex'){
            window.history.pushState(null, '', 'https://school9-nt.ru/#photoalbum/' + GDATA[galleryDisplayed]['name']);
        }
		
		//Reset to initial state
		galleryDisplayed = '';
		currentImage = 0;
		gallerySlideshow_Maximages = 0;
		gallerySlideshow_Title = null;
		gallerySlideshow_Playbackswitch = null;
		gallerySlideshow_Counter = null;
		gallerySlideshow_Image = null;
		gallerySlideshow_Prevbutton = null;
		gallerySlideshow_Nextbutton = null;
        gallerySlideshow_Imageload_Errors = 0;
		
		//Stop slideshow
		OVERLAY.hide();
	}
	
	this.showVideo = function(target_object){
		if(!target_object) return;
		
		//Fetch ytid
		var vlink = (typeof target_object === 'object') ? target_object.href.split('v=')[1] : target_object;
		var vTemplate = '';
		var vWidth = VIEWPORT.Width - 350;
		var vHeight = Math.floor(vWidth / 1.78);
		
		vTemplate = '<div class="s9overlay"><div class="centredboxframe"><div style="width:' + vWidth + 'px;height:' + vHeight + 'px;"><iframe width="' + vWidth + '" height="' + vHeight + '" src="https://www.youtube.com/embed/' + vlink + '?rel=0&autoplay=1&modestbranding=1&mute=1" frameborder="0"></iframe><div class="disclaimer-overlay-link">[ <a href="' + disclamerURL + '" title="">Политика конфиденциальности</a> ]</div></div></div></div>';
		
		OVERLAY.show(vTemplate);
	}
	
	var showSingle = function(url, title, gid, pid, show_controlbox){
		//Show preload animation
		OVERLAY.show('<div class="s9overlay"><div class="centredboxframe"><div class="loading">Пожалуйста, подождите...<br /><img src="' + LOADING_ANIMATION.src + '" alt="" /></div></div></div>');
		
		//Image object
		var imgobj = new Image();
		
		//Onload event
		imgobj.onload = function(){
			//Scale image
			var newsize = scaleImage(imgobj.width, imgobj.height, VIEWPORT.Width, VIEWPORT.Height);
			imgobj.width = newsize.width;
			imgobj.height = newsize.height;
			
			//Build HTML
			var imgTemplate = '<div class="s9overlay"><div class="centredboxframe"><div id="photoalbum_overlay_image" class="photoalbum_overlay_image" style="flex-grow: 0; flex-shrink: 0;">';
			
			if(show_controlbox){
				imgTemplate += '<div class="photoalbum_overlay-controlbox" style="margin-top: 5px; margin-right: 5px; margin-bottom: -33px; position: relative; width: ' + newsize.width + 'px;">';
                if(title && title.trim() != '') imgTemplate += '<div class="photoalbum_overlay-controlbox_descriptionbox" style="padding-right: 5px; flex-grow: 0;">' + title.trim() + '</div>';
				if(gid && pid) imgTemplate += '<div id="singleimage-photoalbumlink" class="overlay-control photoalbum_overlay-controlbox_button" title="Остальные фотографии">' + gallerySlideshowControls_Photoalbum + '</div>';
				imgTemplate += '</div></div>';
			}
            
			imgTemplate += '</div></div>';
			
			//Display image 
			OVERLAY.changeContent(imgTemplate);
			
            var imagedisplayed = fetch_object('photoalbum_overlay_image');
            imagedisplayed.appendChild(imgobj);
            
            if(gid){
                var disc = document.createElement('div');
                addClass(disc, 'disclaimer-overlay-link');
                disc.innerHTML = '[ <a href="' + disclamerURL + '" title="">Политика конфиденциальности</a> ]';
                imagedisplayed.appendChild(disc);
                
                imagedisplayed.onclick = function(e){
                    e.stopPropagation();
                }
            } else {
                imagedisplayed.onclick = function(e){
                    document.location.href = url;
                    e.stopPropagation();
                }
                imagedisplayed.title = 'Кликните, чтобы сохранить оригинал';
                imagedisplayed.style.cursor = 'pointer';
            }
			
			//Add events
			if(show_controlbox){
				if(gid && pid){
					fetch_object('singleimage-photoalbumlink').onclick = function(){
                        OVERLAY.hide();
                        return PAGEGALLERY.photoalbum_ShowPage(gid, pid);
					}
				}
			}
		}
		
		//Finally preload an image
		imgobj.src = url;
	}
	
	var gallerySlideshow_MakeCurrent = function(){
		//Set up UI elements
		gallerySlideshow_Title.innerHTML = GDATA[galleryDisplayed]['images'][currentImage]['title'];
		var imnumber = currentImage + 1;
		gallerySlideshow_Counter.innerHTML = imnumber + ' / ' + gallerySlideshow_Maximages;
		
		//Scale image to show
		var newsize = scaleImage(GDATA[galleryDisplayed]['images'][currentImage]['domobj'].width, 
								GDATA[galleryDisplayed]['images'][currentImage]['domobj'].height,
								VIEWPORT.Width - 140,
								VIEWPORT.Height - 60
								);
		GDATA[galleryDisplayed]['images'][currentImage]['domobj'].width = newsize.width;
		GDATA[galleryDisplayed]['images'][currentImage]['domobj'].height = newsize.height;
		
		//Image area inner HTML
		GDATA[galleryDisplayed]['images'][currentImage]['domobj'].title = (GDATA[galleryDisplayed]['images'][currentImage]['imagedate'] != '') ? 'Время фотокамеры: ' + GDATA[galleryDisplayed]['images'][currentImage]['imagedate'] + ' (кликните, чтобы сохранить оригинал)' : 'Кликните, чтобы сохранить оригинал';
		GDATA[galleryDisplayed]['images'][currentImage]['domobj'].id = 'currentImage';
        GDATA[galleryDisplayed]['images'][currentImage]['domobj'].alt = GDATA[galleryDisplayed]['images'][currentImage]['title'];
		
		//Show the image
		gallerySlideshow_Image.innerHTML = '';
		gallerySlideshow_Image.appendChild(GDATA[galleryDisplayed]['images'][currentImage]['domobj']);
        //gallerySlideshow_Image.style.width = newsize.width + 'px';
		
		fetch_object('currentImage').onclick = function(){
			document.location.href = GDATA[galleryDisplayed]['images'][currentImage]['imageremoteurl'];
		}
        
        //Modify address bar
        if(photoalbumpageViewport && photoalbumpageViewport.style.display == 'flex'){
            window.history.pushState(null, '', 'https://school9-nt.ru/#photoalbum/' + GDATA[galleryDisplayed]['name'] + '/' + GDATA[galleryDisplayed]['images'][currentImage]['id']);
        }
	}
	
	var scaleImage = function(imgw, imgh, agw, agh){
		//If image is to large, resize it
		if((imgw > agw) || (imgh > agh)){
			//Modify viewport size for UI elements
			agw = agw - 70;
			agh = agh - 60;
			
			//Calculate aspect ratios
			var asp_ratio_vp = agw / agh;
			var asp_ratio_img = imgw / imgh;
			
			//Compare aspect ratios
			if(asp_ratio_vp <= asp_ratio_img){
				imgw = agw;
				imgh = Math.floor(imgw / asp_ratio_img);
			} else {
				imgh = agh;
				imgw = Math.floor(imgh * asp_ratio_img);
			}
		}
		
		//Return new size
		return {
			width	:imgw,
			height	:imgh
		}
	}
    
    var ajaxRequest = function(body){
        if(AJAX_ENGINE.setRequest('https://school9-nt.ru', false)){
			var r_object = new Object;
			r_object = body;
			AJAX_ENGINE.Execute(r_object);
			
			if(AJAX_ENGINE.response['system_status'] == 'OK'){
				return AJAX_ENGINE.response;
			}
        }
        
		return false;
    }
    
    this.handleBodyResize = function(){
        if(!LOWRESLAYOUT && !theBackgroundMosaic_Loaded) loadTheBackgroundMosaic();
    }
}

//////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// DASHBOARD ////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

function s9dashboard(){
	this.dashMenu = new Object();
	
	var dashboardContainer = null;
	var slidecontent_place = null;
	var SLIDES = new Object();
	var slides_catlist = null;
	var catlist_PrevButton = null;
	var catlist_NextButton = null;
	var CATROTATE_SPEED = null;
	var SLIDESROTATE_SPEED = null;
	var STARTCAT_ID = null;
	var CATROTATION_ON = null;
	var CINT_ID = null;
	var SINT_ID = null;
	var INIT_COMPLETED = false;
    var ROTATING = false;
	var CURRENT_CATID = null;
	var CURRENT_SLIDEID = 0;
    var CURRENT_CLASSNAME = 'dashboard-navigation-active';
	var DASHBOARD_FX = null;
	
	dashboardContainer = fetch_object('dashboard-container');
    if(!dashboardContainer) return;
	
	//Get slides scheme
	//Define functions for ajax
	var onProgress = function(){
		dashboardContainer.innerHTML = '<div style="text-align: center; padding-top: 126px;"><img src="' + LOADING_ANIMATION.src + '" alt="" /></div>';
	}
	
	var onComplete = function(){
		if(this.response['system_status'] == 'OK'){
			//Get config values from ajax response
			STARTCAT_ID = this.response['config']['STARTCAT_ID'];
			CATROTATE_SPEED = parseInt(this.response['config']['CATROTATE_SPEED']);
			SLIDESROTATE_SPEED = parseInt(this.response['config']['SLIDESROTATE_SPEED']);
			CATROTATION_ON = this.response['config']['CATROTATION_ON'] == '1';
			
			//Get the slides scheme from ajax response
			SLIDES = this.response['slidescheme'];
			
			//Jump to final stage of init
			DASHBOARD.DashBoardInit_Complete();
		} else {
			dashboardContainer.innerHTML = '<span class="dasherror">Error loading dashboard</span>';
		}
	}
	
	var onError = function(){
		dashboardContainer.innerHTML = '<span class="dasherror">' + this.response['exeption'] + '</span>';
	}
	
	var onAbord = function(){
		dashboardContainer.innerHTML = '<span class="dasherror">' + this.response['exeption'] + '</span>';
	}
	
	var slides_raw = new s9ajax(onProgress, onComplete, onError, onAbord);
	if(slides_raw.state == 1){
		if(slides_raw.setRequest('https://school9-nt.ru', true)){
			var r_object = new Object;
			r_object['do'] = 'get_dashboardconfig';
			slides_raw.Execute(r_object);
		}
	}
	
	//Object methods
	this.DashBoardInit_Complete = function(){
		if(INIT_COMPLETED) return;
		
		//Dashboard HTML template
		dashboardContainer.innerHTML = '<nav id="dashboard-navigation-container"><ul id="dashboard-navigation"><li id="dashboard-navigation-hometab" class="dashboard-navigation-hometab"><svg version="1.1" id="dashboard-navigation-hometab_svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 38.1 39.2" enable-background="new 0 0 38.1 39.2" xml:space="preserve"><g><polygon class="svg-fill" points="9.9,1.3 4.9,1.3 4.9,11.3 9.9,6.2 	"/><path class="svg-fill" d="M37.5,17.8L20.3,0.5c-0.7-0.7-1.9-0.7-2.6,0L0.6,17.8c-0.8,0.8-0.8,2.1,0,2.9h0c0.8,0.8,2.2,0.8,3,0L17.4,6.9c0.4-0.4,0.9-0.6,1.5-0.6h0.2c0.6,0,1.1,0.2,1.5,0.6l13.9,13.7c0.8,0.7,2,0.9,2.8,0.3C38.3,20.2,38.4,18.7,37.5,17.8z"/><path class="svg-fill" d="M20.6,9.9c-0.4-0.4-0.9-0.6-1.5-0.6h-0.2c-0.5,0-1.1,0.2-1.5,0.6L4.6,22.5C4.2,22.9,4,23.4,4,24v13.1c0,1.2,0.9,2.1,2.1,2.1H13V24.3c0-1.2,0.9-2.1,2.1-2.1H23c1.2,0,2.1,0.9,2.1,2.1L25,39.2h6.9c1.2,0,2.1-0.9,2.1-2.1V24c0-0.6-0.2-1.1-0.6-1.5L20.6,9.9z"/><path class="svg-fill" d="M20.9,25.3h-3.6c-1.2,0-2.1,0.9-2.1,2.1v11.8H23V27.4C23,26.3,22,25.3,20.9,25.3z"/></g></svg></li><li id="dashboard-menu-item-2" class="dashboard-navigation-menuitem">Календарь</li><li id="dashboard-menu-item-3" class="dashboard-navigation-menuitem">Музей</li><li id="dashboard-menu-item-4" class="dashboard-navigation-menuitem">Опросы</li></ul></nav><div id="dashboard-slidecontent"></div><div id="dashboard-snlinks"><a href="https://vk.com/public197724540" title="VK" target="_blank"><img src="/files/content_related/dashboard/sni/vk.webp" alt="VK" /></a><a href="https://ok.ru/group/64276099236076" title="Одноклассники" target="_blank"><img src="/files/content_related/dashboard/sni/ok.webp" alt="Одноклассники" /></a></div><div id="dashboard-prevslide" style="display: none;">' + NAVIGATION_LEFTARROW + '</div><div id="dashboard-nextslide" style="display: none;">' + NAVIGATION_RIGHTARROW + '</div><div style="clear: both;"></div>';
		
		//Build menu scheme
		this.dashMenu = {
			"dmi-01" : fetch_object('dashboard-navigation-hometab'),
			"dmi-02" : fetch_object('dashboard-menu-item-2'),
			"dmi-03" : fetch_object('dashboard-menu-item-3'),
			"dmi-04" : fetch_object('dashboard-menu-item-4'),
		}
		
		//Get slidecontent container
		slidecontent_place = fetch_object('dashboard-slidecontent');
		
		//Init FX engine
		DASHBOARD_FX = new s9fx(slidecontent_place);
        DASHBOARD_FX.setAnimation('opacity', 0, 1, 0.05, null, null, true, 25);
		
		//Get slides menu container
		slides_catlist = fetch_object('dashboard-navigation-container');
		
		//Get Prev and Next buttons
		catlist_PrevButton = fetch_object('dashboard-prevslide');
		catlist_NextButton = fetch_object('dashboard-nextslide');
		
		//Assing events
		//Change display category on click
		for(dmi_item in this.dashMenu){
			this.dashMenu[dmi_item].onclick = function(){ menuitem_MakeCurrent(this); }
			this.dashMenu[dmi_item].onselectstart = this.dashMenu[dmi_item].onmousedown = function() { return false; }
		}
		
		//Dashboard must stop rotating when mouse hovers the slides
		dashboardContainer.onmouseover = function(){ StopRotation(); }
		
		//And start rotation when mouse moves out
		dashboardContainer.onmouseout = function(){ StartRotation(); }
		
		//Next and Prev buttons
		catlist_NextButton.onclick = function(){ catslides_Change(true); }
		catlist_PrevButton.onclick = function(){ catslides_Change(false); }
		
		//Disable text selection
		catlist_NextButton.onselectstart = catlist_NextButton.onmousedown = function(){ return false; }
		catlist_PrevButton.onselectstart = catlist_PrevButton.onmousedown = function(){ return false; }
		
		//Default item
		addClass(this.dashMenu[STARTCAT_ID], CURRENT_CLASSNAME);
		
		//Make start catid current catid
		CURRENT_CATID = STARTCAT_ID;
		
		//Display the first slide
		if(DASHBOARD_FX.animation_set){
			DASHBOARD_FX.renderFirstKeyframe();
			slidecontent_place.innerHTML = SLIDES[CURRENT_CATID][0];
			DASHBOARD_FX.animate('linear', 1);
		} else {
			slidecontent_place.innerHTML = SLIDES[CURRENT_CATID][0];
		}
		
		//Start rotation
        if(!LOWRESLAYOUT) StartRotation();
		
		//Set completed flag
		INIT_COMPLETED = true;
	}
    
    this.handleBodyResize = function(){
        if(!LOWRESLAYOUT && ROTATING) return;
        if(LOWRESLAYOUT && !ROTATING) return;
        
        if(!LOWRESLAYOUT) StartRotation(); else StopRotation();
    }
    
    var StartRotation = function(){
        if(SLIDES[CURRENT_CATID].length > 1){
			SINT_ID = setInterval(catslides_Change, SLIDESROTATE_SPEED);
			slides_catlist.style.display = 'block';
		}
        
        //Start rotation
		if(CATROTATION_ON){
			if(SLIDES[CURRENT_CATID].length > 1){
				CINT_ID = setTimeout(menuitem_MakeCurrent, SLIDESROTATE_SPEED * SLIDES[CURRENT_CATID].length);
			} else {
				CINT_ID = setTimeout(menuitem_MakeCurrent, CATROTATE_SPEED);
			}
		}
        
        catlist_PrevButton.style.display = "none";
        catlist_NextButton.style.display = "none";
        
        ROTATING = true;
    }
    
    var StopRotation = function(){
        if(CATROTATION_ON) clearInterval(CINT_ID);
        
        if(SLIDES[CURRENT_CATID].length > 1) {
            clearInterval(SINT_ID);
            catlist_PrevButton.style.display = "block";
            catlist_NextButton.style.display = "block";
        }
        
        ROTATING = false;
    }
	
	var menuitem_MakeCurrent = function(targetitem){
	  	//Fetch next catid
		var c_next = '';
		if(targetitem){
			for(var dmi_item in DASHBOARD.dashMenu){
				if(targetitem == DASHBOARD.dashMenu[dmi_item]) c_next = dmi_item;
			}
		} else {
			switch(CURRENT_CATID){
				case 'dmi-01': c_next = 'dmi-02'; break;
				case 'dmi-02': c_next = 'dmi-03'; break;
				case 'dmi-03': c_next = 'dmi-04'; break;
				case 'dmi-04': c_next = 'dmi-01'; break;
				default: break;
			}
		}
        
        for(var dmi_item in DASHBOARD.dashMenu){
			if(dmi_item != c_next) removeClass(DASHBOARD.dashMenu[dmi_item], CURRENT_CLASSNAME);
		}
		addClass(DASHBOARD.dashMenu[c_next], CURRENT_CLASSNAME);
		
		if(SLIDES[c_next].length > 1){
            //Reset sliderchange interval
			clearInterval(SINT_ID);
            
            //Make sure the CURRENT_SLIDEID is 0
			CURRENT_SLIDEID = 0;
			
			if(DASHBOARD_FX.animation_set){
				DASHBOARD_FX.renderFirstKeyframe();
				slidecontent_place.innerHTML = SLIDES[c_next][0];
				DASHBOARD_FX.animate('linear', 1);
			} else {
				slidecontent_place.innerHTML = SLIDES[c_next][0];
			}
			
			SINT_ID = setInterval(catslides_Change, SLIDESROTATE_SPEED);
			
			//Reset catchange interval
			if(CATROTATION_ON){
				clearTimeout(CINT_ID);
				CINT_ID = setTimeout(menuitem_MakeCurrent, SLIDESROTATE_SPEED * SLIDES[c_next].length);
			}
		} else {
			//Reset sliderchange interval
			clearInterval(SINT_ID);
            
            if(DASHBOARD_FX.animation_set){
				DASHBOARD_FX.renderFirstKeyframe();
				slidecontent_place.innerHTML = SLIDES[c_next][0];
				DASHBOARD_FX.animate('linear', 1);
			} else {
				slidecontent_place.innerHTML = SLIDES[c_next][0];
			}
			
			if(CATROTATION_ON){
				clearTimeout(CINT_ID);
				CINT_ID = setTimeout(menuitem_MakeCurrent, CATROTATE_SPEED);
			}
            
            catlist_PrevButton.style.display = "none";
            catlist_NextButton.style.display = "none";
		}
		
		CURRENT_CATID = c_next;
	}
	
	var catslides_Change = function(direction){
		direction = (typeof(direction) == 'undefined') ? true : direction;
		
		if(direction){
			CURRENT_SLIDEID++;
			if(CURRENT_SLIDEID > SLIDES[CURRENT_CATID].length - 1) CURRENT_SLIDEID = 0;
		} else {
			CURRENT_SLIDEID--;
			if(CURRENT_SLIDEID < 0) CURRENT_SLIDEID = SLIDES[CURRENT_CATID].length - 1;
		}
		
		if(DASHBOARD_FX.animation_set){
			DASHBOARD_FX.renderFirstKeyframe();
			slidecontent_place.innerHTML = SLIDES[CURRENT_CATID][CURRENT_SLIDEID];
			DASHBOARD_FX.animate('linear', 1);
		} else {
			slidecontent_place.innerHTML = SLIDES[CURRENT_CATID][CURRENT_SLIDEID];
		}
	}
}

//////////////////////////////////////////////////////////////////////////////////
///////////////////////// ANIMATIONS AND OTHER FX ////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

function s9fx(targetobject){
	if(!targetobject) return;
	
	var FXOBJECT = null;
	if(typeof(targetobject) == 'string'){
		FXOBJECT = fetch_object(targetobject);
		if(!FXOBJECT) return;
	} else if(typeof(targetobject) == 'object'){
		FXOBJECT = targetobject;
	} else return;
	
	var PROPERTY = null;
	var FROM_VALUE = null;
	var TO_VALUE = null;
	var CURRENT_VALUE = null;
	var VALUE_ANIMATE_STEP = null;
	var VALUE_TEXT_PREFIX = null;
	var VALUE_TEXT_POSTFIX = null;
	var isDFORWARD = true;
	var KEYFRAMES_DELAY = 40; //25 frames per second by default
	var ANIMATION_COUNT_CURRENT = null;
	
	var ANIMATING = false;
	var TIMERID = null;
	
	this.animation_set = false;
	
	var animation_count = null;
	
	/*Main method
	** property: string - CSS property to animate
	** v_from: float - Value to start from
	** v_to: float - Value to end with
	** v_units: string - Units of a value to animate ('px', '%', 'pt', etc...)
	** v_step: float - Animation step
	...
	** count: integer - Animation loop count (0 - infinite)
	*/
	this.setAnimation = function(property, v_from, v_to, v_step, v_text_prefix, v_text_postfix, v_direction, render_fps){
		if(ANIMATING) return;
		
		//Initiate
		if(!property || property == '' || typeof(property) != 'string') return;
		
		PROPERTY = property;
		FROM_VALUE = (v_from) ? v_from : 0;
		TO_VALUE = (v_to) ? v_to : 100;
		VALUE_ANIMATE_STEP = (v_step) ? v_step : 10;
		isDFORWARD = (typeof(v_direction) !== 'undefined') ? v_direction : isDFORWARD;
		var c_delay = Math.floor(1000 / render_fps);
		KEYFRAMES_DELAY = (c_delay < 1) ? KEYFRAMES_DELAY : c_delay;
		VALUE_TEXT_PREFIX = v_text_prefix;
		VALUE_TEXT_POSTFIX = v_text_postfix;
		
		this.animation_set = true;
	}
	
	this.renderFirstKeyframe = function(){
		if(!this.animation_set) return;
		
		FXOBJECT.style[PROPERTY] = VALUE_TEXT_PREFIX + FROM_VALUE + VALUE_TEXT_POSTFIX;
		ANIMATION_COUNT_CURRENT = 1;
	}
	
	this.animate = function(fxtype, count){
		if(!this.animation_set) return;
		
		animation_count = (!count || count < 0) ? 1 : count;
		
		//Select FX type
		switch(fxtype){
			//Linear function
			case 'linear':
				ANIMATING = true;
				CURRENT_VALUE = FROM_VALUE;
				TIMERID = setInterval(RENDER_LINEAR, KEYFRAMES_DELAY);
				break;
			default: break;
		}
	}
	
	var RENDER_LINEAR = function(){
		FXOBJECT.style[PROPERTY] = VALUE_TEXT_PREFIX + CURRENT_VALUE + VALUE_TEXT_POSTFIX;
		
		if(CURRENT_VALUE == TO_VALUE){
			if((animation_count == 0) || (ANIMATION_COUNT_CURRENT != animation_count)){
				CURRENT_VALUE = FROM_VALUE;
				ANIMATION_COUNT_CURRENT++;
			} else {
				clearInterval(TIMERID);
				ANIMATING = false;
			}
		} else {
			if(isDFORWARD) {
				CURRENT_VALUE += VALUE_ANIMATE_STEP;
				if(CURRENT_VALUE > TO_VALUE) CURRENT_VALUE = TO_VALUE;
			} else {
				CURRENT_VALUE -= VALUE_ANIMATE_STEP;
				if(CURRENT_VALUE < TO_VALUE) CURRENT_VALUE = TO_VALUE
			}
		}
	}
	
}