import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-styles/typography.js';

class KanchaSliderH extends PolymerElement {
  static get properties() {
    return {
      _value:     { type: Number,   notify: true, value:1,  reflectToAttribute: true, observer: '_valueChanged' },
      min:        { type: Number,   notify: true, value:1 },
      max:        { type: Number,   notify: true, value:5 },
      disabled:   { type: Boolean,  notify: true, value:false },
      limits:     { type: Array,    notify: true, value: []},
      icon:       { type: String,   notify: true, value: 'favorite'},
      title:      { type: String,   notify: true}
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
    .width_50{
        width: 49%;
        margin: 0px;
        padding: 0px;
        display: inline-block !important;
    }
    input[type=range] {
      /*height: 40px;*/
      -webkit-appearance: none;
      margin: 5px 0;
      width: 100%;
    }
    input[type=range]:focus {
      outline: none;
    }
    input[type=range]::-webkit-slider-runnable-track {
      width: 100%;
      height: 9px;
      cursor: pointer;
      animate: 0.2s;
      box-shadow: 0px 0px 0px #000000;
      background: #DDDCE6;
      border-radius: 8px;
      border: 0px solid #000000;
    }
    input[type=range]::-webkit-slider-thumb {
      box-shadow: 0px 0px 2px #bbb;
      border: 1px solid #F56440;
      height: 40px;
      width: 40px;
      cursor: pointer;
      -webkit-appearance: none;
      margin-top: -5px;
    }
    .favorite::-webkit-slider-thumb {
        background-color: #ee6e73 !important;
        -webkit-mask:  url(../images/svg/favorite.svg) no-repeat 50% 50% !important;
        mask: url(../images/svg/favorite.svg) no-repeat 50% 50% !important;
    }
    .cloud::-webkit-slider-thumb {
        background-color: #ee6e73 !important;
        -webkit-mask:  url(../images/svg/cloud-queue.svg) no-repeat 50% 50% !important;
        mask: url(../images/svg/cloud-queue.svg) no-repeat 50% 50% !important;
    }
    .finger::-webkit-slider-thumb {
        background-color: #ee6e73 !important;
        -webkit-mask:  url(../images/svg/finger.svg) no-repeat 50% 50% !important;
        mask: url(../images/svg/finger.svg) no-repeat 50% 50% !important;
    }
    input[type=range]:focus::-webkit-slider-runnable-track {
      background: #DDDCE6;
    }
    input[type=range]::-moz-range-track {
      width: 100%;
      height: 9px;
      cursor: pointer;
      animate: 0.2s;
      box-shadow: 0px 0px 0px #000000;
      background: #DDDCE6;
      border-radius: 8px;
      border: 0px solid #000000;
    }
    input[type=range]::-moz-range-thumb {
      box-shadow: 0px 0px 2px #000000;
      border: 0px solid #F56440;
      height: 40px;
      width: 40px;
      border-radius: 34px;
      background: #FF7847;
      cursor: pointer;
    }
    input[type=range]::-ms-track {
      width: 100%;
      height: 9px;
      cursor: pointer;
      animate: 0.2s;
      background: transparent;
      border-color: transparent;
      color: transparent;
    }
    input[type=range]::-ms-fill-lower {
      background: #DDDCE6;
      border: 0px solid #000000;
      border-radius: 16px;
      box-shadow: 0px 0px 0px #000000;
    }
    input[type=range]::-ms-fill-upper {
      background: #DDDCE6;
      border: 0px solid #000000;
      border-radius: 16px;
      box-shadow: 0px 0px 0px #000000;
    }
    input[type=range]::-ms-thumb {
      margin-top: 1px;
      box-shadow: 0px 0px 2px #000000;
      border: 0px solid #F56440;
      height: 40px;
      width: 40px;
      border-radius: 34px;
      background: #FF7847;
      cursor: pointer;
    }
    input[type=range]:focus::-ms-fill-lower {
      background: #DDDCE6;
    }
    input[type=range]:focus::-ms-fill-upper {
      background: #DDDCE6;
    }
    .title {
      width:  100%;
    }
    </style>
    <div class="container">
      <div class="title">[[title]]</div>
      <div class="width_50">
        <input type="range" min=[[min]] max=[[max]] value="{{_value::input}}" id="range" class$="[[icon]]">
      </div>
      <div class="width_50">
        <div id="label" class="label"></div>
      </div>
    </div>
    `;
  }

  _valueChanged(newValue, oldValue) {
    if(newValue!=undefined && this.limits != undefined){
      var res = this.limits.filter(item => item.id == newValue);  
      if(res === undefined || res.length==0){
        this.$.label.innerHTML=""; 
      }else{
        this.$.label.innerHTML=res[0].name;
      }
    }
  }
}
customElements.define('kancha-slider-h', KanchaSliderH);

