import  { useEffect, useState } from "react";
import { updateCateIns } from "../../service/CategoryService";
import { useNavigate } from "react-router-dom";

const CatogoriesList = ({ categories, onUpdate, sortOrder, handleSort }) => { // Nhận prop categories và onUpdate


  const [selectedCategory, setSelectedCategory] = useState(null) // lưu dữ liệu cate đang được chọn
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryImage, setEditCategoryImage] = useState(null);
  const [currentImage, setCurrenImage] = useState(null);
  const [editCategoryDesc, setEditCategoryDesc] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [countdown, setCountdown] = useState(5); //đếm thời gian tắt thông báo
  const [loading, setLoading] = useState(false); 
  const navigator = useNavigate();
  const [errors, setErrors] = useState({
    editCategoryName: '',
    editCategoryDesc: '',
    editCategoryImage: ''
  })

  //lưu trữ giá trị tìm kiếm
  const [searchTerm, setSearchTerm] = useState("")
  const filteredCategories = categories.filter(cate =>
    cate.name.toLowerCase().includes(searchTerm.toLowerCase())
  );



  const openEditModal = (category) => {
    setSelectedCategory(category);    // Lưu trữ dữ liệu category được chọn vào state
    setEditCategoryName(category.name);
    setEditCategoryImage(null);
    setCurrenImage(category.image);
    setEditCategoryDesc(category.description);

    const modal = new window.bootstrap.Modal(document.getElementById('editCategoryModal'));
    modal.show();                     // Hiển thị modal
  };

  const handUpdate = () => {
    if (selectedCategory && validateForm()) {
      setLoading(true); // Bắt đầu loading

      const updatedCategory = {
        name: editCategoryName,
        description: editCategoryDesc,
        image: editCategoryImage || currentImage,
        status: selectedCategory.status
      };

      updateCateIns(updatedCategory, selectedCategory.id)
        .then(() => {
          setTimeout(() => { // Mô phỏng thời gian chờ 6 giây
            setLoading(false); // Tắt loading sau khi hoàn thành
            onUpdate();
            setSuccessMessage("Categories updated successfully");

            const modalElement = document.getElementById('editCategoryModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
            modalInstance.hide();
          }, 1000); 
        })
        .catch((error) => {
          setLoading(false); // Tắt loading khi có lỗi
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

    if (categoryToUpdate) {
      const updatedStatus = !categoryToUpdate.status;
      const dataToSend = {
        ...categoryToUpdate,
        status: updatedStatus // Chuyển đổi trạng thái
      };

      updateCateIns(dataToSend, id)
        .then((response) => {
          onUpdate(); // Gọi hàm onUpdate để cập nhật lại danh sách trong component cha
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }


  // Validation function
  function validateForm() {
    let valid = true;
    const errorsCopy = { editCategoryName: '', editCategoryImage: '', editCategoryDesc: '' };

    // Kiểm tra tên danh mục
    if (!editCategoryName.trim()) {
      errorsCopy.editCategoryName = 'Category name is required';
      valid = false;
    }
        // Kiểm tra tên danh mục có trùng hay không
        const isDuplicate = categories.some(
          (cate) => cate.name.toLowerCase() === editCategoryName.toLowerCase() && cate.id !== selectedCategory.id
      );
  
      if (isDuplicate) {
          errorsCopy.editCategoryName = 'Category name must be unique';
          valid = false;
      }

    // Kiểm tra hình ảnh
    if (!editCategoryImage && !currentImage) {
      errorsCopy.editCategoryImage = 'Category image is required';
      valid = false;
    }

    // Kiểm tra mô tả
    if (!editCategoryDesc.trim()) {
      errorsCopy.editCategoryDesc = 'Category description is required';
      valid = false;
    }

    setErrors(errorsCopy); // Cập nhật trạng thái lỗi
    return valid; // Trả về kết quả xác thực
  }


  return (
    <div>
      {/* Hiển thị thông báo thành công */}
      {successMessage && (
        <div className="alert alert-success " role="alert" style={{marginTop: 10}}>
          {successMessage} This notice will be closed in <b>{countdown}s.</b>
        </div>
      )}

      <table className="table table-striped table-hover">
        <thead className="text-center">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Image</th>
            <th scope="col">Categories Name</th>
            <th scope="col">Desc</th>
            <th scope="col">Status</th>
            <th scope="col">Action</th>

          </tr>
        </thead>
        <tbody>
          {filteredCategories.map((cate, index) => (
            <tr key={cate.id} className="ps-0">
              <td>{index + 1}</td>
              {/* <td>
                <img src={cate.image
                  ? `data:image/jpeg;base64,${cate.image}`
                  : `default-image-path.jpg`
                } alt={cate.name}
                  style={{ width: '50px' }} />
              </td> */}
              <td>
                <img
                  src={cate.image ? cate.image : 'default-image-path.jpg'} // Sử dụng URL hình ảnh từ Cloudinary
                  alt={cate.name}
                  style={{ width: '50px' }} // Điều chỉnh kích thước nếu cần
                />
              </td>
              <td>{cate.name}</td>
              <td>{cate.description}</td>
              <td>{cate.status ? 'Unavailable' : 'Available'}</td>
              <td>
                <button className="btn btn-warning" onClick={() => openEditModal(cate)}>
                  Edit
                </button>
              </td>
              <td>
                <button
                  className={`btn  ${cate.status ? 'btn-success' : 'btn-danger'}`}
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

      <div className="modal fade" id="editCategoryModal" tabIndex="-1" aria-labelledby="editCategoryModalLabel" aria-hidden="true" data-bs-backdrop="false">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editCategoryModalLabel">Edit Category</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>

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
                  {errors.editCategoryImage && <div className="invalid-feedback">{errors.editCategoryImage}</div>}
                </div>

                {/* Curren image */}
                {currentImage && (
                  <div className="mt-3">
                    <label className="form-label">Current Image:</label>
                    <img
                      src={currentImage} // Sử dụng URL hình ảnh từ Cloudinary
                      alt="Current image"
                      style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }}
                    />
                  </div>
                )}

              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary" onClick={handUpdate} disabled={loading}>
                {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Save update'}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* end modal edit */}
    </div>



  );
};

export default CatogoriesList;