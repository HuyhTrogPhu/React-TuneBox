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
    instrumentSalesTheMostOfDay,
    instrumentSalesTheMostOfWeek,
    instrumentSalesTheMostOfMonth,
    instrumentSalesTheLeastOfDay,
    instrumentSalesTheLeastOfWeek,
    instrumentSalesTheLeastOfMonth,
    statisticalInstrument,
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
          {instrumentSalesTheMostOfDay.map((instrument) => (
            <div key={instrument.id}>
              <p>Instrument Name: {instrument.name}</p>
              <p>Total Sold: {instrument.totalSold}</p>
            </div>
          ))}
        </div>
        <div className="col-4">
          <h6>Of Week:</h6>
          {instrumentSalesTheMostOfWeek.map((instrument) => (
            <div key={instrument.id}>
              <p>Instrument Name: {instrument.name}</p>
              <p>Total Sold: {instrument.totalSold}</p>
            </div>
          ))}
        </div>
        <div className="col-4">
          <h6>Of Month:</h6>
          {instrumentSalesTheMostOfMonth.map((instrument) => (
            <div key={instrument.id}>
              <p>Instrument Name: {instrument.name}</p>
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
          {instrumentSalesTheLeastOfDay.map((instrument) => (
            <div key={instrument.id}>
              <p>Instrument Name: {instrument.name}</p>
              <p>Total Sold: {instrument.totalSold}</p>
            </div>
          ))}
        </div>
        <div className="col-4">
          <h6>Of Week:</h6>
          {instrumentSalesTheLeastOfWeek.map((instrument) => (
            <div key={instrument.id}>
              <p>Instrument Name: {instrument.name}</p>
              <p>Total Sold: {instrument.totalSold}</p>
            </div>
          ))}
        </div>
        <div className="col-4">
          <h6>Of Month:</h6>
          {instrumentSalesTheLeastOfMonth.map((instrument) => (
            <div key={instrument.id}>
              <p>Instrument Name: {instrument.name}</p>
              <p>Total Sold: {instrument.totalSold}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Instrument select */}
      <section className="row mt-5">
        <div className="col-4">
          <label className="form-label">Select instrument</label>
          <select className="form-select">
            {statisticalInstrument?.map((instrument) => (
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
