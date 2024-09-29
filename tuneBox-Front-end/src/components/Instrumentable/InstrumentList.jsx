import React from "react";
import { useNavigate } from "react-router-dom";
import { updateInstrument } from "../../service/InstrumentService";

const BrandList = ({ instruments, onUpdate }) => {

  const navigator = useNavigate();

  function uploadInstrument(id) {
    navigator(`/edit-instrument/${id}`);
  }

  function removeInstrument(id) {
    const insToUpdate = instruments.find((ins) => ins.id === id);
    const updatedStatus = !insToUpdate.status;

    updateInstrument({ ...insToUpdate, status: updatedStatus }, id)
      .then(() => {
        onUpdate();
      }).catch((error) => {
        console.error(error);
      })
  }

  return (
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
        {instruments.map((ins, index) => (
          <tr key={ins.id} className="ps-0">
            <td>{index + 1}</td>
            <td>
              <img
                src={`data:image/${ins.insImage.split('.').pop()};base64,${ins.insImage}`}
                alt={ins.name}
                style={{ width: '50px' }}
              />
            </td>
            <td>{ins.name}</td>
            <td>{ins.category.name}</td>
            <td>{ins.brand.name}</td>
            <td>{ins.price}</td>
            <td>{ins.color}</td>
            <td>{ins.quantity}</td>
            <td>{ins.status ? 'Unavailable' : 'Available'}</td>
            <td>
                <button className='btn btn-warning' onClick={() => uploadInstrument(ins.id)}>
                  Edit
                </button>
              </td>
              <td>
                <button
                  className={`btn ms-4 ${ins.status ? 'btn-success' : 'btn-danger'}`}
                  onClick={() => removeInstrument(ins.id)}
                >
                  {ins.status ? 'Mark as Available' : 'Mark as Unavailable'}
                </button>
              </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BrandList;
