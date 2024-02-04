import React from 'react'
import './Dashboard.css'
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import SideNav from '../../components/Drawer'
import NavBar from '../../components/NavBar'

export const Dashboard = () => {
  return (
    <>
      <NavBar></NavBar>
      <Box height={45}></Box>
      <Box sx={{ display: 'flex' }}>
        <SideNav></SideNav>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <h1>Dashboard</h1>
          <Typography paragraph>
            CONTENT OF THE PAGE
          </Typography>
        </Box>
      </Box>
    </>
  )
}
