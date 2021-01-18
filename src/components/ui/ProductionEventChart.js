import React, {PureComponent} from 'react';
import {CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis,} from 'recharts';
import mdColors from '../../helpers/colors'
import AreaChart from 'recharts/lib/chart/AreaChart'
import Area from 'recharts/lib/cartesian/Area'

export default class ProductionEventChart extends PureComponent {
  render() {
    return (
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <AreaChart
            height={300}
            data={this.props.data}
            margin={{
              top: 10, bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={this.props.xDataKey} angle={-45} textAnchor="end" interval={2}/>
            <YAxis />
            <Legend verticalAlign="top" iconType="square" />
            {this.props.dataKeys.map((dataKey, index) => {
              return <Area key={dataKey} type="monotone" dataKey={dataKey} stroke={mdColors[(index - 1) * 20]} fill={mdColors[(index - 1) * 20]} />
            })}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
