import React from 'react';
import { forwardRef } from 'react';
import { connect } from 'react-redux';

import MUIDataTable from "mui-datatables";
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles';

import axios from 'axios';
import {Box} from '@material-ui/core';

import { theme } from '../theme/theme';

import ViewAssessments from './ViewAssessments';
import PartnerLink from './PartnerLink';
import CreateAssessment from './CreateAssessment';
import GlobalService from '../services/GlobalService';

import { changeFetching } from '../store/actions/auth';
import {withRouter} from 'react-router-dom';

const baseUrl = process.env.API_URL;

const styles = theme => ({
  innerTable: {
    marginLeft: '3vw',
    marginRight: '3vw',
    width: '94vw',
    marginTop: '5',
    marginBottom: '5',
    [theme.breakpoints.up('md')]: {
      margin: 'auto',
      width: '50%',
      marginTop: 5,
      marginBottom: 5
    },
  }
})

export class PartnerList extends React.Component {

  constructor(props) {

    super(props);
    this.columns = [
      {
        name: 'id',
        label: 'ID',
        options: {
          filter: true,
          sort: true,
          customBodyRender: (value) => {
            return <PartnerLink partnerId={value}/>
          } 
        }
      },
      {
        name: 'name',
        label: 'Name',
        options: {
          filter: true,
          sort: true,
        }
      },
      {
        name: 'id',
        label: 'View Assessments',
        options: {
          filter: false,
          sort: false,
          customBodyRender: (value) => {
            return <ViewAssessments partnerId={value}/>
          }
        }
      },
      {
        name: 'name',
        label: 'Create Assessment',
        options: {
          filter: false,
          sort: false,
          customBodyRender: (rowData, rowMeta, updateValue) => {
            return <CreateAssessment partnerId={rowMeta.rowData[0]} partnerName={rowData}/>
          }
        }
      }
    ]
          
    this.state = {
      data: [],
    }
  }

  onRowClick = (event, rowData) => {
    this.props.history.push('/partner/'+rowData.id+'/students');
  }

  dataSetup = (data) => {
    this.setState({'data': data}, function(){
      this.props.fetchingFinish()
    })
  }

  render = () => {
    const { classes } = this.props;

    if (!this.state.data.length) {
      return <Box></Box>
    }

    return <Box>
      <MuiThemeProvider theme={theme}>
        <div className={classes.innerTable}>
          <MUIDataTable
            columns={this.columns}
            data={this.state.data}
            icons={GlobalService.tableIcons}
            options={{
              headerStyle: {
                color: theme.palette.primary.main
              },
              exportButton: true,
              pageSize: 100,
              showTitle: false,
              selectableRows: 'none',
              toolbar: false,
              filtering: true,
              filter: true,
              filterType: 'doprdown',
              responsive: 'stacked',
            }}
          />
        </div>
      </MuiThemeProvider>
    </Box>
  }

  componentDidMount() {
    this.fetchPartners();
  }

  async fetchPartners() {
    try {
      this.props.fetchingStart()
      const dataURL = baseUrl + 'partners';
      const response = await axios.get(dataURL);
      this.dataSetup(response.data.data);
    } catch (e) {
      console.log(e);
      this.props.fetchingFinish()
    }
  }
}

const mapDispatchToProps = (dispatch)=>({
  fetchingStart: () => dispatch(changeFetching(true)),
  fetchingFinish: () => dispatch(changeFetching(false))
});

export default withRouter(withStyles(styles)(connect(undefined, mapDispatchToProps)(PartnerList)))