const express = require('express');
const mysql = require("mysql");
const app = express();
const PORT = 8080;


/* ----------------- Function to convert json data into excel file ----------------- */
/*import XLSX from "xlsx"
function ExportData(data)
    {
        filename='reports.xlsx';
        var ws = XLSX.utils.json_to_sheet(data);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "People");
        XLSX.writeFile(wb,filename);
    }*/


/* ----------------- Node and MySql server connection ----------------- */
var connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    port:"3306",
    password:"harsh",
    database:"alumni_data"
});

connection.connect(function(error){
    if(error){
        console.log("Error:" , error.message);
    }
    else {
        console.log("Connected to MySql server !!");
    }
});

app.use( express.json() )

app.listen(
    PORT,
    ()=> console.log(`it's alive on http://localhost:${PORT}`)
)

/* ----------------- API's Post methods starts from here ----------------- */

app.post('/student', (req, res) =>{
    const { email } = req.body;
    const { firstName } = req.body;
    const { lastName } = req.body;
    const { mobile } = req.body;
    const { course } = req.body;
    const { yearOfGraduation } = req.body;
    const { higherEducation } = req.body;
    const { workExperience } = req.body;
    const { twitterHandle } = req.body;
    const { linkedinHandle } = req.body;
    const { examsCleared } = req.body;

    var name = firstName + " " + lastName;
    var contact = twitterHandle + "," + linkedinHandle;
    HE=job=0;
    var exams = "";

    if(higherEducation.length > 0)
        HE = 1;

    if(workExperience.length > 0)
        job = 1;

    for(var i=0 ; i<examsCleared.length ; i++){
        exams+=examsCleared[i];
        if(i <= examsCleared.length-2)
            exams+=", ";
    }

    //query to insert data into student table 
    connection.query(`INSERT INTO STUDENT VALUES('${name}' , '${mobile}', '${course}', '${yearOfGraduation}', '${email}', 
    ${HE}, ${job}, '${contact}', '${exams}');`, function(error){
        if(!!error){
            console.log("Error(Student):"+error.message);
        }
        else{
            console.log(`Entry with email:: ${email} added to student successfully.`,)
        }
    })

    //query to insert data into higher_edu table
    if(HE == 1){
        for(var i=0 ; i<higherEducation.length ; i++){
            connection.query(`INSERT INTO higher_edu VALUES('${email}', '${higherEducation[i].course}', 
                '${higherEducation[i].yearOfGraduation}', '${higherEducation[i].institute}');`, 
                function(error){
                if(!!error){
                    console.log("Error(Higher_Edu):"+error.message);
                }
                else{
                    console.log(`Entry with email:: ${email} added to higher_edu successfully.`,)
                }
            })
        }
    }

    //query to insert data into work
    if(job == 1){
        for(var i=0 ; i<workExperience.length ; i++){
            connection.query(`INSERT INTO work VALUES('${email}', '${workExperience[i].type}', 
                ${workExperience[i].experience} , '${workExperience[i].organisation}',
                '${workExperience[i].profile}');`, function(error){
                if(!!error){
                    console.log("Error(Work):"+error.message);
                }
                else{
                    console.log(`Entry with email:: ${email} added to work successfully.`,)
                }
            })
        }
    }
    
        res.send({
            Message:"Check console for details.",
        })
            
});

/* ----------------- API's Get methods starts from here ----------------- */

//for getting all the data present in student table
app.get('/student', (req, res)=>{
    connection.query(`SELECT * FROM STUDENT;`, function(error, row){
        if(!!error){
            res.send({
                Message:"Error : " + error.message,
            });
        }
        else if(row.length <= 0){
            res.send({
                Message:`No data found !!`,
            });
        }
        else{
            res.status(200).send({
                row
            })
        }
    })
});

//for getting data of a alumni by email id
app.get('/student/email/:email', (req, res)=>{
    const { email } = req.params;

    connection.query(`SELECT * FROM STUDENT WHERE EMAIL = '${email}';`, function(error, row){
        if(!!error){
            res.send({
                Message:"Error : " + error.message,
            });
        }
        else if(row.length <= 0){
            res.send({
                Message:`Entry with ID ${email} not found !!`,
            });
        }
        else{
            res.status(200).send({
                row
            })
        }
    })
});

//for searching data by name
app.get('/student/name/:name', (req, res)=>{
    const { name } = req.params;

    connection.query(`SELECT * FROM STUDENT WHERE NAME LIKE '${name}%';`, function(error, row){
        if(!!error){
            res.send({
                Message:"Error : " + error.message,
            });
        }
        else if(row.length <= 0){
            res.send({
                Message:`Entry with name like ${name} not found !!`,
            });
        }
        else{
            res.status(200).send({
                row
            })
        }
    })
});

//for getting higer education data of an alumni by email id
app.get('/higher_edu/:email', (req, res)=>{
    const { email } = req.params;

    connection.query(`SELECT * FROM HIGHER_EDU WHERE EMAIL = '${email}';`, function(error, row){
        if(!!error){
            res.send({
                Message:"Error : " + error.message,
            });
        }
        else if(row.length <= 0){
            res.send({
                Message:`Entry with ID ${email} not found !!`,
            });
        }
        else{
            res.status(200).send({
                row
            })
        }
    })
});

//for getting work data of an alumni by email id
app.get('/work/:email', (req, res)=>{
    const { email } = req.params;

    connection.query(`SELECT * FROM WORK WHERE EMAIL = '${email}';`, function(error, row){
        if(!!error){
            res.send({
                Message:"Error : " + error.message,
            });
        }
        else if(row.length <= 0){
            res.send({
                Message:`Entry with ID ${email} not found !!`,
            });
        }
        else{
            res.status(200).send({
                row
            })
        }
    })
});

//for getting alumni data of a specific course
app.get('/course/:Cname', (req, res)=>{
    const { Cname } = req.params;

    connection.query(`SELECT * FROM STUDENT WHERE COURSE LIKE '${Cname}';`, function(error, row){
        if(!!error){
            res.send({
                Message:"Error : " + error.message,
            });
        }
        else if(row.length <= 0){
            res.send({
                Message:`No entries with course ${Cname} found !!`,
            });
        }
        else{
            res.status(200).send({
                row
            })
        }
    })
});

//for getting alumni data of a specific course
app.get('/yearofGraduation/:year', (req, res)=>{
    const { year } = req.params;

    connection.query(`SELECT * FROM STUDENT WHERE year(YOG) = '${year}';`, function(error, row){
        if(!!error){
            res.send({
                Message:"Error : " + error.message,
            });
        }
        else if(row.length <= 0){
            res.send({
                Message:`No entries with year of graduation ${year} found !!`,
            });
        }
        else{
            res.status(200).send({
                row
            })
        }
    })
});

/* ----------------- API's delete methods starts from here ----------------- */

//for deleting an entry by email (Admin only feature)
app.delete('/student/:email', (req, res)=>{
    const { email } = req.params;
    var HE, job;                  
    connection.query(`SELECT Higher_Education, Job FROM STUDENT WHERE EMAIL = '${email}';`, function(error, row){
        if(!!error){
            console.log("Error : " + error.message);
        }
        else if(row.length <= 0){
            console.log(`Entry with ID ${email} not found !!`);
            res.send({
                Message:`Entry with ID ${email} not found !!`,
            });
        }
        else{
            HE = row[0].Higher_Education;
            job = row[0].Job;

            if(HE == 1){
                connection.query(`DELETE FROM HIGHER_EDU WHERE EMAIL = '${email}';`, function(error){
                    if(!!error){
                        console.log("Error(Higher_edu): " + error.message);
                    }
                    else{
                        console.log(`Entry with email ${email} deleted from higher_edu succesfully !!`);
                    }
                })
            }
        
            if(job == 1){
                connection.query(`DELETE FROM WORK WHERE EMAIL = '${email}';`, function(error){
                    if(!!error){
                        console.log("Error(Work): " + error.message);
                    }
                    else{
                        console.log(`Entry with email ${email} deleted from work succesfully !!`);
                    }
                })
            }

            connection.query(`DELETE FROM STUDENT WHERE EMAIL = '${email}';`, function(error){
                if(!!error){
                    console.log("Error(Student): " + error.message);
                    res.send({
                        Message:"Some error occured !! please check console for more details.",
                    });
                }
                else{
                    res.send({
                        Message:`Entry with email ${email} deleted succesfully !!`,
                    });
                }
            })
        }
    })
});


/* ----------------- API's Update methods starts from here ----------------- */

app.put('/student/email/:email', (req, res)=>{
    const { email } = req.params;
    const { Name } = req.body;

    connection.query(`UPDATE TABLE STUDENT SET NAME = "${ Name }" where EMAIL = "${ email }"`, 
    function(error){
        if(!!error){
            res.send({
                Message:"Error ::" + error.message,
            });
        }
        else{
            res.send({
                Message:`Entry with ${ email } updated with name ${ Name } sucessfully !!`,
            });
        }
    })
});