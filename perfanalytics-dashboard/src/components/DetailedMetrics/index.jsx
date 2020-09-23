import React, {useState} from 'react';
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import MetricCard from "../MetricCard";
import FileList from "../FileList";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    padding: 10
  },
  margin: {
    margin: theme.spacing(1),
  }
}));

export default function DetailedMetrics({name, metrics}) {
  let [currentIndex, setCurrentIndex] = useState(metrics.data.length - 1)
  const classes = useStyles();

  const isFirst = () => currentIndex === 0
  const isLast = () => currentIndex === metrics.data.length - 1

  const next = () => {
    setCurrentIndex(currentIndex + 1)
  }

  const previous = () => {
    setCurrentIndex(currentIndex - 1)
  }

  return (
    <Grid container spacing={3} className={classes.root}>
      <Grid item xs={12} md={4} lg={4}>
        <MetricCard metric={metrics.data[currentIndex]}
                    next={next}
                    disableNext={isLast()}
                    previous={previous}
                    disablePrevious={isFirst()} />
      </Grid>
      <Grid item xs={12} md={8} lg={8}>
        <FileList files={metrics?.data[currentIndex]?.files} />
      </Grid>
    </Grid>
  );
}
