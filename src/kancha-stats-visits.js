import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@vaadin/vaadin-date-picker/vaadin-date-picker.js';

class KanchaStatsVisits extends PolymerElement {
  static get properties() {
    return {
      startDate:     { type: String, notify:  true},
      finishDate:     { type: String, notify:  true},
      teams: {
        type: Array,
        notify: true,
        value:[]
      },
      results: {
        type: Array,
        notify: true,
        value:[]
      },
      objChart: {
        type: Object,
        notify: true,
      },
      teamName: {
        type: String,
        notify: true
      },
      pulseRange: {
        type:   Array,
        notify: true,
      },
      weatherRange: {
        type:   Array,
        notify: true,
      },
      stageRange: {
        type:   Array,
        notify: true,
      },
    };
  }

  static get template() {
    return html`
    <style>
        paper-icon-button { 
          background-color: #4285f4;
          color: white;
          width: 34px;
          height: 34px;
        }
        .container{
          width: 100%;
          margin: 0px !important;
          padding: 0px !important;
          tex-align: center;
        }
    </style>
    <div class="container">
      <vaadin-date-picker id="visitStartDate" style="width:40%;" label="Start Date" required=true value={{startDate}}>
      </vaadin-date-picker>
      <vaadin-date-picker id="visitFinishDate" style="width:40%;" label="Finish Date" required=true value={{finishDate}}>
      </vaadin-date-picker>
      <vaadin-combo-box label="Team" id="teamSel" style="width:70%;" required=true placeholder="Team" value={{teamName}}></vaadin-combo-box>
      <paper-icon-button icon="search" on-click="_drawChart"></paper-icon-button>
      <div id="chartTime"></div>
    </div>
    `;
  }
    loadTeams(teams){
        this.$.teamSel.items=teams;
    }
    _drawChart() {
        var self=this;
        google.charts.load('current', {packages: ['corechart', 'line']});
        //google.charts.setOnLoadCallback(this.drawChart);
        var data = new google.visualization.DataTable();
        data.addColumn('datetime', 'Date');
        data.addColumn('number', 'Pulse');
        data.addColumn({type: 'string', role: 'tooltip'});
        data.addColumn('number', 'Environment');
        data.addColumn({type: 'string', role: 'tooltip'});
        db.settings({timestampsInSnapshots: true});
        var arrayData=[];
        var _tooltipPulse='';
        var _tooltipWeather='';
        self.results=[];
        db.collection("visits").where("teamId", "==", self.$.teamSel.selectedItem.value).where("date", ">=", self.startDate).where("date", "<=", self.finishDate).orderBy("date","asc").orderBy("corrVisit","asc")
          .get()
          .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              // doc.data() is never undefined for query doc snapshots
              var info=doc.data();
              var row=[];
              //_tooltip='Pulse: ' + info.tagPulse.toString() + String.fromCharCode(10);
              _tooltipPulse='Date: ' + info.date + ' | N°' + info.corrVisit + String.fromCharCode(10);
              _tooltipPulse=_tooltipPulse + 'Stage: ' + info.stage + String.fromCharCode(10);
              _tooltipPulse=_tooltipPulse + 'Pulse: ' + self._getNameArray(1,info.pulse) + String.fromCharCode(10) + 'Tags:' + info.tagPulse  + String.fromCharCode(10);
              _tooltipPulse=_tooltipPulse + 'Intervention: ' + info.intervention ;
              _tooltipWeather='Date: ' + info.date + ' | N°' + info.corrVisit + String.fromCharCode(10);
              _tooltipWeather=_tooltipWeather + 'Stage: ' + info.stage + String.fromCharCode(10);
              _tooltipWeather=_tooltipWeather + 'Environment: ' +self._getNameArray(2,info.weather) + String.fromCharCode(10) +'Tags:' + info.tagWeather;
              row.push(new Date(info.date.substr(0, 4),parseInt(info.date.substr(5, 2)-1),info.date.substr(8, 2),info.corrVisit));
              row.push(self._getValue4Stage(parseInt(info.pulse),info.stage));
              //*log
              // console.log('Stage: ' + info.stage + ' | Pulse: '+ info.pulse + ' | Envir: '+ info.weather);
              
              // console.log(self._getValue4Stage(parseInt(info.pulse),info.stage));
              // console.log(self._getValue4Stage(parseInt(info.weather),info.stage));
              //*
              row.push(_tooltipPulse);
              row.push(self._getValue4Stage(parseInt(info.weather),info.stage));
              row.push(_tooltipWeather);
              arrayData.push(row);
            });
            data.addRows(arrayData);
            self.results=arrayData;
            
            var chart = new google.visualization.LineChart(self.$.chartTime);
            chart.draw(data, self._getOptions());    
          });
          // .catch(function(error) {
          //   console.info("Error getting documents: "+ error);
          // });
    }
    graphSelectHandler() {
      var selectedItem = this.chart.getSelection()[0];
      if (selectedItem) {
        var topping = this.results.getValue(selectedItem.row, 0);
        alert('The user selected ' + topping);
      }
    }
    //1==> pulseRange | 2==> weatherRange
    _getNameArray(_type,_value){
      let _obj={};
      if(_type==1){
        _obj=this.pulseRange.find(_obj => _obj.id === _value);
      }else if(_type==2){
        _obj=this.weatherRange.find(_obj => _obj.id === _value);
      }
      if(_obj===undefined){
        return '';
      }
      return _obj.name;
    }
    //Get stage
    _getValue4Stage(_value, _stage){
      var _numStage=0;
      var _obj=this.stageRange.find(item => item.value === _stage);
      _numStage=parseInt(_obj.id);
      return _value+((_numStage-1)*5);
    }
    
    //TODO Deprecated
    _array2Paragraph(_objArray){
      var _paragraph='';
      if(_objArray != undefined && _objArray.length>0){
        _paragraph=_objArray.toString();
        _paragraph=_paragraph.replace(/,/g,String.fromCharCode(10));
      }
      return _paragraph;
    }
    //
    _getOptions(){
      var self=this;
      var options = {
        height:500,
        colors: ['green', 'purple'],
        pointSize: 30,
        series: {
              0: { pointShape: 'circle' },
              1: { pointShape: 'triangle' }
          },
        vAxis: {
          title: 'Stage',
        },
        hAxis: {
          title: 'Time',
          gridlines: {
            units: {
              days: {format: ['MMM dd']},
            }
          },
        }
      };
      return options;
    }
}
customElements.define('kancha-stats-visits', KanchaStatsVisits);

