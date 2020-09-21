import React, {useEffect, useState} from 'react';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import clsx from "clsx";
import LineChart from "../LineChart";
import DashboardControls from "../DashboardControls";
import { getMetrics } from '../../api/metrics'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    paddingTop: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 260,
  },
}));

export default function Dashboard({darkMode}) {
  const [metrics, setMetrics] = useState({
    data: [],
    isLoading: false,
    error: null
  });

  const LineMetricChart = ({name, metric_key}) => <LineChart name={name} metrics={metrics} metric_key={metric_key} />

  const fetchMetrics = (queryParams = '') => {
    setMetrics({...metrics, isLoading: true, error: null})
    getMetrics({
      onSuccess(result){
        setMetrics({...metrics, data: result.data})
      },
      onError(error) {
        setMetrics({...metrics, data: [], error})
        console.error(error)
      }
    }, queryParams)
    setMetrics({...metrics, isLoading: false})
  }

  useEffect(fetchMetrics, []);

  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  return (
    <Grid container spacing={3} className={classes.root}>
      <Grid item xs={12}>
        <DashboardControls darkMode={darkMode} fetchMetrics={fetchMetrics} />
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <Paper className={fixedHeightPaper}>
          <LineMetricChart name="TTFB" metric_key="ttfb" />
        </Paper>
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <Paper className={fixedHeightPaper}>
          <LineMetricChart name="FCP" metric_key="fcp" />
        </Paper>
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <Paper className={fixedHeightPaper}>
          <LineMetricChart name="DOM Load" metric_key="dom_load" />
        </Paper>
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <Paper className={fixedHeightPaper}>
          <LineMetricChart name="Window Load" metric_key="window_load" />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          File Info
        </Paper>
      </Grid>
    </Grid>
  );
}
