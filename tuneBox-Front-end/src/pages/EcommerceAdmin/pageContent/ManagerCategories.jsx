import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoriesTable from "../../../components/CategoriesTable/CatogoriesList";
import { createCategory, listCateIns } from "../../../service/CategoryService";

const ManagerCategories = () => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Số lượng mục trên mỗi trang
  const [errors, setErrors] = useState({ newCategoryName: '' }); // Thêm state cho errors
  const navigator = useNavigate();

  function getAllCategory() {
    listCateIns()
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }

  useEffect(() => {
    getAllCategory();
  }, []);

  // Validation function
  function validateForm() {
    let valid = true;
    const errorsCopy = { ...errors }; // Tạo một bản sao của errors

    if (newCategoryName.trim()) {
      errorsCopy.newCategoryName = ''; // Không có lỗi
    } else {
      errorsCopy.newCategoryName = 'Category name is required'; // Có lỗi
      valid = false;
    }

    setErrors(errorsCopy); // Cập nhật trạng thái lỗi
    return valid; // Trả về kết quả xác thực
  }

  function handleSave() {
    if (!validateForm()) { // Kiểm tra xác thực trước khi tiếp tục
      return; // Dừng nếu không hợp lệ
    }

    const newCategory = {
      name: newCategoryName,
      status: false
    };
    createCategory(newCategory)
      .then((response) => {
        console.log("Category created:", response.data);
        getAllCategory();
        setNewCategoryName(""); // Reset input field after adding
        document.getElementById("closeModal").click(); // Close modal
      })
      .catch((error) => {
        console.error("Error creating category:", error);
      });
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = categories.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(categories.length / itemsPerPage);

  return (
    <div>
      <div className="container-fluid">
        {/* Modal add */}
        <button
          data-bs-toggle="modal"
          data-bs-target="#addCategoryModal"
          className="btn btn-primary mb-5 mt-3"
          style={{ marginLeft: 17 }}
        >
          Add Category
        </button>

        {/* Category table */}
        <CategoriesTable categories={currentCategories} onUpdate={getAllCategory} />

        {/* Pagination */}
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

      {/* Modal for adding category */}
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
                    className={`form-control ${errors.newCategoryName ? 'is-invalid' : ''}`} // Thêm class lỗi
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
    </div>
  );
};

export default ManagerCategories;
