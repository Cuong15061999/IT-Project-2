import React from 'react'
import "./LoginForm.css"
import { FaUser, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from '@react-oauth/google';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom/dist';

export const LoginForm = () => {
  const navigate = useNavigate();

  const handleAfterLoginWithGoogle = (tokenResponse) => {
    if (Object.entries(tokenResponse).length) {
      Cookies.set('access_token', tokenResponse.access_token, { expires: tokenResponse.expires_in / 86400 });
      navigate('/', { replace: true });
      return;
    }
    navigate('/login', { replace: true });
  }

  const loginGoogle = useGoogleLogin({
    onSuccess: handleAfterLoginWithGoogle,
  }
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
            <a href="https://www.example.com">Forgot password?</a>
          </div>

          <button type="submit">Login</button>
          <div><p className='text'> Or Login Using</p></div>
          <button type="submit" onClick={() => loginGoogle()} className='google-submit'> <FcGoogle className='gg-icon' />  Google</button>
        </form>
      </div>
    </div>
  )
}
