import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionActions from '@material-ui/core/AccordionActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker, KeyboardTimePicker
} from '@material-ui/pickers';
import DateFnsUtils from "@date-io/date-fns";
import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import moment from "moment";
import queryString from "querystring"

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  icon: {
    verticalAlign: 'bottom',
    height: 20,
    width: 20,
  },
  details: {
    alignItems: 'center',
  },
  column: {
    flexBasis: '33.33%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  flex: {
    display: 'flex'
  }
}));

export default function DashboardControls({darkMode, fetchMetrics}) {
  const [selectedFullDate, setSelectedFullDate] = React.useState(new Date())
  const [timeRangeMin, setTimeRangeMin] = React.useState(new Date())
  const [timeRangeMax, setTimeRangeMax] = React.useState(new Date())
  const classes = useStyles()

  const updateMetrics = () => {
    let fullDate = moment(selectedFullDate)
    let rangeMin = moment(timeRangeMin).year(fullDate.year()).month(fullDate.month()).date(fullDate.date())
    let rangeMax = moment(timeRangeMax).year(fullDate.year()).month(fullDate.month()).date(fullDate.date())
    console.log('***', rangeMin.toString(), rangeMax.toString())
    fetchMetrics('?' + queryString.stringify({
      min: rangeMin.toString(),
      max: rangeMax.toString()
    }))
  }

  const currentRange = () => `${
    moment(selectedFullDate).format('DD MM YYYY')} - ${
    moment(timeRangeMin).format('HH:mm')} / ${
    moment(timeRangeMax).format('HH:mm')}`

  return (
    <div className={classes.root}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1c-content"
          id="panel1c-header"
        >
          <div className={classes.column}>
            <FormControlLabel
              aria-label="Acknowledge"
              onClick={(event) => {
                event.stopPropagation()
                darkMode.toggle()
              }}
              onFocus={(event) => event.stopPropagation()}
              control={<Switch color="primary" checked={darkMode.isDarkMode} />}
              label="Dark Mode"
            />
          </div>
          <div className={classes.column}>
            <Typography className={classes.secondaryHeading} align="center">
              {currentRange()}
            </Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails className={classes.details}>
          <Grid container spacing={3}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid item xs={12} md={4} lg={6} justify="center" className={classes.flex}>
                <KeyboardDatePicker
                  disableToolbar
                  format="MM/dd/yyyy"
                  margin="normal"
                  id="date-picker-inline"
                  label="Date"
                  value={selectedFullDate}
                  onChange={setSelectedFullDate}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4} lg={3} justify="center" className={classes.flex}>
                <KeyboardTimePicker
                  margin="normal"
                  id="time-picker"
                  label="Beginning of the range"
                  value={timeRangeMin}
                  ampm={false}
                  onChange={setTimeRangeMin}
                  KeyboardButtonProps={{
                    'aria-label': 'change time',
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4} lg={3} justify="center" className={classes.flex}>
                <KeyboardTimePicker
                  margin="normal"
                  id="time-picker"
                  label="End of the range"
                  value={timeRangeMax}
                  ampm={false}
                  onChange={setTimeRangeMax}
                  KeyboardButtonProps={{
                    'aria-label': 'change time',
                  }}
                />
              </Grid>
            </MuiPickersUtilsProvider>
          </Grid>
        </AccordionDetails>
        <Divider />
        <AccordionActions>
          <Button size="small">Cancel</Button>
          <Button size="small" variant="outlined" onClick={updateMetrics}>
            Update
          </Button>
        </AccordionActions>
      </Accordion>
    </div>
  );
}
