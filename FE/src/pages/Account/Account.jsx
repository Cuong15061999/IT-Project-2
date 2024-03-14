import React, { useCallback, useState, useEffect } from 'react'
import "./Account.css"
import {
  Box,
  Button,
  Typography,
  Paper,
  TextField,
  Grid,
  CardMedia
} from '@mui/material';
import SideNav from '../../components/Drawer'
import NavBar from '../../components/NavBar'
import Swal from "sweetalert2";
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export const Account = () => {
  const access_token = jwtDecode(Cookies.get('access_token'));
  const user_id = access_token.payload.user_id;

  const [personalInfo, setPersonalInfo] = useState({
    name: 'name',
    email: 'email',
    class: 'class',
    faculty: 'faculity',
    role: 'role',
  });

  const getPresonalInfo = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3001/users/${user_id}`);
      const user_personal_data = response.data.data;
      setPersonalInfo({
        name: user_personal_data.name,
        email: user_personal_data.email,
        class: user_personal_data.class,
        faculty: user_personal_data.falculty,
        role: user_personal_data.role,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [user_id])

  useEffect(() => {
    //Get user personal info
    getPresonalInfo();

  }, [getPresonalInfo])

  const handleChangePersonalInfo = (fieldName, newValue) => {
    setPersonalInfo({ ...personalInfo, [fieldName]: newValue });
  };

  const updatePersonalProfile = async () => {
    try {
      const response = await axios.put(`http://localhost:3001/users/${user_id}`, {
        name: personalInfo.name,
        email: personalInfo.email,
        class: personalInfo.class,
        falculty: personalInfo.faculty,
        role: personalInfo.role
      });

      if (response.status === 200) {
        Swal.fire("Successful!", "Your user has been updated.", "success");
        getPresonalInfo();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Swal.fire("Error!", `Some error happen: ${error.response.data.message}`, "error");
    }
  }

  return (
    <>
      <NavBar />
      <Box height={45} />
      <Box sx={{ display: 'flex' }}>
        <SideNav />
        <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: "#ECEFF4", minHeight: "100vh" }}>
          <Paper sx={{ p: 3, width: '100%', overflow: 'hidden', borderRadius: 5 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4" gutterBottom>Account Profile</Typography>
                <CardMedia
                  sx={{ width: '100%', maxWidth: 250, height: 300, borderRadius: '10%' }}
                  image="https://lh3.googleusercontent.com/a/ACg8ocLCwbUeJMai9zBjnS7mLV4TgVf8rX5vbuQZJM-IIqyB=s96-c"
                  title="Personal Picture"
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography variant="h4" gutterBottom>Name</Typography>
                <TextField
                  required
                  onChange={(e) => handleChangePersonalInfo('name', e.target.value)}
                  value={personalInfo.name}
                  id="outlined-required"
                  size='small'
                  sx={{ width: '100%' }}
                  placeholder="Enter your name"
                />
                <Typography variant="h4" gutterBottom>Email</Typography>
                <TextField
                  required
                  disabled
                  onChange={(e) => handleChangePersonalInfo('email', e.target.value)}
                  value={personalInfo.email}
                  id="outlined-required"
                  size='small'
                  sx={{ width: '100%' }}
                  placeholder="Enter your email"
                />
                <Typography variant="h4" gutterBottom>Class</Typography>
                <TextField
                  required
                  onChange={(e) => handleChangePersonalInfo('class', e.target.value)}
                  value={personalInfo.class}
                  id="outlined-required"
                  size='small'
                  sx={{ width: '100%' }}
                  placeholder="Enter your class"
                />
                <Typography variant="h4" gutterBottom>Faculty</Typography>
                <TextField
                  required
                  onChange={(e) => handleChangePersonalInfo('faculty', e.target.value)}
                  value={personalInfo.faculty}
                  id="outlined-required"
                  size='small'
                  sx={{ width: '100%' }}
                  placeholder="Enter your faculty"
                />
                <Typography variant="h4" gutterBottom>Role</Typography>
                <TextField
                  required
                  disabled
                  value={personalInfo.role}
                  onChange={(e) => handleChangePersonalInfo('role', e.target.value)}
                  id="outlined-required"
                  size='small'
                  sx={{ width: '100%' }}
                />
                <Typography variant='h5' align='right'>
                  <Button variant='contained' sx={{ m: 1 }} onClick={updatePersonalProfile}>
                    Update
                  </Button>
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Box>
    </>
  )
}
