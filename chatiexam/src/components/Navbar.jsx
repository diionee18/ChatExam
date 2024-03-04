import React from 'react'

const Navbar = () => {
  return (
    <div className='navbar'>
        <span className="logo">Chatii Exam</span>
      <div className="user">
        <img src="https://www.leisureopportunities.co.uk/images/995586_746594.jpg" alt="" />
        <span>Ali</span>
        <button>Logga ut</button>
      </div>
    </div>
  )
}

export default Navbar
