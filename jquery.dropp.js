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
			
			var dropdown = $('<div/>').attr('class', select.attr('class')).addClass('dropdown').appendTo(select.parent());
			var list = $('<ul/>').addClass('dropdown_list').hide().appendTo(select.parent());
			
			list.css('min-width', dropdown.width()+parseInt(dropdown.css("padding-left"), 10)+parseInt(dropdown.css("padding-right"), 10));
			list.css('position', 'absolute').css('z-index', '9999');
			
			select.find('option').each(function() {
				var list = $(this).closest('.dropdown_wrapper').find('ul.dropdown_list');
				var list_item = $('<li/>').appendTo(list);
				var item = $(this);
				var link = $('<a href="#"/>').text(item.text());
				link.data('option',item);
				list_item.append(link);
				item.data('replacement',link);
				// Select Event Listener
				link.bind('select',function(event,trigger_drowndown){
					var wrapper = $(this).closest('.dropdown_wrapper');
					var item = $(this).data('option');
					var select = wrapper.find('select');
					var dropdown = wrapper.find('.dropdown');
					select.find('option[selected]').removeAttr('selected');
					dropdown.text($(this).text());
					item.attr('selected', 'selected');
					list.hide();
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
			
			dropdown.text($(this).find('option[selected]').text());
			dropdown.click(function() {
				$('ul.dropdown_list').hide();
				if (list.is(':visible')) {
						list.hide();
				} else {
						list.show();
				}
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
