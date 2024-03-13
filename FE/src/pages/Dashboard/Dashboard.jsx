import React from 'react'
import './Dashboard.css'
import { Typography, Box, Grid, Stack, Card } from '@mui/material';
import SideNav from '../../components/Drawer'
import NavBar from '../../components/NavBar'
import SummaryCard from './SummaryCard';
import SummaryPieChart from './PieChart';
import TableNewestEvents from './TableNewestEvents';

export const Dashboard = () => {
  const monthNumber = new Date().getMonth();
  const month = new Date(2024, monthNumber, 1).toLocaleString('en-US', { month: 'long' });
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
              <TableNewestEvents></TableNewestEvents>
            </Grid>
            <Grid item xs={4}>
              <Card sx={{ height: 60 + "vh" }}>
                <Stack direction="row" width="100%" textAlign="center" spacing={2}>
                  <Box flexGrow={1}>
                    <Typography variant="h5" component="div" paddingTop={"10px"}>
                      Events In {month}
                    </Typography>
                    <Box height={40}></Box>
                    <SummaryPieChart></SummaryPieChart>
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
