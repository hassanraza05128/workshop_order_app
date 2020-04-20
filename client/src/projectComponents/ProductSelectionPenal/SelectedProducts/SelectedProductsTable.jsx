import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import dashboardStyle from "../../../assets/jss/material-dashboard-react/views/dashboardStyle";
import MaterialTable from "material-table";
import SearchingModel from "./ProductSearch/SearchingModel";
import SelectedProductsTableSubListPenal from "./SelectedProductsTableSubListPenal/SelectedProductsTableSubListPenal";
import { Base64 } from "js-base64";

class SelectedProductsTable extends React.Component {
  constructor(props) {
    super(props);
    this.optimizedProductlist = props.SelectedProductSets;
    this.onUpdate = this.onUpdate.bind(this);
  }
  UNSAFE_componentWillMount() {
    this.setState(() => ({
      state: false
    }));
  }

  jsonCopy(src){return JSON.parse(JSON.stringify(src))}


  toggleState = () => {
    this.setState({ state: !this.state.state });
  };
  onUpdate = (data, ObN /*object name to be state update*/) => {
    if (ObN === "SelectedProductsTable") {
      this.toggleState();
    }
    this.props.onUpdate(data, ObN);
    // console.log("onUpdate - SelectProductTable updated" , this.optimizedProductlist);
  };
  productsListOptimization = products => {
    let prs = [];
    products.forEach(v => {
      let idHash = Base64.encode(Date.now() + Math.random());
      let prodindex = prs.findIndex(p => p._id === v._id);
      if (prodindex !== -1) {
        prs[prodindex].booking.push({
          pindex: idHash,
          pid: v._id,
          with: this.jsonCopy(v.sellby)
        });
        ++prs[prodindex].quantity;
      } else {
        prs.push(
          this.jsonCopy(
            Object.assign(v, {
              quantity: 1,
              booking: [{ pindex: idHash, pid: v._id, with: v.sellby }]
            })
          )
        );
      }
    });
    return prs;
  };
  setProductList = products => {
    this.optimizedProductlist = this.productsListOptimization(products);
    this.optimizedProductlist.forEach(ps => {
      this.getTotalPriceOfSame(ps);
    });
    this.onUpdate(this.optimizedProductlist, "ProductSelectblock");
  };
  getTotalPriceOfSame = p => {
    let ppis = 0;
    p.booking.forEach(v => {
      let ppi = 0;
      if (v.with.by === "parametermultiple") {
        let paramMulti = 1;
        v.with.parameters.forEach(pa => {
          paramMulti *= pa.value;
        });
        ppi = v.with.cost * paramMulti;
      } else if (v.with.by === "peritem") {
        ppi = v.with.cost;
      }
      ppis += ppi;
    });
    p.sum = ppis;
    return ppis;
  };
  deleteSet(productsId) {
    let opl = this.optimizedProductlist;
    let PsIndex = opl.findIndex(ps => ps._id === productsId);
    opl.splice(PsIndex, 1);
    this.optimizedProductlist = opl;
    this.onUpdate(this.optimizedProductlist, "ProductSelectblock");
    return true;
  }
  deleteSingle = (pid, pindex) => {
    if(pindex===-1){
      return this.deleteSet(pid);
    }else{
      this.onUpdate(this.optimizedProductlist, "ProductSelectblock");
      return true;
    }
  };
  editSingle() {}

  render() {
    const productSets = this.optimizedProductlist;
    return (
      <div>
        <MaterialTable
          columns={[
            {
              title: "Image",
              field: "image",
              render: rowData => (
                <img
                  src={
                    rowData.contents.length
                      ? "http://localhost:3000/" + rowData.contents[0].fullpath
                      : ""
                  }
                  alt="noImage"
                  style={{ width: 100 }}
                />
              )
            },
            { title: "ProductName", field: "name" },
            {
              title: "Quantity",
              field: "quantity",
              type: "numeric",
            },
            {
              title: "Price",
              field: "sum",
            }
          ]}
          data={productSets}
          title={
            <SearchingModel
              open={false}
              socket={this.props.socket}
              onClose={products => {
                this.setProductList(products);
              }}
            />
          }
          detailPanel={row => {
            return (
              <SelectedProductsTableSubListPenal
                productSet={row}
                deleteSingle={this.deleteSingle}
                editSingle={this.editSingle}
              />
            );
          }}
          onRowClick={(event, rowData, togglePanel) => togglePanel()}
          actions={[
            (/*rowData*/) => ({
              icon: "delete",
              tooltip: "Delete ProductSet",
              onClick: (event, row) => {
                if (
                  window.confirm("You want to delete set of product" + row.name)
                ) {
                  this.deleteSet(row._id);
                }
              }
              /*disabled: rowData.birthYear < 2000*/
            })
          ]}
          options={{
            actionsColumnIndex: -1
          }}
        />
      </div>
    );
  }
}

SelectedProductsTable.propTypes = {
  socket: PropTypes.object.isRequired,
  SelectedProductSets: PropTypes.array.isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default withStyles(dashboardStyle)(SelectedProductsTable);
