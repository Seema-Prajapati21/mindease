import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { getEmotionById } from '../constants/emotions';
import { formatDateDisplay } from '../utils/dateHelpers';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    if (data.score === null) return null;
    const emotionInfo = data.emotion ? getEmotionById(data.emotion) : null;

    return (
      <div
        className="me-card p-2 shadow-sm"
        style={{ backgroundColor: '#ffffff', border: '1px solid var(--me-border)', fontSize: '0.85rem' }}
      >
        <div className="fw-semibold text-muted">{formatDateDisplay(data.date)}</div>
        {emotionInfo && (
          <div className="d-flex align-items-center gap-1 mt-1">
            <span>{emotionInfo.emoji}</span>
            <span className="fw-medium">{emotionInfo.label}</span>
          </div>
        )}
        <div className="text-muted mt-1">
          Mood Score: <strong>{data.score}</strong> / 10
        </div>
      </div>
    );
  }
  return null;
};

const CustomizedDot = (props) => {
  const { cx, cy, payload } = props;
  if (!payload || payload.score === null) return null;
  const emo = payload.emotion ? getEmotionById(payload.emotion) : null;
  const color = emo ? emo.color : 'var(--me-primary)';

  return (
    <circle
      cx={cx}
      cy={cy}
      r={5}
      stroke="#ffffff"
      strokeWidth={2}
      fill={color}
    />
  );
};

const MoodLineChart = ({ data = [] }) => {
  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0ebe1" />
          <XAxis
            dataKey="date"
            tickFormatter={(val) => {
              if (!val) return '';
              const parts = val.split('-');
              return `${parts[1]}/${parts[2]}`;
            }}
            stroke="#8A8A8A"
            tick={{ fontSize: 12 }}
          />
          <YAxis domain={[1, 10]} ticks={[2, 4, 6, 8, 10]} stroke="#8A8A8A" tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="score"
            stroke="var(--me-primary)"
            strokeWidth={2.5}
            dot={<CustomizedDot />}
            activeDot={{ r: 7, stroke: '#ffffff', strokeWidth: 2 }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodLineChart;
