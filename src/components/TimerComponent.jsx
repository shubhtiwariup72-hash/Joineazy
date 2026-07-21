import React, { useEffect, useRef, useState } from 'react';
import VSButton from './Button';
import './Timer.css'

const TimerComponent = () => {
    const [timer, setTimer] = useState(0);
    const intervalRef = useRef(0)

    const startTimer = () => {
        console.log("clicked")
        if (intervalRef.current) return
        console.log("passed")
        intervalRef.current = setInterval(() => {
            setTimer((prevTimer) => prevTimer + 1);
        }, 1000);
    }

    const stopTimer = () => {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
    }

    const resetTimer = () => {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setTimer(0);
    }

    return (
        <div>
            <div className='timer__content'>
                <h1>Timer: {timer}</h1>
            </div>

            <div className='timer__button'>
                <VSButton title={"Start Timer"} onClick={startTimer} />
                <VSButton title={"Stop Timer"} onClick={stopTimer} />
                <VSButton title={"Reset Timer"} onClick={resetTimer} />
            </div>

        </div>
    )
}
export default TimerComponent