import React, { useEffect, useState } from 'react'
import "./Home.css"
import Box from '@mui/material/Box';
import { Button, Stack, Checkbox, FormGroup, FormControlLabel } from '@mui/material';
import SideNav from '../../components/Drawer'
import NavBar from '../../components/NavBar'
import TabsTasksView from './TabsTasksView';
import { AddCircle } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setTabHomeSelected } from '../../store/myTasks';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export const Home = () => {
  const navigate = useNavigate();
  const userLogin = useSelector((state) => state.user_login.userLogin);
  const dispatch = useDispatch();

  const access_token = jwtDecode(Cookies.get('access_token'));
  const user_id = access_token.payload.user_id;

  const [userId, setUserId] = useState('');
  const [checkbox, setCheckbox] = useState(false);

  const handleChangeCheckBox = (event) => {
    setCheckbox(event.target.checked);
    event.target.checked ? setUserId(user_id) : setUserId('');
    console.log(userId)
  }

  const handleAddTask = () => {
    if (userLogin.role === 'student') {
      return;
    }

    navigate("/event/add");
  };

  useEffect(() => {
    dispatch(setTabHomeSelected(0));
  }, [dispatch])
  return (
    <>
      <NavBar></NavBar>
      <Box height={45}></Box>
      <Box sx={{ display: 'flex' }}>
        <SideNav></SideNav>
        <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: "#ECEFF4", minHeight: "100vh" }}>
          <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap" justifyContent='space-between'>
            <h1>Home</h1>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <FormGroup>
                <FormControlLabel control={<Checkbox checked={checkbox} onChange={handleChangeCheckBox} />} label="View Participated Events" />
              </FormGroup>
            </div>
            {userLogin.role !== 'student' &&
              <Button style={{ marginBottom: '15px', backgroundColor: 'rgb(0, 35, 102)' }} variant="contained" endIcon={<AddCircle />} align="justify" onClick={handleAddTask}>
                Add
              </Button>}
          </Stack>
          <TabsTasksView user_id={userId}></TabsTasksView>
        </Box>
      </Box >
    </>
  )
}
