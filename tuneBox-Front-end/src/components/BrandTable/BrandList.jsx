import React from 'react'

const BrandList = () => {
  return (
    <div>
      
      <table className="table table-striped table-hover">
          <thead>
            <tr >
              <th scope="col">#</th>
              <th scope="col">Brands Name</th>
              <th scope="col">Action</th>
        
            </tr>
          </thead>
          <tbody>
            <tr>
              
              <td>1</td>
              <td>guitar</td>
              <td>
                <button className="btn btn-warning ms-4">Edit</button>
                <button className="btn btn-success">Avaiable</button>
              </td>
            </tr>

          </tbody>
        </table>
    </div>
  )
}

export default BrandList
