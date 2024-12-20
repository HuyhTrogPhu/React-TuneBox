import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { getNameAndIdBrand, getRevenueBrandByBrandId, getStatisticalOfTimeBrand } from '../../service/EcommerceStatistical';

const StatisticalBrand = () => {
  const [brandSoldData, setBrandSoldData] = useState(null);
  const [error, seterror] = useState(null);
  const [brandData, setBrandData] = useState(null);
  const [selectedBrandId, setSelectedBrandId] = useState('');
  const [revenueData, setRevenueData] = useState(null);

  // total sold brand
  useEffect(() => {
    const brandData = async () => {
      try {
        const response = await getStatisticalOfTimeBrand();
        setBrandSoldData(response.data);
      } catch (error) {
        seterror(error);
      }
    };
    brandData();
  }, []);

  // id and name brand 
  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const response = await getNameAndIdBrand();
        setBrandData(response.data);
      } catch (error) {
        seterror(error);
      }
    };
    fetchBrand();
  }, []);

  const handleBrandSelectect = async (event) => {
    const brandId = event.target.value;
    setSelectedBrandId(brandId);

    if (brandId) {
      try {
        const response = await getRevenueBrandByBrandId(brandId);
        setRevenueData(response.data);
      } catch (error) {
        seterror(error);
      }
    } else {
      setRevenueData(null);
    }
  };

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  if (!brandSoldData) {
    return <div>Loading...</div>;
  }

  const {
    mostSoldToday,
    leastSoldToday,
    mostSoldThisWeek,
    leastSoldThisWeek,
    mostSoldThisMonth,
    leastSoldThisMonth,
  } = brandSoldData;

  const selectedBrand = brandData?.find(
    (brand) => brand.brandId === selectedBrandId
  );

  const revenueChartData = {
    labels: ['Today', 'This Week', 'This Month', 'This Year'],
    datasets: [
      {
        label: selectedBrand ? selectedBrand.brandName : 'Brand Revenue',
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
      {/* Brand the most */}
      <section className="row mt-5">
        <div className="col-12">
          <h5 className='text-center'>Brand sales the most</h5>
        </div>
        <div className="col-12">
          <h6 className='text-center'>Current Day</h6>
          <table className='table table-bordered'>
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }} scope='col'>#</th>
                <th style={{ textAlign: 'center' }} scope='col'>Image</th>
                <th style={{ textAlign: 'center' }} scope='col'>Instrument name</th>
                <th style={{ textAlign: 'center' }} scope='col'>Brand name</th>
                <th style={{ textAlign: 'center' }} scope='col'>Cost price</th>
                <th style={{ textAlign: 'center' }} scope='col'>Original quantity</th>
                <th style={{ textAlign: 'center' }} scope='col'>Quantity sold</th>
                <th style={{ textAlign: 'center' }} scope='col'>Remaining quantity</th>
              </tr>
            </thead>
            <tbody className='table-group-divider'>
              {mostSoldToday.map((brand, index) => (
                <tr key={brand.brandId}>
                  <td style={{ textAlign: 'center' }}>{index + 1}</td>
                  <td style={{ textAlign: 'center' }}><img src={brand.image} alt="" style={{ width: '50px' }} /></td>
                  <td style={{ textAlign: 'center' }}>{brand.instrumentName}</td>
                  <td style={{ textAlign: 'center' }}>{brand.brandName}</td>
                  <td style={{ textAlign: 'center' }}>{brand.costPrice.toLocaleString('vi')} VND</td>
                  <td style={{ textAlign: 'center' }}>{brand.quantity + brand.totalSold}</td>
                  <td style={{ textAlign: 'center' }}>{brand.totalSold}</td>
                  <td style={{ textAlign: 'center' }}>{brand.quantity}</td>
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
                <th style={{ textAlign: 'center' }} scope='col'>Brand name</th>
                <th style={{ textAlign: 'center' }} scope='col'>Cost price</th>
                <th style={{ textAlign: 'center' }} scope='col'>Original quantity</th>
                <th style={{ textAlign: 'center' }} scope='col'>Quantity sold</th>
                <th style={{ textAlign: 'center' }} scope='col'>Remaining quantity</th>
              </tr>
            </thead>
            <tbody className='table-group-divider'>
              {mostSoldThisWeek.map((brand, index) => (
                <tr key={brand.brandId}>
                  <td style={{ textAlign: 'center' }}>{index + 1}</td>
                  <td style={{ textAlign: 'center' }}><img src={brand.image} alt="" style={{ width: '50px' }} /></td>
                  <td style={{ textAlign: 'center' }}>{brand.instrumentName}</td>
                  <td style={{ textAlign: 'center' }}>{brand.brandName}</td>
                  <td style={{ textAlign: 'center' }}>{brand.costPrice.toLocaleString('vi')} VND</td>
                  <td style={{ textAlign: 'center' }}>{brand.quantity + brand.totalSold}</td>
                  <td style={{ textAlign: 'center' }}>{brand.totalSold}</td>
                  <td style={{ textAlign: 'center' }}>{brand.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-12 mt-3">
          <h6 className='text-center'>Current Month</h6>
          <table className='table table-bordered'>
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }} scope='col'>#</th>
                <th style={{ textAlign: 'center' }} scope='col'>Image</th>
                <th style={{ textAlign: 'center' }} scope='col'>Instrument name</th>
                <th style={{ textAlign: 'center' }} scope='col'>Brand name</th>
                <th style={{ textAlign: 'center' }} scope='col'>Cost price</th>
                <th style={{ textAlign: 'center' }} scope='col'>Original quantity</th>
                <th style={{ textAlign: 'center' }} scope='col'>Quantity sold</th>
                <th style={{ textAlign: 'center' }} scope='col'>Remaining quantity</th>
              </tr>
            </thead>
            <tbody className='table-group-divider'>
              {mostSoldThisMonth.map((brand, index) => (
                <tr key={brand.brandId}>
                  <td style={{ textAlign: 'center' }}>{index + 1}</td>
                  <td style={{ textAlign: 'center' }}><img src={brand.image} alt="" style={{ width: '50px' }} /></td>
                  <td style={{ textAlign: 'center' }}>{brand.instrumentName}</td>
                  <td style={{ textAlign: 'center' }}>{brand.brandName}</td>
                  <td style={{ textAlign: 'center' }}>{brand.costPrice.toLocaleString('vi')} VND</td>
                  <td style={{ textAlign: 'center' }}>{brand.quantity + brand.totalSold}</td>
                  <td style={{ textAlign: 'center' }}>{brand.totalSold}</td>
                  <td style={{ textAlign: 'center' }}>{brand.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Brand the least */}
        <section className="row mt-5">
          <div className="col-12">
            <h5 className='text-center'>Brand sales the least</h5>
          </div>
          <div className="col-12 mt-3">
            <h6 className='text-center'>Current Day</h6>
            <table className='table table-bordered'>
              <thead>
                <tr>
                  <th style={{ textAlign: 'center' }} scope='col'>#</th>
                  <th style={{ textAlign: 'center' }} scope='col'>Image</th>
                  <th style={{ textAlign: 'center' }} scope='col'>Instrument name</th>
                  <th style={{ textAlign: 'center' }} scope='col'>Brand name</th>
                  <th style={{ textAlign: 'center' }} scope='col'>Cost price</th>
                  <th style={{ textAlign: 'center' }} scope='col'>Original quantity</th>
                  <th style={{ textAlign: 'center' }} scope='col'>Quantity sold</th>
                  <th style={{ textAlign: 'center' }} scope='col'>Remaining quantity</th>
                </tr>
              </thead>
              <tbody className='table-group-divider'>
                {leastSoldToday.map((brand, index) => (
                  <tr key={brand.brandId}>
                    <td style={{ textAlign: 'center' }}>{index + 1}</td>
                    <td style={{ textAlign: 'center' }}>
                      <img src={brand.image} alt="" style={{ width: '50px' }} />
                    </td>
                    <td style={{ textAlign: 'center' }}>{brand.instrumentName}</td>
                    <td style={{ textAlign: 'center' }}>{brand.brandName}</td>
                    <td style={{ textAlign: 'center' }}>{brand.costPrice.toLocaleString('vi')} VND</td>
                    <td style={{ textAlign: 'center' }}>{brand.quantity + brand.totalSold}</td>
                    <td style={{ textAlign: 'center' }}>{brand.totalSold}</td>
                    <td style={{ textAlign: 'center' }}>{brand.quantity}</td>
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
                  <th style={{ textAlign: 'center' }} scope='col'>Brand name</th>
                  <th style={{ textAlign: 'center' }} scope='col'>Cost price</th>
                  <th style={{ textAlign: 'center' }} scope='col'>Original quantity</th>
                  <th style={{ textAlign: 'center' }} scope='col'>Quantity sold</th>
                  <th style={{ textAlign: 'center' }} scope='col'>Remaining quantity</th>
                </tr>
              </thead>
              <tbody className='table-group-divider'>
                {leastSoldThisWeek.map((brand, index) => (
                  <tr key={brand.brandId}>
                    <td style={{ textAlign: 'center' }}>{index + 1}</td>
                    <td style={{ textAlign: 'center' }}>
                      <img src={brand.image} alt="" style={{ width: '50px' }} />
                    </td>
                    <td style={{ textAlign: 'center' }}>{brand.instrumentName}</td>
                    <td style={{ textAlign: 'center' }}>{brand.brandName}</td>
                    <td style={{ textAlign: 'center' }}>{brand.costPrice.toLocaleString('vi')} VND</td>
                    <td style={{ textAlign: 'center' }}>{brand.quantity + brand.totalSold}</td>
                    <td style={{ textAlign: 'center' }}>{brand.totalSold}</td>
                    <td style={{ textAlign: 'center' }}>{brand.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
          <div className="col-12 mt-3">
            <h6 className='text-center'>Current Month</h6>
            <table className='table table-bordered'>
              <thead>
                <tr>
                  <th style={{ textAlign: 'center' }} scope='col'>#</th>
                  <th style={{ textAlign: 'center' }} scope='col'>Image</th>
                  <th style={{ textAlign: 'center' }} scope='col'>Instrument name</th>
                  <th style={{ textAlign: 'center' }} scope='col'>Brand name</th>
                  <th style={{ textAlign: 'center' }} scope='col'>Cost price</th>
                  <th style={{ textAlign: 'center' }} scope='col'>Original quantity</th>
                  <th style={{ textAlign: 'center' }} scope='col'>Quantity sold</th>
                  <th style={{ textAlign: 'center' }} scope='col'>Remaining quantity</th>
                </tr>
              </thead>
              <tbody className='table-group-divider'>
                {leastSoldThisMonth.map((brand, index) => (
                  <tr key={brand.brandId}>
                    <td style={{ textAlign: 'center' }}>{index + 1}</td>
                    <td style={{ textAlign: 'center' }}>
                      <img src={brand.image} alt="" style={{ width: '50px' }} />
                    </td>
                    <td style={{ textAlign: 'center' }}>{brand.instrumentName}</td>
                    <td style={{ textAlign: 'center' }}>{brand.brandName}</td>
                    <td style={{ textAlign: 'center' }}>{brand.costPrice.toLocaleString('vi')} VND</td>
                    <td style={{ textAlign: 'center' }}>{brand.quantity + brand.totalSold}</td>
                    <td style={{ textAlign: 'center' }}>{brand.totalSold}</td>
                    <td style={{ textAlign: 'center' }}>{brand.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className='row mt-5'>
          {/* Select brand */}
          <div className="col-3">
            <label className="form-label">Select brand</label>
            <select
              className="form-select"
              value={selectedBrandId}
              onChange={handleBrandSelectect}
            >
              <option value="">Select brands</option>
              {brandData?.map((brand) => (
                <option key={brand.brandId} value={brand.brandId}>
                  {brand.brandName}
                </option>
              ))}
            </select>
          </div>
          {/* Chart revenue category by category id */}
          <div className='row mt-4'>
            <h5>Revenue of brand:</h5>
            <div className='col'>
              <Line data={revenueChartData} />
            </div>
          </div>
        </section>

      </section>
    </div>
  );
};

export default StatisticalBrand;
