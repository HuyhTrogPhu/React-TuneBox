import React, { useEffect, useState } from 'react'
import './CategoryPage.css'
import { listCategories } from '../../../service/InstrumentService';
import Benefit from '../../../components/Benefits/Benefits'
import { useNavigate } from 'react-router-dom';

function CategoryPage() {

  const [categoriyList, setCategoryList] = useState([]);
  const navigate = useNavigate(); // navigate để lấy get category by id

  useEffect(() => {
    getCategoryList();
  }, []);

  function getCategoryList() {
    listCategories().then((response) =>{
      setCategoryList(response.data);
    }).catch((error) => {
      console.error("Error fetching categories", error);
    })
  }

  return (
    <div>
      <div className='container-fluid'>
        <div className='row d-flex'>
          {/* Hiển thị danh sách loại sản phẩm */}
          <div className='col-3'>
            <div
              className="card">
              <Link to={"/InstrumentBelongCategory"}>
                <div className="card-body">
                  <h5 className="card-title">
                    Category name
                  </h5>
                  <p className="card-text">
                    View instrument
                  </p>
                </div>
              </Link>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}

export default CategoryPage
