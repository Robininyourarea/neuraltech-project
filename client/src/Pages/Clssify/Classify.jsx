import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Nav from '../../Components/Navbar/Nav';
import ProgressBar from '../../Components/ProgressBar/ProgressBar';
import './Classify.css'
import upload from '../../assets/upload.png'
import { Oval } from 'react-loader-spinner'

function Classify() {
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleImageUpload = (event) => {
        console.log('this function triggerd')
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            setImageUrl(URL.createObjectURL(file));

            // Convert selected file to base64
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                const base64Data = reader.result.split(',')[1];
                setImage(base64Data); // Set the image state to base64 encoded string
            };
        }
    };

    const handleDisplayClick = () => {
        document.getElementById('fileInput').click();
    };

    const handlePrediction = async () => {
        if (!image) {
            alert('Please upload an image first.')
            return;
        }

        setLoading(true);

        try {
        
            
            // console.log(image) // image in this state is base64
            const response = await axios.post('http://localhost:5000/cls_upload-image', { image });
            console.log(response.data);
            setPrediction(response.data);

        } catch (error) {
            console.error('Error predicting image:', error);
            alert('Failed to predict image. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    const handleNewImageUpload = () => {
        // Clear the image state and URL
        setImage(null);
        setImageUrl(null);
        setLoading(false)
        // Trigger the file input click
        handleDisplayClick();
    };

    return(<div>
                <Nav />
                <h2 className='model-header'>Classification Model</h2>
                <div className='upload-container' onClick={handleDisplayClick}>
                    {imageUrl ? null : (<img src={upload} alt="upload-logo" className='upload-logo'/>)}
                    
                    {imageUrl ? (<img src={imageUrl} alt="uploaded-img" className='uploaded-img'/>) : 
                                (<p>Click to upload your image here</p>)}
                </div>

                <input 
                    type="file" 
                    id='fileInput'
                    style={{display: 'none'}}
                    onChange = {handleImageUpload}
                />
                {image && <button className='predict-button' onClick={handlePrediction}>Let's Predict</button>}
                {image && <button className='upload-button' onClick={handleNewImageUpload}>Upload new image</button>}
                {loading && (
                <div className='loader-container'>
                    <Oval
                        height={80}
                        width={80}
                        color="#5A639C"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                        ariaLabel='oval-loading'
                        secondaryColor="#9B86BD"
                        strokeWidth={2}
                        strokeWidthSecondary={2}
                    />
                </div>
                )}
                {prediction && (
                    <div>
                        <ProgressBar label1={prediction.Class1} 
                                     value1={prediction.Prob1}
                                     label2={prediction.Class2}
                                     value2={prediction.Prob2}
                                     label3={prediction.Class3}
                                     value3={prediction.Prob3}
                                     label4={prediction.Class4}
                                     value4={prediction.Prob4}
                        />
                    </div>
                )}
            </div>);
}

export default Classify;