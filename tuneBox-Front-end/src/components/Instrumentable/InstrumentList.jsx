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

  const [selectedImageIndex, setSelectedImageIndex] = useState(null); // lưu chỉ mục ảnh muốn thay thế


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
    listInstruments()
      .then((response) => {
        setInstruments(response.data);
      })
      .catch((error) => {
        console.error("Error fetching instruments", error);
        setInstruments([]);
      });
  }, []);

  function uploadInstrument(id) {
    navigator(`/edit-instrument/${id}`);
  }

  function removeInstrument(id) {
    const insToUpdate = instruments.find((ins) => ins.id === id);
    const updatedStatus = !insToUpdate.status;

    updateInstrument({ ...insToUpdate, status: updatedStatus }, id)
      .then(() => {
        onUpdate();
      })
      .catch((error) => {
        console.error(error);
      });
  }

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

