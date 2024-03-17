import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, Typography, Box, Backdrop, CircularProgress } from '@mui/material';
import CustomCalendar from '../../components/CustomCalendar';
import ListTasksHome from '../../components/ListTasksHome';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTabHomeSelected, setTasks } from '../../store/myTasks';
import ModalEditTask from '../../components/ModalEditTask';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function TabsTasksView({ user_id }) {
  const tabHomeSelected = useSelector((state) => state.my_tasks.tabHomeSelected);
  const [value, setValue] = useState(tabHomeSelected);
  const isLoading = useSelector((state) => state.my_tasks.isLoading);

  const dispatch = useDispatch();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getEvents = useCallback(async () => {
    try {
      const urlGetEvents = `http://localhost:3001/events/userId/${user_id}`;
      const { data } = await axios.get(urlGetEvents);
      if (data.data) {
        dispatch(setTasks(data.data));
      }
    } catch (error) {
      console.log(error)
    }
  },[dispatch, user_id]);

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  useEffect(() => {
    dispatch(setTabHomeSelected(value));
  }, [value, dispatch])

  return (
    <>
      <Backdrop
        style={{ zIndex: 1500 }}
        sx={{ color: '#fff' }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Calendar" {...a11yProps(0)} />
            <Tab label="Board" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <CustomCalendar></CustomCalendar>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <DndProvider backend={HTML5Backend}>
            <ListTasksHome></ListTasksHome>
          </DndProvider>
        </TabPanel>
      </Box>
      <ModalEditTask></ModalEditTask>
    </>
  );
}