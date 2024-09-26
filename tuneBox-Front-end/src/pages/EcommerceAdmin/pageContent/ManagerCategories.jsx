import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoriesTable from "../../../components/CategoriesTable/CatogoriesList";
import { createCategory, listCateIns } from "../../../service/CategoryService";

const ManagerCategories = () => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [errors, setErrors] = useState({ newCategoryName: '' });
  const [successMessage, setSuccessMessage] = useState("");
  const navigator = useNavigate();



  useEffect(() => {
    getAllCategory();

  }, []);



  function getAllCategory() {
    listCateIns()
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }

  function validateForm() {
    let valid = true;
    const errorsCopy = { ...errors };

    if (!newCategoryName.trim()) {
      errorsCopy.newCategoryName = 'Category name is required';
      valid = false;
    } else if (newCategoryName.length < 3 || newCategoryName.length > 100) {
      errorsCopy.newCategoryName = 'Category name must be between 10 and 100 characters';
      valid = false;
    } else if (categories.some(category => category.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
      errorsCopy.newCategoryName = 'Category name already exists';
      valid = false;
    } else {
      errorsCopy.newCategoryName = '';
    }

    setErrors(errorsCopy);
    return valid;
  }

  function handleSave() {
    if (!validateForm()) {
      return;
    }

    const newCategory = {
      name: newCategoryName,
      status: false,
    };

    createCategory(newCategory)
      .then((response) => {
        console.log("Category created:", response.data);
        getAllCategory();
        setNewCategoryName(""); // Reset input field
        setSuccessMessage("Category added successfully!"); // Hiển thị thông báo thành công

        // Đóng modal
        const modalElement = document.getElementById('addCategoryModal');
        const modalInstance = new window.bootstrap.Modal(modalElement);
        modalInstance.hide(); // Ẩn modal

        // Để đảm bảo lớp phủ được ẩn
        setTimeout(() => {
          modalElement.classList.remove('show');
          const backdrop = document.querySelector('.modal-backdrop');
          if (backdrop) {
            backdrop.remove();
          }
        }, 150); // Thay đổi giá trị này nếu cần
      })
      .catch((error) => {
        console.error("Error creating category:", error);
      });
  }
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(""); // Đặt lại thông báo
      }, 5000); // Thay đổi thời gian ở đây nếu cần

      // Dọn dẹp timer khi unmount hoặc khi successMessage thay đổi
      return () => clearTimeout(timer);
    }
  }, [successMessage]);


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = categories.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(categories.length / itemsPerPage);

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

        {/* Hiển thị thông báo thành công */}
        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage}
          </div>
        )}

        <CategoriesTable categories={currentCategories} onUpdate={getAllCategory} />

        <div className="">
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


      {/* start modal add */}
      <div className="modal fade" id="addCategoryModal" tabIndex="-1" aria-labelledby="addCategoryModalLabel" aria-hidden="true">
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
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={handleSave}>Save Category</button>
            </div>
          </div>
        </div>
      </div>
      {/* end modal add */}
    </div>
  );
};

export default ManagerCategories;
