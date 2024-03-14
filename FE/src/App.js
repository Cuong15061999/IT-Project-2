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
import CheckRole from './components/CheckRole';

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
        <Route path='/' element={<RequireAuth><CheckRole><Home></Home></CheckRole></RequireAuth>}></Route>
        <Route path='/dashboard' element={<RequireAuth><CheckRole><Dashboard></Dashboard></CheckRole></RequireAuth>}></Route>
        <Route path='/event' element={<RequireAuth><CheckRole><Event></Event></CheckRole></RequireAuth>}></Route>
        <Route path='/event/add' element={<RequireAuth><CheckRole><AddEvent></AddEvent></CheckRole></RequireAuth>}></Route>
        <Route path='/event/:id' element={<RequireAuth><CheckRole><EventInfo></EventInfo></CheckRole></RequireAuth>}></Route>
        <Route path='/user' element={<RequireAuth><CheckRole><User></User></CheckRole></RequireAuth>}></Route>
        <Route path='/account' element={<RequireAuth><CheckRole><Account></Account></CheckRole></RequireAuth>}></Route>
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
