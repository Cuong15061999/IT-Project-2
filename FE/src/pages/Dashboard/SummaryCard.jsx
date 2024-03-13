import React, { useState, useEffect, useCallback } from 'react';
import { CardContent, Grid, Stack, Card, Typography } from '@mui/material';
import { EventAvailable, EventBusy, EventNote, EventRepeat } from '@mui/icons-material';
import CountUp from 'react-countup';
import axios from 'axios';

export default function SummaryCard() {
  const currentYear = new Date().getFullYear();

  const [cardSummary, setCardSummary] = useState({
    total: 0,
    finished: 0,
    ongoing: 0,
    todo: 0,
  });

  const getSummary = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3001/events/summary/year');
      const summaryData = {
        total: response.data.summary.totalEvents,
        finished: response.data.summary.totalFinishedEvents,
        ongoing: response.data.summary.totalOngoingEvents,
        todo: response.data.summary.totalTodoEvents,
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
                  <EventNote></EventNote>
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
                  <EventAvailable></EventAvailable>
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
                  <EventRepeat></EventRepeat>
                  <span className='card-icon-num'><CountUp delay={0.3} end={cardSummary.ongoing} duration={0.8} /></span>
                  <span className='card-icon-year'>/ year {currentYear}</span>
                </div>
              </CardContent>
            </Card>
            <Card sx={{ minWidth: 24 + "%" }} className='card-unstarted'>
              <CardContent >
                <Typography gutterBottom variant="h5" component="div" margin={0}>
                  Todo Events
                </Typography>
                <div>
                  <EventBusy></EventBusy>
                  <span className='card-icon-num'><CountUp delay={0.3} end={cardSummary.todo} duration={0.8} /></span>
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
