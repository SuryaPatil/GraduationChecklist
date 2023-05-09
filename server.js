const express = require('express');
const fileUpload = require('express-fileupload');
const pdfParse = require("pdf-parse"); 
const cors = require("cors"); 
const { Buffer } = require("node:buffer");


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


app.listen(5000, () => console.log('Server Started...'));