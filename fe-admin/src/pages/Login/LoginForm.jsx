import React from 'react'
import "./LoginForm.css"
import { FaUser, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
// import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';


export const LoginForm = () => {
  const loginGoogle = useGoogleLogin({
    onSuccess: tokenResponse => console.log(tokenResponse),
  }
    // const loginGoogle = () => { axios.get('http://localhost:3001/auth/google')
    // .then(function (response) {
    //   // handle success
    //   console.log(response);
    // })
    // .catch(function (error) {
    //   // handle error
    //   console.log(error);
    // })}
  )
  return (
    <div className='pagesLogin'>
      <div className='wrapper'>
        <form action="" method="post">
          <h1>IT Event</h1>
          <div className="input-box">
            <input type="text" placeholder='Username' required />
            <FaUser className='icon' />
          </div>
          <div className="input-box">
            <input type="password" placeholder='Password' required />
            <FaLock className='icon' />
          </div>

          <div className='remember-forgot'>
            <label><input type="checkbox" /> Remember me</label>
            <a href="#">Forgot password?</a>
          </div>

          <button type="submit">Login</button>
          <div><p className='text'> Or Login Using</p></div>
          <button type="submit" onClick={() => loginGoogle()} className='google-submit'> <FcGoogle className='gg-icon' />  Google</button>
        </form>
      </div>
    </div>
  )
}
