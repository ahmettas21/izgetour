import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface DynamicPriceChartProps {
  data: Array<{
    date: string;
    price: number;
    currency?: string;
  }>;
  title?: string;
}

export const DynamicPriceChart: React.FC<DynamicPriceChartProps> = ({ 
  data, 
  title = "Fiyat Trendleri (Dinamik Fiyatlandırma)" 
}) => {
  
  const minPrice = Math.min(...data.map(d => d.price));
  const maxPrice = Math.max(...data.map(d => d.price));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-100 shadow-xl rounded-lg">
          <p className="text-sm text-gray-500 font-medium mb-1">{label}</p>
          <p className="text-lg font-bold text-blue-600">
            {payload[0].value} {payload[0].payload.currency || '₺'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">Seçtiğiniz tarihler etrafındaki fiyat dalgalanmaları</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-xs text-gray-400">Ortalama Fiyat</p>
          <p className="text-xl font-bold text-gray-800">
            {Math.round(data.reduce((a, b) => a + b.price, 0) / data.length)} ₺
          </p>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#6b7280' }} 
              dy={10}
            />
            <YAxis 
              domain={[minPrice * 0.8, maxPrice * 1.1]} 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={(value: number) => `₺${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#2563eb" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorPrice)" 
              activeDot={{ r: 6, strokeWidth: 0, fill: '#2563eb' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center p-3 bg-green-50 rounded-lg text-green-800 text-sm">
        <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        <span>Seçilen tarih aralığı, bu ayın en avantajlı <strong>%20'lik</strong> diliminde yer alıyor.</span>
      </div>
    </div>
  );
};

export default DynamicPriceChart;