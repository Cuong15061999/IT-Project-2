import './App.css';
import { LoginForm } from './pages/Login/LoginForm';
import { Home } from './pages/Home/Home';
import { Event } from './pages/Event/Event'
import { EventInfo } from './pages/Event/EventInfo';
import { AddEvent } from './pages/Event/AddEvent';
import { User } from './pages/User/User'
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Routes, Route } from 'react-router-dom'
import RequireAuth from './components/RequireAuth';
import { Account } from './pages/Account/Account';
import { useDispatch, useSelector } from 'react-redux';
import { Snackbar } from '@mui/material';
import { hideNotify } from './store/myTasks';
import { useEffect } from 'react';
import { setUserLogin } from './store/userLogin';

function App() {
  const openToastMessage = useSelector((state) => state.my_tasks.isShowToastMessage);
  const messageToast = useSelector((state) => state.my_tasks.contentToastMessage);
  const dispatch = useDispatch();
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    dispatch(hideNotify());
  }
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      dispatch(setUserLogin(JSON.parse(userInfo) || {}))
    }
  }, [])
  return (
    <div className='AppMain'>
      <Routes>
        <Route path='/' element={<RequireAuth><Home></Home></RequireAuth>}></Route>
        <Route path='/dashboard' element={<RequireAuth><Dashboard></Dashboard></RequireAuth>}></Route>
        <Route path='/event' element={<RequireAuth><Event></Event></RequireAuth>}></Route>
        <Route path='/event/add' element={<RequireAuth><AddEvent></AddEvent></RequireAuth>}></Route>
        <Route path='/event/:id' element={<RequireAuth><EventInfo></EventInfo></RequireAuth>}></Route>
        <Route path='/user' element={<RequireAuth><User></User></RequireAuth>}></Route>
        <Route path='/account' element={<RequireAuth><Account></Account></RequireAuth>}></Route>
        <Route path='/login' element={<RequireAuth><LoginForm></LoginForm></RequireAuth>}></Route>
      </Routes>
      <Snackbar
        open={openToastMessage}
        autoHideDuration={6000}
        onClose={handleClose}
        message={messageToast}
      />
    </div>
  );
}

export default App;
