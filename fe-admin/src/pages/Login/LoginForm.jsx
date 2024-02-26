import React from 'react'
import "./LoginForm.css"
import { FaUser, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom/dist';
import axios from 'axios';



export const LoginForm = () => {
  const navigate = useNavigate();
  const getInfoGoogle = async (token) => {
    try {
      const urlGetInfoGoogle = 'https://www.googleapis.com/oauth2/v3/userinfo';
      const access_token = `Bearer ${token}`;
      const { data: userInfo } = await axios.get(urlGetInfoGoogle, {
        headers: {
          Authorization: access_token,
        }
      })
      return userInfo || {};
    } catch (error) {
      console.log(error)
      return {}
    }
  }

  const validateAccountGoogle = async (userInfoLogin) => {
    try {
      const urlGetInfoGoogle = 'http://localhost:3001/auth/google';
      const { data: user } = await axios.post(urlGetInfoGoogle, userInfoLogin);
      return user || null;
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const handleAfterLoginWithGoogle = async (tokenResponse) => {
    if (Object.entries(tokenResponse).length) {
      // after login with google success, call api to get user info this account that user logged in from google api 
      const googleInfo = await getInfoGoogle(tokenResponse.access_token);

      const userInfo = await validateAccountGoogle(googleInfo);
      if (userInfo) {
        const expires_time = 7; //day
        Cookies.set('access_token', userInfo.access_token, { expires: expires_time });
      }

      navigate('/', { replace: true });
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
            <a href="https://www.example.com">Forgot password?</a>
          </div>

          {/* <button type="submit">Login</button>
          <div><p className='text'> Or Login Using</p></div> */}
          <button type="submit" onClick={() => loginGoogle()} className='google-submit'> <FcGoogle className='gg-icon' />  Google</button>
        </form>
      </div>
    </div>
  )
}
