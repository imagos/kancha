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
      teamName: {
        type: String,
        notify: true
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
    </style>
    
    <vaadin-date-picker id="visitStartDate" style="width:40%;" label="Start Date" required=true value={{startDate}}>
    </vaadin-date-picker>
    <vaadin-date-picker id="visitFinishDate" style="width:40%;" label="Finish Date" required=true value={{finishDate}}>
    </vaadin-date-picker>
    <vaadin-combo-box label="Team" id="teamSel" style="width:70%;" required=true placeholder="Team" value={{teamName}}></vaadin-combo-box>
    <paper-icon-button icon="search" on-click="_drawChart"></paper-icon-button>
    
    <div id="chartTime"></div>
    `;
  }
    loadTeams(teams){
        this.$.teamSel.items=teams;
    }
    _drawChart() {
        var self=this;
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(this.drawChart);
        var data = new google.visualization.DataTable();
        data.addColumn('datetime', 'Date');
        data.addColumn('number', 'Pulse');
        data.addColumn('number', 'Environment');

        db.settings({timestampsInSnapshots: true});
        var arrayData=[];
        db.collection("visits").where("teamId", "==", self.$.teamSel.selectedItem.value).where("date", ">=", self.startDate).where("date", "<=", self.finishDate).orderBy("date","asc")
          .get()
          .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              // doc.data() is never undefined for query doc snapshots
              var info=doc.data();
            //   var _date=
              var row=[];
              row.push(new Date(info.date.substr(0, 4),info.date.substr(5, 2),info.date.substr(8, 2),info.corrVisit));
              row.push(parseInt(info.pulse));
              row.push(parseInt(info.weather));
              arrayData.push(row);
              
            //   self.pulseSlider    = data.pulse;
            //   self.weatherSlider  = data.weather;
    
            //   self.$.pulseSlider._value   = data.pulse;
            //   self.$.weatherSlider._value = data.weather;
              
            //   self.$.tagPulse.tags        = data.tagPulse;
            //   self.$.tagWeather.tags      = data.tagWeather;
              
            //   self.$.tagWeather.tags      = data.tagWeather;
              
            //   //TODO Get Stage and Intervention
            //   self.$.stageList.value = data.stage;
            //   self.$.tagWeather.tags      = data.intervention;
              
            //   self.corrVisit = data.corrVisit;
            //   self.idVisit=data.id;
              
              
            });
            data.addRows(arrayData);
            var chart = new google.visualization.LineChart(self.$.chartTime);
            chart.draw(data, self._getOptions());    
          })
          .catch(function(error) {
            console.info("Error getting documents: "+ error);
          });
    }
    
    _getOptions(){
      var self=this;
      var options = {
        width: 900,
        height: 500,
        legend: {position: 'none'},
        enableInteractivity: false,
        chartArea: {
          width: '85%'
        },
        hAxis: {
          viewWindow: {
            min: new Date(self.startDate.substr(0,4), self.startDate.substr(5,2), self.startDate.substr(8,2), 0),
            max: new Date(self.finishDate.substr(0,4), self.finishDate.substr(5,2), self.finishDate.substr(8,2), 23)
          },
          gridlines: {
            count: -1,
            units: {
              days: {format: ['MMM dd']},
              hours: {format: ['HH:mm', 'ha']},
            }
          },
          minorGridlines: {
            units: {
              hours: {format: ['hh:mm:ss a', 'ha']},
              minutes: {format: ['HH:mm a Z', ':mm']}
            }
          }
        }
      };
      return options;
    }
}
customElements.define('kancha-stats-visits', KanchaStatsVisits);

