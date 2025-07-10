import React from "react";
import image1 from "../../assets/Login/image1.jpg"
import image2 from  "../../assets/Login/image2.png"
import image3 from "../../assets/Login/image3.png"
import "./LoginPage.css"

const Loginpage=()=>{
    return(
        <>
        <div className="container">
        <div className="images">
            <img src={image2} className="image2"/>
            <img src={image3} className="image3"/>
            <h3>Unleash the Within</h3><h2>Star </h2>
            <p>Boost your child’s confidence and social skills to unlock lifelong success.</p>
        </div>
        </div>
        </>

    )
}
export default Loginpage;