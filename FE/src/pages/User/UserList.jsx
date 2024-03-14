import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Stack,
  Autocomplete,
  TextField,
} from '@mui/material';
import { Edit, Delete, AddCircle } from "@mui/icons-material";
import Swal from "sweetalert2";
import axios from 'axios';
import Modal from '@mui/material/Modal';
import AddUser from './AddUser';
import EditUser from './EditUser';
import { useAppStore } from '../../appStore';
import { useCallback } from 'react';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function UserList() {
  const headerCells = ["Email", "Class", "Falculty", "Name", "Role", "Action"];

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [userData, setUserData] = useState({});

  const setRows = useAppStore((state) => state.setRows);
  const rows = useAppStore((state) => state.rows);

  const [open, setOpen] = useState(false);
  const [editopen, setEditOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleEditOpen = () => setEditOpen(true);

  const handleClose = () => setOpen(false);
  const handleEditClose = () => setEditOpen(false);


  const [role, setRole] = useState("");
  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };
  const roles = [
    {
      value: '',
      label: 'All'
    },
    {
      value: 'student',
      label: 'Student'
    },
    {
      value: 'teacher',
      label: 'Teacher'
    }
  ];

  const getUsers = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:3001/users/?role=${role}`);
      const filteredData = response.data.data.map((row) => ({
        id: row._id,
        email: row.email,
        name: row.name,
        class: row.class,
        falculty: row.falculty,
        role: row.role,
      }));
      setRows(filteredData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [setRows, role]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const delUsers = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3001/users/${id}`);
      if (response.status === 200) {
        Swal.fire("Deleted!", "Your user has been deleted.", "success");
        getUsers();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Swal.fire("Delete Error!", "There some error happen.", "warning");
    }
  };

  const editUser = (id, name, userClass, falculty, email, role) => {
    const data = {
      id: id,
      name: name,
      userClass: userClass,
      falculty: falculty,
      email: email,
      role: role
    };
    setUserData(data);
    handleEditOpen();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const deleteUser = (id) => {
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
        delUsers(id);
      }
    });
  };

  const filterData = (v) => {
    if (v) {
      setRows([v]);
    } else {
      getUsers();
    }
  };

  return (
    <Paper sx={{ p: 1, width: '98%', overflow: 'hidden' }}>
      <h1>User List</h1>
      <div>
        <Modal
          open={open}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <AddUser closeEvent={handleClose}></AddUser>
          </Box>
        </Modal>
        <Modal
          open={editopen}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <EditUser closeEvent={handleEditClose} udata={userData}></EditUser>
          </Box>
        </Modal>
      </div>
      <Stack direction="row" spacing={2} className="my-2 mb-2">
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={rows}
          sx={{ width: 300 }}
          onChange={(e, v) => filterData(v)}
          getOptionLabel={(rows) => rows.email || ""}
          renderInput={(params) => (
            <TextField {...params} size="small" label="Search User Email" />
          )}
        />
        <Grid item sx={{ width: 100 }}>
          <TextField
            onChange={handleRoleChange}
            value={role}
            select
            id="outlined-required"
            label="Role"
            size='small'
            sx={{ minWidth: "100%" }}
          >
            {roles.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
        ></Typography>
        <Button variant="contained" endIcon={<AddCircle />} onClick={handleOpen}>
          Add
        </Button>
      </Stack>
      <Box height={10} />
      <TableContainer sx={{ minHeight: 60 + 'vh', maxHeight: 80 + 'vh' }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {headerCells.map((cell) => (
                <TableCell key={cell} align="left" style={{ minWidth: "20%" }}>
                  {cell}
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
                    <TableCell align="left">
                      {row.email}
                    </TableCell>
                    <TableCell align="left">
                      {row.class}
                    </TableCell>
                    <TableCell align="left">
                      {row.falculty}
                    </TableCell>
                    <TableCell align="left">
                      {row.name}
                    </TableCell>
                    <TableCell align="left">
                      {row.role}
                    </TableCell>
                    <TableCell align="left">
                      <Stack spacing={2} direction="row">
                        <Edit
                          style={{
                            fontSize: "20px",
                            color: "blue",
                            cursor: "pointer",
                          }}
                          className="cursor-pointer"
                          onClick={() =>
                            editUser(row.id, row.name, row.class, row.falculty, row.email, row.role)
                          }
                        />
                        <Delete
                          style={{
                            fontSize: "20px",
                            color: "darkred",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            deleteUser(row.id);
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
  );
}