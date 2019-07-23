import React, { Component } from 'react'
import { Link } from 'gatsby'
import Layout from '../components/layout'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import styles from './base.module.css'

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
  app_url = 'https://' + app_url
}

export default class ArticlesPage extends Component {
    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleSelect = this.handleSelect.bind(this)
        this.selectAll = this.selectAll.bind(this)
        const articles = this.props.location.state ? this.props.location.state.articles : []
        const url = this.props.location.state ? this.props.location.state.url : []
        this.state = {
            selectedArticles: articles.slice(0),
            allSelected: articles,
            articles: articles,
            url: url,
            loading: false
        }
    }

    handleSelect(e) {
        const articles = this.state.articles ? this.state.articles : []
        const selectedArticles = this.state.selectedArticles.slice(0)
        const article = selectedArticles.find((a) => a.article_slug === e.target.name)
        if (article) {
            const index = selectedArticles.findIndex((a) => a.article_slug === e.target.name)
            selectedArticles.splice(index, 1)
        } else {
            let article = articles.find((a) => a.article_slug === e.target.name)
            selectedArticles.push(article)
        }
        this.setState({selectedArticles: selectedArticles})
      
    }

    selectAll() {
        let selectedArticles
        let allSelected
        if (this.state.allSelected) {
            selectedArticles = []
            allSelected = false
        } else {
            selectedArticles = this.state.articles
            allSelected = true
        }
        this.setState({selectedArticles: selectedArticles, allSelected: allSelected})
    }

    handleSubmit() {
        const trimmedId = userId ? userId.substr(2) : ''
        const data = {
                        articles: this.state.selectedArticles,
                        url: this.state.url,
                        token: token ? token : null,
                        env_url: env_url
                    }

        // Send selected article list
        const obj = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }
        this.setState({loading: true})
        fetch(app_url+'/import', obj)
          .then(response => response.json())
          .then(data => {
            alert('Your articles were successfully uploaded')
            let url = 'https://kauri.io'
            window.location.href = url+'/public-profile/'+trimmedId
          })
          .catch(error => {
                            alert(error)
                            this.setState({loading: false})
                        })
    }

    render() {
        const articles = this.state.articles ? this.state.articles : []
        const articlesList = articles.map((article, index) => {
            const checked = this.state.selectedArticles.find((a) => a.article_slug === article.article_slug)
            return (
                    <div key={index}>
                        <input className={styles.checkbox} onChange={this.handleSelect} type="checkbox" name={article.article_slug} checked={checked !== undefined ? checked : false} />
                        <label htmlFor={article.article_slug}>{article.article_title}</label>
                        {article.article_title.length >= 150 ? <label style={{color: 'red'}}> TITLE OVER LIMIT</label> : null}
                    </div>
                )
        })
        return (
          <Layout>
            {!this.state.loading ?
                <div>
                    <h3>Select the articles you'd like to import</h3>
                    <button className={styles.button} style={{marginBottom: 15}} onClick={this.handleSubmit}>Import</button>
                    <div style={{marginBottom: 5}}>
                        <input className={styles.checkbox} onChange={this.selectAll} type="checkbox" name="all" checked={this.state.allSelected} />
                        <label htmlFor="all" style={{fontWeight: 'bold'}}>Select/deselect all</label>
                    </div>
                    <div>
                        {articlesList}
                    </div>
                </div> :
                <div>
                    <h3>Your articles are being imported to Kauri. Soon you'll be redirected to your profile</h3>
                    <Loader
                     type="ThreeDots"
                     color="rgb(11, 169, 134)"
                     height="100"
                     width="100"
                    />
                </div>
            }
          </Layout>
        );
    }
}
