import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import ListSubheader from "@material-ui/core/ListSubheader";

import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    margin: "auto",
    backgroundColor: theme.palette.background.paper
  },
  /*gridList: {
    width: "90%",
    height: "10%",
  },*/
  icon: {
    color: "rgba(255, 255, 255, 0.54)"
  },
  imgStyle: {
    width: "auto",
    height: "100%"
  }
});

class TitlebarGridList extends Component {
  constructor(props) {
    super(props);
    this.classes = props.classes;
    this.arg = Object.assign(
      {
        cols: 5,
        lightBox: true,
        subHeader: null
      },
      props.settings
    );
    this.imageData = props.data;

    this.state = {
      photoIndex: 0,
      isOpen: false
    };
  }

  render() {
    const { photoIndex, isOpen } = this.state;
    const images = this.imageData.map(tile => tile.img);

    return (
      <div className={this.classes.root}>
        <GridList
          // cellHeight={"180"}
          cols={this.arg.cols}
          spacing={2}
          className={this.classes.gridList}
        >
          <GridListTile
            key="Subheader"
            cols={this.arg.cols}
            style={{ height: "auto" }}
          >
            {this.arg.subHeader && (
              <ListSubheader component="div">
                {this.arg.subHeader}
              </ListSubheader>
            )}
          </GridListTile>
          {this.imageData.map((tile, index) => (
            <GridListTile
              style={{ textAlign: "center", backgroundColor: "#DCDCDC" }}
              key={tile.title + index}
              onClick={() => this.setState({ isOpen: true, photoIndex: index })}
            >
              <img
                style={{ margin: "auto" }}
                src={tile.img}
                className={this.classes.imgStyle}
                alt={tile.title}
              />
              {/* {(this.props.titleBar == true)? (
                <GridListTileBar
                  title={tile.title}
                  subtitle={<span>by: {tile.author}</span>}
                  actionIcon={
                    <IconButton className={this.classes.icon}>
                      <InfoIcon />
                    </IconButton>
                  }
                />
              ):(<div></div>)}*/}
            </GridListTile>
          ))}
        </GridList>

        {isOpen && this.arg.lightBox && (
          <Lightbox
            reactModalStyle={{ zIndex: 200 }}
            mainSrc={images[photoIndex]}
            nextSrc={images[(photoIndex + 1) % images.length]}
            prevSrc={images[(photoIndex + images.length - 1) % images.length]}
            // discourageDownloads={true}
            onCloseRequest={() => this.setState({ isOpen: false })}
            onMovePrevRequest={() =>
              this.setState({
                photoIndex: (photoIndex + images.length - 1) % images.length
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                photoIndex: (photoIndex + 1) % images.length
              })
            }
          />
        )}
      </div>
    );
  }
}

TitlebarGridList.propTypes = {
  classes: PropTypes.object,
  data: PropTypes.array.isRequired,
  settings: PropTypes.object.isRequired
};

export default withStyles(styles)(TitlebarGridList);
