/*
 *place an input elemet with validation opbject
 *give only valid value by on value
 */
import React, { Component } from "react";
import { TextField } from "@material-ui/core";
import PropTypes from "prop-types";
import withMobileDialog from "@material-ui/core/withMobileDialog/withMobileDialog";
import Typography from "@material-ui/core/Typography";

const errorMsges = {
  required: "{label} Is Required",
  email: "This Must Be A valid Email",
  maxLength: "Must Be Less then {l} Character",
  minLength: "Must Be More then {l} Character",
  pattern: "Pattern DoesNot Match",
  custom: "Custom Validation Faild"
  // max: ""
};

class TextFieldEnhanced extends Component {
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

    /*if (v === "" && this.props.showRequired) {
      this.error = {
        status: true,
        msg: errorMsges.required.replace("{label}", this.props.label)
      };
      valid = false;
    }else */

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
      if (!this.checkIfLessThenMax(v)) {
        this.error = {
          status: true,
          msg: errorMsges.maxLength.replace(
            "{l}",
            this.props.validationObject.maxLength
          )
        };
        valid = false;
      } else if (!this.checkIfMoreThenMin(v)) {
        this.error = {
          status: true,
          msg: errorMsges.minLength.replace(
            "{l}",
            this.props.validationObject.minLength
          )
        };
        valid = false;
      } else if (!this.checkEmailVaidation(v)) {
        this.error = { status: true, msg: errorMsges.email };
        valid = false;
      } else if (!this.checkPatternVaidation(v)) {
        this.error = {
          status: true,
          msg: this.props.validationObject.errors.pattern || errorMsges.pattern
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
    let multiline = this.props.hasOwnProperty("multiline")
      ? this.props.multiline
      : false;
    let defaultValue = this.props.hasOwnProperty("defaultValue")
      ? this.props.defaultValue
      : this.state.value;
    return (
      <div>
        <TextField
          onFocus={() => {
            this.touched = true;
            this.toggleState();
          }}
          error={this.error.status && touched}
          value={this.state.value}
          defaultValue={defaultValue}
          autoFocus={focus}
          fullWidth={true}
          multiline={multiline}
          required={required}
          name={this.props.name}
          onChange={e => {
            this.changeVal(e.target.value);
          }}
          label={label}
          InputLabelProps={this.setInputLabelProps()}
        />
        {this.error.status && touched && (
          <Typography color="error">{this.error.msg}</Typography>
        )}
      </div>
    );
  }
  setInputLabelProps = () => {
    return {
      error: this.error.status && this.touched,
      required: this.props.validationObject["required"],
      variant: "standard"
    };
  };
  toggleState = () => {
    this.setState({ state: !this.state.state });
  };
  checkIfLessThenMax = v => {
    if (!this.props.validationObject.hasOwnProperty("maxLength")) return true;
    return v.split("").length <= this.props.validationObject.maxLength;
  };
  checkIfMoreThenMin = v => {
    if (!this.props.validationObject.hasOwnProperty("minLength")) return true;
    return v.split("").length >= this.props.validationObject.minLength;
  };

  checkEmailVaidation = v => {
    if (!this.props.validationObject.hasOwnProperty("email")) return true;
    if (!this.props.validationObject.email) return true;
    let regx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regx.test(v);
  };
  checkPatternVaidation = v => {
    if (!this.props.validationObject.hasOwnProperty("pattern")) return true;
    return !!this.props.validationObject.pattern.test(v);
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
TextFieldEnhanced.propTypes = {
  value: PropTypes.object,
  defaultValue: PropTypes.object,
  autoFocus: PropTypes.object,
  name: PropTypes.object.isRequired,
  label: PropTypes.object,
  multiline: PropTypes.object,
  validationObject: PropTypes.object.isRequired,
  // showRequired: PropTypes.object.isRequired,

  onValue: PropTypes.func.isRequired
};

export default withMobileDialog()(TextFieldEnhanced);
