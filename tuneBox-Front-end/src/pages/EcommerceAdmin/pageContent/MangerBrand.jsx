import React, { useEffect, useState } from "react";
import BrandList from "../../../components/BrandTable/BrandList";
import { useNavigate } from "react-router-dom";
import { createBrand, listBrands } from "../../../service/BrandsService";

const MangerBrand = () => {
  const [newBrandName, setBrandName] = useState("");
  const [newBrandImage, setBrandImage] = useState("");
  const [newBrandDes, setBrandDes] = useState("");
  const [brands, setBrands] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [errors, setErrors] = useState({ newBrandName: '', newBrandImage: '', newBrandDes: '' });
  const navigator = useNavigate();

  function getAllBrand() {
    listBrands().then((response) => {
      setBrands(response.data);
    }).catch((error) => {
      console.error("Error fetching brands", error)
    })
  }

  useEffect(() => {
    getAllBrand();
  }, []);

  function validateForm() {
    let valid = true;
    const errorsCopy = { ...errors };

    if (newBrandName.trim()) {
      errorsCopy.newBrandName = '';
    } else {
      errorsCopy.newBrandName = 'Brand name is required';
      valid = false;
    }

    if (newBrandImage) {
      errorsCopy.newBrandImage = '';
    } else {
      errorsCopy.newBrandImage = 'Brand image is required';
      valid = false;
    }

    if (newBrandDes.trim()) {
      errorsCopy.newBrandDes = '';
    } else {
      errorsCopy.newBrandDes = 'Brand description is required';
      valid = false;
    }

    setErrors(errorsCopy);
    return valid;
  }

  function handleSave() {
    if (!validateForm()) {
      return;
    }

    const newBrand = {
      name: newBrandName,
      image: newBrandImage,
      desc: newBrandDes,
      status: false
    };

    createBrand(newBrand).then((response) => {
      console.log("Brand:", response.data);
      getAllBrand();
      setBrandName("");
      setBrandImage("");
      setBrandDes("");
      document.getElementById("closeModal").click();
    }).catch((error) => {
      console.log("Error creating brand:", error);
    });
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBrands = brands.slice(indexOfFirstItem, indexOfLastItem); // Sửa thành 'brands'

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(brands.length / itemsPerPage); // Sửa thành 'brands'

  return (
    <div>
      {/* Main Content */}
      <div className="container-fluid">
        <div className="input-group mb-1 p-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search"
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
          />
          <button className="input-group-text" id="basic-addon2">
            <i className="fa-solid fa-magnifying-glass" />
          </button>
        </div>
        <button
          data-bs-toggle="modal"
          data-bs-target="#ViewsModal"
          className="btn btn-primary"
          style={{ marginLeft: 17 }}
        >
          Add Brand
        </button>

        {/*Modal*/}
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
                  Add Brand
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
                <form action="">
                  <div className="mt-3">
                    <label className="form-label" >Brand name:</label>
                    <input className={`form-control ${errors.newBrandName ? 'is-invalid' : ''} `}
                      value={newBrandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      type="text"
                      placeholder="Enter brand name" />
                  </div>

                  <div className="mt-3">
                    <label className="form-label" >Image:</label>
                    <input type="file"
                      className={`form-control ${errors.newBrandImage ? 'is-invalid' : ''} `}
                      onChange={(e) => setBrandImage(e.target.files[0])} />
                  </div>

                  <div className="mt-3">
                    <label className="form-label">Description:</label>
                    <textarea cols="50" rows="50"
                      className={`form-control ${errors.newBrandDes ? 'is-invalid' : ''}`}
                      value={newBrandDes}
                      onChange={(e) => setBrandDes(e.target.value)}></textarea>
                  </div>

                </form>
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

        {/* Table */}
        <BrandList brands={currentBrands} />

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

export default MangerBrand;
