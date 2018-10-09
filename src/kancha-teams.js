
import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@vaadin/vaadin-date-picker/vaadin-date-picker.js';
import './kancha-sensor.js';
import './shared-styles.js';

class KanchaTeams extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;
          padding: 10px;
        }
      </style>
      
      <vaadin-date-picker id="visitDate" label="Fecha de la Visita" placeholder="Seleccione">
      </vaadin-date-picker>
      <select id="areaSel" size="1">
      	<option value="" selected="selected">-- Select Country --</option>
      </select>
      <select id="teamSel" size="1">
          <option value="" selected="selected">-- Select State--</option>
      </select>
      <kancha-sensor id="sensor"></kancha-sensor>
    `;
  }
  
  loadlistAreas(){
    var self=this;
    db.settings({timestampsInSnapshots: true});
    db.collection("areas").where("status", "==", true)
      .get()
      .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
              // doc.data() is never undefined for query doc snapshots
              console.log(doc.id, " => ", doc.data().name);
              self.areaSel.options[self.areaSel.options.length] = new Option(doc.id, doc.data().name);
          });
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });
  }
}

window.customElements.define('kancha-teams', KanchaTeams);
