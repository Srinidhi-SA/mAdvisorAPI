import React from "react";
import {Scrollbars} from 'react-custom-scrollbars';
import {Provider} from "react-redux";
import {MainHeader} from "../common/MainHeader";
import {connect} from "react-redux";
//import {Redirect} from 'react-router';
import {Link, Redirect} from "react-router-dom";
import store from "../../store";
import {C3Chart} from "../c3Chart";
import ReactDOM from 'react-dom';
import {
  hideDataPreview,
  getDataSetPreview,
  renameMetaDataColumn,
  updateTranformColumns,
  hideDataPreviewDropDown,
  popupAlertBox
} from "../../actions/dataActions";
import {dataSubsetting, clearDataPreview, clearLoadingMsg} from "../../actions/dataUploadActions"
import {Button, Dropdown, Menu, MenuItem} from "react-bootstrap";
import {STATIC_URL} from "../../helpers/env.js"
import {showHideSideChart, showHideSideTable, MINROWINDATASET,toggleVisualization, getRemovedVariableNames} from "../../helpers/helper.js"
import {isEmpty, CREATESIGNAL, CREATESCORE, CREATEMODEL} from "../../helpers/helper";

import {DataUploadLoader} from "../common/DataUploadLoader";
import Dialog from 'react-bootstrap-dialog';
import {checkCreateScoreToProceed, getAppDetails} from "../../actions/appActions";
import {missingValueTreatmentSelectedAction, outlierRemovalSelectedAction, variableSelectedAction, removeDuplicatesAction, dataCleansingDataTypeChange } from "../../actions/dataCleansingActions";

@connect((store) => {
  return {
    login_response: store.login.login_response,
    dataPreview: store.datasets.dataPreview,
    signalMeta: store.datasets.signalMeta,
    curUrl: store.datasets.curUrl,
    dataPreviewFlag: store.datasets.dataPreviewFlag,
    currentAppId: store.apps.currentAppId,
    roboDatasetSlug: store.apps.roboDatasetSlug,
    modelSlug: store.apps.modelSlug,
    signal: store.signals.signalAnalysis,
    subsettingDone: store.datasets.subsettingDone,
    subsettedSlug: store.datasets.subsettedSlug,
    dataTransformSettings: store.datasets.dataTransformSettings,
    scoreToProceed: store.apps.scoreToProceed,
    currentAppDetails: store.apps.currentAppDetails,
    datasets : store.datasets
    //data_cleansing: store.datasets.dataPreview.meta_data.uiMetaData.fe_config.data_cleansing
  };
})

export class DataCleansing extends React.Component {
  constructor(props) {
    super(props);
    this.buttons = {};

  }


  componentWillMount() {
    if (this.props.dataPreview == null || isEmpty(this.props.dataPreview) || this.props.dataPreview.status == 'FAILED') {
      this.props.dispatch(getDataSetPreview(this.props.match.params.slug));
    }else{
      console.log("not updating dataPreview data from server");
    }

    var proccedUrl = this.props.match.url.replace('dataCleansing','featureEngineering');

    if(this.props.match.path.includes("slug")){
      this.buttons['proceed']={
        url : proccedUrl,
        text:"Proceed"};
      }
  }

  componentDidMount() {
  }

  componentWillUpdate() {
  }

  shouldComponentUpdate(nextProps) {

    return true;
  }

onchangeMissingValueTreatment(event, variable_name){

}


missingValueTreatmentOnChange(event){

  console.log(event.target.dataset);

  this.props.dispatch(missingValueTreatmentSelectedAction(event.target.dataset["colname"],event.target.dataset["colslug"], event.target.value));

}
outlierRemovalOnChange(event){
  this.props.dispatch(outlierRemovalSelectedAction(event.target.dataset["colname"],event.target.dataset["colslug"], event.target.value));
}

variableCheckboxOnChange(event){
  this.props.dispatch(variableSelectedAction(event.target.dataset["colslug"], event.target.checked));
}

handleRemoveDuplicatesOnChange(event){
this.props.dispatch(removeDuplicatesAction(event.target.dataset["duplicatename"], event.target.value));
}
handleDataTypeChange(colSlug, event){

    this.props.dispatch(dataCleansingDataTypeChange(colSlug, event.target.value));

}
getUpdatedDataType(colSlug){
  // this.props.dataPreview.meta_data.uiMetaData.columnDataUI.filter(item => item.slug == slug);
  // console.log(this.props.dataPreview.meta_data.uiMetaData.columnDataUI.filter(item => item.slug == slug));
  let colType = this.props.dataPreview.meta_data.uiMetaData.columnDataUI.filter(item => item.slug == colSlug)[0].columnType
  var arr = [ "Measure","Dimension", "Timedimension"]
  var optionsHtml = arr.map(item => {
    if(item.toLowerCase()== colType.toLowerCase() ){
      return <option value={item.toLowerCase()} selected>{item}</option>
    }else{
      return <option value={item.toLowerCase()} >{item}</option>
    }
  })
  return <select className="form-control"  onChange={this.handleDataTypeChange.bind(this,colSlug )} >
  {optionsHtml}
</select>
}

proceedFeatureEngineering()
{
  var proccedUrl = this.props.match.url.replace('dataCleansing','featureEngineering');
  this.props.history.push(proccedUrl);
}

getOutlierRemovalOptions(dataType, colName, colSlug){
  var data_cleansing = this.props.dataPreview.meta_data.uiMetaData.fe_config.data_cleansing ;
  if (dataType in data_cleansing && "outlier_removal" in data_cleansing[dataType]){
    var dcHTML =  (data_cleansing[dataType].outlier_removal.operations.map(item =>
      <option value={item.name} selected >{item.displayName}</option>))
    return (<select className="form-control" data-colName={colName} data-colslug={colSlug} onChange={this.outlierRemovalOnChange.bind(this)}>{dcHTML}</select>);
  }
  else { return "";}
}
getMissingValueTreatmentOptions(dataType, colName, colSlug){
  var data_cleansing = this.props.dataPreview.meta_data.uiMetaData.fe_config.data_cleansing ;
  if (dataType in data_cleansing && "missing_value_treatment" in data_cleansing[dataType]){
    var dcHTML =  (data_cleansing[dataType].missing_value_treatment.operations.map(item =>
    <option value={item.name} selected >{item.displayName}</option>))
    var selectedValue = "none";
    if(colSlug  in this.props.datasets.missingValueTreatment){
        selectedValue = this.props.datasets.missingValueTreatment[colSlug].treatment
    }
    return (<select className="form-control" data-colslug={colSlug} data-colname={colName} onChange={this.missingValueTreatmentOnChange.bind(this)} value={selectedValue} >{dcHTML}</select>);
  }
  else { return "";}
}



  render() {

      var cleansingHtml = <span>"Loading ... "</span>;
    if(this.props.dataPreview!=null)
    {
      var data_cleansing = this.props.dataPreview.meta_data.uiMetaData.fe_config.data_cleansing ;
      var removedVariables = getRemovedVariableNames(this.props.datasets);
      cleansingHtml = this.props.dataPreview.meta_data.scriptMetaData.columnData.map(item => {
        // console.log(item);
        if(removedVariables.indexOf(item.name)!= -1 ) return "";

        return (
          <tr>
            {/* <td><div class="ma-checkbox inline">
                <input id={item.slug} type="checkbox" class="needsclick variableToBeSelected"  data-colslug={item.slug} onChange={this.variableCheckboxOnChange.bind(this)}/>
                <label for={item.slug}> </label>
              </div></td> */}

          <td>{item.name}</td>
          <td>  {this.getUpdatedDataType(item.slug)}</td>
         {/* using filter and map to retrive data from array inside array*/}
         {/* <td> */}
         <td>
             {item.columnStats.filter(function(items){
                 return  items.name == "numberOfUniqueValues" }).map((option)=>{
                   return(<span>{option.value}</span>);
               }
               )}
         </td>
         <td>
             {item.columnStats.filter(function(items){
                 return  items.name == "Outliers" }).map((option)=>{
                   return(<span>{option.value}</span>);
               }
               )}
         </td>
         <td>
             {item.columnStats.filter(function(items){
                 return  items.name == "PercentageMissingValue" }).map((option)=>{
                   return(<span>{option.value}</span>);
               }
               )}
         </td>
         <td>
              {this.getMissingValueTreatmentOptions(item.columnType, item.name, item.slug)}
         </td>
         <td>
              {this.getOutlierRemovalOptions(item.columnType, item.name, item.slug)}
         </td>

          </tr>
        );
      })
    }

    return (
        // <!-- Main Content starts with side-body -->
       <div className="side-body">
        {/* <!-- Page Title and Breadcrumbs -->*/}
        <div class="page-head">
          <h3 class="xs-mt-0 xs-mb-0 text-capitalize"> Data Cleansing</h3>
        </div>
        {/*<!-- /.Page Title and Breadcrumbs -->*/}
        {/*<!-- Page Content Area -->*/}
         <div className="main-content">
         <div class="row">
          <div class="col-md-12">
          <div class="panel box-shadow xs-m-0">
            <div class="panel-body no-border xs-p-20">
              <div class="form-group">
                <label for="rd1" class="col-sm-5 control-label"> Do you want to remove duplicate attributes/columns in the dataset?</label>
                <div class="col-sm-7">
                  <div class="btn-group" data-toggle="buttons">
                      <input type="button" id="rd1_Yes" name="rdc_dataset" value="Yes" class="btn btn-default"  data-duplicatename="remove_duplicate_attributes" onClick={this.handleRemoveDuplicatesOnChange.bind(this)}/>
                      <input type="button" id="rd1_No" name="rdc_dataset" value="No" class="btn btn-default " data-duplicatename="remove_duplicate_attributes" onClick={this.handleRemoveDuplicatesOnChange.bind(this)}/>
                  </div>
                </div>
              </div>
              <div class="clearfix xs-mb-5"></div>
              <div class="form-group">
                <label for="rd2" class="col-sm-5 control-label"> Do you want to remove duplicate observations  in the dataset?</label>
                <div class="col-sm-7">
                  <div class="btn-group" data-toggle="buttons">
                       <input type="button" id="rd2_Yes" name="rd_odataset" value="Yes"  class="btn btn-default" data-duplicatename="remove_duplicate_observations"  onClick={this.handleRemoveDuplicatesOnChange.bind(this)} se />
                      <input type="button" id="rd2_No" name="rd_odataset" value="No"  class="btn btn-default " data-duplicatename="remove_duplicate_observations"  onClick={this.handleRemoveDuplicatesOnChange.bind(this)} />
  </div>
                </div>
              </div>
            </div>
          </div>
                <div className="panel box-shadow ">
                    <div class="panel-body no-border xs-p-20">
                  <div className="table-responsive ">
                      <table className="table table-striped table-bordered break-if-longText">
                        <thead>
                          <tr>



                            {/* <th> <div class="ma-checkbox inline">
                                <input id="checkAll" type="checkbox" class="needsclick" onChange={this.handleSelectAll.bind(this)}/>
                                <label for="checkAll">All</label>
                              </div>
                            </th> */}

                            <th>Variable name</th>
                            <th>Data type</th>
                            <th># of unique values</th>
                            <th># of outliers</th>
                            <th>% of missing values</th>
                            <th>Missing value treatment</th>
                            <th>Outlier removal</th>
                            </tr>
                        </thead>
                        <tbody className="no-border-x">
                          {cleansingHtml}
                        </tbody>
                      </table>

                  </div>
  <div class="buttonRow text-right">
     <Button onClick={this.proceedFeatureEngineering.bind(this)}  bsStyle="primary">Proceed <i class="fa fa-angle-double-right"></i></Button>
   </div>
 </div>
        </div>
        <div class="xs-p-30"></div>
      </div>
    </div>


  </div>
  {/*<!--End of Page Content Area -->*/}
</div>
// <!-- /. Main Content ends with side-body -->


      );
    }
}
