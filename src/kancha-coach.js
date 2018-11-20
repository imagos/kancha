import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@vaadin/vaadin-date-picker/vaadin-date-picker.js';
import '@vaadin/vaadin-combo-box/vaadin-combo-box.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-styles/typography.js';
import './kancha-visit.js';

class KanchaCoach extends PolymerElement {
  static get properties() {
    return {
      visitDate:    { type: String, notify:  true},
      teamName:    { type: String, notify:  true},
      teams: {
        type: Array,
        notify: true,
        value:[]
      },
      pulseRange: {
        type:   Array,
        notify: true,
      },
      weatherRange: {
        type:   Array,
        notify: true,
      },
      userUid: {
        type: String,
        notify: true
      },
    };
  }

  static get template() {
    return html`
    <style>
      :host {
        @apply --paper-font-common-base;
        @apply --paper-tab;
      }
    .container {
        width: 100%;
        margin: 0px;
        padding: 0px;
    }
    .label{
        @apply --paper-font-body1;
        vertical-align: top;
    }

    </style>
    <div class="container">
        <div class="container left">
            <vaadin-date-picker id="visitDate" style="width:40%;" required=true value={{visitDate}}>
            </vaadin-date-picker>
            <vaadin-combo-box id="teamSel" style="width:45%;" placeholder="Team" value={{teamName}}></vaadin-combo-box>
            <paper-icon-button icon="search" on-click="loadCoachesActivities">
            </paper-icon-button>
        </div>
        <div id="textPaperDialog">
        </div>
    </div>
    `;
  }
    loadTeams(teams,_visitDate){
      this.$.teamSel.items=teams;
      this.visitDate=_visitDate;
    }
    _createVisit(data,id){
      var elem=document.createElement('kancha-visit');
      var _row=data;
      _row.pulseDesc = this._getNameArray(1,data.pulse);
      _row.weatherDesc = this._getNameArray(2,data.weather);
      elem.visit=_row;
      elem.visitId=id;
      elem.userUid = this.userUid;
      this.$.textPaperDialog.appendChild(elem);
    }
  _loadlistReport(){
    var self=this;
    db.settings({timestampsInSnapshots: true});
    if(self.$.teamSel.selectedItem == null){
        db.collection("visits").where("date","==",self.visitDate)
          .get()
          .then(function(querySnapshot) {
              querySnapshot.forEach(function(doc) {
                self._createVisit(doc.data(),doc.id);
              });
          })
          .catch(function(error) {
              console.log("Error getting Visit Report: ", error);
          });        
    }else{
        db.collection("visits").where("date","==",self.visitDate).where("teamId","==",self.$.teamSel.selectedItem.value)
          .get()
          .then(function(querySnapshot) {
              querySnapshot.forEach(function(doc) {
                self._createVisit(doc.data(),doc.id);
              });
          })
          .catch(function(error) {
              console.log("Error getting Visit Report: ", error);
          });
    }

  }
  
  loadlistPulse(){
    var self=this;
    db.settings({timestampsInSnapshots: true});
    this.pulseRange=[];
    db.collection("pulseRange").orderBy("value","asc")
      .get()
      .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              var item={};
              item.id     = doc.data().value;
              item.name   = doc.data().name;
              item.description  = doc.data().description;
              self.pulseRange.push(item);
          });
          
      })
      .catch(function(error) {
          console.log("Error getting Pulse range: ", error);
      });
  }
  
  loadlistWeather(){
    var self=this;
    db.settings({timestampsInSnapshots: true});
    this.weatherRange=[];
    db.collection("weatherRange").orderBy("value","asc")
      .get()
      .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              var item={};
              item.id     = doc.data().value;
              item.name   = doc.data().name;
              item.description  = doc.data().description;
              self.weatherRange.push(item);
          });
          
      })
      .catch(function(error) {
          console.log("Error getting Weather Range: ", error);
      });
  }
  
  loadCoachesActivities(){
    var table=this.$.textPaperDialog;
    table.innerHTML="";
    this._loadlistReport();
  }
  
  //1==> pulseRange | 2==> weatherRange
  _getNameArray(_type,_value){
    let _obj={};
    if(_type==1){
      _obj=this.pulseRange.find(_obj => _obj.id === _value);
    }else if(_type==2){
      _obj=this.weatherRange.find(_obj => _obj.id === _value);
    }
    if(_obj===undefined){
      return '';
    }
    return _obj.name;
  }
}
customElements.define('kancha-coach', KanchaCoach);