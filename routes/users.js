var express = require('express');
var router = express.Router();
const db = require("../database/config");

const CustomerService = require("../services/service.customer.js");

/* GET users listing. */
router.get('/', function(req, res, next) {
  try
	{
    const sql_selectall = `SELECT * FROM Users`;
		db.all(sql_selectall,(err,rows)=>{
			if(err){
				return err.message;
			}
				console.log(rows);
				
        return res.json({ users: rows});
		})
    

		
	}
	catch(err)
	{
		// unexpected error
		return next(err);
	}
});

module.exports = router;
