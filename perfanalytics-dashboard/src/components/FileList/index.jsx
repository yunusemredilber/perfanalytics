import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import FolderIcon from "@material-ui/icons/Folder"
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Link from "@material-ui/core/Link";
import VirtualList from 'react-tiny-virtual-list';

const useStyles = makeStyles((theme) => ({
  breakWord: {
   wordBreak: 'break-all'
  },
  list: {
    maxHeight: 300,
    overflow: 'auto'
  },
  textOverflowEllipsis: {
    textOverflow: 'ellipsis',
    overflow: 'hidden'
  }
}));

const asFormattedNum = (num) => `${Number(num).toFixed(4)} s`

const getFilename = (url) => {
  const filename = decodeURIComponent(new URL(url).pathname.split('/').pop());
  return filename;
}

const FileDetailDialog = ({open, setOpen, file}) => {
  const classes = useStyles()

  const handleClose = () => {
    setOpen(false);
  };

  if(!file || typeof file.name === 'undefined') {
    return <span />
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle className={classes.breakWord} id="alert-dialog-title">{getFilename(file.name)}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Full URL: <Link color="inherit" className={classes.breakWord} href={file.name}>{ file.name }</Link>
          <br/>
          Respond End Time: { file.responseEnd } s
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function FileList({files}) {
  const [open, setOpen] = React.useState(false);
  const [chosenFile, setChosenFile] = React.useState({});
  const classes = useStyles()

  const onFileClick = index => () => {
    setChosenFile(files[index])
    setOpen(true)
  }

  const Item = ({index, style}) => (
    <ListItem button style={style}
              onClick={onFileClick(index)}>
      <ListItemIcon>
        <FolderIcon />
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography variant="subtitle1" className={classes.textOverflowEllipsis}>
            { getFilename(files[index].name) }
          </Typography>
        }
        secondary={ asFormattedNum(files[index].responseEnd) }
      />
    </ListItem>
  )

  const generateItem = ({index, style}) => <Item index={index} style={style} key={files[index]._id} />

  if(!files) {
    return <div>
      <Chip
        label="No file to show"
        clickable
        variant="outlined"
      />
    </div>
  }

  return (
    <>
      <List className={classes.list}>
        <VirtualList
          width="100%"
          height={280}
          itemCount={files.length}
          itemSize={60} // Also supports variable heights (array or function getter)
          renderItem={generateItem}
        />
      </List>
      <FileDetailDialog open={open} setOpen={setOpen} file={chosenFile} />
    </>
  );
}
