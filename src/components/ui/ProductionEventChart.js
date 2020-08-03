import React, { PureComponent } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Legend, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import mdColors from '../../helpers/colors'

export default class ProductionEventChart extends PureComponent {
  render() {
    return (
      <div style={{ width: '100%', height: 800 }}>
        <ResponsiveContainer>
          <LineChart
            width={500}
            height={300}
            data={this.props.data}
            margin={{
              top: 5, right: 30, left: 20, bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={this.props.xDataKey} />
            <YAxis />
            <Legend />
            {this.props.dataKeys.map((dataKey, index) => {
              return <Line key={dataKey} type="monotone" dataKey={dataKey} stroke={mdColors[index * 15]} />
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
