import React from "react";
import LC from "recharts/lib/chart/LineChart";
import XAxis from "recharts/lib/cartesian/XAxis";
import dayjs from "dayjs";
import YAxis from "recharts/lib/cartesian/YAxis";
import Line from "recharts/lib/cartesian/Line";
import ResponsiveContainer from "recharts/lib/component/ResponsiveContainer";

export default function LineChart({data, theme}){
  return (
    <ResponsiveContainer>
      <LC
        data={data}
        key={data.length > 0 /* To start the animation when the metrics came */}
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
               domain={[data?.[0]?.time, data?.[data?.length]?.time]} />
        <YAxis stroke={theme.palette.text.secondary}
               tickFormatter={value => `${value} s`} />
        <Line type="monotone" dataKey="value" stroke={theme.palette.primary.main} dot={false} />
      </LC>
    </ResponsiveContainer>
  )
}
