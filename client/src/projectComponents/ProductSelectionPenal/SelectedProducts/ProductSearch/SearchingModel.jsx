import React from "react";
import PropTypes from "prop-types";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import { Fab, Modal } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import SearchingTable from "./SearchResults/SearchingTable";
// import GridItem from "../../../../../components/Grid/GridItem";
import Card from "../../../../components/Card/Card";
import CardHeader from "../../../../components/Card/CardHeader";
import Select from "react-select";
import makeAnimated from "react-select/lib/animated";
import CardBody from "../../../../components/Card/CardBody";
// import GridContainer from "../../../../../components/Grid/GridContainer";

const style = {
  modelStyle: {
    zIndex: 100,
    top: "15%",
    maxWidth: "100%",
    // maxHeight:"200px",
    margin: "auto",
    overflowY: "auto"
  },
  buttonStyle: {
    float: "left",
    marginLeft: "25px",
    marginTop: "20px",
    zIndex: "100",
    backgoundColor: "blue"

    /*position:"absolute",
    zIndex:"120",
    top:"100px",
    right:"10px",*/
  },
  detailBlock: {
    backgroundColor: "white",
    margin: "10px",
    width: "auto"
  }
};

class SearchingModel extends React.Component {
  constructor(props) {
    super(props);
    this.selectedProducts = [];

    this.socket = props.socket;
    this.socket.on("alldata", data =>
      this.setState({
        materials: data.materials,
        producttypes: data.producttypes,
        units: data.units,
        parameters: data.parameters
      })
    );
    this.socket.on("search_products", this.dealWithSearchedQuery);
    // if (socket.connected) console.log("socket.io is connected.");
    this.socket.emit("alldata");
  }

  UNSAFE_componentWillMount() {
    this.setState((state, props) => ({
      open: props.open,

      value: 0,
      materials: [],
      producttypes: [],
      units: [],
      parameters: [],

      searchedproducts: [],
      projectinfo: {},
      searchquery: {},
      bookedProducts: []
    }));
  }

  jsonCopy(src){return JSON.parse(JSON.stringify(src))}

  dealWithSearchedQuery = products => {
    this.setState({
      searchedproducts: products
    });
  };
  searchQueryChanged = (value, param) => {
    if (param.match("material") != null) {
      this.setState(Object.assign(this.state.searchquery, { material: value }));
    }
    if (param.match("producttype") != null) {
      this.setState(
        Object.assign(this.state.searchquery, { producttype: value })
      );
    }
    // console.log("search_products called", this.state.searchquery);
    this.socket.emit("search_products", this.state.searchquery);
  };

  render() {
    const { searchedproducts } = this.state;
    const req_data = {
      materials: this.state.materials,
      producttypes: this.state.producttypes,
      units: this.state.units,
      parameters: this.state.parameters
    };

    return (
      <div>
        <Fab
          variant={"extended"}
          title={"Lets Add Products In Cart"}
          onClick={() => this.setState({ open: true })}
          href={"#"}
          color={"primary"}
        >
          Add Products
        </Fab>

        <Modal
          style={style.modelStyle}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onClose={() => {
            this.setState({ open: false }, () => {
              this.props.onClose(this.selectedProducts);
            });
          }}
        >
          <Card style={{ maxWidth: "80%", margin: "auto" }} profile={true}>
            <CardHeader color="warning">
              <h4 style={{ color: "white" }}>Search a Product</h4>
              <Grid container={true}>
                <Grid item xs={12} sm={3} md={4} lg={2}>
                  <Select
                    onChange={value => {
                      this.searchQueryChanged(value.value, "material");
                    }}
                    closeMenuOnSelect={false}
                    components={makeAnimated()}
                    // defaultValue={[colourOptions[4], colourOptions[5]]}
                    isMulti={false}
                    options={this.state.materials.map(v => {
                      return { value: v._id, label: v.name };
                    })}
                    placeholder={"Material"}
                  />
                </Grid>
                <Grid item xs={12} sm={9} md={8} lg={6}>
                  <Select
                    onChange={value => {
                      this.searchQueryChanged(value.value, "producttype");
                    }}
                    closeMenuOnSelect={false}
                    components={makeAnimated()}
                    // defaultValue={[colourOptions[4], colourOptions[5]]}
                    isMulti={false}
                    options={this.state.producttypes.map(v => {
                      return { value: v._id, label: v.name };
                    })}
                    placeholder={"Product Type"}
                  />
                </Grid>
                <Grid item md={6} lg={1} />
                <Grid item xs={12} sm={12} md={6} lg={3}>
                  <input
                    name={"filter_search"}
                    placeholder={"Filter Search"}
                    type={"text"}
                    style={{ width: "95%", height: "26px" }}
                  />
                </Grid>
              </Grid>
            </CardHeader>
            <CardBody>
              <SearchingTable
                addInCart={this.addInCart}
                data={req_data}
                products={searchedproducts}
              />
            </CardBody>
          </Card>
        </Modal>
      </div>
    );
  }
  addInCart = pid => {
    let pr = this.state.searchedproducts.find(p => p._id === pid);
    let sellby = this.jsonCopy(pr.sellby);
    let prr=this.jsonCopy(pr);
    this.selectedProducts.push(Object.assign(prr ,{ sellby: sellby }));
  };
}

SearchingModel.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  socket: PropTypes.object.isRequired
};

export default withMobileDialog()(SearchingModel);
