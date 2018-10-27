import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';

class KanchaSlider extends PolymerElement {
  static get properties() {
    return {
      _value:     { type: Number, notify: true, value:1,  reflectToAttribute: true, observer: '_valueChanged' },
      min:        { type: Number, notify: true, value:1 },
      max:        { type: Number, notify: true, value:5 },
      knobradius: { type: Number, notify: true },
      disabled:   { type: Boolean, notify: true, value:false },
      limits:     { type: Array, notify:  true}
    };
  }

  static get template() {
    return html`
    <style>
      $slider-thumb-size: 50px;
      .container{
        width: 3.5em;
      }
      .slidecontainer {
        float: left;
        position: relative;
        margin: 0 .5em .5em;
        padding: .5em;
        height: 5.5em;
        width: 1.5em;
      }
      
      [type='range'] {
        position: absolute;
        top: 50%;
        left: 50%;
        margin: 0px;
        padding: 0;
        width: 5.5em;
        height: 1.5em;
        transform: translate(-50%, -50%) rotate(-90deg);
        background: transparent;
        font: 1em/1 arial, sans-serif;
      }
      [type='range'], [type='range']::-webkit-slider-thumb {
        -webkit-appearance: none;
      }
      [type='range']::-webkit-slider-runnable-track {
        box-sizing: border-box;
        border: none;
        width: 5.5em;
        height: 0.25em;
        background: #ccc;
      }
      [type='range']::-moz-range-track {
        box-sizing: border-box;
        border: none;
        width: 5.5em;
        height: 0.25em;
        background: #ccc;
      }
      [type='range']::-ms-track {
        box-sizing: border-box;
        border: none;
        width: 5.5em;
        height: 0.25em;
        background: #ccc;
      }
      [type='range']::-webkit-slider-thumb {
        margin-top: -0.625em;
        box-sizing: border-box;
        border: none;
        width: 1.5em;
        height: 1.5em;
        border-radius: 50%;
        background: #0051a3;
      }
      [type='range']::-moz-range-thumb {
        box-sizing: border-box;
        border: none;
        width: 1.5em;
        height: 1.5em;
        border-radius: 50%;
        background: #f90;
      }
      [type='range']::-ms-thumb {
        margin-top: 0;
        box-sizing: border-box;
        border: none;
        width: 1.5em;
        height: 1.5em;
        border-radius: 50%;
        background: #f90;
      }
      [type='range']::-ms-tooltip {
        display: none;
      }
      
      .slider:hover, .slider:active {
        opacity: 1;
      }
      

    </style>
    <div class="container">
      <div>
        <div class="slidecontainer">
          <input type="range" min=[[min]] max=[[max]] value="{{_value::input}}" id="range">
        </div>
      </div>
      <div id="label"></div>
    </div>
    `;
  }
  
  _valueChanged(newValue, oldValue) {
    if(newValue!=undefined && this.limits != undefined){
      let res = this.limits.filter(item => item.id == newValue);  
      this.$.label.innerHTML=res[0].name;
    }
  }
}
customElements.define('kancha-slider', KanchaSlider);

