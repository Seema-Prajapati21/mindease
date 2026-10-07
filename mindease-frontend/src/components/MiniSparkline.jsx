import React from 'react';
import { ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';

const MiniSparkline = ({ data = [] }) => {
  // Take last 14 entries
  const last14 = data.slice(-14);

  return (
    <div style={{ width: '100%', height: 60 }}>
      <ResponsiveContainer>
        <LineChart data={last14} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length && payload[0].value !== null) {
                return (
                  <div
                    className="p-1 px-2 rounded small"
                    style={{ backgroundColor: '#2E2E2E', color: '#FFFFFF', fontSize: '0.75rem' }}
                  >
                    Score: {payload[0].value}
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="var(--me-primary)"
            strokeWidth={2}
            dot={false}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MiniSparkline;
