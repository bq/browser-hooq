/*
 * Browser detect
 */
'use strict';

var browserHooq;

browserHooq = (function() {
    var _ua, _appversion;
        _ua         = navigator.userAgent || window.navigator.userAgent,
        _appversion = navigator.appVersion || window.navigator.appVersion;

    function browserHooq(condition) {
        this.ie      = condition.ie     !== null ? condition.ie : false;
        this.chrome  = condition.chrome !== null ? condition.chrome : false;
        this.firefox = condition.chrome !== null ? condition.firefox : false;
        this.safari  = condition.safari !== null ? condition.safari : false;
        this.opera   = condition.opera  !== null ? condition.opera : false;
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

    browserHooq.prototype.getOS = function() {
        return this.isWindows() ? 'windows' : this.isLinux() ? 'linux' : this.isMac() ? 'mac' : false;
    };

    browserHooq.prototype.isIE = function() {
        var version = false,
            browser = false,
            os = this.getOS();

        // Comprobamos si el navegador es Internet Explorer
        browser = '-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style;
        browser = !browser && /*@cc_on!@*/false ? true : browser;

        if(!browser) {
            return {
                browser: false,
                version: false,
                os : os
            };
        }

        // En caso de ser Internet Explorer, obtenemos su versión
        version = new RegExp('MSIE ([0-9]{1,}[\.0-9]{0,})').exec( _ua );
        version = !version ? new RegExp('Trident/.*rv:([0-9]{1,}[\.0-9]{0,})').exec( _ua ) : version;
        if ( version !== null ) {
            browser = 'ie';
            version = parseFloat( RegExp.$1 );
        }

        return {
            browser: browser,
            version: version,
            os : os
        };
    };

    browserHooq.prototype.isChrome = function() {
        var os = this.getOS();

        if( !( !! window.chrome && !! window.chrome.webstore ) ) {
            return {
                browser: false,
                version: false,
                os : os
            };
        }

        return {
            browser: 'chrome',
            version: parseInt(_appversion.match(/chrome\/(\d+)\./i)[1], 10),
            os : os
        };
    };

    browserHooq.prototype.isFF = function() {
        var os = this.getOS();

        if( !( 'MozAppearance' in document.documentElement.style ) ) {
            return {
                browser: false,
                version: false,
                os : os
            };
        }

        return {
            browser: 'firefox',
            version: parseInt(_ua.match(/firefox\/(\d+(\.\d+)?)/i)[1], 10),
            os : os
        };
    };

    browserHooq.prototype.isOpera = function() {
        var os = this.getOS();

        if( !( !!window.opera || /opera|opr/i.test(navigator.userAgent) ) ) {
            return {
                browser: false,
                version: false,
                os : os
            };
        }

        return {
            browser: 'opera',
            version: parseInt(_ua.match(/opera\/(\d+(\.\d+)?)/i)[1], 10),
            os : os
        };
    };

    browserHooq.prototype.isSafari = function() {
        var os = this.getOS();

        if( !( /constructor/i.test(window.HTMLElement) ) ) {
            return {
                browser: false,
                version: false,
                os : os
            };
        }

        return {
            browser: 'safari',
            version: parseInt(_ua.match(/version\/(\d+(\.\d+)?)/i)[1], 10),
            os : os
        };
    };

    return browserHooq;
})();
