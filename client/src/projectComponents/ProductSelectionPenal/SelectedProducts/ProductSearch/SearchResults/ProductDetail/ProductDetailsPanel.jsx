import React from "react";
import PropTypes from "prop-types";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import ImageGallery from "./ImageGrid/ImageGrid";

class ProductDetailsPanel extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { contents } = this.props;

    return (
      <div>
        {/*<Button
          variant="outlined"
          color="primary"
          onClick={(e)=>this.setState({ open: true })}
        >
          Contents
        </Button>*/}

        <ImageGallery
          data={contents}
          settings={{
            cols: 6,
            lightBox: true,
            subHeader: "ImageGrid with LightBox"
          }}
        />
      </div>
    );
  }
}

ProductDetailsPanel.propTypes = {
  contents: PropTypes.object.isRequired
};

export default withMobileDialog()(ProductDetailsPanel);
