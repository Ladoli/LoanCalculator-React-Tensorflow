import React, { Component } from 'react';
import {Route} from 'react-router-dom';
import AIInputOption from './AIFiles/AIInputOption';
import swal from 'sweetalert2';



class LoanAI extends Component {

  componentWillMount(){
    let thisF = this;
    if(!thisF.state || !thisF.state.recommendedLoan){
      thisF.setState({recommendedLoan:""});
    }

    if(!thisF.state || !thisF.state.currentLoanBalance){
      thisF.setState({currentLoanBalance:""});
    }
  }



  render() {
    let thisF = this;

    let currentBalance = thisF.state.currentLoanBalance


    let recommendedLoan = this.state.recommendedLoan.split('\n').map(i => {
        return <p key={i}>{i}</p>
    });


    function calculatePreviousLoans(){
      let loanIDParam = document.getElementById("Loan IDAI").value;

      let query = "select SUM(AMT_CREDIT_SUM_DEBT) from bureau b INNER JOIN application_train a ON a.SK_ID_CURR = b.SK_ID_CURR WHERE b.SK_ID_CURR = " + loanIDParam;

      let queryTimeStart = new Date();

        fetch('http://localhost:8000/?query='+query, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }}).then(function(response) {
          let queryTime = (new Date() - queryTimeStart);
          thisF.setState({queryTime: queryTime});
      return response.json();
    })
    .then(function(querRes) {
      console.log(querRes)
      thisF.setState({currentLoanBalance: "Previous loan balance is " + querRes[0]['SUM(AMT_CREDIT_SUM_DEBT)']});
    });

    }

    function calculateLoan() {
      let incomeParam = document.getElementById("IncomeAI").value;
      let chidlrenParam = document.getElementById("Children CountAI").value;
      if(incomeParam){
          fetch('http://localhost:5000/LoanRecommenderAI?income='+incomeParam+'&kids='+chidlrenParam, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }}).then(function(response) {
        return response.json();
      })
      .then(function(prediction){
        if(prediction.prediction < 0){
          thisF.setState({"recommendedLoan":"It is not recommended to approve a loan to this client"});
        }else{
          thisF.setState({"recommendedLoan":"Recommended Loan Amount is " +parseFloat(prediction.prediction).toFixed(2)
          + "\nThe Maximum Recommended Loan Amount is " +parseFloat(prediction.prediction*1.5).toFixed(2)});
          //We use a 50% increase as the max this increases the accuracy to 72% from 50%. Increased accuracy is minimal after this point.
        }
      });
        }else{
          swal({title: "Please fill in all fields"});
        }
    }

    return (
      <div>
        <br/><br/>
        <center>Loan Amount AI</center>
        <br/><br/>
        <Route render={()=><AIInputOption id={"Income"} />}/>
        <br/>
        <Route render={()=><AIInputOption id={"Children Count"} />}/>
        <br/>
        <br/>
        <br/>
        <br/>
        <div style={{textAlign: "center", width: "100%",marginBottm: "30px"}}>
          <div onClick={calculateLoan} id="calculateLoanButton" >Calculate Recommended Loan</div>
        </div>
        <div id="RecommendedLoan">{recommendedLoan}</div>
        <br/>
        <br/>
        <br/>
        <br/>
        <center>Previous Loans</center>
        <br/><br/>
        <Route render={()=><AIInputOption id={"Loan ID"} />}/>
        <div style={{textAlign: "center", width: "100%",marginBottm: "30px"}}>
          <div onClick={calculatePreviousLoans} id="calculatePrevLoanButton" >Calculate Loan Balance</div>
        </div>
        <div id="CurrentLoanBalance" style={{display:"inline-block", width: "100%", textAlign: "center"}}>{currentBalance}</div>

      </div>
    );
  }
}

export default LoanAI;