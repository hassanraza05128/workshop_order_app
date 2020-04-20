import React from "react";
// react component for creating beautiful carousel
import Carousel from "react-slick";
// material-ui components
// @material-ui/icons
// import LocationOn from "@material-ui/icons/LocationOn";
// core components
// import GridContainer from "../../components/Grid/GridContainer.jsx";
// import GridItem from "../../components/Grid/GridItem.jsx";
// import Card from "../../components/Card/Card.jsx";

import image1 from "../../assets/img/sidebar-1.jpg";
import image2 from "../../assets/img/sidebar-2.jpg";
import image3 from "../../assets/img/sidebar-3.jpg";

class SectionCarousel extends React.Component {
  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: false
    };
    return (
      <Carousel {...settings}>
        <div>
          <img
            style={{ width: "10px" }}
            src={image1}
            alt="First slide"
            className="slick-image"
          />
        </div>
        <div>
          <img
            style={{ width: "10px" }}
            src={image2}
            alt="Second slide"
            className="slick-image"
          />
        </div>
        <div>
          <img
            style={{ width: "10px" }}
            src={image3}
            alt="Third slide"
            className="slick-image"
          />
        </div>
      </Carousel>
    );
  }
}

export default SectionCarousel;
