import React from 'react';
import LC from 'recharts/es6/chart/LineChart';
import Line from 'recharts/es6/cartesian/Line';
import XAxis from 'recharts/es6/cartesian/XAxis';
import YAxis from 'recharts/es6/cartesian/YAxis';
import ResponsiveContainer from 'recharts/es6/component/ResponsiveContainer';
import useTheme from "@material-ui/core/styles/useTheme";
import Typography from "@material-ui/core/Typography";
import dayjs from 'dayjs';
import CircularProgress from "@material-ui/core/CircularProgress";
import {makeStyles} from "@material-ui/core/styles";

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

export default function LineChart({name, metrics, metric_key}) {
  const values = filterMetrics(metrics, metric_key)
  console.log(values)
  const theme = useTheme()
  const classes = useStyles()

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

  const Chart = () => (
    <>
      <Typography align="center" component="h2" variant="h6">
        { name }
      </Typography>
      <ResponsiveContainer>
        <LC
          data={values}
          key={metrics.data.length > 0 /* To start the animation when the metrics came */}
          margin={{
            top: 16,
            right: 48,
            bottom: 0,
            left: 0,
          }}
        >
          <XAxis dataKey="time"
                 type="number"
                 stroke={theme.palette.text.secondary}
                 tickFormatter={unixTime => dayjs.unix(unixTime).format('HH:mm')}
                 domain={[values?.[0]?.time, values?.[values?.length]?.time]} />
          <YAxis stroke={theme.palette.text.secondary}
                 tickFormatter={value => `${value} s`} />
          <Line type="monotone" dataKey="value" stroke={theme.palette.primary.main} dot={false} />
        </LC>
      </ResponsiveContainer>
    </>
  )

  return (
    <>
      {metrics.isLoading && <LoadingIndicator />}
      {(!metrics.isLoading && metrics.data.length > 1) && <Chart />}
      {(!metrics.isLoading && metrics.data.length < 2) && <CenteredMessage message="There is not enough data to draw the chart." />}
      {metrics.error && <CenteredMessage message="An error occurred." />}
    </>
  );
}
