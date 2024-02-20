import React from 'react'
import "./LoginForm.css"
import { FaUser, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom/dist';
import axios from 'axios';
// import { GoogleLogin } from '@react-oauth/google';
// import axios from 'axios';



export const LoginForm = () => {
  const navigate = useNavigate();

  const handleAfterLoginWithGoogle = async (tokenResponse) => {
    if (Object.entries(tokenResponse).length) {
      // after login with google success, call api to get user info this account that user logged in from google api 
      const { data: userInfo } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${tokenResponse.access_token}`,
        }
      })

      // TODO: call api and send this data to verify/save/sync this data with BE

      // next save access_token and user_id logged in to cookies
      // Cookies.set('access_token', tokenResponse.access_token, { expires: tokenResponse.expires_in / 86400 });

      // after set data to cookie => redirect to home
      // navigate('/', { replace: true });
      return;
    }
  }

  const loginGoogle = useGoogleLogin({
    onSuccess: handleAfterLoginWithGoogle,
  })

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
