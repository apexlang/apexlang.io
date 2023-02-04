import React, { useState } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '../components/HomepageFeatures';
import CodeBlock from '@theme/CodeBlock';

import styles from './index.module.css';
import HeaderTyper from '../components/HeaderTyper';
import ApexEditor from '../components/ApexEditor';
import BrowserOnly from '@docusaurus/BrowserOnly';

function Typer() {
  const [toTypeWords] = useState([
    'simple',
    'fun',
    'boilerplate free',
    'understandable',
    'flexible',
  ]);

  return (
    <BrowserOnly fallback={<div>simple</div>}>
      {() => {
        return (
          <HeaderTyper
            className={styles.HeaderTyper}
            words={toTypeWords}
            delay={5000}
            defaultText={toTypeWords[0] || 'simple'}
          />
        );
      }}
    </BrowserOnly>
  );
}

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className={clsx('hero__title', styles.heroTitle)}>
          {siteConfig.title}
        </h1>
        <div className={clsx('hero__subtitle', styles.heroSubtitle)}>
          <div className={styles.tagLine}>
            Software <span className={styles.separatorText}>made</span>
            <Typer />
          </div>
          <p>
            The <span className={styles.separatorText}>Apexlang</span> suite
            helps you start, automate, and build all your software projects.
            <br />
            The <span style={{ fontFamily: 'monospace' }}>apex</span> CLI gives
            you project templates, a task runner, and an IDL with extensible
            code generators to help you go from nothing to a full project in
            seconds.
          </p>
        </div>
        <br />
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/getting-started"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

function Installation() {
  const [cmd, setInstallCommand] = useState('Loading...');

  function makeInstallCommand(version: string) {
    return `deno install -A --unstable -f -n apex https://deno.land/x/apex_cli@${version}/apex.ts`;
  }

  fetch('https://api.github.com/repos/apexlang/apex/releases?per_page=1')
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      setInstallCommand(makeInstallCommand(res[0].tag_name));
    });
  return (
    <div>
      <div className="col text--center">
        <h1>Installation</h1>

        <p>Get Apex by running the following command</p>
      </div>
      <CodeBlock className="codeBlock" language="shell">
        {cmd}
      </CodeBlock>
    </div>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Apexlang: a complete tool suite for software with project templates, task runners, and code generators."
    >
      <HomepageHeader />
      <main>
        <div className="container" style={{ marginTop: '2rem' }}>
          <section className="row">
            <div className="col">
              <Installation />
            </div>
          </section>
        </div>

        <HomepageFeatures />
        <section className="row">
          <div className="col text--center">
            <h1>Code Generators</h1>
            <p>
              Explore how the Apexlang interface definition language (IDL) can
              generate hundreds of lines in other languages automatically.
            </p>
          </div>
        </section>
        <section className="row" style={{ marginBottom: '2rem' }}>
          <div className="col">
            <ApexEditor
              defaultTitle="See It In Action"
              defaultSubtitle="Edit your apex here and see the output change on the right."
            />
          </div>
        </section>
      </main>
    </Layout>
  );
}
