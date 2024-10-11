import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { listInstruments, updateInstrument, listBrands, listCategories, } from "../../service/InstrumentService";

const InstrumentList = ({ instruments, onUpdate }) => {
  const navigator = useNavigate();
  const [selectedInstrument, setSelectedInstrument] = useState('');
  const [image, setImage] = useState(null);
  const [newInsName, setNewInsName] = useState('');
  const [newInsPrice, setNewInsPrice] = useState('');
  const [newInsColor, setNewInsColor] = useState('');
  const [newInsQuantity, setNewInsQuantity] = useState('');
  const [newInsCategory, setNewInsCategory] = useState('');
  const [newInsBrand, setNewInsBrand] = useState('');
  const [newInsDes, setInsDes] = useState('');
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [newInsStatus, setNewInsStatus] = useState(false);
  const [currentImage, setCurrentImage] = useState(null); // Thêm biến trạng thái cho hình ảnh hiện tại
  const [successMessage, setSuccessMessage] = useState("");
  const [countdown, setCountdown] = useState(5);





  const uploadInstrument = (id) => {
    if (!id) {
      console.error("Instrument ID is undefined or null");
      return;  // Ngăn việc tiếp tục nếu ID không hợp lệ
    }

    const insToEdit = instruments.find((ins) => ins.id === id);
    if (!insToEdit) {
      console.error("Instrument not found");
      return;
    }

    setSelectedInstrument(insToEdit);
    setNewInsName(insToEdit.name);
    setNewInsPrice(insToEdit.costPrice);
    setNewInsColor(insToEdit.color);
    setNewInsQuantity(insToEdit.quantity);
    setImage(insToEdit.image); // Giữ hình ảnh hiện tại
    setCurrentImage(insToEdit.image);
    setNewInsCategory(insToEdit.categoryIns ? insToEdit.categoryIns.id : '');
    setNewInsBrand(insToEdit.brand ? insToEdit.brand.id : '');
    setInsDes(insToEdit.description);
    setNewInsStatus(insToEdit.status);
    // Mở modal
    const modal = new window.bootstrap.Modal(document.getElementById('editIns'));
    modal.show();
  };


  const handleStatusChange = async (id) => {
    // Tìm nhạc cụ cần cập nhật
    const instrumentToUpdate = instruments.find(ins => ins.id === id);
    if (!instrumentToUpdate) {
      console.error("Instrument not found");
      return;
    }

    // Chuyển đổi trạng thái
    const updatedStatus = !instrumentToUpdate.status; // Chuyển đổi trạng thái
    const updatedInstrument = {
      ...instrumentToUpdate,
      status: updatedStatus
    };

    try {
      // Gọi API để cập nhật nhạc cụ
      await updateInstrument(id, updatedInstrument);
      onUpdate(); // Cập nhật danh sách nhạc cụ
      setSuccessMessage("Status updated successfully!"); // Hiển thị thông báo thành công
    } catch (error) {
      console.error("Error updating instrument status:", error);
    }
  };
  // Thêm trạng thái nhạc cụ



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
  //validation
  const validateInputs = () => {
    const errors = {};
    // Check instrument name
    if (!newInsName.trim()) {
      errors.name = "Instrument name cannot be empty.";
    }
    if (instruments.some(ins => ins.name === newInsName && ins.id !== selectedInstrument.id)) {
      errors.name = "Instrument name already exists.";
    }
    // Check price, color, quantity
    if (!newInsPrice) {
      errors.price = "Price cannot be empty.";
    } else if (isNaN(newInsPrice)) {
      errors.price = "Price must be a number.";
    }
    if (!newInsColor.trim()) {
      errors.color = "Color cannot be empty.";
    }
    if (!newInsQuantity) {
      errors.quantity = "Quantity cannot be empty.";
    } else if (isNaN(newInsQuantity)) {
      errors.quantity = "Quantity must be a number.";
    }
    if (!newInsCategory) {
      errors.category = "Category cannot be empty.";
    }
    if (!newInsBrand) {
      errors.brand = "Brand cannot be empty.";
    }
  
    setValidationErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };
  

  const handleUpdate = async () => {
    if (!selectedInstrument || !selectedInstrument.id) {
      console.error("Selected instrument or ID is invalid");
      return;
    }
    if (!validateInputs()) {
      return; // Nếu không hợp lệ thì không thực hiện cập nhật
    }

    const updatedInstrument = {
      name: newInsName,
      costPrice: parseFloat(newInsPrice),
      color: newInsColor,
      quantity: parseInt(newInsQuantity, 10),
      categoryId: newInsCategory,
      brandId: newInsBrand,
      description: newInsDes,
      status: newInsStatus,
      image: image // Sử dụng image đã chọn
    };

    try {
      await updateInstrument(selectedInstrument.id, updatedInstrument);
      onUpdate(); // Cập nhật danh sách nhạc cụ
      const modalElement = document.getElementById('editIns');
      const modal = window.bootstrap.Modal.getInstance(modalElement); // Lấy instance đã có
      modal.hide(); // Đóng modal
      setSuccessMessage("Instrument update successfully!");
    } catch (error) {
      console.error("Error updating instrument:", error);
    }
  };




  const getAllBrand = async () => {
    try {
      const response = await listBrands();
      console.log(response.data);
      setBrands(response.data);
    } catch (error) {
      console.error("Error fetching brands", error);
    }
  };

  const getAllCategory = async () => {
    try {
      const response = await listCategories();
      console.log(response.data);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  };

  useEffect(() => {
    getAllBrand();
    getAllCategory();
  }, []);

  return (
    <div>
      {/* Hiển thị thông báo thành công */}
      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}
      <table className="table table-striped table-hover">
        <thead className="text-center">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Image</th>
            <th scope="col">Name</th>
            <th scope="col">Category</th>
            <th scope="col">Brand</th>
            <th scope="col">Price</th>
            <th scope="col">Color</th>
            <th scope="col">Quantity</th>
            <th scope="col">Status</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(instruments) && instruments.length > 0 ? (
            instruments.map((ins, index) => (
              <tr key={ins.id} className="ps-0">
                <td>{index + 1}</td>
                <td>
                  <img
                    src={ins.image ? `data:image/${ins.image.split('.').pop()};base64,${ins.image}` : 'default-image-url'}
                    alt={ins.name}
                    style={{ width: '50px' }}
                  />
                </td>
                <td>{ins.name}</td>
                <td>{ins.categoryIns ? ins.categoryIns.name : 'No category'}</td>
                <td>{ins.brand ? ins.brand.name : 'No brand'}</td>
                <td>{ins.costPrice}</td>
                <td>{ins.color}</td>
                <td>{ins.quantity}</td>
                <td>{ins.status ? 'Unavailable' : 'Available'}</td>
                <td>
                  <button className='btn btn-warning' onClick={() => uploadInstrument(ins.id)}>
                    Edit
                  </button>
                </td>
                {/* <td>
                  <button
                    className={`btn ms-4 ${ins.status ? 'btn-success' : 'btn-danger'}`}
                    onClick={() => handleStatusChange(ins.id)}
                  >
                    {ins.status ? 'Mark as Available' : 'Mark as Unavailable'}
                  </button>
                </td> */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="text-center">No instruments available</td>
            </tr>
          )}
        </tbody>
      </table>

      <div
        className="modal fade"
        id="editIns"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Edit Instrument
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closeModal"
              />
            </div>
            <div className="modal-body">
              <div className="row">
                <form className="row">
                  <div className="col-6">
                    <div className="mt-3">
                      <label className="form-label">Instrument name:</label>

                      <input
                        className="form-control"
                        type="text"
                        placeholder="Enter instrument name"
                        value={newInsName}
                        onChange={(e) => setNewInsName(e.target.value)}
                      />
                      {validationErrors.name && <div className="text-danger">{validationErrors.name}</div>}
                    </div>

                    <div className="mt-3">
                      <label className="form-label">Price:</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Enter cost price"
                        value={newInsPrice}
                        onChange={(e) => setNewInsPrice(e.target.value)}
                      />
                      {validationErrors.price && <div className="text-danger">{validationErrors.price}</div>}
                    </div>

                    <div className="mt-3">
                      <label className="form-label">Color:</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Enter instrument color"
                        value={newInsColor}
                        onChange={(e) => setNewInsColor(e.target.value)}
                      />
                      {validationErrors.color && <div className="text-danger">{validationErrors.color}</div>}
                    </div>

                    <div className="mt-3">
                      <label className="form-label">Quantity:</label>
                      <input
                        className="form-control"
                        type="text"
                        placeholder="Enter instrument quantity"
                        value={newInsQuantity}
                        onChange={(e) => setNewInsQuantity(e.target.value)}
                      />
                      {validationErrors.quantity && <div className="text-danger">{validationErrors.quantity}</div>}
                    </div>

                    <div className="mt-3">
                      <label className="form-label">Instrument Image</label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={(e) => {
                          const selectedFile = e.target.files[0];
                          setImage(selectedFile);
                          console.log("Selected image:", selectedFile);
                        }}

                      />
                      {/* Hiển thị hình ảnh hiện tại nếu có */}
                      {image && typeof image === "object" && image instanceof File ? (
                        <img
                          src={URL.createObjectURL(image)}
                          alt="Current Instrument"
                          style={{ width: '100px', marginTop: '10px' }}
                        />
                      ) : (
                        image && typeof image === "string" && (
                          <img
                            src={`data:image/${image.split('.').pop()};base64,${image}`}
                            alt="Current Instrument"
                            style={{ width: '100px', marginTop: '10px' }}
                          />
                        )
                      )}


                    </div>
                  </div>

                  <div className="col-6">
                    <div className="mt-3">
                      <label className="form-label">Category:</label>
                      <select
                        className="form-select"
                        value={newInsCategory || ""}
                        onChange={(e) => setNewInsCategory(e.target.value)}
                      >
                        <option value="" disabled>Select category</option>
                        <option value="" disabled>
                          Select category instrument
                        </option>
                        {Array.isArray(categories) && categories.length > 0 ? (
                          categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>
                            No categories available
                          </option>
                        )}
                      </select>
                      {validationErrors.category && <div className="text-danger">{validationErrors.category}</div>}
                    </div>

                    <div className="mt-3">
                      <label className="form-label">Brand:</label>
                      <select
                        className="form-select"
                        value={newInsBrand || ""}
                        onChange={(e) => setNewInsBrand(e.target.value)}
                      >
                        <option value="" disabled>
                          Select brand instrument
                        </option>
                        {Array.isArray(brands) && brands.length > 0 ? (
                          brands.map((brand) => (
                            <option key={brand.id} value={brand.id}>
                              {brand.name}
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>
                            No brands available
                          </option>
                        )}
                      </select>
                      {validationErrors.brand && <div className="text-danger">{validationErrors.brand}</div>}
                    </div>

                    <div className="mb=3">
                      <label className="form-label">Description</label>
                      <textarea
                        cols="30"
                        rows="10"
                        className="form-control"
                        value={newInsDes}
                        onChange={(e) => setInsDes(e.target.value)}
                      />
                    </div>
                    <div className="mt-3">
                      <label className="form-label">Status:</label>
                      <input
                        type="checkbox"
                        checked={newInsStatus}
                        onChange={(e) => setNewInsStatus(e.target.checked)}
                      />
                      <span>{newInsStatus ? 'Unavailable' : 'Available'}</span>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Close
                    </button>
                    <button type="button" className="btn btn-primary" onClick={handleUpdate}>
                      Save Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstrumentList;  