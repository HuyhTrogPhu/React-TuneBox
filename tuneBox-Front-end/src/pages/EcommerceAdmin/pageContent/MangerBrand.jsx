import React, { useEffect, useState } from "react";
import BrandList from "../../../components/BrandTable/BrandList";
import { useNavigate } from "react-router-dom";
import { createBrand, listBrands } from "../../../service/BrandsService";

const MangerBrand = () => {
  const [newBrandName, setBrandName] = useState("");
  const [newBrandImage, setBrandImage] = useState(null);
  const [newBrandDes, setBrandDes] = useState("");
  const [brands, setBrands] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [errors, setErrors] = useState({ newBrandName: '', newBrandImage: '', newBrandDes: '' });
  const [successMessage, setSuccessMessage] = useState("");
  const [countdown, setCountdown] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState('asc');
  const navigator = useNavigate();

  const getAllBrand = () => {
    listBrands().then((response) => {
      console.log(response.data);
      setBrands(response.data);
    }).catch((error) => {
      console.error("Error fetching brands", error);
    });
  };

  useEffect(() => {
    getAllBrand();
  }, []);

  const validateForm = () => {
    let valid = true;
    const errorsCopy = { ...errors };

    if (!newBrandName.trim()) {
      errorsCopy.newBrandName = 'Brand name is required';
      valid = false;
    } else {
      errorsCopy.newBrandName = '';
    }

    if (!newBrandImage) {
      errorsCopy.newBrandImage = 'Brand image is required';
      valid = false;
    } else {
      errorsCopy.newBrandImage = '';
    }

    if (!newBrandDes.trim()) {
      errorsCopy.newBrandDes = 'Brand description is required';
      valid = false;
    } else {
      errorsCopy.newBrandDes = '';
    }

    setErrors(errorsCopy);
    return valid;
  };

  const handleSave = () => {
    setErrors({ newBrandName: '', newBrandImage: '', newBrandDes: '' }); // Reset errors before validation
    if (!validateForm()) {
      return;
    }

    const newBrand = new FormData();
    newBrand.append('name', newBrandName);
    newBrand.append('imageBrand', newBrandImage);
    newBrand.append('desc', newBrandDes);

    createBrand(newBrand)
      .then((response) => {
        console.log("Brand created:", response.data);
        getAllBrand();
        setBrandName("");
        setBrandImage(null);
        setBrandDes("");
        document.getElementById("closeModal").click();
        setSuccessMessage("Brand created successfully!");
      })
      .catch((error) => {
        console.error("Error creating brand:", error);
      });
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

  // Lọc danh sách dựa trên từ khóa tìm kiếm
  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBrands = filteredBrands.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Hàm sắp xếp
  const handleSort = () => {
    const sortedBrands = [...brands].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

    setBrands(sortedBrands);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div>
      <div className="container-fluid">
        {successMessage && (
          <div className="alert alert-success" role="alert">
            {successMessage} This notice will be closed in <b>{countdown}s.</b>
          </div>
        )}

        <div className="input-group mb-1 p-2">
          <input
            type="text"
            className="form-control"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="input-group-text" id="basic-addon2">
            <i className="fa-solid fa-magnifying-glass" />
          </button>
        </div>

        {/* Nút sắp xếp */}
        <button className="btn btn-secondary" onClick={handleSort}>
          Sort {sortOrder === 'asc' ? 'Descending' : 'Ascending'}
        </button>

        <button
          data-bs-toggle="modal"
          data-bs-target="#ViewsModal"
          className="btn btn-primary"
          style={{ marginLeft: 17 }}
        >
          Add Brand
        </button>

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
                    <div>
                    <label className="form-label" >Brand name:</label>
                    <input className={`form-control ${errors.newBrandName ? 'is-invalid' : ''} `}
                      value={newBrandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      type="text"
                      placeholder="Enter brand name" />
                    </div>
                  
                  </div>
                  {errors.newBrandName && <div className='invalid-feedback'>{errors.newBrandName}</div>}

                  <div className="mt-3">
                    <label className="form-label" >Image:</label>
                    <input type="file"
                      className={`form-control ${errors.newBrandImage ? 'is-invalid' : ''} `}
                      onChange={(e) => setBrandImage(e.target.files[0])} />
                  </div>
                  {errors.newBrandImage && <div className='invalid-feedback'>{errors.newBrandImage}</div>}

                  <div className="mt-3">
                    <label className="form-label">Description:</label>
                    <textarea cols="50" rows="5"
                      className={`form-control ${errors.newBrandDes ? 'is-invalid' : ''}`}
                      value={newBrandDes}
                      onChange={(e) => setBrandDes(e.target.value)}></textarea>
                  </div>
                  {errors.newBrandDes && <div className='invalid-feedback'>{errors.newBrandDes}</div>}

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
        <BrandList brands={currentBrands} onUpdate={getAllBrand} />

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
