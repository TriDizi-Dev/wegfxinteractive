import React, { useEffect, useState } from 'react';
import { CgProfile } from 'react-icons/cg';
import { auth, database } from '../../Firebase/firebase';
import { get, ref } from 'firebase/database'; // ✅ FIXED import
import Logo from "../../assets/image.png";
import "./Navbar.css"

export const Navbar = () => {
  const [Userdata, setUserdata] = useState({});
  console.log(Userdata, 'UserdataUserdata');

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (user) {
        const uid = user.uid;
        const userRef = ref(database, `users/${uid}`); // ✅ Make sure 'database' is from getDatabase()
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setUserdata(data || {});
        }
      }
    };
    fetchUser();
  }, []);

  return (
    <div className='Main_NavBar_Css'>
        <div className='Main_Logo_Image'><img src={Logo} alt='Name'/></div>
      <div className="quiz-user-info">
        <span>{Userdata.name}</span>
        <div className="user-avatar">
          <CgProfile />
        </div>
      </div>
    </div>
  );
};
