import React, { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { FileDownload } from "@mui/icons-material";
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
import ImportFile from '../../components/ImportFile';
import { useDispatch, useSelector } from 'react-redux';
import { showNotify } from '../../store/myTasks';

export const EventInfo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userLogin = useSelector((state) => state.user_login.userLogin);
  const [registerStudentsFile, setRegisterStudentsFile] = useState(null);
  const [participateStudentsFile, setParticipateStudentsFile] = useState(null);
  const [registryListFile, setRegistryListFile] = useState(null);
  const [participateStudents, setParticipateStudents] = useState(null);
  const [isEditLinkFormRegistry, setIsEditLinkFormRegistry] = useState(false);
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
    linkFormRegistry: ''
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
        endAt: event.endAt,
        linkFormRegistry: event.linkFormRegistry
      });

      setHost({
        id: event.host?._id || '',
        email: event.host?.email || '',
      })

      const filteredTeacherData = event.participatingTeachers.map((teacher) => ({
        value: teacher._id,
        label: teacher.email,
      }));
      setTeacherList(filteredTeacherData || []);

      const filteredRegisterStudentData = event.listStudentRegistry.map((student, index) => ({
        id: index + 1,
        email: student,
        student_id: student.split("@")[0],
      }))
      setRows(filteredRegisterStudentData || []);

      setRegistryListFile(event.registryList);

      const filteredParticipateStudentData = event.participatingStudents.reduce((list, student, index) => {
        list.push({
          id: index + 1,
          email: student,
          student_id: student.split("@")[0],
        });
        return list;
      }, []);
      setRows2(filteredParticipateStudentData || [])

      setParticipateStudents(event.participationList);

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
    if (fieldName === 'linkFormRegistry' && newValue.indexOf('docs.google.com') === -1) {
      dispatch(showNotify({
        show: true,
        message: `This link is not google form`
      }))
      return;
    }
    setEventInfo({ ...eventInfo, [fieldName]: newValue });
  };

  const goBack = () => {
    let previousPath = location.state?.from?.pathname;
    if (!previousPath) {
      navigate(-1);
    } else {
      console.log(previousPath);
    }
  }

  const updateEvent = async () => {
    try {
      if (userLogin.role === 'student') {
        return;
      }
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
        linkFormRegistry: eventInfo.linkFormRegistry
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
          goBack();
        }, 1500);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  const handleUploadFile = async (typeFile, isCheckingFile = false) => {
    const file = typeFile === 'participateStudentsFile' ? participateStudentsFile : registerStudentsFile;
    try {
      const urlUploadFile = `http://localhost:3001/upload/${id}?isCheckingFile=${isCheckingFile}`;
      const formData = new FormData();
      formData.append('excelFile', file);
      const response = await axios.post(urlUploadFile, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      if (response) {
        dispatch(showNotify({
          show: true,
          message: `Upload ${file.name} is successfully`
        }))
        if (typeFile === 'participateStudentsFile') {
          setParticipateStudentsFile(null);
        } else {
          setRegisterStudentsFile(null);
        }
        getEventInfo();
      } else {
        dispatch(showNotify({
          show: true,
          message: `Upload ${file.name} is failed`
        }))
      }
    } catch (error) {
      console.log(error)
      dispatch(showNotify({
        show: true,
        message: `Upload ${file.name} is failed`
      }))
    }
  }
  const handleImportRegisterStudentsFile = (file) => {
    if (userLogin === 'student') {
      return;
    }
    setRegisterStudentsFile(file);
  }
  const handleImportPaticipateStudentsFile = (file) => {
    if (userLogin === 'student') {
      return;
    }
    setParticipateStudentsFile(file);
  }

  const handleDownloadFile = async (filename, fileType) => {
    if (userLogin === 'student') {
      return;
    }
    try {
      if (!filename) {
        dispatch(showNotify({
          show: true,
          message: `No ${fileType} file`
        }))
        return;
      }
      const urlDownload = `http://localhost:3001/download-file/${filename}`;
      const response = await axios.get(urlDownload, {
        responseType: 'blob'
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
        dispatch(showNotify({
          show: true,
          message: `Error downloading file: ${response.statusText}`
        }))
      }
    } catch (error) {
      console.log(error);
      dispatch(showNotify({
        show: true,
        message: `Error downloading file`
      }))
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
    goBack();
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
                  disabled={userLogin.role === 'student'}
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
              <Grid item xs={6}>
                <h3>Participate Teachers</h3>
                <MultiSelect
                  options={teacherListOption}
                  value={teacherList}
                  onChange={setTeacherList}
                  disabled={userLogin.role === 'student'}
                  labelledBy="Select"
                />
              </Grid>
              <Grid item xs={6}>
                <div className='label-link-form-registry'>
                  <h3>Link Form Registry</h3> |
                  {!isEditLinkFormRegistry ? <span className='edit-action' onClick={() => setIsEditLinkFormRegistry(true)}>Edit</span> : <span className='edit-action' onClick={() => setIsEditLinkFormRegistry(false)}>Cancel</span>}
                </div>
                {isEditLinkFormRegistry ? <TextField
                  onChange={(e) => handleChangeEventInfo('linkFormRegistry', e.target.value)}
                  value={eventInfo.linkFormRegistry}
                  required
                  type='text'
                  id="outlined-required"
                  size='small'
                  sx={{ minWidth: "100%" }}
                /> : <a target='blank' href={eventInfo.linkFormRegistry}>{eventInfo.linkFormRegistry}</a>}

              </Grid>
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
              {/* 2 table register student and participate student */}
              <Grid item xs={6}>
                <Stack direction="row" spacing={2} className="my-2 mb-3">
                  <h3>Register Students</h3>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1 }}
                  ></Typography>
                  {userLogin.role !== 'student' && <><ImportFile id="import-register-students" fileUploaded={handleImportRegisterStudentsFile}></ImportFile>
                    <FileDownload sx={{ cursor: "pointer" }} onClick={() => handleDownloadFile(registryListFile, 'register student')} /></>}
                </Stack>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                  {registerStudentsFile?.name}
                  {registerStudentsFile ? <Button variant="contained" color="primary" onClick={() => handleUploadFile('registerStudentsFile')}>Upload</Button> : ''}
                </Box>

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
                  {userLogin.role !== 'student' && <><ImportFile id="import-participate-students" fileUploaded={handleImportPaticipateStudentsFile}></ImportFile>
                    <FileDownload sx={{ cursor: "pointer" }} onClick={() => handleDownloadFile(participateStudents, 'participate students')} /></>}
                </Stack>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  {participateStudentsFile?.name}
                  {participateStudentsFile ? <Button variant="contained" color="primary" onClick={() => handleUploadFile('participateStudentsFile', true)}>Upload</Button> : ''}
                </Box>
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
              <Grid item xs={12}>
                <Typography variant='h5' align='right'>
                  {userLogin.role !== 'student' && <Button style={{ backgroundColor: 'rgb(0, 35, 102)' }} variant='contained' sx={{ m: 1 }} onClick={updateEvent}>
                    Save
                  </Button>
                  }
                  <Button style={{ backgroundColor: 'rgb(0, 35, 102)' }} variant='contained' sx={{ m: 1 }} onClick={cancelEvent}>
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
