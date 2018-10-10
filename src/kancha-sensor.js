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
import '@cwmr/paper-tags-input/paper-tags-input.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-toast/paper-toast.js';
import './kancha-slider.js';

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
          padding: 0px 5px 0px 0px !important;
        }
        .content_slider{
          width:75% !important;
          margin: 0px !important;
          padding: 0px !important;
        }
      </style>
      <div hidden$=[[!visible]]>
        <paper-card>
          <div class="card-content">
            <div class="left">
              <div>
                <div class="display_inline title_slider"><span class="title">Pulse:</span></div>
                <div class="display_inline content_slider"><kancha-slider id="pulseSlider"></kancha-slider></div>
              </div>
              <paper-tags-input id="tagPulse"></paper-tags-input>
            </div>
            
            <div class="left">
              <div class="display_inline title_slider"><span class="title">Weather:</span></div>
              <div class="display_inline content_slider"><kancha-slider id="weatherSlider"></kancha-slider></div>
              <paper-tags-input id="tagWeather"></paper-tags-input>
            </div>
          </div>
          
          <div class="card-actions">
            <paper-button class="button_verify" on-click="saveVisit">Regitrar</paper-button>
            <paper-button class="button_cancel" on-click="reset">Cancelar</paper-button>
          </div>
        </paper-card>
        <paper-toast id="toastConfirmation" text="Visit registered">
        </paper-toast>
      <div>
    `;
  }
  
  static get properties() {
    return {
      visible: {
        type: Boolean,
        reflectToAttribute: true,
        notify: true,
        value: false
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
      }
    };
  }
  
  getVisit(){
    var self=this;
    var dateRegister=new Date(self.date);
    db.settings({timestampsInSnapshots: true});
    this.teams=[];
    db.collection("visits").where("teamId", "==", self.teamId).where("userUid", "==", dateRegister)
      .get()
      .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            console.info(doc);
          });
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });
    self.visible=true;
  }
  
  reset(){
    this.visible=false;
  }
  
  saveVisit(){
    //Validar que los datos iniciales se encuentren llenos
    var self=this;
    
    if(self.$.tagPulse.tags.length==0 && self.$.tagWeather.tags.length==0){
      console.error("faltan datos")
      return;
    }
    
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
    })
    .then(function() {
      self.$.toastConfirmation.open();
      console.log("Document successfully written!");
      //bloquear campos
    })
    .catch(function(error) {
      console.error("Error writing document: ", error);
    });
  }
}

window.customElements.define('kancha-sensor', KanchaSensor);
