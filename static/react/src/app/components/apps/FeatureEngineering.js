import React from "react";
import { connect } from "react-redux";
import { Button, Modal } from "react-bootstrap";
import {
  openBinsOrLevelsModalAction,
  closeBinsOrLevelsModalAction,
  openTransformColumnModalAction,
  closeTransformColumnModalAction,
  selectedBinsOrLevelsTabAction,
  saveBinLevelTransformationValuesAction,
  saveTopLevelValuesAction,
} from "../../actions/featureEngineeringActions";
import { getRemovedVariableNames } from "../../helpers/helper.js"
import { getDataSetPreview } from "../../actions/dataActions";
import { Bins } from "./Bins";
import { Levels } from "./Levels";
import { Scrollbars } from 'react-custom-scrollbars';
import { Transform } from "./Transform";
import { statusMessages } from "../../helpers/helper";

@connect((store) => {
  return {
    login_response: store.login.login_response,
    dataPreview: store.datasets.dataPreview,
    datasets: store.datasets,
    binsOrLevelsShowModal: store.datasets.binsOrLevelsShowModal,
    transferColumnShowModal: store.datasets.transferColumnShowModal,
    selectedBinsOrLevelsTab: store.datasets.selectedBinsOrLevelsTab,
    selectedItem: store.datasets.selectedItem,
    apps_regression_modelName: store.apps.apps_regression_modelName,
    currentAppDetails: store.apps.currentAppDetails,
    featureEngineering: store.datasets.featureEngineering,
    selectedVariables: store.datasets.selectedVariables,
    convertUsingBin: store.datasets.convertUsingBin,
    numberOfBins: store.datasets.topLevelData.numberOfBins,
    editmodelFlag:store.datasets.editmodelFlag,
    modelEditconfig: store.datasets.modelEditconfig,
  };
})


export class FeatureEngineering extends React.Component {
  constructor(props) {
    super(props);
    console.log("FeatureEngineering constructor method is called...");
    console.log(props);
    this.buttons = {};
    this.state = {
    };
    this.state.topLevelRadioButton = "false";
    this.prevState = this.state;
    this.pickValue = this.pickValue.bind(this);
    this.clearBinsAndIntervals = this.clearBinsAndIntervals.bind(this);
    this.updateLevelsData = this.updateLevelsData.bind(this);
  }

  componentWillMount() {
    this.setState({ featureEngineering: this.props.featureEngineering });
    if (this.props.dataPreview == null || this.props.dataPreview.status == 'FAILED') {
      this.props.dispatch(getDataSetPreview(this.props.match.params.slug));
    }
    console.log("FeatureEngineering componentWillMount method is called...");
    this.buttons['proceed'] = {
      url: "/data_cleansing/" + this.props.match.params.slug,
      text: "Proceed"
    };
    if((this.props.editmodelFlag) && (this.props.modelEditconfig.config.config.FEATURE_SETTINGS.FEATURE_ENGINEERING.overall_settings[0].selected)){
        let binningDate = this.props.modelEditconfig.config.config.FEATURE_SETTINGS.FEATURE_ENGINEERING.overall_settings[0];
        this.state.topLevelRadioButton = "true";
        // this.props.dispatch(saveTopLevelValuesAction(true, binningData.number_of_bins));
      }
    
  }

  componentDidMount() {
    $("#sdataType").change(function () {
      $("#fetable tbody tr").hide();
      $("#fetable tbody tr." + $(this).val()).show('fast');
    });

    $('#search').on('keyup', function () {
      var value = $(this).val();
      var patt = new RegExp(value, "i");
      $('#fetable').find('tr').each(function () {
        if (!($(this).find('td').text().search(patt) >= 0)) {
          $(this).not('.myHead').hide();
        }
        if (($(this).find('td').text().search(patt) >= 0)) {
          $(this).show();
        }
      });
    });
    const from = this.getValueOfFromParam();
    if (from === 'algorithm_selection') {
    }
    else if(!this.props.editmodelFlag){
    this.props.dispatch(saveTopLevelValuesAction(this.props.convertUsingBin,0));
  }
}

  getValueOfFromParam() {
    if(this.props.location === undefined){
    }
   else{
    const params = new URLSearchParams(this.props.location.search);
    return params.get('from');
}}

  clearBinsAndIntervals(event) {
    if (this.state[this.props.selectedItem.slug] != undefined && this.state[this.props.selectedItem.slug]["binData"] != undefined) {
      this.state[this.props.selectedItem.slug]["binData"]["numberofbins"] = ""
      this.state[this.props.selectedItem.slug]["binData"]["specifyintervals"] = ""
      this.setState({ state: this.state });
    }
  }

  pickValue(actionType, event) {
    if (this.state[this.props.selectedItem.slug] == undefined) {
      this.state[this.props.selectedItem.slug] = {}
    }
    if (this.state[this.props.selectedItem.slug][actionType] == undefined) {
      this.state[this.props.selectedItem.slug][actionType] = {}
    }
    if (event.target.type == "checkbox") {
      this.state[this.props.selectedItem.slug][actionType][event.target.name] = event.target.checked;
    } else {
      this.state[this.props.selectedItem.slug][actionType][event.target.name] = event.target.value;
    }
  }

  updateLevelsData(data) {
    if (!this.state[this.props.selectedItem.slug]) {
      this.state[this.props.selectedItem.slug] = {};
    }
    this.state[this.props.selectedItem.slug]["levelData"] = data;
  }

  getLevelsData() {
    if (this.props.featureEngineering[this.props.selectedItem.slug]) {
      var levelsData = this.props.featureEngineering[this.props.selectedItem.slug]["levelData"];
      if (levelsData) {
        return JSON.parse(JSON.stringify(levelsData));
      }
    }
    return []
  }

  handleCreateClicked(actionType, event) {
    
    if (actionType == "binData") {
      this.validateBinData(actionType);
    } else if (actionType == "levelData") {
      this.validateLevelData(actionType);
    } else if (actionType == "transformationData") {
      this.validateTransformdata(actionType);
    } else {
      var dataToSave = JSON.parse(JSON.stringify(this.state[this.props.selectedItem.slug][actionType]));
      this.props.dispatch(saveBinLevelTransformationValuesAction(this.props.selectedItem.slug, actionType, dataToSave));
      this.closeBinsOrLevelsModal();
      this.closeTransformColumnModal();
    }

    if ($('.levelrequired').val() == "") {
      bootbox.alert(statusMessages("warning", "Please enter level name", "small_mascot"));
      return false;

            
  }
  }

  validateBinData(actionType) {
    var slugData = this.state[this.props.selectedItem.slug];
    if (slugData != undefined && this.state[this.props.selectedItem.slug][actionType] != undefined) {
      var binData = this.state[this.props.selectedItem.slug][actionType];
      if (binData.selectBinType == undefined || binData.selectBinType == "none") {
        $("#fileErrorMsg").removeClass("visibilityHidden");
        $("#fileErrorMsg").html("Please select type of binning");
        $("select[name='selectBinType']").css("border-color", "red");
        $("select[name='selectBinType']").focus();
        return;
      } else {
        if (binData.selectBinType == "create_equal_sized_bins") {
          if (binData.numberofbins == undefined || binData.numberofbins == null || binData.numberofbins == "") {
            $("#fileErrorMsg").removeClass("visibilityHidden");
            $("#fileErrorMsg").html("Please enter number of bins");
            $("input[name='numberofbins']").css("border-color", "red");
            $("input[name='numberofbins']").focus();
            return;
          }
          else if (parseInt(binData.numberofbins) <= 0) {
            $("#fileErrorMsg").removeClass("visibilityHidden");
            $("#fileErrorMsg").html("Please enter number greater than zero");
            $("input[name='numberofbins']").css("border-color", "red");
            $("input[name='numberofbins']").focus();
            return;
          }
        } else if (binData.selectBinType == "create_custom_bins") {
          if (binData.specifyintervals == undefined || binData.specifyintervals == null || binData.specifyintervals == "") {
            $("#fileErrorMsg").removeClass("visibilityHidden");
            $("#fileErrorMsg").html("Please enter 'Specify Intervals' field");
            $("input[name='specifyintervals']").css("border-color", "red");
            $("input[name='specifyintervals']").focus();
            return;
          }
        }
      }
      if (binData.newcolumnname == undefined || binData.newcolumnname == null || binData.newcolumnname == "") {
        $("#fileErrorMsg").removeClass("visibilityHidden");
        $("#fileErrorMsg").html("Please enter the new column name");
        $("input[name='newcolumnname']").focus();
        return;
      }
      var dataToSave = JSON.parse(JSON.stringify(this.state[this.props.selectedItem.slug][actionType]));
      this.props.dispatch(saveBinLevelTransformationValuesAction(this.props.selectedItem.slug, actionType, dataToSave));
      this.closeBinsOrLevelsModal();
      this.closeTransformColumnModal();
    } else {
      $("#fileErrorMsg").removeClass("visibilityHidden");
      $("select[name='selectBinType']").css("border-color", "red");
      $("input[name='numberofbins']").css("border-color", "red");
      $("input[name='newcolumnname']").css("border-color", "red");
      $("#fileErrorMsg").html("Please enter Mandatory fields * ");
    }
  }

  validateLevelData(actionType) {
    var lvlar;
    if(this.props.selectedItem.columnType == "dimension"){
      let totalOptions=0;
      lvlar = this.state[this.props.selectedItem.slug];
      var lvl = lvlar.levelData;
      let lvllen=lvl.length;
      for(i in lvl){ 
        if(lvl[i].inputValue == "" || undefined){
          $("#fileErrorMsg").removeClass("visibilityHidden");
          $("#fileErrorMsg").html("Please enter the new column name");
          return;
        }else if(lvl[i].multiselectValue == "" || undefined){
          $("#fileErrorMsg").removeClass("visibilityHidden");
          $("#fileErrorMsg").html("Please Select Options");
          return;
        }
        totalOptions+=lvl.map(j=>j)[i].multiselectValue.length
      }
      var noOfRows = this.props.dataPreview.meta_data.scriptMetaData.metaData.filter(rows=>rows.name=="noOfRows").map(i=>i.value)[0];
      var rowCount = Math.round(Math.sqrt(noOfRows));
      var noOfLvls = this.props.selectedItem.columnStats.filter(lc=>lc.name=="numberOfUniqueValues").map(i=>i.value)[0];
      var lvlCount = noOfLvls-totalOptions+lvllen;
      if(lvlCount>Math.min(200,rowCount)){
        $("#fileErrorMsg").removeClass("visibilityHidden");
        $("#fileErrorMsg").html("Add more levels so that total level count is less than "+ Math.min(200,rowCount));
        return;
      }
    }
    
    console.log('level validation starts');
    var slugData = this.state[this.props.selectedItem.slug];
    if (slugData != undefined && this.state[this.props.selectedItem.slug][actionType] != undefined) {
      var levelData = this.state[this.props.selectedItem.slug][actionType];
      if(this.props.selectedItem.columnType == "datetime"){
        for (var i = 0; i < levelData.length; i++) {
          var startDate = levelData[i].startDate;
          var endDate = levelData[i].endDate;
          var inputValue = levelData[i].inputValue;
          var multiselect = levelData[i].multiselectValue;
          if((startDate == "" || undefined) || (endDate == "" || undefined) ){
            $("#fileErrorMsg").removeClass("visibilityHidden");
            $("#fileErrorMsg").html("Enter Dates");
            return;
          }
          else if ((Date.parse(startDate) > Date.parse(endDate))) {
            console.log('start date is greater');
            $("#fileErrorMsg").removeClass("visibilityHidden");
            $("#fileErrorMsg").html("Start Date should be before End Date");
            return;
          }
          else if (inputValue == undefined || inputValue == null || inputValue == "") {
            $("#fileErrorMsg").removeClass("visibilityHidden");
            $("#fileErrorMsg").html("Please enter the new column name");
            $("input[name='inputValue']").focus();
            return;
          }
        }
      }
      var dataToSave = JSON.parse(JSON.stringify(this.state[this.props.selectedItem.slug][actionType]));
      this.props.dispatch(saveBinLevelTransformationValuesAction(this.props.selectedItem.slug, actionType, dataToSave));
      this.closeBinsOrLevelsModal();
      this.closeTransformColumnModal();
    } else {
      $("#fileErrorMsg").removeClass("visibilityHidden");
      $("#fileErrorMsg").html("Please enter new level ");
    }
  }

  validateTransformdata(actionType) {
    console.log('transform validation starts');
    var slugData = this.state[this.props.selectedItem.slug];
    if (slugData != undefined && this.state[this.props.selectedItem.slug][actionType] != undefined) {
      var transformationData = this.state[this.props.selectedItem.slug][actionType];

      if(this.props.selectedItem.columnType == "measure"){
        if(!$('#replace_values_with').prop('checked') && !$('#feature_scaling').prop('checked') && !$('#variable_transformation').prop('checked')){
          $("#fileErrorMsg").removeClass("visibilityHidden");
          $("#fileErrorMsg").html("No fields Selected");
        }else{
          if (transformationData.replace_values_with == true || $('#replace_values_with').prop('checked') ) {
            if (transformationData.replace_values_with_input == undefined || transformationData.replace_values_with_input == null || transformationData.replace_values_with_input == "" || $('#replace_values_with').val() == "") {
              $("#fileErrorMsg").removeClass("visibilityHidden");
              $("#fileErrorMsg").html("Enter value");
              $("input[name='replace_values_with_input']").focus();
              return;
            }
            else if (transformationData.replace_values_with_selected == undefined || transformationData.replace_values_with_selected == null || transformationData.replace_values_with_selected == "" || $('#replace_values_with_selected').val() == "" || $('#replace_values_with_selected').val() == "None") {
              $("#fileErrorMsg").removeClass("visibilityHidden");
              $("#fileErrorMsg").html("Select value to replace with");
              $("select[name='replace_values_with_selected']").focus();
              return;
            }else
              $("#fileErrorMsg").addClass("visibilityHidden");
          }

            if((transformationData.feature_scaling == true) || $('#feature_scaling').prop('checked')){
              if (transformationData.perform_standardization_select == undefined || transformationData.perform_standardization_select == null || transformationData.perform_standardization_select == "" || $('#perform_standardization_select').val() == "" || $('#perform_standardization_select').val() == "None") {
                $("#fileErrorMsg").removeClass("visibilityHidden");
                $("#fileErrorMsg").html("Select value for feature scaling");
                $("select[name='perform_standardization_select']").focus();
                return;
              }else{
                $("#fileErrorMsg").addClass("visibilityHidden");
              }
            }

          if (transformationData.variable_transformation == true || $('#variable_transformation').prop('checked')) {
            if (transformationData.variable_transformation_select == undefined || transformationData.variable_transformation_select == null || transformationData.variable_transformation_select == ""|| $('#variable_transformation_select').val() == "" || $('#variable_transformation_select').val() == "None") {
              $("#fileErrorMsg").removeClass("visibilityHidden");
              $("#fileErrorMsg").html("Select value for variable transformation");
              $("select[name='variable_transformation_select']").focus();
              return;
            }else
              $("#fileErrorMsg").addClass("visibilityHidden");
          }

          var dataToSave = JSON.parse(JSON.stringify(this.state[this.props.selectedItem.slug][actionType]));
          this.props.dispatch(saveBinLevelTransformationValuesAction(this.props.selectedItem.slug, actionType, dataToSave));
          dataToSave.encoding_dimensions?dataToSave.encoding_type=dataToSave.encoding_type:dataToSave.encoding_type="";
          this.closeBinsOrLevelsModal();
          this.closeTransformColumnModal();
        }
      }
      else if(this.props.selectedItem.columnType == "dimension"){
        if(!document.getElementById("encoding_dimensions").checked || !document.getElementById("return_character_count").checked || !document.getElementById("is_custom_string_in").checked){
          $("#fileErrorMsg").removeClass("visibilityHidden");
          $("#fileErrorMsg").html("No fields Selected");
        }else{
          if (transformationData.encoding_dimensions == true || document.getElementById("encoding_dimensions").checked) {
            if (transformationData.encoding_type == undefined || transformationData.encoding_type == null || transformationData.encoding_type == "" || $("#encoding_type").val() == "") {
              $("#fileErrorMsg").removeClass("visibilityHidden");
              $("#fileErrorMsg").html("Select Encoding Type");
              $("select[name='encoding_type']").focus();
              return;
            }else
              $("#fileErrorMsg").addClass("visibilityHidden");
          }

          if (transformationData.is_custom_string_in == true || document.getElementById("is_custom_string_in").checked) {
            if (transformationData.is_custom_string_in_input == undefined || transformationData.is_custom_string_in_input == null || transformationData.is_custom_string_in_input == "" || $("input[name='is_custom_string_in_input']").val() == "") {
              $("#fileErrorMsg").removeClass("visibilityHidden");
              $("#fileErrorMsg").html("Enter value for custom String");
              $("input[name='is_custom_string_in_input']").focus();
              return;
            }else
              $("#fileErrorMsg").addClass("visibilityHidden");
          }
          var dataToSave = JSON.parse(JSON.stringify(this.state[this.props.selectedItem.slug][actionType]));
          this.props.dispatch(saveBinLevelTransformationValuesAction(this.props.selectedItem.slug, actionType, dataToSave));
          dataToSave.encoding_dimensions?dataToSave.encoding_type=dataToSave.encoding_type:dataToSave.encoding_type="";
          this.closeBinsOrLevelsModal();
          this.closeTransformColumnModal();
        }
      }else if(this.props.selectedItem.columnType == "datetime"){
        if(!document.getElementById("extract_time_feature").checked && !document.getElementById("time_since").checked && !document.getElementById("is_date_weekend").checked ){
          $("#fileErrorMsg").removeClass("visibilityHidden");
          $("#fileErrorMsg").html("No fields Selected");
        }else{
          if (transformationData.extract_time_feature == true || document.getElementById("extract_time_feature").checked) {
            if (transformationData.extract_time_feature_select == undefined || transformationData.extract_time_feature_select == null || transformationData.extract_time_feature_select == "" || $("select[name='extract_time_feature_select']").val() == "" ){
              $("#fileErrorMsg").removeClass("visibilityHidden");
              $("#fileErrorMsg").html("Select value for time feature");
              $("select[name='extract_time_feature_select']").focus();
              return;
            }else
              $("#fileErrorMsg").addClass("visibilityHidden");
          }

          if (transformationData.time_since == true || document.getElementById("time_since").checked) {
            if (transformationData.time_since_input == undefined || transformationData.time_since_input == null || transformationData.time_since_input == "" || $("input[name='time_since_input']").val()== "") {
              $("#fileErrorMsg").removeClass("visibilityHidden");
              $("#fileErrorMsg").html("Enter value for Time Since");
              $("input[name='time_since_input']").focus();
              return;
            }else
              $("#fileErrorMsg").addClass("visibilityHidden");
          }
          var dataToSave = JSON.parse(JSON.stringify(this.state[this.props.selectedItem.slug][actionType]));
          this.props.dispatch(saveBinLevelTransformationValuesAction(this.props.selectedItem.slug, actionType, dataToSave));
          dataToSave.encoding_dimensions?dataToSave.encoding_type=dataToSave.encoding_type:dataToSave.encoding_type="";
          this.closeBinsOrLevelsModal();
          this.closeTransformColumnModal();
        }
      }
    }
  }

  handleTopLevelRadioButtonOnchange(event) {
    this.state.topLevelRadioButton = event.target.value;
    this.saveTopLevelValues();
  }
  handleTopLevelInputOnchange(event) {
    this.state.topLevelInput = event.target.value;
    this.saveTopLevelValues();
  }
  saveTopLevelValues() {
    this.props.dispatch(saveTopLevelValuesAction(this.state.topLevelRadioButton, this.state.topLevelInput));
    this.setState({ state: this.state });
  }
  handleProcedClicked(event) {
    var proccedUrl = this.props.match.url.replace('featureEngineering', 'algorithmSelection');
    this.props.history.push(proccedUrl);
  }
  isBinningOrLevelsDisabled(item) {
    return ((this.state.topLevelRadioButton == "true" && item.columnType == "measure") || (item.columnType != item.actualColumnType))
  }

  feTableSorter() {
    $(function () {
      $('#fetable').tablesorter({
        theme: 'ice',
        headers: {
          3: { sorter: false },
          2: { sorter: false }
        }
      });
    });
  }

  handleBack=()=>{
    const appId = this.props.match.params.AppId;
    const slug = this.props.match.params.slug;
    this.props.history.replace(`/apps/${appId}/analyst/models/data/${slug}/createModel/dataCleansing?from=feature_Engineering`);
  }

  render() {
    console.log("FeatureEngineering render method is called...");
    this.feTableSorter();
    var feHtml = "";
    var SV = "";
    var binsOrLevelsPopup = "";
    var transformColumnPopup = "";
    let typeofBinningSelectBox = null;
    var binOrLevels = "";
    var binOrLevelData = "";
    var values = "";
    var removedVariables = getRemovedVariableNames(this.props.datasets);
    var numberOfSelectedMeasures = 0;
    var numberOfSelectedDimensions = 0;
    var data = this.props.datasets.selectedVariables;

    var considerItems = this.props.datasets.dataPreview.meta_data.uiMetaData.columnDataUI.filter(i => ((i.consider === false) && (i.ignoreSuggestionFlag === false)) || ((i.consider === false) && (i.ignoreSuggestionFlag === true) && (i.ignoreSuggestionPreviewFlag === true))).map(j => j.name);

    var unselectedvar = [];
    for (var key in this.props.datasets.selectedVariables) {
      if (!this.props.datasets.selectedVariables[key])
        unselectedvar.push(key);
    }
    // var result = {};

    // for(var key in data)
    // {
    //     if(data.hasOwnProperty(key))
    //     {
    //         result.add({
    //             key: key,
    //             value: data[key]
    //         });
    //     }
    // }
    if (this.props.dataPreview != null) {
      feHtml = this.props.dataPreview.meta_data.scriptMetaData.columnData.map((item, key) => {
        if (removedVariables.indexOf(item.name) != -1 || unselectedvar.indexOf(item.slug) != -1 || considerItems.indexOf(item.name) != -1)
          return "";
        if (item.columnType == "measure")
          numberOfSelectedMeasures += 1;
        else
          numberOfSelectedDimensions += 1;
        return (
          <tr className={('all ' + item.columnType)}>
            <td className="text-left"> {item.name}</td>
            <td> {item.columnType.charAt(0).toUpperCase() + item.columnType.slice(1)}</td>
            <td> <Button onClick={this.openBinsOrLevelsModal.bind(this, item)} disabled={this.isBinningOrLevelsDisabled(item)} bsStyle="cst_button">Create Bins or Levels</Button></td>
            <td> <Button onClick={this.openTransformColumnModal.bind(this, item)} bsStyle="cst_button">Transform</Button></td>
          </tr>
        );
      })
    }
    if (this.props.selectedItem.columnType == "measure") {
      binOrLevels = <Bins parentPickValue={this.pickValue} clearBinsAndIntervals={this.clearBinsAndIntervals} />
      binOrLevelData = "binData";
    } else if (this.props.selectedItem.columnType == "dimension") {
      binOrLevels = <Levels parentPickValue={this.pickValue} parentUpdateLevelsData={this.updateLevelsData} levelsData={this.getLevelsData()} />
      binOrLevelData = "levelData";
    } else {
      binOrLevels = <Levels parentPickValue={this.pickValue} parentUpdateLevelsData={this.updateLevelsData} levelsData={this.getLevelsData()} />
      binOrLevelData = "levelData";
    }

    binsOrLevelsPopup = (
      <div id="binsOrLevels" role="dialog" className="modal fade modal-colored-header">
        <Modal show={this.props.binsOrLevelsShowModal} onHide={this.closeBinsOrLevelsModal.bind(this)} dialogClassName="modal-colored-header modal-md" style={{ overflow: 'inherit' }} >
          <Modal.Header closeButton>
            <h3 className="modal-title">Create {(this.props.selectedItem.columnType == "measure") ? "Bins" : "Levels"}</h3>
          </Modal.Header>
          <Modal.Body>
            <div>
              <h4>What you want to do?</h4>
              {binOrLevels}
            </div>
            <div id="errorMsgs" className="text-danger"></div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.closeBinsOrLevelsModal.bind(this)}>Cancel</Button>
            <Button bsStyle="primary" form="binsForm" content="Submit" value="Submit" onClick={this.handleCreateClicked.bind(this, binOrLevelData)}>Create</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
    transformColumnPopup = (
      <div class="col-md-3 xs-mb-15 list-boxes" >
        <div id="transformColumnPopup" role="dialog" className="modal fade modal-colored-header">
          <Modal show={this.props.transferColumnShowModal} onHide={this.closeTransformColumnModal.bind(this)} dialogClassName="modal-colored-header">
            <Modal.Header closeButton>
              <h3 className="modal-title">Transform {this.props.selectedItem.columnType} column</h3>
            </Modal.Header>
            <Modal.Body>
              <Transform parentPickValue={this.pickValue} />
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.closeTransformColumnModal.bind(this)}>Cancel</Button>
              <Button bsStyle="primary" onClick={this.handleCreateClicked.bind(this, "transformationData")}>Create</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    )

    return (
      // <!-- Main Content starts with side-body -->
      <div>
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
                    <h4> The dataset contains {numberOfSelectedMeasures + numberOfSelectedDimensions} columns or features ({numberOfSelectedMeasures} measures and {numberOfSelectedDimensions} dimensions).  If you would like to transform the existing features or create new features from the existing data, you can use the options provided below. </h4><hr />
                    <p class="inline-block">
                      <i class="fa fa-angle-double-right text-primary"></i> Do you want to convert all measures into dimension using binning? &nbsp;&nbsp;&nbsp;
                  </p>
                    <span onChange={this.handleTopLevelRadioButtonOnchange.bind(this)} className="inline">
                      <div class="ma-checkbox inline">
                        <input type="radio" id="mTod-binning1" value="true" name="mTod-binning" checked={this.props.convertUsingBin === "true"} />
                        <label for="mTod-binning1">Yes</label>
                      </div>
                      <div class="ma-checkbox inline">
                        <input type="radio" id="mTod-binning2" value="false" name="mTod-binning" checked={this.props.convertUsingBin === "false"} />
                        <label for="mTod-binning2">No </label>
                      </div>
                    </span>
                    {(this.props.convertUsingBin === "true") ? <div id="box-binning" class="xs-ml-20 block-inline"><span class="inline-block"> Number of bins : <input type="number" onInput={this.handleTopLevelInputOnchange.bind(this)} class="test_css form-control" maxlength="2" id="flight_number" name="number" defaultValue={this.props.numberOfBins} /></span></div> : ""}
                  </div>
                </div>
                <div className="panel box-shadow ">
                  <div class="panel-body no-border xs-p-20">
                    <div class="row xs-mb-10">
                      <div className="col-md-3">
                        <div class="form-inline" >
                          <div class="form-group">
                            <label for="sdataType">Filter By: </label>
                            <select id="sdataType" className="form-control cst-width">
                              <option value="all">Data Type</option>
                              <option value="measure">Measure</option>
                              <option value="dimension">Dimension</option>
                              <option value="datetime">Datetime</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-3 col-md-offset-6">
                        <div class="form-inline" >
                          <div class="form-group pull-right">
                            <input type="text" id="search" className="form-control" placeholder="Search..."></input>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="table-responsive noSwipe xs-pb-5">
                      <Scrollbars style={{
                        height: 500
                      }}>
                        <table id="fetable" className="table table-striped table-bordered break-if-longText">
                          <thead>
                            <tr key="trKey" className="myHead">
                              <th className="text-left"><b>Variable name</b></th>
                              <th ><b>Data type</b></th>
                              <th></th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody className="no-border-x">{feHtml}</tbody>
                        </table>
                      </Scrollbars>
                    </div>
                  </div>
                  <div className="panel-body box-shadow">
                  <Button onClick={this.handleBack} bsStyle="primary"><i class="fa fa-angle-double-left"></i> Back</Button>
                    <div className="buttonRow" id="dataPreviewButton" style={{float:"right",display:"inline-block"}}>
                      <Button onClick={this.handleProcedClicked.bind(this)} bsStyle="primary">{this.buttons.proceed.text} <i class="fa fa-angle-double-right"></i></Button>
                    </div>
                    <div class="xs-p-10"></div>
                  </div>
                </div>
              </div>
              {/* <!--End of Page Content Area --> */}
            </div>
          </div>
          {/* <!-- Main Content ends with side-body --> */}
        </div>


      </div>

    );
  }

  openBinsOrLevelsModal(item) {
    console.log("open ---openBinsOrLevelsModal");
    this.props.dispatch(openBinsOrLevelsModalAction(item));
    //this.setState({NoModal: this.state.NoModal + 1});
   }

  closeBinsOrLevelsModal(event) {
    console.log("closeddddd ---closeBinsOrLevelsModal");
    this.props.dispatch(closeBinsOrLevelsModalAction());
  }
  openTransformColumnModal(item) {
    console.log("open ---openTransformColumnModal");
    this.props.dispatch(openTransformColumnModalAction(item));
  }

  closeTransformColumnModal() {
    console.log("closeddddd ---closeTransformColumnModal");
    this.props.dispatch(closeTransformColumnModalAction());
  }

  handleSelect(selectedKey) {
    console.log(`selected ${selectedKey}`);
    this.props.dispatch(selectedBinsOrLevelsTabAction(selectedKey));
  }

  createLevels(slug) {
    this.props.dispatch();
  }
}