var PRODUCT_TYPE = [null, "tomato", "potato"]; 
var REIMBURSEMENT_TYPE = [null, "spoilage", "appearance", "cancelled"];

function FormatPriceCommas(price)
{
    return price.replace(/\B(?=(\d{3})+(?!\d))/g, ",");//
}

function CalculateReimbursement()
{
	var product_type_index = parseInt(document.getElementById("product-type").value,10);
	var reimbursement_type_index = parseInt(document.getElementById("reimbursement-type").value,10);
	var shipment_weight = parseInt(document.getElementById("shipment-weight").value,10);
	var unit_price = parseInt(document.getElementById("unit-price").value,10);
	var scenario = parseInt(document.getElementById("scenario").value,10);
	console.log("Product type: "+product_type_index+" - "+PRODUCT_TYPE[product_type_index]);
	console.log("Reimbursement type: "+reimbursement_type_index+" - "+REIMBURSEMENT_TYPE[reimbursement_type_index]);
	console.log("Shipment weight: "+shipment_weight);
	console.log("Unit price: "+unit_price);
	console.log("Scenario: "+scenario);
	if (product_type_index && reimbursement_type_index && shipment_weight && unit_price && scenario)
	{
		var product_type = PRODUCT_TYPE[product_type_index];
		var reimbursement_type = REIMBURSEMENT_TYPE[reimbursement_type_index];
		//UPDATE create a closure/class to hold allowance and beyond
		var currency, unit;
		var allowance = 0;
		var beyond = 0;
		var reimbursement = 0;
		//ensure necessary JSON data is available to complete calculation
		try {

			allowance = calculator_data["products"][product_type]["reimbursements"][reimbursement_type].allowance;
			beyond = calculator_data["products"][product_type]["reimbursements"][reimbursement_type].beyond;
			if (scenario > allowance)
			{
				reimbursement = (shipment_weight*unit_price) * ((scenario-allowance)/100) * (beyond/100);
			}
			jQuery(".explanation-product").text(product_type);
			jQuery(".explanation-reason").text(reimbursement_type);
			jQuery(".explanation-shipment-weight").text(shipment_weight+"kg");
			jQuery(".explanation-unit-price").text(unit_price+"kg");
			jQuery(".explanation-scenario").text(scenario+"%");
			jQuery(".explanation-allowance").text(allowance+"%");
			jQuery(".explanation-beyond").text(beyond+"%");
			document.getElementById("reimbursement-total").innerHTML = "$"+FormatPriceCommas(reimbursement.toFixed(2));
			return true;
		}
		catch(error){
			alert(product_type+"/"+reimbursement_type+" reimbursement is not available.");
			return false;
		}
	}
	else
	{
		jQuery("span.add-data").remove();
		if (!product_type_index)
		{
			jQuery("#product-type-select-interface").children("li:first-of-type").append("<span class='add-data'><img src='images/add-data-icon.png'/></span>");
		}
		if (!reimbursement_type_index)
		{
			jQuery("#reimbursement-type-select-interface").children("li:first-of-type").append("<span class='add-data'><img src='images/add-data-icon.png'/></span>");
		}
		if (!shipment_weight)
		{
			jQuery("#field-shipment-weight label").append("<span class='add-data'><img src='images/add-data-icon.png'/></span>");
		}
		if (!unit_price)
		{
			jQuery("#field-unit-price label").append("<span class='add-data'><img src='images/add-data-icon.png'/></span>");
		}
		if (!scenario)
		{
			jQuery("#field-scenario label").append("<span class='add-data'><img src='images/add-data-icon.png'/></span>");
		}
		return false;
	}
}

function InitializeReimbursementAdd(product_type_index)
{
	jQuery("#product-list li[data-product='"+PRODUCT_TYPE[product_type_index]+"'] .reimbursement-add").click(function(){
		if (!calculator_data["products"][PRODUCT_TYPE[product_type_index]]["reimbursements"])
		{
			calculator_data["products"][PRODUCT_TYPE[product_type_index]]["reimbursements"] = [];
		}
		var reimbursement_type_index = parseInt(jQuery(this).parent().children(".reimbursement-select").val(),10);
		var reimbursement_allowance = parseInt(jQuery(this).parent().children(".reimbursement-allowance").val(),10);
		var reimbursement_beyond = parseInt(jQuery(this).parent().children(".reimbursement-beyond").val(),10);
		
		if (reimbursement_type_index && reimbursement_allowance >= 0 && reimbursement_beyond >= 0)
		{
			jQuery(this).parent().parent().children(".reimbursements").append("<li data-reimbursement='"+REIMBURSEMENT_TYPE[reimbursement_type_index]+"' class='reimbursement-detail-row clear'><span class='reimbursement-detail'>"+REIMBURSEMENT_TYPE[reimbursement_type_index]+"</span><span class='reimbursement-detail'>allowance: "+reimbursement_allowance+"%</span><span class='reimbursement-detail'>beyond: "+reimbursement_beyond+"%</span><span class='reimbursement-detail'><a href='#' onclick=\"RemoveProductReimbursement("+product_type_index+", "+reimbursement_type_index+"); return false;\">Remove</a></span></li>");
			calculator_data["products"][PRODUCT_TYPE[product_type_index]]["reimbursements"][REIMBURSEMENT_TYPE[reimbursement_type_index]] = [];
			calculator_data["products"][PRODUCT_TYPE[product_type_index]]["reimbursements"][REIMBURSEMENT_TYPE[reimbursement_type_index]]["allowance"] = reimbursement_allowance;
			calculator_data["products"][PRODUCT_TYPE[product_type_index]]["reimbursements"][REIMBURSEMENT_TYPE[reimbursement_type_index]]["beyond"] = reimbursement_beyond;

			//Remove reimbursement option from this product's current reimbursements
			jQuery(this).parent().children(".reimbursement-select").children("option[value="+reimbursement_type_index+"]").remove();
			//Clear the adder fields
			jQuery(this).parent().children(".reimbursement-allowance").val("");
			jQuery(this).parent().children(".reimbursement-beyond").val("");
			if (!jQuery(this).parent().children(".reimbursement-select").children("option").length)
			{
				jQuery(this).parent().hide();
			}
		}
	});
}

function PopulateProductList()
{
	for (var product in calculator_data["products"])
	{
		var product_type_index = PRODUCT_TYPE.indexOf(product);
		jQuery("#product-list").append("<li data-product='"+product+"'><h5>"+product+"</h5><div class='reimbursement-adder-panel'><select class='reimbursement-select'></select><input class='reimbursement-allowance' type='text' pattern='\\d*' placeholder='allowance %'><input class='reimbursement-beyond' pattern='\\d*' type='text' placeholder='beyond %'><button class='reimbursement-add'>add</button></div><ul class='reimbursements'></ul></li>");
		if (calculator_data["products"][product]["reimbursements"])
		{
			for (var reimbursement in calculator_data["products"][product]["reimbursements"])
			{
				var reimbursement_type_index = REIMBURSEMENT_TYPE.indexOf(reimbursement);
				jQuery("li[data-product='"+product+"'] ul.reimbursements").append("<li data-reimbursement='"+reimbursement+"' class='reimbursement-detail-row clear'><span class='reimbursement-detail'>"+reimbursement+"</span><span class='reimbursement-detail'> allowance: "+calculator_data["products"][product]["reimbursements"][reimbursement]["allowance"]+"%</span><span class='reimbursement-detail'>beyond: "+calculator_data["products"][product]["reimbursements"][reimbursement]["beyond"]+"%</span><span class='reimbursement-detail'><a href='#' onclick=\"RemoveProductReimbursement("+product_type_index+", "+reimbursement_type_index+"); return false;\">Remove</a></span></li>");
			}
			//If all reimbursement types are already populated, hide the adder
			if (jQuery("#product-list").children("li[data-product="+PRODUCT_TYPE[product_type_index]+"]").children("ul.reimbursements").children("li").length == (REIMBURSEMENT_TYPE.length-1))//less one becuase first element is null
			{
				jQuery("#product-list").children("li[data-product="+PRODUCT_TYPE[product_type_index]+"]").children(".reimbursement-adder-panel").hide();
			}
		}
		InitializeReimbursementAdd(product_type_index);
	}
}

function AddProduct(product)
{
	if (!calculator_data["products"][product])
	{
		var product_type_index = PRODUCT_TYPE.length;
		//Append new product to the product type select input
        jQuery("#product-type").append("<option value='"+product_type_index+"'>"+product+"</option>");
        //Append new product to the dropdown interface
		jQuery("#product-type-select-interface").append("<li data-value='"+product_type_index+"'>"+product+"</li>");
		InitializeSelectInterfaceOption("product-type-select-interface", product_type_index);
		PRODUCT_TYPE[product_type_index] = product;
		calculator_data["products"][product] = [];
		console.log("Adding new product: "+product);
		//var product_remove_link = "<a href='#' onclick=\"RemoveProduct("+product_type_index+"); return false;\">Remove</a> ";//Coming Soon!
		jQuery("#product-list").append("<li data-product='"+product+"'><h5>"+product+"</h5><div class='reimbursement-adder-panel'><select class='reimbursement-select'></select><input class='reimbursement-allowance' type='text' pattern='\\d*' placeholder='allowance %'><input class='reimbursement-beyond' type='text' pattern='\\d*' placeholder='beyond %'><button class='reimbursement-add'>add</button></div><ul class='reimbursements'></ul></li>");
		//Clear the new product type input
		jQuery("#new-product-type").val("");
		//Populate adder panel with reimbursement type options
		for (var reimbursement_type_index in REIMBURSEMENT_TYPE)
		{
			if (parseInt(reimbursement_type_index,10))
			{
				jQuery("#product-list li[data-product='"+product+"'] .reimbursement-select").append("<option value='"+reimbursement_type_index+"'>"+REIMBURSEMENT_TYPE[reimbursement_type_index]+"</option>");
			}
		}
		InitializeReimbursementAdd(product_type_index);
		jQuery("ul#product-type-select-interface li").unbind().click(function(){
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
				jQuery("#"+data_input_id).val(jQuery(this).data("value"));
				jQuery(this).parent().children("li").removeClass();
				jQuery(this).addClass("selected");

				jQuery(this).parent().children("li:not(:first-of-type)").animate({top: expand_from_position}, 100, function(){
					jQuery(this).parent().attr("data-status", "closed");
				});
				//Bring the selected option to the top
				jQuery("ul.select-interface li.selected").animate({top: 0}, 100);
			}
		});
	}
	else
	{
		console.log("Product already exists.");
	}
}

//Coming Soon!
/*
function RemoveProduct(product_type_index)
{
	if (product_type_index)
	{
		//Remove product reimbursement details
		jQuery("#product-list").children("li[data-product="+PRODUCT_TYPE[product_type_index]+"]").remove();

		//Remove product option from the calculator interface
		jQuery("#product-type-select-interface").children("li[data-value="+product_type_index+"]").remove();

		//Remove from JSON
		delete calculator_data["products"][PRODUCT_TYPE[product_type_index]];
	}
}
*/

function RemoveProductReimbursement(product_type_index, reimbursement_type_index)
{
	if (product_type_index && reimbursement_type_index)
	{
		//Remove from JSON
		delete calculator_data["products"][PRODUCT_TYPE[product_type_index]]["reimbursements"][REIMBURSEMENT_TYPE[reimbursement_type_index]];

		//Remove from this product's current reimbursements
		jQuery("#product-list").children("li[data-product="+PRODUCT_TYPE[product_type_index]+"]").children("ul.reimbursements").children("li[data-reimbursement="+REIMBURSEMENT_TYPE[reimbursement_type_index]+"]").remove();

		//Append back to the adder select so that it can be added again
		jQuery("#product-list").children("li[data-product="+PRODUCT_TYPE[product_type_index]+"]").children(".reimbursement-adder-panel").children("select.reimbursement-select").append("<option value='"+reimbursement_type_index+"'>"+REIMBURSEMENT_TYPE[reimbursement_type_index]+"</option>");

		//Set adder to visible (in case previously all reimbursement types had been added)
		jQuery("#product-list").children("li[data-product="+PRODUCT_TYPE[product_type_index]+"]").children(".reimbursement-adder-panel").fadeIn();
	}
}

function InitializeSelectInterfaceOption(select_interface_id, data_value)
{
	jQuery("ul#"+select_interface_id+".select-interface li[data-value='"+data_value+"']").click(function(){
		var ul_status = jQuery(this).parent().attr("data-status");
		if (ul_status == "closed")
		{
			jQuery("ul.select-interface").attr("data-status", "closed");
			jQuery(this).parent().attr("data-status", "open");
		}
		if (ul_status == "open")
		{
			var data_input_id = jQuery(this).parent().data("connect");
			jQuery("#"+data_input_id).val(jQuery(this).data("value"));
			jQuery(this).parent().children("li").removeClass();
			jQuery(this).addClass("selected");
			jQuery(this).parent().attr("data-status", "closed");
		}
	});
}