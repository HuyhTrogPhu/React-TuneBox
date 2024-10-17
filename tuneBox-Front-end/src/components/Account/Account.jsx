import React from 'react'
import './Account.css';
import { images } from "../../assets/images/images";


const Account = () => {
  return (
    <div>
      <div>
        <h3>
          <b>Account setting</b>
        </h3>
      </div>
      <div className='row mt-3'>
        <div className='container ps-5'>
          {/* User name */}
          <div className='update-username'>
            <form action="">
              <div className='mt-3'>
                <label className="form-label">Username</label>
                <input type="text" className='form-control' />
              </div>
              <div className='mt-3'>
                <button type='submit'>Update</button>
              </div>
            </form>
          </div>
          {/* Email */}
          <div className='update-email mt-3'>
            <form action="">
              <div className='mt-3'>
                <label className="form-label">Enter your email</label>
                <input type="text" className='form-control' />
              </div>
              <div className='mt-3'>
                <button type='submit'>Update</button>
              </div>
            </form>
          </div>
          {/* Set password */}
          <div className='changePassword mt-3'>
            <h5>Set Password</h5>
            <p>As you have connected through social media, you will need to set a password.</p>
            <form action="">
              <div className='mt-3'>
                <label className="form-label">New password</label>
                <input type="password" className='form-control' placeholder='Enter at least 4 character' />
              </div>
              <div className='mt-3'>
                <label className="form-label">Confirm password</label>
                <input type="password" className='form-control' placeholder='Confirm password' />
              </div>
              <div className='mt-3'>
                <button type='submit'>Update</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Account
