import React from "react";
import PropTypes from "prop-types";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import Grid from "@material-ui/core/Grid";
import TextFieldEnhanced from "../../components/TextFieldEnhanced/TextFieldEnhanced";

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

const reqValConf = {
  cfname: { required: true, type: "text", maxLength: 20, minLength: 2 },
  clname: { required: false, type: "text", maxLength: 20, minLength: 2 },
  ccontactnumber: {
    required: true,
    type: "text",
    maxLength: 11,
    minLength: 11
  },
  cemail: {
    required: false,
    type: "email",
    email: true,
    maxLength: 50,
    minLength: 0
  },
  caddress: { required: false, type: "text", maxLength: 500, minLength: 0 },
  creferer: { required: false, type: "text", maxLength: 20, minLength: 0 }
};

class CustomerInfo extends React.Component {
  constructor(props) {
    super(props);
    this.values = {
      cfname: props.data.cfname || "",
      clname: props.data.clname || "",
      ccontactnumber: props.data.ccontactnumber || "",
      cemail: props.data.cemail || "",
      caddress: props.data.caddress || "",
      creferer: props.data.creferer || ""
    };
    this.errors = props.errors;
  }

  upDate = (v, f) => {
    this.values[f] = v;
    this.props.onUpdate(this.values, "");
  };

  render() {
    const {
      cfname,
      clname,
      ccontactnumber,
      cemail,
      caddress,
      creferer
    } = this.values;
    return (
      <div style={style.detailBlock}>
        <label>Customer Info</label>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4} lg={4}>
            <TextFieldEnhanced
              onValue={v => {
                this.upDate(v, "cfname");
              }}
              validationObject={reqValConf["cfname"]}
              value={cfname}
              autoFocus={true}
              label={"First Name :"}
              name={"cfname"}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4}>
            <TextFieldEnhanced
              onValue={v => {
                this.upDate(v, "clname");
              }}
              validationObject={reqValConf["clname"]}
              value={clname}
              autoFocus={false}
              label={"Last Name :"}
              name={"clname"}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4} lg={4}>
            <TextFieldEnhanced
              onValue={v => {
                this.upDate(v, "ccontactnumber");
              }}
              validationObject={reqValConf["ccontactnumber"]}
              value={ccontactnumber}
              autoFocus={false}
              label={"Contact no :"}
              name={"ccontactnumber"}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6} lg={6}>
            <TextFieldEnhanced
              onValue={v => {
                this.upDate(v, "cemail");
              }}
              validationObject={reqValConf["cemail"]}
              value={cemail}
              autoFocus={false}
              label={"Email :"}
              name={"cemail"}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={4} lg={4}>
            <TextFieldEnhanced
              onValue={v => {
                this.upDate(v, "creferer");
              }}
              validationObject={reqValConf["creferer"]}
              value={creferer}
              autoFocus={false}
              label={"Referer :"}
              name={"creferer"}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <TextFieldEnhanced
              onValue={v => {
                this.upDate(v, "caddress");
              }}
              validationObject={reqValConf["caddress"]}
              multiline={true}
              value={caddress}
              autoFocus={false}
              label={"Address :"}
              name={"caddress"}
            />
          </Grid>
        </Grid>
        <br />
      </div>
    );
  }
}

CustomerInfo.propTypes = {
  val: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default withMobileDialog()(CustomerInfo);
