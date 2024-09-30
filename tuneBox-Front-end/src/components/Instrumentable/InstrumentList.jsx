import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { listInstruments, updateInstrument } from "../../service/InstrumentService";

const InstrumentList = ({ instruments, onUpdate }) => {
  const navigator = useNavigate();

  const [selectedIns, setSelectedIns] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editQuantity, setEditQuantity] = useState("");
  const [editColor, setEditColor] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [editDes, setEditDes] = useState("");
  const [editBrand, setEditBrand] = useState("");

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
              <td>{ins.status ? 'Available' : 'Unavailable'}</td>
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
          ))
        ) : (
          <tr>
            <td colSpan="10" className="text-center">No instruments available.</td>
          </tr>
        )}
      </tbody>

    </table>
  );
};

export default InstrumentList;