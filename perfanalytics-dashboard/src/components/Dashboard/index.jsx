import React, {useEffect, useState, lazy, Suspense} from 'react';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import clsx from "clsx";
import { getMetrics } from '../../api/metrics'

const LineChart = lazy(() => import("../LineChart"));
const DetailedMetrics = lazy(() => import("../DetailedMetrics"));
const DashboardControls = lazy(() => import("../DashboardControls"));

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
  }
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
        setMetrics({...metrics, data: result.data, isLoading: false})
      },
      onError(error) {
        setMetrics({...metrics, data: [], error, isLoading: false})
        console.error(error)
      }
    }, queryParams)
  }

  useEffect(fetchMetrics, []);

  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  return (
    <Grid container spacing={3} className={classes.root}>
      <Grid item xs={12}>
        <Suspense fallback={<span />}>
          <DashboardControls darkMode={darkMode} fetchMetrics={fetchMetrics} />
        </Suspense>
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <Paper className={fixedHeightPaper}>
          <Suspense fallback={<span />}>
            <LineMetricChart name="TTFB" metric_key="ttfb" />
          </Suspense>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <Paper className={fixedHeightPaper}>
          <Suspense fallback={<span />}>
            <LineMetricChart name="FCP" metric_key="fcp" />
          </Suspense>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <Paper className={fixedHeightPaper}>
          <Suspense fallback={<span />}>
            <LineMetricChart name="DOM Load" metric_key="dom_load" />
          </Suspense>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6} lg={6}>
        <Paper className={fixedHeightPaper}>
          <Suspense fallback={<span />}>
            <LineMetricChart name="Window Load" metric_key="window_load" />
          </Suspense>
        </Paper>
      </Grid>
      {
        metrics.data && metrics.data.length > 0 &&
        <Grid item xs={12}>
          <Paper>
            <Suspense fallback={<span />}>
              <DetailedMetrics metrics={metrics} />
            </Suspense>
          </Paper>
        </Grid>
      }
    </Grid>
  );
}
