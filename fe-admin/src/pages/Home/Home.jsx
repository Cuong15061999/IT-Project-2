import React from 'react'
import "./Home.css"
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import SideNav from '../../components/Drawer'

export const Home = () => {
  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <SideNav></SideNav>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <h1>Home</h1>
          <Typography paragraph>
            CONTENT OF THE PAGE
          </Typography>
        </Box>
      </Box>
    </>
  )
}
