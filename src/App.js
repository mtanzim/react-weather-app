import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';

import Header from "./components/Header";
import WeatherCards from "./components/WeatherCards";
import StateHistory from "./components/StateHistory";
import data from "./mock";
import data2 from "./mock2";

class App extends Component {

  constructor(props) {
    super(props);
    this.cardIdCount = -1;
    this.STATE_HISTORY_LOCAL_KEY = 'reactWeatherLocalHistory';
    this.refreshTiimer = 5 * 60 * 1000;
    this.offlineDelay = 50;
    this.state = { loading: true, countDown: this.refreshTiimer, isOffline: false, errorMessage:"" };
    this.stateHistory = {};
    this.curTimeStamp = null;
    this.STATE_HISTORY_LIMIT = 6;
    try {
      this.stateHistory = JSON.parse(localStorage.getItem(this.STATE_HISTORY_LOCAL_KEY));
    } catch(err) {
      console.log(err);
    }
    this.interval = null;
    this.countDownInterval = null;
    this.city = "Berlin";
    this.API_ID = "82f13ccba8452fb77eab61ee10ce5d53";
    // this.API_ID = "5711f1ec67a15772fe82fbabe951933b";
    this.requiredDataFilters = ['main', 'wind', 'weather', 'coord', 'sys'];

  }


  componentDidMount() {
    this.interval = setInterval(() => this.refreshWeather(), this.refreshTiimer);
    this.countDownInterval = setInterval(() => this.setState((state, props) => state.countDown -= 1000), 1000);
    this.refreshWeather();
  }


  
  componentWillUnmount() {
    clearInterval(this.interval);
    clearInterval(this.countDownInterval);
  }

  clearWeatherHistory = () => {
    console.log('Clearing history!');
    this.setState({ loading: true });
    this.stateHistory = {};
    try {
      localStorage.setItem(this.STATE_HISTORY_LOCAL_KEY, JSON.stringify(this.stateHistory));
    } catch (err) {
      console.log(err);
    }
    this.setState({ loading: false });
  }

  restartIntervals = () => {
    clearInterval(this.interval);
    clearInterval(this.countDownInterval);
    this.interval = setInterval(() => this.refreshWeather(), this.refreshTiimer);
    this.countDownInterval = setInterval(() => this.setState((state, props) => state.countDown -= 1000), 1000);
    this.setState({
      countDown: this.refreshTiimer
    });
  }
  // additional parsing may be implemented here
  sanitizeDataFunc = (data, timestamp) => {
    let sanitizedData = Object.keys(data)
      .filter(key => this.requiredDataFilters.includes(key))
      .reduce((obj, key) => {
        if (key === 'weather') {
          obj[key] = data[key][0] || "";
        } else {
          obj[key] = data[key];
        }
        return obj;
      }, {});

    sanitizedData["timestamp"] = timestamp;
    return sanitizedData;
  }

  //tester with offline mock data
  // please note the differences between data and data2 (id:800 vs id:ABC)
  refreshOffline = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let randomNumber = Math.floor(Math.random() * 6) + 1;
        if (randomNumber < 3) {
          resolve(data);
        } else {
          resolve(data2);
        }
      }, this.offlineDelay);
    });
  }

  refreshWeather = () => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.city}&APPID=${this.API_ID}`)
      // this.refreshOffline()
      .then(res => res.json())
      .then(data => {

        if (data.message) {
          this.setState({
            isOffline:true,
            errorMessage: data.message
          });
          return this.refreshOffline();
        } else {
          this.setState({ 
            isOffline: false,
            errorMessage: "" 
           });
          return data;
        }
      })
      .then (data => {
        // console.log(data);
        let timestamp = String(+ new Date());
        let sanitizedData = this.sanitizeDataFunc(data, timestamp);
        this.stateHistory[timestamp] = sanitizedData;
        this.curTimeStamp = timestamp;

        let stateKeys = Object.keys(this.stateHistory);


        // if (stateKeys.length > this.STATE_HISTORY_LIMIT) {
          // console.error ('State limit exceeded!');
          // keep state history sorted and filtered
          stateKeys.sort ( (a,b) => b-a);
          let i = 0;
          let selectedKeys = [];
          while (i < this.STATE_HISTORY_LIMIT) {
            selectedKeys.push(stateKeys[i]);
            i ++;
          }
          console.log(selectedKeys);
          const filtered = stateKeys
            .filter(key => selectedKeys.includes(key))
            .reduce((obj, key) => {
              obj[key] = this.stateHistory[key];
              return obj;
            }, {});

          // delete filtered[timestamp.toString()];

          this.stateHistory = filtered;

        // }

        try {
          localStorage.setItem(this.STATE_HISTORY_LOCAL_KEY, JSON.stringify(this.stateHistory));
        } catch (err) {
          console.log(err);
        }
        // reset states
        this.setState({ sanitizedData: sanitizedData, loading: false });
        this.restartIntervals();

      })
      .catch(err => console.log(err.message));

  }


  revertState = (key) => {
    return () => {
      this.setState({
        sanitizedData: this.stateHistory[key],
      });
      this.restartIntervals();
    }
  }


  render() {
    return !this.state.loading ? (
      <div className="container">
        <div className="jumbotron">
          <Header title={this.city} />
          {this.state.isOffline ? (<p>Offline! {this.state.errorMessage}</p>) : (<p>LIVE</p>)}
          <button className="btn-danger" onClick={this.refreshWeather}>Refresh</button>
          <button className="btn-danger ml-2" onClick={this.clearWeatherHistory}>Clear History</button>
          <p>Refreshing in {Math.floor(this.state.countDown / 1000)} seconds</p>
        </div>
        <div className="row mt-4 mb-4">
          <h5>History</h5>
        </div>
        <div className="row"><h5>Conditions for {this.state.sanitizedData.timestamp}</h5></div>
        <div className="row">
          {Object.keys(this.state.sanitizedData).map(element => {
            this.cardIdCount++;
            return (<WeatherCards id={this.cardIdCount} key={this.cardIdCount} title={element} data={this.state.sanitizedData[element]} />)
          })}
        </div>

        <div className="row">
          {this.stateHistory &&
            Object.keys(this.stateHistory).map(elem => {
              {/* (elem !== this.curTimeStamp) && */}
              return  (<StateHistory key={elem} revertAction={this.revertState} curState={elem} data={this.stateHistory[elem]} />)
            })
          }

        </div>


      </div>
    ) : (<p>'Loading'</p>);
  }
}

export default App;
