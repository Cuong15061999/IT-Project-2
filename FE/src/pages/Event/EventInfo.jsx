import React, { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { FileDownload, FileUpload } from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  Typography,
  Paper,
  TextField,
  MenuItem,
  TableContainer,
  TableHead,
  Table,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Stack,

} from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { MultiSelect } from "react-multi-select-component";
import SideNav from '../../components/Drawer'
import NavBar from '../../components/NavBar'
import Swal from "sweetalert2";
import axios from 'axios';
import dayjs from 'dayjs';

export const EventInfo = () => {
  const navigate = useNavigate();

  // data table student register
  const headerList = ["STT", "Email", "Student ID"];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  // data table student participate
  const [page2, setPage2] = useState(0);
  const [rowsPerPage2, setRowsPerPage2] = useState(5);
  const [rows2, setRows2] = useState([]);

  const handleChangePage2 = (event, newPage) => {
    setPage2(newPage);
  };

  const handleChangeRowsPerPage2 = (event) => {
    setRowsPerPage2(+event.target.value);
    setPage2(0);
  };

  const [teacherListOption, setTeacherListOption] = useState([]);
  const [teacherList, setTeacherList] = useState([]);

  const [host, setHost] = useState({
    id: '',
    email: '',
  });

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

  const { id } = useParams();
  const [eventInfo, setEventInfo] = useState({
    name: '',
    location: '',
    activitiesPoint: 0,
    status: '',
    startAt: '',
    endAt: '',
  });

  const getEventInfo = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3001/events/${id}`);
      const event = response.data.data;
      setEventInfo({
        name: event.name,
        location: event.location,
        activitiesPoint: event.activitiesPoint,
        status: event.status,
        startAt: event.startAt,
        endAt: event.endAt
      });

      setHost({
        id: event.host._id,
        email: event.host.email,
      })

      const filteredTeacherData = event.participatingTeachers.map((teacher) => ({
        value: teacher._id,
        label: teacher.email,
      }));
      setTeacherList(filteredTeacherData || []);

      const filteredRegisterStudentData = event.listStudentRegistry.reduce((list, student, index) => {
        list.push({
          id: index + 1,
          email: student,
          student_id: student.split("@")[0],
        });
        return list;
      }, []);
      setRows(filteredRegisterStudentData || []);

      const filteredParticipateStudentData = event.participatingStudents.reduce((list, student, index) => {
        list.push({
          id: index + 1,
          email: student,
          student_id: student.split("@")[0],
        });
        return list;
      }, []);
      setRows2(filteredParticipateStudentData || [])

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [id])

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

  useEffect(() => {
    //Get all teacher in db
    getTeachersListOption();

    //Get event info
    getEventInfo();
  }, [getTeachersListOption, getEventInfo])

  const handleChangeEventInfo = (fieldName, newValue) => {
    setEventInfo({ ...eventInfo, [fieldName]: newValue });
  };

  const updateEvent = async () => {
    try {
      const dayjsStartAtObject = dayjs(eventInfo.startAt);
      const dateStartAtObject = dayjsStartAtObject.toDate();

      const dayjsEndAtObject = dayjs(eventInfo.endAt);
      const dateEndAtObject = dayjsEndAtObject.toDate();

      const response = await axios.put(`http://localhost:3001/events/${id}`, {
        name: eventInfo.name,
        host: host._id,
        location: eventInfo.location,
        participatingTeachers: teacherList.map((teacher) => teacher.value),
        activitiesPoint: eventInfo.activitiesPoint,
        status: eventInfo.status,
        startAt: dateStartAtObject,
        endAt: dateEndAtObject,
      })
      if (response.status === 200) {
        Swal.fire({
          title: "Do you want to send notification email?",
          text: "Your Event have been updated successfully. Do you want to send email for notification?",
          icon: "success",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, send it!",
        }).then((result) => {
          if (result.value) {
            sendNotificationEmail(id);
          }
        });

        setTimeout(() => {
          navigate('/event'); // Navigate to home screen after 3 seconds
        }, 1500);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const sendNotificationEmail = async (id) => {
    try {
      const response = await axios.post(`http://localhost:3001/events/sendEmail/${id}`);
      if (response.status === 200) {
        Swal.fire("Send Notification Email!", "You have been sent notification email sucessfully", "success");
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Swal.fire("Delete Error!", "There some error happen.", "warning");
    }
  }

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
            <h1>Event Info</h1>
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
              {/* 2 table register student and participate student */}
              <Grid item xs={6}>
                <Stack direction="row" spacing={2} className="my-2 mb-2">
                  <h3>Register Students</h3>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1 }}
                  ></Typography>
                  <FileUpload sx={{ cursor: "pointer" }} onClick={() => { navigate(`/event`) }} />
                  <FileDownload sx={{ cursor: "pointer" }} onClick={() => { navigate(`/event`) }} />
                </Stack>
                <TableContainer sx={{ height: 45 + "vh", border: "2px solid gray", borderRadius: "10px" }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        {headerList.map((column, index) => (
                          <TableCell key={index} align="left" style={{ minWidth: "10%" }}>
                            {column}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.length > 0 ? (
                        rows
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row) => (
                            <TableRow key={row.id} hover role="checkbox" tabIndex={-1}>
                              <TableCell align="left">{row.id}</TableCell>
                              <TableCell align="left">{row.email}</TableCell>
                              <TableCell align="left">{row.student_id}</TableCell>
                            </TableRow>
                          ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} align="center">
                            {/* Customize this message as needed */}
                            There is no data to display.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10]}
                  component="div"
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Grid>
              <Grid item xs={6}>
                <Stack direction="row" spacing={2} className="my-2 mb-2">
                  <h3>Participate Students</h3>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1 }}
                  ></Typography>
                  <FileUpload sx={{ cursor: "pointer" }} onClick={() => { navigate(`/event`) }} />
                  <FileDownload sx={{ cursor: "pointer" }} onClick={() => { navigate(`/event`) }} />
                </Stack>
                <TableContainer sx={{ height: 45 + "vh", border: "2px solid gray", borderRadius: "10px" }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        {headerList.map((column, index) => (
                          <TableCell key={index} align="left" style={{ minWidth: "10%" }}>
                            {column}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows2.length > 0 ? (
                        rows2
                          .slice(page2 * rowsPerPage2, page2 * rowsPerPage2 + rowsPerPage2)
                          .map((row) => (
                            <TableRow key={row.id} hover role="checkbox" tabIndex={-1}>
                              <TableCell align="left">{row.id}</TableCell>
                              <TableCell align="left">{row.email}</TableCell>
                              <TableCell align="left">{row.student_id}</TableCell>
                            </TableRow>
                          ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={3} align="center">
                            {/* Customize this message as needed */}
                            There is no data to display.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10]}
                  component="div"
                  count={rows2.length}
                  rowsPerPage={rowsPerPage2}
                  page={page2}
                  onPageChange={handleChangePage2}
                  onRowsPerPageChange={handleChangeRowsPerPage2}
                />
              </Grid>
              {/* ----- */}
              <Grid item xs={6}>
                <h3>Activities Point</h3>
                <TextField
                  onChange={(e) => handleChangeEventInfo('activitiesPoint', e.target.value)}
                  value={eventInfo.activitiesPoint}
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
                  <Button variant='contained' sx={{ m: 1 }} onClick={updateEvent}>
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