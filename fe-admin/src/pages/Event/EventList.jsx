import React, { useCallback } from 'react'
import { useState, useEffect } from 'react';
import {
  Edit,
  Delete,
  Info,
  AddCircle
} from "@mui/icons-material"
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
        host: row.host.email,
        status: row.status,
        trainingPoints: row.trainingPoints,
        startDate: moment(row.startAt).format('DD/MM/YYYY'),
        endDate: moment(row.endAt).format('DD/MM/YYYY'),
      }));
      setRows(filterData || [])
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  },[setRows]);

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
        <Button variant="contained" endIcon={<AddCircle />} onClick={() => {navigate(`/event/add`)}}>
          Add
        </Button>
      </Stack>
      <Box height={10} />
      <TableContainer sx={{ minHeight: 60 + 'vh', maxHeight: 80 + 'vh' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="left" style={{ minWidth: "12%" }} >
                Name
              </TableCell>
              <TableCell align="left" style={{ minWidth: "12%" }} >
                Host
              </TableCell>
              <TableCell align="left" style={{ minWidth: "12%" }} >
                Status
              </TableCell>
              <TableCell align="left" style={{ minWidth: "12%" }} >
                Training Point
              </TableCell>
              <TableCell align="left" style={{ minWidth: "12%" }} >
                Start Date
              </TableCell>
              <TableCell align="left" style={{ minWidth: "12%" }} >
                End Date
              </TableCell>
              <TableCell align="left" style={{ minWidth: "12%" }} >
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow key={row.id} hover role="checkbox" tabIndex={-1}>
                    <TableCell align="left">
                      {row.name}
                    </TableCell>
                    <TableCell align="left">
                      {row.host}
                    </TableCell>
                    <TableCell align="left">
                      {row.status}
                    </TableCell>
                    <TableCell align="left">
                      {row.trainingPoints}
                    </TableCell>
                    <TableCell align="left">
                      {row.startDate}
                    </TableCell>
                    <TableCell align="left">
                      {row.endDate}
                    </TableCell>
                    <TableCell align="left">
                      <Stack spacing={2} direction="row">
                        <Info
                          style={{
                            fontSize: "20px",
                            color: "green",
                            cursor: "pointer",
                          }}
                          onClick={() => {navigate(`/event/${row.id}`)}}
                        />
                        <Edit
                          style={{
                            fontSize: "20px",
                            color: "blue",
                            cursor: "pointer",
                          }}
                          onClick={() => {navigate(`/event/${row.id}`)}}
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
