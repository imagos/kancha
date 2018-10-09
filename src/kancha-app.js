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
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-scroll-effects/app-scroll-effects.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@polymer/app-route/app-location.js';
import '@polymer/app-route/app-route.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-button/paper-button.js';
import './kancha-icons.js';

// Gesture events like tap and track generated from touch will not be
// preventable, allowing for better scrolling performance.
setPassiveTouchGestures(true);

// Set Polymer's root path to the same value we passed to our service worker
// in `index.html`.
setRootPath(MyAppGlobals.rootPath);

class KanchaApp extends PolymerElement {
  static get template() {
    return html`
      <style>
        :host {
        --app-primary-color: #094FA4;
        --app-secondary-color: black;
            display: block;
            height: 100vh;
        }
        .logo{
            color: #fff;
        }
        .display_inline{
          display: inline-block;
        }
        app-header {
            color: #fff;
            background-color: #0051a3;
        }
        app-header paper-icon-button {
            --paper-icon-button-ink-color: white;
        }
        paper-button.green { 
          background-color: #4285f4;
          color: white;
        }
      </style>

      <app-location route="{{route}}" url-space-regex="^[[rootPath]]">
      </app-location>

      <app-route route="{{route}}" pattern="[[rootPath]]:page" data="{{routeData}}" tail="{{subroute}}">
      </app-route>

      <app-drawer-layout fullbleed="" narrow="{{narrow}}">
        <!-- Drawer content -->
        <app-drawer id="drawer" slot="drawer" swipe-open="[[narrow]]">
          <app-toolbar>Menu</app-toolbar>
          <iron-selector selected="[[page]]" attr-for-selected="name" class="drawer-list" role="navigation">
            <a name="view1" href="[[rootPath]]view1">View One</a>
            <a name="view2" href="[[rootPath]]view2">View Two</a>
            <a name="view3" href="[[rootPath]]view3">View Three</a>
          </iron-selector>
        </app-drawer>

        <!-- Main content -->
        <app-header-layout has-scrolling-region="">

          <app-header slot="header" condenses="" reveals="" effects="waterfall">
            <app-toolbar>
              <paper-icon-button icon="kancha-icons:menu" drawer-toggle=""></paper-icon-button>
              <div main-title="">Kancha BBVA</div>
            </app-toolbar>
          </app-header>

          <div hidden$="{{logged}}" width="100%" style="text-align:center; margin-top:25%;">
              <div id="msgFail" style="color:red"></div>
              Bienvenid@ a Kudos, para poder dejar tu feedback debes identificarte:<br>
              <paper-button class="green" raised on-click="_signInWithGoogle">
                  <iron-icon icon="perm-identity"></iron-icon>
                  Ingresar con mi cuenta Google (@bbva.com)
              </paper-button>
          </div>

          <iron-pages selected="[[page]]" attr-for-selected="name" role="main">
            <kancha-view1 name="view1"></kancha-view1>
            <kancha-view2 name="view2"></kancha-view2>
            <kancha-view3 name="view3"></kancha-view3>
            <kancha-view404 name="view404"></kancha-view404>
          </iron-pages>
        </app-header-layout>
      </app-drawer-layout>
      
    <footer>
      <a href="https://www.cytweb.com">Made by Imagos</a>
    </footer>
    `;
  }

  static get properties() {
    return {
      page: {
        type: String,
        reflectToAttribute: true,
        value: 'view1',
        observer: '_pageChanged'
      },
      routeData: Object,
      subroute: Object,
      nameApp: {
        type: String,
        notify: true,
        value: 'kancha-app'
      },
      // Is Authenticated by Google?
      logged: {
        type: Boolean,
        notify: true
      },
      // Is Authenticated by Google?
      user: {
        type: Object,
        notify: true
      },
      // User Logged In
      userEmail: {
        type: String,
        notify: true
      },
      userName: {
        type: String,
        notify: true
      },
      userPicture: {
        type: String,
        notify: true
      },
      admin: {
        type: String,
        notify: true
      },
      listAreas: {
        type: Array,
        notify: true
      },
      selectArea: {
        type: Boolean,
        notify: true,
        value: false
      }
    };
  }

  static get observers() {
    return [
      '_routePageChanged(routeData.page)'
    ];
  }

  _routePageChanged(page) {
     // Show the corresponding page according to the route.
     //
     // If no page was found in the route data, page will be an empty string.
     // Show 'view1' in that case. And if the page doesn't exist, show 'view404'.
    if (!page) {
      this.page = 'view1';
    } else if (['view1', 'view2', 'view3'].indexOf(page) !== -1) {
      this.page = page;
    } else {
      this.page = 'view404';
    }

    // Close a non-persistent drawer when the page & route are changed.
    if (!this.$.drawer.persistent) {
      this.$.drawer.close();
    }
  }

  _pageChanged(page) {
    // Import the page component on demand.
    // Note: `polymer build` doesn't like string concatenation in the import
    // statement, so break it up.
    switch (page) {
      case 'view1':
        import('./kancha-view1.js');
        break;
      case 'view2':
        import('./kancha-view2.js');
        break;
      case 'view3':
        import('./kancha-view3.js');
        break;
      case 'view404':
        import('./kancha-view404.js');
        break;
    }
  }
  
  _login(){
    var parent = this;
    firebase.auth().onAuthStateChanged(function(account) {
      
      if (account) {
        console.log("user id: " + firebase.auth().currentUser.uid);
        if (account.email.toUpperCase().indexOf('@BBVA.COM')>=0){
          parent.set('user', account);
          parent.set('userEmail', account.email);
          if(account.displayName){
            parent.$.cards.userFirstName    = account.displayName.split(' ')[0];    
            parent.$.cards.userName         = account.displayName;
          }else{
            parent.$.cards.userFirstName    = account.email;
            parent.$.cards.userName         = account.email.toString().replace(/[@.]/g,'_');
          }
          parent.$.cards.userEmail = account.email.toString().replace(/[@.]/g,'_');
          parent.$.cards.userPicture = account.photoURL || '../images/avatar_login.png';
          parent.set('userName', parent.$.cards.userName);
          parent.set('userPicture', parent.$.cards.userPicture);
          parent.set('logged', true);
          //parent.loadlistEvents();
        }else{
          parent.$.msgFail.innerHTML="Tu usuario no es BBVA";
          parent.signOut();
        }
      }
    });    
  }
  
  _signInWithGoogle() {
    if (!firebase.auth().currentUser) {
        var provider = new firebase.auth.GoogleAuthProvider();
        var parent = this;
        firebase.auth().signInWithRedirect(provider);
        firebase.auth().getRedirectResult().then(function(result) {
          parent.set('logged', true);
          parent.showCards();
        }).catch(function(error) { //error.code //error.message //error.credential
            if (error.code === 'auth/account-exists-with-different-credential') {
                alert('You have already signed up with a different auth provider for that email.');
            } else {
                console.log('error : ' + error);
            }
        });
    } else {
        //firebase.auth().signOut();
    }
  }
  
  ready() {
    super.ready();
    this._login();
  }
}

window.customElements.define('kancha-app', KanchaApp);
