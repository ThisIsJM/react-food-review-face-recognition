import { useEffect, useState } from 'react'
import './App.css'
import Webcam from './components/Webcam'
import * as faceapi from 'face-api.js';

function App() {
    const [isModelLoaded, setIsModelLoaded] = useState(false)

    //Load face recognition models
    useEffect(() => {
    const loadModels = async() => {
        await Promise.all([
            await faceapi.loadTinyFaceDetectorModel('/models'),
            await faceapi.loadFaceExpressionModel('/models')
        ]).then(() => {
            setIsModelLoaded(true);
        }).catch(error => {
            console.error('Error loading models:', error);
        });
    }

    return () => {
        loadModels()
    }
    },[])

    return (
    <>
        {isModelLoaded && <Webcam autoPlay />}
    </>
    )
}

export default App
