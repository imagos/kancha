import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class KanchaSlider extends PolymerElement {
  static get properties() {
    return {
      _value:     { type: Number, notify: true, value:1 },
      min:        { type: Number, notify: true, value:1 },
      max:        { type: Number, notify: true, value:5 },
      knobradius: { type: Number, notify: true },
      disabled:   { type: Boolean, notify: true, value:false }
    };
  }

  static get template() {
    return html`
    <style>
      .slidecontainer {
          width: 100%;
      }
      
      .slider {
          -webkit-appearance: none;
          width: 150px;
          height: 20px;
          border-radius: 10px;
          background: #d3d5d5;
          outline: none;
          opacity: 0.7;
          -webkit-transition: .2s;
          transition: opacity .2s;
      }
      
      .slider:hover, .slider:active {
          opacity: 1;
      }
      
      .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 35px;
          height: 35px;
          border-radius: 10px;
          box-shadow: -3px 2px black;
          background: #0051a3;
          cursor: pointer;
      }
      
      .slider::-moz-range-thumb {
          width: 35px;
          height: 35px;
          border-radius: 10px;
          box-shadow: -3px 2px black;
          background: #0051a3;
          cursor: pointer;
      }
    </style>
    
    <div class="slidecontainer">
      <input type="range" min=[[min]] max=[[max]] value="{{_value::input}}" class="slider" id="range">
    </div>
    `;
  }
  
  
}
customElements.define('kancha-slider', KanchaSlider);

