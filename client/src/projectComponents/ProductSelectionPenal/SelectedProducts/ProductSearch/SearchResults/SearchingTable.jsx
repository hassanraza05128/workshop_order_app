import React from "react";
import MaterialTable from "material-table";
import PropTypes from "prop-types";
import ProductDetailsModel from "./ProductDetail/ProductDetailsModel";

class SearchingTable extends React.Component {
  render() {
    const { products } = this.props;
    return (
      <div>
        <MaterialTable
          title="Searched Products"
          columns={[
            { title: "DesignId", field: "designid" },
            { title: "Name", field: "name" },
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
            {
              title: "CostBy",
              field: "costby",
              render: rowData => rowData.sellby.by /*costby algo applies here*/
            },
            {
              title: "Action",
              render: rowData => (
                <ProductDetailsModel
                  addInCart={this.props.addInCart}
                  data={this.props.data}
                  product={rowData}
                  open={false}
                  fullScreen={true}
                />
              )
            }
          ]}
          data={products}
        />
      </div>
    );
  }
}

SearchingTable.propTypes = {
  products: PropTypes.array.isRequired,
  data: PropTypes.object.isRequired,
  addInCart: PropTypes.func.isRequired
};

export default SearchingTable;
