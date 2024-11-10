import React, { useEffect, useState } from 'react';
import {
  getRevenueInstrumentByInstrumentId, getNameAndIdInstrument,
  getStatisticalOfTimeInstrument
} from '../../service/EcommerceStatistical';
import { Line } from 'react-chartjs-2';

const StatisticalInstrument = () => {
  const [instrumentSoldData, setinstrumentSoldData] = useState(null);
  const [error, setError] = useState(null);

  const [instrumentData, setInstrumentData] = useState(null);
  const [selectedInstrumentId, setSelectedInstrumentId] = useState("");
  const [revenueData, setRevenueData] = useState(null);

  // total sold instrument
  useEffect(() => {
    const instrumentData = async () => {
      try {
        const response = await getStatisticalOfTimeInstrument();
        setinstrumentSoldData(response.data);
      } catch (err) {
        setError(err);
      }
    };

    instrumentData();
  }, []);

  // id and name instrument 
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

  if (!instrumentSoldData) {
    return <div>Loading...</div>;
  }

  const {
    mostSoldToday,
    leastSoldToday,
    mostSoldThisWeek,
    leastSoldThisWeek,
    mostSoldThisMonth,
    leastSoldThisMonth,
  } = instrumentSoldData;

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

  const getCurrentDate = (period) => {
    const date = new Date();
    if (period === 'day') return date.toLocaleDateString();
    if (period === 'week') {
      const startDate = new Date(date.setDate(date.getDate() - date.getDay()));
      const endDate = new Date(startDate.setDate(startDate.getDate() + 6));
      return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
    }
    if (period === 'month') {
      return `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
    }
    return date.toLocaleDateString();
  };


  return (
    <div className="container">
      {/* Instrument the most */}
      <section className="row mt-5">
        <div className="col-12">
          <h5>Instrument sales the most</h5>
        </div>
        <div className="col-12">
          <h6 className='text-center'>Of Day: {getCurrentDate('day')}</h6>
          <table className='table table-bordered'>
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }} scope='col'>#</th>
                <th style={{ textAlign: 'center' }} scope='col'>Image</th>
                <th style={{ textAlign: 'center' }} scope='col'>Instrument name</th>
                <th style={{ textAlign: 'center' }} scope='col'>Cost price</th>
                <th style={{ textAlign: 'center' }} scope='col'>Original quantity</th>
                <th style={{ textAlign: 'center' }} scope='col'>Quantity sold</th>
                <th style={{ textAlign: 'center' }} scope='col'>Remaining quantity</th>
              </tr>
            </thead>
            <tbody className='table-group-divider'>
              {mostSoldToday.map((instrument, index) => (
                <tr key={instrument.instrumentId}>
                  <td style={{ textAlign: 'center' }}>{index + 1}</td>
                  <td style={{ textAlign: 'center' }}>
                    <img src={instrument.image} alt="" style={{ width: '50px' }} />
                  </td>
                  <td style={{ textAlign: 'center' }}>{instrument.instrumentName}</td>
                  <td style={{ textAlign: 'center' }}>{instrument.costPrice}</td>
                  <td style={{ textAlign: 'center' }}>{instrument.quantity + instrument.totalSold}</td>
                  <th style={{ textAlign: 'center' }}>{instrument.totalSold}</th>
                  <td style={{ textAlign: 'center' }}>{instrument.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
        <div className="col-12 mt-3">
          <h6 className='text-center'>Current Week</h6>
          <table className='table table-bordered'>
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }} scope='col'>#</th>
                <th style={{ textAlign: 'center' }} scope='col'>Image</th>
                <th style={{ textAlign: 'center' }} scope='col'>Instrument name</th>
                <th style={{ textAlign: 'center' }} scope='col'>Cost price</th>
                <th style={{ textAlign: 'center' }} scope='col'>Original quantity</th>
                <th style={{ textAlign: 'center' }} scope='col'>Quantity sold</th>
                <th style={{ textAlign: 'center' }} scope='col'>Remaining quantity</th>
              </tr>
            </thead>
            <tbody className='table-group-divider'>
              {mostSoldThisWeek.map((instrument, index) => (
                <tr key={instrument.instrumentId}>
                  <td style={{ textAlign: 'center' }}>{index + 1}</td>
                  <td style={{ textAlign: 'center' }}>
                    <img src={instrument.image} alt="" style={{ width: '50px' }} />
                  </td>
                  <td style={{ textAlign: 'center' }}>{instrument.instrumentName}</td>
                  <td style={{ textAlign: 'center' }}>{instrument.costPrice}</td>
                  <td style={{ textAlign: 'center' }}>{instrument.quantity + instrument.totalSold}</td>
                  <th style={{ textAlign: 'center' }}>{instrument.totalSold}</th>
                  <td style={{ textAlign: 'center' }}>{instrument.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
        <div className="col-12 mt-3">
          <h6 className='text-center'>Of Month:</h6>
          <table className='table table-bordered'>
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }} scope='col'>#</th>
                <th style={{ textAlign: 'center' }} scope='col'>Image</th>
                <th style={{ textAlign: 'center' }} scope='col'>Instrument name</th>
                <th style={{ textAlign: 'center' }} scope='col'>Cost price</th>
                <th style={{ textAlign: 'center' }} scope='col'>Original quantity</th>
                <th style={{ textAlign: 'center' }} scope='col'>Quantity sold</th>
                <th style={{ textAlign: 'center' }} scope='col'>Remaining quantity</th>
              </tr>
            </thead>
            <tbody className='table-group-divider'>
              {mostSoldThisMonth.map((instrument, index) => (
                <tr key={instrument.instrumentId}>
                  <td style={{ textAlign: 'center' }}>{index + 1}</td>
                  <td style={{ textAlign: 'center' }}>
                    <img src={instrument.image} alt="" style={{ width: '50px' }} />
                  </td>
                  <td style={{ textAlign: 'center' }}>{instrument.instrumentName}</td>
                  <td style={{ textAlign: 'center' }}>{instrument.costPrice}</td>
                  <td style={{ textAlign: 'center' }}>{instrument.quantity + instrument.totalSold}</td>
                  <th style={{ textAlign: 'center' }}>{instrument.totalSold}</th>
                  <td style={{ textAlign: 'center' }}>{instrument.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </section>

      {/* Instrument the least */}
      <section className="row mt-5">
        <div className="col-12">
          <h5 className='text-center'>Instrument sales the least</h5>
        </div>
        <div className="col-12 mt-3">
          <h6 className='text-center'>Of Day:</h6>
          <table className='table table-bordered'>
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }} scope='col'>#</th>
                <th style={{ textAlign: 'center' }} scope='col'>Image</th>
                <th style={{ textAlign: 'center' }} scope='col'>Instrument name</th>
                <th style={{ textAlign: 'center' }} scope='col'>Cost price</th>
                <th style={{ textAlign: 'center' }} scope='col'>Original quantity</th>
                <th style={{ textAlign: 'center' }} scope='col'>Quantity sold</th>
                <th style={{ textAlign: 'center' }} scope='col'>Remaining quantity</th>
              </tr>
            </thead>
            <tbody className='table-group-divider'>
              {leastSoldToday.map((instrument, index) => (
                <tr key={instrument.instrumentId}>
                  <td style={{ textAlign: 'center' }}>{index + 1}</td>
                  <td style={{ textAlign: 'center' }}>
                    <img src={instrument.image} alt="" style={{ width: '50px' }} />
                  </td>
                  <td style={{ textAlign: 'center' }}>{instrument.instrumentName}</td>
                  <td style={{ textAlign: 'center' }}>{instrument.costPrice}</td>
                  <td style={{ textAlign: 'center' }}>{instrument.quantity + instrument.totalSold}</td>
                  <th style={{ textAlign: 'center' }}>{instrument.totalSold}</th>
                  <td style={{ textAlign: 'center' }}>{instrument.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
        <div className="col-12 mt-3">
          <h6 className='text-center'>Of Week:</h6>
          <table className='table table-bordered'>
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }} scope='col'>#</th>
                <th style={{ textAlign: 'center' }} scope='col'>Image</th>
                <th style={{ textAlign: 'center' }} scope='col'>Instrument name</th>
                <th style={{ textAlign: 'center' }} scope='col'>Cost price</th>
                <th style={{ textAlign: 'center' }} scope='col'>Original quantity</th>
                <th style={{ textAlign: 'center' }} scope='col'>Quantity sold</th>
                <th style={{ textAlign: 'center' }} scope='col'>Remaining quantity</th>
              </tr>
            </thead>
            <tbody className='table-group-divider'>
              {leastSoldThisWeek.map((instrument, index) => (
                <tr key={instrument.instrumentId}>
                  <td style={{ textAlign: 'center' }}>{index + 1}</td>
                  <td style={{ textAlign: 'center' }}>
                    <img src={instrument.image} alt="" style={{ width: '50px' }} />
                  </td>
                  <td style={{ textAlign: 'center' }}>{instrument.instrumentName}</td>
                  <td style={{ textAlign: 'center' }}>{instrument.costPrice}</td>
                  <td style={{ textAlign: 'center' }}>{instrument.quantity + instrument.totalSold}</td>
                  <th style={{ textAlign: 'center' }}>{instrument.totalSold}</th>
                  <td style={{ textAlign: 'center' }}>{instrument.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
        <div className="col-12 mt-3">
          <h6 className='text-center'>Of Month:</h6>
          <table className='table table-bordered'>
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }} scope='col'>#</th>
                <th style={{ textAlign: 'center' }} scope='col'>Image</th>
                <th style={{ textAlign: 'center' }} scope='col'>Instrument name</th>
                <th style={{ textAlign: 'center' }} scope='col'>Cost price</th>
                <th style={{ textAlign: 'center' }} scope='col'>Original quantity</th>
                <th style={{ textAlign: 'center' }} scope='col'>Quantity sold</th>
                <th style={{ textAlign: 'center' }} scope='col'>Remaining quantity</th>
              </tr>
            </thead>
            <tbody>
              {leastSoldThisMonth.map((instrument, index) => (
                <tr key={instrument.instrumentId}>
                  <td style={{ textAlign: 'center' }}>{index + 1}</td>
                  <td style={{ textAlign: 'center' }}>
                    <img src={instrument.image} alt="" style={{ width: '50px' }} />
                  </td>
                  <td style={{ textAlign: 'center' }}>{instrument.instrumentName}</td>
                  <td style={{ textAlign: 'center' }}>{instrument.costPrice}</td>
                  <td style={{ textAlign: 'center' }}>{instrument.quantity + instrument.totalSold}</td>
                  <th style={{ textAlign: 'center' }}>{instrument.totalSold}</th>
                  <td style={{ textAlign: 'center' }}>{instrument.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
