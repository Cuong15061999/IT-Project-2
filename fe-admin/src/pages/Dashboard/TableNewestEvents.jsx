import React, { useCallback } from 'react'
import { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import InfoIcon from '@mui/icons-material/Info';
import Card from '@mui/material/Card';
import axios from 'axios';
import moment from 'moment';

const columns = [
  { field: 'name', headerName: 'Name', flex: 2 },
  { field: 'host', headerName: 'Host', flex: 2 },
  { field: 'startDate', headerName: 'Start Date', flex: 1.5},
  { field: 'endDate', headerName: 'End Date', flex: 1.5},
  {
    field: 'action',
    headerName: 'Action',
    sortable: false,
    flex: 1,
    renderCell: (params) => {
      const handleClick = (e) => {
        e.stopPropagation(); // Prevent row selection

        const { id, name } = params.row; // Destructure needed data

        // Custom message logic (optional)
        const customMessage = `Row ID: ${id}\nName: ${name}`; // Example of customized message

        // in this row will navigate to events info 
        alert(customMessage); // Alert with more informative message
      };
      return <Button startIcon={<InfoIcon/>} onClick={handleClick}></Button>;
    },
  },
];

export default function TableNewestEvents() {
  const [rows, setRows] = useState([]);
  const getNewestEvents = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3001/events/newest`);
      const filterData = response.data.data.map((row) => ({
        id: row._id,
        host: row.host.email,
        name: row.name,
        startDate: moment(row.startAt).format('DD/MM/YYYY'),
        endDate:  moment(row.endAt).format('DD/MM/YYYY'),
      }));
      setRows(filterData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [setRows])

  useEffect(() => {
    getNewestEvents();
  }, [getNewestEvents]);

  return (
    <>
      <Card sx={{ height: 60 + "vh" }}>
        <div className='Table' style={{ height: 56 + "vh", width: '100%', padding: "10px" }}>
          <h3>10 Newest Events</h3>
          <DataGrid
            rows={rows}
            columns={columns}
          />
        </div>
      </Card>
    </>
  )
}
