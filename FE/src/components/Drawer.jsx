import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useAppStore } from '../appStore';

import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import CelebrationIcon from '@mui/icons-material/Celebration';
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useEffect } from 'react';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function MiniDrawer() {
  const userLogin = useSelector((state) => state.user_login.userLogin);
  const [listMenuItem, setListMenuItem] = useState([]);
  const open = useAppStore((state) => state.dopen);
  const navigate = useNavigate();
  const iconNav = (text) => {
    switch(text) {
      case 'Dashboard': return <DashboardIcon></DashboardIcon>
      case 'Event': return <CelebrationIcon></CelebrationIcon>
      case 'User': return <GroupIcon></GroupIcon>
      case 'Account': return <SwitchAccountIcon></SwitchAccountIcon>
      default : return <HomeIcon></HomeIcon>
    }
  }
  useEffect(() => {
    const { role } = userLogin;
    if (role === 'student') {
      setListMenuItem(['Home', 'Account'])
    } else if (role === 'teacher') {
      setListMenuItem(['Home', 'Dashboard', 'Event', 'Account'])
    } else if (role === 'admin') {
      setListMenuItem(['Home', 'Dashboard', 'Event', 'User', 'Account'])
    }
  }, [userLogin])
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Box height={30}></Box>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton>
            {open === false ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {listMenuItem.map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}
              onClick={() => { text === 'Home' ? navigate("/") : navigate("/" + text) }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {iconNav(text)}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}