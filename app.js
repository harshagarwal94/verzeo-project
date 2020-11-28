const path = require('path');
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mysql = require('mysql');



const app = express();
	
app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')

//Database Define

const connection= mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "your new password",
	database: "verzeo"
})

connection.connect(function(error){
	if(!!error) console.log(error)
	else console.log("Database Connected")
})	


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))




app.get('/',(req,res)=>{
	let sql= 'SELECT * FROM registers';
	let query= connection.query(sql,(err,rows)=>{
		if(err) throw err;
		res.render('user_index',{
			title:"Home Page",
			registers: rows
		})
	})
})

app.get('/add',(req,res)=>{
	res.render('user_add',{
		title: "Registration Form"
	})
})

app.post('/save',(req,res)=>{
	let data={f_name:req.body.f_name, l_name:req.body.l_name, u_name:req.body.u_name, email:req.body.email, pass:req.body.pass, numb:req.body.numb}
	let sql= 'INSERT INTO registers SET ?';
	let query= connection.query(sql, data, (err,results)=>{
		if(err) throw err;
		res.redirect('/')
	})
})

app.get('/edit/:userId',(req,res)=>{
	const userId=req.params.userId;
	let sql=`SELECT * FROM registers WHERE id=${userId}`
	let query=connection.query(sql,(err,results)=>{
		if(err) throw err;
		res.render('user_edit',{
			title: "Updation Form",
			registers: results[0]
		})
	})	
})

app.post('/update',(req,res)=>{
	const userId=req.body.id;
	let sql="UPDATE registers SET f_name='"+ req.body.f_name+"' , l_name='"+ req.body.l_name+"' , u_name='"+ req.body.u_name+"' , email='"+ req.body.email+"' , pass='"+ req.body.pass+"' ,numb='"+ req.body.numb+"' WHERE id='"+ userId+"'"
	let query= connection.query(sql,(err,results)=>{
		if(err) throw err;
		res.redirect('/')
	})

})
	



app.get('/delete/:userId', (req,res)=>{
	const userId=req.params.userId;
let sql= `DELETE FROM registers WHERE id=${userId}`;
let query= connection.query(sql, (err,results)=>{
	if(err) throw err;
	res.redirect('/')
	})
})	



app.listen(3000, ()=>{
	console.log("server is loading port 3000");
})