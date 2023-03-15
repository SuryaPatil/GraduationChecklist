import React, { Fragment, useState,useEffect } from 'react';
import Message from './Message';
import Progress from './Progress';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState('');
  const [filename, setFilename] = useState('Choose File');
  const [message, setMessage] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const [major,setMajor] = useState(""); 
  const [isCSE, setIsCSE] = useState(false); 

  const [courses, setCourses] = useState([]);
  const [ld, setLd] = useState([]);
  const [ud, setUd] = useState([]);
  const [te, setTe] = useState([]);
  const [math,setMath] = useState([])
  const [natsci, setNatsci] = useState([]);
  const [ild, setIld] = useState([])
  const [iud, setIud] = useState([])
  const [iwr, setIwr] = useState([])      
  

/*  const getCourses = async () => {

    try {
        const response = await axios.get("http://localhost:5000/postCourse")
        const ld_response = await axios.get("http://localhost:5000/postCourse/lower_divs")
        const ud_response = await axios.get("http://localhost:5000/postCourse/upper_divs")
        const te_response = await axios.get("http://localhost:5000/postCourse/techs")
        const math_response = await axios.get("http://localhost:5000/postCourse/math")
        const natsci_response = await axios.get("http://localhost:5000/postCourse/nat")
        const ise_lower_div_response = await axios.get("http://localhost:5000/postCourse/ise_lower_div")
        const ise_upper_div_response = await axios.get("http://localhost:5000/postCourse/ise_upper_div")
        const ise_write_req_response = await axios.get("http://localhost:5000/postCourse/ise_write_req")
        setCourses(response.data);
        setLd(ld_response.data);
        setUd(ud_response.data); 
        setTe(te_response.data); 
        setMath(math_response.data); 
        setNatsci(natsci_response.data); 
        setIld(ise_lower_div_response.data)
        setIud(ise_upper_div_response.data) 
        setIwr(ise_write_req_response.data)

    } catch (error) {
        console.log(error);    
    }
  } */
  

  const lower_divs = ["CSE  114", "CSE  214", "CSE  215", "CSE  216", "CSE  220"];
  const upper_divs = ["CSE  300", "CSE  303", "CSE  310", "CSE  312", "CSE  316", "CSE  320",
    "CSE  373","CSE  416"];
  const math_reqs = ["MAT  131", "MAT  132", "MAT  211", "AMS  151","AMS  161", "AMS  210", "AMS  301","AMS  310"]; 
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

    const ise_lower_divs = ["CSE  114", "CSE  214","ISE  218"]
    const ise_upper_divs = ["ISE  312", "ISE  305","ISE  316","ISE  320"]
    const ise_write_req = ["ISE  300"]

    const be_core = ["ECO  108","ACC  210"]
    const be_supp1 = ["ACC  214","ESE  201","BUS  115","BUS  215","BUS  220","BUS  294"]
    const be_supp2 = ["BUS  330","BUS  346","BUS  348","BUS  353","BUS  355","BUS  356",
                      "EST  305","EST  320", "EST  325","EST  364","EST  392","EST  393","ECO  326",
                      "ECO  348","ECO  389","POL  319","POL  359","SOC  381"]
    
    const fis_core = ["CSE  215","AMS  315","AMS  318"]
    const fis_supp = ["ACC  210","AMS  311","AMS  316","AMS  320","AMS  341","AMS  441","BUS  330","BUS  331","BUS  355",
                      "BUS  356","ISE  323","ISE  331"]
    
    const hi_core = ["HAN  200","BIO  202","BIO  203"]
    const hi_supp = ["BCP  405","BME  205","CSE  377","ECO  327","HAN  202","PSY  103"]

    const sna_core = ["ISE  311","ISE  321","ISE  331","ISE  337","ISE  488","ISE  487"]
    const sna_supp = ["ESE  442","CSE  370","EST  393","AMS  341","BUS  393","BUS 346"]

    const tsm_core = ["EST  201","EST  202","EST  391","EST  392","EST  393"]
    const tsm_supp = ["EST  310","ISE  340","EST  323","EST  326","EST  327","EST  364"]

  const terms = ["Fall","Winter","Spring","Summer"]
  function is_numeric_char(c) { return /\d/.test(c); }
  function isLetter(str) { return str.length === 1 && str.match(/[a-z]/i); }

  const onChange = e => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.delete('/postCourse')
      const res = await axios.post('/upload', formData)
      
      let str = res.data;
      console.log("Text: ")
      console.log(res.data)
      return; 
      const splitLines = str => str.split(/\r?\n/);
      const lines = splitLines(str);
     //console.log(lines); 
      var s = "";
      for (var i = 0; i < lines.length; i++) {
        if(lines[i] === "Plan:Computer Science Major"){
          setMajor("CSE")
          setIsCSE(true); 
          console.log("CSE")
        }
        if(lines[i] === "Plan:Information Systems Major"){
          setMajor("ISE")
          setIsCSE(false); 
          console.log("ISE")
        }
      }
      
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
          || math_reqs.includes(course) || nat_sci.includes(course) || ise_lower_divs.includes(course) ||
          ise_upper_divs.includes(course) || ise_write_req.includes(course) || be_core.includes(course) || 
          be_supp1.includes(course) || be_supp2.includes(course) || fis_core.includes(course) ||
          fis_supp.includes(course) || hi_core.includes(course) || hi_supp.includes(course) || 
          sna_core.includes(course) || sna_supp.includes(course) || tsm_core.includes(course) || tsm_supp.includes(course)){

       
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
            else if(ise_lower_divs.includes(course)){
              type = "ISE Lower Division";
            }
            else if(ise_upper_divs.includes(course)){
              type = "ISE Upper Division";
            }
            else if(ise_write_req.includes(course)){
              type = "ISE Writing Req";
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
 /* useEffect(() => {
    getCourses();
},[]); */ 

console.log(courses)

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
      { isCSE ? (
      <Fragment>
        <h3>Lower Division
        <table className="table mt-5 text-center"> 
        <thead>
        <tr>
          <th>Course</th>
          <th>Credits</th>
          <th>Grade</th>
          <th>Term</th>
          <th>Year</th>
        </tr>
      </thead>
      <tbody>
      {ld.map(course => (
          <tr key ={course.course}>
            <td>{course.course}</td>
            <td>{course.credits}</td>
            <td>{course.grade}</td>
            <td>{course.term}</td>
            <td>{course.year}</td>
              
          </tr>
      ))}
      </tbody>
        </table>
        </h3>
        <h3>Upper Division
        <table className="table mt-5 text-center"> 
        <thead>
        <tr>
          <th>Course</th>
          <th>Credits</th>
          <th>Grade</th>
          <th>Term</th>
          <th>Year</th>
        </tr>
      </thead>
      <tbody>
      {ud.map(course => (
          <tr key ={course.course}>
            <td>{course.course}</td>
            <td>{course.credits}</td>
            <td>{course.grade}</td>
            <td>{course.term}</td>
            <td>{course.year}</td>
              
          </tr>
      ))}
      </tbody>
        </table>
        </h3>
        <h3>Technical Electives
        <table className="table mt-5 text-center"> 
        <thead>
        <tr>
          <th>Course</th>
          <th>Credits</th>
          <th>Grade</th>
          <th>Term</th>
          <th>Year</th>
        </tr>
      </thead>
      <tbody>
      {te.map(course => (
          <tr key ={course.course}>
            <td>{course.course}</td>
            <td>{course.credits}</td>
            <td>{course.grade}</td>
            <td>{course.term}</td>
            <td>{course.year}</td>
              
          </tr>
      ))}
      </tbody>
        </table>
        </h3>
        <h3>Math requirements
        <table className="table mt-5 text-center"> 
        <thead>
        <tr>
          <th>Course</th>
          <th>Credits</th>
          <th>Grade</th>
          <th>Term</th>
          <th>Year</th>
        </tr>
      </thead>
      <tbody>
      {math.map(course => (
          <tr key ={course.course}>
            <td>{course.course}</td>
            <td>{course.credits}</td>
            <td>{course.grade}</td>
            <td>{course.term}</td>
            <td>{course.year}</td>
              
          </tr>
      ))}
      </tbody>
        </table>
        </h3>
        <h3>Natural Sciences
        <table className="table mt-5 text-center"> 
        <thead>
        <tr>
          <th>Course</th>
          <th>Credits</th>
          <th>Grade</th>
          <th>Term</th>
          <th>Year</th>
        </tr>
      </thead>
      <tbody>
      {natsci.map(course => (
          <tr key ={course.course}>
            <td>{course.course}</td>
            <td>{course.credits}</td>
            <td>{course.grade}</td>
            <td>{course.term}</td>
            <td>{course.year}</td>
              
          </tr>
      ))}
      </tbody>
        </table>
        </h3>
        </Fragment>
      ): <Fragment>
        <h3>
          Lower Division
          <table className="table mt-5 text-center"> 
        <thead>
        <tr>
          <th>Course</th>
          <th>Credits</th>
          <th>Grade</th>
          <th>Term</th>
          <th>Year</th>
        </tr>
      </thead>
      <tbody>
      {ild.map(course => (
          <tr key ={course.course}>
            <td>{course.course}</td>
            <td>{course.credits}</td>
            <td>{course.grade}</td>
            <td>{course.term}</td>
            <td>{course.year}</td>
              
          </tr>
      ))}
      </tbody>
        </table>
        </h3>
        <h3>
          Upper Division
          <table className="table mt-5 text-center"> 
        <thead>
        <tr>
          <th>Course</th>
          <th>Credits</th>
          <th>Grade</th>
          <th>Term</th>
          <th>Year</th>
        </tr>
      </thead>
      <tbody>
      {iud.map(course => (
          <tr key ={course.course}>
            <td>{course.course}</td>
            <td>{course.credits}</td>
            <td>{course.grade}</td>
            <td>{course.term}</td>
            <td>{course.year}</td>
              
          </tr>
      ))}
      </tbody>
        </table>
        </h3>
        <h3>
          Writing Requirement
          <table className="table mt-5 text-center"> 
        <thead>
        <tr>
          <th>Course</th>
          <th>Credits</th>
          <th>Grade</th>
          <th>Term</th>
          <th>Year</th>
        </tr>
      </thead>
      <tbody>
      {iwr.map(course => (
          <tr key ={course.course}>
            <td>{course.course}</td>
            <td>{course.credits}</td>
            <td>{course.grade}</td>
            <td>{course.term}</td>
            <td>{course.year}</td>
              
          </tr>
      ))}
      </tbody>
        </table>
        </h3>
        <h3>
          Math Requirements
          <table className="table mt-5 text-center"> 
        <thead>
        <tr>
          <th>Course</th>
          <th>Credits</th>
          <th>Grade</th>
          <th>Term</th>
          <th>Year</th>
        </tr>
      </thead>
      <tbody>
      {math.map(course => (
          <tr key ={course.course}>
            <td>{course.course}</td>
            <td>{course.credits}</td>
            <td>{course.grade}</td>
            <td>{course.term}</td>
            <td>{course.year}</td>
              
          </tr>
      ))}
      </tbody>
        </table>
        </h3>

      </Fragment>
      }   
  
    </Fragment>
  );
};

export default FileUpload;
