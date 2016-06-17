var buildDropDownAttributes = function(dropdown_id){
  var input_id = dropdown_id;
  var field_id = "field-"+dropdown_id;
  var interface_id = dropdown_id+"-select-interface";
  return {
  	getInputId: function() {
  		return input_id;
  	},
  	getFieldId: function() {
  		return field_id;
  	},
  	getInterfaceId: function() {
  		return interface_id;
  	}
  };
};

var buildTextInputAttributes = function(text_input_id){
	var input_id = text_input_id;
	var field_id = "field-"+text_input_id;
	return {
		getInputId: function() {
			return input_id;
		},
	  	getFieldId: function() {
	  		return field_id;
	  	}
	};
}

var field_data = [
	{
		type: "select",
		input_id: "product-type",
		description: "Type of product",
		field_values: [null, "tomato", "potato"]		
	},
	{
		type: "select",
		input_id: "reimbursement-type",
		description: "Type of reimbursement",
		field_values: [null, "Spoilage", "Appearance", "Cancelled"]	
	},
	{
		type: "input",
		input_id: "shipment-weight",
		informative_text: "Shipment Weight",
		label_data: {
			description: "Shipment Weight",
			unit: "kg"
		}	
	},
	{
		type: "input",
		input_id: "unit-price",
		informative_text: "Unit Price",
		label_data: {
			description: "Unit Price",
			unit: "$"
		}		
	},
	{
		type: "input",
		input_id: "scenario",
		informative_text: "Scenario",
		label_data: {
			description: "Scenario",
			unit: "%"
		}		
	}
];

var calculator_data = {
	units: {
		currency: "$",
		weight: "kg"
	},
	products: {
		tomato: {
			reimbursements: {
				spoilage: {
					allowance: 5,
					beyond: 50,
					note: "Seller reimburses 50% of all price after the 5% allowance"
				},
				appearance: {
					allowance: 20,
					beyond: 30,
					note: "Seller reimburses 30% x Price p/kg after 20% allowance"
				},
				cancelled: {
					allowance: 0,
					beyond: 5,
					note: "Seller reimburses 5% of price"
				}
			}
		},
		potato: {
			reimbursements: {
				spoilage: {
					allowance: 10,
					beyond: 50,
					note: "Seller reimburses 50% of all price after the 10% allowance"
				},
				appearance: {
					allowance: 17,
					beyond: 20,
					note: "Seller reimburses 20% x Price p/kg after 17% allowance"
				},
				cancelled: {
					allowance: 0,
					beyond: 5,
					note: "Seller reimburses 5% of price"
				}
			}
		}
	}
};