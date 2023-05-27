import React, { Fragment, useState,useEffect } from 'react';
import Message from './Message';
import Progress from './Progress';
import axios from 'axios';
import { db } from "./firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

//const firebase = require('firebase');

const FileUpload = () => {
  const courses = [] // store course info without a database 
  const [file, setFile] = useState('');
  const [filename, setFilename] = useState('Choose File');
  const [message, setMessage] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const [isCSE, setIsCSE] = useState(false); 
  const [name, setName] = useState("")
  const [id, setId] = useState(id) 
  var foundName = false; 

  // specialization states
  const [isBe, setIsBe] = useState(false) 
  const [isHi, setIsHi] = useState(false) 
  const [isSna, setIsSna] = useState(false) 
  const [isFis, setIsFis] = useState(false) 
  const [isTsm, setIsTsm] = useState(false) 

  let isSnaVar = false
  let isFisVar = false

  //const [courses, setCourses] = useState([]);
  const [ld, setLd] = useState([]); // lower division courses
  const [ud, setUd] = useState([]); // upper division courses
  const [te, setTe] = useState([]); // technical electives
  const [math,setMath] = useState([]) // math courses
  const [natsci, setNatsci] = useState([]); // natural science courses
  
  const [ild, setIld] = useState([]) // ISE lower division courses
  const [iud, setIud] = useState([]) // ISE upper division courses
  const [iwr, setIwr] = useState([]) // ISE writing requirement 
  const [imat, setImat] = useState([]) // ISE writing requirement 
  const [isete, setIseTe] = useState([])
  const [be, setBe] = useState([])
  const [fis, setFis] = useState([])
  const [hi, setHi] = useState([])
  const [sna, setSna] = useState([])
  const [tsm, setTsm] = useState([])

  const ldCollectionRef = collection(db, "lower division");
  const udCollectionRef = collection(db, "upper division");
  const teCollectionRef = collection(db, "technical electives");
  const mathCollectionRef = collection(db, "math");
  const sciCollectionRef = collection(db, "natural sciences");

  const ildCollectionRef = collection(db, "ise lower division");
  const iudCollectionRef = collection(db, "ise upper division");
  const iwrCollectionRef = collection(db, "ise write req");
  const isemathCollectionRef = collection(db, "ise math req");
  const iseteCollectionRef = collection(db, "ise technical electives") 

  const beCollectionRef = collection(db, "business economics");
  const fisCollectionRef = collection(db, "financial information systems");
  const hiCollectionRef = collection(db, "health informatics");
  const snaCollectionRef = collection(db, "systems and network admin");
  const tsmCollectionRef = collection(db, "tech systems management");

  const lower_divs = ["CSE  114", "CSE  214", "CSE  215", "CSE  216", "CSE  220"];
  const upper_divs = ["CSE  300", "CSE  303", "CSE  310", "CSE  312", "CSE  316", "CSE  320",
    "CSE  373","CSE  416"];
  const math_reqs = ["MAT  131", "MAT  132", "MAT  211", "AMS  151","AMS  161", "AMS  210", "AMS  301","AMS  310"]; 
  const tech_electives = ["CSE 304", "CSE  305","CSE  306","CSE  307","CSE  311","CSE  323","CSE  327",
                          "CSE  328","CSE  331","CSE  332","CSE  333","CSE  334","CSE  336","CSE  337",
                          "CSE  351","CSE  352","CSE  353","CSE  354","CSE  355","CSE  356","CSE  360",
                            "CSE  361","CSE  362","CSE  363","CSE  364","CSE  366","CSE  370","CSE  376",
                            "CSE  377","CSE  380","CSE  381","CSE  487","CSE  390","CSE  488",
                            ]

    const nat_sci = ["AST  203", "AST  205",
    "BIO  201","BIO  204","BIO  202","BIO  203",
    "CHE  131","CHE  133","CHE  132","CHE  152","CHE  154","CHE  321","CHE  322","CHE  322","CHE  331","CHE  332",
    "GEO  102","GEO  103","GEO  112","GEO  113","GEO  122",
    "PHY  125","PHY  127","PHY  133","PHY  131","PHY  132","PHY  141","PHY  134","PHY  142","PHY  251","PHY  252"]

    const ise_lower_divs = ["CSE  114", "CSE  214","ISE  218"]
    const ise_upper_divs = ["ISE  312", "ISE  305","ISE  316","ISE  320"]
    const ise_write_req = ["ISE  300"]
    const ise_math = ["MAT  131", "MAT  132", "MAT  211", "AMS  151","AMS  161", "AMS  210", "AMS  310"]; 
    const ise_tech_electives = ["ISE  316", "ISE  317", "ISE  323",
                            "ISE  332","ISE  333","ISE  334", "ISE  339","ISE  340","ISE  364", "ISE  377",
                            "ISE  377","ISE  378","ISE  390","ISE  391","ISE  392","ISE  487", "ISE  488",
                            "CSE 304", "CSE  305","CSE  306","CSE  307","CSE  311","CSE  323","CSE  327",
                          "CSE  328","CSE  331","CSE  332","CSE  333","CSE  334","CSE  336","CSE  337",
                          "CSE  351","CSE  352","CSE  353","CSE  354","CSE  355","CSE  356","CSE  360",
                            "CSE  361","CSE  362","CSE  363","CSE  364","CSE  366","CSE  370","CSE  376",
                            "CSE  377","CSE  380","CSE  381","CSE  487","CSE  390","CSE  488",]


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

  function is_numeric_char(c) { return /\d/.test(c); }
  function isLetter(str) { return str.length === 1 && str.match(/[a-z]/i); }

  const deleteCollection = async (collection, id) => {
    const userDoc = doc(db, collection, id);
    await deleteDoc(userDoc);
  };

  const deleteCourses = async () => {
    var data = await getDocs(ldCollectionRef);
    for(var i = 0; i < data.docs.length; i++){
      deleteCollection("lower division", data.docs[i].id)
    }
    data = await getDocs(udCollectionRef);
    for(i = 0; i < data.docs.length; i++){
      deleteCollection("upper division", data.docs[i].id)
    }
    data = await getDocs(teCollectionRef);
    for(i = 0; i < data.docs.length; i++){
      deleteCollection("technical electives", data.docs[i].id)
    }
    data = await getDocs(mathCollectionRef);
    for(i = 0; i < data.docs.length; i++){
      deleteCollection("math", data.docs[i].id)
    }
    data = await getDocs(sciCollectionRef);
    for(i = 0; i < data.docs.length; i++){
      deleteCollection("natural sciences", data.docs[i].id)
    }
    data = await getDocs(ildCollectionRef);
    for(i = 0; i < data.docs.length; i++){
      deleteCollection("ise lower division", data.docs[i].id)
    }
    data = await getDocs(iudCollectionRef);
    for(i = 0; i < data.docs.length; i++){
      deleteCollection("ise upper division", data.docs[i].id)
    }
    data = await getDocs(iwrCollectionRef);
    for(i = 0; i < data.docs.length; i++){
      deleteCollection("ise write req", data.docs[i].id)
    }
    data = await getDocs(isemathCollectionRef);
    for(i = 0; i < data.docs.length; i++){
      deleteCollection("ise math req", data.docs[i].id)
    }
    data = await getDocs(iseteCollectionRef);
    for(i = 0; i < data.docs.length; i++){
      deleteCollection("ise technical electives", data.docs[i].id)
    }

    data = await getDocs(beCollectionRef);
    for(i = 0; i < data.docs.length; i++){
      deleteCollection("business economics", data.docs[i].id)
    }
    data = await getDocs(fisCollectionRef);
    for(i = 0; i < data.docs.length; i++){
      deleteCollection("financial information systems", data.docs[i].id)
    }
    data = await getDocs(hiCollectionRef);
    for(i = 0; i < data.docs.length; i++){
      deleteCollection("health informatics", data.docs[i].id)
    }
    data = await getDocs(snaCollectionRef);
    for(i = 0; i < data.docs.length; i++){
      deleteCollection("systems and network admin", data.docs[i].id)
    }
    data = await getDocs(tsmCollectionRef);
    for(i = 0; i < data.docs.length; i++){
      deleteCollection("tech systems management", data.docs[i].id)
    }
  };

  /**
   * Checks if a given course is already in a given collection
   * @param {*} collection 
   * @param {*} name 
   * @returns index of the existing doc in data.docs if the name is in the given collection, -1 otherwise
   */
  const checkDup = async (collection, name) => {
    var data = await getDocs(collection);
    for(var i = 0; i < data.docs.length; i++){
      const doc = data.docs[i];
      const doc_name = doc.get('name'); 
      if(name === doc_name){
        return i; 
      }
    }
    return -1; 
  }

  const addCourse = async (collection, data, name) => {

    const i = checkDup(collection, name);
  //  console.log(`collection: ${collection}`)
   // console.log(`data: ${data}`)

    if(i !== -1){
    //  console.log("adding doc");
      await addDoc(collection, data);
    }
    else{
      var data = await getDocs(collection);
      console.log("updating doc")
      const doc = data.docs[i] // get the current doc using return value from checkDup 
      await updateDoc(doc, data)
    }

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

      deleteCourses()

      const res = await axios.post('/upload', formData)
      
      let str = res.data;
      const splitLines = str => str.split(/\r?\n/);
      const lines = splitLines(str);
      var s = "";
      for (var i = 0; i < lines.length; i++) {

        if(lines[i] === "Plan:Computer Science Major"){
          setIsCSE(true); 
          console.log("CSE")
        }
        if(lines[i] === "Plan:Information Systems Major"){
          setIsCSE(false) 
        }
        if(lines[i] === "Plan:System and Network Administration Specialization"){
          setIsSna(true)
          isSnaVar = true
        }
        if(lines[i] === "Plan:Business Economics Specialization"){
          setIsBe(true)
        }
        if(lines[i] === "Plan:Health Informatics Specialization"){
          setIsHi(true)
        }
        if(lines[i] === "Plan:Technological Systems Management Specialization"){
          setIsTsm(true)
        }
        if(lines[i] === "Plan:Financial Information Systems Specialization"){
          setIsFis(true)
          isFisVar = true
        }
      }

      isSnaVar = true
      console.log(isSnaVar)

      for(i = 0; i < lines.length;i++){
        var b = lines[i].substring(0,4);
        if(b === "Name"){
          let j = i + 2;
          while(lines[i][j] === " "){
            j++; 
          }
          console.log(foundName)
          if(foundName === false){
            console.log(lines[i].substring(j)); 
            let name = lines[i].substring(j);
            setName(name)
            break;
          }
        }
      }

      for(i = 0; i < lines.length;i++){
        b = lines[i].substring(0,7);
        console.log(b)
        if(b === "Student"){
          let j = i + 5;
          while(!is_numeric_char(lines[i][j])){
            j++; 
          }
          console.log(lines[i].substring(j)); 
          let id = lines[i].substring(j);
          setId(id)
          
          break;
          
        }
      }


      for (var i = 0; i < lines.length; i++) {

            var b = "";
            b = lines[i].substring(0,4); 
            
            if(b === "Fall" || b === "Wint" || b === "Spri" || b === "Summ"){
              b = lines[i]
              s = b;
            }

            if(lines[i].length >= 8){
          const course = lines[i].substring(0,8);

          if(lower_divs.includes(course) || upper_divs.includes(course) || tech_electives.includes(course) 
          || math_reqs.includes(course) || nat_sci.includes(course) || ise_lower_divs.includes(course) ||
          ise_upper_divs.includes(course) || ise_write_req.includes(course) || be_core.includes(course) || 
          be_supp1.includes(course) || be_supp2.includes(course) || fis_core.includes(course) ||
          fis_supp.includes(course) || hi_core.includes(course) || hi_supp.includes(course) || ise_tech_electives.includes(course) ||
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
            const data = { name: course, credits: Number(credits), grade: grade, term: season, year: year }
            if(lower_divs.includes(course)){
              await addCourse(ldCollectionRef, data, course);
            }
            else if(upper_divs.includes(course)){
              await addCourse(udCollectionRef, data, course);
            }
            else if(math_reqs.includes(course)){
              await addCourse(mathCollectionRef, data, course);
            }
            else if(tech_electives.includes(course)){
              await addCourse(teCollectionRef, data, course);
            }
            else if(nat_sci.includes(course)){
              await addCourse(sciCollectionRef, data, course);
            }

            if(ise_lower_divs.includes(course)){
              await addCourse(ildCollectionRef, data, course);
            }
            else if(ise_upper_divs.includes(course)){
              await addCourse(iudCollectionRef, data, course);
            }
            else if(ise_write_req.includes(course)){
              await addCourse(iwrCollectionRef, data, course);
            }
            if(ise_math.includes(course)){
              await addCourse(isemathCollectionRef, data, course);
            }
            if(ise_tech_electives.includes(course)){

              /* Check if the course should be listed as a specialization or as an elective */
              if(fis_supp.includes(course) && isFisVar === true){
                await addCourse(fisCollectionRef, data, course);
              }
              else if(sna_core.includes(course) && isSnaVar === true){
                await addCourse(snaCollectionRef, data, course);
              }
              else{
                await addCourse(iseteCollectionRef, data, course);
              }
              
            }

            if(be_core.includes(course) || be_supp1.includes(course) || be_supp2.includes(course)){
              await addCourse(beCollectionRef, data, course);
            }
            if(fis_core.includes(course) || fis_supp.includes(course)){
              await addCourse(fisCollectionRef, data, course);
            }
            if(hi_core.includes(course) || hi_supp.includes(course)){
              await addCourse(hiCollectionRef, data, course);
            }
            if(sna_core.includes(course) || sna_supp.includes(course)){
              await addCourse(snaCollectionRef, data, course);
            }
            if(tsm_core.includes(course) || tsm_supp.includes(course)){
              await addCourse(tsmCollectionRef, data, course);
            }
          }
        }
      }
      let k = 0
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

  useEffect(() => {
    const getCourses = async () => {
      const ldData = await getDocs(ldCollectionRef);
      setLd(ldData.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      const udData = await getDocs(udCollectionRef);
      setUd(udData.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      const teData = await getDocs(teCollectionRef);
      setTe(teData.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      const mathData = await getDocs(mathCollectionRef);
      setMath(mathData.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      const natData = await getDocs(sciCollectionRef);
      setNatsci(natData.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

      const ildData = await getDocs(ildCollectionRef);
      setIld(ildData.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      const iudData = await getDocs(iudCollectionRef);
      setIud(iudData.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      const iwrData = await getDocs(iwrCollectionRef);
      setIwr(iwrData.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      const imathData = await getDocs(isemathCollectionRef);
      setImat(imathData.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      const iseteData = await getDocs(iseteCollectionRef);
      setIseTe(iseteData.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

      const beData = await getDocs(beCollectionRef);
      setBe(beData.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      const fisData = await getDocs(fisCollectionRef);
      setFis(fisData.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      const hiData = await getDocs(hiCollectionRef);
      setHi(hiData.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      const snaData = await getDocs(snaCollectionRef);
      setSna(snaData.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      const tsmData = await getDocs(tsmCollectionRef);
      setTsm(tsmData.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getCourses();
},[]);

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
      <h3>Name: {name}</h3>
      <h3>Id: {id}</h3>
      { isCSE ? (
      <Fragment>
        CSE major
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
            <td>{course.name}</td>
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
            <td>{course.name}</td>
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
            <td>{course.name}</td>
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
            <td>{course.name}</td>
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
            <td>{course.name}</td>
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
        
      ) : (
        <Fragment>
        ISE Major
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
      {ild.map(course => (
          <tr key ={course.course}>
            <td>{course.name}</td>
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
      {iud.map(course => (
          <tr key ={course.course}>
            <td>{course.name}</td>
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
      {imat.map(course => (
          <tr key ={course.course}>
            <td>{course.name}</td>
            <td>{course.credits}</td>
            <td>{course.grade}</td>
            <td>{course.term}</td>
            <td>{course.year}</td>
              
          </tr>
      ))}
      </tbody>
        </table>
        </h3>
        <h3>Writing requirement
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
            <td>{course.name}</td>
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
      {isete.map(course => (
          <tr key ={course.course}>
            <td>{course.name}</td>
            <td>{course.credits}</td>
            <td>{course.grade}</td>
            <td>{course.term}</td>
            <td>{course.year}</td>
              
          </tr>
      ))}
      </tbody>
        </table>
        </h3>
        { isBe ? ( 
          <h3>Specialization in Business Economics
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
        {be.map(course => (
            <tr key ={course.course}>
              <td>{course.name}</td>
              <td>{course.credits}</td>
              <td>{course.grade}</td>
              <td>{course.term}</td>
              <td>{course.year}</td>
                
            </tr>
        ))}
        </tbody>
          </table>
          </h3>
        ) : (<div></div>)
      }
        { isHi ? ( 
          <h3>Specialization in Health Informatics
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
        {hi.map(course => (
            <tr key ={course.course}>
              <td>{course.name}</td>
              <td>{course.credits}</td>
              <td>{course.grade}</td>
              <td>{course.term}</td>
              <td>{course.year}</td>
                
            </tr>
        ))}
        </tbody>
          </table>
          </h3>
          ) : (<div></div>)
      }
      { isSna ? ( 
          <h3>Specialization in Systems and Network Administration
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
        {sna.map(course => (
            <tr key ={course.course}>
              <td>{course.name}</td>
              <td>{course.credits}</td>
              <td>{course.grade}</td>
              <td>{course.term}</td>
              <td>{course.year}</td>
                
            </tr>
        ))}
        </tbody>
          </table>
          </h3>
        ) : (<div></div>)
      }
      { isFis ? ( 
        <h3>Specialization in Financial Information Systems
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
      {fis.map(course => (
          <tr key ={course.course}>
            <td>{course.name}</td>
            <td>{course.credits}</td>
            <td>{course.grade}</td>
            <td>{course.term}</td>
            <td>{course.year}</td>
              
          </tr>
      ))}
      </tbody>
        </table>
        </h3>

        ) : (<div></div>)
      }

      { isTsm ? ( 
        <h3>Specialization in Technological Systems Management
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
      {tsm.map(course => (
          <tr key ={course.course}>
            <td>{course.name}</td>
            <td>{course.credits}</td>
            <td>{course.grade}</td>
            <td>{course.term}</td>
            <td>{course.year}</td>
              
          </tr>
      ))}
      </tbody>
        </table>
        </h3>
        ) : (<div></div>)
      }
        </Fragment>
      )
      } 
  
    </Fragment>
  );
};

export default FileUpload;