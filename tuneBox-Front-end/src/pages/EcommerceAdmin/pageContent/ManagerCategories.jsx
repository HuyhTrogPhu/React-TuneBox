import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoriesTable from "../../../components/CategoriesTable/CatogoriesList";
import { createCategory, listCateIns } from "../../../service/CategoryService"; // Đảm bảo import hàm createCategory
// import "../css/ManagerCategories.css";

const ManagerCategories = () => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categories, setCategories] = useState([]); // Khởi tạo state categories
  const navigator = useNavigate();

  // Hàm gọi danh sách category
  function getAllCategory() {
    listCateIns()
      .then((response) => {
        setCategories(response.data); // Sử dụng setCategories để cập nhật danh sách
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }

  // Gọi danh sách category khi component được mount
  useEffect(() => {
    getAllCategory();
  }, []);

  function addNewCateins() {
    navigator('/add-cateins');
  }

  function handleSave() {
    const newCategory = {
      name: newCategoryName,
      status: false // Có thể mặc định là 'false' hoặc theo giá trị bạn cần
    };
    // Gọi service để lưu category
    createCategory(newCategory)
      .then((response) => {
        console.log("Category created:", response.data);
        getAllCategory(); // Tải lại danh sách categories sau khi thêm mới
        // Đóng modal
        document.getElementById("ViewsModal").click();
      })
      .catch((error) => {
        console.error("Error creating category:", error);
      });
  }

  return (
    <div>
      <div className="container-fluid">
        <div className="row m-2">
          {/* Search */}
          <div className="d-flex mt-5">
            <div className="input-group me-2">
              <input
                className="form-control"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <span className="input-group-text">
                <i className="fa-solid fa-magnifying-glass" />
              </span>
            </div>
          </div>
        </div>

        {/* Modal add */}
        <button
          data-bs-toggle="modal"
          data-bs-target="#ViewsModal"
          className="btn btn-primary mb-5 mt-3"
          style={{ marginLeft: 17 }}
        >
          Add Category
        </button>
        <div
          className="modal fade"
          id="ViewsModal"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Add new Category
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <label className="mb-3">Category name</label>
                <input
                  className="form-control"
                  id="name"
                  placeholder="Enter category name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSave}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Category table */}
        <CategoriesTable categories={categories} /> {/* Chuyển categories vào prop */}

        {/* Pagination */}
        <div className="">
          <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-center text-center">
              <li className="page-item">
                <a className="page-link" href="#" aria-label="Previous">
                  <span aria-hidden="true">«</span>
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  1
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  2
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#">
                  3
                </a>
              </li>
              <li className="page-item">
                <a className="page-link" href="#" aria-label="Next">
                  <span aria-hidden="true">»</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default ManagerCategories;
