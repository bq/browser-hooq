/*
 * Browser detect
 */
'use strict';

var browserHooq;

browserHooq = (function() {
    var _ua, _appversion, _emptyObject;
    _ua         = navigator.userAgent || window.navigator.userAgent,
    _appversion = navigator.appVersion || window.navigator.appVersion;
    _emptyObject = {
        browser: false,
        version: false,
        os : false
    };

    function browserHooq(condition) {
        this.ie      = condition.ie      !== null ? condition.ie : false;
        this.chrome  = condition.chrome  !== null ? condition.chrome : false;
        this.firefox = condition.firefox !== null ? condition.firefox : false;
        this.safari  = condition.safari  !== null ? condition.safari : false;
        this.opera   = condition.opera   !== null ? condition.opera : false;
    }

    browserHooq.prototype.render = function(tagId, callback) {
        var wrapper = void 0;
        if( wrapper = document.getElementById(tagId) ) {
            wrapper.style.display = 'block';
        }
        else {
            wrapper = document.createElement('DIV');
            wrapper.id = 'browserhooq';
            wrapper.className = 'modal';
            wrapper.innerHTML = browserHooqTmpl;

            callback.call();

            document.body.insertBefore(wrapper, document.body.firstChild);
        }

        return true;
    };

    browserHooq.prototype.supported = function() {
        var ie      = this.isIE();
        var safari  = this.isSafari();
        var firefox = this.isFF();
        var chrome  = this.isChrome();
        var opera   = this.isOpera();

        if( ie.browser ) {
            document.documentElement.className += 'ie'+ie.version;
            if( this.ie && ie.version === this.ie ) {
                return ie;
            }
        }

        if( this.safari && safari.browser && safari.version >= this.safari ) {
            return safari;
        }

        if( this.chrome && chrome.browser && chrome.version >= this.chrome ) {
            return chrome;
        }

        if( this.firefox && firefox.browser && firefox.version >= this.firefox ) {
            return firefox;
        }

        if( this.opera && opera.browser && opera.version >= this.opera ) {
            return opera;
        }

        return false;
    };

    browserHooq.prototype.current = function() {
        var ie      = this.isIE();
        var safari  = this.isSafari();
        var firefox = this.isFF();
        var chrome  = this.isChrome();
        var opera   = this.isOpera();

        if( ie.browser ) {
            return ie;
        }

        if( safari.browser ) {
            return safari;
        }

        if( chrome.browser ) {
            return chrome;
        }

        if(  firefox.browser ) {
            return firefox;
        }

        if( this.opera && opera.browser ) {
            return opera;
        }
    };

    browserHooq.prototype.isWindows = function() {
        return new RegExp('Win', 'i').test( _ua );
    };

    browserHooq.prototype.isLinux = function() {
        return new RegExp('Linux', 'i').test( _ua );
    };

    browserHooq.prototype.isMac = function() {
        return new RegExp('Mac OS', 'i').test( _ua );
    };

    browserHooq.prototype.isAndroid = function() {
        return new RegExp('android', 'i').test( _ua );
    };

    browserHooq.prototype.isiOS = function() {
        var iPhone = new RegExp('iphone', 'i').test( _ua );
        var iPad   = new RegExp('ipad', 'i').test( _ua );
        return ( iPhone || iPad );
    };

    browserHooq.prototype.isWPhone = function() {
        var windowsPhone = new RegExp('windows phone', 'i').test( _ua );
        var windowsTouch = new RegExp('msie.*touch', 'i').test( _ua );
        return ( windowsPhone || windowsTouch );
    };

    browserHooq.prototype.getOS = function() {
        if( this.isWindows() ) {
            return 'windows';
        }

        if( this.isLinux() ) {
            return 'linux';
        }

        if( this.isMac() ) {
            return 'mac';
        }

        if( this.isAndroid() ) {
            return 'android';
        }

        if( this.isiOS() ) {
            return 'ios';
        }

        if( this.isWPhone() ) {
            return 'wphone';
        }

        return false;
    };

    browserHooq.prototype.isIE = function() {
        var version = void 0,
            browser;

        // Comprobamos si el navegador es Internet Explorer
        browser = '-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style;
        browser = !browser && /*@cc_on!@*/false ? true : browser;

        if( !browser ) {
            return _emptyObject;
        }

        // En caso de ser Internet Explorer, obtenemos su versión
        version = new RegExp('MSIE ([0-9]{1,}[\.0-9]{0,})').exec( _ua );
        version = !version ? new RegExp('Trident/.*rv:([0-9]{1,}[\.0-9]{0,})').exec( _ua ) : version;
        if ( !version ) {
            return _emptyObject;
        }

        return {
            browser : 'ie',
            version : parseFloat( RegExp.$1 ),
            os      : this.getOS()
        };
    };

    browserHooq.prototype.isChrome = function() {
        var version = void 0;

        if( !( !! window.chrome && !! window.chrome.webstore ) ) {
            return _emptyObject;
        }

        version = _appversion.match(/chrome\/(\d+)\./i);

        if( !version ) {
            return _emptyObject;
        }

        return {
            browser : 'chrome',
            version : parseInt( version[1], 10 ),
            os      : this.getOS()
        };
    };

    browserHooq.prototype.isFF = function() {
        var version = void 0;

        if( !( 'MozAppearance' in document.documentElement.style ) ) {
            return _emptyObject;
        }

        version = _ua.match(/firefox\/(\d+(\.\d+)?)/i);

        if( !version ) {
            return _emptyObject;
        }

        return {
            browser : 'firefox',
            version : parseInt( version[1], 10 ),
            os      : this.getOS()
        };
    };

    browserHooq.prototype.isOpera = function() {
        var version = void 0;

        if( !( !!window.opera || /opera|opr/i.test(navigator.userAgent) ) ) {
            return _emptyObject;
        }

        version = _ua.match(/opera\/(\d+(\.\d+)?)/i);

        if( !version ) {
            return _emptyObject;
        }

        return {
            browser : 'opera',
            version : parseInt( version[1], 10 ),
            os      : this.getOS()
        };
    };

    browserHooq.prototype.isSafari = function() {
        var version = void 0;

        if( !( /constructor/i.test(window.HTMLElement) ) ) {
            return _emptyObject;
        }

        version = _ua.match(/version\/(\d+(\.\d+)?)/i);

        if( !version ) {
            return _emptyObject;
        }

        return {
            browser : 'safari',
            version : parseInt( version[1], 10 ),
            os      : this.getOS()
        };
    };

    return browserHooq;
})();
