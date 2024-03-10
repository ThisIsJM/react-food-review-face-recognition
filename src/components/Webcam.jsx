/* eslint-disable react/prop-types */
import { useEffect, useRef} from 'react'
import "../App.css"
import * as faceapi from 'face-api.js';


function Webcam({startFaceDetection, setExpressions}) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null)

    useEffect(() => {
        startRecording()
    },[])

    useEffect(() => {


        let detectionInterval


        if (!videoRef.current || !canvasRef.current || !startFaceDetection) {
            return () => {
                clearInterval(detectionInterval);
            };
        }

        const canvas = canvasRef.current
        const video = videoRef.current
        console.log('hit')

        const displaySize = {width: video.videoWidth, height: video.videoHeight}
        if(displaySize.width === 0 || displaySize.height === 0) return
        faceapi.matchDimensions(canvas, displaySize)

        detectionInterval = setInterval(async () => {
            let faceDetection = await faceapi
                .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceExpressions()

            if(!faceDetection) return

            const topExpression = pickTopExpression(faceDetection.expressions)
            setExpressions(prevState => [...prevState, topExpression])
            console.log('detecting face...')

            const relativeBox = faceDetection.detection.relativeBox
            const mirroredX = relativeBox.width - relativeBox.x + relativeBox.width

            const mirroredBox = new faceapi.Rect(mirroredX, relativeBox.y, relativeBox.width, relativeBox.height)
            const mirroredDetection = new faceapi.FaceDetection(faceDetection.detection.score, mirroredBox, faceDetection.detection.imageDims)

            faceDetection = {...faceDetection, detection: mirroredDetection}

            const resizeDetection = faceapi.resizeResults(faceDetection, displaySize)
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)

           faceapi.draw.drawDetections(canvas, resizeDetection, { withScore: true })
           faceapi.draw.drawFaceExpressions(canvas, resizeDetection)
        }, 100)

        return () => {
            clearInterval(detectionInterval)
        }

    },[videoRef, canvasRef, startFaceDetection])

    const pickTopExpression = (expressions) => {
        let [topExpression, maxValue] = Object.entries(expressions).reduce((acc, [expression, value]) => {
            return value > acc[1] ? [expression, value] : acc;
        }, ['', -Infinity]);
    
        return { expression: topExpression, value: maxValue };
    }

    const startRecording = () => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(videoStream => {
            videoRef.current.srcObject = videoStream;
        })
        .catch(error => {
            console.error('Error accessing webcam:', error);
        });
    };

  return (<>
    <div className="video-container">
        <video ref={videoRef} autoPlay className='mirror'/>
        {startFaceDetection && <canvas ref={canvasRef}/>}
    </div>
  </>)
}

export default Webcam