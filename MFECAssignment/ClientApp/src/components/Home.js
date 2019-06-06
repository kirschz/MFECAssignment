﻿import React, { Component } from 'react';

export class Home extends Component {
  static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = { forecasts: [], loading: true };

        fetch('api/Promotion/ReadData')
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
                        <th>ค่าโทร</th>
                        <th>โปรโมชั่น</th>
                    </tr>
                </thead>
                <tbody>
                    {forecasts.map(forecast =>
                        <tr key={forecast.modileNumber}>
                            <td>{forecast.modileNumber}</td>
                            <td>{forecast.totalTime}</td>
                            <td>{forecast.serviceFee}</td>
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
                <h1>ค่าใช้บริการของลูกค้าแต่ละเบอร์</h1>
                <p></p>
                {contents}
            </div>
        );
    }
}
