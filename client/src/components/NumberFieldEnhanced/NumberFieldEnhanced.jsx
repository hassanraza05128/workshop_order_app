/*
 *place an input elemet with validation opbject
 *give only valid value by on value
 */
import React, { Component } from "react";
import { TextField } from "@material-ui/core";
import PropTypes from "prop-types";
import withMobileDialog from "@material-ui/core/withMobileDialog/withMobileDialog";
import Typography from "@material-ui/core/Typography";
import NumberFormat from "react-number-format";

const errorMsges = {
  required: "{label} Is Required",
  maxLength: "Must Be Less then {l} Character",
  minLength: "Must Be More then {l} Character",
  max: "Must Be Less then {v}",
  min: "Must Be More then {v}",
  custom: "Custom Validation Failed"
};

class NumberFieldEnhanced extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.hasOwnProperty("value") ? this.props.value : ""
    };
    this.error = { status: this.state.value === "", msg: "" };
    this.touched = false;

    this.checkValidations(this.state.value);
  }

  changeVal = v => {
    // this.touched = true;
    if (this.checkValidations(v)) {
      this.error = { status: false, msg: "" };
      this.props.onValue(v);
    } else {
      this.props.onValue("");
    }
    this.setState({ value: v });
  };
  checkValidations = v => {
    let valid = true;
    if (v === "") {
      if (this.props.validationObject.required) {
        this.error = {
          status: true,
          msg: errorMsges.required.replace("{label}", this.props.label)
        };
        valid = false;
      } else {
        this.error = {
          status: false,
          msg: ""
        };
        valid = true;
      }
    } else {
      if (!this.checkIfLengthLessThenMax(v)) {
        this.error = {
          status: true,
          msg: errorMsges.maxLength.replace(
            "{l}",
            this.props.validationObject.maxLength
          )
        };
        valid = false;
      } else if (!this.checkIfLengthMoreThenMin(v)) {
        this.error = {
          status: true,
          msg: errorMsges.minLength.replace(
            "{l}",
            this.props.validationObject.minLength
          )
        };
        valid = false;
      } else if (!this.checkIfValueLessThenMax(v)) {
        this.error = {
          status: true,
          msg: errorMsges.max.replace("{v}", this.props.validationObject.max)
        };
        valid = false;
      } else if (!this.checkIfValueMoreThenMin(v)) {
        this.error = {
          status: true,
          msg: errorMsges.min.replace("{v}", this.props.validationObject.min)
        };
        valid = false;
      } else if (!this.checkCustomVaidation(v)) {
        this.error = {
          status: true,
          msg: this.props.validationObject.errors.custom || errorMsges.custom
        };
        valid = false;
      }
    }

    return valid;
  };

  render() {
    let touched = this.touched;
    let focus = this.props.hasOwnProperty("autoFocus")
      ? this.props.autoFocus
      : false;
    let required = this.props.validationObject.hasOwnProperty("required")
      ? this.props.validationObject.required
      : false;
    let label = this.props.hasOwnProperty("label") ? this.props.label : "InPut";
    let formate = this.props.hasOwnProperty("formate") ? this.props.label : "";
    let multiline = this.props.hasOwnProperty("multiline")
      ? this.props.multiline
      : false;
    let defaultValue = this.props.hasOwnProperty("defaultValue")
      ? this.props.defaultValue
      : this.state.value;
    return (
      <div>
        <NumberFormat
          aria-label={label}
          aria-required={required}
          name={this.props.name}
          format={formate}
          onFocus={() => {
            this.touched = true;
            this.toggleState();
          }}
          autoFocus={focus}
          // isAllowed={() => true}
          required={true}
          onValueChange={values => {
            this.changeVal(values.floatValue);
          }}
          type={"tel"}
          value={this.state.value}
          displayType={"input"}
        />
        {this.error.status && touched && (
          <Typography color="error">{this.error.msg}</Typography>
        )}
      </div>
    );
  }

  toggleState = () => {
    this.setState({ state: !this.state.state });
  };
  checkIfLengthLessThenMax = v => {
    if (!this.props.validationObject.hasOwnProperty("maxLength")) return true;
    return (
      v.toString().split("").length <= this.props.validationObject.maxLength
    );
  };
  checkIfLengthMoreThenMin = v => {
    if (!this.props.validationObject.hasOwnProperty("minLength")) return true;
    return (
      v.toString().split("").length >= this.props.validationObject.minLength
    );
  };

  checkIfValueLessThenMax = v => {
    if (!this.props.validationObject.hasOwnProperty("max")) return true;
    return v <= this.props.validationObject.max;
  };
  checkIfValueMoreThenMin = v => {
    if (!this.props.validationObject.hasOwnProperty("min")) return true;
    return v >= this.props.validationObject.min;
  };
  checkCustomVaidation = v => {
    if (
      !this.props.validationObject.hasOwnProperty("customValidation") ||
      typeof this.props.validationObject.customValidation !== "function"
    )
      return true;
    return !!this.props.validationObject.customValidation(v);
  };
}
NumberFieldEnhanced.propTypes = {
  format:PropTypes.object,
  type:PropTypes.
  value: PropTypes.object,
  defaultValue: PropTypes.object,
  autoFocus: PropTypes.object,
  name: PropTypes.object.isRequired,
  label: PropTypes.object,
  multiline: PropTypes.object,
  validationObject: PropTypes.object.isRequired,

  onValue: PropTypes.func.isRequired
};

export default withMobileDialog()(NumberFieldEnhanced);
