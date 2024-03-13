import React from 'react'
import { useState, useEffect } from 'react';
import CardContent from '@mui/material/CardContent';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import EventNoteIcon from '@mui/icons-material/EventNote';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import CountUp from 'react-countup';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import { Typography } from '@mui/material';
import { useCallback } from 'react';
import axios from 'axios';

export default function SummaryCard() {
  const currentYear = new Date().getFullYear();

  const [cardSummary, setCardSummary] = useState({
    total: 0,
    finished: 0,
    ongoing: 0,
    undone: 0,
  });

  const getSummary = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3001/events/summary/year');
      const summaryData = {
        total: response.data.summary.totalEvents,
        finished: response.data.summary.totalFinishedEvents,
        ongoing: response.data.summary.totalOngoingEvents,
        undone: response.data.summary.totalUndoneEvents,
      }
      setCardSummary(summaryData)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  },[setCardSummary])

  useEffect(() => {
    getSummary();
  }, [getSummary]);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Stack spacing={2} direction={'row'}>
            <Card sx={{ minWidth: 24 + "%" }} className='card-total'>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div" margin={0}>
                  Total Events
                </Typography>
                <div>
                  <EventNoteIcon></EventNoteIcon>
                  <span className='card-icon-num'><CountUp delay={0.3} end={cardSummary.total} duration={0.8} /></span>
                  <span className='card-icon-year'>/ year {currentYear}</span>
                </div>
              </CardContent>
            </Card>
            <Card sx={{ minWidth: 24 + "%" }} className='card-finish'>
              <CardContent >
                <Typography gutterBottom variant="h5" component="div" margin={0}>
                  Finished Events
                </Typography>
                <div>
                  <EventAvailableIcon></EventAvailableIcon>
                  <span className='card-icon-num'><CountUp delay={0.3} end={cardSummary.finished} duration={0.8} /></span>
                  <span className='card-icon-year'>/ year {currentYear}</span>
                </div>
              </CardContent>
            </Card>
            <Card sx={{ minWidth: 24 + "%" }} className='card-ongoing'>
              <CardContent >
                <Typography gutterBottom variant="h5" component="div" margin={0}>
                  Ongoing Events
                </Typography>
                <div>
                  <EventRepeatIcon></EventRepeatIcon>
                  <span className='card-icon-num'><CountUp delay={0.3} end={cardSummary.ongoing} duration={0.8} /></span>
                  <span className='card-icon-year'>/ year {currentYear}</span>
                </div>
              </CardContent>
            </Card>
            <Card sx={{ minWidth: 24 + "%" }} className='card-unstarted'>
              <CardContent >
                <Typography gutterBottom variant="h5" component="div" margin={0}>
                  Unstarted Events
                </Typography>
                <div>
                  <EventBusyIcon></EventBusyIcon>
                  <span className='card-icon-num'><CountUp delay={0.3} end={cardSummary.undone} duration={0.8} /></span>
                  <span className='card-icon-year'>/ year {currentYear}</span>
                </div>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </>
  )
}
