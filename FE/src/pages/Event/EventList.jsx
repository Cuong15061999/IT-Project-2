import React, { useCallback, useState, useEffect } from 'react';
import { Edit, Delete, Info, AddCircle } from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  Autocomplete,
  Paper,
  Stack,
  TextField,
  TableContainer,
  TableHead,
  Table,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
} from '@mui/material';
import axios from 'axios';
import moment from 'moment';
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';

export default function EventList() {
  const navigate = useNavigate();
  const headerList = ["Name", "Host", "Location", "Status", "Activity Point", "Start Date", "End Date", "Action"];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([])


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getEvents = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3001/events`);
      const filterData = response.data.data.map((row) => ({
        id: row._id,
        name: row.name,
        host: row.host?.email || '',
        location: row.location,
        status: row.status,
        activitiesPoint: row.activitiesPoint,
        startDate: moment(row.startAt).format('DD/MM/YYYY'),
        endDate: moment(row.endAt).format('DD/MM/YYYY'),
      }));
      setRows(filterData || [])
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [setRows]);

  const delEvents = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3001/events/${id}`);
      if (response.status === 200) {
        Swal.fire("Deleted!", "Your event has been deleted.", "success");
        getEvents();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Swal.fire("Delete Error!", "There some error happen.", "warning");
    }
  }

  const deleteEvents = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        delEvents(id);
      }
    });
  };

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  const filterData = (v) => {
    if (v) {
      setRows([v]);
    } else {
      getEvents();
    }
  };

  const getColorByStatus = (status) => {
    switch (status) {
      case 'todo':
        return 'rgba(255, 109, 136, 1)';
      case 'ongoing':
        return 'rgb(178, 231, 19)';
      case 'finished':
        return 'rgba(41, 244, 153, 1)';
      default:
        return 'inherit'; // Default color
    }
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <Paper sx={{ p: 1, width: '98%', overflow: 'hidden' }}>
      <h1>Events List</h1>
      <Stack direction="row" spacing={2} className="my-2 mb-2">
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={rows}
          sx={{ width: 300 }}
          onChange={(e, v) => filterData(v)}
          getOptionLabel={(rows) => rows.name || ""}
          renderInput={(params) => (
            <TextField {...params} size="small" label="Search Event Name" />
          )}
        />
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
        ></Typography>
        <Button style={{backgroundColor: 'rgb(0, 35, 102)'}} variant="contained" endIcon={<AddCircle />} onClick={() => { navigate(`/event/add`) }}>
          Add
        </Button>
      </Stack>
      <Box height={10} />
      <TableContainer sx={{ minHeight: 60 + 'vh', maxHeight: 80 + 'vh' }}>
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
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow key={row.id} hover role="checkbox" tabIndex={-1}>
                    <TableCell align="center">
                      {row.name}
                    </TableCell>
                    <TableCell align="center">
                      {row.host}
                    </TableCell>
                    <TableCell align="center">
                      {row.location}
                    </TableCell>
                    <TableCell align="center" style={{ color: getColorByStatus(row.status), fontWeight: 'bold' }}>
                      {capitalizeFirstLetter(row.status)}
                    </TableCell>
                    <TableCell align="center">
                      {row.activitiesPoint}
                    </TableCell>
                    <TableCell align="center">
                      {row.startDate}
                    </TableCell>
                    <TableCell align="center">
                      {row.endDate}
                    </TableCell>
                    <TableCell align="center">
                      <Stack spacing={2} direction="row">
                        <Info
                          style={{
                            fontSize: "20px",
                            color: "green",
                            cursor: "pointer",
                          }}
                          onClick={() => { navigate(`/event/${row.id}`) }}
                        />
                        <Edit
                          style={{
                            fontSize: "20px",
                            color: "blue",
                            cursor: "pointer",
                          }}
                          onClick={() => { navigate(`/event/${row.id}`) }}
                        />
                        <Delete
                          style={{
                            fontSize: "20px",
                            color: "darkred",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            deleteEvents(row.id);
                          }}
                        />
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}
