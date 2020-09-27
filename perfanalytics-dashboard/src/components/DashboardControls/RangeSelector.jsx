import React from "react";
import DateFnsUtils from "@date-io/date-fns";
import Grid from "@material-ui/core/Grid";
import {KeyboardDatePicker, KeyboardTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";

export default function RangeSelector({selectedFullDate, setSelectedFullDate, timeRangeMin,
                                       setTimeRangeMin, timeRangeMax, setTimeRangeMax}) {
  return(
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid item container xs={12} md={4} lg={6} justify="center">
        <KeyboardDatePicker
          disableToolbar
          format="MM/dd/yyyy"
          margin="normal"
          id="change-date"
          label="Date"
          value={selectedFullDate}
          onChange={setSelectedFullDate}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
      </Grid>
      <Grid item container xs={12} md={4} lg={3} justify="center">
        <KeyboardTimePicker
          margin="normal"
          id="beginning-of-the-range"
          label="Beginning of the range"
          value={timeRangeMin}
          ampm={false}
          onChange={setTimeRangeMin}
          KeyboardButtonProps={{
            'aria-label': 'change time',
          }}
        />
      </Grid>
      <Grid item container xs={12} md={4} lg={3} justify="center">
        <KeyboardTimePicker
          margin="normal"
          id="end-of-the-range"
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
  )
}

