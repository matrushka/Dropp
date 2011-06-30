/*
 * Dropp
 * http://github.com/matrushka/Dropp
 * @requires jQuery v1.3 or later
 * 
 * Dropp is a jQuery plugin which replaces regular droprown menus ( <select> elements ) with stylable alternatives.
 *
 * 2010 - Baris Gumustas
 */
(function ($) {
	// variables for key caches
	window.dropp_key_cache = {};
	window.dropp_key_cache.cache = '';
	window.dropp_key_cache.timeout = null;
	
	function clearDropDowns() {
		var visible_list, visible_list_data;
		visible_list = $('.dropp ul:visible');
		if (visible_list.length > 0) {
			visible_list.hide();
			visible_list_data = visible_list.closest('.dropp').data('dropp');
			if (typeof visible_list_data !== 'undefined') {
				visible_list.removeClass(visible_list_data.settings.class_active_dropdown);
			}
		}
	}
	
	$('.dropp').live('click', function (event) {
		event.stopPropagation();
	});
	
	$('.dropp ul li a').live('mouseover', function () {
		$(this).closest('ul').find('a').removeClass('hover');
		$(this).addClass('hover');
	});
		
	$(document).bind('keypress', function (event) {
		if (event.keyCode === 27) {
			event.preventDefault();
			clearDropDowns();
		}
	});
	
	$(document).click(function () {
		clearDropDowns();
	});
	
	$.fn.dropp = function (user_settings) {
		var settings = {
			'phrase_on_multiple'          : false,
			'class_dropdown_wrapper'      : 'dropdown_wrapper',
			'class_dropdown_list'         : 'dropdown_list',
			'class_visible_dropdown'      : 'dropdown',
			'class_option_selected'       : 'selected',
			'class_active_dropdown'       : 'active',
			'substract_list_border_width' : true,
			'keyboard_support'            : true
		};
		
		if (user_settings) {
			$.extend(settings, user_settings);
		}
		
		return this.each(function () {
			// Start of loop
			var select, dropdown, list, values, list_width, widest_element, wrapper, select_class, list_of_contents;
			list_of_contents = [];
			widest_element = null;
			
			select = $(this);
			// Write settings to data to read later for global events
			select.data('dropp', {
				settings: settings
			});
			select.hide();
			select.wrap('<div></div>');
			select_class = select.attr('class');
			if (typeof (select_class) === 'undefined') {
				select_class = null;
			}
			select.parent().attr('class', select_class).addClass(settings.class_dropdown_wrapper).addClass('dropp');

			dropdown = $('<a href="#"/>').addClass(settings.class_visible_dropdown).appendTo(select.parent());
			list = $('<ul/>').addClass(settings.class_dropdown_list).addClass('dropp_dropdown_list').hide().appendTo(select.parent());
			wrapper = list.closest('.' + settings.class_dropdown_wrapper);
			
			list.css('position', 'absolute').css('z-index', '9999');
			
			select.find('option').each(function () {
				var item, list, list_item, link;
				item = $(this);
				list_of_contents.push(item.text().toLowerCase());
				list = item.closest('.' + settings.class_dropdown_wrapper).find('ul.dropp_dropdown_list');
				list_item = $('<li/>').appendTo(list);
				link = $('<a href="#"/>').text(item.text());
				
				link.data('option', item);
				list_item.append(link);
				item.data('replacement', link);
				
				if (typeof select.attr('multiple') !== undefined && (select.attr('multiple') === true || select.attr('multiple') === 'multiple')) {
					if (typeof item.attr('selected') !== undefined && (item.attr('selected') === true || item.attr('selected') === 'selected')) {
						link.addClass(settings.class_option_selected);
					}
				}
				
				// Select Event Listener
				link.bind('select', function (event, trigger_drowndown) {
					event.preventDefault();
					var link, item, select, dropdown, values;
					link = $(this);
					item = link.data('option');
					select = wrapper.find('select');
					dropdown = wrapper.find('.' + settings.class_visible_dropdown);
					
					if (typeof select.attr('multiple') === 'undefined' || select.attr('multiple') === false) {
						select.find('option:selected').removeAttr('selected');
						dropdown.text($(this).text());
						item.attr('selected', 'selected');
						list.hide();
						dropdown.removeClass(settings.class_active_dropdown);
					} else {
						if (typeof item.attr('selected') === 'undefined' || item.attr('selected') === false) {
							item.attr('selected', 'selected');
							link.addClass(settings.class_option_selected);
						} else {
							item.removeAttr('selected');
							link.removeClass(settings.class_option_selected);
						}
						
						values = [];
						select.find('option:selected').each(function () {
							values.push($(this).text());
						});
						
						if (values.length === 0) {
							if (typeof select.attr('placeholder') !== 'undefined') {
								dropdown.text(select.attr('placeholder'));
							} else {
								dropdown.html('&nbsp;');
							}
						} else {
							if (values.length > 1 && settings.phrase_on_multiple) {
								dropdown.text(settings.phrase_on_multiple);
							} else {
								dropdown.text(values.join(', '));
							}
						}
					}

					if (trigger_drowndown) {
						select.trigger('change');
					}
				});
				// Click Event
				link.click(function () {
					$(this).trigger('select', [true]);
					return false;
				});
			});
			if (settings.keyboard_support) {
				dropdown.bind('keypress', function (event) {
					var is_scrollable, character, found_index, cursor_pattern, found_item, option_index;
					event.preventDefault();
					clearTimeout(window.dropp_key_cache.timeout);
					switch (event.keyCode) {
					case 38:
						// up
						found_item = list.find('a.hover').closest('li').prev('li');
						if (found_item.length > 0) {
							list.find('a.hover').removeClass('hover');
							found_item.find('a').addClass('hover');
							found_item.closest('ul').get(0).scrollTop = found_item.closest('li').get(0).offsetTop;
						}
						break;
					case 40:
						// down
						found_item = list.find('a.hover').closest('li').next('li');
						if (found_item.length === 0 && list.find('a.hover').length === 0) {
							found_item = list.find('li:eq(0)');
						}
						if (found_item.length > 0) {
							list.find('a.hover').removeClass('hover');
							found_item.find('a').addClass('hover');
							found_item.closest('ul').get(0).scrollTop = found_item.closest('li').get(0).offsetTop;
						}
						break;
					case 13:
						// select
						list.find('a.hover').trigger('select');
						break;
					default:
						character = String.fromCharCode(event.which);
						window.dropp_key_cache.cache += character;

						found_index = null;
						for (option_index = 0; option_index < list_of_contents.length; option_index += 1) {
							cursor_pattern = new RegExp(window.dropp_key_cache.cache.toLowerCase());
							if (cursor_pattern.test(list_of_contents[option_index])) {
								found_index = option_index;
								break;
							}
						}

						if (found_index !== null) {
							found_item = list.find('li:eq(' + found_index.toString() + ') a');
							is_scrollable = list.get(0).scrollHeight > list.height();
							if (is_scrollable) {
								found_item.closest('ul').get(0).scrollTop = found_item.closest('li').get(0).offsetTop;
							}

							list.find('li a.hover').removeClass('hover');
							found_item.addClass('hover');
						}
						break;
					}
				
					window.dropp_key_cache.timeout = setTimeout(function () {
						window.dropp_key_cache.cache = '';
					}, 400);
					return false;
				});
			}
			
			// Each loop ends here
			if (select.find('option:selected').length === 0) {
				if (typeof select.attr('placeholder') !== 'undefined') {
					dropdown.text(select.attr('placeholder'));
				} else {
					dropdown.html('&nbsp;');
				}
			} else {
				if (typeof select.attr('multiple') !== undefined && (select.attr('multiple') === true || select.attr('multiple') === 'multiple')) {
					values = [];
					select.find('option:selected').each(function () {
						values.push($(this).text());
					});
					dropdown.html(values.join(', '));
				} else {
					dropdown.text($(this).find('option:selected').text());
				}
			}
			
			dropdown.click(function () {
				var list_data;
				if (list.is(':visible')) {
					list.hide();
					dropdown.removeClass(settings.class_active_dropdown);
					$('ul.dropp_dropdown_list').hide();
				} else {
					$('ul.dropp_dropdown_list').hide();
					list.show();
					dropdown.addClass(settings.class_active_dropdown);
					
					// manage dropdown width
					// check the cached width
					list_data = select.data('dropp');
					if (list_data.cached_width !== dropdown.outerWidth() ) {
						list_width = dropdown.outerWidth();
						if (settings.substract_list_border_width) {
							list_width -= (parseInt(list.css('borderLeftWidth'), 10) + parseInt(list.css('borderRightWidth'), 10));
						}
						list.css('min-width', list_width);

						// Check for IE and apply a hack here for min-width problems
						if ($.browser.msie && $.browser.version === '6.0') {
							// Look for the widest option
							list.find('a').each(function () {
								if (widest_element === null || widest_element.width() < $(this).width()) {
									widest_element = $(this);
								}
							});
							if (widest_element.width() > list_width) {
								list.width(widest_element.width());
							} else {
								list.width(list_width);
							}
						}
						
						// write cached width
						list_data.cached_width = dropdown.outerWidth();
						list.data('dropp', list_data);
					}
					

				}
				return false;
			});
			// end of loop
		});
	};
}(jQuery));