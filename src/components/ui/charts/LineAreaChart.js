import React, {PureComponent} from 'react';
import {CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis,} from 'recharts';
import mdColors from '../../../helpers/colors'
import AreaChart from 'recharts/lib/chart/AreaChart'
import Area from 'recharts/lib/cartesian/Area'

const formatNumber = (x) => {
  if (x < 0.01 && x > -0.01) {
    x = 0
  }
  return x.toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

function kFormatter(num) {
  return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
}

export default class LineAreaChart extends PureComponent {
  render() {
      return (
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <AreaChart
              height={300}
              data={this.props.data}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={this.props.xDataKey} angle={-45} textAnchor="end" interval={0}/>
              <YAxis tickFormatter={(value) => kFormatter(value)} />
              <Tooltip formatter={(value) => formatNumber(value)} />
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
