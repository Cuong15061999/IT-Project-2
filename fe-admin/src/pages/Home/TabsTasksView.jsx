import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, Typography, Box } from '@mui/material';
import CustomCalendar from '../../components/CustomCalendar';
import ListTasksHome from '../../components/ListTasksHome';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';
import { useEffect, useState } from 'react';

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

export default function TabsTasksView() {
  const [value, setValue] = React.useState(0);
  const [listEvens, setListEvents] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getEvents = async () => {
    try {
      const urlGetEvents = `http://localhost:3001/events`;
      const { data } = await axios.get(urlGetEvents);
      if (data.data) {
        setListEvents(data.data.map(item => ({
          ...item,
          startAt: new Date(item.startAt),
          endAt: new Date(item.endAt),
        })));
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getEvents();
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Calendar" {...a11yProps(0)} />
          <Tab label="Board" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <CustomCalendar data={listEvens}></CustomCalendar>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <DndProvider backend={HTML5Backend}>
          <ListTasksHome data={listEvens}></ListTasksHome>
        </DndProvider>
      </TabPanel>
    </Box>
  );
}