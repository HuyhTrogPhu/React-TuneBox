import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from 'react-bootstrap';
import { Calendar } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from '../../../../components/ui/card';


const PRIMARY_COLOR = "#FF7F50";
const SECONDARY_COLOR = "#FFA07A";

const SearchChart = () => {
  const [searchType, setSearchType] = useState('like');
  const [timeFrame, setTimeFrame] = useState('daily');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [data, setData] = useState({ chartData: [], summary: {} });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }
  
    setLoading(true);
    try {
      const chartResponse = await fetch(
        `http://localhost:8082/social-statistical/chart-data?startDate=${startDate}&endDate=${endDate}`,
        {
          credentials: 'include'
        }
      );
  
      if (!chartResponse.ok) {
        throw new Error('Failed to fetch chart data');
      }
  
      const chartData = await chartResponse.json();
      console.log('chartData:', chartData); // Debugging log to check the structure
  
      if (!chartData.chartData || !Array.isArray(chartData.chartData)) {
        throw new Error('Invalid chart data format');
      }
  
      const statsResponse = await fetch(
        `http://localhost:8082/social-statistical/range?startDate=${startDate}&endDate=${endDate}&type=${searchType}`,
        {
          credentials: 'include'
        }
      );
  
      if (!statsResponse.ok) {
        throw new Error('Failed to fetch statistics');
      }
  
      const statsData = await statsResponse.json();
  
      const transformedData = chartData.chartData.map(item => ({
        date: new Date(item.date).toLocaleDateString(),
        likes: item.totalLikes || 0,
        comments: item.totalComments || 0,
        title: item.postTitle || '-',
        id: item.postId || '-',
        totalPosts: item.totalPosts || 0
      }));

      setData(transformedData);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error fetching data. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  
  const handleSearch = () => {
    fetchData();
  };

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);

    if (endDate && newStartDate > endDate) {
      setEndDate(newStartDate);
    }
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);

    if (startDate && newEndDate < startDate) {
      setStartDate(newEndDate);
    }
  };

  return (
    <div className="container-fluid py-4">
    <div className="card shadow-sm">
      <div className="card-header bg-white border-bottom-0">
        <h4 className="card-title mb-0" style={{ color: PRIMARY_COLOR }}>Post Statistics Dashboard</h4>
      </div>
      <div className="card-body">
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <label className="form-label">Interaction Type</label>
            <select 
              className="form-select"
              value={searchType} 
              onChange={(e) => setSearchType(e.target.value)}
              style={{ borderColor: PRIMARY_COLOR }}
            >
              <option value="like">Likes</option>
              <option value="comment">Comments</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label">Time Frame</label>
            <select 
              className="form-select"
              value={timeFrame} 
              onChange={(e) => setTimeFrame(e.target.value)}
              style={{ borderColor: PRIMARY_COLOR }}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div className="col-md-3">
            <label className="form-label">Start Date</label>
            <div className="input-group">
              <span className="input-group-text" style={{ backgroundColor: PRIMARY_COLOR, color: 'white' }}>
                <Calendar size={18} />
              </span>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ borderColor: PRIMARY_COLOR }}
              />
            </div>
          </div>

          <div className="col-md-3">
            <label className="form-label">End Date</label>
            <div className="input-group">
              <span className="input-group-text" style={{ backgroundColor: PRIMARY_COLOR, color: 'white' }}>
                <Calendar size={18} />
              </span>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ borderColor: PRIMARY_COLOR }}
              />
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-center mb-4">
          <button 
            className="btn"
            onClick={handleSearch}
            disabled={loading || !startDate || !endDate}
            style={{ 
              backgroundColor: PRIMARY_COLOR,
              color: 'white',
              minWidth: '120px'
            }}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            ) : null}
            {loading ? 'Loading...' : 'Search'}
          </button>
        </div>

        {data.length > 0 && (
          <>
            <div className="card mb-4">
              <div className="card-header bg-white border-bottom-0">
                <h5 className="card-title mb-0" style={{ color: PRIMARY_COLOR }}>Interaction Trends</h5>
              </div>
              <div className="card-body">
                <div style={{ height: '400px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey={searchType === 'like' ? 'likes' : 'comments'}
                        stroke={PRIMARY_COLOR}
                        name={searchType === 'like' ? 'Likes' : 'Comments'}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header bg-white border-bottom-0">
                <h5 className="card-title mb-0" style={{ color: PRIMARY_COLOR }}>Detailed Statistics</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Total Posts</th>
                        <th>{searchType === 'like' ? 'Likes' : 'Comments'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((item, index) => (
                        <tr key={index}>
                          <td>{item.date}</td>
                          <td>{item.totalPosts}</td>
                          <td>{searchType === 'like' ? item.likes : item.comments}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  </div>
  );
};

export default SearchChart;
