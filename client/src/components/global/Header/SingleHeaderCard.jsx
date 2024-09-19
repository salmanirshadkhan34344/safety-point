import React from 'react'

const SingleHeaderCard = ({icon, type, count }) => {

  return (
    <div className="header-card">
          <div className="card-inner  ">
            <div className="border border-white header-icons p-2 rounded-2">
            <span className='text-white'>{icon}</span>
            </div>
            <div className="ms-4">
              <h5 className="mb-0 text-white">{count}</h5>
              <p className="mb-0 font-12 text-white">{type}</p>
            </div>
          </div>
        </div>
  )
}

export default SingleHeaderCard