import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';
import Add from './actions/Add';
import Edit from './actions/Edit';
import Delete from './actions/Delete';
import Snackdel from './snacks/Snackdel';
import Snackadd from './snacks/Snackadd';
import Snackedit from './snacks/Snackedit';
import authHeader from '../services/auth-header';
import UserService from '../services/user.service';
import AuthService from '../services/auth.service';

const useStyles = makeStyles((theme) => ({
  root: { margin: theme.spacing(1) * 2, padding: theme.spacing(1) * 2, textAlign: 'center' },
  progress: { margin: theme.spacing(2) },
  mg: { margin: theme.spacing(1) },
  contbutt: { paddingTop: theme.spacing(2) },
}));

function MaybeLoading({ loading }) {
  const classes = useStyles();
  return loading ? (
    <CircularProgress className={classes.progress} />
  ) : null;
}

function Tab() {
  const baseURL = `${UserService.API_URL}productsbyuser/`;
  const header = { headers: authHeader() };
  const [buttonDelete, setButtonDelete] = useState(true); /* Disable Delete Button */
  const [buttonEdit, setButtonEdit] = useState(true); /* Disable Edit Button */
  const [rows, setRows] = useState([]); /* Rows State */
  const [selRow, setSelRow] = useState([]); /* Row Selected State */
  const [columns, setColumns] = useState([ /* Columns State */
    { name: 'ID', active: false },
    { name: 'Name', active: false },
    { name: 'Price', active: false, numeric: true },
    { name: 'Reference', active: false },
  ]);
  const [loading, setLoading] = useState(true); /* Loading progress state */
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [data, setData] = useState({
    name: '',
    price: '',
    reference: '',
  }); /* Input create form state */
  const [open, setOpen] = useState(false);
  const [snackDel, setSnackDel] = useState(false);
  const [snackAdd, setSnackAdd] = useState(false);
  const [snackEdit, setSnackEdit] = useState(false);
  /* Use async await for loading */
  useEffect(async () => {
    await peticionGet();
    setLoading(false);
  }, []);

  const peticionGet = async () => {
    await axios.get(baseURL, header)
      .then((response) => {
        setRows(response.data);
        console.log(baseURL)
      });
  };

  const onRowClick = (id) => () => {
    const newRows = [...rows];
    const index = rows.findIndex((row) => row.id === id);
    const row = rows[index];
    setSelRow(rows[index]); /* Añade al estado la fila seleccionada */

    /* Añade al state el campo selected true a las filas seleccionadas */
    newRows[index] = { ...row, selected: !row.selected };
    setRows(newRows);

    // Habilita los botones editar y eliminar
    setButtonDelete(false);
    setButtonEdit(false);
    // Desahabilita los botones editar y eliminar cuando hay mas de una selección
    if (selections() > 0) {
      setButtonEdit(true);
      setButtonDelete(true);
    }
  };

  const selections = () => rows.filter((row) => row.selected).length; /* Count selections number */
  const classes = useStyles();

  const history = useHistory();
  const Redirect = () => {
    history.push('/');
  }; 

  const logOut = () => {
    AuthService.logout();
    Redirect();
  };

  return (
    <>
      <Paper className={classes.root}>
        <Typography variant="h4" id="tableTitle">
          {`(${selections()}) Productos Seleccionados`}
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.name}>
                  {column.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={onRowClick(row.id)}
                selected={row.selected}
              >
                <TableCell component="th" scope="row">{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.price}</TableCell>
                <TableCell>{row.reference}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <MaybeLoading className={classes.root} loading={loading} />
        <Container className={classes.contbutt}>
          <Button className={classes.mg} variant="contained" disabled={buttonDelete} onClick={() => { setAdd(false); setEdit(false); setOpen(true); }}>Eliminar</Button>
          <Button className={classes.mg} variant="contained" disabled={buttonEdit} onClick={() => { setEdit(true); setAdd(false); }}>Editar</Button>
          <Button className={classes.mg} variant="contained" onClick={() => { setAdd(true); setEdit(false); }}>Nuevo</Button>
          <Button className={classes.mg} variant="contained" color="secondary" onClick={logOut}>Salir</Button>
        </Container>

        {add
          ? (
            <>
              <Add setData={setData} data={data} setRows={setRows} rows={rows} styles={classes} setSnackAdd={setSnackAdd} baseURL={baseURL} header={header} />
            </>
          )
          : null}

        {edit
          ? (
            <>
              <Edit setSelRow={setSelRow} selRow={selRow} setRows={setRows} rows={rows} styles={classes} setSnackEdit={setSnackEdit} baseURL={baseURL} header={header} />
            </>
          )
          : null}
        <><Delete open={open} setOpen={setOpen} setSnack={setSnackDel} rows={rows} setRows={setRows} selRow={selRow} baseURL={baseURL} header={header}/></>
        <><Snackadd setSnack={setSnackAdd} open={snackAdd} setOpen={setSnackAdd} data={data} /></>
        <><Snackdel setSnack={setSnackDel} open={snackDel} setOpen={setSnackDel} selRow={selRow} /></>
        <><Snackedit setSnack={setSnackEdit} open={snackEdit} setOpen={setSnackEdit} selRow={selRow} /></>
      </Paper>
    </>
  );
}

export default Tab;
