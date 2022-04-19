import { React, useState, useEffect } from 'react'
//import Login from '../login/login'
import useForm from './useEditForm'
//import validate from './validatePreglediEdit'
//import './pregledi.css'
//import DateTimePicker from '@mui/lab/DateTimePicker';
import DesktopDateTimePicker from '@mui/lab/DesktopDateTimePicker';
import MobileDateTimePicker from '@mui/lab/MobileDateTimePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { Link, useParams } from 'react-router-dom'
import {
  Paper,
  Grid,
  TextField,
  FormHelperText,
  Button,
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from '@material-ui/core'

export default function PreglediEdit(props) {
    const { id } = useParams()
    const [successMessage, setSuccessMessage] = useState('')
    const [pregledi, setPregledi] = useState([])
    const [update, setUpdate] = useState(1)
    const [disableSelect, setDisableSelect] = useState(false)
    const [newValue, setValue] = useState(new Date());
    
  
  
    function Success(message) {
      setSuccessMessage(message)
      document.getElementById('submitButton').disabled = true
      setTimeout(() => {
        document.getElementById('redirect').click()
      }, 2000)
    }
  
    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')
  
    const statusi = [
      { value: 1, label: 'Na čekanju' },
      { value: 2, label: 'Naručen' },
      { value: 3, label: 'Obavljen' }
    ]
  
    useEffect(() => {
      fetch(
        'http://localhost/vuv-medical/API/api/pregledi/read.php',
        {
          method: 'GET',
          headers: myHeaders,
        }
      )
        .then((response) => response.json())
        .then((data) => setPregledi(data))
  
      fetch(
          'http://localhost/vuv-medical/API/api/pregledi/readSingle.php?id=' +
          id,
        {
          method: 'GET',
          headers: myHeaders,
        }
      )
        .then((response) => response.json())
        .then((data) => {
          handleExistingValues(data)
        })
    }, [])
  
    const { handleChange, values, handleSubmit} = useForm(
      id,
      newValue,
      Success

    )
  
    const handleExistingValues = (data) => {
      values.oib = data.oib
      values.ime = data.ime
      values.prezime = data.prezime
      values.razlog = data.razlog
      values.opis = data.opis
      values.termin = data.termin
      values.status = data.status
      values.doktor = data.doktor
      setUpdate(update + 1)
    }
  
    return (
      <>
          <Grid item xs>
            <Paper className='editContainer' elevation={10}>
              <form onSubmit={handleSubmit}>
                <Grid className='gridClass' container spacing={3}>
                <Grid item xs>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DesktopDateTimePicker
                        renderInput={(props) => <TextField {...props} />}
                        label='DateTimePicker'
                        name='termin'
                        value={values.termin}
                        onChange={(newValue)=> 
                          {
                            setValue(newValue);
                          }
                    }
                    />
                </LocalizationProvider>
                </Grid>
                  <Grid item xs>
                      <>
                        <FormControl variant='outlined' className='selectEdit'>
                          <InputLabel id='labelStatusi'>Status</InputLabel>
                          <Select
                            labelId='labelStatusi'
                            name='status'
                            value={values.status}
                            onChange={handleChange}
                            label='Status'
                          >
                            {statusi.map((status) => (
                              <MenuItem key={status.value} value={status.label}>
                                {status.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </>
                  </Grid>
                  <Link id='redirect' to='/pregledi' />
                  <Button
                    id='submitButton'
                    type='submit'
                    variant='contained'
                    color='primary'
                    className='input'
                  >
                    Ažuriraj
                  </Button>
                  {successMessage && (
                    <FormHelperText className='successText'>
                      {successMessage}
                    </FormHelperText>
                  )}
                </Grid>
              </form>
            </Paper>
          </Grid>
      
      </>
    )
  }
  