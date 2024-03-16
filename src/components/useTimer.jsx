import { useEffect, useState } from 'react'

function UseTimer() {
    
    const [triggerTimer, setTriggerTimer] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [hasTimeElapsed, setHasTimeElapsed] = useState(false)

    useEffect(() => {
        if(!triggerTimer) return

        if (seconds > 0) {
          const countdownInterval = setInterval(() => {
            setSeconds(prevSeconds => prevSeconds - 1);
          }, 1000);
    
          return () => clearInterval(countdownInterval);
        }
        else{
            setHasTimeElapsed(true)
        }
    }, [triggerTimer, seconds]);

    useEffect(() => {
        if(hasTimeElapsed && triggerTimer) setTriggerTimer(false)
    },[hasTimeElapsed])

    const startTimer = (duration) => {
        setSeconds(duration)
        setTriggerTimer(true)
        setHasTimeElapsed(false)
    }

    return {startTimer, currentTime: seconds, hasTimeElapsed}
}

export default UseTimer