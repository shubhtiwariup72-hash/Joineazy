import React from 'react';
import './Button.css'

const VSButton = ({ title, onClick, isActive = true, style }) => {
    const handleClick = () => {
        onClick?.()
    }
    return (
        <button style={style} type="button" className={`home__btn home__btn--primary ${isActive ? "" : "bg-blue-600"}`} onClick={handleClick}>
            {title}
        </button>

    )
}

export default VSButton