import React, { Component } from 'react';
import NumberFormat from 'react-number-format';

export class FetchData extends Component {
  static displayName = FetchData.name;

  constructor (props) {
    super(props);
    this.state = { forecasts: [], loading: true };
      var urlParams = new URLSearchParams(window.location.search);
      var params = { modileNumber: urlParams.get('number') };
      fetch('api/Promotion/GetLogDataByNumber', {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          headers: {
              'Content-Type': 'application/json',
              // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: JSON.stringify(params), // body data type must match "Content-Type" header
      })
      .then(response => response.json())
          .then(data => {
              console.error('data:', data)
        this.setState({ forecasts: data, loading: false });
          }).catch(error => console.error('Error:', error));;
  }

  static renderForecastsTable (forecasts) {
    return (
        <table className='table table-striped'>
            <thead>
                <tr>
                    <th>Mobile No</th>
                    <th>TotalTime(min)</th>
                    <th>ค่าโทร(฿)</th>
                    <th>โปรโมชั่น</th>
                    <th>วัน เวลา</th>
                </tr>
            </thead>
            <tbody>
                {forecasts.map(forecast =>
                    <tr key={forecast.modileNumber}>
                        <td>{forecast.modileNumber}</td>
                        <td>{forecast.totalTime}</td>
                        <td>
                            <NumberFormat value={forecast.serviceFee} displayType={'text'} thousandSeparator={true} decimalScale="2" fixedDecimalScale="true" renderText={value => <div>{value}</div>} />
                        </td>
                        <td>{forecast.promotion}</td>
                        <td>{forecast.startTime} - {forecast.endTime}</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
  }

  render () {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
          : FetchData.renderForecastsTable(this.state.forecasts);
      var urlParams = new URLSearchParams(window.location.search);
     
      return (               
      <div>
              <h1>ค่าใช้บริการของลูกค้าของเบอร์</h1>
              <h2>{urlParams.get('number')}</h2>
        {contents}
      </div>
    );
  }
}
