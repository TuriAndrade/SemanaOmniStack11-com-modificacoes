import React from 'react';

export default function StateInput(props){
    if(props.error){
        return(
            <div className="form--input-error">
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
                <p>{props.error}</p>
            </div>
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