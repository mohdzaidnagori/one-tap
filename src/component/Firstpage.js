import React from 'react'
import { GiHospitalCross,GiPoliceCar,GiFire } from 'react-icons/gi' 
import { FaChargingStation,FaGasPump,FaBriefcaseMedical } from 'react-icons/fa'
import './Firstpage.css'

const Firstpage = ({HandleGetdata}) => {
    const button = [
        {
            name: 'Hospital',
            icon: <GiHospitalCross />
        },
        {
            name: 'Police',
            icon: <GiPoliceCar />
        },
        {
            name: 'EV Charging',
            icon: <FaChargingStation />
        },
        {
            name: 'Petrol Station',
            icon: <FaGasPump />
        },
        {
            name: 'Fire Station',
            icon: <GiFire />
        },
        {
            name: 'Ambulance',
            icon: <FaBriefcaseMedical />
        },
    ]
    const Handlefn = (name) => {
        HandleGetdata(name)
    }
    return (
        <div className="button-container">
             <h1>One Tap Solution For Emergency Services</h1>
            {
                button.map((item) => {
                    return (
                        <div key={item.name} onClick={() => Handlefn(item.name)} className="button-emergancy">
                            <span>{item.name}</span>
                            <span>{item.icon}</span>
                        </div>
                    )
                })
            }

        </div>
    )
}

export default Firstpage