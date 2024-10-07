import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoriesTable from "../../../components/CategoriesTable/CatogoriesList";
import { createCategory, listCateIns } from "../../../service/CategoryService";

const ManagerCategories = () => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryImg, setNewCategoryImg] = useState(null);
  const [newCategoryDesc, setCategoryDesc] = useState("");
  const [categories, setCategories] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [errors, setErrors] = useState({ 
    newCategoryName: '', 
    newCategoryImg: '', 
    newCategoryDesc: '' 
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [countdown, setCountdown] = useState(5);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [sortOrder, setSortOrder] = useState('asc'); 

  const navigator = useNavigate();

  useEffect(() => {
    getAllCategory();
  }, []);

  const getAllCategory = () => {
    listCateIns()
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  };

  const validateForm = () => {
    let valid = true;
    const errorsCopy = { newCategoryName: '', newCategoryImg: '', newCategoryDesc: '' };

    if (!newCategoryName.trim()) {
      errorsCopy.newCategoryName = 'Category name is required';
      valid = false;
    } else if (categories.some(category => category.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
      errorsCopy.newCategoryName = 'Category name already exists';
      valid = false;
    }

    if (!newCategoryImg) {
      errorsCopy.newCategoryImg = 'Category image is required';
      valid = false;
    }

    if (!newCategoryDesc.trim()) {
      errorsCopy.newCategoryDesc = 'Category description is required';
      valid = false;
    }

    setErrors(errorsCopy);
    return valid;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const newCategory = new FormData();
    newCategory.append('name', newCategoryName);
    newCategory.append('image', newCategoryImg);
    newCategory.append('description', newCategoryDesc);

    createCategory(newCategory)
      .then((response) => {
        console.log("Category created:", response.data);
        getAllCategory();
        setNewCategoryName(""); 
        setCategoryDesc(""); 
        setNewCategoryImg(null);
        setSuccessMessage("Category added successfully!");

        const modalElement = document.getElementById('addCategoryModal');
        const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
        modalInstance.hide();
      })
      .catch((error) => {
        console.error("Error creating category:", error);
      });
  };

  useEffect(() => {
    if (successMessage) {
      setCountdown(5); // Reset countdown to 5 seconds when the success message is displayed
      const intervalId = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);

      const timeoutId = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);

      return () => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
      };
    }
  }, [successMessage]);

  const filteredCategories = categories.filter(cate =>
    cate.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

  const handleSort = () => {
    const sortedCategories = [...categories];
    sortedCategories.sort((a, b) => (sortOrder === 'asc' ? a.id - b.id : b.id - a.id));
    setCategories(sortedCategories);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div>
      <div className="container-fluid">
        <button
          data-bs-toggle="modal"
          data-bs-target="#addCategoryModal"
          className="btn btn-primary mb-5 mt-3"
          style={{ marginLeft: 17 }}
        >
          Add Category
        </button>

        <div className="modal fade" id="addCategoryModal" tabIndex="-1" aria-labelledby="addCategoryModalLabel" aria-hidden="true" data-bs-backdrop="false">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="addCategoryModalLabel">Add New Category</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="categoryName" className="form-label">Category Name</label>
                    <input
                      type="text"
                      className={`form-control ${errors.newCategoryName ? 'is-invalid' : ''}`}
                      id="categoryName"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                    {errors.newCategoryName && <div className='invalid-feedback'>{errors.newCategoryName}</div>}
                  </div>

                  <div className="mt-3">
                    <label className="form-label">Image</label>
                    <input type="file" 
                      className={`form-control ${errors.newCategoryImg ? 'is-invalid' : ''} `}
                      onChange={(e) => setNewCategoryImg(e.target.files[0])}
                    />
                    {errors.newCategoryImg && <div className="invalid-feedback">{errors.newCategoryImg}</div>}
                  </div>

                  <div className="mt-3">
                    <label className="form-label">Description</label>
                    <textarea 
                      cols="50" rows="5"
                      className={`form-control ${errors.newCategoryDesc ? 'is-invalid' : ''}`}
                      value={newCategoryDesc}
                      onChange={(e) => setCategoryDesc(e.target.value)}
                    ></textarea>
                    {errors.newCategoryDesc && <div className='invalid-feedback'>{errors.newCategoryDesc}</div>}
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary" onClick={handleSave}>Save Category</button>
              </div>
            </div>
          </div>
        </div>

        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage} This notice will be closed in <b>{countdown}s.</b>
          </div>
        )}

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by category name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <CategoriesTable 
          categories={currentCategories} 
          onUpdate={getAllCategory} 
          sortOrder={sortOrder}
          handleSort={handleSort} 
        />

        <nav aria-label="Page navigation example">
          <ul className="pagination justify-content-center text-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => paginate(currentPage - 1)} aria-label="Previous">
                <span aria-hidden="true">«</span>
              </button>
            </li>
            {[...Array(totalPages).keys()].map(number => (
              <li key={number + 1} className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}>
                <button onClick={() => paginate(number + 1)} className="page-link">
                  {number + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => paginate(currentPage + 1)} aria-label="Next">
                <span aria-hidden="true">»</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default ManagerCategories;
