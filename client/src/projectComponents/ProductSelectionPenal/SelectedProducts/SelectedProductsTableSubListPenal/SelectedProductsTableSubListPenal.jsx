import React from "react";
import PropTypes from "prop-types";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import SPTSPListItem from "./SPTSPListItem.jsx";

class SelectedProductsTableSubListPenal extends React.Component {
  constructor(props) {
    super(props);
    this.productSet = this.props.productSet;
  }
  UNSAFE_componentWillMount(): void {
    this.setState({ state: true });
  }

  toggleState = () => {
    this.setState(state => ({ state: !state }));
  };
  deleteSingle = (pid, pindex) => {
    let PS = this.productSet;
    if(PS.quantity===1){
      this.props.deleteSingle(pid, -1);
      return;
    } else {
      // if (this.props.deleteSingle(pid, pindex)) {
      this.props.deleteSingle(pid, pindex);
      --PS.quantity;
      let PIndex = PS.booking.findIndex(b => b.pindex === pindex);
      PS.booking.splice(PIndex , 1);
      this.productSet = PS;
      this.toggleState();
      // }
    }
  };
  jsonCopy = src => (JSON.parse(JSON.stringify(src)));

  SPTSPLIsFn = ps => {
    return ps.booking.map(b => {
      let p = this.jsonCopy(ps);
      delete p.booking;
      delete p.sellby;
      // console.log("pin listpenal", p);
      p.sellby = Object.assign({ pindex: b.pindex }, b.with);
      return (
        <SPTSPListItem
          key={"k" + b.pindex}
          product={p}
          deleteSingle={this.deleteSingle}
          editSingle={() => {}}
        />
      );
    });
  };

  render() {
    return (
      <div>
        <table style={{ width: "100%" }}>
          <thead>
            {this.productSet.sellby.by === "peritem" ? (
              <tr>
                <th>Price/Item</th>
                <th>actions</th>
              </tr>
            ) : (
              <tr>
                <th>Parameters</th>
                <th>Price</th>
                <th>actions</th>
              </tr>
            )}
          </thead>
          <tbody>{this.SPTSPLIsFn(this.productSet)}</tbody>
        </table>
      </div>
    );
  }
}

SelectedProductsTableSubListPenal.propTypes = {
  productSet: PropTypes.object.isRequired,
  deleteSingle: PropTypes.func.isRequired, //{this.props.deleteSingle}
  editSingle: PropTypes.func.isRequired //{this.props.editSingle}
};

export default withMobileDialog()(SelectedProductsTableSubListPenal);
