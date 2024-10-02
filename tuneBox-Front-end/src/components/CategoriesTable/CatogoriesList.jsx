import React from "react";
import { updateCateIns } from "../../service/CategoryService";
import { useNavigate } from "react-router-dom";

const CatogoriesList = ({ categories, onUpdate }) => { // Nhận prop categories và onUpdate
  const navigator = useNavigate();

  function uploadCateins(id) {
    navigator(`/edit-cateins/${id}`);
  }

  function removeCateIns(id) {
    const categoryToUpdate = categories.find((cate) => cate.id === id);
    const updatedStatus = !categoryToUpdate.status; 
    const updatedCategory = { ...categoryToUpdate, status: updatedStatus };

    updateCateIns(id, updatedCategory)
      .then((response) => {
        onUpdate(); // Gọi hàm onUpdate để cập nhật lại danh sách trong component cha
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
          <th scope="col">Categories Name</th>
          <th scope="col">Status</th>
          <th scope="col">Action</th>
          <th scope="col">Status Transition</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((cate, index) => (
          <tr key={cate.id} className="ps-0">
            <td>{index + 1}</td>
            <td>{cate.name}</td>
            <td>{cate.status ? 'Unavailable' : 'Available'}</td>
            <td>
              <button className="btn btn-warning" onClick={() => uploadCateins(cate.id)}>
                Edit
              </button>
            </td>
            <td>
              <button className="btn btn-success ms-4" onClick={() => removeCateIns(cate.id)}>
                {cate.status ? 'Mark as Available' : 'Mark as Unavailable'}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CatogoriesList;
