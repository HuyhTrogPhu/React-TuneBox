import React, { useEffect, useState } from 'react';
import { getStatisticalOfTime } from '../../service/EcommerceStatistical';

const StatisticalInstrument = () => {
  const [statisticalData, setStatisticalData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatisticalData = async () => {
      try {
        const response = await getStatisticalOfTime();
        setStatisticalData(response.data);
        console.log(response.data);
      } catch (err) {
        setError(err);
      }
    };

    fetchStatisticalData();
  }, []);

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
    statisticalInstruments,
  } = statisticalData;

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
              <p>Total Sold: {instrument.totalSold  || 0}</p>
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

      {/* Instrument select */}
      <section className="row mt-5">
        <div className="col-4">
          <label className="form-label">Select instrument</label>
          <select className="form-select">
            {statisticalInstruments?.map((instrument) => (
              <option key={instrument.id} value={instrument.id}>
                {instrument.name}
              </option>
            ))}
          </select>
        </div>
      </section>
    </div>
  );
};

export default StatisticalInstrument;
