import React from 'react'
import './Dashboard.css'
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import Card from '@mui/material/Card';
import SideNav from '../../components/Drawer'
import NavBar from '../../components/NavBar'
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { PieChart } from '@mui/x-charts/PieChart';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import InfoIcon from '@mui/icons-material/Info';
import SummaryCard from './SummaryCard';

const columns = [
  { field: 'name', headerName: 'Name', flex: 2 },
  { field: 'host', headerName: 'Host', flex: 2 },
  { field: 'startDate', headerName: 'Start Date', flex: 1},
  {
    field: 'action',
    headerName: '',
    sortable: false,
    renderCell: (params) => {
      const handleClick = (e) => {
        e.stopPropagation(); // Prevent row selection

        const { id, name } = params.row; // Destructure needed data

        // Custom message logic (optional)
        const customMessage = `Row ID: ${id}\nName: ${name}`; // Example of customized message

        alert(customMessage); // Alert with more informative message
      };
      return <Button startIcon={<InfoIcon/>} onClick={handleClick}>Details</Button>;
    },
  },
];
const rows = [
  { id: 1, name: 'Event 1', host: 'teacher1@gmail.com' , startDate: '11/12/2022'},
  { id: 2, name: 'Event 2', host: 'teacher2@gmail.com' , startDate: '12/12/2022'},
  { id: 3, name: 'Event 3', host: 'teacher3@gmail.com' , startDate: '13/12/2022'},
  { id: 4, name: 'Event 4', host: 'teacher4@gmail.com' , startDate: '14/12/2022'},
  { id: 5, name: 'Event 5', host: 'teacher5@gmail.com' , startDate: '15/12/2022'},
  { id: 6, name: 'Event 6', host: 'teacher6@gmail.com' , startDate: '16/12/2022'},
  { id: 7, name: 'Event 7', host: 'teacher7@gmail.com' , startDate: '17/12/2022'},
  { id: 8, name: 'Event 8', host: 'teacher8@gmail.com' , startDate: '18/12/2022'},
  { id: 9, name: 'Event 9', host: 'teacher9@gmail.com' , startDate: '19/12/2022'},
  { id: 10, name: 'Event 10', host: 'teacher10@gmail.com' , startDate: '20/12/2022'},
]

export const Dashboard = () => {

  return (
    <>
      <NavBar></NavBar>
      <Box height={45}></Box>
      <Box sx={{ display: 'flex' }}>
        <SideNav></SideNav>
        <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: "#ECEFF4" }}>
          <h1>Dashboard</h1>
          <SummaryCard></SummaryCard>
          <Box height={20}></Box>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Card sx={{ height: 60 + "vh" }}>
                <div className='Table' style={{ height: 56 + "vh", width: '100%', padding: "10px" }}>
                  <h3>10 Newest Events</h3>
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                  />
                </div>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card sx={{ height: 60 + "vh" }}>
                <Stack direction="row" width="100%" textAlign="center" spacing={2}>
                  <Box flexGrow={1}>
                    <Typography variant="h5" component="div" paddingTop={"10px"}>
                      Events Activity Chart
                    </Typography>
                    <Box height={40}></Box>
                    <PieChart
                      series={[
                        {
                          data: [
                            { id: 0, value: 20, label: 'Finished', color: 'rgba(9, 175, 232, 0.8)' },
                            { id: 1, value: 50, label: 'Ongoing', color: 'rgba(41, 244, 153, 1)' },
                            { id: 2, value: 30, label: 'Unstarted', color: 'rgba(255, 109, 136, 1)' },
                          ],
                          innerRadius: 20,
                          highlightScope: { faded: 'global', highlighted: 'item' },
                          faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                        },
                      ]}
                      // width={400}
                      height={220}
                    />
                  </Box>
                </Stack>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  )
}
