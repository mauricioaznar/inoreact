import React, { PureComponent } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Legend, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import mdColors from '../../helpers/colors'
import AreaChart from 'recharts/lib/chart/AreaChart'
import Area from 'recharts/lib/cartesian/Area'

export default class ProductionEventChart extends PureComponent {
  render() {
    return (
      <div style={{ width: '100%', height: 800 }}>
        <ResponsiveContainer>
          <AreaChart
            width={500}
            height={300}
            data={this.props.data}
            margin={{
              top: 5, right: 30, left: 20, bottom: 80,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={this.props.xDataKey} angle={-45} textAnchor="end" />
            <YAxis />
            <Legend verticalAlign="top" />
            {this.props.dataKeys.map((dataKey, index) => {
              return <Area key={dataKey} type="monotone" dataKey={dataKey} stroke={mdColors[(index - 1) * 20]} fill={mdColors[(index - 1) * 20]} />
            })}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
