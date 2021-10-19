import React from 'react'

const Home = () => {
    return (
        <div>
            <div className="container my-3">
            <h1>Add Notes</h1>
            <form className="my-3">
            <div className="mb-3">
                <label for=""class="form-label">Email</label>
                <input type="email" className="form-control"/>
                    {/* // <textarea className="form-label" value={text} onChange={handleOnChange} id="mybox" rows="8"></textarea> */}
                </div>
            </form>
            </div>
            <div className="container my-3">
            <h1>Your Notes</h1>
            </div>
            
            
        </div>
    )
}

export default Home
