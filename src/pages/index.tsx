import React, { useState } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import HomepageFeatures from "../components/HomepageFeatures";
import CodeBlock from '@theme/CodeBlock';

import styles from "./index.module.css";
import HeaderTyper from "../components/HeaderTyper";
import ApexEditor from "../components/ApexEditor";
import BrowserOnly from "@docusaurus/BrowserOnly";

function Typer() {
  const [toTypeWords] = useState([
    "simple",
    "cloud-native",
    "understandable",
    "boilerplate free",
    "flexible",
    "fun",
  ]);

  return (
    <BrowserOnly fallback={<div>simple</div>}>
      {() => {
        return (
          <HeaderTyper
            className={styles.HeaderTyper}
            words={toTypeWords}
            delay={5000}
            defaultText={toTypeWords[0] || "simple"}
          />
        );
      }}
    </BrowserOnly>
  );
}

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <h1 className={clsx("hero__title", styles.heroTitle)}>
          {siteConfig.title}
        </h1>
        <div className={clsx("hero__subtitle", styles.heroSubtitle)}>
          <div className={styles.tagLine}>
            Software <span className={styles.separatorText}>made</span>
            <Typer />
          </div>
          <p>
            <span className={styles.separatorText}>Apex</span> is an interface
            definition language (IDL) for modeling software. <br />
            Generate source code, documentation, integration,{" "}
            <span className={styles.separatorText}>everything</span>{" "}
            automatically.
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
          &nbsp;&nbsp;
          <Link
            className="button button--secondary button--lg"
            to="/docs/specification"
          >
            Specification
          </Link>
        </div>
      </div>
    </header>
  );
}

function Installation() {
  return (
    <div>
      <div className="col text--center">
        <h1 >Installation</h1>

        <p >Get Apex by running the following command
        </p>
      </div>
      <CodeBlock className="codeBlock" language="shell">{"deno install -A --unstable -f -n apex https://deno.land/x/apex_cli/apex.ts"}</CodeBlock>

    </div>)

}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Apex: a top-down / API-first description language for generating code, documentation, implementations, anything."
    >
      <HomepageHeader />
      <main>
        <div className="container" style={{ marginTop: "2rem" }}>
          <section className="row">
            <div className="col">
              <Installation />
            </div>
          </section></div>

        <HomepageFeatures />
        <section className="row" style={{ marginBottom: "2rem" }}>
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
