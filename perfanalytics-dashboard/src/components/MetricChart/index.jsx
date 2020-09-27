import React, {lazy, Suspense, useEffect, useState} from 'react';
import useTheme from "@material-ui/core/styles/useTheme";
import Typography from "@material-ui/core/Typography";
import dayjs from 'dayjs';
import CircularProgress from "@material-ui/core/CircularProgress";
import {makeStyles} from "@material-ui/core/styles";

const LineChart = lazy(() => import('./LineChart'));

const useStyles = makeStyles((theme) => ({
  centerContainer: {
    display: 'flex',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
}));

function createData(time, value) {
  return { time, value }
}

const filterMetrics = (metrics, key) => {
  if(!metrics) return []

  return metrics.data.map(metric => createData(dayjs(metric.navigation_started_at).unix(), metric[key]))
}

export default function MetricChart({name, metrics, metric_key}) {
  let [isDataFiltered, setIsDataFiltered] = useState(false)
  let values = filterMetrics(metrics, metric_key)
  const theme = useTheme()
  const classes = useStyles()

  useEffect(() => {
    values = filterMetrics(metrics, metric_key)
    setIsDataFiltered(true)
  }, [])

  const LoadingIndicator = () => (
    <div className={classes.centerContainer}>
      <CircularProgress />
    </div>
  )

  const CenteredMessage = ({message}) => (
    <div className={classes.centerContainer}>
      <Typography variant="subtitle1">
        { message }
      </Typography>
    </div>
  )

  return (
    <>
      <Typography align="center" component="h2" variant="h6">
        { name }
      </Typography>
      {metrics.isLoading && <LoadingIndicator />}
      {(!metrics.isLoading && metrics.data.length > 1) &&
        <Suspense fallback={<LoadingIndicator />}>
          {isDataFiltered && <LineChart data={values} theme={theme} />}
        </Suspense>
      }
      {(!metrics.isLoading && metrics.data.length < 2) && <CenteredMessage message="There is not enough data to draw the chart." />}
      {metrics.error && <CenteredMessage message="An error occurred." />}
    </>
  );
}
