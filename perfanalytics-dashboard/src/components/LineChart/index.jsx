import React from 'react';
import { LineChart as LC, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import useTheme from "@material-ui/core/styles/useTheme";
import Typography from "@material-ui/core/Typography";

function createData(time, amount) {
  return { time, amount };
}

const dummyData = [
  createData('00:00', 0),
  createData('03:00', 300),
  createData('06:00', 600),
  createData('09:00', 800),
  createData('12:00', 1500),
  createData('15:00', 2000),
  createData('18:00', 2400),
  createData('21:00', 2400),
  createData('24:00', undefined),
];

export default function LineChart({name}) {
  const theme = useTheme();
  return (
    <>
      <Typography align="center" component="h2" variant="h6" color="primary">
        { name }
      </Typography>
      <ResponsiveContainer>
        <LC
          data={dummyData}
          margin={{
            top: 16,
            right: 48,
            bottom: 0,
            left: 0,
          }}
        >
          <XAxis dataKey="time" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary} />
          <Line type="monotone" dataKey="amount" stroke={theme.palette.primary.main} dot={false} />
        </LC>
      </ResponsiveContainer>
    </>
  );
}
