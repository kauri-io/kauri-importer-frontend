import React, { Component } from 'react'
import Layout from '../components/layout'
import styles from './base.module.css'
import { navigate } from 'gatsby'


export default class IndexPage extends Component {

  handleClick = (id) => () => {
  navigate("/"+id+"/");
 }
    render() {
        return (
          <Layout>
                <div>
                    <h3>Welcome to The Kauri Article Importer!</h3>
                      <p>Choose the type of article you wish to
                      import to Kauri.The importer will redirect you to
                      the proper page where you will paste a URL or select a file.</p>
                      <p>You will have the chance to review which articles you want to
                      import. After importing, you'll be redirected to your Kauri profile
                      and can view the articles in the "Drafts" section.</p>
                      <button className={styles.button} onClick={this.handleClick('wordpress')}>Wordpress</button>
                      <button className={styles.button} onClick={this.handleClick('medium')}>Medium</button>
                </div>
          </Layout>
        );
    }
}
