import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import { GestureEventListeners } from '@polymer/polymer/lib/mixins/gesture-event-listeners.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@vaadin/vaadin-combo-box/vaadin-combo-box.js';
import './kancha-icons.js';

export class TagsInput extends GestureEventListeners(PolymerElement) {
  static get is() { return 'tags-input'; }
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
            <span>[[tag]]</span>
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
      <paper-input
        id="input"
        hidden$="[[noEdit]]"
        no-label-float
        label="[[_label]]"
        autofocus$="[[autofocus]]"
        minlength="[[minLength]]"
        maxlength="[[maxLength]]"
        on-keydown="_onInputKeydown"
        value="{{tag}}">
      </paper-input>
    </div>
`;
  }

  static get is() { return 'tags-input'; }
  static get properties() {
      return {
          tags:         {   type: Array,    value() { return [] },      notify: true    },
          separator:    String,
          noEdit:       {   type: Boolean,  value: false    },
          autofocus:    {   type: Boolean,  value: false    },
          allowDuplicates: {type: Boolean,  value: false    },
          label: String,
          tagLabel: String,
          minLength: Number,
          maxLength: Number,
          _label:       {   type: String,   computed: '_computeLabel(label, tagLabel, tags.length)'}
      };
  }
      get value() {
        return this.tags;
      }
      _fire(name, data, options = {}) {
        options.detail = data;
        if (options.bubbles === undefined) options.bubbles = true;
        if (options.composed === undefined) options.composed = true;
        this.dispatchEvent(new CustomEvent(name, options));
      }
      /**
       * Add a tag to the internal array.
       */
      add(tag) {
        if (tag
            && (!this.minLength || tag.length >= this.minLength)
            && (!this.maxLength || tag.length <= this.maxLength)
            && (this.allowDuplicates || !this.tags.includes(tag))) {
          this.push('tags', tag);
          this._fire('tag-added', tag);
          return true;
        } else {
          if (this.tag == tag) this.$.input.invalid = true;
          this._fire('tag-denied', tag);
          return false;
        }
      }
      /**
       * Remove a tag by index.
       */
      remove(index) {
        var removed = this.splice('tags', index, 1);
        if (removed.length > 0) this._fire('tag-removed', removed[0]);
      }
      /**
       * Insert tag at index.
       */
      insert(index, tag) {
        if (tag
            && (!this.minLength || tag.length >= this.minLength)
            && (!this.maxLength || tag.length <= this.maxLength)
            && (this.allowDuplicates || !this.tags.includes(tag))) {
          this.splice('tags', index, 0, tag);
          this._fire('tag-inserted', tag);
          return true;
        } else {
          if (this.tag == tag) this.$.input.invalid = true;
          this._fire('tag-denied', tag);
          return false;
        }
      }
      /**
       * Give focus to the underlying input.
       */
      focus() {
        this.$.input.$.input.focus();
      }
      _removeTag(e) {
        // console.log('onremove', e, tag);
        this.remove(e.model.index);
        this.focus();
      }
      _onRemoveKeydown(e) {
        if (e.keyCode === 13 || e.keyCode === 32) {  // enter or space
          this._removeTag(e);
        }
      }
      _onInputKeydown (e) {
        // console.log('keydown:', e.key, e.keyCode, this._separatorKeyCode);
        this.$.input.invalid = false;
        if ((this.separator && this.separator === e.key)
          || (!this.separator
            && (e.keyCode == 9   || e.key == 'Tab'          // tab
              || e.keyCode == 13 || e.key == 'Enter'        // enter
              || e.keyCode == 19 || e.key == 'Pause'        // pause/break
              || e.keyCode == 27 || e.key == 'Escape'       // esc
              || e.keyCode == 32 || e.key == ' '))) {       // space
          var tag = this.tag.trim();
          if (tag) {
            e.preventDefault();
            // console.log('onadd', e, tag);
            this.tag = this.add(tag) ? '' : tag.trim();
            this.focus();
          }
        }
      }
      _computeLabel(label, tagLabel, len) {
        return len == 0 ? (label || tagLabel) : tagLabel;
      }

}

window.customElements.define(TagsInput.is, TagsInput);
