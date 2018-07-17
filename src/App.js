import React, { Component } from 'react';
import {Route} from 'react-router-dom';
import InputOption from './LoanFiles/InputOption.js';
import swal from 'sweetalert2';





class App extends Component {

  componentDidMount() {
  }

  render() {

    function queryFunction() {
      let output = "";
      let tableName = "application_train";
      let where = "";
      inputQuery("Income", "AMT_INCOME_TOTAL");
      inputQuery("Loan Amount", "AMT_CREDIT");
      inputQuery("Number of Kids", "CNT_CHILDREN");
      inputQuery("Goods Value", "AMT_GOODS_PRICE");
      inputQuery("Annuity", "AMT_ANNUITY");
      inputQuery("Age", "DAYS_BIRTH");
      genderQuery();
      loanSuccessQuery();
      outputQuery("IncomeOut","AMT_INCOME_TOTAL");
      outputQuery("Loan AmountOut","AMT_CREDIT");
      outputQuery("Number of KidsOut","CNT_CHILDREN");
      outputQuery("Goods ValueOut","AMT_GOODS_PRICE");
      outputQuery("AnnuityOut","AMT_ANNUITY");
      outputQuery("IncomeOut","AMT_INCOME_TOTAL");
      outputQuery("AgeOut","DAYS_BIRTH");
      outputQuery("GenderOut","CODE_GENDER");
      outputQuery("LoanOut","TARGET");





      if(output === ""){
        output = "AMT_INCOME_TOTAL,AMT_CREDIT,CNT_CHILDREN,AMT_GOODS_PRICE,AMT_ANNUITY,DAYS_BIRTH,CODE_GENDER,TARGET";
      }

      let query = "SELECT " + output + " FROM " + tableName;
      if(where !== ""){
        query += " WHERE " + where;
      }



      console.log(query)


        fetch('http://localhost:8000/?query='+query, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }}).then(function(response) {
      return response.json();
    })
    .then(function(querRes) {
      document.getElementById("queryResults").innerHTML = querRes;
    });

      function genderQuery(){
        let displayMale = document.getElementById("maleFilter");
        let displayFemale = document.getElementById("femaleFilter");
        if(displayMale.checked){
            if(where !== ""){
              where += " AND CODE_GENDER = 'M' ";
            }else{
              where += "CODE_GENDER = 'M' ";
            }
        }else if(displayFemale.checked){
            if(where !== ""){
              where += " AND CODE_GENDER = 'F' ";
            }else{
              where += "CODE_GENDER = 'F' ";
            }
        }
      }


      function loanSuccessQuery(){
        let displaySuccessLoan = document.getElementById("successLoan");
        let displayProblemLoan = document.getElementById("problemLoan");

        if(displaySuccessLoan.checked){
            if(where !== ""){
              where += "AND TARGET = 0 ";
            }else{
              where = "TARGET = 0 ";
            }
        }else if(displayProblemLoan.checked){
            if(where !== ""){
              where += "AND TARGET = 1 ";
            }else{
              where = "TARGET = 1 ";
            }
        }
      }

      function inputQuery(idInput, attribute){
        let box = document.getElementById(idInput+"Check");

        if(box.checked){
          let operator = document.getElementById(idInput+"Operation").value;
          let value1 = document.getElementById(idInput + "Value").value;
          if(where !== ""){
            if(!value1){
              swal({title:"Missing value for the input: " + idInput});
              return;
            }
            if(operator !== "BETWEEN"){
              where += " AND " + attribute + " " + operator + " " +value1;
            }else{
              let value2 = document.getElementById(idInput + "ToValue").value;
              if(!value2){
                swal({title:"Missing value ceiling for the input: " + idInput});
                return;
              }
              where += " AND " + attribute + " > " +value1 + " AND " + attribute + " < " + value2;
            }
          }else{
            if(!value1){
              swal({title:"Missing value for the input: " + idInput});
              return;
            }
            if(operator !== "BETWEEN"){
              where = attribute + " " + operator + " " +value1;
            }else{
              let value2 = document.getElementById(idInput + "ToValue").value;
              if(!value2){
                swal({title:"Missing value ceiling for the input: " + idInput});
                return;
              }
              where = attribute + " > " +value1 + " AND " + attribute + " < " + value2;
            }
          }
        }
      }

      function outputQuery(idInput, attribute){
        if(document.getElementById(idInput).checked){
          if(output === ""){
            output = attribute;
          }else{
            output += ","+attribute;
          }
        }
      }

    }

    return (
      <div className="container">
        Input Information
        <div className="row">
          <div className="col-xs-12" style={{"width": "100%", "display": "inline-block"}}>
            <div className="col-sm-9 LoanOptionsBox" >
              <Route render={()=><InputOption inputAttr={"Income"}/>}/>
              <Route render={()=><InputOption inputAttr={"Loan Amount"}/>}/>
              <Route render={()=><InputOption inputAttr={"Number of Kids"}/>}/>
              <Route render={()=><InputOption inputAttr={"Goods Value"}/>}/>
              <Route render={()=><InputOption inputAttr={"Annuity"}/>}/>
              <Route render={()=><InputOption inputAttr={"Age"}/>}/>
              {/* <Route render={()=><InputOption inputAttr={"Annuity"}/>}/> */}
            </div>

            <div className="col-sm-3 LoanOptionsBox">
              <input type="radio" defaultChecked name="data-type"/> All loans<br/>
              <input type="radio" name="data-type" id="successLoan" /> Sucessful loans<br/>
              <input type="radio" name="data-type" id="problemLoan" /> Loans with problems<br/>
              <input type="radio" defaultChecked name="gender-type"/>  All Gender<br/>
              <input type="radio" name="gender-type" id="maleFilter"/>  Male<br/>
              <input type="radio" name="gender-type" id="femaleFilter"/>  Female<br/>
            </div>
          </div>
        </div>
        <br/><br/><br/><br/>
        Entry Output Information
        <div className="row">
          <div className="col-xs-12" style={{"width": "100%", "display": "inline-block"}}>
            <div className="col-sm-4 LoanOptionsBox" >
              <input type="checkbox" id="IncomeOut" /> Income<br/>
              <input type="checkbox" id="Loan AmountOut" /> Loan Amount<br/>
              <input type="checkbox" id="Number of KidsOut"/> Number of Kids<br/>
            </div>
            <div className="col-sm-4 LoanOptionsBox">
              <input type="checkbox" id="Goods ValueOut" /> Goods Value<br/>
              <input type="checkbox" id="AnnuityOut" /> Annuity<br/>
              <input type="checkbox" id="LoanOut" /> Loan Result<br/>
            </div>
            <div className="col-sm-4 LoanOptionsBox">
              <input type="checkbox" id="GenderOut" /> Gender<br/>
              <input type="checkbox" id="AgeOut" /> Age<br/>
            </div>
          </div>
        </div>
        <br/><br/><br/><br/>
        Summary Output Information
        <div className="row">
          <div className="col-xs-12" style={{"width": "100%", "display": "inline-block"}}>
            <div className="col-sm-4 LoanOptionsBox" >
              <input type="checkbox" />Income<br/>
              <input type="checkbox" />Loan Amount<br/>
              <input type="checkbox" />Number of Kids<br/>
              <input type="checkbox" />Goods Value<br/>
              <input type="checkbox" />Annuity<br/>
              <input type="checkbox" />Gender<br/>
              <input type="checkbox" />Age<br/>
            </div>
            <div className="col-sm-4 LoanOptionsBox">
              <input type="checkbox" />Max<br/>
              <input type="checkbox" />Minimum<br/>
              <input type="checkbox" />Average<br/>
              <input type="checkbox" />Total<br/>
              <input type="checkbox" />Count<br/>
            </div>
            <div className="col-sm-4 LoanOptionsBox">
              <input type="checkbox" /> Sucessful loans<br/>
              <input type="checkbox" /> Loans with problems<br/>
            </div>
          </div>
        </div>
        <br/>
        <div style={{textAlign: "center", width: "100%"}}>
          <div onClick={queryFunction} style={{textAlign: "center", width: "50px", border: "2px solid", display: "inline-block"}} >Test</div>
        </div>

        <br/>

        <div id="queryResults"></div>
      </div>
    );
  }
}

export default App;
