import React from 'react'

export default function Login() {
  return (
    <div className="form-container">
    <div className="form-wrapper">
        <span className="logo">Chatii Exam</span>
        <span className="title">Logga in</span>
        <form action="">
           
            <input type="email" placeholder="E-post" />
            <input type="password" placeholder="Lösenord"/>
        
            <button>Logga in</button>
        </form>
        <p>Inget konto? Skapa ett!</p>
    </div>
</div>
  )
}
