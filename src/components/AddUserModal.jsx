import React from 'react';
import '../pages/Home.css';
import VSInput from './VSInput';
const AddUserModal = ({ closeAddUser, handleSubmitUser, handleInputChange, userInput }) => {
    return (
        <div
            className="home__modal-overlay"
            onClick={closeAddUser}
            role="presentation"
        >
            <div
                className="home__modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="add-user-title"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="home__modal-head">
                    <h2 id="add-user-title">Add user</h2>
                    <button
                        type="button"
                        className="home__modal-close"
                        onClick={closeAddUser}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                <form className="home__form" onSubmit={handleSubmitUser}>
                    <VSInput value={userInput.name} onChange={handleInputChange} title="Name" name="name" type="text" placeholder="Enter your name" />
                    <VSInput value={userInput.age} onChange={handleInputChange} title="Age" name="age" type="number" placeholder="Age" />
                    <VSInput value={userInput.address} onChange={handleInputChange} title="Address" name="address" type="text" placeholder="City, country" />
                    <VSInput value={userInput.email} onChange={handleInputChange} title="Email" name="email" type="email" placeholder="name@example.com" />
                    <VSInput value={userInput.phone} onChange={handleInputChange} title="Phone" name="phone" type="tel" placeholder="Phone number" />
                    <div className="home__form-actions">
                        <button type="button" className="home__btn home__btn--ghost" onClick={closeAddUser}>
                            Cancel
                        </button>
                        <button type="submit" className="home__btn home__btn--primary">
                            Save user
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddUserModal