import React from 'react';

export default function StateInputClipPath(props){
    if(props.error){
        return(
            <>
                <input className="form--input-clip-path-error"
                    value={props.state}
                    onChange={e => {
                        if(!props.validate){
                            const value = e.target.value;
                            props.setState(value);
                        }else{
                            props.validate(e.target.value, props.setState);
                        }
                    }}
                    type={props.type} 
                    placeholder={props.placeholder}/>
                <p>{props.error}</p>
            </>
        );
    }else{
        return(
            <input
                value={props.state}
                onChange={e => {
                    if(!props.validate){
                        const value = e.target.value;
                        props.setState(value);
                    }else{
                        props.validate(e.target.value, props.setState);
                    }
                }}
                type={props.type} 
                placeholder={props.placeholder}/>
        );
    }
}