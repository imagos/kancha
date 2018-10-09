/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import '@polymer/polymer/polymer-element.js';

const $_documentContainer = document.createElement('template');
$_documentContainer.innerHTML = `<dom-module id="shared-styles">
  <template>
    <style>
    :host {
      display: block;
      padding: 1px;
      /*height: 100vh;*/
    }
    
    paper-card {
      font-size:0.9em;
      margin:4px;
      --paper-card-actions : {
        padding:5px;
        text-align:left;
      };
    }
    
    paper-card.rate {
      @apply(--layout-horizontal);
    }
    .rate-content {
      width: 100%;
      @apply(--layout-flex);
      float: left;
    }
    .rate-header { @apply(--paper-font-headline); }
    .rate-name { color: var(--paper-grey-600); margin: 10px 0; }
    paper-icon-button.rate-icon {
      --iron-icon-fill-color: white;
      --iron-icon-stroke-color: var(--paper-grey-600);
      cursor: pointer;
    }
    paper-icon-button.rate-icon:hover{
      background-color: #428500 !important;
      color: blue;
      font-size: x-small;
    }
    paper-icon-button.rate-ico[active]{
    }

    paper-button.green {
      background-color: #4285f4;
      color: white;
    }
    
    paper-button.feeback {
      text-transform: capitalize;
      font-size: x-small;
      background-color: var(--paper-indigo-500);
      color: white;
      padding: 8px !important;
      margin: 5px;
      --paper-button-raised-keyboard-focus: {
        background-color: var(--paper-pink-a200) !important;
        color: white !important;
      };
    }
    paper-button.bot {
      text-transform: capitalize;
      font-size: x-small;
      background-color: #86c82d;
      color: white;
      padding: 3px !important;
      margin-top: 3px;
      --paper-button-raised-keyboard-focus: {
        background-color: var(--paper-pink-a200) !important;
        color: white !important;
      };
    }
    .colorAviso{
      color: #4285f4;
      background-color: blue !important;
      border-radius: 50%;
    }
    .div_middle{
      text-align:left;
      display:inline-block;
      width:95%;
      padding: 0px;
    }
    .div_feedback{
      display:inline-block;
      right: 0px;
      vertical-align:top;
      text-align:right;
      padding: 0px;
    }
    
    .kudos {
      width:95%;
      margin: auto;
      padding: 10px;
    }
    .team{
      background-color: #89d1f3;
      border-radius: 50%;
    }
    .titleProject{
      text-align:left !important;
      padding-left:3%;
      font-size: 1.1em !important;
      color: #fff;
      background-color: rbg(00,110,193);
      /*height:70px;*/
    }
    .titleBlock{
      margin-left:12px;
      text-shadow: -1px 0 #888888, 0 1px #888888, 1px 0 #888888, 0 -1px #888888;
    }
    .div-author-comment{
      padding:5px;
      background:#fff;
      border-radius: 18px;
      margin-top:5px;
      text-align: left;
    }
    .text-author-comment{
      color:#365899;
    }

    paper-button.kudo {
      background-color: #999999; /*#FFF5E0;*/
      color: white;
      /*min-width: 102px !important;*/
      /*width:40px!important;
      height:40px!important;*/
      /*border-radius: 50%;
      min-width: 40px!important;*/
      font-size: x-small;
      text-transform: none! important;
      margin: 2px;
      padding-left: 3px;
      padding-top: 2px;
      padding-bottom:2px;
      float:left;
    }
    paper-button.kudo[active] {
      background-color: #86c82d;
    }
    paper-button.calidad {
      background-color: #999999;
      color: white;
      font-size: x-small;
      text-transform: none! important;
      margin: 2px;
      padding-left: 3px;
      padding-top: 2px;
      padding-bottom:2px;
      float:left;
    }
    paper-button.calidad[active] {
      background-color: #f6891e;
    }
    paper-button.innovador {
      background-color: #999999;
      color: white;
      font-size: x-small;
      text-transform: none !important;
      margin: 2px;
      padding-left: 3px;
      padding-top: 2px;
      padding-bottom:2px;
      float:left;
    }
    paper-button.innovador[active] {
      background-color: #86c82d;
    }
    paper-button.reload {
      background-color: #86c82d;
      color: white;
      font-size: small;
      text-transform: none! important;
      margin: 2px;
      padding-left: 3px;
      padding-top: 2px;
      padding-bottom:2px;
      float:left;
    }
    
    .paper-header {
      height: 60px;
      font-size: 16px;
      line-height: 60px;
      padding: 0 10px;
      color: white;
      transition: height 0.2s;
      background-color: blue !important;
    }

    #feedback{
        z-index: 99999 !important;
    }
    
    .display_inline{
      display: inline-block;
    }
    .kudo_opacity{
      opacity: 0.4;
      cursor: default !important;
    }
    .kudo_title{
      margin: 5px !important;
      font-size: 10px;
      color: #8f8b8b;
      text-align: center;
    }
    .power_base{
      width: 40px; /*or your image's width*/
      height: 40px; /*or your image's height*/
      margin: 10px !important;
      background-repeat: no-repeat;
      background-color: #cccccc;
      background-repeat: no-repeat;
      background-position: center;
      background-size: 50px 50px;
      border: 1px solid #009ee5;
      cursor: pointer;
      padding: 8px;
      border-radius: 10px;
      background-color: #cccccc;
      background-image: url('../images/power_resize.png');
    }

    
    .kudo_base{
      width: 40px; /*or your image's width*/
      height: 40px; /*or your image's height*/
      /*margin: 10px !important;*/
      background-repeat: no-repeat;
      background-color: #cccccc;
      background-repeat: no-repeat;
      background-position: center;
      background-size: 50px 50px;
      border: 1px solid #009ee5;
      cursor: pointer;
      padding: 8px;
      border-radius: 10px;
      background-color: #cccccc;
      
      margin-left: auto;
      margin-right: auto;
    }
    .kudo_enable{
      background-color: #82c82d;
    }
    .kudo_disable{
      background-color: #cccccc;
    }
    
    .title_summary_div{
      height:70px;
      background:#2dcccd;
    }
    .title_summary{
      top: 40%;transform: translateY(-60%);
      font-weight:bolder;
      color:#fff!important;
    }
    .row_table_bottom{
      border-bottom: 1px solid #2dcccd;
      margin: 8px 0px 5px 0px;
      padding-top: 3px;
      padding-bottom: 5px;
      text-align:left !important;
      width:100%;
    }
    .row_table_detail {
      vertical-align:middle;
      display:inline-block;
      width:70%;
      padding-left:10px;
    }
    .row_table_detail_jury {
      vertical-align:middle;
      display:inline-block;
      width:50%;
      padding-left:10px;
    }
    .row_table_qty {
      display:inline-block;
      width:10%;
      text-align:right;
    }
    .row_table_cup {
      display:inline-block;
      width:5%
    }
    .row_summary{
      text-align:left !important;
      margin-top:3px;
      width: 100%;
    }
    .paper_card_summary{
      width:100%;margin:5px 0px 0px 0px !important;
    }
    
    .kudos-button{
      /*display: table-cell; width: 60%;*/
      vertical-align: middle;
      display: table; width: 100%;
    }

    @media (max-width: 550px) {
      .kudos-button{
        display: inherit; width: 100%;
        text-align: center !important;
      }
    }
    </style>
  </template>
</dom-module>`;

document.head.appendChild($_documentContainer.content);
