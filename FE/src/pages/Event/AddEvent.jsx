import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Grid,
  Typography,
  Paper,
  TextField,
  MenuItem,
} from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { MultiSelect } from "react-multi-select-component";
import axios from 'axios';
import dayjs from 'dayjs';
import SideNav from '../../components/Drawer'
import NavBar from '../../components/NavBar'
import Swal from "sweetalert2";
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export const AddEvent = () => {
  const navigate = useNavigate();

  const [teacherListOption, setTeacherListOption] = useState([]);
  const [teacherList, setTeacherList] = useState([]);

  const [studentListOption, setStudentListOption] = useState([]);
  const [studentList, setStudentrList] = useState([]);

  const [host, setHost] = useState({
    id: '',
    email: '',
  });

  const statusList = [
    {
      value: 'undone',
      label: 'Undone'
    },
    {
      value: 'ongoing',
      label: 'Ongoing'
    },
    {
      value: 'finished',
      label: 'Finished'
    }
  ];

  const [eventInfo, setEventInfo] = useState({
    name: 'test',
    trainingPoints: 0,
    status: 'undone',
    startAt: dayjs(),
    endAt: dayjs(),
  });

  const getTeachersListOption = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3001/users/?role=teacher`)
      const filteredData = response.data.data.map((row) => ({
        value: row._id,
        label: row.email,
      }));

      setTeacherListOption(filteredData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [setTeacherListOption]);

  const getStudentListOption = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3001/users/?role=student`)
      const filteredData = response.data.data.map((row) => ({
        value: row._id,
        label: row.email,
      }));

      setStudentListOption(filteredData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [setStudentListOption]);

  const getCurrentUserHost = useCallback(async () => {
    const access_token = jwtDecode(Cookies.get('access_token'));
    setHost({
      id: access_token.payload.user_id,
      email: access_token.payload.email,
    });
  }, [setHost]);

  useEffect(() => {
    //Get all teacher in db
    getTeachersListOption();

    //Get all student in db
    getStudentListOption();

    //Set current user 
    getCurrentUserHost();

  }, [getTeachersListOption, getStudentListOption, getCurrentUserHost])

  const createEvent = async () => {
    try {
      const dayjsStartAtObject = dayjs(eventInfo.startAt);
      const dateStartAtObject = dayjsStartAtObject.toDate();

      const dayjsEndAtObject = dayjs(eventInfo.endAt);
      const dateEndAtObject = dayjsEndAtObject.toDate();
      
      const response = await axios.post('http://localhost:3001/events', {
        name: eventInfo.name,
        host: host.id,
        participatingTeachers: teacherList.map((teacher) => teacher.value),
        participatingStudents: studentList.map((student) => student.value),
        trainingPoints: eventInfo.trainingPoints,
        status: eventInfo.status,
        startAt: dateStartAtObject,
        endAt: dateEndAtObject,
      });
      
      if (response.status === 200) {
        Swal.fire("Successful!", "Your event has been created.", "success");
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Swal.fire("Error!", `Some error happen: ${error.response.data.message}`, "error");
    }
  }

  const handleChangeEventInfo = (fieldName, newValue) => {
    setEventInfo({ ...eventInfo, [fieldName]: newValue });
  };

  const cancelEvent = async () => {
    navigate('/event');
  }

  return (
    <>
      <NavBar></NavBar>
      <Box height={45}></Box>
      <Box sx={{ display: 'flex' }}>
        <SideNav></SideNav>
        <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: "#ECEFF4", minHeight: "100vh" }}>
          <Paper sx={{ p: 1, width: '98%', overflow: 'hidden' }}>
            <h1>New Event</h1>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <h3>Event Name</h3>
                <TextField
                  onChange={(e) => handleChangeEventInfo('name', e.target.value)}
                  value={eventInfo.name}
                  required
                  id="outlined-required"
                  size='small'
                  sx={{ minWidth: "100%" }}
                />
              </Grid>
              <Grid item xs={6}>
                <h3>Host</h3>
                <TextField
                  // onChange={handleNameChange}
                  value={host.email}
                  disabled
                  id="outlined-required"
                  size='small'
                  sx={{ minWidth: "100%" }}
                />
              </Grid>
              <Grid item xs={12}>
                <h3>Participate Teachers</h3>
                <MultiSelect
                  options={teacherListOption}
                  value={teacherList}
                  onChange={setTeacherList}
                  labelledBy="Select"
                />
              </Grid>
              <Grid item xs={12}>
                <h3>Participate Student</h3>
                <MultiSelect
                  options={studentListOption}
                  value={studentList}
                  onChange={setStudentrList}
                  labelledBy="Select"
                />
              </Grid>
              <Grid item xs={6}>
                <h3>Traning Point</h3>
                <TextField
                  onChange={(e) => handleChangeEventInfo('trainingPoints', e.target.value)}
                  value={eventInfo.trainingPoints}
                  required
                  type='number'
                  inputProps={{ min: 0, max: 99 }}
                  id="outlined-required"
                  size='small'
                  sx={{ minWidth: "100%" }}
                />
              </Grid>
              <Grid item xs={6}>
                <h3>Status</h3>
                <TextField
                  onChange={(e) => handleChangeEventInfo('status', e.target.value)}
                  select
                  required
                  value={eventInfo.status}
                  id="outlined-required"
                  size='small'
                  sx={{ minWidth: "100%" }}
                >
                  {statusList.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <h3>Start Date</h3>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    sx={{ minWidth: "100%" }}
                    value={dayjs(eventInfo.startAt)}
                    onChange={(newvalue) => handleChangeEventInfo('startAt', newvalue)}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={6}>
                <h3>End Date</h3>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    sx={{ minWidth: "100%" }}
                    value={dayjs(eventInfo.endAt)}
                    onChange={(newvalue) => handleChangeEventInfo('endAt', newvalue)}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='h5' align='right'>
                  <Button variant='contained' sx={{ m: 1 }} onClick={createEvent}>
                    Save
                  </Button>
                  <Button variant='contained' sx={{ m: 1 }} onClick={cancelEvent}>
                    Cancel
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
