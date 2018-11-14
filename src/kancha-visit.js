import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/maps-icons.js';
import '@polymer/iron-icons/image-icons.js';
import '@polymer/iron-icons/social-icons.js';

class KanchaVisit extends PolymerElement {
  static get properties() {
    return {
      visit:  { type: Object, notify: true },
    };
  }

  static get template() {
    return html`
    <style>
      :host {
        @apply --paper-font-common-base;
      }
    .container {
      margin-left: 8px;
      padding: 2px 3px 3px 3px;
      margin-bottom: 4px;
      border-radius: 10px;
      color: #4a5055;
      background-color: #fff;
      border-color: #d6e9c6;
      text-align: left;
      border-style: groove;
      border-width: 2px;
    }

    </style>
    <div class="container">
        <div><iron-icon icon="date-range"></iron-icon> [[visit.date]] - N°  [[visit.corrVisit]]  </div>
        <div>
            <iron-icon icon="social:group"></iron-icon> [[visit.teamName]]   - <b>Stage:</b> [[visit.stage]]
        </div>
        <div>  
            <iron-icon icon="favorite"></iron-icon> [[visit.pulse]] - [[visit.pulseDesc]]
            <br>
            <b>Tags:</b> [[_array2Paragraph(visit.tagPulse)]]
        </div>
        <div>  
            <iron-icon icon="image:healing"></iron-icon> [[_array2Paragraph(visit.intervention)]]
        </div>
        <div>  
            <iron-icon icon="cloud"></iron-icon> [[visit.weather]] - [[visit.weatherDesc]]
            <br>
            <b>Tags:</b> [[_array2Paragraph(visit.tagWeather)]]
        </div>
        <div>
            <iron-icon icon="accessibility"></iron-icon> [[visit.userEmail]]
        </div>
        
    </div>
    `;
  }
    _array2Paragraph(arr){
        if(arr == undefined || arr.length==0 ){
            return '';
        }else{
            return arr.join(' | '); 
        }
    }
    
}
customElements.define('kancha-visit', KanchaVisit);

