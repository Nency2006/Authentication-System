
import React from 'react'
// import { Link } from 'react-router-dom'
// import { getData } from '@/context/userContext'
// import axios from 'axios'
// import { toast } from 'sonner'

const Home = () => {
//   const accessToken = localStorage.getItem("accessToken")
//  const {user, setUser} = getData()
//   const logouthandler = async() =>{
//     try{
//       const res = await axios.post(`http://localhost:8000/user/logout`, {}, {
//         Headers : {
//           Authorization : `Bearer ${accessToken}`
//         }
//       })
//       if(res.data.success){
//         setUser(null);
//         toast.success(res.data.message);
//           localStorage.clear();
//       }
//   }catch(error){
//     console.error("Error during logout:", error);
//     toast.error("Failed to log out. Please try again.");
//   } 
//   }
  return (
    <div>
      home 
      <div>
        {/* <Link onClick={logouthandler} to="/log-out">Log Out</Link> */}
      </div>
    </div>
  )
}

export default Home
