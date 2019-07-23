import React, { Component } from 'react'
import { navigate } from 'gatsby'
import Layout from '../components/layout'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
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
    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
        // const rawParams = this.props.location.search ? this.props.location.search.replace('?', '').split('&'): []
        // const params = rawParams.map(param => {
        //     let split = param.split('=')
        //     let p = {}
        //     p[split[0]] = split[1]
        //     return p
        // })
        this.state = {
            state: '',
            code: '',
            profile: {},
            publications: [],
            url: '',
            loading: false
        }
    }

    componentDidMount() {
        // Send code and state, get publications and profile
        // {code: code, state: state}
        // const code = this.state.code
        // const state = this.state.state
        // const url = 'http://localhost:5000/callback/frontend?code='+code+'&state='+state
        // fetch(url)
        //   .then(response => response.json())
        //   .then(data => this.setState({publications: data.publications, profile: {username: data.username, name: data.name, url: data.url}}));
    }

    handleClick() {
        // Send publication choice, get articles
        // {type: 'user' || 'publication', url: url}
        const url = this.state.url
        const type = url.includes('@') ? 'user' : 'publication'
        this.setState({loading: true})
        fetch(app_url+'/getlist?type='+type+'&url='+url)
          .then(response => response.json())
          .catch(error => {
                            console.error(error)
                            alert("Invalid URL: If this is a Medium article URL, "+
                            "please enter the user profile or publication URL instead! "+
                            "You can select the article on the next screen")
                            this.setState({loading: false})
                          })
          .then(data => {
            navigate("/choose-article/", { state: { url: this.state.url, articles: data.articles }})
          })
    }

    render() {
        const profile = this.state.profile
        const publications = this.state.publications.map((pub, index) => {
            return (
                    <p key={index} onClick={this.handleClick.bind(this, pub.pub_url)}>{pub.pub_name}</p>
                )
        })
        return (
          <Layout>
            {!this.state.loading ?
                <div>
                    <h3>Welcome to the Medium-to-Kauri importer!</h3>
                    <p>Paste the URL of a Medium profile or publication
                    below, and the importer will ask you to select the articles to import into Kauri.</p>
                    <p>After importing, you'll be redirected to your Kauri profile and can view the articles in the "Drafts" section.</p>
                    <label>Medium URL</label>
                    <input className={styles.url} type="text" value={this.state.url} onChange={(e) => this.setState({url: e.target.value})} />
                    <p onClick={this.handleClick.bind(this, profile.url)}>{profile ? profile.name : null}</p>
                    <div>
                        {publications}
                    </div>
                    <button className={styles.button} onClick={this.handleClick}>Get Articles</button>
                </div> :
                <div>
                  <h3>Loading your articles. This may take a few seconds!</h3>
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
