/* eslint-disable */
import React from "react";
import PropTypes from "prop-types";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import withStyles from "@material-ui/core/styles/withStyles";
import dashboardStyle from "assets/jss/material-dashboard-react/layouts/dashboardStyle.jsx";
import SearchTable from "../projectComponents/ProductSelectionPenal/SelectedProducts/ProductSearch/SearchResults/SearchingTable";



class Dashboard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.wrapper}>

        <div className={classes.mainPanel} ref="mainPanel">

          <div className={classes.content}>

            <SearchTable rows={[]}/>
sadasdas
          </div>

        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);
// export default Dashboard;
