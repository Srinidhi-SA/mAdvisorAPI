import React from "react";
import CircularProgressbar from 'react-circular-progressbar';
import {Redirect} from 'react-router';
import {handleDecisionTreeTable} from "../actions/signalActions";
import renderHTML from 'react-render-html';
import {API, STATIC_URL} from "./env";
import {showLoading, hideLoading} from 'react-redux-loading-bar'

function getHeader(token) {
  return {'Authorization': token, 'Content-Type': 'application/json'};
}

export function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop))
      return false;
    }

  return JSON.stringify(obj) === JSON.stringify({});
}

var USERDETAILS = {};
export function handleSignalToggleButton() {
  if ($(".toggleOn").is(":visible")) {
    $(".toggleOff").removeClass("hidden");
    $(".toggleOn").addClass("hidden")
  } else {
    $(".toggleOn").removeClass("hidden");
    $(".toggleOff").addClass("hidden")
  }
}

export const getUserDetailsOrRestart = {
  get: function() {
    let userDetails = {};
    if (document.cookie) {
      let allCookies = document.cookie.split(";");
      for (let i = 0; i < allCookies.length; i++) {
        let cur = allCookies[i].split('=');
        userDetails[cur[0].replace(/\s/g, '')] = cur[1];
      }
      return userDetails;
    } else {
      redirectToLogin();
    }

  }
}

function redirectToLogin() {
  var noOfUrls = window.history.length;
  window.history.go("-" + noOfUrls - 1);
  //window.history.replaceState(null,null,"login");
}

const FILEUPLOAD = "fileUpload";
const MYSQL = "MySQL";
const MSSQL = "mssql";
const HANA = "Hana";
const HDFS = "Hdfs";
const INPUT = "Input";
const HOST = "Host";
const PORT = "Port";
const SCHEMA = "Schema";
const USERNAME = "Username";
const PASSWORD = "Password";
const TABLENAME = "tablename";
const PERPAGE = 12;
const NORMALTABLE = "normal";
const CONFUSIONMATRIX = "confusionMatrix";
const HEATMAPTABLE = "heatMap";
const CIRCULARCHARTTABLE = "circularChartTable";
const DECISIONTREETABLE = "decisionTreeTable"
const DULOADERPERVALUE = -1;
const CSLOADERPERVALUE = -1;
const APPSLOADERPERVALUE = -1;
const LOADERMAXPERVALUE = 99;
const DEFAULTINTERVAL = 10000;
const APPSDEFAULTINTERVAL = 10000;
const CUSTOMERDATA = "Customer Data";
const HISTORIALDATA = "Historial Data";
const EXTERNALDATA = "External Data";
const DELETEMODEL = "Delete Model";
const RENAMEMODEL = "Rename Model";
const DELETESCORE = "Delete Score";
const RENAMESCORE = "Rename Score";
const DELETEINSIGHT = "Delete Insight";
const RENAMEINSIGHT = "Rename Insight";
const SEARCHCHARLIMIT = 2;
const SUCCESS = "SUCCESS";
const FAILED = "FAILED";
const INPROGRESS = "INPROGRESS";
const APPNAME1 = "OPPORTUNITY SCORING";
const APPNAME2 = "AUTOMATED PREDICTION";
const APPNAME3 = "ROBO INSIGHTS";
const APPNAME5 = "STOCK ADVISOR";
const APPID1 = 1;
const APPID2 = 2;
const APPID3 = 3;
const APPID5 = 5;
const CUSTOMER = "customer";
const HISTORIAL = "historical";
const EXTERNAL = "external";
const APPID4 = 4;
const APPNAME4 = "Speech Analytics";
const DELETEAUDIO = "Delete Media File";
const RENAMEAUDIO = "Rename Media File";
const DULOADERPERMSG = "Preparing data for loading";
const RENAME = "rename";
const DELETE = "delete";
const REPLACE = "replace";
const DATA_TYPE = "data_type";
const REMOVE = "remove";
const CURRENTVALUE = "current value";
const NEWVALUE = "new value";
const TEXTHEATMAPTABLE = "textHeatMapTable";
const DEFAULTANALYSISVARIABLES = "high";
const MINROWINDATASET = 10;
const APPSPERPAGE = 9;
const POPUPDECISIONTREETABLE = "popupDecisionTreeTable";
const MAXTEXTLENGTH = 375;
const SET_VARIABLE = "set_variable";
const DIMENSION = "dimension";
const MEASURE = "measure";
const PERCENTAGE = "percentage";
const GENERIC_NUMERIC = "generic_numeric";
const SET_POLARITY = "set_polarity";
const UNIQUE_IDENTIFIER = "unique_identifier";
const DYNAMICLOADERINTERVAL = 2000;
const IGNORE_SUGGESTION = "ignore_suggestion";
const ACCESSDENIED = "Access Denied"
const CREATESIGNAL = "Create Signal";
const PROCEEDTODATACLEANSING = "Proceed to data cleansing";
const PROCEEDTOFEATUREENGINEERING ="proceed to feature Engineering"
const PROCEEDTOMODELMANAGEMENT= "proceed to model management"
const CREATEMODEL = "Create Model";
const CREATESCORE = "Create Score";
const DELETESTOCKMODEL = "Delete Analysis";
const RENAMESTOCKMODEL = "Rename Analysis";

export function generateHeaders(table) {
  var cols = table.tableData.map(function(rowData, i) {
    if (i == 0) {
      return rowData.map(function(colData, j) {
        return <th key={j}>{colData}</th>;
      });
    }
  })
  return cols;
}

export function generateHeatMapHeaders(table) {
  var cols = table.tableData.map(function(rowData, i) {
    if (i == 0) {
      var row = rowData.map(function(colData, j) {
        return <th key={j} className="first">{colData}</th>;
      });
      return <tr key={i} className="heatMapHeader">{row}</tr>
    }
  })

  return cols;
}

export function generateHeatMapRows(table) {
  var cols = table.tableData.map(function(rowData, i) {
    if (i != 0) {
      var row = rowData.map(function(colData, j) {
        if (j == 0) {
          return <td key={j} className="stats-title">{colData}</td>;
        } else {
          return <td key={j}>{colData}</td>;
        }

      });
      return <tr key={i} className="stats-row">{row}</tr>
    }
  })

  return cols;
}

export function generateTextHeatMapRows(table) {
  var cols = table.tableData.map(function(rowData, i) {
    if (i != 0) {
      var row = rowData.map(function(colData, j) {
        console.log(colData)
        if (colData.value == 0 && colData.text == "") {
          return <td key={j} value={colData.value}></td>;
        } else {
          //return<td key={j}>{colData.text}<br/>{colData.value}</td>;
          return <td key={j} value={colData.value}>{colData.text}<br/>
            <b>{colData.value}</b>
          </td>;
        }

      });
      return <tr key={i} className="stats-row">{row}</tr>
    }
  })

  return cols;
}

export function generateCircularChartRows(table) {
  var tbodyData = table.tableData.map(function(rowData, i) {
    if (i != 0) {
      var rows = rowData.map(function(colData, j) {
        if (isNaN(colData))
          return <td key={j}>{colData}</td>;
        else
          return <td key={j}><CircularProgressbar percentage={colData} initialAnimation={true}/></td>;
        }
      );
      return <tr key={i}>{rows}</tr>;
    }
  })
  return tbodyData;
}
export function generateRows(table) {
  var tbodyData = table.tableData.map(function(rowData, i) {
    if (i != 0) {
      var rows = rowData.map(function(colData, j) {
        return <td key={j}>{colData}</td>;
      });
      return <tr key={i}>{rows}</tr>;
    }
  })
  return tbodyData;
}

export function generateNormalTableRows(table) {
  var tbodyData = table.tableData.map(function(rowData, i) {
    if (i != 0) {
      var rows = rowData.map(function(colData, j) {
        if (j == 0 || j == 1)
          return <td key={j}>{colData}</td>;

else
          return <td key={j}>{colData}</td>;
        }
      );
      return <tr key={i}>{rows}</tr>;
    }
  })
  return tbodyData;
}

export function subTreeSetting(urlLength, length, paramL2, classname = ".sb_navigation #subTab i.mAd_icons.ic_perf ~ span") {
  $(function() {
    if (urlLength == length) { //show -hide subtree and active class of subtree element
      $(".sb_navigation").show();
      $(classname).each(function() {
        console.log($(this).html() + " == " + paramL2);
        if ($(this).attr('id') == paramL2) {
          $(this).parent().addClass('active');
        } else {
          $(this).parent().removeClass('active');
        }
      });

    } else {
      $(".sb_navigation").hide();
    } // end of show -hide subtree and active class of subtree element

    if ($(".list-group").children()) { // show hide side panel list
      if ($(".list-group").children().length == 1) {
        $('.row-offcanvas-left').addClass('active');
        $('.sdbar_switch i').removeClass('sw_on');
        $('.sdbar_switch i').addClass('sw_off');
      }
    }

    /*  if(that.showSubTree){   // for sub tree active class check
       $(".sb_navigation #subTab i.mAd_icons.ic_perf ~ span").each(function(){
        console.log($(this).html() +" == "+ that.props.match.params.l2);
        if($(this).attr('id') == that.props.match.params.l2){
          $(this).parent().addClass('active');
        }else{
          $(this).parent().removeClass('active');
        }
       });
     }*/

  });

}

export function showHideSideChart(colType, chartData) {

  if (colType == "datetime" || $.isEmptyObject(chartData)) {
    $(function() {
      $("#tab_visualizations #pnl_visl").removeClass("in");
      $("#tab_visualizations a").addClass("collapsed");
    });
  } else {
    $(function() {
      $("#tab_visualizations #pnl_visl").addClass("in");
      $("#tab_visualizations a").removeClass("collapsed");
      $("#tab_visualizations #pnl_visl").removeAttr("style");
    });
  }

}

export function showHideSideTable(colstats) {
  let flag = false

  for (var i = 0; i < colstats.length; i++) {
    if (colstats[i].display) {
      flag = true;
    }
  }

  if (colstats.length == 0 || !flag) {

    $("#tab_statistics #pnl_stc").removeClass("in");
    $("#tab_statistics a").addClass("collapsed");
  } else {

    $("#tab_statistics #pnl_stc").addClass("in");
    $("#tab_statistics a").removeClass("collapsed");
    $("#tab_statistics #pnl_stc").removeAttr("style");

  }

}

export function showHideSubsetting(colType, subsetData, dateflag) {

  if (dateflag == true || (colType == "dimension" && $.isEmptyObject(subsetData))) {
    $(function() {
      $("#tab_subsettings #pnl_tbset").removeClass("in");
      $("#tab_subsettings a").addClass("collapsed");
      $("#saveSubSetting").hide();
    });
  } else {
    $(function() {
      $("#tab_subsettings #pnl_tbset").addClass("in");
      $("#tab_subsettings a").removeClass("collapsed");
      $("#tab_subsettings #pnl_tbset").removeAttr("style");
      $("#saveSubSetting").show();
    });

  }

}

export function decimalPlaces(number) {
  // toFixed produces a fixed representation accurate to 20 decimal places
  // without an exponent.
  // The ^-?\d*\. strips off any sign, integer portion, and decimal point
  // leaving only the decimal fraction.
  // The 0+$ strips off any trailing zeroes.
  return ((+ number).toFixed(4)).replace(/^-?\d*\.?|0+$/g, '').length;
}

export function handleJobProcessing(slug) {
  return (dispatch) => {
    dispatch(showLoading());
    return updateJobStatus(slug, dispatch).then(([response, json]) => {
      dispatch(hideLoading());
    })
  }

}
export function updateJobStatus(slug, dispatch) {
  return fetch(API + '/api/get_job_kill/' + slug + '/', {
    method: 'get',
    headers: getHeader(getUserDetailsOrRestart.get().userToken)
  }).then(response => Promise.all([response, response.json()])).catch(function(error) {
    dispatch(hideLoading());
    bootbox.alert("Unable to connect to server. Check your connection please try again.")
  });
}
export {
  FILEUPLOAD,
  MYSQL,
  INPUT,
  PASSWORD,
  HOST,
  PORT,
  SCHEMA,
  USERNAME,
  TABLENAME,
  PERPAGE,
  NORMALTABLE,
  CONFUSIONMATRIX,
  HEATMAPTABLE,
  CIRCULARCHARTTABLE,
  DECISIONTREETABLE,
  DULOADERPERVALUE,
  CSLOADERPERVALUE,
  LOADERMAXPERVALUE,
  DEFAULTINTERVAL,
  APPSDEFAULTINTERVAL,
  CUSTOMERDATA,
  HISTORIALDATA,
  EXTERNALDATA,
  DELETEMODEL,
  RENAMEMODEL,
  DELETESCORE,
  RENAMESCORE,
  DELETEINSIGHT,
  RENAMEINSIGHT,
  SEARCHCHARLIMIT,
  SUCCESS,
  FAILED,
  INPROGRESS,
  APPNAME1,
  APPNAME2,
  APPNAME3,
  APPID1,
  APPID2,
  APPID3,
  CUSTOMER,
  HISTORIAL,
  EXTERNAL,
  APPID4,
  APPNAME4,
  RENAMEAUDIO,
  DELETEAUDIO,
  DULOADERPERMSG,
  RENAME,
  DELETE,
  REPLACE,
  DATA_TYPE,
  REMOVE,
  CURRENTVALUE,
  NEWVALUE,
  APPID5,
  APPNAME5,
  TEXTHEATMAPTABLE,
  APPSLOADERPERVALUE,
  USERDETAILS,
  DEFAULTANALYSISVARIABLES,
  MINROWINDATASET,
  APPSPERPAGE,
  POPUPDECISIONTREETABLE,
  MAXTEXTLENGTH,
  SET_VARIABLE,
  DIMENSION,
  MEASURE,
  PERCENTAGE,
  GENERIC_NUMERIC,
  SET_POLARITY,
  UNIQUE_IDENTIFIER,
  DYNAMICLOADERINTERVAL,
  IGNORE_SUGGESTION,
  HDFS,
  HANA,
  MSSQL,
  ACCESSDENIED,
  CREATESIGNAL,
  PROCEEDTODATACLEANSING,
  PROCEEDTOFEATUREENGINEERING,
  PROCEEDTOMODELMANAGEMENT,
  CREATESCORE,
  CREATEMODEL,
  DELETESTOCKMODEL,
  RENAMESTOCKMODEL
}
export function capitalizeArray(array) {
  let a = []
  let i = 0
  for (var val in array) {
    a[i] = array[val].charAt(0).toUpperCase() + array[val].slice(1);
    i++;
  }
  return a
}
export function predictionLabelClick() {
  var cell = document.querySelectorAll('.pred_disp_block');
  for (var i = 0; i < cell.length; i++) {
    cell[i].addEventListener('click', handleDecisionTreeTable, false);
  }

}

export function renderC3ChartInfo(info) {
  if (!isEmpty(info)) {

    var listOfData = "";
    info.map((item, index) => {
      listOfData += "<p>" + item + "</p>";
    });
    bootbox.dialog({
      title: "Statistical Info",
      size: 450,//'small',
      closeButton: true,
      message: "<div>" + listOfData + "</div>",
      onEscape: true
    })
  }

}

export function bytesToSize(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0)
    return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

export function downloadSVGAsPNG(chartClassId) {
  //This is code to remove background black color in chart and ticks adjustment
  var nodeList = document.querySelector("." + chartClassId + ">svg").querySelectorAll('.c3-chart .c3-chart-lines path');
  var nodeList2 = document.querySelector("." + chartClassId + ">svg").querySelectorAll('.c3-axis path');
  var nodeList3 = document.querySelector("." + chartClassId + ">svg").querySelectorAll("svg text");

  var line_graph = Array.from(nodeList);
  var x_and_y = Array.from(nodeList2); //.concat(Array.from(nodeList2));
  var labels = Array.from(nodeList3)

  line_graph.forEach(function(element) {
    element.style.fill = "none";
  });
  x_and_y.forEach(function(element) {
    element.style.fill = "none";
    element.style.stroke = "black";
  });
  labels.forEach(function(element) {
    element.style.fontSize = "12px"
  })
  saveSvgAsPng(document.querySelector("." + chartClassId + ">svg"), "chart.png", {
    backgroundColor: "white",
    height: "500"
  });

}
//return status msg html string, msg_type can be error, warning,or info.mascot_type will be small_mascot,large_mascot or without_mascot
export function statusMessages(msg_type, msg, mascot_type) {
  let imgsrc_url = ""
  let status_text = ""
  let htmlString = ""
  switch (msg_type) {
    case "warning":
      {
        imgsrc_url = STATIC_URL + "assets/images/alert_warning.png"
        status_text = '<h4 class="text-warning">Warning !</h4>'
      }
      break;
    case "error":
      {
        imgsrc_url = STATIC_URL + "assets/images/alert_danger.png"
        status_text = '<h4 class="text-danger">Ooops !</h4>'
      }
      break;
    case "info":
      {
        imgsrc_url = STATIC_URL + ""
        status_text = ''
      }
      break;
    case "success":
      {
        imgsrc_url = STATIC_URL + "assets/images/alert_success.png"
        status_text = '<h4 class="text-primary">Success !</h4>'
      }
  }
  if (mascot_type == "without_mascot") {
    htmlString = '<div class="border border-danger"><h4 class="alert-heading">Error !</h4><p>' + msg + '</p></div>'
  } else {
    htmlString = '<div class="row"><div class="col-md-4"><img src=' + imgsrc_url + ' class="img-responsive" /></div><div class="col-md-8">' + status_text + '<p>' + msg + '</p></div></div>';
  }
  return htmlString
}
export function toggleVisualization(slug, actionsData) {
  let flag = true;
  let transformationSettings = actionsData;
  $.each(transformationSettings, function(key, val) {
    if (val.slug == slug) {
      $.each(val.columnSetting, function(key1, val1) {
        if (val1.actionName == IGNORE_SUGGESTION && val1.status == true)
          flag = false;
        }
      );
    }
  });
  if (flag == false) {
    $(function() {
      $("#tab_visualizations #pnl_visl").removeClass("in");
      $("#tab_visualizations a").addClass("collapsed");
    });
  } else {
    $(function() {
      $("#tab_visualizations #pnl_visl").addClass("in");
      $("#tab_visualizations a").removeClass("collapsed");
      $("#tab_visualizations #pnl_visl").removeAttr("style");
    });
  }

}

export function removeChatbotOnLogout() {
  var tags = document.getElementsByTagName('script');
  for (var i = tags.length; i >= 0; i--) { //search backwards within nodelist for matching elements to remove
    if (tags[i] && tags[i].getAttribute('src') != null && tags[i].getAttribute('src').indexOf("client-plugin/bot.js") != -1)
      tags[i].parentNode.removeChild(tags[i]); //remove element by calling parentNode.removeChild()
    }
  }

export function hidechatbot() {

  var chatwindow = document.getElementById("welcome-body-frame")
  if (chatwindow != null)
  chatwindow.parentNode.removeChild(chatwindow)

    Array.from(document.getElementsByClassName("chat-icon-container")).forEach(element => element.remove());

    Array.from(document.getElementsByClassName("chat-container")).forEach(element => element.remove());

}


export function checkChatbotPresent() {
  var tags = document.getElementsByTagName('script');
  for (var i = tags.length; i >= 0; i--) { //search backwards within nodelist for matching elements to remove
    if (tags[i] && tags[i].getAttribute('src') != null && tags[i].getAttribute('src').indexOf("client-plugin/bot.js") != -1)
      return true
  }
  return false
}

/**
* Check dataset and get all the selected variables
*/
export function getRemovedVariableNames(dataset){
    var arr = [];

    var pickRemoved = function(item){
        if(item.targetColumn||!item.selected ){
            // if(!item.selected ){
            // if(item.selected="true"|| item.targetColumn=="true"){
            arr.push(item.name)
        }
    }

    dataset.CopyOfDimension.map(pickRemoved);
    dataset.CopyOfMeasures.map(pickRemoved);
    dataset.CopyTimeDimension.map(pickRemoved);
    return arr;

}

export function getSelectedVariableNames(obj){
  
  debugger;
  var items={};
 for(var i in obj){
   if((obj[i])== "true")
   items[i]= getSelectedVariableNames(obj[i]);
   else 
   items[i]=obj[i];
 }
 return items;
 }