import React from 'react'
import './Login.css'
import { BiUser, BiLock } from "react-icons/bi";
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { login_data } from './login_data/login';

const Login = ({ login }) => {
    const [email, setEmail] = useState("")
    const [pass, setPass] = useState("")


    const emailHandle = (e) => {
        setEmail(e.target.value)
    }
    const passHandle = (e) => {
        setPass(e.target.value)
    }
    const loginSubmit = (e) => {
        e.preventDefault()
        if (pass === '' || email === '') {
            toast.error('Please Required Email And Password', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
        }
        else {
            const validation = login_data.find(user => user.email === email && user.pass === pass)
            if (validation) {
                localStorage.setItem('user', JSON.stringify(validation))
                login()
            }
            else {
                toast.error('Your Email And Password is Incorrect', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            }
        }
        // login()
    }
    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <div className="login-container">
                <div className="content">

                    <div className="text">One Tap Solutions</div>
                    <form onSubmit={loginSubmit}>
                        <div className="field">
                            <span><BiUser /></span>
                            <input type="text" onChange={emailHandle} placeholder='Email' />

                        </div>
                        <div className="field">
                            <span><BiLock /></span>
                            <input type="password" onChange={passHandle} placeholder='Password' />

                        </div>
                        <button className='button' type='submit'>Sign in</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login


