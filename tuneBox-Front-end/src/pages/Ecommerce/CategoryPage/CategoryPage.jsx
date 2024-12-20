import React, { useEffect, useState } from 'react';
import './CategoryPage.css';
import { listCategories } from '../../../service/CategoryServiceCus';
import Benefit from '../../../components/Benefits/Benefits';
import Footer from '../../../components/Footer/Footer2'
import { useNavigate, Link } from 'react-router-dom';

function CategoryPage() {

  const [categoryList, setCategoryList] = useState([]);
  const navigate = useNavigate(); // navigate để lấy get category by id

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await listCategories();
        const filteredCategories = response.data.filter(category => category.status === false);
        setCategoryList(filteredCategories);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategory = (category) => {
    console.log("Get category with ID:", category.id);
    navigate('/InstrumentBelongCategory', { state: { category } });
  };

  return (
    <div>
       <div className="container" style={{marginTop: '100px'}}>
  
        <div className="row p-5">
          <h3 className='text-center'>Category</h3>
          <hr />
          {categoryList.map((category) => (
            <div className="col-3 mt-5 category" key={category.id}>
              <div className="card" onClick={() => handleCategory(category)}>
                <a href="">
                <img
                  className="img"
                  src={category.image ? category.image : 'default-image-path.jpg' }
                  alt={category.name}
                />
                <div className="card-body category-content">
                  <h5 className="card-title">{category.name}</h5>
                </div>
                </a>
               
              </div>
            </div>
          ))}
        </div>
      </div>
      <Benefit />
      <Footer />
    </div>
  );
}

export default CategoryPage;
