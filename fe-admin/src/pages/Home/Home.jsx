import React from 'react'
import "./Home.css"
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import SideNav from '../../components/Drawer'
import NavBar from '../../components/NavBar'
import CustomCalendar from '../../components/CustomCalendar';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';

export const Home = () => {
  const [listEvens, setListEvents] = useState([]);
  const getEvents = async () => {
    try {
      const urlGetEvents = `http://localhost:3001/events`;
      const { data } = await axios.get(urlGetEvents);
      if (data.data) {
        setListEvents(data.data);
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getEvents();
  }, []);
  const handleClick = async () => {
    try {
      const urlDownload = `http://localhost:3001/download-file`;
      const response = await axios.post(urlDownload, {
        file_name: 'Book1-03-03-2024.xlsx'
      })
      console.log(response);
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <NavBar></NavBar>
      <Box height={45}></Box>
      <Box sx={{ display: 'flex' }}>
        <SideNav></SideNav>
        <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: "#ECEFF4", minHeight: "100vh" }}>
          <h1>Home</h1>
          <Typography paragraph>
            CONTENT OF THE PAGE
          </Typography>
          <CustomCalendar data={listEvens}></CustomCalendar>
        <button onClick={handleClick}>Download</button>
        </Box>
      </Box>
    </>
  )
}
