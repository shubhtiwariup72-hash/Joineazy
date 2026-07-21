import React from 'react';

const VSInput = ({value, title, name, type, placeholder, onChange, autoFocus, required}) => {
    return (
        <label className="home__field">
            <span>{title}</span>
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                autoFocus={autoFocus}
                required={required}
            />
        </label>
    )
}

export default VSInput