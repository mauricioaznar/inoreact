import React, { PureComponent } from 'react';
import {PieChart, Pie, Sector, Cell, ResponsiveContainer, Tooltip} from 'recharts';
import mdColors from "../../../helpers/colors";
import formatNumber from "../../../helpers/formatNumber";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel1 = ({ cx, name, cy, midAngle, innerRadius, outerRadius, percent, index }) => {

  return name;
};

const renderCustomizedLabel2 = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {(percent * 100).toFixed(0)}%
    </text>
  );
};

const customTooltip = (options) => {
  const payload = options.payload
  if (payload.length > 0) {
    const value = options.payload[0].value
    return (
      formatNumber(value)
    );
  }

  return null;
};

export default class CustomPieChart extends PureComponent {

  render() {
    return (
      <div style={{ width: '100%', height: 700 }}>
        <ResponsiveContainer>
          <PieChart
            data={this.props.data}
          >
            <Pie
              dataKey="value"
              data={this.props.data}
              cx="50%"
              cy="50%"
              outerRadius={250}
              label={renderCustomizedLabel1}
            >
              {this.props.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={mdColors[(index) * 15]} />
              ))}
            </Pie>
            <Pie
              data={this.props.data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel2}
              outerRadius={250}
              fill="#8884d8"
              dataKey="value"
            >

              {this.props.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={mdColors[(index) * 15]} />
              ))}
            </Pie>
            <Tooltip content={customTooltip} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
