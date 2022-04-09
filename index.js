const express = require('express');
const mysql = require("mysql");
const app = express();
const PORT = 8080;

var connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"harsh",
    database:"alumni_data"
});

connection.connect(function(error){
    if(!!error){
        console.log("Error in connection ");
    }
    else {
        console.log("Connected Sucessfully !!");
    }
});

app.use( express.json() )

app.listen(
    PORT,
    ()=> console.log(`it's alive on http://localhost:${PORT}`)
)

app.get('/student/:email', (req, res)=>{
    const { email } = req.params;

    connection.query(`SELECT * FROM STUDENT WHERE EMAIL = ${email};`, function(error, rows, fields){
        if(!!error){
            console.log("Some error occured");
        }
        else{
            console.log("Success !! \n");
            console.log(rows);
        }
    })
    
    res.status(200).send({
        rows
    })
});

app.post('/student/:email', (req, res) =>{
    const { email } = req.params;
    const { name } = req.body;
    const { mobile } = req.body;
    const { course } = req.body;
    const { YOG } = req.body;
    const { HE } = req.body;
    const { job } = req.body;
    const { contact } = req.body;
    const { Exams } = req.body;

    connection.query(`INSERT INTO TABLE STUDENT VALUES(${name}, ${mobile}, ${course}, ${YOG}, ${email}, 
    ${HE}, ${job}, ${contact}, ${Exams});`, function(error){
        if(!!error){
            res.send({
                Message:"Some error occured",
            })
        }
        else{
            res.send({
                Message:`Entry with email:: ${email} and Name:: ${name} added successfully.`,
            })                     
        }
    })
});