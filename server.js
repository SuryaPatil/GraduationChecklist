const express = require('express');
const fileUpload = require('express-fileupload');
const pdfParse = require("pdf-parse"); 
const cors = require("cors"); 
const { Buffer } = require("node:buffer");
const pool = require("./db");
const pdf2base64 = require('pdf-to-base64');


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

    console.log("posting")

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

// get all courses
app.get("/postCourse", async(req,res) => {
  try {
      const allCourses = await pool.query("SELECT * FROM courses")
      res.json(allCourses.rows);
  } catch (error) {
      console.error(error.message)
  }
})

app.get("/postCourse/lower_divs", async(req,res) => {
  try {
      const lower_divs = await pool.query("select * from courses where type = 'Lower Division' order by course ASC")
      res.json(lower_divs.rows);
  } catch (error) {
      console.error(error.message)
  }
})

app.get("/postCourse/upper_divs", async(req,res) => {
  try {
      const upper_divs = await pool.query("select * from courses where type = 'Upper Division' order by course ASC")
      res.json(upper_divs.rows);
  } catch (error) {
      console.error(error.message)
  }
})
app.get("/postCourse/techs", async(req,res) => {
  try {
      const techs = await pool.query("select * from courses where type = 'Technical Elective' order by course ASC")
      res.json(techs.rows);
  } catch (error) {
      console.error(error.message)
  }
})
app.get("/postCourse/math", async(req,res) => {
  try {
      const math = await pool.query("select * from courses where type = 'Math Requirement' order by course ASC")
      res.json(math.rows);
  } catch (error) {
      console.error(error.message)
  }
})
app.get("/postCourse/nat", async(req,res) => {
  try {
      const nat = await pool.query("select * from courses where type = 'Natural Science' order by course ASC")
      res.json(nat.rows);
  } catch (error) {
      console.error(error.message)
  }
})

app.get("/postCourse/ise_upper_div", async(req,res) => {
  try {
      const iud = await pool.query("select * from courses where type = 'ISE Upper Division' order by course ASC")
      res.json(iud.rows);
  } catch (error) {
      console.error(error.message)
  }
})

app.get("/postCourse/ise_lower_div", async(req,res) => {
  try {
      const ild = await pool.query("select * from courses where type = 'ISE Lower Division' order by course ASC")
      res.json(ild.rows);
  } catch (error) {
      console.error(error.message)
  }
})

app.get("/postCourse/ise_write_req", async(req,res) => {
  try {
      const iud = await pool.query("select * from courses where type = 'ISE Writing Req' order by course ASC")
      res.json(iud.rows);
  } catch (error) {
      console.error(error.message)
  }
})


app.delete("/postCourse", async (req, res) => {
  try {
    const deleteCourses = await pool.query("DELETE FROM courses");
  //  const allCourses = await pool.query("SELECT * FROM courses");
    res.json("Courses were deleted"); 
  //  res.json(allCourses.rows);
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(5000, () => console.log('Server Started...'));