// import React from "react";
//  import  "./Piechart.css";
// const Pie = () => {
//     const data = {
//         labels: ['English', 'GK', 'Math', 'Social', 'Science'],
//         datasets: [{
//           data: [20, 30, 10, 20, 20],
//           backgroundColor: ['#ff0000', '#800080', '#0000ff', '#00ff00', '#ff00ff'],
//           borderColor: ['#ffffff'],
//           borderWidth: 1,
//         }]
//       };

//       const options = {
//         plugins: {
//           legend: {
//             position: 'right',
//             labels: {
//               font: {
//                 size: 14,
//                 weight: 'bold'
//               }
//             }
//           }
//         }
//       };
// return (
//         <div className="container">
//           <div className="content">
//             <h1>Think</h1>
//             <div className="welcome-text">★ Welcome Raj Kumar</div>
//             <div className="sub-text">Let's make learning awesome!</div>
//             <div className="foundation">Foundation Thinkers</div>
//             <div className="age">Age 5-8 years</div>
//             <select className="dropdown">
//               <option>Beginner</option>
//             </select>
//             <button className="start-button">Start</button>
//           </div>
//           <div className="pie-chart">
//             <Pie data={data} options={options} />
//           </div>

          
//         </div>

        
// )
// }
// export default Pie;
// const Pie = () => {
//     return (
//         <div className="pie-container">
//             <div className="pie-content">
//                 <h1>Think</h1>
//                 <div className="welcome-text">★ Welcome Raj Kumar</div>
//                 <div className="sub-text">Let's make learning awesome!</div>
//                 <div className="foundation">Foundation Thinkers</div>
//                 <div className="age">Age 5-8 years</div>
//                 <select className="dropdown">
//                     <option>Beginner</option>
//                 </select>
//                 <button className="start-button">Start</button>
//             </div>
//             <div className="pie-chart">
//             </div>
//         </div>
//     );
// }
// export default Pie;
import React, { useState } from 'react';
// import "../../assets/Pieimages/Picture1.png";
import './Piechart.css'; // Make sure this path is correct for your CSS file
// import logo from '../../assets/Pieimages/Think.png';
import Think from '../../assets/Pieimages/Think1.png' // Import your logo image

function Pie() {
  const [ageGroup, setAgeGroup] = useState('Beginner');

  const handleAgeGroupChange = (event) => {
    setAgeGroup(event.target.value);
  };

  const handleStartClick = () => {
    console.log(`Starting with age group: ${ageGroup}`);
    // Add navigation or other logic here
  };

  return (
    <div className="app-wrapper">
      <div className="app-container">
        {/* Header */}
        <header className="app-header">
          <span className="logo-placeholder">A People's Advertising Company</span>
          <div className="user-profile">
            <span>Raj Kumar</span>
            <div className="avatar-circle">
              <svg viewBox="0 0 24 24" fill="currentColor" className="avatar-icon">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="app-main-content">
          {/* Welcome Section */}
          <div className="welcome-section">
            <div className="think-logo">
              {/* <h1 className="think-text">Think</h1> */}
                <img src={Think} alt="Think" className="think-logo-image" />
              
            </div>

            <h2 className="welcome-message">
              <span className="star-icon1">✰</span>
              <span className="star-icon2">✰</span>
              {/* <span className="star-icon">⭐️</span> */}
              Welcome <span className="highlight-name">Raj Kumar</span>
            </h2>
            <p className="ready-message">Ready to conquer today?</p>
            <p className="learning-message">Let's make learning awesome!</p>

            <div className="foundation-section">
              <p className="foundation-title">Foundation Thinkers</p>
              <p className="age-range">Age 5 - 8 years</p>
              <div className="input-group">
                <select className="age-group-dropdown" value={ageGroup} onChange={handleAgeGroupChange}>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
                <button className="start-button" onClick={handleStartClick}>
                  Start
                </button>
              </div>
            </div>
          </div>

          {/* Pie Chart Section */}
          <div className="pie-chart-section">
            <div className="pie-chart-container">
              {/* Using conic-gradient for a more accurate pie chart representation */}
              <div className="pie-chart">
                <span className="pie-label english-label">English</span>
                <span className="pie-label gk-label">GK</span>
                <span className="pie-label maths-label">Maths</span>
                <span className="pie-label social-label">Social</span>
                <span className="pie-label science-label">Science</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


export default Pie;