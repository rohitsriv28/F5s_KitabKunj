import React, { useState } from 'react'

function BookRequeestForm() {
  const [bookName,setBookName] = useState()
  const [bookLanguage,setBookLanguage] = useState()
  const [name,setName] = useState()
  const [contact, setContact]= useState()

    return (
        <>
          <div className="heading">
            <h2>Book request Form</h2>
          </div>
          <div className="upload-form-container">
            <form>
              <label htmlFor="name">
                Name
                <input
                className='form-label'
                type='text'
                value={name}
                onChange={(e)=>setName(e.target.value)}
                />
              </label>
              <label className="form-label">
                Book Name:
                <input
                  className="form-input"
                  type="text"
                  value={bookName}
                  onChange={(e) => setBookName(e.target.value)}
                  required
                />
              </label>
    
              <label className="form-label">
                Book Language:
                <select
                  className="form-select"
                  value={bookLanguage}
                  onChange={(e) => setBookLanguage(e.target.value)}
                  required
                >
                  <option value="">Select Language</option>
                  <option value="english">English</option>
                  <option value="hindi">Hindi</option>
                  <option value="nepali">Nepali</option>
                </select>
              </label>

              <label className="form-label">
                Contact:
                <input
                  className="form-input"
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                />
              </label>
    
              {/* <label className="form-label">
                Book Edition:
                <input
                  className="form-input"
                  type="number"
                  value={bookEdition}
                  onChange={(e) => setBookEdition(e.target.value)}
                  required
                />
              </label> */}
        
              {/* <label className="form-label">
                Description:
                <textarea
                  className="form-input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </label> */}
    
              <button type="submit" className="form-button">
                Submit
              </button>
            </form>
          </div>
        </>
      );
}

export default BookRequeestForm