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
        setListEvents(data.data.map(item => ({
          ...item,
          startAt: new Date(item.startAt),
          endAt: new Date(item.endAt),
        })));
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
      const filename = '05-03-2024_Book1.xlsx'; // Replace with user input or other means of obtaining the filename
      const urlDownload = `http://localhost:3001/download-file?filename=${filename}`;
  
      const response = await axios.get(urlDownload, {
        responseType: 'blob' // Set response type for binary data (file)
      });
  
      if (response.status === 200) {
        const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        link.style.display = 'none'; // Hide the link (optional)
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error('Error downloading file:', response.statusText);
        // Handle download error (e.g., display error message to user)
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      // Handle other errors (e.g., network issues)
    }
  };
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
