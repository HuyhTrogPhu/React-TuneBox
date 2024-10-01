import React from 'react'

const Shop = () => {
<<<<<<< HEAD
  return (
    <div>
      
=======

  const brands = {

  }

  return (
    <div>
      <div className='container'>

        {/* Header shop */}
        <div className='header-img'>
          <img
            src="image source"
            class="img-fluid rounded-top"
            alt=""
          />
        </div>

        {/* Main */}
        <div className='row'>
          {/* Content left */}
          <div className='col-3'>
            <div class="accordion" id="accordionPanelsStayOpenExample">

              {/* Brand */}
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true" aria-controls="panelsStayOpen-collapseOne">
                    Brands
                  </button>
                </h2>
                <div id="panelsStayOpen-collapseOne" class="accordion-collapse collapse show">
                  <form action="">
                    <input className='form-control' type="text" placeholder='Search' />

                    {/* List brand */}
                    <div className='form-check'>
                      <input type='checkbox' className='form-check-input' />
                      <label className='form-check-label' >Ableton</label>
                    </div>
                    <div className='form-check'>
                      <input type='checkbox' className='form-check-input' />
                      <label className='form-check-label' >Ableton</label>
                    </div>
                    <div className='form-check'>
                      <input type='checkbox' className='form-check-input' />
                      <label className='form-check-label' >Ableton</label>
                    </div>
                    <div className='form-check'>
                      <input type='checkbox' className='form-check-input' />
                      <label className='form-check-label' >Ableton</label>
                    </div>
                    <div className='form-check'>
                      <input type='checkbox' className='form-check-input' />
                      <label className='form-check-label' >Ableton</label>
                    </div>


                  </form>



                </div>
              </div>

              {/* Category */}
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
                    Categories
                  </button>
                </h2>
                <div id="panelsStayOpen-collapseTwo" class="accordion-collapse collapse">
                  <div class="accordion-body">
                    <form action="">
                      <input className='form-control' type="text" placeholder='Search' />

                      {/* List category */}
                      <div className='form-check'>
                        <input type='checkbox' className='form-check-input' />
                        <label className='form-check-label' >Guitar</label>
                      </div>
                      <div className='form-check'>
                        <input type='checkbox' className='form-check-input' />
                        <label className='form-check-label' ></label>
                      </div>
                      <div className='form-check'>
                        <input type='checkbox' className='form-check-input' />
                        <label className='form-check-label' >Ableton</label>
                      </div>
                      <div className='form-check'>
                        <input type='checkbox' className='form-check-input' />
                        <label className='form-check-label' >Ableton</label>
                      </div>
                      <div className='form-check'>
                        <input type='checkbox' className='form-check-input' />
                        <label className='form-check-label' >Ableton</label>
                      </div>


                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>
>>>>>>> 846bba1 (test)
    </div>
  )
}

export default Shop
