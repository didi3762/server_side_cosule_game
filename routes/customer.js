var express = require('express');
var router = express.Router();
var CustomerService = require('../services/service.customer');
const db = require("../database/config");
/* GET customer listing. */
// router.get('/', async function(req, res, next)
// {
// 	res.json({error: "Invalid Customer UID."});
// });

/* adds a new customer to the list */
router.post('/', async (req, res, next) =>
{
	const body = req.body;
	try
	{
		const customer = await CustomerService.create(body);

		if(body.guid != null)
		{
			customer.guid = body.guid;
		}

		res.cookie('guid', customer.guid, { maxAge: 900000, httpOnly: true });
		const sql_insert = `INSERT INTO Users (guid , first_name,pothoUrl,password ,sudoko_score ,trivya_score ,currenr_score ,sum_score )
		VALUES (?,?,?,?,?,?,?,?);`;

		const new_user = [customer.guid, customer.first_name,customer.pothUrl,customer.password,customer.sudoko_score,customer.trivya_score,customer.currenr_score,customer.sum_score];
		db.run(sql_insert,new_user , (err,user)=>{
			if (err) {
				return console.error(err.message);
			}
			console.log("Successful insert to db");
			return res.status(201).json({ user: user });
		})
	}
	catch(err)
	{
		if (err.name === 'ValidationError')
		{
        	return res.status(400).json({ error: err.message });
		}

		// unexpected error
		return next(err);
	}
});

/* retrieves a customer by uid */
router.get('/:id', async (req, res, next) =>
{
	try
	{
		const customer = await CustomerService.retrieve(req.params.id);

		return res.json({ customer: customer });
	}
	catch(err)
	{
		// unexpected error
		return next(err);
	}
});

router.get('/:first_name/:password', async (req, res, next) =>
{
	try
	{

		const sql_select = `SELECT * FROM Users WHERE first_name=? AND password=?`;
		db.all(sql_select, [req.params.first_name,req.params.password] ,(err,rows)=>{
			if(err){
				return err.message;
			}
				// console.log(rows);
				
                 return res.json({current_user:rows});
		});
	}
	catch(err)
	{
		// unexpected error
		return next(err);
	}
});

/* updates the customer by uid */
router.put('/:guid', async (req, res, next) =>
{
	console.log(req.params.guid);
	
	try
	{
		const sql_update = `UPDATE Users SET sum_score = ?
		WHERE guid = ?;`;

		console.log(req.params.guid);
		
		const new_update = [req.body.sum_score, req.params.guid];
		db.run(sql_update,new_update , (err,rows)=>{
			if (err) {
				return console.error(err.message);
			}
			console.log("Successful update to db");
			// console.log(rows);
			// return res.status(201).json({ current_user: rows });
		})
		const sql_selectW = `SELECT * FROM Users WHERE guid=?`;
		db.all(sql_selectW, req.params.guid ,(err,rows)=>{
			if(err){
				console.log(err);
				return err.message;
			}
				console.log(rows);
				
                 return res.status(201).json({current_user:rows});
		});
		
		
	}
	catch(err)
	{
		// unexpected error
		return next(err);
	}
});

/* removes the customer from the customer list by uid */
router.delete('/:id', async (req, res, next) =>
{
	try
	{
		const customer = await CustomerService.delete(req.params.id);

		return res.json({success: true});
	}
	catch(err)
	{
		// unexpected error
		return next(err);
	}
});

module.exports = router;