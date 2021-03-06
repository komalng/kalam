import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';

import axios from 'axios';
import { Button } from '@material-ui/core';
import { withSnackbar } from 'notistack';
import { changeFetching } from '../store/actions/auth';
import {withRouter} from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { Dialog } from '@material-ui/core';
import {Box} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

const baseUrl = process.env.API_URL;

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    maxWidth: 400,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 400,
  },
  btn: {
    marginTop: theme.spacing(4)
  }
})

export class StudentFeedback extends React.Component {

  async addFeedbck() {
    try {
      this.props.fetchingStart()
      const { change } = this.props
      const dataURL = `${baseUrl}students/feedback/${this.studentId}/${this.userId}`
      const response = await axios.post(dataURL, {
        "student_stage": this.stage,
        "feedback": this.state.feedback
        }).then(response => {
            this.setState({
                dialogOpen: false,
            })
            this.props.enqueueSnackbar('Feedback is successfully added!',{ variant: 'success' });
            change(this.state.feedback, this.columnIndex)
        })
      this.props.fetchingFinish();
    } catch (e) {
      console.log(e);
      this.props.enqueueSnackbar('Please select student Status',{ variant: 'error' });
      this.props.fetchingFinish();
    }
  }

  onSubmit = () => {
    this.setState({
        loading: true,
    })
    this.addFeedbck();
  };

  validate = () => {};

  constructor(props) {
    super(props);
    const { rowMetaTable } = this.props;
    const { rowData, columnIndex } = rowMetaTable;
    this.columnIndex = columnIndex;
    this.studentId = rowData[5];
    this.userId = rowData[8].id;
    this.stage = rowData[0];
    this.user = '@' + rowData[8].user_name.toString().split(" ").join('').toLowerCase()
    this.state = {
      "feedback": "",
      "dialogOpen": false,
    }
  }

  handleChange = name => (event) => {
    let valChange = {}
    valChange[name] = event.target.value;

    this.setState(
      valChange
    );
  };
  
  handleClose = () => {
    this.setState({
      dialogOpen: false
    })
  };


  handleOpen = () => {
    this.setState({
      dialogOpen: true
    })
  }
  addFeedbackDetails = (user, feedback) => {
    return feedback ? user + ": \n\n" + feedback : user + ": \n\n";
  }

  render = () => {
    const { classes, feedback } = this.props;
    return (
        <Fragment>
            <Box onClick={this.handleOpen}>
                <EditIcon/>
            </Box>
            <Dialog
                open={this.state.dialogOpen}
                onClose={this.handleClose}
            >
                <form className={classes.container}>
                    <h1 style={{color: '#f05f40',textAlign: 'center'}}>Add Feedback</h1>
                    <TextField
                      id="outlined-multiline-static"
                      label="Feedback"
                      multiline
                      rows="6"
                      name='feedback'
                      defaultValue={this.addFeedbackDetails(this.user, feedback)}
                      onChange={this.handleChange('feedback')}
                      className={classes.textField}
                      margin="normal"
                      variant="outlined"
                    />
                    <Button variant="contained" color="primary" onClick={this.onSubmit} className={classes.btn}>Submit Feedback</Button>
                </form>
            </Dialog>  
        </Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch)=>({
  fetchingStart: () => dispatch(changeFetching(true)),
  fetchingFinish: () => dispatch(changeFetching(false))
});

export default withSnackbar(withRouter(withStyles(styles)(connect(undefined, mapDispatchToProps)(StudentFeedback))))