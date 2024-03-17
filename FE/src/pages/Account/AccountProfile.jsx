import React, { useCallback, useState, useEffect } from 'react'
import {
  Typography,
  Paper,
  TextField,
  Grid,
  CardMedia,
} from '@mui/material';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export default function AccountProfile() {
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
  }, [user_id]);

  useEffect(() => {
    //Get user personal info
    getPresonalInfo();

  }, [getPresonalInfo]);


  return (
    <Paper sx={{ p: 3, width: '100%', overflow: 'hidden' }}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" gutterBottom>Profile Avatar</Typography>
          <CardMedia
            sx={{ width: '100%', maxWidth: 250, height: 300, borderRadius: '10%' }}
            image="https://lh3.googleusercontent.com/a/ACg8ocLCwbUeJMai9zBjnS7mLV4TgVf8rX5vbuQZJM-IIqyB=s96-c"
            title="Personal Picture"
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom>Name</Typography>
          <TextField
            value={personalInfo.name}
            id="outlined-read-only-input"
            size='small'
            sx={{ width: '100%' }}
            placeholder="Enter your name"
            InputProps={{
              readOnly: true,
            }}
          />
          <Typography variant="h4" gutterBottom>Email</Typography>
          <TextField
            value={personalInfo.email}
            id="outlined-read-only-input"
            size='small'
            sx={{ width: '100%' }}
            placeholder="Enter your email"
            InputProps={{
              readOnly: true,
            }}
          />
          <Typography variant="h4" gutterBottom>Class</Typography>
          <TextField
            value={personalInfo.class}
            id="outlined-read-only-input"
            size='small'
            sx={{ width: '100%' }}
            placeholder="Enter your class"
            InputProps={{
              readOnly: true,
            }}
          />
          <Typography variant="h4" gutterBottom>Faculty</Typography>
          <TextField
            value={personalInfo.faculty}
            id="outlined-read-only-input"
            size='small'
            sx={{ width: '100%' }}
            placeholder="Enter your faculty"
            InputProps={{
              readOnly: true,
            }}
          />
          <Typography variant="h4" gutterBottom>Role</Typography>
          <TextField
            value={personalInfo.role}
            id="outlined-read-only-input"
            size='small'
            sx={{ width: '100%' }}
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
      </Grid>
    </Paper>
  )
}
