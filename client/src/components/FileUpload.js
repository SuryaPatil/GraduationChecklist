import React, { Fragment, useState } from 'react';
import Message from './Message';
import Progress from './Progress';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState('');
  const [filename, setFilename] = useState('Choose File');
  const [message, setMessage] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState(0);

  /**const[courseName, setCourseName] = useState("Hello");
  const[grade, setGrade] = useState('');
  const[credits, setCredits] = useState(0);
  const[term, setTerm] = useState('');
  const[year, setYear] = useState(0); */

  const lower_divs = ["CSE  114", "CSE  214", "CSE  215", "CSE  216", "CSE  220"];
  const upper_divs = ["CSE  300", "CSE  303", "CSE  310", "CSE  312", "CSE  316", "CSE  320",
    "CSE  373","CSE  416"];
  const math_reqs = ["MAT  131", "MAT  132", "MAT  211", "AMS 151","AMS 161", "AMS  210", "AMS 301","AMS 310"]; 
  const tech_electives = ["CSE 304", "CSE  305","CSE  306","CSE  307","CSE  311","CSE  323","CSE  327",
                          "CSE  328","CSE  331","CSE  332","CSE  333","CSE  334","CSE  336","CSE  337",
                          "CSE  351","CSE  352","CSE  353","CSE  354","CSE  355","CSE  356","CSE  360",
                            "CSE  361","CSE  362","CSE  363","CSE  364","CSE  366","CSE  370","CSE  376",
                            "CSE  377","CSE  380","CSE  381","CSE  487","CSE  488"]
    const nat_sci = ["AST  203", "AST  205",
    "BIO  201","BIO  204","BIO  202","BIO  203",
    "CHE  131","CHE  133","CHE  132","CHE  152","CHE  154","CHE  321","CHE  322","CHE  322","CHE  331","CHE  332",
    "GEO  102","GEO  103","GEO  112","GEO  113","GEO  122",
    "PHY  125","PHY  127","PHY  133","PHY  131","PHY  132","PHY  141","PHY  134","PHY  142","PHY  251","PHY  252"]

  const terms = ["Fall","Winter","Spring","Summer"]
  function is_numeric_char(c) { return /\d/.test(c); }
  function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
  }
  const onChange = e => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/upload', formData)
     
      let str = res.data;
      const splitLines = str => str.split(/\r?\n/);
      const lines = splitLines(str);
      var s = "";
      for (var i = 0; i < lines.length; i++) {

            var b = "";
            b = lines[i].substring(0,4); 
            
            if(b === "Fall" || b === "Wint" || b === "Spri" || b === "Summ"){
              b = lines[i]
              s = b;
           //   console.log(s);
            }

            if(lines[i].length >= 8){
          const course = lines[i].substring(0,8);
          const t = lines[i].substring(0,10); 

          if(lower_divs.includes(course) || upper_divs.includes(course) || tech_electives.includes(course) 
          || math_reqs.includes(course) || nat_sci.includes(course)){

       
            var credits = 0;
            var grade = "";
            var j = 8; 
            while(j < lines[i].length){
                if(is_numeric_char(lines[i][j])){
                  credits = parseInt(lines[i][j]);
                  break; 
                };
                j++; 
            }
            while(j < lines[i].length){

              if(isLetter(lines[i][j])){
                grade = lines[i][j];
                if(!is_numeric_char(lines[i][j+1])){
                  grade += lines[i][j+1]; 
                }
                break;
              }
              j++; 
            }
            j = 0;
            var season = "";
            var year = 0;
            while(j < s.length){
              
              if(s[j] === " "){
                year = parseInt(s.substring(j+1));
                break;
              }
              season += s[j];
              j++; 
            }
            var type = "";

            if(lower_divs.includes(course)){
              type = "Lower Division";
            }
            else if(upper_divs.includes(course)){
              type = "Upper Division";
            }
            else if(math_reqs.includes(course)){
              type = "Math Requirement";
            }
            else if(tech_electives.includes(course)){
              type = "Technical Elective";
            }
            else if(nat_sci.includes(course)){
              type = "Natural Science";
            }
           console.log(course+" "+credits+" "+grade+" "+season+" "+year+" "+type); 
           let data = {
            "course": course,
            "credits": credits,
            "grade": grade, 
            "term": season,
            "year": year,
            "type":type
           }
           axios.post("http://localhost:5000/postCourse",data); 
          }
        }
      }
      setMessage('File Uploaded'); 
    } catch (err) {
      if (err.response.status === 500) {
        setMessage('There was a problem with the server');
      } else {
        setMessage(err.response.data.msg);
      }
      setUploadPercentage(0)
    }
  };

  return (
    <Fragment>
      {message ? <Message msg={message} /> : null}
      <form onSubmit={onSubmit}>
        <div className='custom-file mb-4'>
          <input
            type='file'
            className='custom-file-input'
            id='customFile'
            onChange={onChange}
          />
          <label className='custom-file-label' htmlFor='customFile'>
            {filename}
          </label>
        </div>

        <Progress percentage={uploadPercentage} />

        <input
          type='submit'
          value='Upload'
          className='btn btn-primary btn-block mt-4'
        />
      </form>
      
    </Fragment>
  );
};

export default FileUpload;
