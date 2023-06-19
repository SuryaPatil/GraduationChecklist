import React, { Fragment, useState,useEffect } from 'react';
import Message from './Message';
import Progress from './Progress';
import Table from './table'
import axios from 'axios';
import {db} from "./firebase-config"
import {
  collection,
  getDocs,
  addDoc,
  getDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

//const firebase = require('firebase');

const FileUpload = () => {
  const [file, setFile] = useState('');
  const [filename, setFilename] = useState('Choose File');
  const [message, setMessage] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const [isCSE, setIsCSE] = useState(0); 
  const [name, setName] = useState("")
  const [id, setId] = useState("") 
  var foundName = false; 

  // specialization states
  const [isBE, setIsBE] = useState(false) 
  const [isHI, setIsHI] = useState(false) 
  const [isSNA, setIsSNA] = useState(false) 
  const [isFIS, setIsFIS] = useState(false) 
  const [isTSM, setIsTSM] = useState(false) 

  //const [courses, setCourses] = useState([]);
  const [CSEUD, setCSEUD] = useState([]); // upper division courses
  const [CSELD, setCSELD] = useState([]); // lower division courses
  const [CSEMath, setCSEMath] = useState([]);
  const [CSETE, setCSETE] = useState([])
  const [sci, setSci] = useState([])

  const [ISEUD, setISEUD] = useState([])
  const [ISELD, setISELD] = useState([])
  const [ISEMath, setISEMath] = useState([])

  /* ISE specializations */
  const [SNA, setSNA] = useState([])

  const infoRef = collection(db, "Student Info")
  const CSEUDRef = collection(db, "cse upper division");
  const CSELDRef = collection(db, "cse lower division");
  const CSEMathRef = collection(db, "cse math");
  const CSETERef = collection(db, "cse technical electives");
  const sciRef = collection(db, "science")
  const ISELDRef = collection(db, "ise lower division");
  const ISEUDRef = collection(db, "ise upper division");
  const ISEMathRef = collection(db, "ise math")
  const SNARef = collection(db, "systems and network admin");

  var num_cse_electives = 0 // how many cse technical electives the student has taken
  var num_sci = 0

  const lower_divs = ["CSE  114", "CSE  214", "CSE  215", "CSE  216", "CSE  220"];
  const upper_divs = ["CSE  300", "CSE  303", "CSE  310", "CSE  312", "CSE  316", "CSE  320",
    "CSE  373","CSE  416"];
  const cse_math = ["MAT  131", "MAT  132", "MAT  211", "AMS  151","AMS  161", "AMS  210", "AMS  301","AMS  310"]; 
  const cse_tech_electives = ["CSE 304", "CSE  305","CSE  306","CSE  307","CSE  311","CSE  323","CSE  327",
                          "CSE  328","CSE  331","CSE  332","CSE  333","CSE  334","CSE  336","CSE  337",
                          "CSE  351","CSE  352","CSE  353","CSE  354","CSE  355","CSE  356","CSE  360",
                            "CSE  361","CSE  362","CSE  363","CSE  364","CSE  366","CSE  370","CSE  376",
                            "CSE  377","CSE  380","CSE  381","CSE  487","CSE  390","CSE  488",
                            ]

    const nat_sci = ["AST  203", "AST  205",
    "BIO  201","BIO  202","BIO  203",
    "CHE  131","CHE  132","CHE  152","CHE  321","CHE  322","CHE  322","CHE  331","CHE  332",
    "GEO  102","GEO  103","GEO  112","GEO  113","GEO  122",
    "PHY  125","PHY  127","PHY  131","PHY  132","PHY  141","PHY  134","PHY  142","PHY  251","PHY  252"]

    const labs = ["BIO  204", "CHE  133", "CHE  154","PHY  133"]

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

    if(i !== -1){
      await addDoc(collection, data);
    }
    else{
      var data = await getDocs(collection);
      const doc = data.docs[i] // get the current doc using return value from checkDup 
      await updateDoc(doc, data)
    }

  }

  const resetCollection = async (arr, collection) => {
    try {
      for(var i = 0; i < arr.length; i++){
        const docRef = doc(db, collection, arr[i]);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          //console.log("Document data:", docSnap.data());
                  var fields ={ name: docSnap.data().name, credits: docSnap.data().credits, 
                    year: "", term: "", grade: "" }
          await updateDoc(docRef,fields)
        } else {
          console.log("No such document!");
        }
      }

    } catch (error) {
      console.log(error)
    }
  }

  const resetMath = async () => {
    var name = "MAT 125/MAT 131/AMS 151"
    var fields ={ name: name, credits: 4, year: "", term: "", grade: "" }
    var docRef = doc(db, "cse math", "Calc I");
    var iseDocRef = doc(db, "ise math", "Calc I");
    await updateDoc(docRef,fields)
    await updateDoc(iseDocRef,fields)

    name = "MAT 127/MAT 132/AMS 161"
    docRef = doc(db, "cse math", "Calc II");
    fields ={ name: name, credits: 4, year: "", term: "", grade: "" }
    iseDocRef = doc(db, "ise math", "Calc II");
    await updateDoc(docRef,fields)
    await updateDoc(iseDocRef,fields)

    name = "MAT 211/AMS 210"
    docRef = doc(db, "cse math", "LinAlg");
    fields ={ name: name, credits: 3, year: "", term: "", grade: "" }
    iseDocRef = doc(db, "ise math", "LinAlg");
    await updateDoc(docRef,fields)
    await updateDoc(iseDocRef,fields)

    name = "AMS 310"
    docRef = doc(db, "cse math", "Stats");
    iseDocRef = doc(db, "ise math", "Stats");
    fields ={ name: name, credits: 3, year: "", term: "", grade: "" }
    await updateDoc(docRef,fields)
    name = "AMS 110/AMS 310/ECO 320"
    fields ={ name: name, credits: 3, year: "", term: "", grade: "" }
    await updateDoc(iseDocRef, fields)

    name = "AMS 301"
    docRef = doc(db, "cse math", "Comb");
    fields ={ name: name, credits: 3, year: "", term: "", grade: "" }
    await updateDoc(docRef,fields)    
  }

  const resetTE = async () => {
    var fields ={ name: "1", credits: 3, year: "", term: "", grade: "" }
    var docRef = doc(db, "cse technical electives", "1");
    await updateDoc(docRef,fields)  

    fields ={ name: "2", credits: 3, year: "", term: "", grade: "" }
    docRef = doc(db, "cse technical electives", "2");
    await updateDoc(docRef,fields)  

    fields ={ name: "3", credits: 3, year: "", term: "", grade: "" }
    docRef = doc(db, "cse technical electives", "3");
    await updateDoc(docRef,fields)  

    fields ={ name: "4", credits: 3, year: "", term: "", grade: "" }
    docRef = doc(db, "cse technical electives", "4");
    await updateDoc(docRef,fields)  
  }
  const resetSci = async () => {
    var fields ={ name: "1", credits: 3, year: "", term: "", grade: "" }
    var docRef = doc(db, "science", "1");
    await updateDoc(docRef,fields)  

    fields ={ name: "2", credits: 3, year: "", term: "", grade: "" }
    docRef = doc(db, "science", "2");
    await updateDoc(docRef,fields)  

    fields ={ name: "3", credits: 3, year: "", term: "", grade: "" }
    docRef = doc(db, "science", "3");
    await updateDoc(docRef,fields)  

    fields ={ name: "Lab", credits: 3, year: "", term: "", grade: "" }
    docRef = doc(db, "science", "Lab");
    await updateDoc(docRef,fields)  
  }
  const resetISEUD = async () => {
    var name = "ISE 305"
    var fields ={ name: name, credits: 4, year: "", term: "", grade: "" }
    var docRef = doc(db, "ise upper division", "ISE  305");
    await updateDoc(docRef,fields)

    name = "ISE 312"
    fields ={ name: name, credits: 4, year: "", term: "", grade: "" }
    docRef = doc(db, "ise upper division", "ISE  312");
    await updateDoc(docRef,fields)

    name = "ISE 320/BUS 340"
    fields ={ name: name, credits: 4, year: "", term: "", grade: "" }
    docRef = doc(db, "ise upper division", "Management");
    await updateDoc(docRef,fields)

    name = "CSE 310/ISE 316"
    fields ={ name: name, credits: 4, year: "", term: "", grade: "" }
    docRef = doc(db, "ise upper division", "Networking");
    await updateDoc(docRef,fields)
  }
  const resetSNA = async () => {

    var name = "ISE 311"
    var fields ={ name: name, credits: 3, year: "", term: "", grade: "" }
    var docRef = doc(db, "systems and network admin", "ISE  311");
    await updateDoc(docRef,fields)

    name = "ISE 321"
    fields ={ name: name, credits: 3, year: "", term: "", grade: "" }
    docRef = doc(db, "systems and network admin", "ISE  321");
    await updateDoc(docRef,fields)

    name = "ISE 487/488"
    fields ={ name: name, credits: 3, year: "", term: "", grade: "" }
    docRef = doc(db, "systems and network admin", "Research or Internship");
    await updateDoc(docRef,fields)

    name = "CSE/ISE 337"
    fields ={ name: name, credits: 3, year: "", term: "", grade: "" }
    docRef = doc(db, "systems and network admin", "Scripting Languages");
    await updateDoc(docRef,fields)

    name = "CSE/ISE 331"
    fields ={ name: name, credits: 3, year: "", term: "", grade: "" }
    docRef = doc(db, "systems and network admin", "Security");
    await updateDoc(docRef,fields)

    name = "Varies"
    fields ={ name: name, credits: 3, year: "", term: "", grade: "" }
    docRef = doc(db, "systems and network admin", "Sixth Req");
    await updateDoc(docRef,fields)
  }

  const resetSpecs = async () => {
    var data = {SNA: false}
    var docRef = doc(db, "Student Info", "Specialization");
    await updateDoc(docRef, data)
    data = {BE: false}
    docRef = doc(db, "Student Info", "Specialization");
    await updateDoc(docRef, data)
    data = {TSM: false}
    docRef = doc(db, "Student Info", "Specialization");
    await updateDoc(docRef, data)
    data = {HI: false}
    docRef = doc(db, "Student Info", "Specialization");
    await updateDoc(docRef, data)
    data = {FIS: false}
    docRef = doc(db, "Student Info", "Specialization");
    await updateDoc(docRef, data)


  }

  const updateCourse = async (id, data, collection) => {
    try{
      var term = ""
      var year = ""
      if(data.grade === "T"){
        term = data.term
        let i = 0
        for(i = 0; i < term.length;i++){
          if(is_numeric_char(term[i])){
            break;
          }
          term = data.term.substring(0,i)
          year = data.term.substring(i)
        }
        
        data = { name: data.name, credits: Number(data.credits), grade: data.grade, term: term, year: year }
      }
      const courseDoc = doc(db, collection, id);
      await updateDoc(courseDoc, data);
    }catch(e){
      console.log(e)
    }
  };

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

        if(lines[i] === "Plan:Computer Science Major"){
          let data = {CSE: true}
          const docRef = doc(db, "Student Info", "Major");
          await updateDoc(docRef, data)
          console.log("CSE")
        }
        if(lines[i] === "Plan:Information Systems Major"){
          let data = {CSE: false}
          const docRef = doc(db, "Student Info", "Major");
          await updateDoc(docRef, data)
        }
        if(lines[i] === "Plan:System and Network Administration Specialization"){
          console.log("Plan:System and Network Administration Specialization")
          let data = {SNA: true}
          const docRef = doc(db, "Student Info", "Specialization");
          await updateDoc(docRef, data)
        }
        if(lines[i] === "Plan:Business Economics Specialization"){
          console.log("Plan:Business Economics Specialization")
          let data = {BE: true}
          const docRef = doc(db, "Student Info", "Specialization");
          await updateDoc(docRef, data)
        }
        if(lines[i] === "Plan:Health Informatics Specialization"){
          console.log("Plan:Health Informatics Specialization")
          let data = {HI: true}
          const docRef = doc(db, "Student Info", "Specialization");
          await updateDoc(docRef, data)
        }
        if(lines[i] === "Plan:Technological Systems Management Specialization"){
          console.log("Plan:Technological Systems Management Specialization")
          let data = {TSM: true}
          const docRef = doc(db, "Student Info", "Specialization");
          await updateDoc(docRef, data)
        }
        if(lines[i] === "Plan:Financial Information Systems Specialization"){
          console.log("Plan:Financial Information Systems Specialization")
          let data = {FIS: true}
          const docRef = doc(db, "Student Info", "Specialization");
          await updateDoc(docRef, data)
        }
      }


      for(i = 0; i < lines.length;i++){
        var b = lines[i].substring(0,4);
        if(b === "Name"){
          let j = i + 2;
          while(lines[i][j] === " "){
            j++; 
          }
          if(foundName === false){
            let name = lines[i].substring(j);
            const docRef = doc(db, "Student Info", "Name")
            var f = { name: name }
            await updateDoc(docRef,f)
            break;
          }
        }
      }

      for(i = 0; i < lines.length;i++){
        b = lines[i].substring(0,7);
        if(b === "Student"){
          let j = i + 5;
          while(!is_numeric_char(lines[i][j])){
            j++; 
          }
          let id = lines[i].substring(j);
          const docRef = doc(db, "Student Info", "ID")
          var f = { id: id }
          await updateDoc(docRef,f)          
          break;
          
        }
      }

      await resetCollection(upper_divs, "cse upper division")
      await resetCollection(lower_divs, "cse lower division")
      await resetCollection(lower_divs, "ise lower division")
      await resetMath()
      await resetTE()
      await resetSci()
      await resetISEUD()
      await resetSNA()
      await resetSpecs()

      for (var i = 0; i < lines.length; i++) {

          
            b = "";
            b = lines[i].substring(0,4); 
            
            if(b === "Fall" || b === "Wint" || b === "Spri" || b === "Summ"){
              b = lines[i]
              s = b;
            }

            if(lines[i].length >= 8){
          const course = lines[i].substring(0,8);

          if(lower_divs.includes(course) || upper_divs.includes(course) || cse_tech_electives.includes(course) 
          || cse_math.includes(course) || nat_sci.includes(course) || ise_lower_divs.includes(course) ||
          ise_upper_divs.includes(course) || ise_write_req.includes(course) || be_core.includes(course) || labs.includes(course) ||
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
            var name = course.substring(0,4)+" "+course.substring(5)
            year = year.toString()
            const data = { name: name, credits: Number(credits), grade: grade, term: season, year: year }
            if(lower_divs.includes(course)){
              await updateCourse(name, data, "cse lower division");
            }
            if(upper_divs.includes(course)){
              await updateCourse(name, data, "cse upper division");
            }
            if(cse_math.includes(course)){
              if(course === "MAT  131" || course === "AMS  151" || course === "MAT  125"){
                const docRef = doc(db, "cse math", "Calc I")
                await updateDoc(docRef,data)
              }
              if(course === "MAT  132" || course === "AMS  161" || course === "MAT  127"){
                const docRef = doc(db, "cse math", "Calc II")
                await updateDoc(docRef,data)
              }
              if(course === "MAT  211" || course === "AMS  210"){
                const docRef = doc(db, "cse math", "LinAlg")
                await updateDoc(docRef,data)
              }
              if(course === "AMS  310"){
                const docRef = doc(db, "cse math", "Stats")
                await updateDoc(docRef,data)
              }
              if(course === "AMS  301"){
                const docRef = doc(db, "cse math", "Comb")
                await updateDoc(docRef,data)
              }
            }
            if(cse_tech_electives.includes(course)){
              if(num_cse_electives <= 4){
                num_cse_electives += 1
                if(num_cse_electives === 1){
                  const docRef = doc(db, "cse technical electives", "1")
                  await updateDoc(docRef,data)
                }
                else if(num_cse_electives === 2){
                  const docRef = doc(db, "cse technical electives", "2")
                  await updateDoc(docRef,data)
                }
                else if(num_cse_electives === 3){
                  const docRef = doc(db, "cse technical electives", "3")
                  await updateDoc(docRef,data)
                }
                else if(num_cse_electives === 4){
                  const docRef = doc(db, "cse technical electives", "4")
                  await updateDoc(docRef,data)
                }
              }
            }
            if(nat_sci.includes(course)){
              if(num_sci <= 3){
                num_sci += 1
                if(num_sci === 1){
                  const docRef = doc(db, "science", "1")
                  await updateDoc(docRef,data)
                }
                else if(num_sci === 2){
                  const docRef = doc(db, "science", "2")
                  await updateDoc(docRef,data)
                }
                else if(num_sci === 3){
                  const docRef = doc(db, "science", "3")
                  await updateDoc(docRef,data)
                }
              }
            }
            if(labs.includes(course)){
              console.log("lab")
              const docRef = doc(db, "science", "Lab")
              await updateDoc(docRef,data)
            }


            /* Check for ISE courses */
            if(ise_lower_divs.includes(course)){
              await updateCourse(name, data, "ise lower division");
            }
            if(ise_upper_divs.includes(course)){
              if(course === "ISE  305" || course === "ISE  312"){
                await updateCourse(name, data, "ise upper division");
              }
              if(course === "ISE  320" || course === "BUS  340"){
                const docRef = doc(db, "ise upper division", "Management")
                await updateDoc(docRef,data)
              }
              if(course === "CSE  310" || course === "ISE  316"){
                const docRef = doc(db, "ise upper division", "Networking")
                await updateDoc(docRef,data)
              }
            }
            if(ise_math.includes(course)){
              console.log("ise math")
              if(course === "MAT  131" || course === "AMS  151" || course === "MAT  125"){
                const docRef = doc(db, "ise math", "Calc I")
                await updateDoc(docRef,data)
              }
              if(course === "MAT  132" || course === "AMS  161" || course === "MAT  127"){
                const docRef = doc(db, "ise math", "Calc II")
                await updateDoc(docRef,data)
              }
              if(course === "MAT  211" || course === "AMS  210"){
                const docRef = doc(db, "ise math", "LinAlg")
                await updateDoc(docRef,data)
              }
              if(course === "AMS  310" || course === "ECO  320" || course === "AMS  110"){
                const docRef = doc(db, "ise math", "Stats")
                await updateDoc(docRef,data)
              }
            }
            if(sna_core.includes(course)){
              if(course === "ISE  311" || course === "ISE  321"){
                await updateCourse(name, data, "systems and network admin");
              }
              if(course === "ISE  487" || course === "ISE  488"){
                  const docRef = doc(db, "systems and network admin", "Research or Internship")
                  await updateDoc(docRef,data)
              }
              if(course === "CSE  331" || course === "ISE  331"){
                  const docRef = doc(db, "systems and network admin", "Security")
                  await updateDoc(docRef,data)
              }
              if(course === "CSE  337" || course === "ISE  337"){
                  const docRef = doc(db, "systems and network admin", "Scripting Languages")
                  await updateDoc(docRef,data)
              }
            }
            if(sna_supp.includes(course)){
              const docRef = doc(db, "systems and network admin", "Sixth Req")
              await updateDoc(docRef,data)
            }
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

  useEffect(() => {
    const getCourses = async () => {
       var info = await getDocs(CSEUDRef);
       setCSEUD(info.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
       info = await getDocs(CSELDRef);
       setCSELD(info.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
       info = await getDocs(CSEMathRef);
       setCSEMath(info.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
       info = await getDocs(CSETERef);
       setCSETE(info.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
       info = await getDocs(sciRef);
       setSci(info.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

       info = await getDocs(ISEUDRef);
       setISEUD(info.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
       info = await getDocs(ISELDRef);
       setISELD(info.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
       info = await getDocs(ISEMathRef);
       setISEMath(info.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

       info = await getDocs(SNARef);
       setSNA(info.docs.map((doc) => ({ ...doc.data(), id: doc.id })));


       
       let nameRef = doc(db, "Student Info", "Name")
       let nameDoc = await getDoc(nameRef)
       setName(await nameDoc.data().name)
       let idRef = doc(db, "Student Info", "ID")
       let idDoc = await getDoc(idRef)
       setId(await idDoc.data().id)
       let majorRef = doc(db, "Student Info", "Major")
       let majorDoc = await getDoc(majorRef)
       setIsCSE(await majorDoc.data().CSE)

       let specRef = doc(db, "Student Info", "Specialization")
       let specDoc = await getDoc(specRef)
       setIsBE(await specDoc.data().BE)
       setIsSNA(await specDoc.data().SNA)
       setIsHI(await specDoc.data().HI)
       setIsTSM(await specDoc.data().TSM)
       setIsFIS(await specDoc.data().FIS)

       console.log(CSEUD)

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
          <Table arr = {CSELD}/>
        </h3>
        <h3>Upper Division
          <Table arr = {CSEUD}/>
        </h3>
        <h3>Math
          <Table arr = {CSEMath}/> 
        </h3>
        <h3>Technical Electives
          <Table arr = {CSETE}/> 
        </h3>
        <h3>Natural Sciences
          <Table arr = {sci}/> 
        </h3>
      </Fragment>
        
      ) : (
        <Fragment>
        ISE Major
        <h3>Lower Division
          <Table arr = {ISELD}/>
        </h3>
        <h3>Upper Division
          <Table arr = {ISEUD}/>
        </h3>
        <h3>Math
          <Table arr = {ISEMath}/>
        </h3>
        { isBE ? ( 
          <h3>Specialization in Business Economics
          
          </h3>
        ) : (<div></div>)
      }
        { isHI ? ( 
          <h3>Specialization in Health Informatics
         
          </h3>
          ) : (<div></div>)
      }
      { isSNA ? ( 
          <h3>Specialization in Systems and Network Administration
            <Table arr = {SNA}/>
          </h3>
        ) : (<div></div>)
      }
      { isFIS ? ( 
        <h3>Specialization in Financial Information Systems
       
        </h3>

        ) : (<div></div>)
      }

      { isTSM ? ( 
        <h3>Specialization in Technological Systems Management
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