import React from "react";
import PropTypes from "prop-types";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import IconButton from "@material-ui/core/IconButton";
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import Icon from "@material-ui/core/Icon";

class SPTSPListItem extends React.Component {
  getProductPrice = p => {
    let ppi = 0;
    if (p.sellby.by === "parametermultiple") {
      let paramMulti = 1;
      p.sellby.parameters.forEach(pa => {
        paramMulti *= pa.value;
      });
      ppi = p.sellby.cost * paramMulti;
    } else if (p.sellby.by === "peritem") {
      ppi = p.sellby.cost;
    }

    return ppi;
  };

  render() {
    const p = this.props.product;
    let cols =
      p.sellby.by === "peritem" ? (
        <tr>
          <td>{this.getProductPrice(p)}</td>
          <td>
            <IconButton
              onClick={() => {
                this.props.deleteSingle(p.id, p.sellby.pindex);
              }}
              aria-label="Delete"
            >
              <DeleteForeverOutlinedIcon />
            </IconButton>
          </td>
        </tr>
      ) : (
        <tr>
          <td>
            {p.sellby.parameters.map(p => p.name).join("*") +
            " = " +
            p.sellby.parameters.map(p => p.value).join("*")}
          </td>
          <td>{this.getProductPrice(p)}</td>
          <td>
            <IconButton
              onClick={() => {}}
              color="secondary"
              aria-label="setting"
            >
              <Icon>setting</Icon>
            </IconButton>
            <IconButton
              onClick={() => {
                this.props.deleteSingle(p.id, p.sellby.pindex);
              }}
              aria-label="Delete"
            >
              <DeleteForeverOutlinedIcon />
            </IconButton>
          </td>
        </tr>
      );

    return cols;
  }
}

SPTSPListItem.propTypes = {
  product: PropTypes.object.isRequired,
  deleteSingle: PropTypes.func.isRequired,
  editSingle: PropTypes.func.isRequired
};

export default withMobileDialog()(SPTSPListItem);
