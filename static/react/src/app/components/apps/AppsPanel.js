import React from "react";
import store from "../../store";
import {connect} from "react-redux";

import {MainHeader} from "../common/MainHeader";
import {Tabs, Tab, Pagination} from "react-bootstrap";
import {Link, Redirect} from "react-router-dom";
import {
  updateSelectedApp,
  getAppsList,
  appsStoreSortElements,
  appsStoreSearchEle,
  updateModelSummaryFlag,
  uploadStockAnalysisFlag,
  closeAppsLoaderValue,
  updateScoreSummaryFlag,
  clearModelSummary,
  showRoboDataUploadPreview,
  updateAudioFileSummaryFlag,
  updateAppsFilterList,
  getAppsFilteredList,
  clearDataPreview,
  updateAnalystModeSelectedFlag,
} from "../../actions/appActions";
import {STATIC_URL,APPS_ALLOWED} from "../../helpers/env.js"
import {
  SEARCHCHARLIMIT,
  APPID1,
  APPID2,
  APPID3,
  APPID4,
  APPNAME1,
  APPNAME2,
  APPNAME3,
  APPNAME4,
  APPNAME5,
  APPID5,
  getUserDetailsOrRestart,
  isEmpty
} from "../../helpers/helper.js"
import {cookieObj} from '../../helpers/cookiesHandler'

@connect((store) => {
  return {
    login_response: store.login.login_response,
    modelList: store.apps.modelList,
    // algoList: store.appsAlgoList,

    modelSummaryFlag: store.apps.modelSummaryFlag,
    modelSlug: store.apps.modelSlug,
    currentAppId: store.apps.currentAppId,
    appsList: store.apps.appsList,
    storeAppsSearchElement: store.apps.storeAppsSearchElement,
    storeAppsSortByElement: store.apps.storeAppsSortByElement,
    storeAppsSortType: store.apps.storeAppsSortType,
    app_filtered_keywords: store.apps.app_filtered_keywords
  };
})

export class AppsPanel extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);
    this.handleSelect = this.handleSelect.bind(this);

  }
  componentWillMount() {

    var pageNo = 1;
    if (this.props.history.location.search.indexOf("page") != -1) {
      pageNo = this.props.history.location.search.split("page=")[1];
      this.props.dispatch(getAppsList(getUserDetailsOrRestart.get().userToken, pageNo));
      //this.props.dispatch(updateAppsFilterList([]))
    } else
      this.props.dispatch(getAppsList(getUserDetailsOrRestart.get().userToken, pageNo));
    this.props.dispatch(updateAppsFilterList([]))
    // this.props.dispatch(updateAnalystModeSelectedFlag(false));
  }

  onChangeAppsSearchBox(e) {
    if (e.target.value == "" || e.target.value == null) {
      this.props.dispatch(appsStoreSearchEle(""));
      this.props.history.push('/apps');
      this.props.dispatch(getAppsList(getUserDetailsOrRestart.get().userToken, 1));

    } else if (e.target.value.length > SEARCHCHARLIMIT) {
      this.props.history.push('/apps?search=' + e.target.value + '')
      this.props.dispatch(appsStoreSearchEle(e.target.value));
      this.props.dispatch(getAppsList(getUserDetailsOrRestart.get().userToken, 1));
    }
      // Clear the Filter
      if(this.props.app_filtered_keywords!=null)
      this.props.dispatch(updateAppsFilterList([]));
 }
  _handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      console.log('searching');
      if (e.target.value != "" && e.target.value != null)
        this.props.history.push('/apps?search=' + e.target.value + '')

      this.props.dispatch(appsStoreSearchEle(e.target.value));
      this.props.dispatch(getAppsList(getUserDetailsOrRestart.get().userToken, 1));
    }
  }
  handleCheckboxChange(e) {
    console.log(e.target)
    e.preventDefault();
    //console.log(e.target.checked)
    var array = this.props.app_filtered_keywords;
    var index = array.indexOf(e.target.name)
    if (e.target.checked && !index > -1) {
      array.push(e.target.name)
    } else if (!e.target.checked) {
      if (index > -1)
        array.splice(index, 1);
      }
    console.log(array)
    this.props.dispatch(updateAppsFilterList(array))
    this.props.dispatch(getAppsFilteredList(getUserDetailsOrRestart.get().userToken, 1))
    if(array.length>0)
    this.props.history.push('/apps?filterApplied=' + array)
    else
    this.props.history.push('/apps')
    if (document.getElementById('search_apps').value.trim() != ""){
        document.getElementById('search_apps').value = "";
    }
  }
  gotoAppsList(appId, appName,appDetails) {
    this.props.dispatch(updateSelectedApp(appId, appName,appDetails));
    this.props.dispatch(updateModelSummaryFlag(false));
    this.props.dispatch(updateScoreSummaryFlag(false));
    this.props.dispatch(showRoboDataUploadPreview(false));
    this.props.dispatch(updateAudioFileSummaryFlag(false));
    this.props.dispatch(closeAppsLoaderValue());
    this.props.dispatch(uploadStockAnalysisFlag(false));
    this.props.dispatch(clearModelSummary());
    this.props.dispatch(clearDataPreview());
  }
  handleSelect(eventKey) {
    if (this.props.app_filtered_keywords.length == this.props.appsList.data[0].tag_keywords.length) {
      this.props.history.push('/apps?page=' + eventKey + '');
      this.props.dispatch(getAppsList(getUserDetailsOrRestart.get().userToken, eventKey));
    } else {
      this.props.history.push('/apps?appliedFilter=' + this.props.app_filtered_keywords + '&pageNo=' + eventKey + '');
      this.props.dispatch(getAppsFilteredList(getUserDetailsOrRestart.get().userToken, eventKey));
    }
  }
  handleSearchReset() {
    this.props.dispatch(appsStoreSearchEle(""));
    this.props.history.push('/apps');
    this.props.dispatch(getAppsList(getUserDetailsOrRestart.get().userToken, 1));
  }
  handleSorting(sortBy, sortType) {
    this.props.history.push('/apps?sort=' + sortBy + '&type=' + sortType);
    this.props.dispatch(appsStoreSortElements(sortBy, sortType));
    this.props.dispatch(getAppsList(getUserDetailsOrRestart.get().userToken, 1));
  }

  render() {
    console.log("Apps panel is called##########3");
    //restrict apps to show to user as per env js file starts
    if(APPS_ALLOWED==false){
      if(getUserDetailsOrRestart.get().view_signal_permission=="true")
      return (<Redirect to="/signals"/>)
      else if (getUserDetailsOrRestart.get().view_data_permission=="true") {
        return (<Redirect to="/data"/>)
      }else{
        cookieObj.clearCookies();
        return (<Redirect to="/login"/>)
      }
    }
    //restrict user ends
    var appsLists = this.props.appsList.data;
    var top3 = this.props.appsList.top_3;
    var appListTemplate = "";
    let filterListTemplate = "";
    let paginationTag = null
    let filteredKeywords = this.props.app_filtered_keywords
    //check for filter list

    //empty search element
    if (this.props.storeAppsSearchElement != "" && (this.props.location.search == "" || this.props.location.search == null)) {
      this.props.dispatch(appsStoreSearchEle(""));
      let search_element = document.getElementById('search_apps');
      if (search_element)
        document.getElementById('search_apps').value = "";
      }

    if (this.props.location.sort == "" || this.props.location.sort == null) {
      this.props.dispatch(appsStoreSortElements("", null));
    }

    if (appsLists != undefined && appsLists.length > 0) {
      const pages = this.props.appsList.total_number_of_pages;
      const current_page = this.props.appsList.current_page;
      filteredKeywords = appsLists[0].tag_keywords

      if (pages > 1) {
        paginationTag = <Pagination ellipsis bsSize="medium" maxButtons={10} onSelect={this.handleSelect} first last next prev boundaryLinks items={pages} activePage={current_page}/>
      }
      appListTemplate = appsLists.map((data, index) => {
        var imageLink = STATIC_URL + "assets/images/" + data.iconName;
        var tagsList = data.tags.map((tagsList, i) => {
          return (
            <li key={i}>
              <a href="#">
                <i className="fa fa-tag"></i>&nbsp;{tagsList.displayName}</a>
            </li>
          )
        });
        return (
          <div class="col-md-4 xs-mb-20" key={index}>
            <div>

              <div className="app-block">
                {/* <Link onClick={this.gotoAppsList.bind(this, data.app_id, data.name,data)} className="app-link" to={data.app_url}> */}
                <Link className="app-link" onClick={this.gotoAppsList.bind(this, data.app_id, data.name,data)} to={data.app_url.replace("/models","") + "/modeSelection"}>
                  <div className="col-md-4 col-sm-3 col-xs-5 xs-p-20">
                    <img src={imageLink} className="img-responsive"/>
                  </div>
                  <div className="col-md-8 col-sm-9 col-xs-7">
                    <h4>
                      {data.displayName}
                    </h4>
                    <p>
                      {data.description}
                    </p>
                  </div>
                  <div class="clearfix"></div>
                </Link>

                <div className="card-footer">
                  <ul className="app_labels">
                    {tagsList}
                  </ul>

                  <div id="myPopover" className="pop_box hide">
                    <p>Info</p>
                  </div>
                </div>
              </div>

            </div>
            <div className="clearfix"></div>
          </div>
        )
      });
      filterListTemplate = appsLists[0].tag_keywords.map((tag, i) => {
        const dId = "chk_mes1_" + i;
        let checked = false
        if (this.props.app_filtered_keywords.indexOf(tag) > -1)
          checked = true
        return (
          <li key={i} className="xs-pl-10">

            <div key={i} className="ma-checkbox inline">
              <input id={dId} type="checkbox" name={tag} checked={checked} onClick={this.handleCheckboxChange.bind(this)}/>
              <label htmlFor={dId}>{tag}</label>
            </div>
          </li>
        )

      });
    }
    else{
      if (appsLists != undefined && appsLists.length == 0) {
        if(top3.length > 0){
          filterListTemplate = top3[0].tag_keywords.map((tag, i) => {
            const dId = "chk_mes1_" + i;
            let checked = false
            if (this.props.app_filtered_keywords.indexOf(tag) > -1)
            checked = true
            return (
              <li key={i} className="xs-pl-10">
              <div key={i} className="ma-checkbox inline">
              <input id={dId} type="checkbox" name={tag} checked={checked} onClick={this.handleCheckboxChange.bind(this)}/>
              <label htmlFor={dId}>{tag}</label>
              </div>
              </li>
            )
          });
        }
        appListTemplate =  <div><br/><div className="text-center text-muted xs-mt-50"><h2>No results found..</h2></div></div>

      }else{
        return(<div>
        <img id="loading" src={STATIC_URL + "assets/images/Preloader_2.gif"}/>
      </div>)
      }
    }
    return (
      <div className="side-body">

        <div class="page-head">

          <div class="row">
            <div class="col-md-7">
              <h3 className="xs-mt-0 nText">Apps</h3>
            </div>
            <div class="col-md-5">
              <div class="btn-toolbar pull-right">
                <div class="input-group">
                  <div className="search-wrapper">
                    <form>
                      <input type="text" name="search_apps" onKeyPress={this._handleKeyPress.bind(this)} onChange={this.onChangeAppsSearchBox.bind(this)} title="Search Apps..." id="search_apps" className="form-control search-box" placeholder="Search Apps..." required/>
                      <span className="zmdi zmdi-search form-control-feedback"></span>
                      <button className="close-icon" type="reset" onClick={this.handleSearchReset.bind(this)}></button>
                    </form>
                  </div>
                </div>
                <div class="btn-group">
                  <button type="button" title="Sorting" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
                    <i className="zmdi zmdi-hc-lg zmdi-sort-asc"></i>
                  </button>
                  <ul role="menu" class="dropdown-menu dropdown-menu-right">
                    <li>
                      <a href="#" onClick={this.handleSorting.bind(this, 'name', 'asc')}>
                        <i class="zmdi zmdi-sort-amount-asc"></i>
                        &nbsp;Name Ascending</a>
                    </li>
                    <li>
                      <a href="#" onClick={this.handleSorting.bind(this, 'name', '-')}>
                        <i class="zmdi zmdi-sort-amount-desc"></i>
                        &nbsp;Name Descending</a>
                    </li>
                    {/*  <li>
                <a href="#" onClick={this.handleSorting.bind(this,'created_at','-')}><i class="fa fa-sort-numeric-asc" aria-hidden="true"></i> Date Ascending</a>
                </li>*/}
                  </ul>
                </div>
                    
                <div class={this.props.app_filtered_keywords.length>0? "btn-group selected":"btn-group"}>

                  {/*<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown"><i class="fa fa-filter fa-lg"></i> <span class="caret"></span></button>

                <ul role="menu" class="dropdown-menu dropdown-menu-right">
                <li>
                                <input type="text" class="form-control" />

                              </li>
                <li>

				<div className="ma-checkbox inline">
				<input type="checkbox" id="chk_mea0" name="0" class="" value="Finance" />
				<label for="chk_mea0" class="radioLabels">Finance</label>
				</div>

				</li>
				<li className="xs-pl-10">
				<div className="ma-checkbox inline"><input type="checkbox" className="" />
				<label>Marketing</label>
				</div>
				</li>
				<li className="xs-pl-10">
				<div className="ma-checkbox inline"><input type="checkbox" className="" />
				<label>Sales</label>
				</div>
				</li>
                <li className="xs-pl-10">
				<div className="ma-checkbox inline"><input type="checkbox" className="" />
				<label>Operations</label>
				</div>
				</li>*/}
                  <button type="button" title="Filter" class="btn btn-default dropdown-toggle" data-toggle="dropdown">
                    <i class="zmdi zmdi-hc-lg zmdi-filter-list"></i>
                  </button>
                  <ul role="menu" class="dropdown-menu dropdown-menu-right">
                    {/*<li>
                      <input type="text" class="form-control"/>
                    </li>*/}
                    {/*<table id="filterList" className="tablesorter table table-condensed table-hover table-bordered">
                      <thead></thead>
                      <tbody>*/}
                    {filterListTemplate}
                    {/*</tbody>
                    </table>*/}

                    {/*<li>
                <label><input type="checkbox" /> Finance</label>
                </li>
                <li>
                <a href="#"><i class="fa fa-sort-numeric-asc" aria-hidden="true"></i> Date Ascending</a>
                </li>
                <li>
                <a href="#"><i class="fa fa-sort-numeric-desc" aria-hidden="true"></i> Date Descending</a>
                </li>*/}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="main-content">
          <div className="row">
            {appListTemplate}
            <div className="clearfix"></div>
          </div>
          <div className="ma-datatable-footer" id="idSignalPagination">
            <div className="dataTables_paginate">
              {paginationTag}
            </div>
          </div>
        </div>

      </div>
    );

  }
}
