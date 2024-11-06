import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2';
import { getNameAndIdCategory, getRevenueCategoryByCategoryId, getStatisticalOfTimeBrand, getStatisticalOfTimeCategory } from '../../service/EcommerceStatistical';

const StatisticalCategory = () => {
  const [categorySoldData, setCategorySoldData] = useState(null);
  const [error, seterror] = useState(null);

  const [categoryData, setCategoryData] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [revenueData, setRevenueData] = useState(null);


  // total sold category
  useEffect(() => {
    const categoryData = async () => {
      try {
        const response = await getStatisticalOfTimeCategory();
        setCategorySoldData(response.data);
      } catch (error) {
        seterror(error);
      }
    };
    categoryData();
  }, []);

  // id and name category
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await getNameAndIdCategory();
        setCategoryData(response.data);
      } catch (error) {
        seterror(error);
      }
    };
    fetchCategory();
  }, []);

  const handleCategorySelectect = async (event) => {
    const categoryId = event.target.value;
    setSelectedCategoryId(categoryId);

    if (categoryId) {
      try {
        const response = await getRevenueCategoryByCategoryId(categoryId);
        setRevenueData(response.data);
      } catch (error) {
        seterror(error)
      }
    } else {
      setRevenueData(null);
    }
  }

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  if (!categorySoldData) {
    return <div>Loading...</div>;
  }

  const {
    mostSoldToday,
    leastSoldToday,
    mostSoldThisWeek,
    leastSoldThisWeek,
    mostSoldThisMonth,
    leastSoldThisMonth,
  } = categorySoldData;

  const selectedCategory = categoryData?.find(
    (category) => category.categoryId === selectedCategoryId
  );

  const revenueChartData = {
    labels: ['Today', 'This Week', 'This Month', 'This Year'],
    datasets: [
      {
        label: selectedCategory ? selectedCategory.categoryName : 'Category Revenue',
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
      {/* Category the most */}
      <section className="row mt-5">
        <div className="col-12">
          <h5 className='text-center'>Category sales the most</h5>
        </div>
        <div className="col-12 mt-3">
          <h6 className='text-center'>Of Day:</h6>
          <table className='table border'>
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }} scope='col'>#</th>
                <th style={{ textAlign: 'center' }} scope='col'>Image</th>
                <th style={{ textAlign: 'center' }} scope='col'>Instrument name</th>
                <th style={{ textAlign: 'center' }} scope='col'>Categrory name</th>
                <th style={{ textAlign: 'center' }} scope='col'>Cost price</th>
                <th style={{ textAlign: 'center' }} scope='col'>Original quantity</th>
                <th style={{ textAlign: 'center' }} scope='col'>Quantity sold</th>
                <th style={{ textAlign: 'center' }} scope='col'>Remaining quantity</th>
              </tr>
            </thead>
            <tbody>
              {mostSoldToday.map((category, index) => (
                <tr key={category.categoryId}>
                  <td style={{ textAlign: 'center' }}>{index + 1}</td>
                  <td style={{ textAlign: 'center' }}>
                    <img src={category.image} alt="" style={{ width: '50px' }} />
                  </td>
                  <td style={{ textAlign: 'center' }}>{category.instrumentName}</td>
                  <td style={{ textAlign: 'center' }}>{category.categoryName}</td>
                  <td style={{ textAlign: 'center' }}>{category.costPrice}</td>
                  <td style={{ textAlign: 'center' }}>{category.quantity + category.totalSold}</td>
                  <td style={{ textAlign: 'center' }}>{category.totalSold}</td>
                  <td style={{ textAlign: 'center' }}>{category.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
        <div className="col-12 mt-3">
          <h6 className='text-center'>Of Week:</h6>
          <table className='table border'>
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }} scope='col'>#</th>
                <th style={{ textAlign: 'center' }} scope='col'>Image</th>
                <th style={{ textAlign: 'center' }} scope='col'>Instrument name</th>
                <th style={{ textAlign: 'center' }} scope='col'>Categrory name</th>
                <th style={{ textAlign: 'center' }} scope='col'>Cost price</th>
                <th style={{ textAlign: 'center' }} scope='col'>Original quantity</th>
                <th style={{ textAlign: 'center' }} scope='col'>Quantity sold</th>
                <th style={{ textAlign: 'center' }} scope='col'>Remaining quantity</th>
              </tr>
            </thead>
            <tbody>
              {mostSoldThisWeek.map((category, index) => (
                <tr key={category.categoryId}>
                  <td style={{ textAlign: 'center' }}>{index + 1}</td>
                  <td style={{ textAlign: 'center' }}>
                    <img src={category.image} alt="" style={{ width: '50px' }} />
                  </td>
                  <td style={{ textAlign: 'center' }}>{category.instrumentName}</td>
                  <td style={{ textAlign: 'center' }}>{category.categoryName}</td>
                  <td style={{ textAlign: 'center' }}>{category.costPrice}</td>
                  <td style={{ textAlign: 'center' }}>{category.quantity + category.totalSold}</td>
                  <td style={{ textAlign: 'center' }}>{category.totalSold}</td>
                  <td style={{ textAlign: 'center' }}>{category.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
        <div className="col-12 mt-3">
          <h6 className='text-center'>Of Month:</h6>
          <table className='table border'>
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }} scope='col'>#</th>
                <th style={{ textAlign: 'center' }} scope='col'>Image</th>
                <th style={{ textAlign: 'center' }} scope='col'>Instrument name</th>
                <th style={{ textAlign: 'center' }} scope='col'>Categrory name</th>
                <th style={{ textAlign: 'center' }} scope='col'>Cost price</th>
                <th style={{ textAlign: 'center' }} scope='col'>Original quantity</th>
                <th style={{ textAlign: 'center' }} scope='col'>Quantity sold</th>
                <th style={{ textAlign: 'center' }} scope='col'>Remaining quantity</th>
              </tr>
            </thead>
            <tbody>
              {mostSoldThisMonth.map((category, index) => (
                <tr key={category.categoryId}>
                  <td style={{ textAlign: 'center' }}>{index + 1}</td>
                  <td style={{ textAlign: 'center' }}>
                    <img src={category.image} alt="" style={{ width: '50px' }} />
                  </td>
                  <td style={{ textAlign: 'center' }}>{category.instrumentName}</td>
                  <td style={{ textAlign: 'center' }}>{category.categoryName}</td>
                  <td style={{ textAlign: 'center' }}>{category.costPrice}</td>
                  <td style={{ textAlign: 'center' }}>{category.quantity + category.totalSold}</td>
                  <td style={{ textAlign: 'center' }}>{category.totalSold}</td>
                  <td style={{ textAlign: 'center' }}>{category.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </section>

      {/* Category the least */}
      <section className="row mt-5">
        <div className="col-12">
          <h5 className='text-center'>Category sales the least</h5>
        </div>
        <div className="col-12 mt-3">
          <h6 className='text-center'>Of Day:</h6>
          <table className='table border'>
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }} scope='col'>#</th>
                <th style={{ textAlign: 'center' }} scope='col'>Image</th>
                <th style={{ textAlign: 'center' }} scope='col'>Instrument name</th>
                <th style={{ textAlign: 'center' }} scope='col'>Categrory name</th>
                <th style={{ textAlign: 'center' }} scope='col'>Cost price</th>
                <th style={{ textAlign: 'center' }} scope='col'>Original quantity</th>
                <th style={{ textAlign: 'center' }} scope='col'>Quantity sold</th>
                <th style={{ textAlign: 'center' }} scope='col'>Remaining quantity</th>
              </tr>
            </thead>
            <tbody>
              {leastSoldToday.map((category, index) => (
                <tr key={category.categoryId}>
                  <td style={{ textAlign: 'center' }}>{index + 1}</td>
                  <td style={{ textAlign: 'center' }}>
                    <img src={category.image} alt="" style={{ width: '50px' }} />
                  </td>
                  <td style={{ textAlign: 'center' }}>{category.instrumentName}</td>
                  <td style={{ textAlign: 'center' }}>{category.categoryName}</td>
                  <td style={{ textAlign: 'center' }}>{category.costPrice}</td>
                  <td style={{ textAlign: 'center' }}>{category.quantity + category.totalSold}</td>
                  <td style={{ textAlign: 'center' }}>{category.totalSold}</td>
                  <td style={{ textAlign: 'center' }}>{category.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
        <div className="col-12 mt-3">
          <h6 className='text-center'>Of Week:</h6>
          <table className='table border'>
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }} scope='col'>#</th>
                <th style={{ textAlign: 'center' }} scope='col'>Image</th>
                <th style={{ textAlign: 'center' }} scope='col'>Instrument name</th>
                <th style={{ textAlign: 'center' }} scope='col'>Categrory name</th>
                <th style={{ textAlign: 'center' }} scope='col'>Cost price</th>
                <th style={{ textAlign: 'center' }} scope='col'>Original quantity</th>
                <th style={{ textAlign: 'center' }} scope='col'>Quantity sold</th>
                <th style={{ textAlign: 'center' }} scope='col'>Remaining quantity</th>
              </tr>
            </thead>
            <tbody>
              {leastSoldThisWeek.map((category, index) => (
                <tr key={category.categoryId}>
                  <td style={{ textAlign: 'center' }}>{index + 1}</td>
                  <td style={{ textAlign: 'center' }}>
                    <img src={category.image} alt="" style={{ width: '50px' }} />
                  </td>
                  <td style={{ textAlign: 'center' }}>{category.instrumentName}</td>
                  <td style={{ textAlign: 'center' }}>{category.categoryName}</td>
                  <td style={{ textAlign: 'center' }}>{category.costPrice}</td>
                  <td style={{ textAlign: 'center' }}>{category.quantity + category.totalSold}</td>
                  <td style={{ textAlign: 'center' }}>{category.totalSold}</td>
                  <td style={{ textAlign: 'center' }}>{category.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
        <div className="col-12 mt-3">
          <h6 className='text-center'>Of Month:</h6>
          <table className='table border'>
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }} scope='col'>#</th>
                <th style={{ textAlign: 'center' }} scope='col'>Image</th>
                <th style={{ textAlign: 'center' }} scope='col'>Instrument name</th>
                <th style={{ textAlign: 'center' }} scope='col'>Categrory name</th>
                <th style={{ textAlign: 'center' }} scope='col'>Cost price</th>
                <th style={{ textAlign: 'center' }} scope='col'>Original quantity</th>
                <th style={{ textAlign: 'center' }} scope='col'>Quantity sold</th>
                <th style={{ textAlign: 'center' }} scope='col'>Remaining quantity</th>
              </tr>
            </thead>
            <tbody>
              {leastSoldThisMonth.map((category, index) => (
                <tr key={category.categoryId}>
                  <td style={{ textAlign: 'center' }}>{index + 1}</td>
                  <td style={{ textAlign: 'center' }}>
                    <img src={category.image} alt="" style={{ width: '50px' }} />
                  </td>
                  <td style={{ textAlign: 'center' }}>{category.instrumentName}</td>
                  <td style={{ textAlign: 'center' }}>{category.categoryName}</td>
                  <td style={{ textAlign: 'center' }}>{category.costPrice}</td>
                  <td style={{ textAlign: 'center' }}>{category.quantity + category.totalSold}</td>
                  <td style={{ textAlign: 'center' }}>{category.totalSold}</td>
                  <td style={{ textAlign: 'center' }}>{category.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* category Select */}
      <section className="row mt-5">
        <div className="col-3">
          <label className="form-label">Select category</label>
          <select
            className="form-select"
            value={selectedCategoryId}
            onChange={handleCategorySelectect}
          >
            <option value="">Select categories</option>
            {categoryData?.map((category) => (
              <option key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>

        {/* Chart revenue category by category id */}
        <div className='row mt-4'>
          <h5>Revenue of category:</h5>
          <div className='col'>
            <Line data={revenueChartData} />
          </div>
        </div>
      </section>
    </div>
  )
}

export default StatisticalCategory
