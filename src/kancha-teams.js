
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@vaadin/vaadin-date-picker/vaadin-date-picker.js';
import '@vaadin/vaadin-combo-box/vaadin-combo-box.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/paper-tabs/paper-tab.js';
import './kancha-sensor.js';
import './kancha-coach.js';
import './kancha-stats-visits.js';

class KanchaTeams extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;
          padding: 3px;
        }
        .left{
          text-align:left;
        }
        .container{
          display: block;
          margin: 0px 3px 2px 3px;
          padding: 0px 2px 2px 2px;
          width: 95%;
        }
        .subcontainer{
          display: block;
          margin: 0px 0px 2px 0px;
          padding: 0px 0px 2px 0px;
          width: 99%;
        }
        paper-icon-button { 
          background-color: #4285f4;
          color: white;
          width: 34px;
          height: 34px;
        }
      </style>
      <paper-tabs selected="{{selected}}">
        <paper-tab>Sensor</paper-tab>
        <paper-tab>Medical Record</paper-tab>
        <paper-tab>Coaches</paper-tab>
      </paper-tabs>
      <iron-pages selected="{{selected}}">
        <div>
          <div class="container left">
            <vaadin-date-picker id="visitDate" style="width:40%;" required=true value={{dateVisit}}>
            </vaadin-date-picker>
            <vaadin-combo-box id="teamSel" style="width:45%;" required=true placeholder="Team" value={{teamName}}></vaadin-combo-box>
            <paper-icon-button icon="search" on-click="searchVisit"></paper-icon-button>
          </div>
          <div class="subcontainer left">
            <kancha-sensor id="sensor" visible-sensor="{{visibleSensor}}">
            </kancha-sensor>
          </div>
        </div>
        <div>
          <kancha-stats-visits teams=[[teams]] id="statsVisits"></kancha-stats-visits>
        </div>
        <div>
          <kancha-coach teams=[[teams]] coaches=[[coaches]] id="kanchaCoach"></kancha-coach>
        </div>
      </paper-tabs>
    `;
  }
  
  static get properties() {
    return {
      selected:{ 
        value: 0,
        notify: true,
        observer: '_tabChanged'
      },
      userUid:{
        type: String,
        notify: true        
      },
      userEmail: {
        type: String,
        notify: true
      },
      teams: {
        type: Array,
        notify: true,
        value:[]
      },
      visibleSensor:{
        type: Boolean,
        notify: true,
        value: false
      },
      today:{
        type: Date,
        notify: true
      },
      teamName: {
        type: String,
        notify: true,
        observer: '_sensorChanged',
      },
      dateVisit: {
        type: String,
        notify: true,
        observer: '_sensorChanged',
      },
    };
  }
  ready(){
    super.ready();
    this.$.visitDate.value=this._getToday();
  }
  
  _sensorChanged(newValue,oldValue){
    this.visibleSensor=false;
  }
  _getToday(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    
    if(dd<10) {
        dd = '0'+dd
    } 
    
    if(mm<10) {
        mm = '0'+mm
    } 
    
    today = yyyy + '-' + mm + '-' + dd;
    this.dateVisit=today;
    return today;
  }
  
  _tabChanged(newValue, oldValue){
    if(newValue==0){
      this.$.sensor.loadStage();
      this.$.sensor.loadlistWeather();
      this.$.sensor.loadlistPulse();
    } else if(newValue == 1){
      this.$.statsVisits.loadTeams(this.teams);
      this.$.statsVisits.pulseRange = this.$.sensor.pulseRange;
      this.$.statsVisits.weatherRange = this.$.sensor.weatherRange;
      this.$.statsVisits.stageRange = this.$.sensor.stageRange;
    } else if(newValue == 2){
      this.$.kanchaCoach.loadTeams(this.teams,this.dateVisit);
      this.$.kanchaCoach.loadlistWeather();
      this.$.kanchaCoach.loadlistPulse();
    }
  }
  loadlistAreas(){
    var self=this;
    db.settings({timestampsInSnapshots: true});
    this.teams=[];
    db.collection("teams").where("status", "==", true).orderBy("buildingBlock","asc")
      .get()
      .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              var item={};
              item.value            = doc.id;
              item.area             = doc.data().area;
              item.buildingBlock    = doc.data().buildingBlock;
              item.label            = doc.data().name + " | " +  doc.data().buildingBlock;
              self.teams.push(item);
          });
          self.$.teamSel.items=self.teams;
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });
  }
  
  searchVisit(){
    var self=this;
    if(self.$.teamSel.selectedItem && self.$.visitDate.value != "" ) {
      self.$.sensor.teamId=self.$.teamSel.selectedItem.value;
      self.$.sensor.teamName=self.$.teamSel.selectedItem.label;
      self.$.sensor.date=self.$.visitDate.value;
      console.info(self.$.visitDate.value);
      self.$.sensor.userUid=self.userUid;
      self.$.sensor.userEmail=self.userEmail;
      self.$.sensor.getVisit();
    }else{
      console.log('Sin datos');
    }
  }
}

window.customElements.define('kancha-teams', KanchaTeams);
