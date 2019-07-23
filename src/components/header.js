import { Link } from "gatsby"
import React from "react"
import styles from './header.module.css'

const Header = ({ siteTitle }) => (
  <div
    style={{
      background: `#1E2428`,
      marginBottom: `1.45rem`,
    }}
  >
    <div
      style={{
        margin: `0 auto`,
        maxWidth: 960,
        padding: `1.45rem 1.0875rem`,
      }}
    >
    <div className={styles.row}>
      <img alt='hello' className={styles.img} src="https://kauri.io/static/images/logo.svg" />
      <h1 className={styles.title} style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: 'white',
            textDecoration: 'none',
          }}
        >
          {siteTitle}
        </Link>
     </h1>
    </div>
  </div>
</div>
)

export default Header
