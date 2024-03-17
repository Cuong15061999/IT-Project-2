import React, { useCallback, useState, useEffect } from 'react';
import { Info } from "@mui/icons-material";
import {
  Paper,
  TableContainer,
  TableHead,
  Table,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Stack,
  Autocomplete,
  TextField,
} from '@mui/material';
import axios from 'axios';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

export default function AccountHistory() {
  const navigate = useNavigate();
  const headerList = ["Name", "Status", "Activity Point", "Start Date", "End Date", "Action"];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  const [summaryInfo, setSummaryInfo] = useState({
    totalEvents: 0,
    totalPoints: 0,
  })

  const access_token = jwtDecode(Cookies.get('access_token'));
  const user_id = access_token.payload.user_id;
  const role = access_token.payload.role;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getEvents = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3001/events/userId/${user_id}`);
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
  }, [setRows, user_id]);

  const getHistorySummary = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3001/events/history-summary/${user_id}`);
      setSummaryInfo({
        totalEvents: response.data.data.totalEvents ? response.data.data.totalEvents : 0,
        totalPoints: response.data.data.totalPoints ? response.data.data.totalPoints : 0,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [user_id, setSummaryInfo])

  useEffect(() => {
    //get all event which user participate in
    getEvents();

    //get event history summary
    getHistorySummary();
  }, [getEvents, getHistorySummary]);

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
    <Paper sx={{ p: 1, width: '100%', overflow: 'hidden' }}>
      <Stack direction="row" spacing={2} className="my-2 mb-2" style={{ justifyContent: 'space-between' }}>
        <h1>My Participation History</h1>
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
      </Stack>
      <TableContainer sx={{ minHeight: 50 + 'vh', maxHeight: 60 + 'vh' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {headerList.map((column, index) => (
                <TableCell key={index} align="center" style={{ minWidth: "10%" }}>
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
                      <Info
                        style={{
                          fontSize: "20px",
                          color: "green",
                          cursor: "pointer",
                        }}
                        onClick={() => { navigate(`/event/${row.id}`) }}
                      />
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
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <h3>Total events participate in year: {summaryInfo.totalEvents}. </h3>
      </div>
      {role === 'student' ?
        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <h3>Total activities points in year: {summaryInfo.totalPoints} pts. </h3>
        </div> : <></>
      }
    </Paper>
  )
}
