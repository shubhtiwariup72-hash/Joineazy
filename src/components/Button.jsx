import React from 'react';
import './Button.css'

const VSButton = ({ title, onClick, isActive = true }) => {
    const handleClick = () => {
        onClick?.()
    }
    return (
        <button type="button" className={`home__btn home__btn--primary ${isActive ? "" : "bg-blue-600"}`} onClick={handleClick}>
            {title}
        </button>

    )
}

export default VSButton