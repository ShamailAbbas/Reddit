import axios from 'axios'
import React,{useEffect,useState} from 'react'

const users = () => {
    const [userinfo,setuserinfo]=useState([])
    const getusers=async()=>{
const users=await axios.get("/getusers/")
setuserinfo(users.data)
      console.log(users.data)
    }
    useEffect(() => {
        getusers()
      
    }, [])
    return (
        <div className="mt-12">
          {
              userinfo?.map((user)=>{
                  return(
                      <div 
                      className=" my-6 mx-6">
                     <h1>name: {user.email}</h1> 
                     <h1>email: {user.username}</h1> 
                     <h1>createdAt: {user.createdAt}</h1>                      
                                        
                     </div>
                  )
              })
          } 
        </div>
    )
}

export default users
