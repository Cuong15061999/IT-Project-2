import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { Grid, MenuItem, Paper, TextField } from '@mui/material';
import dayjs from 'dayjs';
import { MultiSelect } from 'react-multi-select-component';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useDispatch, useSelector } from 'react-redux';
import { closeModalEditTask, editTask, updateTask, addTask } from '../store/myTasks';
import { useEffect, useState } from 'react';
import axios from 'axios';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function ModalEditTask() {
  const dispatch = useDispatch();
  const action = useSelector((state) => state.my_tasks.action);
  const userLogin = useSelector((state) => state.user_login.userLogin);

  // hanle open/close modal
  const isOpenModalEdit = useSelector((state) => state.my_tasks.isOpenModalEditTask);
  const handleClose = () => dispatch(closeModalEditTask());

  // get data task was selected
  const taskSelected = useSelector((state) => state.my_tasks.taskSelected);

  const [teacherListOption, setTeacherListOption] = useState([]);
  const [studentListOption, setStudentListOption] = useState([]);
  const statusList = [
    {
      value: 'todo',
      label: 'Todo'
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

  const handleSave = () => {
    if (action === 'add') {
      dispatch(addTask({ task: taskSelected, host: userLogin._id }));
    } else {
      dispatch(updateTask(taskSelected));
    }
  }

  const handleChangeTaskInfo = (fieldName, newValue) => {
    dispatch(editTask({ fieldName, newValue }));
  };

  const getUser = async (role = 'student') => {
    try {
      const urlGetUser = `http://localhost:3001/users/?role=${role}`;
      const response = await axios.get(urlGetUser);
      if (role === 'student') {
        setStudentListOption(response.data.data.map(({ name, _id }) => ({ label: name, value: _id })));
        console.log(response.data.data.map(({ name, _id }) => ({ label: name, value: _id })))
      } else {
        setTeacherListOption(response.data.data.map(({ name, _id }) => ({ label: name, value: _id })));
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getTeacherAndStudent = async () => {
    const promises = [getUser('student'), getUser('teacher')];
    await Promise.all(promises);
  }

  useEffect(() => {
    getTeacherAndStudent();
  }, [isOpenModalEdit])


  return (
    <div>
      <Modal
        open={isOpenModalEdit}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box component="main" sx={style}>
          <Paper>
            <h1>New Event</h1>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <h3>Event Name</h3>
                <TextField
                  onChange={(e) => handleChangeTaskInfo('name', e.target.value)}
                  value={taskSelected.name}
                  required
                  id="outlined-required"
                  size='small'
                  sx={{ minWidth: "100%" }}
                />
              </Grid>
              <Grid item xs={6}>
                <h3>Host</h3>
                <TextField
                  value={userLogin.email}
                  disabled
                  id="outlined-required"
                  size='small'
                  sx={{ minWidth: "100%" }}
                />
              </Grid>
              <Grid item xs={12}>
                <h3>Location</h3>
                <TextField
                  onChange={(e) => handleChangeTaskInfo('location', e.target.value)}
                  value={taskSelected.location}
                  required
                  id="outlined-required"
                  size='small'
                  sx={{ minWidth: "100%" }}
                />
              </Grid>
              <Grid item xs={12}>
                <h3>Participate Teachers</h3>
                <MultiSelect
                  options={teacherListOption}
                  value={taskSelected.participatingTeachers}
                  onChange={(valueSelected) => handleChangeTaskInfo('participatingTeachers', valueSelected)}
                  labelledBy="Select"
                  label="name"
                />
              </Grid>
              <Grid item xs={12}>
                <h3>Participate Student</h3>
                <MultiSelect
                  options={studentListOption}
                  value={taskSelected.participatingStudents}
                  onChange={(valueSelected) => handleChangeTaskInfo('participatingStudents', valueSelected)}
                  labelledBy="Select"
                />
              </Grid>
              <Grid item xs={6}>
                <h3>Activities Point</h3>
                <TextField
                  onChange={(e) => handleChangeTaskInfo('activitiesPoint', e.target.value)}
                  value={taskSelected.activitiesPoint}
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
                  onChange={(e) => handleChangeTaskInfo('status', e.target.value)}
                  select
                  required
                  value={taskSelected.status}
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
                    value={dayjs(taskSelected.startAt)}
                    onChange={(newvalue) => handleChangeTaskInfo('startAt', newvalue)}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={6}>
                <h3>End Date</h3>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    sx={{ minWidth: "100%" }}
                    value={dayjs(taskSelected.endAt)}
                    onChange={(newvalue) => handleChangeTaskInfo('endAt', newvalue)}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Paper>
          <Button onClick={handleSave} variant='contained' sx={{ m: 1 }}>
            {action === 'add' ? 'Add' : 'Update'}
          </Button>
          <Button onClick={handleClose} variant='contained' sx={{ m: 1 }}>Cancel</Button>
        </Box>
      </Modal>
    </div>
  );
}