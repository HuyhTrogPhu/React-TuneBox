import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import { listInstruments, updateInstrument, listBrands, listCategories } from "../../service/InstrumentService";
=======
import { listInstruments, updateInstrument, listBrands, listCategories, } from "../../service/InstrumentService";
>>>>>>> 3b1e11153692986a1508d176b8f2ba716a80fd02

const InstrumentList = ({ instruments, onUpdate }) => {
  const navigator = useNavigate();
  const [selectedInstrument, setSelectedInstrument] = useState('');
<<<<<<< HEAD
  const [image, setImage] = useState([]);
=======
  const [image, setImage] = useState(null);
>>>>>>> 3b1e11153692986a1508d176b8f2ba716a80fd02
  const [newInsName, setNewInsName] = useState('');
  const [newInsPrice, setNewInsPrice] = useState('');
  const [newInsColor, setNewInsColor] = useState('');
  const [newInsQuantity, setNewInsQuantity] = useState('');
  const [newInsCategory, setNewInsCategory] = useState('');
  const [newInsBrand, setNewInsBrand] = useState('');
  const [newInsDes, setInsDes] = useState('');
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
<<<<<<< HEAD

  const [selectedImageIndex, setSelectedImageIndex] = useState(null); // lưu chỉ mục ảnh muốn thay thế


  const [validationErrors, setValidationErrors] = useState({});
  const [newInsStatus, setNewInsStatus] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [countdown, setCountdown] = useState(5);

  const uploadInstrument = (id) => {
    if (!id) {
      console.error("Instrument ID is undefined or null");
      return;
=======
  const [validationErrors, setValidationErrors] = useState({});
  const [newInsStatus, setNewInsStatus] = useState(false);
  const [currentImage, setCurrentImage] = useState(null); // Thêm biến trạng thái cho hình ảnh hiện tại
  const [successMessage, setSuccessMessage] = useState("");
  const [countdown, setCountdown] = useState(5);





  const uploadInstrument = (id) => {
    if (!id) {
      console.error("Instrument ID is undefined or null");
      return;  // Ngăn việc tiếp tục nếu ID không hợp lệ
>>>>>>> 3b1e11153692986a1508d176b8f2ba716a80fd02
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
<<<<<<< HEAD
    setImage(insToEdit.image);
=======
    setImage(insToEdit.image); // Giữ hình ảnh hiện tại
    setCurrentImage(insToEdit.image);
>>>>>>> 3b1e11153692986a1508d176b8f2ba716a80fd02
    setNewInsCategory(insToEdit.categoryIns ? insToEdit.categoryIns.id : '');
    setNewInsBrand(insToEdit.brand ? insToEdit.brand.id : '');
    setInsDes(insToEdit.description);
    setNewInsStatus(insToEdit.status);
<<<<<<< HEAD

=======
>>>>>>> 3b1e11153692986a1508d176b8f2ba716a80fd02
    // Mở modal
    const modal = new window.bootstrap.Modal(document.getElementById('editIns'));
    modal.show();
  };

<<<<<<< HEAD
  useEffect(() => {
    if (successMessage) {
      setCountdown(5);
=======

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
>>>>>>> 3b1e11153692986a1508d176b8f2ba716a80fd02

      const intervalId = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);

      const timeoutId = setTimeout(() => {
<<<<<<< HEAD
        setSuccessMessage("");
      }, 5000);

=======
        setSuccessMessage(""); // Đặt lại thông báo sau khi hết thời gian
      }, 5000);

      // Dọn dẹp khi component unmount hoặc khi successMessage thay đổi
>>>>>>> 3b1e11153692986a1508d176b8f2ba716a80fd02
      return () => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
      };
    }
  }, [successMessage]);
<<<<<<< HEAD

  const validateInputs = () => {
    const errors = {};
=======
  //validation
  const validateInputs = () => {
    const errors = {};
    // Check instrument name
>>>>>>> 3b1e11153692986a1508d176b8f2ba716a80fd02
    if (!newInsName.trim()) {
      errors.name = "Instrument name cannot be empty.";
    }
    if (instruments.some(ins => ins.name === newInsName && ins.id !== selectedInstrument.id)) {
      errors.name = "Instrument name already exists.";
    }
<<<<<<< HEAD
=======
    // Check price, color, quantity
>>>>>>> 3b1e11153692986a1508d176b8f2ba716a80fd02
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
<<<<<<< HEAD

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // update instrument 
=======
  
    setValidationErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };
  

>>>>>>> 3b1e11153692986a1508d176b8f2ba716a80fd02
  const handleUpdate = async () => {
    if (!selectedInstrument || !selectedInstrument.id) {
      console.error("Selected instrument or ID is invalid");
      return;
    }
<<<<<<< HEAD

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
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage = reader.result.split(',')[1]; // Lấy dữ liệu base64 của ảnh mới
  
        // Tạo bản sao của danh sách ảnh để không thay đổi state trực tiếp
        const updatedImages = [...image];
        
        // Thay thế ảnh tại vị trí đã click trong danh sách
        if (selectedImageIndex !== null) {
          updatedImages[selectedImageIndex] = newImage;
          setImage(updatedImages); // Cập nhật lại state với ảnh mới
        }
      };
      reader.readAsDataURL(files[0]); // Đọc file đầu tiên được chọn
    }
  };
  
  const handleImageClick = (index) => {
    setSelectedImageIndex(index); // Lưu lại chỉ số ảnh được click
    document.querySelector('input[type="file"]').click(); // Mở hộp thoại chọn ảnh
  };
  




=======
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

>>>>>>> 3b1e11153692986a1508d176b8f2ba716a80fd02



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
<<<<<<< HEAD
=======
      {/* Hiển thị thông báo thành công */}
>>>>>>> 3b1e11153692986a1508d176b8f2ba716a80fd02
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
<<<<<<< HEAD

                <td>
                  {Array.isArray(ins.image) && ins.image.length > 0 ? (
                    <img
                      src={`data:image/png;base64,${ins.image[0]}`} // Chỉ hiển thị ảnh đầu tiên
                      alt={`${ins.name} 0`}
                      style={{ width: '50px', margin: '0 5px' }}
                    />
                  ) : (
                    <img
                      src='default-image-url'
                      alt={ins.name}
                      style={{ width: '50px' }}
                    />
                  )}
                </td>

=======
                <td>
                  <img
                    src={ins.image ? `data:image/${ins.image.split('.').pop()};base64,${ins.image}` : 'default-image-url'}
                    alt={ins.name}
                    style={{ width: '50px' }}
                  />
                </td>
>>>>>>> 3b1e11153692986a1508d176b8f2ba716a80fd02
                <td>{ins.name}</td>
                <td>{ins.categoryIns ? ins.categoryIns.name : 'No category'}</td>
                <td>{ins.brand ? ins.brand.name : 'No brand'}</td>
                <td>{ins.costPrice}</td>
                <td>{ins.color}</td>
                <td>{ins.quantity}</td>
<<<<<<< HEAD
                <td>{ins.status ? 'Available' : 'Unavailable'}</td>
=======
                <td>{ins.status ? 'Unavailable' : 'Available'}</td>
>>>>>>> 3b1e11153692986a1508d176b8f2ba716a80fd02
                <td>
                  <button className='btn btn-warning' onClick={() => uploadInstrument(ins.id)}>
                    Edit
                  </button>
                </td>
<<<<<<< HEAD
=======
                {/* <td>
                  <button
                    className={`btn ms-4 ${ins.status ? 'btn-success' : 'btn-danger'}`}
                    onClick={() => handleStatusChange(ins.id)}
                  >
                    {ins.status ? 'Mark as Available' : 'Mark as Unavailable'}
                  </button>
                </td> */}
>>>>>>> 3b1e11153692986a1508d176b8f2ba716a80fd02
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="text-center">No instruments available</td>
            </tr>
          )}
        </tbody>
      </table>

<<<<<<< HEAD
      {/* Modal edit */}
=======
>>>>>>> 3b1e11153692986a1508d176b8f2ba716a80fd02
      <div
        className="modal fade"
        id="editIns"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
<<<<<<< HEAD
        data-bs-backdrop="false"
=======
>>>>>>> 3b1e11153692986a1508d176b8f2ba716a80fd02
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
<<<<<<< HEAD
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
                  <option value="true">Available</option>
                  <option value="false">Unavailable</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="image" className="form-label">Image</label>
                {Array.isArray(image) && image.length > 0 ? (
                  image.map((img, idx) => (
                    <img
                      key={idx}
                      src={`data:image/png;base64,${img}`} // Hiển thị ảnh base64
                      alt={`Instrument image ${idx}`}
                      style={{ width: '50px', margin: '0 5px', cursor: 'pointer' }}
                      onClick={() => handleImageClick(idx)} // Nhấn vào ảnh để thay thế
                    />
                  ))
                ) : (
                  <img
                    src="default-image-url"
                    alt="Default instrument image"
                    style={{ width: '50px' }}
                  />
                )}
                <input
                  type="file"
                  className="form-control"
                  hidden
                  onChange={handleImageUpload} // Gọi hàm xử lý khi người dùng chọn ảnh mới
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
=======
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
>>>>>>> 3b1e11153692986a1508d176b8f2ba716a80fd02
            </div>
          </div>
        </div>
      </div>
<<<<<<< HEAD

=======
>>>>>>> 3b1e11153692986a1508d176b8f2ba716a80fd02
    </div>
  );
};

export default InstrumentList;
<<<<<<< HEAD
=======

>>>>>>> 3b1e11153692986a1508d176b8f2ba716a80fd02
