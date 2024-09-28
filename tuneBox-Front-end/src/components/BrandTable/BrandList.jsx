import React from 'react';
import { useNavigate } from 'react-router-dom';

const BrandList = ({ brands, onUpdate }) => {
  const navigator = useNavigate();

  function uploadBrand(id) {
    navigator(`/edit-brand/${id}`);
  }

  function removeBrand(id) {
    const brandToUpdate = brands.find((bra) => bra.id === id);
    const updatedStatus = !brandToUpdate.status;

    updateBrand({ ...brandToUpdate, status: updatedStatus }, id)
      .then(() => {
        onUpdate();
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div>
      <table className="table table-striped table-hover">
        <thead className='text-center'>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Brand Image</th>
            <th scope="col">Brand Name</th>
            <th scope="col">Description</th>
            <th scope="col">Status</th>
            <th scope="col">Action</th>
            <th scope="col">Status Transition</th>
          </tr>
        </thead>
        <tbody>
          {brands.map((bra, index) => (
            <tr key={bra.id} className="ps-0">
              <td>{index + 1}</td>
              <td>
                <img
                  src={`data:image/${bra.brandImage.split('.').pop()};base64,${bra.brandImage}`}
                  alt={bra.name}
                  style={{ width: '50px' }}
                />
              </td>
              <td>{bra.name}</td>
              <td>{bra.desc ? bra.desc : 'No description available'}</td>
              <td>{bra.status ? 'Unavailable' : 'Available'}</td>
              <td>
                <button className='btn btn-warning' onClick={() => uploadBrand(bra.id)}>
                  Edit
                </button>
              </td>
              <td>
                <button
                  className={`btn ms-4 ${bra.status ? 'btn-success' : 'btn-danger'}`}
                  onClick={() => removeBrand(bra.id)}
                >
                  {bra.status ? 'Mark as Available' : 'Mark as Unavailable'}
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BrandList;
