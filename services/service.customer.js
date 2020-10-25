const CustomerModel = require("../models/model.customer");
const customers = require("../models/model.users");
const db = require("../database/config");
let Validator = require('fastest-validator');

let counter = 0;

console.log(db);



/* create an instance of the validator */
let customerValidator = new Validator();

/* use the same patterns as on the client to validate the request */
let namePattern = /([A-Za-z\-\’])*/;
let zipCodePattern = /^[0-9]{5}(?:-[0-9]{4})?$/;
let passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$/;

/* customer validator shema */
const customerVSchema = {
		guid: {type: "string", min: 3},
		
		first_name: { type: "string", min: 1, max: 50, pattern: namePattern},
		// last_name: { type: "string", min: 1, max: 50, pattern: namePattern},
		// email: { type: "email", max: 75 },
		// zipcode: { type: "string", max: 5, pattern: zipCodePattern},

		password: { type: "string", min: 2, max: 50, pattern: passwordPattern}
	};

/* static customer service class */
class CustomerService
{
	static create(data)
	{
		var vres = customerValidator.validate(data, customerVSchema);
		
		/* validation failed */
		if(!(vres === true))
		{
			let errors = {}, item;

			for(const index in vres)
			{
				item = vres[index];

				errors[item.field] = item.message;
			}
			
			throw {
			    name: "ValidationError",
			    message: errors
			};
		}
		// console.log(data);

		let customer = new CustomerModel(data.first_name, data.password, data.pothoUrl, data.sudoko_score, data.trivya_score,data.currenr_score,data.sum_score);

		console.log(customer);
		

		// customer.uid = 'c' + counter++;

		// customers[customer.uid] = customer;

		

		

		return customer;
	}

	static retrieve(uid)
	{
		if(customers[uid] != null)
		{
			return customers[uid];
		}
		else
		{
			throw new Error('Unable to retrieve a customer by (uid:'+ uid +')');
		}
	}


	static retrievePasw(data)
	{
		  
		const sql_select = `SELECT * FROM Users WHERE first_name=? AND password=?`;
		db.all(sql_select, [data.first_name,data.password] ,(err,rows)=>{
			if(err){
				return err.message;
			}
				// console.log(rows);
				
                 return rows;
		})
	}

	static retrieveAll()
	{
		const sql_selectall = `SELECT * FROM Users`;
		db.all(sql_selectall,(err,rows)=>{
			if(err){
				return err.message;
			}
				console.log(rows);
				
                 return rows;
		})
		
	}

	static update(uid, data)
	{
		if(customers[uid] != null)
		{
			const customer = customers[uid];
			
			Object.assign(customer, data);
		}
		else
		{
			throw new Error('Unable to retrieve a customer by (uid:'+ uid +')');
		}
	}

	static delete(uid)
	{
		if(customers[uid] != null)
		{
			delete customers[uid];
		}
		else
		{
			throw new Error('Unable to retrieve a customer by (uid:'+ cuid +')');
		}
	}
}

module.exports = CustomerService;