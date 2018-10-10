
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@vaadin/vaadin-date-picker/vaadin-date-picker.js';
import '@vaadin/vaadin-combo-box/vaadin-combo-box.js';
import '@polymer/paper-button/paper-button.js';
import './kancha-sensor.js';

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
          width: 95%;
        }
        paper-icon-button { 
          background-color: #4285f4;
          color: white;
          width: 34px;
          height: 34px;
        }
      </style>
      <div class="container left">
        <vaadin-combo-box id="teamSel" label="Teams" style="width:  100%;" required=true></vaadin-combo-box>
      </div>
      <div class="container left">
        <vaadin-date-picker id="visitDate" label="Visit date" placeholder="Select" required=true>
        </vaadin-date-picker>
        <paper-icon-button icon="search" on-click="searchVisit"></paper-icon-button>
      </div>
      <div class="subcontainer left">
        <kancha-sensor id="sensor" visible="[[visibleSensor]]"></kancha-sensor>
      </div>
    `;
  }
  
  static get properties() {
    return {
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
      }
    };
  }
  
  loadlistAreas(){
    var self=this;
    db.settings({timestampsInSnapshots: true});
    this.teams=[];
    db.collection("teams").where("status", "==", true)
      .get()
      .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              var item={};
              item.value  = doc.id;
              item.area   = doc.data().area;
              item.label  = doc.data().name;
              self.teams.push(item);
          });
          self.$.teamSel.items=self.teams;
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });
  }
  
  searchVisit(){
    var self=this;+
    console.info(self.$.teamSel.selectedItem);
    if(self.$.teamSel.selectedItem){
      self.$.sensor.teamId=self.$.teamSel.selectedItem.value;
      self.$.sensor.teamName=self.$.teamSel.selectedItem.label;
      self.$.sensor.date=self.$.visitDate.value;
      self.$.sensor.userUid=self.userUid;
      self.$.sensor.userEmail=self.userEmail;
      self.$.sensor.getVisit();
    }else{
      console.log('Sin datos');
    }
  }
}

window.customElements.define('kancha-teams', KanchaTeams);
