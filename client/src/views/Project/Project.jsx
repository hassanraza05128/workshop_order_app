import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridItem from "../../components/Grid/GridItem.jsx";
import GridContainer from "../../components/Grid/GridContainer.jsx";
import Card from "../../components/Card/Card.jsx";
import CardHeader from "../../components/Card/CardHeader.jsx";
import CardBody from "../../components/Card/CardBody.jsx";
import dashboardStyle from "../../assets/jss/material-dashboard-react/views/dashboardStyle.jsx";
import ProductSelectblock from "../../projectComponents/ProductSelectionPenal/ProductSelectblock.jsx";
import io from "socket.io-client";
import CustomerInfo from "../../projectComponents/CustumerInfoPenal/CustomerInfo";
import ProjectInfo from "../../projectComponents/ProjectInfoPenal/ProjectInfo";
import CardFooter from "../../components/Card/CardFooter";
const socket = io("http://localhost:3000/");

const reqValConf = {
  cfname: { required: true, type: "text", maxLength: 20, minLength: 2 },
  clname: { required: false, type: "text", maxLength: 20, minLength: 2 },
  ccontactnumber: {
    required: true,
    type: "text",
    maxLength: 11,
    minLength: 11
  },
  cemail: { required: false, type: "email", maxLength: 20, minLength: 0 },
  caddress: { required: false, type: "text", maxLength: 500, minLength: 0 },
  creferer: { required: false, type: "text", maxLength: 20, minLength: 0 },

  padditionalnote: {
    required: false,
    type: "text",
    maxLength: 500,
    minLength: 0
  },
  psiteaddress: { required: true, type: "text", maxLength: 500, minLength: 0 },
  pdatepromissing: {
    required: true,
    type: "date",
    maxLength: 20,
    minLength: 2
  },
  pinitpay: { required: true, type: "number", max: 99999999999, min: 100 }
};

class Project extends React.Component {
  /*
  validateProjectInfo=()=>{
      if(ValStrs[val].required){
        if (val === "") {
          err true
        };
      }

  };
  validateCustomerInfo=()=>{

    for this.CustomerInfoData as d{

    }
    if(ValStrs[val]){
      if (val === "") {
        err true
      };
    }

  };*/
  checkRequiredValidation = () => {
    let ret = true;
    for (var f in reqValConf) {
      if (reqValConf[f]["required"]) {
        if (this.CustomerInfoData.hasOwnProperty(f)) {
          if (this.CustomerInfoData[f]===null || this.CustomerInfoData[f]==="") {
            this.CustomerInfoErrors[f] = {
              status: true,
              msg: "Required this Field"
            };
            ret = false;
          }
        } else if (this.ProjectInfoData.hasOwnProperty(f)) {
          if (
            this.ProjectInfoData[f] === null ||
            this.ProjectInfoData[f] === ""
          ) {
            this.ProjectInfoErrors[f] = {
              status: true,
              msg: "Required this Field"
            };
            ret = false;
          }
        }
      }
    }
    return ret;
  };
  uploadAProject = () => {
    if (this.checkRequiredValidation()) {
      if(this.SelectedProductSets!==[] || this.SelectedProductSets!==null) {
        socket.emit("registerAProject", {
          client: this.CustomerInfoData,
          project: this.ProjectInfoData,
          orderedProductSets: this.SelectedProductSets
        });
      }else{
        this.toggleState();
      }
    } else {
      this.toggleState();
    }
  };

  initErrors = o => {
    let errors={};
    for (var f in reqValConf) {
      errors[f] = { status: false, msg: "" };
    }
    return errors;
  };

  SelectedProductSets: Array;
  constructor(props) {
    super(props);

    this.SelectedProductSets = [];
    this.ProjectInfoData = { TotalAmount: 0};
    this.ProjectInfoErrors = this.initErrors(this.ProjectInfoData);
    this.CustomerInfoData = {};
    this.CustomerInfoErrors = this.initErrors(this.CustomerInfoData);



    this.onUpdateSelectedProductSets = this.onUpdateSelectedProductSets.bind(
      this
    );
    this.state = {
      value: 0
    };
    socket.on("registerAProject_error", error => {window.alert(error._message)});
  }
  toggleState = () => {
    this.setState({ state: !this.state.state });
  };

  totalAmountCount = pss => {
    let amount = 0.0;
    pss.forEach(ps => {
      amount += ps.sum;
    });
    return amount;
  };

  onUpdateSelectedProductSets = (data, ObN) => {
    this.SelectedProductSets = data;
    this.ProjectInfoData.TotalAmount = this.totalAmountCount(
      this.SelectedProductSets
    );

    // if (ObN === "Project") {
    this.toggleState();
    // }
    // console.log("onUpdate - Project updated" , this.SelectedProductSets);
  };
  onUpdateProjectInfoData = (data, ObN) => {
    this.ProjectInfoData = data;
    if (ObN === "Project") {
      this.toggleState();
    }
  };
  onUpdateCustomerInfoData = (data, ObN) => {
    this.CustomerInfoData = data;
    if (ObN === "Project") {
      this.toggleState();
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={10}>
            <Card>
              <CardHeader color="warning">
                <h3 className={classes.cardTitleWhite}>Project Reg Block</h3>
                <span>( General Project Info )</span>
              </CardHeader>
              <CardBody>
                <div>
                  <CustomerInfo
                    val={reqValConf}
                    onUpdate={this.onUpdateCustomerInfoData}
                    data={this.CustomerInfoData}
                    errors={this.CustomerInfoErrors}
                  />
                  <ProductSelectblock
                    openDefault={false}
                    SelectedProductSets={this.SelectedProductSets}
                    onUpdate={this.onUpdateSelectedProductSets}
                    socket={socket}
                  />
                  <ProjectInfo
                    val={reqValConf}
                    onUpdate={this.onUpdateProjectInfoData}
                    data={this.ProjectInfoData}
                    errors={this.ProjectInfoErrors}
                  />




                </div>
              </CardBody>
              <CardFooter>
                <Button
                  href=""
                  variant="contained"
                  fullWidth
                  color="primary"
                  onClick={this.uploadAProject}
                  size="large"
                >
                  Register
                </Button>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

Project.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Project);
