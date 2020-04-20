import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import PropTypes from "prop-types";
import Fab from "@material-ui/core/Fab";
import withMobileDialog from "@material-ui/core/withMobileDialog/withMobileDialog";

class AlertDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: this.props.open || false
    };
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleCloseAgree = this.handleCloseAgree.bind(this);
    this.handleCloseDisAgree = this.handleCloseDisAgree.bind(this);
  }

  handleClickOpen = () => {
    if (this.props.beforeOpen())
      this.setState(() => {
        return { open: true };
      });
  };
  handleCloseAgree = () => {
    this.setState(
      () => {
        return { open: false };
      },
      () => {
        this.props.agree();
      }
    );
  };
  handleCloseDisAgree = () => {
    this.setState(
      () => {
        return { open: false };
      },
      () => {
        this.props.disagree();
      }
    );
  };
  render() {
    const props = this.props;
    return (
      <div>
        <Fab
          onClick={this.handleClickOpen}
          style={{ position: "absolute", top: "15px", right: "15px" }}
          variant="extended"
          color="primary"
          aria-label="Add"
        >
          {props.btn.icon !== undefined ? props.btn.icon : ""}
          {props.btn.text !== undefined ? props.btn.text : ""}
        </Fab>

        <Dialog
          open={this.state.open}
          onClose={this.handleCloseDisAgree}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {props.text}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCloseDisAgree} color="primary">
              Disagree
            </Button>
            <Button onClick={this.handleCloseAgree} color="primary" autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

AlertDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  btn: PropTypes.object.isRequired,
  text: PropTypes.node.isRequired,
  title: PropTypes.node.isRequired,
  agree: PropTypes.func.isRequired,
  disagree: PropTypes.func.isRequired,
  beforeOpen: PropTypes.func.isRequired
};

export default withMobileDialog()(AlertDialog);
