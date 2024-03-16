/* eslint-disable react/prop-types */
import { useEffect, useRef} from 'react'
import "../App.css"
import * as faceapi from 'face-api.js';


function Webcam({startFaceDetection, setHappinessPercentages, isRecording}) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null)
    const startFaceDetectionRef = useRef(startFaceDetection);
    const isRecordingRef = useRef(isRecording);

    useEffect(() => {
        startFaceDetectionRef.current = startFaceDetection;
        isRecordingRef.current = isRecording;
    }, [startFaceDetection, isRecording]);

    useEffect(() => {
        startRecording()
    },[])

    useEffect(() => {
        let detectionInterval;
        if (!videoRef.current || !canvasRef.current) return;
    
        const canvas = canvasRef.current;
        const video = videoRef.current;
    
        video.onloadedmetadata = () => {
            const displaySize = {width: video.videoWidth, height: video.videoHeight}
            faceapi.matchDimensions(canvas, displaySize)

            detectionInterval = setInterval(async () => {

                if(!startFaceDetectionRef.current || !isRecordingRef.current) return
                
                let faceDetection = await faceapi
                    .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
                    .withFaceExpressions()
    
                if(!faceDetection) return
    
                const happiness = faceDetection.expressions.happy
                setHappinessPercentages(prevState => [...prevState, happiness])
    
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
        }
    
        return () => {
            clearInterval(detectionInterval);
        };
    }, [videoRef, canvasRef, startFaceDetectionRef, isRecordingRef]);

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
        <canvas ref={canvasRef} style={{ display: !isRecording ? 'none' : 'block' }}/>
    </div>
  </>)
}

export default Webcam