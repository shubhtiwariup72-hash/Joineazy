import React from 'react';
import '../pages/Home.css';
const AddUserModal = ({closeAddUser, handleSubmitUser, handleInputChange, userInput}) => {
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
                    <label className="home__field">
                        <span>Name</span>
                        <input
                            type="text"
                            name="name"
                            placeholder="Full name"
                            value={userInput.name}
                            onChange={handleInputChange}
                            autoFocus
                            required
                        />
                    </label>
                    <label className="home__field">
                        <span>Age</span>
                        <input
                            type="number"
                            name="age"
                            placeholder="Age"
                            value={userInput.age}
                            onChange={handleInputChange}
                            min="1"
                        />
                    </label>
                    <label className="home__field">
                        <span>Address</span>
                        <input
                            type="text"
                            name="address"
                            placeholder="City, country"
                            value={userInput.address}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label className="home__field">
                        <span>Email</span>
                        <input
                            type="email"
                            name="email"
                            placeholder="name@example.com"
                            value={userInput.email}
                            onChange={handleInputChange}
                        />
                    </label>
                    <label className="home__field">
                        <span>Phone</span>
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone number"
                            value={userInput.phone}
                            onChange={handleInputChange}
                        />
                    </label>

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