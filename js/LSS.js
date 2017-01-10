// JavaScript Document
(function() {
    if (!window.LSS) { window['LSS'] = {} }

    //window['LSS']['W3CEvent']

    function $(_id) {
        return document.getElementById(_id)
    }
    window['LSS']['$'] = $;

    function getElementsByClassName(className, tag, parent) {
        parent = parent || document;
		if(tag == null){tag = "*";}
        if (!parent) { return false; }

        var allTags = (tag == "*" && parent.all) ? parent.all : parent.getElementsByTagName(tag);
        var matchingElements = new Array();

        className = className.replace(/\-/g, "\\-");
        var regex = new RegExp("(^|\\s)" + className + "(\\s|$)");

        var element;

        for (var i = 0; i < allTags.length; i++) {
            element = allTags[i];
            if (regex.test(element.className)) {
                matchingElements.push(element);
            }
        }

        return matchingElements;
    }
    window['LSS']['getElementsByClassName'] = getElementsByClassName;

    function addEvent(node, type, listener) {
        if (!node) { return false; }
        if (node.addEventListener) {
            node.addEventListener(type, listener, false);
            return true;
        } else if (node.attachEvent) {
            //listener = bindFunction(node,listener);
            node.attachEvent('on' + type, listener);
            return true;
        }
        return false;
    }
    window['LSS']['addEvent'] = addEvent;

    function bindFunction(obj, func) {
        return function() {
            func.apply(obj, arguments);
        }
    }
    window['LSS']['bindFunction'] = bindFunction;

    function removeEvent(node, type, listener) {
        if (!node) { return false; }
        if (node.removeEventListener) {
            node.removeEventListener(type, listener, false);
            return true;
        } else if (node.detachEvent) {
            node.detachEvent('on' + type, listener);
            return true;
        }
        return false;
    }
    window['LSS']['removeEvent'] = removeEvent;

    function createRandam() {
        return parseInt(Math.random() * 900 + 99);
    }

    function createNewHandle(_htype) {
        var _handle = "";
        switch (_htype) {
            case ("window"): { _handle = '11'; break; }
            case ("msgbox"): { _handle = '12'; break; }
            case ("select"): { _handle = '21'; break; }
			default:{_handle = '00'; break;}
        }

        var _rand = createRandam();
        while (null != document.getElementById(_handle.toString() + _rand.toString())) {
            _rand = createRandam();
        }

        return _handle + _rand.toString();
    }
    window['LSS']['createNewHandle'] = createNewHandle;

    function getCurrentStyle(obj, cssproperty, csspropertyNS) {
        if (obj.style[cssproperty]) {
            return obj.style[cssproperty];
        }
        if (obj.currentStyle) {// IE5+  
            return obj.currentStyle[cssproperty];
        } else if (document.defaultView.getComputedStyle(obj, null)) {// FF/Mozilla  
            var currentStyle = document.defaultView.getComputedStyle(obj, null);
            var value = currentStyle.getPropertyValue(csspropertyNS);
            if (!value) {//try this method  
                value = currentStyle[cssproperty];
            }
            return value;
        } else if (window.getComputedStyle) {// NS6+  
            var currentStyle = window.getComputedStyle(obj, "");
            return currentStyle.getPropertyValue(csspropertyNS);
        }
    }

    window['LSS']['getCurrentStyle'] = getCurrentStyle;

    function _getElementLeft(element) {
        var actualLeft = element.offsetLeft;
        var current = element.offsetParent;
        while (current !== null) {
            actualLeft += current.offsetLeft;
            current = current.offsetParent;
        }
        return actualLeft;
    }
    function _getElementTop(element) {
        var actualTop = element.offsetTop;
        var current = element.offsetParent;
        while (current !== null) {
            actualTop += current.offsetTop;
            current = current.offsetParent;
        }
        return actualTop;
    }

    window['LSS']['getLeft'] = _getElementLeft;
    window['LSS']['getTop'] = _getElementTop;

    //ajax
    if (!window.LSS.ajax) { window['LSS']['ajax'] = {} }

    //Global Variables
    var _AJAX_TASK_QUEUE = new Array();   // events queue
    var _AJAX_XMLHTTP;                // xmlhttprequest obj

    function __createXMLHttpRequest() {
        if (window.ActiveXObject) {
            return new ActiveXObject("Microsoft.XMLHTTP");
        }
        else if (window.XMLHttpRequest) {
            return new XMLHttpRequest();
        }
    }

    function __doSearch(_url) {
        _AJAX_XMLHTTP = __createXMLHttpRequest();
        _AJAX_XMLHTTP.onreadystatechange = __handleStateChange;
        _AJAX_XMLHTTP.open("POST", _url, true);
        _AJAX_XMLHTTP.send(null);
    }

    function __handleStateChange() {
        if (_AJAX_XMLHTTP.readyState == 4) {
            if (_AJAX_XMLHTTP.status == 200) {
                var _event = _AJAX_TASK_QUEUE.shift();
                if (_AJAX_XMLHTTP.responseText != "nothing") {
                    eval(_event[1] + "(\"" + _AJAX_XMLHTTP.responseText + "\")");
                }

                if (_AJAX_TASK_QUEUE.length > 0) {
                    doSearch(_AJAX_TASK_QUEUE[0][0]);
                }
            }
            else {
                //do someting when met a exception
                if (typeof (LSS.ajax.statusEx) == 'function') {
                    var _event = _AJAX_TASK_QUEUE.shift();
                    LSS.ajax.statusEx({ 'status': _AJAX_XMLHTTP.status, 'callback': _event[1] });
                }
            }
        }
        else {
            //do someting when met a exception
        }


    }

    function _addEvent(_url, _func) {
        var _event = new Array(2);
        _event[0] = _url;
        _event[1] = _func;
        _AJAX_TASK_QUEUE.push(_event);

        if (_AJAX_TASK_QUEUE.length == 1) {
            __doSearch(_event[0]);
        }
    }


    window['LSS']['ajax']['addEvent'] = _addEvent;
    window['LSS']['ajax']['statusEx'] = null;

    function _getLocalTime() {
        var _date = new Date();
        var d = new Date(Date.parse(_date.toString()) + 28800000);
        var h = d.getHours();
        var m = d.getMinutes();
        var s = d.getSeconds();

        LSS.$("div_datetime").innerHTML = (d.getMonth() + 1) + "月" + d.getDate() + "日&nbsp;" + (h > 9 ? h : "" + h) + "时" + (m > 9 ? m : "" + m) + "分";
    }
    window['LSS']['getLocaltime'] = _getLocalTime;

    /************************/
    /**       <web>        **/
    /************************/
    if (!window.LSS.web) { window['LSS']['web'] = {} }
    window['LSS']['web']['request'] = {
        QueryString: function(val) {
            var uri = window.location.search;
            var re = new RegExp("" + val + "\=([^\&\?]*)", "ig");
            var oMaths = uri.match(re);
            if (oMaths == null)
                return null;
            if (oMaths.length == 0)
                return null;
            return oMaths[0].substr(val.length + 1);
        },
        QueryStrings: function() {
            var uri = window.location.search;
            var re = /\w*\=([^\&\?]*)/ig;
            var retval = [];
            while ((arr = re.exec(uri)) != null)
                retval.push(arr[0]);
            return retval;
        },
        setQuery: function(val1, val2) {
            var a = this.QueryStrings();
            var retval = "";
            var seted = false;
            var re = new RegExp("^" + val1 + "\=([^\&\?]*)$", "ig");
            for (var i = 0; i < a.length; i++) {
                if (re.test(a[i])) {
                    seted = true;
                    a[i] = val1 + "=" + val2;
                }
            }
            retval = a.join("&");
            return "?" + retval + (seted ? "" : (retval ? "&" : "") + val1 + "=" + val2);
        }
    }
    
    //取虚拟目录名
    window['LSS']['web']['getRootPath'] = function() {
        var pathName = window.location.pathname.substring(1);
        var webName = pathName == '' ? '' : pathName.substring(0, pathName.indexOf('/'));
        return window.location.protocol + '//' + window.location.host + '/' + webName + '/';
    }

    /************************/
    /**      </web>        **/
    /************************/
})();

