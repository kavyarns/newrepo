// 

import React, { Component } from 'react';
import './index.css';
import axios from 'axios';
import Navbar from './Navbar';
import { saveAs } from 'file-saver'; 
import ProgressBar from 'react-bootstrap/ProgressBar';

const promptOptions = ['shining, sunlight, cinematic lighting', 'animated, cartoon', 'detailed pencil art with strokes'];

class App extends Component {
  state = {
    imageArray: [] ,
    summary: "",
    clickbait: "",
    isLoading: false,
    hasInappropriateContent: false,
    prompt: '',
    loadingProgress: 0,
  };

  handlePromptClick = (prompt) => {
    this.setState({ prompt });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const textinput =  document.getElementById('blog').value;
    const { prompt } = this.state; 
    console.log("Given input :\n",textinput);
    console.log("Selected prompt Design\n",prompt);
    const data = {
      "text_inputs": textinput,
      "prompt_specification": prompt
    };
    const options = {
      method: 'POST',
      url: process.env.REACT_APP_ENDPOINT,
      data: JSON.stringify(data),
    };

    this.setState({ isLoading: true, loadingProgress: 1 }); 
    const progressTimer = setInterval(() => {
      if (this.state.loadingProgress < 100) {
        this.setState((prevState) => ({ loadingProgress: prevState.loadingProgress + 1 }));
      } else {
        clearInterval(progressTimer); 
        this.setState({ isLoading: false });
      }
    }, 260); 

    axios.request(options).then((res) => {
      console.log(res);
      const imagelinks = res.data.imageLink;
      const summary = res.data.summary;
      const clickbait = res.data.clickbait;

      const imageArray = imagelinks.split(" ");
      this.setState({ isLoading: false, loadingProgress: 100 });

      const hasInappropriateContent = imageArray.some((link) => link.startsWith('Inappropriate'));
      this.setState({ hasInappropriateContent });
      this.setState({ imageArray, summary, clickbait });

      console.log(imageArray[0]);
      console.log(imageArray[1]);
      console.log(imageArray[2]);

    }).catch((error) => {
      this.setState({ isLoading: false, loadingProgress: 0 });
      console.error(error);
    });
  };

  handlePromptChange = (e) => {
    const prompt = e.target.value; 
    this.setState({ prompt });
  };

  handleDownload = (img, e) => {
    e.preventDefault();
    console.log(img);
    saveAs(img, 'image.png'); 
  };

  getImageUrl = (option) => {
    switch (option) {
      case 'shining, sunlight, cinematic lighting':
        return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJBG6DuQeW2NO33gTrhKw6PJVEEbrXvanWDA&usqp=CAU'; // Replace with the actual URL for Digital painting image
      case 'detailed pencil art with strokes':
        return 'https://i.etsystatic.com/6246498/r/il/d76603/2165308314/il_fullxfull.2165308314_swzh.jpg'; // Replace with the actual URL for Sharp focus image
      case 'animated, cartoon':
        return 'https://img.freepik.com/free-vector/front-view-house-with-nature-elements-white-background_1308-66071.jpg?w=2000'; // Replace with the actual URL for Lighting image
      default:
        return ''; 
    }
  };

  render() {
    const { prompt, imageArray, summary, clickbait, isLoading, hasInappropriateContent, user } = this.state; 
    return (
      <div>
        <Navbar/>
        <div className="container">
          {isLoading && (
            <ProgressBar now={this.state.loadingProgress} animated label={`${this.state.loadingProgress}%`} />
          )}
          <form>
            <label className="inputlabel" htmlFor="blog">Text: </label>
            <textarea
              autoFocus={true}
              type="text"
              name="blog"
              id="blog"
              placeholder="Advertisement text"
              className="border"
              rows="4" cols="50"
            />

            <div className="prompt-options">
              <label>Image design:</label>
              {promptOptions.map((option, index) => (
                <button
                  key={index}
                  className={`prompt-option-button ${prompt === option ? 'selected-prompt' : ''}`}
                  onClick={() => this.handlePromptClick(option)}
                  type="button"
                  style={{
                    backgroundImage: `url(${this.getImageUrl(option)})`,
                  }}
                >
                  {/* {option} */}
                </button>
              ))}
            </div>
            <div>
              <input
                type="submit"
                value="Submit"
                onClick={this.handleSubmit}
                className="submit-button"
              />
            </div>

            {imageArray.length > 0 ? (
              <div>
                <div>
                  <h4>Here is your ad summary: {summary}</h4>
                </div>
                <div>
                  <h4>Here is your ad clickbait: {clickbait}</h4>
                </div>
                {hasInappropriateContent ? (
                  <div className="warning">
                    Warning: Inappropriate content detected in image links.
                  </div>
                ) : (
                  <div className="image-container">
                    {imageArray.map((image, index) => (
                      <div key={index} className="image-item">
                        {image.startsWith('inappropriate') ? (
                          <div className="warning">
                            Warning: Inappropriate image link.
                          </div>
                        ) : (
                          <>
                            <img src={image} alt={`Image ${index}`} />
                            <input
                              type="submit"
                              download
                              value="Download"
                              onClick={(e) => this.handleDownload(image, e)}
                              className="submit-button"
                            />
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </form>
        </div>
      </div>
    );
  }
}

export default App;
