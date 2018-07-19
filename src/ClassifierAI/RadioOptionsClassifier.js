import React, { Component } from 'react';




class RadioOptionsClassifier extends Component {

  componentDidMount(){
  }

  render() {
    let thisF = this;

      let options = thisF.props.options;
      let count = 0;
      let displayOptions = options.map(function(option){
        if(count === 0){
          count++;
          return <div><input type="radio" id={thisF.props.label+ option +  "option"} defaultChecked name={thisF.props.label+"-type"}/>{option}<br/></div>;
        }else{
          return <div><input type="radio" id={thisF.props.label+ option +  "option"} name={thisF.props.label+"-type"}/>{option}<br/></div>;
        }
      });

    // <input type="radio" id="ownHouseAIRAdio" defaultChecked name="ownHouse-type"/>Owns House<br/>

    return (
      <div className="inputAI">
        <p style={{display: "inline-block",width: "200px", textAlign: "left"}}>{this.props.label}</p>
        <div style={{display: "inline-block",width: "190px", textAlign: "left"}}>
          {displayOptions}

        </div>
      </div>
    );
  }
}

export default RadioOptionsClassifier;