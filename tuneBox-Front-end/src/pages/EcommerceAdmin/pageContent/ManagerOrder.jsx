import React from 'react'

const ManagerOrder = () => {
  return (
    <div>
      <div className='container-fluid'>
        <div className='row'>
            {/* Search by day */}
            <div className='col-3'>
                <form action="">
                    <div className='mt-3'>
                        <label className='form-label'>Search by day:</label>
                        <input type="date" className='form-control' placeholder='Select day'/>
                    </div>
                </form>
            </div>
            {/* Search from day to day */}
            <div className='col-3'>
                <form action="">
                    <div className='mt-3'>
                        <label className='form-label'>From day:</label>
                        <input type="date" className='form-control' placeholder='Select from day'/>
                        <br />
                        <label className='form-label'>To day:</label>
                        <input type="date" className='form-control' placeholder='Select to day'/>
                    </div>
                </form>
            </div>
            {/* Daily revenu */}
            <div className='col-3'>
              <h6>Daily revenu:</h6>
            </div>
        </div>

        {/* Table */}
        <div className='row'>
          
        </div>
      </div>
    </div>
  )
}

export default ManagerOrder
