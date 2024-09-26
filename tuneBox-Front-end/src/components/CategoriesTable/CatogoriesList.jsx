import React, { useEffect, useState } from "react";
import { listCateIns, deleteCateIns, updateCateIns } from "../../service/CategoryService";
import { useNavigate, useParams } from "react-router-dom";

const CatogoriesList = () => { // Xóa tham số categories từ prop
  const navigator = useNavigate();
  const [categories, setCategories] = useState([]); // Định nghĩa categories và setCategories
  const [status, setStatus] = useState('');

  const { id } = useParams();

  useEffect(() => {
    getAllCategory(); // Gọi hàm này ngay khi component được mount
  }, []);

  function getAllCategory() {
    listCateIns().then((response) => {
      setCategories(response.data); // Cập nhật trạng thái với dữ liệu mới
    }).catch(error => {
      console.error(error);
    });
  }

  function uploadCateins(id) {
    navigator(`/edit-cateins/${id}`);
  }

  function removeCateIns(id) {
    const categoryToUpdate = categories.find((cate) => cate.id === id);
    const updatedStatus = !categoryToUpdate.status; 
    const updatedCategory = { ...categoryToUpdate, status: updatedStatus };

    updateCateIns(id, updatedCategory) 
      .then((response) => {
        getAllCategory(); // Tải lại danh sách categories 
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <table className="table table-striped table-hover">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Categories Name</th>
          <th scope="col">Status</th>
          <th scope="col">Action</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((cate, index) => (
          <tr key={cate.id}>
            <td>{index + 1}</td>
            <td>{cate.name}</td>
            <td>{cate.status ? 'Unavailable' : 'Available'}</td>
            <td>
              <button className="btn btn-warning" onClick={() => uploadCateins(cate.id)}>
                Edit
              </button>
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
