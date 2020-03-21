import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBackspace } from '@fortawesome/free-solid-svg-icons'
import {message} from "antd";

import "../styles/login.min.css"

export default ({onSuccess, key="0000"}) => {

    const [currentCodeArray, setcurrentCodeArray] = useState([])

    const pushValue= (value)=>{
        console.log("length=",currentCodeArray.length)
        if(currentCodeArray.length>=4) return;
        setcurrentCodeArray([...currentCodeArray, value])
        if(currentCodeArray.length===3) {
            var currentCode=""
            currentCodeArray.map(item=>{
                currentCode+=item
            })
            currentCode+=value
            console.log("currentCode= ",currentCode)
            if(currentCode===key){
                message.success("Correct !") 
                onSuccess && onSuccess()
            } 
            else message.error("Code incorrect !") &&
            setTimeout(() => {
                setcurrentCodeArray([])
              }, 500);
            
        }
        
    }
    const clearValue =()=>{
        var length = currentCodeArray.length
        if(length==0) return;
        let tmp = currentCodeArray
        tmp.pop()
        setcurrentCodeArray([...tmp])
    }

    return (
        <div>
        <div className="pin-values">
            <span className="pin-value">{currentCodeArray[0]!==null ? currentCodeArray[0] : " "}</span>
            <span className="pin-value">{currentCodeArray[1]!==null ? currentCodeArray[1] : " "}</span>
            <span className="pin-value">{currentCodeArray[2]!==null ? currentCodeArray[2] : " "}</span>
            <span className="pin-value">{currentCodeArray[3]!==null ? currentCodeArray[3] : " "}</span>
        </div>
        <div className="grid-container">
          <div className="grid-item" onClick={pushValue.bind(this,"1")}>1</div>
          <div className="grid-item" onClick={pushValue.bind(this,"2")}>2</div>
          <div className="grid-item" onClick={pushValue.bind(this,"3")}>3</div>
          <div className="grid-item" onClick={pushValue.bind(this,"4")}>4</div>
          <div className="grid-item" onClick={pushValue.bind(this,"5")}>5</div>
          <div className="grid-item" onClick={pushValue.bind(this,"6")}>6</div>
          <div className="grid-item" onClick={pushValue.bind(this,"7")}>7</div>
          <div className="grid-item" onClick={pushValue.bind(this,"8")}>8</div>
          <div className="grid-item" onClick={pushValue.bind(this,"9")}>9</div>
          <div className="grid-item" onClick={pushValue.bind(this,"#")}>#</div>
          <div className="grid-item" onClick={pushValue.bind(this,"0")}>0</div>
          <div className="grid-item" onClick={clearValue.bind(this)}><FontAwesomeIcon icon={faBackspace} /></div>
        </div>
        </div>
        
      );
}

