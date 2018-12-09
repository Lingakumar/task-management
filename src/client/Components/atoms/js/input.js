import React, { Component } from 'react';

const Input = (props) => {
    let inputProps = props || {};
    return (
        <input className = {inputProps.class || ""} 
            disabled = {inputProps.isDisabled ? "disabled = disabled" : ""}
            placeholder = {inputProps.placeholder || ""} 
            type = {inputProps.type || "text"}
            required = {inputProps.required || ""}
            onChange = {inputProps.onchange || null}
            onBlur = {inputProps.onchange || null}
            style = {inputProps.border || null}
            value = {inputProps.value || null}
            minLength = {inputProps.minLength || ""}
            maxLength = {inputProps.maxLength || ""}
            onKeyPress = {inputProps.onchange || null}
        />
    );
}

export default Input;