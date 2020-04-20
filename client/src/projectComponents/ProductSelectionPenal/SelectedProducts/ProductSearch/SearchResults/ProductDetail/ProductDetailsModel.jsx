import React from "react";
import PropTypes from "prop-types";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import ImageGallery from "./ImageGrid/ImageGrid";
import { Modal } from "@material-ui/core";
import { Fab } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import AstimationModel from "./PriceAstimation/AstimationModel";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
// import AddAlert from "@material-ui/icons/AddAlert";
// import NotifierSnackBar from "../../../../../components/Snackbar/NotifierSnackBar";
import AlertDialog from "./PriceAstimation/AlertDialog";

const style = {
  modelStyle: {
    zIndex: 100,
    top: "15%",
    maxWidth: "700px",
    // maxHeight:"200px",
    margin: "auto",
    overflowY: "auto"
  },
  buttonStyle: {},

  detailBlock: {
    backgroundColor: "white",
    // margin: "10px",
    paddingRight: "10px",
    paddingLeft: "15px",
    width: "auto"
  }
};

class ProductDetailsModel extends React.Component {

  UNSAFE_componentWillMount() {
    this.setState((state, props) => ({
      open: props.open,
      noOfAdditions: 0 /*to keep no of time this product has booked*/
    }));
  }

  showAlertDialog = () => {
    let noa = this.state.noOfAdditions;
    let noaMsg = "";
    if (noa !== 0)
      noaMsg = <small>No of times booked before {"(" + noa + ")"}</small>;

    let msg = (
      <span>
        {this.props.product.name.toUpperCase()} has been Added InCart <br />
        <br />
        {noaMsg}
      </span>
    );
    return (
      <AlertDialog
        open={false}
        beforeOpen={() => true}
        btn={{ text: "Add in Cart", icon: <AddShoppingCartIcon /> }}
        text={msg}
        title={"Product Booking Confirmation"}
        agree={() => {
          this.props.addInCart(this.props.product._id);
          this.setState({ noOfAdditions: noa + 1 });
        }}
        disagree={() => {}}
      />
    );
  };

  render() {
    const { product } = this.props;
    const contents = product.contents.map(c => {
      return {
        img: "http://localhost:3000/" + c.fullpath,
        title: c.orignalname,
        author: "HXN"
        // cols: 3,
      };
    });
    const { open } = this.state;

    return (
      <div>
        <Fab
          variant={"extended"}
          title={"Show Product Details"}
          onClick={() => this.setState({ open: true })}
          href={"#"}
          color={"primary"}
        >
          Details
        </Fab>

        <Modal
          style={style.modelStyle}
          /*aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"*/
          open={open}
          onClose={() => this.setState({ open: false })}
        >
          <div>
            <div style={style.detailBlock}>
              <Grid container>
                <Grid item lg={8} md={8}>
                  <h5>Product Details</h5>
                </Grid>
                <Grid item lg={4} md={4}>
                  {product.sellby.by === "peritem" ? (
                    this.showAlertDialog()
                  ) : (
                    <AstimationModel
                      addInCart={this.props.addInCart}
                      data={this.props.data}
                      product={product}
                      open={false}
                    />
                  )}
                </Grid>
              </Grid>

              <Grid container>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <div>
                    <strong>Name :</strong> <span>{product.name}</span>
                  </div>
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <strong>DesignId :</strong> <span>{product.designid}</span>
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <strong>Material :</strong>{" "}
                  <span>{product.material.name}</span>
                </Grid>

                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <strong>Product :</strong> <span>{product.type.name}</span>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <strong>Detail :</strong> <span>{product.discription}</span>
                </Grid>

                {product.sellby.by === "peritem" ? (
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <strong>price : </strong> <span>{product.sellby.cost}</span>
                  </Grid>
                ) : (
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <strong>PriceBy : </strong>
                    <span>
                      ( {product.sellby.parameters.map(p => p.name).join("*")} )
                    </span>
                  </Grid>
                )}
              </Grid>
            </div>

            <Grid item md={12}>
              <ImageGallery
                data={contents}
                settings={{
                  cols: 4,
                  lightBox: true,
                  subHeader: "Contents"
                }}
              />
            </Grid>
          </div>
        </Modal>
      </div>
    );
  }
}

ProductDetailsModel.propTypes = {
  open: PropTypes.bool.isRequired,
  product: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  addInCart: PropTypes.func.isRequired
};

export default withMobileDialog()(ProductDetailsModel);

/*  showAlertSnack = () => {
  this.addInCartClicked = false;
  let run = this.state.productAddedInCart.run;
  let msg = "";
  if (run === 1)
    msg = this.props.product.name.toUpperCase() + " has been Added InCart";
  if (run > 1) msg = "This Product Already Added InCart";

  if (msg !== "")
    return (
      <NotifierSnackBar
        place={"bc"}
        color={run > 1 ? "warning" : "info"}
        icon={AddAlert}
        message={msg}
        slide={"down"}
        open={true}
        close
      />
      /!*<SnackbarContent message={msg} close color="success"/>*!/
    );
};*/
