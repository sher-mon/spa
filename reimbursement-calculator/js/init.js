$(document).ready(function(){
	//Clear previous form data
	jQuery("#fields input").val("");

	/* Add Product */
	jQuery("#add-product").click(function(){
		var new_product_type = jQuery("#new-product-type").val();
		if (new_product_type.trim().length)
		{
			AddProduct(new_product_type);
		}
	});

	/* Buttons */
	jQuery("#back-button").click(function(){
		jQuery(".swivel-panel").toggleClass("show-results");
	});
	jQuery("#calculate").click(function(){
		if (CalculateReimbursement())
		{
			$("html, body").animate({scrollTop: 0}, 400);
			jQuery(".swivel-panel").toggleClass("show-results");
		}
	});
	$(document).ready(function(){
		jQuery("#settings-gear").click(function(){
			jQuery("#settings-gear").toggleClass("selected");
			jQuery("#admin-panel").slideToggle();
		});
	});

	/* Dropdown Menus */
	jQuery("ul.select-interface li").click(function(){
		var ul_status = jQuery(this).parent().attr("data-status");
		var model_li_height = jQuery(this).parent().children("li:first-of-type").height();
		var model_li_width = jQuery(this).parent().children("li:first-of-type").width();
		var model_li_padding = parseInt(jQuery(this).parent().children("li:first-of-type").css("padding-top"),10);
		var expand_from_position = (model_li_height+(model_li_padding*2));
		if (ul_status == "closed")
		{
			//Keep the current select interface on top regardless of its DOM position
			jQuery("ul.select-interface").css("z-index", 0);
			jQuery("ul.select-interface li").css("z-index", 0);
			jQuery(this).parent().css("z-index", 100);

			//Position the select interface options so that they expand out just below the leading (0 index) informative li
			jQuery(this).parent().children("li:not(:first-of-type)").css("top", expand_from_position);

			//Close any other select interfaces to focus attention on current input 
			jQuery("ul.select-interface").attr("data-status", "closed");
			jQuery(this).parent().attr("data-status", "open");
			
			//Expose select interface options
			jQuery(this).parent().children("li").each(function(){
				var li_value = jQuery(this).data("value");
				var li_border = parseInt(jQuery(this).css("border-bottom-width"),10);
				var animate_top = li_value*(model_li_height+(model_li_padding*2)+li_border)+"px";
				jQuery(this).css("width", model_li_width+"px");
				jQuery(this).css("z-index", li_value);
				jQuery(this).animate({top: animate_top}, 300);
			});
		}
		if (ul_status == "open")
		{
			var data_input_id = jQuery(this).parent().data("connect");
			var data_value = jQuery(this).data("value");
			jQuery("#"+data_input_id).val(data_value);
			jQuery(this).parent().children("li").removeClass();
			if (data_value)
			{
				jQuery(this).parent().children("li").children("span.add-data").remove();
			}
			jQuery(this).addClass("selected");

			jQuery(this).parent().children("li:not(:first-of-type)").animate({top: expand_from_position}, 100, function(){
				jQuery(this).parent().attr("data-status", "closed");
			});
			//Bring the selected option to the top
			jQuery("ul.select-interface li.selected").animate({top: 0}, 100);
		}
	});

	/* Text Inputs */
	jQuery(".slide-text-input label").click(function(){
		jQuery(this).parent().children("input").focus();
	});
	jQuery(".slide-text-input input").blur(function(){
		if (jQuery(this).parent().hasClass("numerical-only"))
		{
			if (parseInt(jQuery(this).val(),10) >= 0)
			{
				jQuery(this).addClass("maintain-input-position");
				jQuery(this).parent().children("label").children("span.add-data").remove();
			}
			else
			{
				jQuery(this).val("");
				jQuery(this).removeClass("maintain-input-position");
			}
		}
		else
		{
			jQuery(this).addClass("maintain-input-position");
		}
	});
});