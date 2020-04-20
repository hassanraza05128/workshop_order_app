import React from "react";
import PropTypes from "prop-types";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import Modal from "@material-ui/core/Modal";
import { Fab, Grid } from "@material-ui/core";
import NumberFormat from "react-number-format";
// import AddIcon from "@material-ui/icons/Add";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import AlertDialog from "./AlertDialog";

const style = {
  modelStyle: {
    zIndex: 100,
    top: "15%",
    maxWidth: "600px",
    // maxHeight:"400px",
    // backgroundColor: "white",
    margin: "auto"
  },
  buttonStyle: {
    position: "absolute",
    right: "20px",
    top: "20px"
  },

  detailBlock: {
    backgroundColor: "white",
    margin: "10px",
    padding: "15px"
    // width: "auto"
  }
};

class AstimationModel extends React.Component {
  constructor(props) {
    super(props);
    this.bookings = []; /*keeps all bookings of this product with same/dif parameters*/

    this.costby = this.props.product.sellby;
    this.data = this.props.data;

    let unts = this.data.units;
    this.costby.parameters.forEach(v => {
      v.unitsItDealIn = unts.find(u => u.quantity === v.quantity);
      v.value = null;
    });
    this.costby.result = {
      multiple: 0.0,
      cost: 0.0
    };
    this.paramCheck = this.paramCheck.bind(this);
    this.OnChangeValue = this.OnChangeValue.bind(this);
  }
  UNSAFE_componentWillMount() {
    this.setState((state, props) => ({
      open: this.costby.by !== "peritem" ? false : props.open,
      cost: 0.0,
      noofadditions: 0 /*keeps no of time this product has booked*/
    }));
  }

  OnChangeValue = (id, value) => {
    // console.log("onChangeValue:", value);
    this.costby.parameters.find(p => p._id === id).value = value.floatValue;
    // this.costby.result.multiple = 0.0;
    let val = 1;
    this.costby.parameters.forEach(p => {
      val *= p.value;
      // console.log("onChangeValue:val:", val);
    });
    this.costby.result.multiple = val;
    this.costby.result.cost = this.costby.result.multiple * this.costby.cost;
    // console.log("onChangeValue:resilt.cost:", this.costby.result.cost);
    this.setState({ cost: this.costby.result.cost });
  };
  valueByparamId = id => {
    // console.log(this.costby.parameters.find(p => p._id === id).value);
    return this.costby.parameters.find(p => p._id === id).value;
  };

  textFields = () => {
    return this.costby.parameters.map(p => {
      return (
        <Grid key={"k" + p._id} item xs={12} sm={12} md={12} lg={12}>
          <strong>{p.name + " = "}</strong>
          <NumberFormat
            value={this.valueByparamId(p._id)}
            onValueChange={values => {
              this.OnChangeValue(p._id, values);
            }}
            isAllowed={values => {
              const { floatValue } = values;
              return floatValue <= 100000;
            }}
            displayType={"input"}
            thousandSeparator={true}
            // suffix={" fit"}
          />
        </Grid>
      );
    });
  };

  resultFields = () => {
    return (
      <Grid container>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <strong>
            {this.costby.parameters.map(p => p.name).join("*") + "="}
          </strong>
          <NumberFormat
            value={this.costby.result.multiple}
            displayType={"text"}
            thousandSeparator={true}
            // suffix={}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <strong>Rate = </strong>
          <NumberFormat
            value={this.costby.cost}
            displayType={"text"}
            thousandSeparator={true}
            // suffix={" Rs"}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <strong>Product Price = </strong>
          <NumberFormat
            value={this.state.cost}
            displayType={"text"}
            thousandSeparator={true}
            suffix={" Rs"}
          />
        </Grid>
      </Grid>
    );
  };
  paramCheck = () =>
    !this.costby.parameters.find(p => p.value === null || p.value === 0);

  showAlertDialog = () => {
    let paramNames = this.costby.parameters.map(p => p.name);
    let paramValues = this.costby.parameters.map(p => p.value);
    let noa = this.state.noofadditions;
    let noaMsg = "";
    if (noa !== 0)
      noaMsg = <small>No of times booked before {"(" + noa + ")"}</small>;

    let msg = (
      <span>
        {this.props.product.name.toUpperCase()} has been Added InCart <br />
        with ({paramNames.join(" * ")}) = ({paramValues.join(" * ")}) <br />
        <br />
        {noaMsg}
      </span>
    );
    return (
      <AlertDialog
        open={false}
        beforeOpen={this.paramCheck}
        btn={{ text: "Add in Cart", icon: <AddShoppingCartIcon /> }}
        text={msg}
        title={"Product Booking Confirmation"}
        agree={() => {

          this.props.addInCart(this.props.product._id);
          this.setState({ noOfAdditions: noa + 1 });
          this.bookings.push({
            result: Object.assign({}, this.costby.result),
            parameters: Array.of(this.costby.parameters)
          });

        }}
        disagree={() => {}}
      />
    );
  };

  render() {
    const { open } = this.state;

    return (
      <div style={style.buttonStyle}>
        <Fab
          variant={"extended"}
          title={"Get Product Price Astimation"}
          onClick={() => this.setState({ open: true })}
          href={"#"}
          color={"primary"}
        >
          Get Astimations
        </Fab>

        <Modal
          style={style.modelStyle}
          open={open}
          onClose={() => this.setState({ open: false })}
        >
          <div style={style.detailBlock}>
            <p>Product Astimation Block</p>
            {this.showAlertDialog()}
            <hr />
            <Grid container>{this.textFields()}</Grid>
            <Grid container>{this.resultFields()}</Grid>
          </div>
        </Modal>
      </div>
    );
  }
}

AstimationModel.propTypes = {
  open: PropTypes.bool.isRequired,
  product: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  addInCart: PropTypes.func.isRequired
};

export default withMobileDialog()(AstimationModel);
