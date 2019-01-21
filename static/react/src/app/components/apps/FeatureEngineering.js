import React from "react";
import { connect } from "react-redux";
import { Scrollbars } from 'react-custom-scrollbars';
import { Button, Dropdown, Menu, MenuItem, Modal, Nav, NavItem, Tab, Row, Col, Tabs } from "react-bootstrap";
import {
openBinsOrLevelsModalAction,
  closeBinsOrLevelsModalAction,
  openTransformColumnModalAction,
  closeTransformColumnModalAction,
  selectedBinsOrLevelsTabAction,
} from "../../actions/featureEngineeringActions";

import { getDataSetPreview } from "../../actions/dataActions";

import { Bins } from "./Bins";
import { Levels } from "./Levels";

@connect((store) => {
return {

  login_response: store.login.login_response,

    dataPreview: store.datasets.dataPreview,

    dataSets: store.datasets.allDataSets,

    binsOrLevelsShowModal: store.datasets.binsOrLevelsShowModal,

    transferColumnShowModal: store.datasets.transferColumnShowModal,

    selectedBinsOrLevelsTab: store.datasets.selectedBinsOrLevelsTab,
    selectedItem: store.datasets.selectedItem,

  };

})

export class FeatureEngineering extends React.Component {
  constructor(props) {
  super(props);
  console.log("FeatureEngineering constructor method is called...");
  console.log(props);
  this.buttons = {};

}



  componentWillMount() {
    if (this.props.dataPreview == null || isEmpty(this.props.dataPreview) || this.props.dataPreview.status == 'FAILED') {
      this.props.dispatch(getDataSetPreview(this.props.match.params.slug));
    }
console.log("FeatureEngineering componentWillMount method is called...");
    this.buttons['proceed'] = {
      url: "/data_cleansing/" + this.props.match.params.slug,
      text: "Proceed"
    };
  }



  render() {
    console.log("FeatureEngineering render method is called...");
    debugger;
    var feHtml = "";
    var binsOrLevelsPopup = "";
    var transformColumnPopup = "";
    let typeofBinningSelectBox = null;
    if (this.props.dataPreview != null) {
            feHtml = this.props.dataPreview.meta_data.scriptMetaData.columnData.map(item => {
       return (
               <tr>
                  <td> {item.name}</td>
                  <td> {item.columnType}</td>
                  <td> <Button onClick={this.openBinsOrLevelsModal.bind(this, item)} bsStyle="primary">Create bins or levels</Button></td>
                  <td> <Button onClick={this.openTransformColumnModal.bind(this,item)} bsStyle="primary">Transform</Button></td>
                </tr>  );
              })
            }



    binsOrLevelsPopup =

      (

        <div class="col-md-3 xs-mb-15 list-boxes" >
            <div id="binsOrLevels" role="dialog" className="modal fade modal-colored-header">
              <Modal show={this.props.binsOrLevelsShowModal} onHide={this.closeBinsOrLevelsModal.bind(this)} dialogClassName="modal-colored-header">
                <Modal.Header closeButton>
                  <h3 className="modal-title">Create { (this.props.selectedItem.columnType == "measure")? "Bins" : "Levels" }</h3>
                </Modal.Header>
                <Modal.Body>
                  <div>
                      <h4>What you want to do?</h4>
                      { (this.props.selectedItem.columnType == "measure")? <Bins /> : <Levels /> }
                </div>
                <div id="errorMsgs" className="text-danger"></div>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick={this.closeBinsOrLevelsModal.bind(this)}>Cancel</Button>
                <Button bsStyle="primary" onClick={this.createBinsorLevels.bind(this)}>Create</Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      )
    transformColumnPopup = (
      <div class="col-md-3 xs-mb-15 list-boxes" >
        <div id="transformColumnPopup" role="dialog" className="modal fade modal-colored-header">
          <Modal show={this.props.transferColumnShowModal} onHide={this.closeTransformColumnModal.bind(this)} dialogClassName="modal-colored-header">
            <Modal.Header closeButton>
              <h3 className="modal-title">Transfer column</h3>
            </Modal.Header>
            <Modal.Body>
              <div class="form-group">
              </div>
              <div id="errorMsgs" className="text-danger"></div>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.closeTransformColumnModal.bind(this)}>Cancel</Button>
              <Button bsStyle="primary" onClick={this.createTransferColumn.bind(this)}>Create</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    )
    return (
     // <!-- Main Content starts with side-body -->
      <div className="side-body">
        {/* <!-- Page Title and Breadcrumbs --> */}
        <div class="page-head">
          <h3 class="xs-mt-0 xs-mb-0 text-capitalize">Feature Engineering</h3>
        </div>
        {/*<!-- Page Content Area -->*/}
        {/*<!-- /.Page Title and Breadcrumbs -->*/}
        {binsOrLevelsPopup}
        {transformColumnPopup}
         <div className="main-content">
          <div class="row">
            <div class="col-md-12">





              <div class="panel box-shadow xs-m-0">
                <div class="panel-body no-border xs-p-20">
                  <h4> The dataset contains 14 columns or features (7 measures and 7 dimensions).  If you would like to transform the existing features or
                    create new features from the existing data, you can use the options provided below. </h4>
            <p class="inline-block">
            Do you want to convert all measures into dimension using binning? &nbsp;&nbsp;&nbsp;
            </p>
             <div class="ma-checkbox inline">
                    <input type="radio" id="mTod-binning1" name="mTod-binning"/>
                    <label for="mTod-binning1">Yes</label>
                  </div>
                  <div class="ma-checkbox inline">
                    <input type="radio" id="mTod-binning2" name="mTod-binning" checked="checked"/>
                    <label for="mTod-binning2">No </label>
                  </div>
            <div id="box-binning" class="xs-ml-20 block-inline"   >
              <span class="inline-block"> Number of bins : <input type="text" oninput="numberOnly(this.id);" class="test_css" maxlength="2" id="flight_number" name="number"/></span>
            </div>

                </div>
              </div>





              <div className="panel box-shadow ">
              <div class="panel-body no-border xs-p-20">
               <div className="table-responsive ">
                  <table className="table table-striped table-bordered break-if-longText">
                    <thead>
                      <tr>
                        <th>Variable name</th>
                        <th>Data type</th>
                        <th></th>
                        <th></th>
                      </tr>
                      </thead>
                        <tbody className="no-border-x">{feHtml}</tbody>
                      </table>
                    </div>
                    </div>
                    </div>
                    <div className="row buttonRow" id="dataPreviewButton">
                      <div className="col-md-12">
                          <div className="panel xs-mb-0">
                            <div className="panel-body box-shadow">
                                <div className="navbar">
                                    <ul className="nav navbar-nav navbar-right">
                                        <li className="text-right">
                                          <Button onClick={this.proceedFeatureEngineering.bind(this)} bsStyle="primary">{this.buttons.proceed.text} </Button>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
{/* <!--End of Page Content Area --> */}
            </div>
        </div>
        {/* <!-- Main Content ends with side-body --> */}
      </div>
    );
    }
openBinsOrLevelsModal(item) {
    this.props.dispatch(openBinsOrLevelsModalAction(item));
  }
  closeBinsOrLevelsModal() {
    this.props.dispatch(closeBinsOrLevelsModalAction());
  }
  openTransformColumnModal(item) {
    this.props.dispatch(openTransformColumnModalAction());
  }
  closeTransformColumnModal() {
    this.props.dispatch(closeTransformColumnModalAction());
  }
  handleSelect(selectedKey) {
    console.log(`selected ${selectedKey}`);
    this.props.dispatch(selectedBinsOrLevelsTabAction(selectedKey));
  }
  createBinsorLevels() {  }

  createTransferColumn() {  }
  proceedFeatureEngineering() {  }
}