import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router";
import store from "../../store";
import {showPredictions,handleDecisionTreeTable} from "../../actions/signalActions";
import renderHTML from 'react-render-html';

@connect((store) => {
  return { selPrediction: store.signals.selectedPrediction};
})

export class PredictionDropDown extends React.Component {
  constructor(props){
    super(props);
  }
  
  componentWillMount(){
	  var sel= null;
	  var data = this.props.jsonData;
      sel= data[0].name;
	 this.props.dispatch(showPredictions(sel));  
  }
  
 checkSelection(e){
	 console.log("change predictive dropdown");
	  var sel =$('#prediction_dropdown').val();
	 this.props.dispatch(showPredictions(sel));
	 handleDecisionTreeTable();
 }
 
  render() {
   var data = this.props.jsonData;
   var optionsTemp =[], desc=""; // ulHead ="";
   console.log("prediction dropdown component");
   for (var prop in data) {
        optionsTemp.push(<option key={prop} className={prop} value={data[prop].name}>{data[prop].displayName}</option>);
    }
	/*if(this.props.selPrediction){
		
		for (var prop in data) {
			if(prop == this.props.selPrediction){
				//ulHead =  prop;
				data[prop].forEach(function(item){
				 //desc+='<li>'+data[prop]+'</li>';
				 desc+='<li>'+item+'</li>';
				});
				 break;
			}
           
      }
	}*/

  
  
   
   return (
          <div> <div className="clearfix"></div>
           <div className="row">
           <div className="col-md-10">
           <div className="form-group">
           <label class="col-md-3 col-md-offset-1 control-label" for="rulesFor">{this.props.label} :</label>
		    <select id="prediction_dropdown" name="selectbasic" class="form-control" onChange={this.checkSelection.bind(this)}>
				{optionsTemp}
				</select>
			{/*<div className="prediction_li">	
			<br/>
			<ul>
			  {renderHTML(desc)}
			</ul>
			</div>*/}
		   </div></div>
		   </div></div>
       );
  }
}
