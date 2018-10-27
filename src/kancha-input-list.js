import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@vaadin/vaadin-combo-box/vaadin-combo-box-light.js';
import './kancha-tags-input.js';

class KanchaInputList extends GestureEventListeners(PolymerElement) {
  static get template() {
    return html`
        <style>
            :host {
                display: block;
            }
            :host[hidden] {
                display: none !important;
            }
            input {
                text-transform: lowercase;
                height: 36px;
                width: auto !important;
                padding-left: 0.5em;
            }
            paper-chip {
                margin: 2px;
                padding-right: 6px;
                cursor: pointer;
            }
            iron-icon {
                --iron-icon-height: 20px;
                --iron-icon-width: 20px;
                color: var(--disabled-text-color);
            }
        </style>
        <vaadin-combo-box-light id="combo" item-label-path="[[itemLabel]]" item-value-path="[[itemValue]]" items="[[options]]" 
        selected-item="{{selectedItem}}">
          <paper-input id="tagList" label=[[title]] placeholder=[[placeholder]] required=[[required]] on-keydown="_onInputKeydown">
              <div slot="prefix">
                  <template is="dom-repeat" items="[[tags]]">
                      <paper-chip selectable="">[[item]] <iron-icon icon="icons:cancel" on-tap="_onTagRemoveTapped"></iron-icon></paper-chip>
                  </template>
              </div>
          </paper-input>
        </vaadin-combo-box-light>
`;
  }

  static get is() { return 'kancha-input-list'; }
  static get properties() {
      return {
          tags: {
              type: Array,
              notify: true,
              value: function() { return []; }
          },
          placeholder:{
              type: String,
              notify: true
          },
          title:{
              type: String,
              notify: true
          },
          required:{
              type: Boolean,
              notify: true,
              value:false
          },
          /**
          * List of options to select from
          */
          options: {
            type: Array,
            value: []
          },
          /**
          * Selected item
          */
          selectedItem: {
            type: Object,
            observer: '_selectedObserver',
          },
          /**
          * Name of options property used as value
          */
          itemValue: {
            type: String,
            value: 'value',
          },
          /**
          * Name of options property used as label
          */
          itemLabel: {
            type: String,
            value: 'label',
          },
      };
  }

  add(tag) {
      if (this.tags === null) {
          this.tags = [];
      }
      
      var trimmedTag = tag.replace(/^\s+/, '').replace(/\s+$/, '');
      if (trimmedTag !== '') {
          var tagIndex = this.tags.indexOf(trimmedTag);
          if (tagIndex === -1) {
              this.push('tags', trimmedTag);
          }
      }
  }
  remove(tag) {
      if (this.tags === null) {
          return;
      }
      var tagIndex = this.tags.indexOf(tag);
      if (tagIndex > -1) {
          this.splice('tags', tagIndex, 1);
      }
  }
    
  _onTagRemoveTapped(e) {
      e.preventDefault();

      this.remove(e.model.item);
  }
  _onInputKeydown(e) {
      if (e.keyCode === 13) {
          this.add(e.target.value.toLowerCase());
          e.target.value = '';
      }
  }
  focus(){
    this.$.tagList.focus();
  }
}

window.customElements.define(KanchaInputList.is, KanchaInputList);
