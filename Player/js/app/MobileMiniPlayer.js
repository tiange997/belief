/**
 * Copyright 2014, Honkytonk Films
 * Licensed under GNU GPL
 * http://www.klynt.net
 * */

(function (klynt) {
	klynt.getModule('mobileMiniPlayer').expose(init);
	
	var playButton = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg"' +
        'x="0px" y="0px" width="10px" height="17px" viewBox="-0.33 -0.672 45 73"' +
        'overflow="visible" enable-background="new -0.33 -0.672 45 73" xml:space="preserve">' +
        '<polygon class="miniplayer-button-color" stroke-width="4" stroke-linejoin="round" stroke-miterlimit="10" points="2,69.99 2,2 42.667,35.996 "/>' +
        '</svg>';

	var downloadButton = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"' +
		'viewBox="0 0 38 38" width="100%" height="100%" style="enable-background:new 0 0 38 38;" xml:space="preserve">' +
		'<path style="fill:#fff;" d="M18.208,25.333L9.5,14.25h4.75V1.583h9.5V14.25h4.75l-8.708,11.083H18.208z M0,20.583L4.75,9.5' +
		'h5.938v3.167H7.125l-3.167,7.917h7.917c0,3.935,3.19,7.125,7.125,7.125s7.125-3.19,7.125-7.125h7.917l-3.167-7.917h-3.562V9.5' +
		'h5.938L38,20.583v15.833H0V20.583z"/>' +
		'</svg>';

	function init() {
		$('body').append(
			'<div class="mobile-miniplayer">' +
			'	<div class="mobile-miniplayer-poster"></div>' +
			'	<div class="mobile-miniplayer-button mobile-miniplayer-download-button">' +
			'		<div class="mobile-miniplayer-button-icon">' + downloadButton + '</div>' +
			'		<div class="mobile-miniplayer-button-text"><span>' + (klynt.miniPlayerData.downloadAppWording || 'Download App') + '</span></div>' +
			'	</div>' +
			'	<div class="mobile-miniplayer-button mobile-miniplayer-launch-button">' +
			'		<div class="mobile-miniplayer-button-icon">' + playButton + '</div>' +
			'		<div class="mobile-miniplayer-button-text">' +
			'			<span>' + (klynt.miniPlayerData.launchAppWording || 'Then Launch Project') + '</span>' +
			'		</div>' +
			'	</div>' +
			'</div>'
		);
		
		$('.mobile-miniplayer-poster').css('background-image', 'url(' + klynt.miniPlayerData.thumbnail + ')');
		$('.mobile-miniplayer-download-button').click(launchStore);
		$('.mobile-miniplayer-launch-button').click(launchApp);

		klynt.analytics.trackPageView('mobileminiplayer');
	}

	function launchStore() {
		var appId = klynt.miniPlayerData.iOSAppId || 'id982539855';
		window.top.location.href = 'http://itunes.apple.com/app/' + appId;
	}

	function launchApp() {
		var urlScheme = klynt.miniPlayerData.iOSURLScheme || 'klynt';
		window.top.location.href = urlScheme + '://open?' + localURL();
	}

	function localURL() {
	    var url = document.location.origin + document.location.pathname;
	    url = url.substring(0, url.lastIndexOf("/") + 1) + 'index.html';
	    return url;
    }
})(window.klynt);