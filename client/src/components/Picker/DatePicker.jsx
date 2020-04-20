import React from "react";
import PropTypes from "prop-types";
import withMobileDialog from "@material-ui/core/withMobileDialog";

import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker
} from "@material-ui/pickers";

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

class DatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = { date: props.value || new Date() };
  }

  render() {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          value={this.state.date}
          margin="normal"
          label={this.props.label}
          onChange={date => {
            this.setState({ date: date });
            this.props.onChange(date);
          }}
          KeyboardButtonProps={{
            "aria-label": "change date"
          }}
        />
      </MuiPickersUtilsProvider>
    );
  }
}

DatePicker.propTypes = {
  label: PropTypes.node.isRequired,
  value: PropTypes.node.isRequired,
  onChange: PropTypes.func.isRequired
};

export default withMobileDialog()(DatePicker);
