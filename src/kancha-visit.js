import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/maps-icons.js';
import '@polymer/iron-icons/image-icons.js';
import '@polymer/iron-icons/social-icons.js';
import './kancha-sensor.js';

class KanchaVisit extends PolymerElement {
  static get properties() {
    return {
      visitId: {
        type: String,
        notify: true
      },
      visit:  { type: Object, notify: true },
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
    .display_inline{
      display: inline-block;
    }
    .left{
      text-align:left;
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
    <div id="container" class="container">
        <div>
          <div class="display_inline"><iron-icon icon="date-range"></iron-icon> [[visit.date]] - N°  [[visit.corrVisit]]  </div>
          <div class="display_inline">
            <template is="dom-if" if="{{_validateUser(visit.userUid)}}">
              <paper-icon-button icon="image:edit" class="" on-click="_loadVisit">
              </paper-icon-button>
            </template>
          </div>
        </div>
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
    <div class="subcontainer left" id="sensor">
    </div>
    `;
  }
    _validateUser(_userUid){
      if(this.userUid == _userUid){
        return true;
      }
      return false;
    }
    _array2Paragraph(arr){
        if(arr == undefined || arr.length==0 ){
            return '';
        }else{
            return arr.join(' | '); 
        }
    }
    _loadVisit(){
      this.$.sensor.innerHTML="";
      var elem=document.createElement('kancha-sensor');
      elem.getVisit(this.visitId);
      elem.visibleSensor=true;
      elem.activeUpdate =true;
      this.$.sensor.appendChild(elem);
    }
    
}
customElements.define('kancha-visit', KanchaVisit);

