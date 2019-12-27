import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import store from "../../store";
import Breadcrumb from 'react-breadcrumb';
import {Card} from "../signals/Card";
import {STATIC_URL} from "../../helpers/env.js";
import {getStockAnalysis,updateStockSlug} from "../../actions/appActions";
import {isEmpty, subTreeSetting} from "../../helpers/helper";
import {hideDataPreview} from "../../actions/dataActions";

@connect((store) => {
  return {signal: store.signals.signalAnalysis};
})

export class AppsStockDocumentMode extends React.Component {
  constructor() {
    super();
    //this.docFlag = true;
  }
  componentWillMount() {
    // alert("in will mount!!!")
    // console.log("in will mount!!!")
    if (isEmpty(this.props.signal)) {
      this.props.dispatch(getStockAnalysis(this.props.match.params.slug))
    }
    // console.log(this.props.signal)
  }

  print() {
    window.print();
  }

  searchTree(_Node, cardLists, lastVar) {
		if (_Node.listOfCards.length!=0&&_Node.listOfCards[_Node.listOfCards.length - 1].slug == lastVar) {
      console.log("cardlist if no cards in node:");
      console.log(cardLists);
      cardLists.push(_Node.listOfCards);
      return cardLists;
    } else {
      var i;
      var result = null;
      cardLists.push(_Node.listOfCards);
      for (i = 0; i < _Node.listOfNodes.length; i++) {
        result = this.searchTree(_Node.listOfNodes[i], cardLists, lastVar);
      }
      //console.log("cardLists is:");
      //console.log(cardLists);
      return result;
    }
  }

  closeDocumentMode(){
    console.log("closing document mode")
    this.props.dispatch(hideDataPreview());
    this.props.history.push("/apps-stock-advisor");
  }
  render() {

    console.log("document mode is called$$$$$$$$$$$$$$!!");
    console.log(this.props);

    let cardList = [];
    if (!isEmpty(this.props.signal)) {
      let lastCard = this.props.history.location.state.lastVar;
      cardList = this.searchTree(this.props.signal, cardList, lastCard);
      console.log("card list is...");
      console.log(cardList);
      let docObj = [];
      for (let card of cardList) {
        console.log("card is:")
        console.log(card);
        for (let _card of card) {
          console.log("_card is :" + _card);
          docObj.push(_card);
        }
      }
      console.log(docObj);
      docObj.splice(0, 1);

      let objs = [];
      docObj.map(function(item, i) {
        let len = item.cardData.length;

        for (var i = 0; i < len; i++) {
          objs.push(item.cardData[i]);

        }

      })
      console.log(objs);
      let firstOverviewSlug = this.props.signal.listOfNodes[0].slug;
      let cardModeLink = "/apps-stock-advisor/" + this.props.match.params.slug + "/" + firstOverviewSlug;

      if (objs) {
        return (
          <div>
            <div className="side-body" id="side-body">
              {/* Page Title and Breadcrumbs */}
              {/*<div className="page-head">
                <div class="row">
                  <div class="col-md-12">
                    <Breadcrumb path={[
                      {
                        path: '/apps-stock-advisor',
                        label: 'Apps-Stock'
                      }, {
                        path: '/apps-stock-document-mode/' + this.props.match.params.slug,
                        label: this.props.signal.name
                      }
                    ]}/>
                  </div>
                </div>
                <div class="clearfix"></div>
              </div>*/}
              {/* Page Content Area */}
              <div className="main-content">
                <div className="row">
                  <div className="col-md-12">

					<h3 class="xs-mt-0">{this.props.signal.name}
                        <div className="btn-toolbar pull-right">
                          <div className="btn-group btn-space">
                            <button className="btn btn-default" type="button" onClick={this.print.bind(this)} title="Print Document">
                            <i class="fa fa-print" aria-hidden="true"></i>
                          </button>
                            <Link className="tabs-control right grp_legends_green continue" to={cardModeLink}>
                              <button type="button" className="btn btn-default" title="Card mode">
                                <i class="zmdi zmdi-hc-lg zmdi-view-carousel"></i>
                              </button>
                            </Link>
                            <button type="button" className="btn btn-default" disabled="true" title="Document Mode">
                              <i class="zmdi zmdi-hc-lg zmdi-view-web"></i>
                            </button>
                            {/*<Link className="tabs-control right grp_legends_green continue" to="/signals">*/}
                              <button type="button" className="btn btn-default" onClick = {this.closeDocumentMode.bind(this)}>
                                <i class="zmdi zmdi-hc-lg zmdi-close"></i>
                              </button>
                            {/*</Link>*/}
                          </div>
                        </div>


						</h3>
						<div className="clearfix"></div>

                    <div className="panel panel-mAd box-shadow">

                      <div className="panel-body no-border documentModeSpacing">
                        <Card cardData={objs}/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
    } else {

      return (
        <div className="side-body">
          <div className="page-head">
            <div class="row">
              {/*<div class="col-md-12">
                <Breadcrumb path={[{
                    path: '/apps-stock-advisor',
                    label: 'Apps-Stock'
                  }
                ]}/>
              </div>*/}
              <div class="col-md-8">
                <h2>{this.props.signal.name}</h2>
              </div>
            </div>
            <div class="clearfix"></div>
          </div>
          <div className="main-content">
            <img id="loading" src={STATIC_URL + "assets/images/Preloader_2.gif"}/>
          </div>
        </div>
      );
    }
  }
}
