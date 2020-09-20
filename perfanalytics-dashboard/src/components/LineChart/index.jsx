import React from 'react';
import { LineChart as LC, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import useTheme from "@material-ui/core/styles/useTheme";
import Typography from "@material-ui/core/Typography";
import moment from "moment";

function createData(time, value) {
  return { time, value }
}

const filterMetrics = (metrics, key) => {
  if(!metrics) return []

  return metrics.data.map(metric => createData(moment(metric.navigation_started_at).unix(), metric[key]))
}

export default function LineChart({name, metrics, metric_key}) {
  const values = filterMetrics(metrics, metric_key)
  console.log(values)
  const theme = useTheme()
  return (
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
                 tickFormatter={unixTime => moment.unix(unixTime).format('HH:mm')}
                 domain={[values?.[0]?.time, values?.[values?.length]?.time]} />
          <YAxis stroke={theme.palette.text.secondary}
                 tickFormatter={value => `${value} s`} />
          <Line type="monotone" dataKey="value" stroke={theme.palette.primary.main} dot={false} />
        </LC>
      </ResponsiveContainer>
    </>
  );
}
