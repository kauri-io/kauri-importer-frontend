//TODO->Line 10: Proper userId
//TODO->Line 85: replace dev with real url
//TODO->Line 87: make sure website reroutes to proper profile (needs correct userId)

import React, { Component } from 'react';
import Layout from '../components/layout';
import Loader from 'react-loader-spinner';
import styles from './base.module.css';
import Cookies from 'js-cookie';
import { navigate } from 'gatsby';
let article_list = [];

let load = false
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
    if ('token' === undefined && typeof window !== 'undefined') {
        alert('To use the importer, please first login on Kauri')
        window.location.href = url + '/login'
    }
}

export default class WpArticlePage extends Component {
    constructor(props){
        super(props)
        this.handleSelect = this.handleSelect.bind(this)
        this.selectAll = this.selectAll.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.convertLink = this.convertLink.bind(this)

        const file = this.props.location.state ? this.props.location.state.file : []
        const wpURL = this.props.location.state ? this.props.location.state.wpURL : false
        load = true
        this.state = {
            loading: true,
            sFile : file,
            articles: '',
            allSelected: '',
            selected: [],
            wpURL: wpURL
        }

    };

    componentDidMount() {

      if (this.state.wpURL){
        this.convertLink();
      }
      else {
        const obj = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(this.state.sFile)
        }
        //sends the file to be converted
        fetch(app_url+'/importwp', obj)
            .then(response => response.json())
            .then((response) => {
                for(let i = 0; i < response.data.length; i++){
                    article_list.push(response.data[i]);
                }
                this.setState({articles:article_list,loading: false, allSelected: article_list,
                selected : article_list.slice(0)});
        })
      }
    };

    convertLink() {
      const obj = {
        method: 'POST',
        body: JSON.stringify(this.state.wpURL)
      }
      fetch(app_url+'/importwpLink', obj)
          .then(response => response.json())
          .then((response) => {
              for(let i = 0; i < response.data.length; i++){
                  article_list.push(response.data[i]);
              }
              this.setState({articles:article_list,loading: false, allSelected: article_list,
              selected : article_list.slice(0)});
      })
      .catch(error => {
        console.error(error)
        alert('Invalid URL: Please enter a valid URL.')
        navigate("/wordpress");
      })
    }

    handleSubmit() {
      const data = {
        selected: this.state.selected,
        token: token ? token : null
      }
      console.log(data)
      const obj = {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data)
      }
      //sends the file to kauri and redirects the user to their profile
      this.setState({loading: true})
      fetch(app_url+'/syncwp',obj)
      .then(response => response.json())
       .then(data => {
         alert('Your articles were successfully uploaded')
         let url = 'https://kauri.io/'
         alert('You are now being redirected to your Kauri profile.')
         window.location.href = url+'public-profile/'+userId

       })
       .catch(error => {
                         alert(error)
                         this.setState({loading: false})
                     })
    }
    //event handler for when an article is selected
    handleSelect(e){
      const articles = this.state.articles ? this.state.articles : []
      const selected = this.state.selected
      const article = selected.find((a)=> a.title === e.target.name)
      if (article) {

      }else {
        let article = articles.find((a) => a.title === e.target.name)
        selected.push(article)
      }
      this.setState({selected: selected})
      console.log(this.state.selected)
    }

    //select all event handler
    selectAll(){
      let selected
      let allSelected
      if (this.state.allSelected) {
          selected = []
          allSelected = false
      } else {
          selected = this.state.articles
          allSelected = true
      }
      this.setState({selected: selected, allSelected: allSelected})
      console.log(this.state.selected)
    }


    render() {

        //diplays the articles with checkboxes
        const articles = this.state.articles ? this.state.articles : []
        const articlesList = articles.map((article, index) => {
            const checked = this.state.selected.find((a) => a.title === article.title)
            return (

                <div key={index}>
                    <input className={styles.checkbox} onChange ={this.handleSelect} type="checkbox" name={article.title} checked={checked !== undefined ? checked : false}/>
                    <label htmlFor={article.title}>{article.title}</label>

                </div>
            )
        })
    return (

        <Layout>
        {!this.state.loading ?
            <div>
                <h3>Select the articles you'd like to import</h3>
                    <button className={styles.button} style={{marginBottom: 15}} onClick={this.handleSubmit}  >Import</button>
                <div style={{marginBottom: 5}}>
                    <input className={styles.checkbox} type="checkbox" onChange={this.selectAll} name="all" checked={this.state.allSelected} />
                    <label htmlFor="all" style={{fontWeight: 'bold'}}>Select/deselect all</label>
                </div>
                <div>
                    {articlesList}
                </div>
            </div> :
            <div>
                <h3 id= "loading-text">Loading your articles. This may take a few seconds!</h3>
                    <Loader
                    type="ThreeDots"
                    color="rgb(11, 169, 134)"
                    height="100"
                    width="100"
                    />
            </div>
        }
        </Layout>
    )
    };
}
  export { load };
