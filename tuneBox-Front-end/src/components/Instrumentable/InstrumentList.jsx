import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { listInstruments, updateInstrument, listBrands, listCategories } from "../../service/InstrumentService";

const InstrumentList = ({ instruments, onUpdate }) => {
  const navigator = useNavigate();
  const [selectedInstrument, setSelectedInstrument] = useState('');
  const [image, setImage] = useState([]);
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
  const [successMessage, setSuccessMessage] = useState("");
  const [countdown, setCountdown] = useState(5);

  const uploadInstrument = (id) => {
    if (!id) {
      console.error("Instrument ID is undefined or null");
      return;
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
    setImage(insToEdit.image);
    setNewInsCategory(insToEdit.categoryIns ? insToEdit.categoryIns.id : '');
    setNewInsBrand(insToEdit.brand ? insToEdit.brand.id : '');
    setInsDes(insToEdit.description);
    setNewInsStatus(insToEdit.status);

    // Mở modal
    const modal = new window.bootstrap.Modal(document.getElementById('editIns'));
    modal.show();
  };

  useEffect(() => {
    if (successMessage) {
      setCountdown(5);

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

  const validateInputs = () => {
    const errors = {};
    if (!newInsName.trim()) {
      errors.name = "Instrument name cannot be empty.";
    }
    if (instruments.some(ins => ins.name === newInsName && ins.id !== selectedInstrument.id)) {
      errors.name = "Instrument name already exists.";
    }
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
    return Object.keys(errors).length === 0;
  };

  const handleUpdate = async () => {
    if (!selectedInstrument || !selectedInstrument.id) {
      console.error("Selected instrument or ID is invalid");
      return;
    }
  
    // Kiểm tra đầu vào hợp lệ
    if (!validateInputs()) {
      return;
    }
  
    // Chuyển đổi hình ảnh thành Base64
    const base64Images = await Promise.all(
      image.map(file => {
        if (typeof file === 'string') return file; // Nếu là Base64, giữ nguyên
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result.split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      })
    );
  
    // Tạo đối tượng cập nhật cho nhạc cụ
    const updatedInstrument = {
      ...selectedInstrument,
      name: newInsName || selectedInstrument.name,
      costPrice: newInsPrice || selectedInstrument.costPrice,
      color: newInsColor || selectedInstrument.color,
      quantity: newInsQuantity || selectedInstrument.quantity,
      categoryId: newInsCategory || selectedInstrument.categoryId,
      brandId: newInsBrand || selectedInstrument.brandId,
      description: newInsDes || selectedInstrument.description,
      status: newInsStatus !== undefined ? newInsStatus : selectedInstrument.status,
      image: base64Images // Gán hình ảnh mới vào đối tượng
    };
  
    console.log("Updating instrument with ID:", selectedInstrument.id);
    console.log("Instrument data:", updatedInstrument);
  
    try {
      await updateInstrument(selectedInstrument.id, updatedInstrument);
      onUpdate();
      const modalElement = document.getElementById('editIns');
      const modal = window.bootstrap.Modal.getInstance(modalElement);
      modal.hide();
      setSuccessMessage("Instrument updated successfully!");
    } catch (error) {
      console.error("Error updating instrument:", error);
      setValidationErrors({ submit: "Failed to update instrument. Please try again." });
    }
  };
  
  // Xử lý việc thêm hình ảnh mới
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const base64Images = await Promise.all(files.map(file => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]); // Lấy phần Base64
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }));
    setImage(base64Images); // Thay vì concat, chỉ giữ lại ảnh mới
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
                  {Array.isArray(ins.image) && ins.image.length > 0 ? (
                    ins.image.map((img, idx) => (
                      <img
                        key={idx}
                        src={`data:image/png;base64,${img}`} // Đảm bảo định dạng đúng
                        alt={`${ins.name} ${idx}`}
                        style={{ width: '50px', margin: '0 5px' }}
                      />
                    ))
                  ) : (
                    <img
                      src='default-image-url'
                      alt={ins.name}
                      style={{ width: '50px' }}
                    />
                  )}
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
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className={`form-control ${validationErrors.name ? 'is-invalid' : ''}`}
                  id="name"
                  value={newInsName}
                  onChange={(e) => setNewInsName(e.target.value)}
                />
                {validationErrors.name && <div className="invalid-feedback">{validationErrors.name}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="costPrice" className="form-label">
                  Cost Price
                </label>
                <input
                  type="text"
                  className={`form-control ${validationErrors.price ? 'is-invalid' : ''}`}
                  id="costPrice"
                  value={newInsPrice}
                  onChange={(e) => setNewInsPrice(e.target.value)}
                />
                {validationErrors.price && <div className="invalid-feedback">{validationErrors.price}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="color" className="form-label">
                  Color
                </label>
                <input
                  type="text"
                  className={`form-control ${validationErrors.color ? 'is-invalid' : ''}`}
                  id="color"
                  value={newInsColor}
                  onChange={(e) => setNewInsColor(e.target.value)}
                />
                {validationErrors.color && <div className="invalid-feedback">{validationErrors.color}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="quantity" className="form-label">
                  Quantity
                </label>
                <input
                  type="text"
                  className={`form-control ${validationErrors.quantity ? 'is-invalid' : ''}`}
                  id="quantity"
                  value={newInsQuantity}
                  onChange={(e) => setNewInsQuantity(e.target.value)}
                />
                {validationErrors.quantity && <div className="invalid-feedback">{validationErrors.quantity}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="category" className="form-label">
                  Category
                </label>
                <select
                  className={`form-select ${validationErrors.category ? 'is-invalid' : ''}`}
                  id="category"
                  value={newInsCategory}
                  onChange={(e) => setNewInsCategory(e.target.value)}
                >
                  <option value="">Choose category...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {validationErrors.category && <div className="invalid-feedback">{validationErrors.category}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="brand" className="form-label">
                  Brand
                </label>
                <select
                  className={`form-select ${validationErrors.brand ? 'is-invalid' : ''}`}
                  id="brand"
                  value={newInsBrand}
                  onChange={(e) => setNewInsBrand(e.target.value)}
                >
                  <option value="">Choose brand...</option>
                  {brands.map((br) => (
                    <option key={br.id} value={br.id}>{br.name}</option>
                  ))}
                </select>
                {validationErrors.brand && <div className="invalid-feedback">{validationErrors.brand}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  rows="3"
                  value={newInsDes}
                  onChange={(e) => setInsDes(e.target.value)}
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="status" className="form-label">
                  Status
                </label>
                <select
                  className="form-select"
                  id="status"
                  value={newInsStatus ? 'true' : 'false'}
                  onChange={(e) => setNewInsStatus(e.target.value === 'true')}
                >
                  <option value="false">Available</option>
                  <option value="true">Unavailable</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="image" className="form-label">
                  Image
                </label>
                <input
                  type="file"
                  className="form-control"
                  multiple
                  onChange={handleImageUpload}
                />

              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
              <button type="button" className="btn btn-primary" onClick={handleUpdate}>
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstrumentList;
