import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateBrand } from '../../service/BrandsService';

const BrandList = ({ brands, onUpdate }) => {
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null); // Thêm biến trạng thái cho hình ảnh hiện tại
  const [successMessage, setSuccessMessage] = useState("");
  const [countdown, setCountdown] = useState(5); //đếm thời gian tắt thông báo
  const navigator = useNavigate();
  const [errors, setErrors] = useState({ editBrandName: '', editBrandImage: '', editBrandDescription: '' });
  const [loading, setLoading] = useState(false);
  const handleEdit = (brand) => {
    setSelectedBrand(brand);
    setEditName(brand.name);
    setEditDescription(brand.description);
    setEditImage(null); // Reset hình ảnh mới để không giữ hình cũ
    setCurrentImage(brand.brandImage); // Lưu hình ảnh hiện tại
    // Mở modal
    const modal = new bootstrap.Modal(document.getElementById('editBrandsModal'));
    modal.show();
  };
  // Hàm kiểm tra tên thương hiệu có trùng không
  const isBrandNameDuplicate = (name) => {
    return brands.some((bra) => bra.name.toLowerCase() === name.toLowerCase() && bra.id !== selectedBrand.id);
  };
  const validateForm = () => {
    let valid = true;
    const errorsCopy = { editBrandName: '', editBrandImage: '', editBrandDescription: '' };

    if (!editName.trim()) {
      errorsCopy.editBrandName = 'Brand name is required';
      valid = false;
    } else if (isBrandNameDuplicate(editName)) { // Kiểm tra trùng tên thương hiệu
      errorsCopy.editBrandName = 'Brand name already exists';
      valid = false;
    }

    if (!editDescription.trim()) {
      errorsCopy.editBrandDescription = 'Description is required';
      valid = false;
    } else if (editDescription.length < 10) {
      errorsCopy.editBrandDescription = 'Description must be at least 10 characters';
      valid = false;
    }


    if (!editImage && !currentImage) { // Chỉ cần yêu cầu hình ảnh mới nếu không có hình ảnh hiện tại
      errorsCopy.editBrandImage = 'Brand image is required';
      valid = false;
    }

    setErrors(errorsCopy); // Cập nhật trạng thái lỗi
    return valid; // Trả về kết quả xác thực
  };
  useEffect(() => {
    if (successMessage) {
      setCountdown(2); // Đặt lại thời gian đếm ngược khi thông báo được hiển thị

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


  const handleUpdate = () => {
    if (selectedBrand && validateForm()) {
      setLoading(true);
      const updatedBrand = {
        name: editName,
        description: editDescription,
        brandImage: editImage || currentImage, // Sử dụng hình ảnh mới hoặc hiện tại
        status: selectedBrand.status // Giữ nguyên trạng thái
      };

      updateBrand(updatedBrand, selectedBrand.id)
        .then(() => {
          setTimeout(() => {
            setLoading(false)
            onUpdate();
            setSuccessMessage("Brand update successfully!");
            const modal = bootstrap.Modal.getInstance(document.getElementById('editBrandsModal'));
            modal.hide();
          }, 1000)
        })
        .catch((error) => {
          setLoading(false);
          console.error(error);
        });
    }
  };
  // Hàm để chuyển đổi trạng thái thương hiệu
  const handleToggleStatus = (id) => {
    const brandToUpdate = brands.find((bra) => bra.id === id);

    if (brandToUpdate) {
      const updatedStatus = !brandToUpdate.status; // Chuyển đổi trạng thái
      const dataToSend = {
        ...brandToUpdate,
        status: updatedStatus,
        name: brandToUpdate.name, // Giữ nguyên tên
        description: brandToUpdate.description, // Giữ nguyên mô tả
      };

      updateBrand(dataToSend, id)
        .then(() => {
          onUpdate(); // Cập nhật danh sách thương hiệu
        })
        .catch((error) => {
          console.error("Error updating brand status:", error);
        });
    }
  };

  useEffect(() => {
    return () => {
      if (editImage) {
        URL.revokeObjectURL(editImage);
      }
    };
  }, [editImage]);

  return (
    <div>
      {/* Hiển thị thông báo thành công */}
      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}
      <table className="table table-striped table-hover">
        <thead className='text-center'>
          <tr>
            <th style={{ textAlign: "center" }} scope="col">#</th>
            <th style={{ textAlign: "center" }} scope="col">Brand Image</th>
            <th style={{ textAlign: "center" }} scope="col">Brand Name</th>
            <th style={{ textAlign: "center" }} scope="col">Description</th>
            <th style={{ textAlign: "center" }} scope="col">Status</th>
            <th style={{ textAlign: "center" }} scope="col">Action</th>
            <th style={{ textAlign: "center" }} scope="col">Status Transition</th>
          </tr>
        </thead>
        <tbody>
          {brands.map((bra, index) => (
            <tr key={bra.id} className="ps-0">
              <td>{index + 1}</td>
              <td>
                <img

                  src={bra.brandImage ? bra.brandImage : 'default-image-path.jpg'}

                  alt={bra.name}
                  style={{ width: '50px' }}
                />
              </td>
              <td>{bra.name}</td>
              <td>
                {bra.description
                  ? bra.description.length > 50
                    ? `${bra.description.substring(0, 50)}...`
                    : bra.description
                  : 'No description available'}
              </td>

              <td>{bra.status ? 'Unavailable' : 'Available'}</td>
              <td>
                <button className='btn btn-warning' onClick={() => handleEdit(bra)}>
                  Edit
                </button>
              </td>
              <td>
                <button
                  className={`btn ms-4 ${bra.status ? 'btn-success' : 'btn-danger'}`}
                  onClick={() => handleToggleStatus(bra.id)}
                >
                  {bra.status ? 'Mark as Available' : 'Mark as Unavailable'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Edit */}
      <div className="modal fade" id="editBrandsModal" tabIndex="-1" aria-labelledby="editBrandsModalLabel" aria-hidden="true" data-bs-backdrop="false">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editBrandsModalLabel">Edit Brand</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="brandName" className="form-label">Brand Name</label>
                  <input
                    type="text"
                    className={`form-control ${errors.editBrandName ? 'is-invalid' : ''}`}
                    id="brandName"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                  {errors.editBrandName && <div className='invalid-feedback'>{errors.editBrandName}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="brandDescription" className="form-label">Description</label>
                  <textarea
                    className={`form-control ${errors.editBrandDescription ? 'is-invalid' : ''}`}
                    id="brandDescription"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  ></textarea>
                  {errors.editBrandDescription && <div className='invalid-feedback'>{errors.editBrandDescription}</div>}
                </div>

                <div className="mb-3">
                  <label htmlFor="brandImage" className="form-label">Brand Image</label>
                  <input
                    type="file"
                    className={`form-control ${errors.editBrandImage ? 'is-invalid' : ''}`}
                    id="brandImage"
                    onChange={(e) => setEditImage(e.target.files[0])}
                  />
                  {errors.editBrandImage && <div className='invalid-feedback'>{errors.editBrandImage}</div>}
                </div>
                {/* Hiển thị hình ảnh hiện tại */}
                {currentImage && (
                  <div className="mb-3">
                    <label className="form-label">Current Brand Image</label>
                    <img
                      src={currentImage}// Sử dụng hình ảnh hiện tại
                      alt="Current brand"
                      style={{ width: '100%', maxHeight: '200px', objectFit: 'contain' }}
                    />
                  </div>
                )}
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={handleUpdate} disabled={loading}>

                {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Save update'}           </button>
            </div>
          </div>
        </div>
      </div>
      {/* End Modal Edit */}
    </div>
  );
};

export default BrandList;