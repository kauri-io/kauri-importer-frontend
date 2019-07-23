/*
INFO: Right now if you have both a link and a file selected and you try to click the get articles button,
it will clear the link but NOT the file. I could not figure out how to clear the file. document.getElementByid("id").value = ""
returns an error about null characters :(

INFO: Link and label for url option do not resize to any screen width and height

*/

import React, { Component } from 'react'
import { navigate } from 'gatsby'
import Layout from '../components/layout'
import styles from './base.module.css'
import { load } from './wordpress-choose-article.js'
import Cookies from 'js-cookie';

const env_url = typeof window !== 'undefined' && window.location.hostname
const url = 'https://kauri.io'
const token = Cookies.get('TOKEN')
const userId = Cookies.get('USER_ID')

let app_url = typeof window !== 'undefined' && window.document.domain

if (app_url === 'localhost') {
  app_url = 'http://localhost:5000'
} else if (app_url && app_url.includes('ngrok')) {
  app_url = 'https://' + app_url
} else {
  getTokenOrRedirect()
  app_url = 'https://' + app_url
}

function getTokenOrRedirect() {
    if (token === undefined && typeof window !== 'undefined') {
        alert('To use the importer, please first login on Kauri')
        window.location.href = url + '/login'
    }
}

export default class IndexPage extends Component {
    constructor(props){
        super(props);
        this.state ={
          getbtn: false,
          fbtn: false,
          file: '',
          wpURL: ''
        };
        this.handleClick = this.handleClick.bind(this);
        this.importFromFileBodyComponent = this.importFromFileBodyComponent.bind(this);


    /*
      This next statement relaods the page if this page was accessed through clicking
      the back button. By refreshing the page it ensures that the article list is empty
      every time you get onto the wordpress-choose-article page
    */
      // if (load){
      //   window.location.reload()
      // }
    }

    //click event handler
    handleClick = (id) => () => {
      //checks to make sure a file was chosen
        if (id === 'getbtn' && this.state.fbtn === true) {
            // confirms that the get article button was chosen
            this.setState({getbtn: true});

            //if 2 sources for a file are chosen it tells the user they can't do that
            if (this.state.wpURL !== '' && this.state.fbtn === true){

              alert('You must either choose a file OR a link. Not both!');
              //clears the state and empties the link value
              this.setState({wpURL: ''});
              document.getElementById('wpLink').value ='';
              //reinitalizes the get articles button to false
              this.setState({getBtn: false});
            }
            else {
              // if only one source is chosen, sends the file to be converted
              navigate("/wordpress-choose-article/", { state: { file: this.state.file }})
            }
        }

        //confirms that the file button was chosen, changes the state to true
        else if (id === 'fbtn') {
            this.setState({fbtn : true});
        }
        //confirms that url was chosen and sends the link to be converted
        else if (this.state.wpURL !== false){
          navigate("/wordpress-choose-article/", { state: { wpURL: this.state.wpURL }})
        }
        //no files were chosen so there is an error message
        else  {
            alert('*Error* You need to choose a file first!')
        }
    }


    //converts the raw file into a string/readable content
    importFromFileBodyComponent(file) {
      try{
            let fileReader;

            //reads the file as a string and sets it in the state
            //to be sent to the converting page
            const handleFileRead = (e) => {
            const content = fileReader.result;
            this.setState({file : content});
            };

            //handles the chosen file and sends it to be read
            const handleFileChosen = (file) => {
                fileReader = new FileReader();
                fileReader.onloadend = handleFileRead;
                fileReader.readAsText(file);
            }
            //starts the conversion
            handleFileChosen(file);
        }
        //if the user cancels converting, it gives an error message to the conole
        catch {
          console.log('cancelled event')
        }
    }


    render() {
        return (
            <Layout>
                <div>
                    <h3>Welcome to the Wordpress-to-Kauri importer!</h3>
                    <p>Select your Wordpress XML file below {<strong>OR</strong>} paste the url to your website in the textbox provided. You will later have the option of
                    choosing all or specific articles to import.</p>
                    <p>After importing, you'll be redirected to your Kauri profile where you can view the articles in the "Drafts" section.</p>
                </div>
                <div>
                    <input id="filebtn" className={styles.choose} onClick={this.handleClick('fbtn')} onChange={e => this.importFromFileBodyComponent(e.target.files[0])} type="file"id="file" accept=".xml"></input>
                    <button onClick={this.handleClick('getbtn')} className={styles.button}>Get Articles</button>
                    <label className={styles.wpLabel}>{<strong>Wordpress URL</strong>}</label>
                    <input id="wpLink" className={styles.wpLink} type="text" value={this.state.url} onChange={(e) => this.setState({wpURL: e.target.value})} />
                </div>
                <div id= "guidelines">
                    <h3>Importer Guidelines</h3>
                    <p>Link: Copy and paste the link to your website. Your link should be in the following format: www.mywebsite.com</p>
                    <p>XML File: Navigate to your Wordpress Site to export your xml file. Choose <strong>Tools -> Export</strong>.
                    Select whether to import <em>All content, posts, or pages.</em> Preferably choose either posts or pages.</p>
                    <p id="note"><strong>Note:</strong>If you've written content in HTML within Wordpress, please make sure tags are properly formatted.</p>
                    <img src = "https://premium.wpmudev.org/blog/wp-content/uploads/2015/08/wordpress-export.png"/>
                </div>
            </Layout>
        );
    }
};
