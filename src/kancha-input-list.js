import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@vaadin/vaadin-combo-box/vaadin-combo-box-light.js';
import {TagsInput} from'./tags-input.js';

class KanchaInputList extends TagsInput {
  static get template() {
    return html`
        <style>
          :host {
            display: block;
          }
          .container {
            @apply --layout-vertical;
            @apply --tags-container;
          }
          .tags {
            @apply --layout-horizontal;
            @apply --layout-center;
            @apply --layout-wrap;
          }
          .tag {
            padding: 1px 2px;
            margin: 2px;
            border: 1px solid #999;
            @apply --tags-existing-tag;
          }
          #input {
            @apply --tags-input;
          }
          iron-icon {
            --iron-icon-height: var(--tags-remove-icon-size, 12px);
            --iron-icon-width: var(--tags-remove-icon-size, 12px);
            @apply --tags-remove-icon;
          }
        </style>
      <div class="container">
        <div class="tags">
          <template is="dom-repeat" items="[[tags]]" as="tag">
            <div class="tag">
              <span>[[_getTagName(tag)]]</span>
              <iron-icon
                tabindex="0"
                hidden$="[[noEdit]]"
                icon="kancha-icons:remove"
                on-keydown="_onRemoveKeydown"
                on-tap="_removeTag">
              </iron-icon>
            </div>
          </template>
        </div>
        <vaadin-combo-box-light id="combo" item-label-path="[[itemLabel]]" item-value-path="[[itemValue]]" items="[[options]]"
        selected-item="{{selectedItem}}">
          <div class="input-container">
            <paper-input
              id="input"
              hidden$="[[noEdit]]"
              no-label-float
              label="[[_label]]"
              autofocus$="[[autofocus]]"
              value="{{tag}}">
            </paper-input>
          </div>
        </vaadin-combo-box-light>
      </div>
`;
  }

  static get is() { return 'kancha-input-list'; }
  static get properties() {
      return {
          options:        {   type: Array,    },
          selectedItem:   {   type: Object,   observer: '_selectedObserver',},
          itemValue:      {   type: String,   value: 'value', },
          itemLabel:      {   type: String,   value: 'label', },
      };
  }
  /**
   * Add a tag to the internal array.
   */
  add(tag) {
    this.push('tags', tag);
    this._fire('tag-added', tag);
  }
  /**
   * Remove a tag from the tags array, and returns it to the options array
   */
  _removeTag(e) {
    const { index } = e.model;
    const currObject = this.tags[index];
    this.remove(index);
    this.push('options', currObject);
    this.focus();
  }
  /**
  * Observer when item is selected
  */
  _selectedObserver(newValue) {
    if(newValue) {
      // Get the selected value
      const value = this.$.combo._getItemValue(this.selectedItem);
      // Add name to array
      this.add(newValue);
      // Remove seleted item, to reset input
      this.selectedItem = null;
      // Reset input value
      this.tag = '';
      // Remove selected option from array
      this.options = this.options.filter(n => n.value != value)
    }
  }
  /**
  * Print tag name with given label name
  */
  _getTagName(tag) {
    const { itemLabel } = this;
    return tag[itemLabel];
  }
}

window.customElements.define(KanchaInputList.is, KanchaInputList);
