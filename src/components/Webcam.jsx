import { useEffect, useRef, useState } from 'react'
import "../App.css"
import * as faceapi from 'face-api.js';


function Webcam() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null)

    const [mirroredX, setMirroredX] = useState()

    useEffect(() => {
      startWebcam()
    },[])

    useEffect(() => {
        if(!videoRef.current || !canvasRef.current) return
        
        const canvas = canvasRef.current
        const video = videoRef.current
        let detectionInterval;

        video.onloadedmetadata = () => {
            const displaySize = {width: video.videoWidth, height: video.videoHeight}
             faceapi.matchDimensions(canvas, displaySize)

            detectionInterval = setInterval(async () => {
                let faceDetection = await faceapi
                    .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
                    .withFaceExpressions()

                if(!faceDetection) return

                const relativeBox = faceDetection.detection.relativeBox
                const mirroredX = relativeBox.width - relativeBox.x + relativeBox.width
                setMirroredX(mirroredX)

                const mirroredBox = new faceapi.Rect(mirroredX, relativeBox.y, relativeBox.width, relativeBox.height)
                const mirroredDetection = new faceapi.FaceDetection(faceDetection.detection.score, mirroredBox, faceDetection.detection.imageDims)

                faceDetection = {...faceDetection, detection: mirroredDetection}


                const resizeDetection = faceapi.resizeResults(faceDetection, displaySize)

                const context = canvas.getContext('2d')
                context.clearRect(0, 0, canvas.width, canvas.height)

               faceapi.draw.drawDetections(canvas, resizeDetection, { withScore: true })
               faceapi.draw.drawFaceExpressions(canvas, resizeDetection)
            }, 100)
        }

        return () => {
            clearInterval(detectionInterval)
        }

    },[videoRef, canvasRef])

    const startWebcam = () => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
            videoRef.current.srcObject = stream;
        })
        .catch(error => {
            console.error('Error accessing webcam:', error);
        });
    };

  return (<>
    <div className="video-container">
        <video ref={videoRef} autoPlay className='mirror'/>
        <canvas ref={canvasRef}/>
    </div>
    <p>{mirroredX}</p>
  </>)
}

export default Webcam