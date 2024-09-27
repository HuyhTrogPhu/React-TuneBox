import React from 'react'
import { useNavigate } from 'react-router-dom'

const BrandList = ({ brands, onUpdate }) => {

  const navigator = useNavigate();

  function uploadBrand(id) {
    navigator(`/edit-brand/${id}`);
  }

  function removeBrand(id) {
    const brandToUpdate = brands.find((bra) => bra.id === id);
    const updatedStatus = !brandToUpdate.status;
    const updateBrand = { ...brandToUpdate, status: updatedStatus };

    updateBrand(id, updateBrand).then((response) => {
      onUpdate();
    }).catch((error) => {
      console.error(error);
    })
  }

  return (
    <div>

      <table className="table table-striped table-hover">
        <thead className='text-center'>
          <tr >
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

          {brands.map((bra, index) => {

            <tr key={bra.id} className="ps-0">
              <td>{index + 1}</td>
              <td>{bra.image}</td>
              <td>{bra.name}</td>
              <td>{bra.desc}</td>
              <td>{bra.status ? 'UNavailable' : 'Available'}</td>
              <td>
                <button className='btn btn-warning' onClick={() => uploadBrand(bra, id)}>
                  Edit
                </button>
              </td>
              <td>
                <button className='btn btn-success ms-4' onClick={() => removeBrand(bra, id)}>
                  {bra.status ? 'Mark as Available' : 'Mark as Unvailable'}
                </button>
              </td>
            </tr>

          })}

        </tbody>
      </table>
    </div>
  );
};

export default BrandList
