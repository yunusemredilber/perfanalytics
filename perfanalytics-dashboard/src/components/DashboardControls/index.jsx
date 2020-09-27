import React, {memo, lazy, Suspense} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionActions from '@material-ui/core/AccordionActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import dayjs from 'dayjs';
import queryString from "querystring"
import clsx from "clsx";

const RangeSelector = lazy(() => import('./RangeSelector'))

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
  main: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  currentRange: {
    [theme.breakpoints.down('xs')]: {
      flexGrow: 1
    },
  }
}));

function DashboardControls({darkMode, fetchMetrics}) {
  const [expanded, setExpanded] = React.useState(false);
  const [selectedFullDate, setSelectedFullDate] = React.useState(new Date())
  const [timeRangeMin, setTimeRangeMin] = React.useState(dayjs().subtract(30, 'm').toDate())
  const [timeRangeMax, setTimeRangeMax] = React.useState(new Date())
  const [shouldShow, setShouldShow] = React.useState(false)
  const classes = useStyles()

  const updateMetrics = () => {
    let fullDate = dayjs(selectedFullDate)
    let rangeMin = dayjs(timeRangeMin).year(fullDate.year()).month(fullDate.month()).date(fullDate.date())
    let rangeMax = dayjs(timeRangeMax).year(fullDate.year()).month(fullDate.month()).date(fullDate.date())
    console.log('***', rangeMin.toString(), rangeMax.toString())
    fetchMetrics('?' + queryString.stringify({
      min: rangeMin.toString(),
      max: rangeMax.toString()
    }))
  }

  const currentRange = () => `${
    dayjs(selectedFullDate).format('DD MM YYYY')} - ${
    dayjs(timeRangeMin).format('HH:mm')} / ${
    dayjs(timeRangeMax).format('HH:mm')}`

  const handleAccordionChange = () => {
    setExpanded(!expanded);
    setShouldShow(true);
  };

  return (
    <div className={classes.root}>
      <Accordion expanded={expanded} onChange={handleAccordionChange}>
        <AccordionSummary
          onClick={() => {

          }}
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1c-content"
          id="panel1c-header"
        >
          <div className={classes.main}>
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
            <div className={clsx(classes.column, classes.currentRange)}>
              <Typography className={classes.secondaryHeading} align="center">
                {currentRange()}
              </Typography>
            </div>
          </div>
        </AccordionSummary>
        <AccordionDetails className={classes.details}>
          <Grid container spacing={3}>
            {shouldShow &&
              <Suspense fallback={<p>Loading...</p>}>
                <RangeSelector selectedFullDate={selectedFullDate}
                               setSelectedFullDate={setSelectedFullDate}
                               timeRangeMin={timeRangeMin}
                               setTimeRangeMin={setTimeRangeMin}
                               timeRangeMax={timeRangeMax}
                               setTimeRangeMax={setTimeRangeMax} />
              </Suspense>
            }
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

export default memo(DashboardControls)
