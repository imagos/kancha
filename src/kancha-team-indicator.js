import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@vaadin/vaadin-date-picker/vaadin-date-picker.js';
import '@polymer/paper-toast/paper-toast.js';
import './kancha-input-list.js';
import './tags-input.js';

class KanchaTeamIndicator extends PolymerElement {
  static get template() {
    return html`
    <style>
        :host{
          text-align: center !important;
          width: 100%;
        }
        paper-icon-button { 
          background-color: #4285f4;
          color: white;
          width: 34px;
          height: 34px;
        }
        .container{
          max-width: 450px;
          text-align: center;
          margin-left: auto;
          margin-right: auto;
        }
        .row {
            width: 100%;
        }
        table, td, tr {
          border: 1px solid gray;
          border-radius: 5px;;
          font-size: 0.9em;
        }
        table {
          width: 100%;
        }
        /*
        .kancha-input-list {
          width: 400px;
          border: 1px solid red;
          padding: 8px;
          --tags-container: {
            background-color: green;
          };
          --tags-existing-tag: {
            background-color: gray;
          };
          --tags-remove-icon: {
            color: white;
          };
          --tags-remove-icon-size: 16px;
          --tags-input: {
            background-color: yellow;
          };
        }*/
    </style>
    <div class="container">
        <div class="row">
          <vaadin-combo-box label="Team" id="teamSel" style="width:70%;" required=true error-message="This field is required" placeholder="Team" value={{teamId}}></vaadin-combo-box>
          <paper-icon-button icon="search"      on-tap="_listTeamIndicators"  id="btnSearch"></paper-icon-button>
          <paper-icon-button icon="add-circle"  on-tap="_createNew"        id="btnNew"></paper-icon-button>
        </div>
        <div class="row" id="listRegisteredIndicators" hidden$=[[hiddenList]]>
          <div class="row">Registered Indicators</div>
          <table id="RegisteredIndicatorsTable">
          </table>
        </div>
        <div class="row" id="newIndicator" hidden$=[[hiddenAdd]]>
          <div class="row">New Indicator</div>
          <div class="row"><vaadin-date-picker id="forecastedDate" style="width:40%;" label="Forecast Date" required=true value={{forecastedDate}} error-message="This field is required"></vaadin-date-picker>
          </div>
          <div class="row"><kancha-input-list id="listIndicators" autofocus label="Indicators" tag-label="Add indicator" options=[[teamIndicators]] class="kancha-input-list"></kancha-input-list>
          </div>
          <paper-icon-button icon="save" on-click="_saveIndicator" id="btnSave" ></paper-icon-button>
        </div>

    </div>
    <paper-toast id="toastConfirmation" text="[[message]]">
    </paper-toast>
    `;
  }
    static get properties() {
      return {
        forecastedDate: {   type: String,   notify: true    },
        teams:        {   type: Array,    notify: true,   value:[]  },
        teamId:       {   type: String,   notify: true    },
        userUid:      {   type: String,   notify: true    },
        userName:     {   type: String,   notify: true    },
        hiddenList:   {   type: Boolean,  notify: true,   value: true    },
        hiddenAdd:    {   type: Boolean,  notify: true,   value: true    },
        message:      {   type: String,   notify: true    },
        teamIndicators:{   type: Array,    value: [{value: 9,	label: 'one',},{value: 10,	label: 'two',},{value: 11, label: 'three',}]   },
      };
    }
    ready(){
      super.ready();
      var self = this;
      var user = firebase.auth().currentUser;
      if (user != null) {
        this.userUid  = user.uid;
        user.providerData.forEach(function (profile) {
          self.userName = profile.displayName || profile.email;
        });
      }
    }
    loadTeams(teams){
      this.$.teamSel.items=teams;
    }
    loadIndicators(teamIndicators){
      this.teamIndicators=teamIndicators;
    }
    _createNew(){
      this.hiddenAdd=false;
      this.hiddenList=true;
    }
    _saveIndicator(){
        var _indicators=this.$.listIndicators.tags;
        if(this.teamId == "" || this.forecastedDate == "" || _indicators == null || _indicators == ""){
          return;
        }
        var teamName=this.$.teamSel.selectedItem.label;
        this._addTeamIndicator(this.teamId,teamName,this.forecastedDate,_indicators);
    }
    _addTeamIndicator(_team,_teamName,_forecastedDate,_indicators){
        var self=this;
        db.collection("forecastedIndicators").add({
            teamId:             _team,
            teamName:           _teamName,
            forecastedDate:     _forecastedDate,
            indicators:         _indicators,
            created:            firebase.firestore.Timestamp.now(),
            userUid:            self.userUid,
            userName:           self.userName,
        })
        .then(function() {
          self.message="Indicators registered successfully!";
          self.$.toastConfirmation.open();
          self._listTeamIndicators();
        })
        .catch(function(error) {
          console.error("Error - Register Indicators: " + error);
        });
    }
    _listTeamIndicators(){
      var self=this;
      var _listItem=[];
      self.hiddenList=true;
      self.hiddenAdd=true;
      db.collection("forecastedIndicators").where("teamId","==",self.teamId).orderBy("forecastedDate")
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              var item={};
              item.teamId           = doc.data().teamId;
              item.teamName         = doc.data().teamName;
              item.forecastedDate   = doc.data().forecastedDate;
              item.indicators       = doc.data().indicators;
              item.created          = doc.data().created;
              item.userName         = doc.data().userName;
              _listItem.push(item);
            });
            self._createRowReport(_listItem);
            self.hiddenList=false;
        })
        .catch(function(error) {
            console.log("Error getting Team Indicators: ", error);
        });
    }
    _createRowReport(_listItem){
      var table=this.$.RegisteredIndicatorsTable;
      var tableRows = table.getElementsByTagName('tr');
      var rowCount = tableRows.length;
      if (rowCount>0){
        table.innerHTML="";
      }
      var row = table.insertRow(-1);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      cell1.innerHTML = "Date";
      cell2.innerHTML = "Indicators";
      cell3.innerHTML = "User";
      _listItem.forEach(function(element) {
        var row = table.insertRow(-1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        cell1.innerHTML = element.teamName ;
        cell1.innerHTML = element.forecastedDate;
        var _listIndicators="";
        element.indicators.forEach(function(indicator) {
          _listIndicators=_listIndicators+", " + indicator.label;
        });
        cell2.innerHTML = _listIndicators;
        cell3.innerHTML = element.userName;
      });
      
    }
}
customElements.define('kancha-team-indicator', KanchaTeamIndicator);

