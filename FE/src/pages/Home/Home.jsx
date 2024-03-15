import React from 'react'
import "./Home.css"
import Box from '@mui/material/Box';
import { Button, Stack } from '@mui/material';
import SideNav from '../../components/Drawer'
import NavBar from '../../components/NavBar'
import TabsTasksView from './TabsTasksView';
import { AddCircle } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { openModalEditTask } from '../../store/myTasks';

export const Home = () => {
  const dispatch = useDispatch();
  const userLogin = useSelector((state) => state.user_login.userLogin);

  const handleOpenModalAddTask = () => {
    if (userLogin.role === 'student') {
      return;
    }

    dispatch(openModalEditTask({ action: 'add' }))
  }

  return (
    <>
      <NavBar></NavBar>
      <Box height={45}></Box>
      <Box sx={{ display: 'flex' }}>
        <SideNav></SideNav>
        <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: "#ECEFF4", minHeight: "100vh" }}>
          <h1>Home</h1>
          <Stack spacing={{ xs: 1, sm: 2 }} direction="row" useFlexGap flexWrap="wrap" justifyContent='flex-end'>
            {userLogin.role !== 'student' &&
              <Button style={{ marginBottom: '15px' }} variant="contained" endIcon={<AddCircle />} align="justify" onClick={handleOpenModalAddTask}>
                Add
              </Button>}
          </Stack>
          <TabsTasksView></TabsTasksView>
        </Box>
      </Box >
    </>
  )
}
