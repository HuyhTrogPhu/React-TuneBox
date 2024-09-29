import React, { useEffect, useState } from "react";
import InstrumentTable from "../../../components/Instrumentable/InstrumentList";
import "../css/ManagerInstrument.css";
import { createInstrument, listBrands, listCategories, listInstruments } from "../../../service/InstrumentService";

const ManagerInstrument = () => {

  const [newInsName, setInsName] = useState("");
  const [newInsPrice, setInsPrice] = useState("");
  const [newInsQuantity, setInsQuantity] = useState("");
  const [newInsColor, setInsColor] = useState("");
  const [newInsImage, setInsImage] = useState(null);
  const [newInsCategory, setInsCategory] = useState("");
  const [newInsBrand, setInsBrand] = useState("");
  const [newInsDes, setInsDes] = useState("");

  const [instruments, setInstruments] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [apiError, setApiError] = useState("");

  const getAllInstrument = () => {
    listInstruments().then((response) => {
      console.log(response.data);
      setInstruments(response.data);
    }).catch((error) => {
      console.error("Error fetching instruments", error);
    })
  }

  const getAllBrand = () => {
    listBrands().then((response) => {
      console.log(response.data);
      setBrands(response.data);
    }).catch((error) => {
      console.error("Error fetching brands", error);
    })
  }

  const getAllCategory = () => {
    listCategories().then((response) => {
      console.log(response.data);
      setCategories(response.data);
    }).catch((error) => {
      console.error("Error fetching categories", error);
    })
  }

  useEffect(() => {
    getAllInstrument();
    getAllBrand();
    getAllCategory();
  }, []);

  function validateForm() {
    let valid = true;
    const errorsCopy = { ...errors };

    if (!newInsName.trim()) {
      errorsCopy.newInsName = 'Instrument name is required';
      valid = false;
    } else {
      errorsCopy.newInsName = '';
    }

    if (!newInsPrice.trim() || parseFloat(newInsPrice) < 0) {
      errorsCopy.newInsPrice = 'Instrument price must be a positive number';
      valid = false;
    } else {
      errorsCopy.newInsPrice = '';
    }

    if (!newInsColor.trim()) {
      errorsCopy.newInsColor = 'Instrument color is required';
      valid = false;
    } else {
      errorsCopy.newInsColor = '';
    }

    if (!newInsQuantity.trim() || parseInt(newInsQuantity) < 0) {
      errorsCopy.newInsQuantity = 'Instrument quantity must be a positive integer';
      valid = false;
    } else {
      errorsCopy.newInsQuantity = '';
    }

    if (!newInsImage) {
      errorsCopy.newInsImage = 'Instrument image is required';
      valid = false;
    } else {
      errorsCopy.newInsImage = '';
    }

    if (!newInsDes.trim()) {
      errorsCopy.newInsDes = 'Instrument description is required';
      valid = false;
    } else {
      errorsCopy.newInsDes = '';
    }

    if (!newInsBrand) {
      errorsCopy.newInsBrand = 'Instrument brand is required';
      valid = false;
    } else {
      errorsCopy.newInsBrand = '';
    }

    if (!newInsCategory) {
      errorsCopy.newInsCategory = 'Instrument category is required';
      valid = false;
    } else {
      errorsCopy.newInsCategory = '';
    }

    setErrors(errorsCopy);
    return valid;
  }

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    const newInstrument = new FormData();
    newInstrument.append('name', newInsName);
    newInstrument.append('costPrice', parseFloat(newInsPrice));

    newInstrument.append('quantity', newInsQuantity);
    newInstrument.append('color', newInsColor);
    newInstrument.append('image', newInsImage);
    newInstrument.append('description', newInsDes);
    newInstrument.append('categoryId', newInsCategory);
    newInstrument.append('brandId', newInsBrand);

    createInstrument(newInstrument).then((response) => {
      console.log("Instrument created:", response.data);

      // Đóng modal
      document.getElementById("closeModal").click();

      // Cập nhật danh sách nhạc cụ
      getAllInstrument();
    }).catch((error) => {
      console.error("Error creating instrument", error);
    });
  };


  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);


  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentInstrument = instruments.slice(indexOfFirstItem, indexOfLastItem);

  // const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // const totalPages = Math.ceil(instruments.length / itemsPerPage);


  return (
    <div>
      {/* Main Content */}
      <div className="container-fluid">

        {message && <div className="alert alert-success">{message}</div>}
        {apiError && <div className="alert alert-danger">{apiError}</div>} {/* Display API error */}

        {/* Display errors for each input */}
        {errors.newInsName && <div className="alert alert-danger">{errors.newInsName}</div>}
        {errors.newInsPrice && <div className="alert alert-danger">{errors.newInsPrice}</div>}
        {errors.newInsColor && <div className="alert alert-danger">{errors.newInsColor}</div>}
        {errors.newInsQuantity && <div className="alert alert-danger">{errors.newInsQuantity}</div>}
        {errors.newInsImage && <div className="alert alert-danger">{errors.newInsImage}</div>}
        {errors.newInsDes && <div className="alert alert-danger">{errors.newInsDes}</div>}


        <div className="row m-2">
          <div className="row">
            {/* Search by keyword */}
            <div className="col-lg-4">
              <form action="" className="p-3">
                <div className="input-group mb-3 mt-3">
                  <input className="form-control m-0" placeholder="Enter keyword" />
                  <button className="btn border" type="submit">
                    <i className="fa-solid fa-magnifying-glass" />
                  </button>
                </div>
              </form>
            </div>

            {/* Search by category */}
            <div className="col-lg-4">
              <label className="form-label">Categories</label>
              <select
                className="form-select"
                value={newInsCategory}
                onChange={(e) => setInsCategory(e.target.value)}
              >
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
            </div>


            {/* Search by brand */}
            <div className="col-lg-4">
              <label className="form-label">Brands</label>
              <select
                className="form-select"
                value={newInsBrand}
                onChange={(e) => setInsBrand(e.target.value)}
              >
                <option value="" disabled>
                  Select category instrument
                </option>
                {Array.isArray(brands) && brands.length > 0 ? (
                  brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No categories available
                  </option>
                )}
              </select>
            </div>


          </div>

        </div>

        <button
          className="btn m-3 btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#ViewsModal"
        >
          Add instrument
        </button>

        {/*Modal*/}
        <div
          className="modal fade"
          id="ViewsModal"
          tabIndex={-1}
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Add new instrument
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

                  <form action="" className="row">

                    <div className="col-6">

                      <div className="mt-3">
                        <label className="form-label">Instrument name:</label>
                        <input className={`form-control ${errors.newInsName ? 'is-valid' : ''}`}
                          type="text" placeholder="Enter instrument name"
                          value={newInsName}
                          onChange={(e) => setInsName(e.target.value)} />
                      </div>

                      <div className="mt-3">
                        <label className="form-label">Price:</label>
                        <input className={`form-control ${errors.newInsPrice ? 'is-valid' : ''}`}
                          type="text" placeholder="Enter const price"
                          value={newInsPrice}
                          onChange={(e) => setInsPrice(e.target.value)} />
                      </div>

                      <div className="mt-3">
                        <label className="form-label">Color:</label>
                        <input className={`form-control ${errors.newInsColor ? 'is-valid' : ''}`}
                          type="text" placeholder="Enter instrument color"
                          value={newInsColor}
                          onChange={(e) => setInsColor(e.target.value)} />
                      </div>

                      <div className="mt-3">
                        <label className="form-label">Quantity:</label>
                        <input className={`form-control ${errors.newInsQuantity ? 'is-valid' : ''}`}
                          type="text" placeholder="Enter instrument quantity"
                          value={newInsQuantity}
                          onChange={(e) => setInsQuantity(e.target.value)} />
                      </div>

                      <div className="mt-3">
                        <label className="form-label">Instrument Image</label>
                        <input type="file" className={`form-control ${errors.newInsImage ? 'is-valid' : ''}`}
                          onChange={(e) => setInsImage(e.target.files[0])} />
                      </div>

                    </div>

                    <div className="col-6">

                      <div className="mt-3">
                        <label className="form-label">Category:</label>
                        <select
                          className="form-select"
                          value={newInsCategory || ""}
                          onChange={(e) => setInsCategory(e.target.value)}
                        >
                          <option value="" disabled>Select category</option>
                          {categories && categories.length > 0 ? (
                            categories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))
                          ) : (
                            <option disabled>No categories available</option>
                          )}
                        </select>
                      </div>

                      <div className="mt-3">
                        <label className="form-label">Brand:</label>
                        <select
                          className="form-select"
                          value={newInsBrand || ""}
                          onChange={(e) => setInsBrand(e.target.value)}
                        >
                          <option value="" disabled>Select brand</option>
                          {brands && brands.length > 0 ? (
                            brands.map((brand) => (
                              <option key={brand.id} value={brand.id}>
                                {brand.name}
                              </option>
                            ))
                          ) : (
                            <option disabled>No brands available</option>
                          )}
                        </select>
                      </div>



                      <div className="mb=3">
                        <label className="form-label">Description</label>
                        <textarea cols="30" rows="10"
                          className={`form-control ${errors.newInsDes ? 'is-invalid' : ''}`}
                          value={newInsDes}
                          onChange={(e) => setInsDes(e.target.value)}></textarea>
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
                      <button type="button" className="btn btn-primary" onClick={handleSave}>
                        Save
                      </button>
                    </div>

                  </form>

                </div>
              </div>

            </div>
          </div>
        </div>


        {/* Table */}
        <InstrumentTable instruments={instruments} onUpdate={getAllInstrument} />



        {/* pagination */}
        {/* <div className="">
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
        </div> */}



      </div>
    </div>
  );
};

export default ManagerInstrument;
