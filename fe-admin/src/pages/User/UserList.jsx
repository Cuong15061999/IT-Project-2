import * as React from 'react';
import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [userData, setUserData] = useState({})
  const setRows = useAppStore((state) => state.setRows)
  const rows = useAppStore((state) => state.rows)

  const [open, setOpen] = useState(false);
  const [editopen, setEditOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleEditOpen = () => setEditOpen(true);

  const handleClose = () => setOpen(false);
  const handleEditClose = () => setEditOpen(false);

  const getUsers = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3001/users');
      const filteredData = response.data.data.map((row) => ({
        id: row._id,
        email: row.email,
        username: row.username,
        password: row.password,
        avatar: row.avatar,
        role: row.role,
      }));
      setRows(filteredData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [setRows]);

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
  }

  const editUser = (id, username, password, email, role) => {
    const data = {
      id: id,
      username: username,
      password: password,
      email: email,
      role: role
    };
    setUserData(data);
    handleEditOpen();
  }

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
    <Paper sx={{ width: '98%', overflow: 'hidden' }}>
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
      <Box height={10} />
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
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
        ></Typography>
        <Button variant="contained" endIcon={<AddCircleIcon />} onClick={handleOpen}>
          Add
        </Button>
      </Stack>
      <Box height={10} />
      <TableContainer sx={{ maxHeight: 600 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell align="left" style={{ minWidth: "20%" }} >
                Avatar
              </TableCell>
              <TableCell align="left" style={{ minWidth: "20%" }} >
                Email
              </TableCell>
              <TableCell align="left" style={{ minWidth: "20%" }} >
                User Name
              </TableCell>
              <TableCell align="left" style={{ minWidth: "20%" }} >
                Role
              </TableCell>
              <TableCell align="left" style={{ minWidth: "20%" }} >
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow key={row.id} hover role="checkbox" tabIndex={-1}>
                    <TableCell align="left">
                      {row.avatar}
                    </TableCell>
                    <TableCell align="left">
                      {row.email}
                    </TableCell>
                    <TableCell align="left">
                      {row.username}
                    </TableCell>
                    <TableCell align="left">
                      {row.role}
                    </TableCell>
                    <TableCell align="left">
                      <Stack spacing={2} direction="row">
                        <EditIcon
                          style={{
                            fontSize: "20px",
                            color: "blue",
                            cursor: "pointer",
                          }}
                          className="cursor-pointer"
                          onClick={() =>
                            editUser(row.id, row.username, row.password, row.email, row.role)
                          }
                        />
                        <DeleteIcon
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