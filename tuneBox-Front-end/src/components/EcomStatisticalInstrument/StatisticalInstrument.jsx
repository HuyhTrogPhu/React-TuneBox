import React, { useEffect, useState } from 'react';
import { getRevenueInstrumentByInstrumentId, getNameAndIdInstrument, getStatisticalOfTime } from '../../service/EcommerceStatistical';
import { Line } from 'react-chartjs-2'; 

const StatisticalInstrument = () => {
  const [statisticalData, setStatisticalData] = useState(null);
  const [error, setError] = useState(null);
  const [instrumentData, setInstrumentData] = useState(null);
  const [selectedInstrumentId, setSelectedInstrumentId] = useState("");
  const [revenueData, setRevenueData] = useState(null);

  useEffect(() => {
    const fetchStatisticalData = async () => {
      try {
        const response = await getStatisticalOfTime();
        setStatisticalData(response.data);
      } catch (err) {
        setError(err);
      }
    };

    fetchStatisticalData();
  }, []);

  useEffect(() => {
    const fetchInstrument = async () => {
      try {
        const response = await getNameAndIdInstrument();
        setInstrumentData(response.data);
      } catch (error) {
        setError(error);
      }
    };

    fetchInstrument();
  }, []);

  const handleInstrumentSelect = async (event) => {
    const instrumentId = event.target.value;
    setSelectedInstrumentId(instrumentId);
    
    // Fetch revenue data when an instrument is selected
    if (instrumentId) {
      try {
        const response = await getRevenueInstrumentByInstrumentId(instrumentId);
        setRevenueData(response.data);
      } catch (error) {
        setError(error);
      }
    } else {
      setRevenueData(null); // Reset revenue data if no instrument is selected
    }
  };

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  if (!statisticalData) {
    return <div>Loading...</div>;
  }

  const {
    mostSoldToday,
    leastSoldToday,
    mostSoldThisWeek,
    leastSoldThisWeek,
    mostSoldThisMonth,
    leastSoldThisMonth,
  } = statisticalData;

  const selectedInstrument = instrumentData?.find(
    (instrument) => instrument.instrumentId === selectedInstrumentId
  );

  const revenueChartData = {
    labels: ['Today', 'This Week', 'This Month', 'This Year'],
    datasets: [
      {
        label: selectedInstrument ? selectedInstrument.instrumentName : 'Instrument Revenue',
        data: [
          revenueData?.revenueOfDay || 0,
          revenueData?.revenueOfWeek || 0,
          revenueData?.revenueOfMonth || 0,
          revenueData?.revenueOfYear || 0,
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="container">
      {/* Instrument the most */}
      <section className="row mt-5">
        <div className="col-12">
          <h5>Instrument sales the most</h5>
        </div>
        <div className="col-4">
          <h6>Of Day:</h6>
          {mostSoldToday.map((instrument) => (
            <div key={instrument.id}>
              <p>Instrument Name: {instrument.instrumentName}</p>
              <p>Total Sold: {instrument.totalSold}</p>
            </div>
          ))}
        </div>
        <div className="col-4">
          <h6>Of Week:</h6>
          {mostSoldThisWeek.map((instrument) => (
            <div key={instrument.id}>
              <p>Instrument Name: {instrument.instrumentName}</p>
              <p>Total Sold: {instrument.totalSold}</p>
            </div>
          ))}
        </div>
        <div className="col-4">
          <h6>Of Month:</h6>
          {mostSoldThisMonth.map((instrument) => (
            <div key={instrument.id}>
              <p>Instrument Name: {instrument.instrumentName}</p>
              <p>Total Sold: {instrument.totalSold}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Instrument the least */}
      <section className="row mt-5">
        <div className="col-12">
          <h5>Instrument sales the least</h5>
        </div>
        <div className="col-4">
          <h6>Of Day:</h6>
          {leastSoldToday.map((instrument) => (
            <div key={instrument.id}>
              <p>Instrument Name: {instrument.instrumentName}</p>
              <p>Total Sold: {instrument.totalSold || 0}</p>
            </div>
          ))}
        </div>
        <div className="col-4">
          <h6>Of Week:</h6>
          {leastSoldThisWeek.map((instrument) => (
            <div key={instrument.id}>
              <p>Instrument Name: {instrument.instrumentName}</p>
              <p>Total Sold: {instrument.totalSold || 0}</p>
            </div>
          ))}
        </div>
        <div className="col-4">
          <h6>Of Month:</h6>
          {leastSoldThisMonth.map((instrument) => (
            <div key={instrument.id}>
              <p>Instrument Name: {instrument.instrumentName}</p>
              <p>Total Sold: {instrument.totalSold || 0}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Instrument Select */}
      <section className="row mt-5">
        <div className="col-3">
          <label className="form-label">Select instrument</label>
          <select
            className="form-select"
            value={selectedInstrumentId}
            onChange={handleInstrumentSelect}
          >
            <option value="">Select instruments</option>
            {instrumentData?.map((instrument) => (
              <option key={instrument.instrumentId} value={instrument.instrumentId}>
                {instrument.instrumentName}
              </option>
            ))}
          </select>
        </div>

        {/* Chart revenue instrument by instrument id */}
        <div className='row mt-4'>
          <h5>Revenue of instrument:</h5>
          <div className='col'>
            <Line data={revenueChartData} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default StatisticalInstrument;
