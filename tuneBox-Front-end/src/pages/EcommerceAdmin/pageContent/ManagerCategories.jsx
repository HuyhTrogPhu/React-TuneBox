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
  const [countdown, setCountdown] = useState(5); //đếm thời gian tắt thông báo
  const [searchTerm, setSearchTerm] = useState(""); // Thêm state để lưu trữ giá trị tìm kiếm
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' cho sắp xếp tăng dần, 'desc' cho giảm dần

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
        }, 50); // Thay đổi giá trị này nếu cần
      })
      .catch((error) => {
        console.error("Error creating category:", error);
      });
  }

  useEffect(() => {
    if (successMessage) {
      setCountdown(3); // Đặt lại thời gian đếm ngược khi thông báo được hiển thị

      const intervalId = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);

      const timeoutId = setTimeout(() => {
        setSuccessMessage(""); // Đặt lại thông báo sau khi hết thời gian
      }, 5000);

      // Dọn dẹp khi component unmount hoặc khi successMessage thay đổi
      return () => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
      };
    }
  }, [successMessage]);

  // Lọc danh sách dựa trên từ khóa tìm kiếm
  const filteredCategories = categories.filter(cate =>
    cate.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Phân trang dựa trên danh sách đã lọc
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);


  //sort

  function handleSort() {
    const sortedCategories = [...categories];
    sortedCategories.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.id - b.id;
      } else {
        return b.id - a.id;
      }
    });

    setCategories(sortedCategories);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');  // Đổi trạng thái sắp xếp
  }

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
            {successMessage} This notice will be closed in <b>{countdown}s.</b>
          </div>
        )}

        {/* Thêm trường tìm kiếm */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by category name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <CategoriesTable categories={currentCategories} onUpdate={getAllCategory} sortOrder={sortOrder}
          handleSort={handleSort} />

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
