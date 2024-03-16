import { useEffect, useState } from 'react'
import Webcam from './Webcam'
import UseTimer from './useTimer'

function ExpressionFoodReviewer() {
    const [happinessPercentages, setHappinessPercentages] = useState([])
    const [overallHappiness, setOverallHappiness] = useState(-1)

    const [startFaceDetection, setStartFaceDetection] = useState(false)

    const {startTimer, currentTime,  hasTimeElapsed} = UseTimer()
    const detectionDuration = 8000
    
    const [isRecording, setIsRecording] = useState(false)

    useEffect(() => {
        let stopRecording;
    
        if (hasTimeElapsed) {
            setIsRecording(true);
    
            stopRecording = setTimeout(() => {
                console.log("Stopped Recording");
                setIsRecording(false);
                setStartFaceDetection(false);
                calculateOverallHappiness()
            }, detectionDuration);
        }
    
        return () => {
            if (stopRecording) {
                clearTimeout(stopRecording);
            }
        };
    }, [hasTimeElapsed]);

    useEffect(() => {
        if(!isRecording) calculateOverallHappiness()
    },[isRecording])

    const calculateOverallHappiness = () => {
        const sum = happinessPercentages.reduce((total, percentage) => total + percentage, 0);
        const average = sum / happinessPercentages.length;
        const overallPercentage = Math.round(average * 100, 2)

        setOverallHappiness(overallPercentage)
    }

    const startRecording = () => {
        setStartFaceDetection(true)
        setHappinessPercentages([])
        setOverallHappiness(-1)
        startTimer(3)
    }

  return (<div className="food-review-container">
    <div>
        <Webcam startFaceDetection={startFaceDetection} setHappinessPercentages={setHappinessPercentages} isRecording={isRecording}/>
        <button onClick={() => {startRecording()}}>
            {`${startFaceDetection? "Stop" : "Start"} Recording`}
        </button>
    </div>
    <div>
        {startFaceDetection && <h2>Calculating Satisfaction Rate...</h2>}
        {!startFaceDetection && <h2>Press the button to begin</h2>}
        {startFaceDetection && !isRecording && <h3>Starting in {currentTime} ...</h3>}
        {isRecording && <h3>Recording...</h3>}
        {overallHappiness >= 0 && <h1>{`Overall Happiness is ${overallHappiness}%`}</h1>}
    </div>

  </div>)
}

export default ExpressionFoodReviewer