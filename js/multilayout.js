/* jQuery UI */
var multilayout = {};

if (!$.ui) {
	multilayout.focusable = function focusable(element, isTabIndexNotNaN) {
		var map, mapName, img,
			nodeName = element.nodeName.toLowerCase();
		if (nodeName === 'area') {
			map = element.parentNode;
			mapName = map.name;
			if (!element.href || !mapName || map.nodeName.toLowerCase() !== 'map') {
				return false;
			}
			img = $("img[usemap='#" + mapName + "']")[ 0 ];
			return !!img && multilayout.visible(img);
		}
		return (/input|select|textarea|button|object/.test(nodeName) ?
			!element.disabled :
			'a' === nodeName ?
				element.href || isTabIndexNotNaN :
				isTabIndexNotNaN) &&
			// the element and all of its ancestors must be visible
			multilayout.visible(element);
	};


	multilayout.visible = function visible(element) {
		return $.expr.filters.visible(element) &&
			!$(element).parents().addBack().filter(function() {
				return $.css(this, "visibility") === "hidden";
			}).length;
	};

	$.extend($.expr[ ":" ], {
		focusable: function(element) {
			return multilayout.focusable(element, !isNaN($.attr(element, 'tabindex')));
		}
	});
}

$.currentFragment = 0;
$.changeUrlWithFragment = true;
$.changeFragment = function(index, view, element) {
	$.currentFragment = index;
	$('.fragment').removeClass('visible');
	var $fragment = $('[data-fragment-order='+$.currentFragment+']');
	$fragment.addClass('visible').scrollTop(0);

	var $focusable = $fragment.find('.active:not(tr):focusable, .active:not(tr) :focusable');
	if ($focusable.length > 0) {
		$focusable.first().focus();
	} else {
		$fragment.find(':focusable').first().focus();
	}

	$('.navbar-back').toggleClass('visible', $.currentFragment !== 0);

	if ($.changeUrlWithFragment && window.history.pushState) {
		var params = $.unparam();
		params.fragment = index;
		if (view) {
			params['fragment-view'] = view;
		} else if (params['fragment-view']) {
			delete params['fragment-view'];
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
		$.changeFragment(index, this.data('fragment-view'), this);
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
	if (params.fragment) {
		$.changeFragment(Number(params.fragment), params.view);
	} else {
		$.changeFragment(Number($('.fragment.visible').first().data('fragment-order')) || 0);
	}
});
