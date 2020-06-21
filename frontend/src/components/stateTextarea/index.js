import React from 'react';

export default function StateTextarea(props){
    if(props.error){
        if(props.height){
            return(
                <div className="form--input-error">
                    <textarea
                        style={{height:props.height}}
                        value={props.state}
                        onChange={e => {
                            const value = e.target.value;
                            props.setState(value);
                        }}
                        rows={props.rows}
                        placeholder={props.placeholder}>
                    </textarea>
                    <p>{props.error}</p>
                </div>
            );
        }else{
            return(
                <div className="form--input-error">
                    <textarea
                        value={props.state}
                        onChange={e => {
                            const value = e.target.value;
                            props.setState(value);
                        }}
                        rows={props.rows}
                        placeholder={props.placeholder}>
                    </textarea>
                </div>
            );
        }
    }else{
        if(props.height){
            return(
                <textarea
                    style={{height:props.height}}
                    value={props.state}
                    onChange={e => {
                        if(!props.validate){
                            const value = e.target.value;
                            props.setState(value);
                        }else{
                            props.validate(e.target.value, props.setState);
                        }
                    }}
                    rows={props.rows}
                    placeholder={props.placeholder}>
                </textarea>
            );
        }else{
            return(
                <textarea
                    value={props.state}
                    onChange={e => {
                        if(!props.validate){
                            const value = e.target.value;
                            props.setState(value);
                        }else{
                            props.validate(e.target.value, props.setState);
                        }
                    }}
                    rows={props.rows}
                    placeholder={props.placeholder}>
                </textarea>
            );
        }
    }
}