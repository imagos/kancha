/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-toast/paper-toast.js';
import '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/iron-icons/maps-icons.js';
import './kancha-slider.js';
import './kancha-slider-h.js';
import './kancha-tags-input.js';
import './kancha-input-list.js';

class KanchaSensor extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles">
        /* Font families */
        --lumo-font-family: -apple-system, BlinkMacSystemFont, "Roboto", "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe 
        /* Font sizes */
        --lumo-font-size-s: .875rem;
        
        :host {
          display: block;
          padding: 1px 2px 0 2px;
        }
        .title{
          font-weight: 500;
          font-size: var(--lumo-font-size-s);
        }
        .button_verify{
          background-color: blue;
          color: white;
        }
        .button_cancel{
          background-color: gray;
          color: white;
        }
        .left{
          text-align:left;
        }
        .subcontainer{
          margin: 0px !important;
          padding: 0px !important;
        }
        .yellow-button {
          text-transform: none;
          color: #eeff41;
        }
        paper-card {
          width: 100%;
          border-radius: 10px;
        }
        .card-actions{
          text-align: center;
        }
        .display_inline{
          display: inline-block !important;
        }
        .title_slider{
          width:20% !important;
          margin: 0px !important;
          padding: 5px 0 !important;
          height: 50px;
          vertical-align: top;
        }
        .content_slider{
          width:75% !important;
          margin: 0px !important;
          padding: 5px 0 !important;
          text-align: center;
          height: 50px;
        }
        .msg_basic{
          margin-left: 5px;
          padding: 2px 3px 3px 3px;
          margin-bottom: 3px;
          border-radius: 10px;
        }
        .msg_error{
          color: #a94442;
          background-color: #f2dede;
          border-color: #ebccd1;
        }
        .msg_success{
          color: #3c763d;
          background-color: #dff0d8;
          border-color: #d6e9c6;
        }
        .msg_info {
          color: #31708f;
          background-color: #d9edf7;
          border-color: #bce8f1;
        }
        #close {
            float:right;
            display:inline-block;
            padding:2px 5px;
            background:#ccc;
        }
        .msg_warning{
          color: #8a6d3b;
          background-color: #fcf8e3;
          border-color: #faebcc;
        }    
        .width_15{
          width: 15%
        }
        .width_65{
          width: 65%
        }
        .width_80{
          width: 80%
        }
        .width_90{
          width: 90%
        }
        .width_5{
          width: 5%
        }
        .help_icon{
          width: 15%
        }
        .hashtag{
          width: 70%
        }
        .margin_auto{
          margin: auto;
        }
        .vertical {
          vertical-align: top;  
        }
        
        .favorite{
          background: #ee6e73 !important;
        }
        .margin_bottom{
          margin-bottom: 17px;
        }
        
        .dots:after {
          content: '\\2807';
          font-size: 2em;
        }
        .card-content-padding{
          padding: 2px !important;
          margin: 1px !important;
        }
        .pulse {
          border-radius: 50%;
          background: #26a69a;;
          color: #fff;
          cursor: pointer;
          box-shadow: 0 0 0 rgba(204,169,44, 0.4);
          animation: pulse 2s infinite;
        }
        .pulse:hover {
          animation: none;
        }
        
        @-webkit-keyframes pulse {
          0% {
            -webkit-box-shadow: 0 0 0 0 rgba(204,169,44, 0.4);
          }
          70% {
              -webkit-box-shadow: 0 0 0 10px rgba(204,169,44, 0);
          }
          100% {
              -webkit-box-shadow: 0 0 0 0 rgba(204,169,44, 0);
          }
        }
        @keyframes pulse {
          0% {
            -moz-box-shadow: 0 0 0 0 rgba(204,169,44, 0.4);
            box-shadow: 0 0 0 0 rgba(204,169,44, 0.4);
          }
          70% {
              -moz-box-shadow: 0 0 0 10px rgba(204,169,44, 0);
              box-shadow: 0 0 0 10px rgba(204,169,44, 0);
          }
          100% {
              -moz-box-shadow: 0 0 0 0 rgba(204,169,44, 0);
              box-shadow: 0 0 0 0 rgba(204,169,44, 0);
          }
        }
      </style>
      <paper-dialog id="pdMessage" modal=true>
        <h2>Kancha says:</h2>
        <paper-dialog-scrollable>
          [[message]]
        </paper-dialog-scrollable>
        <div class="buttons">
          <paper-button dialog-confirm autofocus on-tap="_closeMessage" >Accept</paper-button>
        </div>
      </paper-dialog>
      
      <div hidden$=[[!visibleSensor]]>
        <paper-card>
          <div class="card-content card-content-padding">
            <div class="margin_auto">
              <div class="display_inline width_90">
                <vaadin-combo-box id="stageList" required=true></vaadin-combo-box>
              </div>
              <div class="display_inline width_5"> 
                <div class="dots" on-tap="openTipsStage"></div>
              </div>
            </div>
            <div class="margin_auto">
              <div class="display_inline vertical width_90">
                <kancha-slider-h id="pulseSlider" limits=[[pulseRange]] _value={{pulseSlider}}></kancha-slider-h>
              </div>
              <div class="display_inline width_5"> 
                <div class="dots" on-tap="openTipsPulse"></div>
              </div>
            </div>
            <div class="margin_auto">
              <div class="display_inline vertical width_90">
                <kancha-tags-input id="tagPulse" title="Pulse" required=true placeholder="context#element.situation">
                </kancha-tags-input>
              </div>
            </div>

            <div class="margin_auto">
              <div class="display_inline width_90">
                <kancha-tags-input id="intervention" required=true title="Interventions" placeholder="example: #training">
                </kancha-tags-input>
              </div>
              <div class="display_inline vertical width_5"> 
                <div class="dots" on-tap="openTipsIntervention"></div>
              </div>
            </div>
            
            <div class="margin_auto">	
            	<div class="display_inline vertical width_90">
              	 <kancha-slider-h id="weatherSlider" limits=[[weatherRange]] _value={{weatherSlider}} icon="cloud"></kancha-slider-h>
            	</div>
              <div class="display_inline vertical width_5"> 
                <div class="dots" on-tap="openTipsWeather"></div>
              </div>
            </div>
            <div class="margin_auto">
            	<div class="display_inline vertical width_90">
                <kancha-tags-input id="tagWeather" required=true title="Environment" placeholder="element.situation">
                </kancha-tags-input>          	    
            	</div>
            </div>
          </div>
          
          <div class="card-actions" hidden$=[[hiddenBtnSubmit]]>
            <paper-button class="button_verify" on-click="saveVisit"  >Save</paper-button>
            <paper-button class="button_cancel" on-click="reset">Cancel</paper-button>
          </div>
          
        </paper-card>
        <paper-toast id="toastConfirmation" text="Visit registered">
        </paper-toast>
        <paper-dialog id="pdTips">
          <h2>Tips</h2>
          <paper-dialog-scrollable>
            <table id="textPaperDialog">
            </table>
          </paper-dialog-scrollable>
          <div class="buttons">
            <paper-button dialog-confirm autofocus>Accept</paper-button>
          </div>
        </paper-dialog>
      <div>
    `;
  }
  
  static get properties() {
    return {
      visibleSensor: {
        type: Boolean,
        reflectToAttribute: true,
        notify: true,
        value: false,
        observer: '_resetIdVisit'
      },
      teamId: {
        type: String,
        notify: true
      },
      teamName: {
        type: String,
        notify: true
      },
      date: {
        type: Date,
        notify: true
      },
      userUid: {
        type: String,
        notify: true
      },
      userEmail: {
        type: String,
        notify: true
      },
      pulseRange: {
        type:   Array,
        notify: true,
        reflectToAttribute: true,
      },
      weatherRange: {
        type:   Array,
        notify: true,
        reflectToAttribute: true,
      },
      stageRange: {
        type:   Array,
        notify: true,
        reflectToAttribute: true,
      },
      pulseSuggestions: {
        type:   Array,
        notify: true,
      },
      weatherSuggestions: {
        type:   Array,
        notify: true,
      },
      openMessage:{
        type:   Boolean,
        notify: true,
        value:  false
      },
      message:{
        type:   String,
        notify: true,
        observer: '_messageChanged',
        value: ""
      },
      idVisit:{
        type:   String,
        notify: true
      },
      hiddenBtnSubmit:{
        type:   Boolean,
        notify: true,
        value:  true
      },
      corrVisit :{
        type:   Number,
        notify: true,
        value:  0
      },
      pulseSlider:{
        type:   String,
        notify: true,
        value:  1,
        observer: '_changePulse'
      },
      weatherSlider:{
        type:   String,
        notify: true,
        value:  1,
        observer: '_changeWeather'
      },
    };
  }
  
  ready(){
    super.ready();
    // this.loadlistWeather();
    // this.loadlistPulse();
    // this.loadStage();
    this._loadSuggetions();
    this._loadIntervention();
  }
  
  _changePulse(newValue,oldValue){
    this.hiddenBtnSubmit=false;
  }
  _changeWeather(newValue,oldValue){
    this.hiddenBtnSubmit=false;
  }
  cleanSensor(){
    this.pulseSlider    = 1;
    this.weatherSlider  = 1;
          
    this.$.tagPulse.tags        = [];
    this.$.tagWeather.tags      = [];
    this.$.intervention.tags      = [];
    this.idVisit="";
    this.corrVisit=0;
  }
  
  getVisit(){
    this.cleanSensor();
    var self=this;
    var existsDocuments=false;
    db.settings({timestampsInSnapshots: true});

    //.orderBy("created")
    db.collection("visits").where("teamId", "==", self.teamId).where("date", "==", self.date).where("corrVisit", "<", 100).orderBy("corrVisit","desc").limit(1)
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          var data=doc.data();
          self.pulseSlider    = data.pulse;
          self.weatherSlider  = data.weather;

          self.$.pulseSlider._value   = data.pulse;
          self.$.weatherSlider._value = data.weather;
          
          self.$.tagPulse.tags        = data.tagPulse;
          self.$.tagWeather.tags      = data.tagWeather;
          
          self.$.tagWeather.tags      = data.tagWeather;
          
          self.$.stageList.value      = data.stage;
          self.$.intervention.tags    = data.intervention;
          
          self.corrVisit = data.corrVisit;
          self.idVisit=data.id;
          existsDocuments=true;
          self.message="Ajá! Tenemos una visita registrada de " + data.userEmail; + ". Si tienes algo que aportar es el momento.";    
          self.hiddenBtnSubmit=true;
        });
        
      })
      .catch(function(error) {
        self.message="Error getting documents: "+ error;
        console.info("Error getting documents: "+ error);
      });
      if(!existsDocuments){
        self.message="Tú serás el primero en registrar la visita. Happy coaching!";    
        self.hiddenBtnSubmit=false;
      }
    self.visibleSensor=true;
  }
  
  reset(){
    this.visibleSensor=false;
  }
  _closeMessage(){
    this.message="";
  }
  _messageChanged(newValue, oldValue){
    if(newValue.length>0){
      this.$.pdMessage.open();
    }
  }
  
  saveVisit(){
    //Validar que los datos iniciales se encuentren llenos
    var self=this;
    if(self.$.stageList.selectedItem.value == null || self.$.stageList.selectedItem.value == ""){
      self.$.stageList="Faltan Seleccionar el Stage";
      return;
    }    
    if(self.$.tagPulse.tags == null || self.$.tagPulse.tags.length==0){
      self.message="Faltan ingresar detalles en el Pulse";
      self.$.tagPulse.focus();
      return;
    }
    if(self.$.intervention.tags == null || self.$.intervention.tags.length==0){
      self.message="Faltan ingresar los Intervention";
      self.$.tagPulse.focus();
      return;
    }
    // if(self.$.tagWeather.tags == null || self.$.tagWeather.tags.length==0){
    //   self.message="Faltan ingresar los hashtags en el Weather";
    //   self.$.tagWeather.focus();
    //   return;
    // }

    self.corrVisit++;
    db.collection("visits").add({
        teamId:     self.teamId,
        teamName:   self.teamName,
        date:       self.date,
        pulse:      self.$.pulseSlider._value,
        weather:    self.$.weatherSlider._value,
        tagPulse:   self.$.tagPulse.tags,
        tagWeather: self.$.tagWeather.tags,
        userUid:    self.userUid,
        userEmail:  self.userEmail,
        stage:      self.$.stageList.selectedItem.value,
        intervention: self.$.intervention.tags,
        created:    firebase.firestore.Timestamp.now(),
        corrVisit:  self.corrVisit
    })
    .then(function() {
      self.$.toastConfirmation.open();
      self.message="Visita registrada con éxito!";
      //TODO bloquear campos
      self.hiddenBtnSubmit=true;
    })
    .catch(function(error) {
      console.error("Error al registrar su visita: Details: " + error);
      self.message="Error al registrar su visita: Details: " + error;
    });
  }
  
  _resetIdVisit(newValue,oldValue){
    if(!newValue){
      this.idVisit="";
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
  
  _loadSuggetions(){
    var self=this;
    db.settings({timestampsInSnapshots: true});
    this.pulseSuggestions=[];
    this.weatherSuggestions=[];
    db.collection("tagSuggestions").orderBy("name","asc")
      .get()
      .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              var item={};
              item.type     = doc.data().type;
              item.name   = doc.data().name;
              item.description  = doc.data().description;
              if(item.type=="pulse"){
                self.pulseSuggestions.push(item);
              }else if(item.type=="weather"){
                self.weatherSuggestions.push(item);
              }else{
                self.pulseSuggestions.push(item);
                self.weatherSuggestions.push(item);
              } 
          });
          
      })
      .catch(function(error) {
          console.log("Error getting Weather Range: ", error);
      });
  }
  
  loadStage(){
    var self=this;
    db.settings({timestampsInSnapshots: true});
    this.stageRange=[];
    db.collection("tuckManRange")
      .get()
      .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              var item={};
              item.value  = doc.data().name;
              item.label  = doc.data().name;
              item.description  = doc.data().description;
              item.id     = doc.data().value;
              self.stageRange.push(item);
          });
          self.$.stageList.items=self.stageRange;
      })
      .catch(function(error) {
          console.log("Error getting Stage Range: ", error);
      });
  }
  
  _loadIntervention(){
    var self=this;
    db.settings({timestampsInSnapshots: true});
    this.interventionRange=[];
    db.collection("interventionRange")
      .get()
      .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              var item={};
              item.value  = doc.data().name;
              item.label  = doc.data().name;
              item.description  = doc.data().description;
              self.interventionRange.push(item);
          });
          self.$.intervention.options=self.interventionRange;
      })
      .catch(function(error) {
          console.log("Error getting Stage Range: ", error);
      });
  }
  
  _cleanTableTips(array){
    this.$.pdTips.open();
    var table=this.$.textPaperDialog;
    var tableRows = table.getElementsByTagName('tr');
    var rowCount = tableRows.length;
    if (rowCount>0){
      table.innerHTML="";
    }
    array.forEach(function(element) {
      var row = table.insertRow(0);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      if(element.name !=null && element.name!=undefined){
        cell1.innerHTML = "<b>" + element.name + ":<b> " ;
      }else{
        cell1.innerHTML = "<b>" + element.label + ":<b> " ;  
      }
      
      cell2.innerHTML = element.description;
    });
  }
  
  openTipsPulse(){
    this._cleanTableTips(this.pulseRange);
  }
  openTipsWeather(){
    this._cleanTableTips(this.weatherRange);
  }
  openTipsWeatherSug(){
    this._cleanTableTips(this.weatherSuggestions);
  }
  openTipsPulseSug(){
    this._cleanTableTips(this.pulseSuggestions);
  }
  openTipsStage(){
    this._cleanTableTips(this.stageRange);
  }
  openTipsIntervention(){
    this._cleanTableTips(this.interventionRange);
  }
}

window.customElements.define('kancha-sensor', KanchaSensor);
