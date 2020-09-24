import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import moment from "moment";

const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: 'column',
    justifyContent: 'center',
    height: 300
  },
  title: {
    fontSize: 14,
  },
  userAgentText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': '3',
    '-webkit-box-orient': 'vertical',
    marginTop: 4,
    marginBottom: 12,
  },
  paginationButton: {
    marginBottom: 10
  },
  cardActions: {
    justifyContent: 'center'
  },
  overflowAuto: {
    overflowY: 'auto'
  }
});

const asFormattedNum = (num) => Number(num).toFixed(4)

export default function MetricCard({metric, next, previous, disableNext, disablePrevious}) {
  const classes = useStyles();
  console.log('metric', metric)
  return (
    <Card className={classes.root} variant="outlined">
      <CardContent className={classes.overflowAuto}>
        <Typography className={classes.title} color="textSecondary" gutterBottom>
          {moment(metric?.navigation_started_at).format('DD/MM/YYYY - mm:hh:ss')}
        </Typography>
        <Typography variant="h5" component="h2">
          {metric?.url}
        </Typography>
        <Typography className={classes.userAgentText} color="textSecondary">
          {metric?.user_agent}
        </Typography>
        <Typography variant="body2" component="p">
          Time to First Byte: { asFormattedNum(metric?.ttfb) }s
          <br />
          Dom Load: { asFormattedNum(metric?.dom_load) }s
          <br />
          First Contentful Paint: { asFormattedNum(metric?.fcp) }s
          <br />
          Window Load: { asFormattedNum(metric?.window_load) }s
        </Typography>
      </CardContent>
      <CardActions className={classes.cardActions}>
        <Button size="medium"
                variant="outlined"
                disabled={disablePrevious}
                className={classes.paginationButton}
                onClick={previous}>
          Previous
        </Button>
        <Button size="medium"
                variant="outlined"
                disabled={disableNext}
                className={classes.paginationButton}
                onClick={next}>
          Next
        </Button>
      </CardActions>
    </Card>
  );
}
