import React from 'react';

const Table = ({ arr }) => {
  return (
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
      {arr.map(course => (
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
  );
};


export default Table;
