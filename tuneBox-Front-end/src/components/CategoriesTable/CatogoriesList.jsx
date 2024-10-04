

      const intervalId = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);

      const timeoutId = setTimeout(() => {
        setSuccessMessage(""); // Đặt lại thông báo sau khi hết thời gian
      }, 5000);

      // Dọn dẹp khi component unmount hoặc khi successMessage thay đổi
      return () => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
      };
    }
  }, [successMessage]);


  // funtion chuyển đổi status
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

  // Validation function
  function validateForm() {
    let valid = true;
    const errorsCopy = { ...errors }; // Tạo một bản sao của errors

    if (editCategoryName.trim()) {
      errorsCopy.editCategoryName = ''; // Không có lỗi
    } else {
      errorsCopy.editCategoryName = 'Category name is required'; // Có lỗi
      valid = false;
    }

    setErrors(errorsCopy); // Cập nhật trạng thái lỗi
    return valid; // Trả về kết quả xác thực
  }

  return (

          </tr>
        </thead>
        <tbody>
          {filteredCategories.map((cate, index) => (
            <tr key={cate.id} className="ps-0">
              <td>{index + 1}</td>
              <td>{cate.name}</td>
              <td>{cate.status ? 'Unavailable' : 'Available'}</td>
              <td>
                <button className="btn btn-warning" onClick={() => openEditModal(cate)}>
                  Edit
                </button>
              </td>
              <td>
                <button
                  className={`btn  ${cate.status ? 'btn-danger-custom' : 'btn-success'}`}
                  onClick={() => removeCateIns(cate.id)}
                >
                  {cate.status ? 'Mark as Available' : 'Mark as Unavailable'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>

      {/* modal edit */}
      <style dangerouslySetInnerHTML={{ __html: "\n      /* styles.css hoặc tệp CSS tương tự */\n.btn-danger-custom {\n  background-color: #dc3545; /* Màu đỏ */\n  color: white; /* Màu chữ */\n}\n\n.btn-danger-custom:hover {\n  background-color: #c82333; /* Màu đỏ đậm khi hover */\n}\n\n      " }} />

      <div className="modal fade" id="editCategoryModal" tabIndex="-1" aria-labelledby="editCategoryModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editCategoryModalLabel">Edit Category</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="categoryName" className="form-label">Category Name</label>
                  <input
                    type="text"
                    className={`form-control ${errors.editCategoryName ? 'is-invalid' : ''}`} // Thêm class lỗi
                    id="categoryName"

                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                  />
                  {errors.editCategoryName && <div className='invalid-feedback'>{errors.editCategoryName}</div>}
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={handUpdate}>Save update</button>
            </div>
          </div>
        </div>
      </div>
      {/* end modal edit */}
    </div>



  );
};

export default CatogoriesList;
