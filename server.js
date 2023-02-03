const express = require('express');
const fileUpload = require('express-fileupload');
const pdfParse = require("pdf-parse"); 
const cors = require("cors"); 
const pool = require("./db");

const app = express();
//middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// Upload Endpoint
app.post('/upload', (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }
  const file = req.files.file;
 
  pdfParse(file).then(result =>{
    console.log(result.text);
    res.send(result.text);
  }
    );
});

app.post('/postCourse', async(req,res) => {
  try{

    const{course, grade, credits, term, year, type} = req.body;
    console.log(
      req.body.course,
      req.body.grade,
      req.body.credits,
      req.body.term,
      req.body.year,
      req.body.type
    )

    const newCourse = await pool.query("INSERT INTO courses (course, grade, credits, term, year,type)"+
    " VALUES($1,$2,$3,$4,$5,$6) RETURNING *",
    [req.body.course, req.body.grade, req.body.credits, req.body.term, req.body.year,req.body.type]);
    res.json(newCourse.rows[0]); 

  } catch (error) {
    console.error(error.message); 
  }
})

app.listen(5000, () => console.log('Server Started...'));
