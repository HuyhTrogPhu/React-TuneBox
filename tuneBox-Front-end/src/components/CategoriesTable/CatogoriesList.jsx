import React, { useEffect, useState } from "react";
import { updateCateIns } from "../../service/CategoryService";
import { useNavigate } from "react-router-dom";

const CatogoriesList = ({ categories, onUpdate, sortOrder, handleSort }) => { // Nhận prop categories và onUpdate


  const [selectedCategory, setSelectedCategory] = useState(null) // lưu dữ liệu cate đang được chọn
<<<<<<< HEAD
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryImage, setEditCategoryImage] = useState(null);
  const [currentImage, setCurrenImage] = useState(null);
  const [editCategoryDesc, setEditCategoryDesc] = useState("");

=======
  const [editCategoryName, setEditCategoryName] = useState("");   // Lưu trữ tên category được chỉnh sửa
>>>>>>> 3b1e11153692986a1508d176b8f2ba716a80fd02
  const [successMessage, setSuccessMessage] = useState("");
  const [countdown, setCountdown] = useState(5); //đếm thời gian tắt thông báo

  const navigator = useNavigate();
  const [errors, setErrors] = useState({
    editCategoryName: ''
  })

  //lưu trữ giá trị tìm kiếm
  const [searchTerm, setSearchTerm] = useState("")
  const filteredCategories = categories.filter(cate =>
    cate.name.toLowerCase().includes(searchTerm.toLowerCase())
  );



  const openEditModal = (category) => {
    setSelectedCategory(category);    // Lưu trữ dữ liệu category được chọn vào state
<<<<<<< HEAD
    setEditCategoryName(category.name);
    setEditCategoryImage(null);
    setCurrenImage(category.image);
    setEditCategoryDesc(category.description);

=======
    setEditCategoryName(category.name); // Đổ dữ liệu vào modal
>>>>>>> 3b1e11153692986a1508d176b8f2ba716a80fd02
    const modal = new window.bootstrap.Modal(document.getElementById('editCategoryModal'));
    modal.show();                     // Hiển thị modal
  };

  const handUpdate = () => {
    if (!validateForm()) {
      return;
    }

    if (selectedCategory) {
<<<<<<< HEAD

      const updatedCategory = {
        name: editCategoryName,
        description: editCategoryDesc,
        image: editCategoryImage || currentImage,
        status: selectedCategory.status
      }
=======
      const updatedCategory = { ...selectedCategory, name: editCategoryName };
>>>>>>> 3b1e11153692986a1508d176b8f2ba716a80fd02

      updateCateIns(selectedCategory.id, updatedCategory)
        .then((response) => {
          onUpdate(); // Gọi hàm onUpdate để cập nhật lại danh sách
          const modal = window.bootstrap.Modal.getInstance(document.getElementById('editCategoryModal'));
          modal.hide(); // Ẩn modal sau khi lưu
          setSuccessMessage("Category update successfully!");
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  useEffect(() => {
    if (successMessage) {
      setCountdown(5); // Đặt lại thời gian đếm ngược khi thông báo được hiển thị

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


  // funtion chuyển đổi status
  function removeCateIns(id) {
    const categoryToUpdate = categories.find((cate) => cate.id === id);
<<<<<<< HEAD


    if (categoryToUpdate) {
      const updatedStatus = !categoryToUpdate.status;
      const dataToSend = {
        ...categoryToUpdate,
        status: updatedStatus,
        name: categoryToUpdate.name,
        description: categoryToUpdate.description,
      }
    }
=======
    const updatedStatus = !categoryToUpdate.status;
    const updatedCategory = { ...categoryToUpdate, status: updatedStatus };
>>>>>>> 3b1e11153692986a1508d176b8f2ba716a80fd02

    updateCateIns(id, updatedCategory)
      .then((response) => {
        onUpdate(); // Gọi hàm onUpdate để cập nhật lại danh sách trong component cha
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // Validation function
  function validateForm() {
    let valid = true;
<<<<<<< HEAD
    const errorsCopy = { editCategoryName: '', editCategoryImage: '', editCategoryDesc: '' };

    if (editCategoryName.trim()) {
      errorsCopy.editCategoryName = '';
=======
    const errorsCopy = { ...errors }; // Tạo một bản sao của errors

    if (editCategoryName.trim()) {
      errorsCopy.editCategoryName = ''; // Không có lỗi
>>>>>>> 3b1e11153692986a1508d176b8f2ba716a80fd02
    } else {
      errorsCopy.editCategoryName = 'Category name is required'; // Có lỗi
      valid = false;
    }

<<<<<<< HEAD
    if (!editCategoryImage && !currentImage) {
      errorsCopy.editCategoryImage = 'Brand image is required';
      valid = false;
    } else {
      errorsCopy.editCategoryImage = '';
    }

    if (!editCategoryDesc.trim()) {
      errorsCopy.editCategoryDesc = 'Category description is required';
      valid = false;
    } else {
      errorsCopy.editCategoryDesc = '';
    }

=======
>>>>>>> 3b1e11153692986a1508d176b8f2ba716a80fd02
    setErrors(errorsCopy); // Cập nhật trạng thái lỗi
    return valid; // Trả về kết quả xác thực
  }

  return (
    <div>
      {/* Hiển thị thông báo thành công */}
      {successMessage && (
        <div className="alert alert-success" role="alert">
<<<<<<< HEAD
          {successMessage} This notice will be closed in <b>{countdown}s.</b>
=======
          {successMessage} This notice will be closed in <b>{countdown}s.</b> 
>>>>>>> 3b1e11153692986a1508d176b8f2ba716a80fd02
        </div>
      )}

      <table className="table table-striped table-hover">
        <thead className="text-center">
          <tr>
<<<<<<< HEAD
            <th scope="col">#</th>
            <th scope="col">Image</th>
=======
            <th scope="col">
            <button onClick={handleSort} className="btn btn-link" style={{ textDecoration: 'none' }}>
          #
          {sortOrder === 'asc' ? ' Oldest' : ' Latest'}
        </button>
            </th>
>>>>>>> 3b1e11153692986a1508d176b8f2ba716a80fd02
            <th scope="col">Categories Name</th>
            <th scope="col">Status</th>
            <th scope="col">Action</th>

          </tr>
        </thead>
        <tbody>
          {filteredCategories.map((cate, index) => (
            <tr key={cate.id} className="ps-0">
              <td>{index + 1}</td>
<<<<<<< HEAD
              <td>
                <img src={cate.image
                  ? `data:image/jpeg;base64,${cate.image}`
                  : `default-image-path.jpg`
                } alt={cate.name}
                  style={{ width: '50px' }} />
              </td>
              <td>{cate.name}</td>
              <td>{cate.status ? 'Available' : 'Unavailable'}</td>
=======
              <td>{cate.name}</td>
              <td>{cate.status ? 'Unavailable' : 'Available'}</td>
>>>>>>> 3b1e11153692986a1508d176b8f2ba716a80fd02
              <td>
                <button className="btn btn-warning" onClick={() => openEditModal(cate)}>
                  Edit
                </button>
              </td>
              <td>
                <button
<<<<<<< HEAD
                  className={`btn  ${cate.status ? 'btn-success' : 'btn-danger'}`}
=======
                  className={`btn  ${cate.status ? 'btn-danger-custom' : 'btn-success'}`}
>>>>>>> 3b1e11153692986a1508d176b8f2ba716a80fd02
                  onClick={() => removeCateIns(cate.id)}
                >
                  {cate.status ? 'Mark as Available' : 'Mark as Unavailable'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>

      {/* modal edit */}
      <style dangerouslySetInnerHTML={{ __html: "\n      /* styles.css hoặc tệp CSS tương tự */\n.btn-danger-custom {\n  background-color: #dc3545; /* Màu đỏ */\n  color: white; /* Màu chữ */\n}\n\n.btn-danger-custom:hover {\n  background-color: #c82333; /* Màu đỏ đậm khi hover */\n}\n\n      " }} />

<<<<<<< HEAD
      <div className="modal fade" id="editCategoryModal" tabIndex="-1" aria-labelledby="editCategoryModalLabel" aria-hidden="true" data-bs-backdrop="false">
=======
      <div className="modal fade" id="editCategoryModal" tabIndex="-1" aria-labelledby="editCategoryModalLabel" aria-hidden="true">
>>>>>>> 3b1e11153692986a1508d176b8f2ba716a80fd02
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editCategoryModalLabel">Edit Category</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
<<<<<<< HEAD

=======
>>>>>>> 3b1e11153692986a1508d176b8f2ba716a80fd02
                <div className="mb-3">
                  <label htmlFor="categoryName" className="form-label">Category Name</label>
                  <input
                    type="text"
                    className={`form-control ${errors.editCategoryName ? 'is-invalid' : ''}`} // Thêm class lỗi
                    id="categoryName"

                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                  />
                  {errors.editCategoryName && <div className='invalid-feedback'>{errors.editCategoryName}</div>}
                </div>
<<<<<<< HEAD

                <div className="mt-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className={`form-control ${errors.editCategoryDesc ? 'is-invalid' : ''}`}
                    value={editCategoryDesc}
                    onChange={(e) => setEditCategoryDesc(e.target.value)}
                  ></textarea>
                  {errors.editCategoryDesc && <div className='invalid-feedback'>{errors.editCategoryDesc}</div>}
                </div>

                <div className="mt-3">
                  <label className="form-label">Image:</label>
                  <input 
                  type="file" 
                  className={`form-control ${errors.editCategoryImage ? 'is-invalid' : ''}`}
                  onChange={(e) => setEditCategoryImage(e.target.files[0])}
                  />
                  {errors.editCategoryImage && <div className="invalid-feedback">{errors.editCategoryImage}</div> }
                </div>

                {/* Curren image */}
                {currentImage && (
                  <div className="mt-3">
                    <label className="form-label">Current Image:</label>
                    <img 
                    src={`data:image/jpeg;base64, ${currentImage}`} 
                    alt="Current image"
                    style={{ width: '100%', maxHeight: '200px', objectFit: 'contain'}} 
                    />
                  </div>
                )}

=======
>>>>>>> 3b1e11153692986a1508d176b8f2ba716a80fd02
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={handUpdate}>Save update</button>
            </div>
          </div>
        </div>
      </div>
      {/* end modal edit */}
    </div>



  );
};

export default CatogoriesList;