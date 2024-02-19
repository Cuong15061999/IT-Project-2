import React from 'react'
import "./User.css"
import Box from '@mui/material/Box';
import SideNav from '../../components/Drawer'
import NavBar from '../../components/NavBar'
import UserList from './UserList';

export const User = () => {
  return (
    <>
      <NavBar></NavBar>
      <Box height={45}></Box>
      <Box sx={{ display: 'flex' }}>
        <SideNav></SideNav>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <h1>User List</h1>
          <UserList></UserList>
        </Box>
      </Box>
    </>
  )
}
