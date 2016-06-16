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