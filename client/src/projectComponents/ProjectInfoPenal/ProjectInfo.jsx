import React from "react";
import PropTypes from "prop-types";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import Grid from "@material-ui/core/Grid";
import { TextField } from "@material-ui/core";
import NumberFormat from "react-number-format";
import DatePicker from "../../components/Picker/DatePicker";

const style = {
  blockAmountDiv: {
    float: "right",
    fontSize: 17
  },
  detailBlock: {
    backgroundColor: "white",
    // margin: "10px",
    paddingRight: "10px",
    paddingLeft: "15px",
    width: "auto"
  }
};

const reqValConf={
  padditionalnote: {
    required: false,
    type: "text",
    maxLength: 500,
    minLength: 0
  },
  psiteaddress: { required: true, type: "text", maxLength: 500, minLength: 0 },
  pdatepromissing: {
    required: true,
    type: "date",
    maxLength: 20,
    minLength: 2
  },
  pinitpay: { required: true, type: "number", max: 99999999999, min: 100 }
};

class ProjectInfo extends React.Component {
  constructor(props) {
    super(props);
    this.values = {
      padditionalnote: props.data.padditionalnote || "",
      psiteaddress: props.data.psiteaddress || "",
      pdatepromissing: props.data.pdatepromissing || new Date(),
      pinitpay: props.data.pinitpay || ""
    };
    // this.state = { pdatepromissing: this.values.pdatepromissing };
    this.errors = props.errors;
    this.val = props.val;
  }

  upDate = (v, f) => {
    this.values[f] = v;
    this.props.onUpdate(this.values, "Project");
  };
  setInputLabelProps = f => {
    return {
      error: !!this.errors[f]["status"],
      required: !!this.val[f]["required"],
      variant: "standard"
    };
  };

  render() {
    const TotalAmount = this.props.data.TotalAmount;
    const {
      padditionalnote,
      psiteaddress,
      pdatepromissing,
      pinitpay
    } = this.values;

    return (
      <div style={style.detailBlock}>
        <span style={style.blockAmountDiv}>
          <strong>Total Amount : </strong>
          <NumberFormat
            value={TotalAmount}
            displayType={"text"}
            thousandSeparator={true}
          />
          <span> Rs</span>
          <hr />
        </span>

        <label>Project Info</label>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <TextField
              value={pinitpay}
              type={"number"}
              onChange={e => {
                this.upDate(e.target.value, "pinitpay");
              }}
              label={"Initial Payment :"}
              InputLabelProps={this.setInputLabelProps("pinitpay")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6}>
            <DatePicker
              value={pdatepromissing}
              onChange={date => {
                this.upDate(date, "pdatepromissing");
              }}
              label={"Date Promissing"}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={6}>
            <TextField
              value={psiteaddress}
              multiline={true}
              fullWidth={true}
              onChange={e => {
                this.upDate(e.target.value, "psiteaddress");
              }}
              label={"Site Address :"}
              InputLabelProps={this.setInputLabelProps("psiteaddress")}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={6}>
            <TextField
              value={padditionalnote}
              multiline={true}
              fullWidth={true}
              onChange={e => {
                this.upDate(e.target.value, "padditionalnote");
              }}
              label={"Additional Note :"}
              InputLabelProps={this.setInputLabelProps("padditionalnote")}
            />
          </Grid>
        </Grid>
        <br />
      </div>
    );
  }
}

ProjectInfo.propTypes = {
  val: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default withMobileDialog()(ProjectInfo);
