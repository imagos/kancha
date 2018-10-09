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
import './shared-styles.js';

class KanchaSensor extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;
          padding: 10px;
        }
      </style>

      <paper-card>
        <div class="card-content">
          Emmentaler or Emmental is a yellow, medium-hard cheese that originated in the area around Emmental, Switzerland. It is one of the cheeses of Switzerland, and is sometimes known as Swiss cheese.
          
          <div id="pulse">
            <h3>Pulse</h3>
            <wired-slider knobradius="15" value="1" min="1" max="5"></wired-slider>
            <paper-tags-input></paper-tags-input>
          </div>
          
          <div id="ground">
            <h3>Ground</h3>
            <wired-slider knobradius="15" value="1" min="1" max="5"></wired-slider>
            <paper-tags-input></paper-tags-input>
          </div>
        </div>
        <div class="card-actions">
          <paper-button>Verificar</paper-button>
          <paper-button>Cancelar</paper-button>
        </div>
      </paper-card>
          
    `;
  }
}

window.customElements.define('kancha-sensor', KanchaSensor);
