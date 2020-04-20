import React from "react";
import PropTypes from "prop-types";

// @material-ui/core
import dashboardStyle from "../../assets/jss/material-dashboard-react/views/dashboardStyle.jsx";
import SelectedProductsTable from "./SelectedProducts/SelectedProductsTable.jsx";
import withStyles from "@material-ui/core/styles/withStyles";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import { Typography } from "@material-ui/core";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import NumberFormat from "react-number-format";


class ProductSelectblock extends React.Component {
  constructor(props) {
    super(props);
    this.socket = props.socket;
    this.SelectedProductSets = props.SelectedProductSets;
    this.onUpdate = this.onUpdate.bind(this);
  }
  UNSAFE_componentWillMount() {
    this.setState(() => ({
      state: false
    }));
  }

  toggleState = () => {
    this.setState({ state: !this.state.state });
  };

  totalAmountCount=pss=>{
    let amount = 0.0;
    pss.forEach(ps=>{
      amount += ps.sum;
    });
    return amount;
  };

  onUpdate(data, ObN) {
    this.SelectedProductSets = data;
    if (ObN === "ProductSelectblock") this.toggleState();
    this.props.onUpdate(data, ObN);
    // console.log("onUpdate - ProductSelectBlock updated" , this.SelectedProductSets);
  }

  render() {
    return (
      <ExpansionPanel style={{backgroundColor:"lightblue"}} defaultExpanded={this.props.openDefault}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel-selectedprods-content"
          id="panel-selectedprods-header"
          style={{
            width: "96%",
            paddingLeft: "15px",
            paddingRight: "15px"
          }}
        >
          <Typography> Selected Products</Typography>

           <div style={{width:"70%",fontSize:18,color:"red"}}>
             <NumberFormat
               style={{float:"right"}}
               prefix={"Total Amount : "}
               suffix={" Rs"}
               value={this.totalAmountCount(this.SelectedProductSets)}
               displayType={"text"}
               thousandSeparator={true}/>
           </div>

        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div style={{width:"100%"}}>
            <SelectedProductsTable
              socket={this.socket}
              SelectedProductSets={this.SelectedProductSets}
              onUpdate={this.onUpdate}
            />
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

ProductSelectblock.propTypes = {
  socket: PropTypes.object.isRequired,
  openDefault: PropTypes.bool.isRequired,
  onUpdate: PropTypes.func.isRequired,
  SelectedProductSets: PropTypes.array.isRequired
};

export default withStyles(dashboardStyle)(ProductSelectblock);
