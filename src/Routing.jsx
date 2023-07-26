import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import App from './App'
import Firstpage from './component/Firstpage'
import Login from './Login'
import MapRouter from './Route'


const Routing = () => {
  const [login,setlogin] = useState(false)
  const [Data,setData] = useState([]) // usestate hook update state 
 

  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('user'))
  useEffect(() => {
   
   if(userData !== null){
    setlogin(true)
   }
   else{
    setlogin(false)
    navigate('/')
   }
  },[navigate])


 // useNavigate() react hook for navigate one page to another  

// HandleGetdata is a function calling api near location
  const HandleGetdata = async (name) => {

      // navigator.geolocation.getCurrentPosition javascript inbuild function to get
      // current position 
      navigator.geolocation.getCurrentPosition( async (position) => {
      const url = `https://discover.search.hereapi.com/v1/discover?at=${position.coords.latitude},${position.coords.longitude}&limit=6&lang=en&q=${name}&apiKey=JivHRCsD-7zT9S79FYiWuoNkIX70oux31qtFCsM_EyE`
      await axios.get(url).then((response) => {
         const data = response.data.items
         setData(data)
         console.log(position.coords.latitude)
         navigate('/card' ,{ state: {data: data, position: {lat:position.coords.latitude,lng:position.coords.longitude}}})
      })
      .catch(error => { // catch means if getting any error show catch function
        console.log(error) 
    });
      });
      
}
useEffect(() => {

},[Data])








  return (
    <>
       <Routes>
        {
          login
          ?
          <>
          <Route path="/" element={<Firstpage HandleGetdata={HandleGetdata}/>} />
          <Route path="card" element={ <App /> } />
          <Route path="route" element={ <MapRouter /> } />
          </>
          :
          <Route path="/" element={ <Login login={() => setlogin(true)}/> } />
        }
        
      </Routes>
    </>
  )
}

export default Routing
