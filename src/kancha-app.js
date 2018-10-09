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
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import './kancha-icons.js';
import './kancha-teams.js';
import './shared-styles.js';

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
        app-toolbar {
            color: #fff;
            background-color: #0051a3;
        }
        app-toolbar paper-icon-button {
            --paper-icon-button-ink-color: white;
        }
        paper-icon-button.green { 
          background-color: #4285f4;
          color: white;
          width: 34px;
          height: 34px;
        }
        .avatar{
          width:40px;height:40px!important;
          border-radius: 50%;
        }
      </style>

      <div hidden$="{{loggedIn}}" width="100%" style="text-align:center; margin-top:25%;">
        <div id="msgFail" style="color:red"></div>
        Bienvenid@ a Kancha para poder dejar tu feedback debes identificarte con una cuenta BBVA.COM<br>
        <paper-icon-button class="green" icon="polymer" on-click="_signInWithGoogle">
        </paper-icon-button>
      </div>
      
      <div hidden$="{{!loggedIn}}" width="100%" style="text-align:center;">
        <app-toolbar>
          <paper-icon-button icon="menu"></paper-icon-button>
          <div main-title>[[nameApp]]</div>
          <paper-icon-button icon="search"></paper-icon-button>
          <paper-icon-button icon="exit-to-app" id="mExit"   title="Salir"        on-tap="signOut"  ></paper-icon-button>
        </app-toolbar>
        
        <div style="display:table">
          <img id="imgProfile" class="avatar" src="{{userPicture}}">
          <div style="display:table-cell;vertical-align:middle"> ¡Welcome <span style="color:#448081;">{{userName}}</span>!</div>
        </div>
        <kancha-teams id="teams"></kancha-teams>
      </div>

        
    `;
  }

  static get properties() {
    return {
      page: {
        type: String,
        reflectToAttribute: true,
        value: 'teams'
      },
      routeData: Object,
      subroute: Object,
      nameApp: {
        type: String,
        notify: true,
        value: 'Kancha BBVA'
      },
      // Is Authenticated by Google?
      loggedIn: {
        type: Boolean,
        notify: true,
        value: false
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
  
  _login(){
    var parent = this;
    firebase.auth().onAuthStateChanged(function(account) {
      
      if (account) {
        console.log("user id: " + firebase.auth().currentUser.uid);
        if (account.email.toUpperCase().indexOf('@BBVA.COM')>=0){
          var _userFirstName="";
          var _userName="";
          
          parent.set('user', account);
          parent.set('userEmail', account.email);
          parent.$.teams.userEmail = account.email;
          if(account.displayName){
            _userFirstName    = account.displayName.split(' ')[0];    
            _userName         = account.displayName;
          }else{
            _userFirstName    = account.email;
            _userName         = account.email.toString().replace(/[@.]/g,'_');
          }
          
          parent.set('userFirstName', _userFirstName);
          parent.set('userName', _userName);
          parent.set('userPicture', account.photoURL || '../images/avatar_login.png');
          parent.set('loggedIn', true);
          parent.$.teams.loadlistAreas();
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
          parent.set('loggedIn', true);
        }).catch(function(error) { //error.code //error.message //error.credential
            if (error.code === 'auth/account-exists-with-different-credential') {
                alert('You have already signed up with a different auth provider for that email.');
            } else {
                console.log('error : ' + error);
            }
        });
    } else {
        firebase.auth().signOut();
    }
  }
  
  signOut() {
    firebase.auth().signOut();
    this.set('loggedIn', false);
  }
  
  ready() {
    super.ready();
    this._login();
  }
}

window.customElements.define('kancha-app', KanchaApp);
