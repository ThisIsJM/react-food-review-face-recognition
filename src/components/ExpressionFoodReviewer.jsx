import { useState } from 'react'
import Webcam from './Webcam'

function ExpressionFoodReviewer() {
    const [expressions, setExpressions] = useState([])
    const [startFaceDetection, setStartFaceDetection] = useState(false)

    const onToggleRecordingPressed = (toggle) => {
        if(toggle){
            setExpressions([])
        }
        else{
            console.log(expressions)
        }

        setStartFaceDetection(toggle)
    }

  return (<div className="food-review-container">
    <div>
        <Webcam startFaceDetection={startFaceDetection} setExpressions={setExpressions}/>
        <button onClick={() => {onToggleRecordingPressed(!startFaceDetection)}}>
            {`${startFaceDetection? "Stop" : "Start"} Recording`}
        </button>
    </div>
    <div>
        <h2>Review goes here</h2>
    </div>

  </div>)
}

export default ExpressionFoodReviewer