$.currentFragment = 0;
$.changeUrlWithFragment = true;
$.changeFragment = function(index, view, element) {
	$.currentFragment = index;
	$('.fragment').removeClass('visible');
	$('[data-fragment-order='+$.currentFragment+']').addClass('visible').scrollTop(0);
	$('.navbar-back').toggleClass('visible', $.currentFragment !== 0);

	if ($.changeUrlWithFragment && window.history.pushState) {
		var params = $.unparam();
		params.fragment = index;
		if (view) {
			params.view = view;
		} else if (params.view) {
			delete params.view;
		}

		var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + $.param(params);
		window.history.pushState({ path: newurl }, '', newurl);
	}

	if (view !== undefined || element !== undefined) {
		$(document).trigger('viewChanged', [index, view, element]);
	}
};
$.unparam = function() {
	var search = location.search.substring(1);
	try {
		return JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
	} catch (e) {
		return {};
	}
};

$.fn.extend({
	'changeFragment': function(index) {
		$.changeFragment(index, this.data('view'), this);
	},
	'fragmentLink': function() {
		this.on('click', function() {
			var $this = $(this);
			$this.changeFragment($this.data('change-fragment'));
			return false;
		});
	}
});

$(function() {
	function getParameter(name) {
		name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
		var regex = new RegExp('[\\?&]'+name+'=([^&#]*)'),
			results = regex.exec(location.search);
		return results === null ? undefined : decodeURIComponent(results[1].replace(/\+/g, " "));
	}

	$('[data-change-fragment]').fragmentLink();
	$('.navbar-back').on('click', function() {
		$.changeFragment($.currentFragment - 1);
		return false;
	});

	var params = $.unparam();
	console.log(params);
	if (params.fragment) {
		$.changeFragment(Number(params.fragment), params.view);
	} else {
		$.changeFragment(Number($('.fragment.visible').first().data('fragment-order')) || 0);
	}
});
