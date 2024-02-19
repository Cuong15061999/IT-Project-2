import { Box, Button, Grid, IconButton, Typography } from '@mui/material'
import CloseIcon from "@mui/icons-material/Close"
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import MenuItem from '@mui/material/MenuItem';
import React, { useEffect, useState } from 'react'
import Swal from "sweetalert2";
import axios from 'axios';
import { useAppStore } from '../../appStore';

export default function EditUser({ udata, closeEvent }) {
  const [username, setUserName] = useState("");
  const [password, setPassWord] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState('');
  const [role, setRole] = useState("");
  const setRows = useAppStore((state) => state.setRows);

  useEffect(() => {
    setUserName(udata.username);
    setPassWord(udata.password);
    setEmail(udata.email);
    setRole(udata.role);
  }, [udata.username, udata.password, udata.email, udata.role])

  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
  };
  const handlePasswordChange = (event) => {
    setPassWord(event.target.value);
  };
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setError(false);
    setHelperText('');
  };
  const validateEmail = (e) => {
    const regex = /^[\w-_.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if (!regex.test(email)) {
      setError(true);
      setHelperText('Please enter a valid email address.');
    } else {
      setError(false);
      setHelperText('');
    }
  };
  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  const editUser = async () => {
    try {
      const response = await axios.put(`http://localhost:3001/users/${udata.id}`, {
        username: username,
        password: password,
        email: email,
        role: role
      })
      if (response.status === 200) {
        getUsers();
        closeEvent();
        Swal.fire("Successful!", "Your user has been udated.", "success");
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const getUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/users');
      const filteredData = response.data.data.map((row) => ({
        id: row._id,
        email: row.email,
        username: row.username,
        password: row.password,
        avatar: row.avatar,
        role: row.role,
      }));
      setRows(filteredData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const roles = [
    {
      value: 'admin',
      label: 'Admin'
    },
    {
      value: 'student',
      label: 'Student'
    },
    {
      value: 'teacher',
      label: 'Teacher'
    }
  ];

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <>
      <Box sx={{ m: 2 }}></Box>
      <Typography variant='h5' align='center'> Edit User</Typography>
      <IconButton
        style={{ position: "absolute", top: "0", right: "0" }}
        onClick={closeEvent}
      >
        <CloseIcon></CloseIcon>
      </IconButton>
      <Box height={20}></Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            onChange={handleUserNameChange}
            value={username}
            required
            id="outlined-required"
            label="UserName"
            size='small'
            sx={{ minWidth: "100%" }}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl
            onChange={handlePasswordChange}
            required
            size='small'
            sx={{ minWidth: '100%' }}
            variant="outlined"
          >
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <OutlinedInput
              value={password}
              id="outlined-adornment-password"
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            onChange={handleEmailChange}
            onBlur={validateEmail}
            value={email}
            error={error}
            helperText={helperText}
            required
            id="outlined"
            label="Email"
            size='small'
            sx={{ minWidth: "100%" }} />
        </Grid>
        <Grid item xs={12}>
          <TextField
            onChange={handleRoleChange}
            value={role}
            required
            select
            id="outlined-required"
            label="Role"
            size='small'
            sx={{ minWidth: "100%" }}
          >
            {roles.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h5' align='right'>
            <Button variant='contained' sx={{ m: 1 }} onClick={editUser}>
              Submit
            </Button>
            <Button variant='contained' sx={{ m: 1 }} onClick={closeEvent}>
              Cancel
            </Button>
          </Typography>
        </Grid>
      </Grid>
    </>
  )
}
