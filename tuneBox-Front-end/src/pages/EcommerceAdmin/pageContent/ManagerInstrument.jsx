import React, { useEffect, useState } from "react";
import InstrumentTable from "../../../components/Instrumentable/InstrumentList";
import "../css/ManagerInstrument.css";
import { createInstrument, listBrands, listCategories, listInstruments } from "../../../service/InstrumentService";

const ManagerInstrument = () => {

  const [newInsName, setInsName] = useState("");
  const [newInsPrice, setInsPrice] = useState("");
  const [newInsQuantity, setInsQuantity] = useState("");
  const [newInsColor, setInsColor] = useState("");

  const [newInsImage, setInsImage] = useState([]);

  const [newInsCategory, setInsCategory] = useState("");
  const [newInsBrand, setInsBrand] = useState("");
  const [newInsDes, setInsDes] = useState("");

  const [instruments, setInstruments] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [apiError, setApiError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState('asc');

  const [loading, setLoading] = useState(false);
  //Sort theo cate  và brand
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");


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

  //reset form 
  const resetForm = () => {
    setInsName("");
    setInsPrice("");
    setInsQuantity("");
    setInsColor("");
    setInsImage(null);
    setInsCategory("");
    setInsBrand("");
    setInsDes("");
    setErrors({});
  };

  function validateForm() {
    let valid = true;
    const errorsCopy = { ...errors };

    const isDuplicateName = instruments.some(ins => ins.name.toLowerCase() === newInsName.toLowerCase());
    if (isDuplicateName) {
      errorsCopy.newInsName = 'Instrument name already exists';
      valid = false;
    } else if (!newInsName.trim()) {
      errorsCopy.newInsName = 'Instrument name is required';
      valid = false;
    } else {
      errorsCopy.newInsName = '';
    }
    const priceRegex = /^\d+(\.\d+)?$/; // Regex để kiểm tra giá (chỉ cho phép số và số thập phân)
    if (!newInsPrice.trim() || !priceRegex.test(newInsPrice) || parseFloat(newInsPrice) < 0) {
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

    const quantityRegex = /^\d+$/; // Regex để kiểm tra số lượng (chỉ cho phép số nguyên dương)
    if (!newInsQuantity.trim() || !quantityRegex.test(newInsQuantity) || parseInt(newInsQuantity) < 0) {
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
    setLoading(true);
    const newInstrument = new FormData();
    newInstrument.append('name', newInsName);
    newInstrument.append('costPrice', parseFloat(newInsPrice));

    newInstrument.append('quantity', newInsQuantity);
    newInstrument.append('color', newInsColor);
    newInstrument.append('image', newInsImage);
    newInstrument.append('description', newInsDes);
    newInstrument.append('categoryId', newInsCategory);
    newInstrument.append('brandId', newInsBrand);

    createInstrument(newInstrument)
      .then((response) => {
        console.log("Instrument created:", response.data);

        // Đóng modal
        document.getElementById("closeModal").click();

        // Cập nhật danh sách nhạc cụ
        getAllInstrument();
        setMessage("Add done!")
      }).catch((error) => {
        console.error("Error creating instrument", error);
      }).finally(() => {
        setLoading(false)
      })
  };


  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Lọc danh sách dựa trên từ khóa tìm kiếm
  const filteredIns = instruments.filter(ins => {
    const matchesSearchTerm = ins.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? ins.categoryIns && ins.categoryIns.id === parseInt(selectedCategory, 10) : true;
    const matchesBrand = selectedBrand ? ins.brand && ins.brand.id === parseInt(selectedBrand, 10) : true; // Thay đổi so sánh


    return matchesSearchTerm && matchesCategory && matchesBrand;
  });



  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentIns = filteredIns.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredIns.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSort = () => {
    const sortedInstruments = [...instruments].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

    setInstruments(sortedInstruments); // Cập nhật danh sách nhạc cụ
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };


  return (
    <div>
      {/* Main Content */}
      <div className="container-fluid">

        {message && <div className="alert alert-success">{message}</div>}
        {apiError && <div className="alert alert-danger">{apiError}</div>} {/* Display API error */}

        {/* Display errors for each input */}

        <div className="row m-2">
          <div className="row">
            {/* Search by keyword */}
            <div className="col-lg-4">
              <form action="" className="p-3">
                <div className="input-group mb-3 mt-3">
                  <input
                    className="form-control m-0"
                    placeholder="Enter keyword"
                    value={searchTerm} // Gán giá trị cho input
                    onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật giá trị searchTerm
                  />

                  <button className="btn border" type="submit">
                    <i className="fa-solid fa-magnifying-glass" />
                  </button>
                </div>
              </form>
            </div>

            {/* Search by category */}
            <div className="col-lg-3">
              <label className="form-label">Categories</label>
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)} // Cập nhật giá trị selectedCategory
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
              <button
                className="btn btn-secondary mt-3"
                onClick={() => setSelectedCategory("")} // Đặt lại giá trị selectedBrand
              >
                Reset
              </button>
            </div>


            {/* Search by brand */}
            <div className="col-lg-3">
              <label className="form-label">Brands</label>
              <select
                className="form-select"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)} // Cập nhật giá trị selectedBrand
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
              <button
                className="btn btn-secondary mt-3"
                onClick={() => setSelectedBrand("")} // Đặt lại giá trị selectedBrand
              >
                Reset
              </button>
            </div>



          </div>

        </div>
        <button className="btn btn-secondary" onClick={handleSort}>
          Sort {sortOrder === 'asc' ? 'Descending' : 'Ascending'}
        </button>
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
                        <input className={`form-control `}
                          type="text" placeholder="Enter instrument name"
                          value={newInsName}
                          onChange={(e) => setInsName(e.target.value)} />
                      </div>
                      {errors.newInsName && <div className="alert alert-danger mt-3">{errors.newInsName}</div>}

                      <div className="mt-3">
                        <label className="form-label">Price:</label>
                        <input className={`form-control `}
                          type="text" placeholder="Enter const price"
                          value={newInsPrice}
                          onChange={(e) => setInsPrice(e.target.value)} />
                      </div>
                      {errors.newInsPrice && <div className="alert alert-danger mt-3">{errors.newInsPrice}</div>}

                      <div className="mt-3">
                        <label className="form-label">Color:</label>
                        <input className={`form-control `}
                          type="text" placeholder="Enter instrument color"
                          value={newInsColor}
                          onChange={(e) => setInsColor(e.target.value)} />
                      </div>
                      {errors.newInsColor && <div className="alert alert-danger mt-3">{errors.newInsColor}</div>}
                      <div className="mt-3">
                        <label className="form-label">Quantity:</label>
                        <input className={`form-control`}
                          type="text" placeholder="Enter instrument quantity"
                          value={newInsQuantity}
                          onChange={(e) => setInsQuantity(e.target.value)} />
                      </div>
                      {errors.newInsQuantity && <div className="alert alert-danger mt-3">{errors.newInsQuantity}</div>}
                      <div className="mt-3">
                        <label className="form-label">Instrument Image</label>
                        <input type="file" className={`form-control `}
                          onChange={(e) => setInsImage(e.target.files[0])} />
                      </div>
                      {errors.newInsImage && <div className="alert alert-danger mt-3">{errors.newInsImage}</div>}
                    </div>

                    <div className="col-6">

                      <div className="mt-3">
                        <label className="form-label">Category:</label>
                        <select
                          className={`form-select  ${errors.newInsCategory ? 'is-invalid' : ''}`}
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
                        {errors.newInsDes && <div className="alert alert-danger mt-3">{errors.newInsDes}</div>}
                      </div>

                      <div className="mt-3">
                        <label className="form-label">Brand:</label>
                        <select

                          className={`form-select ${errors.newInsBrand ? 'is-invalid' : ''}`}
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
                        {errors.newInsBrand && <div className="alert alert-danger mt-3">{errors.newInsBrand}</div>}
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
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={resetForm} // Gọi hàm resetForm khi nhấn nút
                      >
                        Reset Form
                      </button>
                      <button type="button" className="btn btn-primary" onClick={handleSave} disabled={loading} >

                        {loading ? (
                          <span>
                            <i className="fa fa-spinner fa-spin" /> Saving...
                          </span>
                        ) : (
                          "Save"
                        )}
                      </button>
                    </div>

                  </form>

                </div>
              </div>

            </div>
          </div>
        </div>


        {/* Table */}
        <InstrumentTable instruments={currentIns} onUpdate={getAllInstrument} />



        {/* Pagination */}
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
    </div>
  );
};

export default ManagerInstrument;