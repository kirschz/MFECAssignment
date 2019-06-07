import React, { Component } from 'react';
import NumberFormat from 'react-number-format';

export class Home extends Component {
  static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = { forecasts: [], loading: true };
       
        fetch('api/Promotion/GetLogData')
            .then(response => response.json())
            .then(data => {
                console.error('data:', data)
                this.setState({ forecasts: data, loading: false });
            }).catch(error => console.error('Error:', error));;
    }

    static renderForecastsTable(forecasts) {
        return (
            <table className='table table-striped'>
                <thead>
                    <tr>
                        <th>Mobile No</th>
                        <th>TotalTime(min)</th>
                        <th>ค่าโทร(฿)</th>
                        <th>โปรโมชั่น</th>
                    </tr>
                </thead>
                <tbody>
                    {forecasts.map(forecast =>
                        <tr key={forecast.modileNumber}>
                            <td><a href={'fetch-data?number=' + forecast.modileNumber}>{forecast.modileNumber}</a></td>
                            <td>{forecast.totalTime}</td>
                            <td>
                                <NumberFormat value={forecast.serviceFee} displayType={'text'} thousandSeparator={true} decimalScale="2" fixedDecimalScale="true" renderText={value => <div>{value}</div>} />
                            </td>
                            <td>{forecast.promotion}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : Home.renderForecastsTable(this.state.forecasts);
      
        return (
            <div>
                <h1>ค่าใช้บริการของลูกค้าแต่ละเบอร์ </h1>
                <p></p>
               

                {contents}
            </div>
        );
    }
}
