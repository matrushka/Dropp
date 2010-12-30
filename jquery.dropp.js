/*
 * Dropp
 * http://github.com/matrushka/Dropp
 * @requires jQuery v1.3 or later
 * 
 * Dropp is a jQuery plugin which replaces regular droprown menus ( <select> elements ) with stylable alternatives.
 *
 * 2010 - Baris Gumustas
 */
(function($){
	$.fn.dropp = function() {
		return this.each(function() {
			var select = $(this);
			select.hide();
			select.wrap('<div class="dropdown_wrapper"></div>');
			
			var dropdown = $('<a href="#"/>').attr('class', select.attr('class')).addClass('dropdown').appendTo(select.parent());
			var list = $('<ul/>').addClass('dropdown_list').hide().appendTo(select.parent());
			
			// duplicate this line for dropdown opening
			list.css('min-width', dropdown.width()+parseInt(dropdown.css("padding-left"), 10)+parseInt(dropdown.css("padding-right"), 10));
			list.css('position', 'absolute').css('z-index', '9999');
			
			select.find('option').each(function() {
				var item = $(this);
				var list = item.closest('.dropdown_wrapper').find('ul.dropdown_list');
				var list_item = $('<li/>').appendTo(list);
				var link = $('<a href="#"/>').text(item.text());
				link.data('option',item);
				list_item.append(link);
				item.data('replacement',link);
				
				if (typeof select.attr('multiple') !== undefined && (select.attr('multiple') === true || select.attr('multiple') == 'multiple')) {
					if (typeof item.attr('selected') !== undefined && (item.attr('selected') === true || item.attr('selected') == 'selected')) {
						link.addClass('selected');
					}
				}
				
				// Select Event Listener
				link.bind('select',function(event,trigger_drowndown){
					var link = $(this);
					var wrapper = link.closest('.dropdown_wrapper');
					var item = link.data('option');
					var select = wrapper.find('select');
					var dropdown = wrapper.find('.dropdown');
					
					if (typeof select.attr('multiple') === 'undefined' || select.attr('multiple') === false) {
						select.find('option:selected').removeAttr('selected');
						dropdown.text($(this).text());
						item.attr('selected', 'selected');
						list.hide();
					} else {
						if (typeof item.attr('selected') === 'undefined' || item.attr('selected') === false) {
							item.attr('selected','selected');
							link.addClass('selected');
						} else {
							item.removeAttr('selected');
							link.removeClass('selected');
						}
						
						var values = [];
						select.find('option:selected').each(function(){
							values.push($(this).text());
						});
						
						if (values.length === 0) {
							if (typeof select.attr('placeholder') !== 'undefined') {
								dropdown.text(select.attr('placeholder'));
							} else {
								dropdown.html('&nbsp;');
							}
						} else {
							dropdown.text(values.join(', '));
						}
					}

					if(trigger_drowndown) {
						select.trigger('change');
					}
				});
				// Click Event
				link.click(function() {
					$(this).trigger('select',[true]);
					return false;
				});
			});
			
			// Each loop ends here
			if (select.find('option:selected').length === 0) {
				if (typeof select.attr('placeholder') !== 'undefined') {
					dropdown.text(select.attr('placeholder'));
				} else {
					dropdown.html('&nbsp;');
				}
			} else {
				if (typeof select.attr('multiple') !== undefined && (select.attr('multiple') === true || select.attr('multiple') == 'multiple')) {
					var values = [];
					select.find('option:selected').each(function(){
						values.push($(this).text());
					});
					dropdown.html(values.join(', '));
				} else {
					dropdown.text($(this).find('option:selected').text());
				}
			}
			
			dropdown.click(function() {
				if (list.is(':visible')) {
						list.hide();
						$('ul.dropdown_list').hide();
				} else {
						list.show();
				}
				return false;
			});
			
			$(document).click(function() {
					list.hide();
			});
			
			$('.dropdown_wrapper').click(function(event) {
					event.stopPropagation();
			});
		});
	};
}(jQuery));
