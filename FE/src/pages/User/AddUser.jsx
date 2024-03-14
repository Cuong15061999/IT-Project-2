import React, { useState } from 'react'
import { Box, Button, Grid, IconButton, Typography, TextField, MenuItem } from '@mui/material'
import CloseIcon from "@mui/icons-material/Close"
import Swal from "sweetalert2";
import axios from 'axios';
import { useAppStore } from '../../appStore';

export default function AddUser({ closeEvent }) {
  const [name, setName] = useState("");
  const [userClass, setUserClass] = useState("");
  const [falculty, setFalcuty] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState('');
  const [role, setRole] = useState("");
  const setRows = useAppStore((state) => state.setRows);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleFalcutyChange = (event) => {
    setFalcuty(event.target.value);
  };

  const handleUserClassChange = (event) => {
    setUserClass(event.target.value);
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

  const createUser = async () => {
    try {
      const response = await axios.post('http://localhost:3001/users', {
        name: name,
        class: userClass,
        falculty: falculty,
        email: email,
        role: role
      })
      if (response.status === 200) {
        getUsers();
        closeEvent();
        Swal.fire("Successful!", "Your user has been created.", "success");
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      closeEvent();
      Swal.fire("Error!", `Some error happen: ${error.response.data.message}`, "error");
    }
  }

  const getUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/users');
      const filteredData = response.data.data.map((row) => ({
        id: row._id,
        email: row.email,
        name: row.name,
        class: row.class,
        falculty: row.falculty,
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

  return (
    <>
      <Box sx={{ m: 2 }}></Box>
      <Typography variant='h5' align='center'> Add User</Typography>
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
            onChange={handleNameChange}
            value={name}
            required
            id="outlined-required"
            label="Name"
            size='small'
            sx={{ minWidth: "100%" }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            onChange={handleUserClassChange}
            value={userClass}
            required
            id="outlined-required"
            label="Class"
            size='small'
            sx={{ minWidth: "100%" }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            onChange={handleFalcutyChange}
            value={falculty}
            required
            id="outlined-required"
            label="falcuty"
            size='small'
            sx={{ minWidth: "100%" }}
          />
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
            <Button variant='contained' sx={{ m: 1 }} onClick={createUser}>
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
