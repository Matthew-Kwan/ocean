import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
// import usersList from '../App.js'
import { deleteUser, getUsers} from '../../actions/users';



const useStyles = makeStyles({
  table: {
    minWidth: 450,
  },
});


export default function AdminUsersTable({users,setUsers}) {

  const classes = useStyles();
  
  useEffect(() => setUsers(users),[])
  getUsers(setUsers)
  return (
    <TableContainer component={Paper}>
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          All Users
        </Typography>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell align="right">Email</TableCell>
            <TableCell align="right">User ID</TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((row) => (
            <TableRow key={row.title}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.username}</TableCell>
              <TableCell align="right">{row.id}</TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
