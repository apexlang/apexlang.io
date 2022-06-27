import React, { useState } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import styles from './index.module.css';
import HeaderTyper from './components/HeaderTyper';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  const [toTypeWords] = useState(
    [
      'simple',
      'straightforward',
      'understandable',
      'boilerplate free',
      'flexible',
      'fun',
    ]
  );

  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className={clsx('hero__title', styles.heroTitle)}>{siteConfig.title}</h1>
        <div className={clsx('hero__subtitle', styles.heroSubtitle)}>
          <p className={styles.tagLine}>
            Cloud applications <span className={styles.separatorText}>made</span>
            <HeaderTyper
              className={styles.HeaderTyper}
              words={toTypeWords}
              delay={5000}
              defaultText={toTypeWords[0] || 'simple'}
            />
          </p>
          <p><span className={styles.separatorText}>Apex</span> is a top-down / API-first description language for modeling and generating cloud-native applications</p>
        </div>
        <br />
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/introduction">
            Tutorial - 5min ⏱️
          </Link>&nbsp;&nbsp;
          <Link
            className="button button--secondary button--lg"
            to="/docs/specification">
            Specification
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Apex: a top-down / API-first description language for modeling and generating cloud-native applications">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
