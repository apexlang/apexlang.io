import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

const apexCmd = {
  fontFamily: 'monospace',
  fontSize: '14pt',
  fontWeight: 'bold',
  backgroundColor: '#f5f5f5',
  padding: '0 5px',
};

const FeatureList = [
  {
    title: 'Project Bootstrapper',
    Svg: require('@site/static/img/02-protocol-agnostic.svg').default,
    url: '/docs/customization/project-templates',
    description: (
      <>
        Use <span style={apexCmd}>apex new</span> to start projects from
        boilerplate templates customized to your needs.
      </>
    ),
  },
  {
    title: 'Task Runner',
    Svg: require('@site/static/img/01-approachable.svg').default,
    url: '/docs/customization/task-runner',
    description: (
      <>
        Define tasks the same way across any project and execute them with{' '}
        <span style={apexCmd}>apex run</span>.
      </>
    ),
  },
  {
    title: 'Code Generator',
    Svg: require('@site/static/img/03-extensible.svg').default,
    url: '/docs/tutorial/create-a-spec',
    description: (
      <>
        Define your interfaces and types with the{' '}
        <a href="/docs/specification" style={{ fontWeight: 'bold' }}>
          Apexlang IDL
        </a>
        , then use <span style={apexCmd}>apex generate</span> to automatically
        create source code, documentation, and schemas.
      </>
    ),
  },
];

function Feature({ Svg, title, url, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <a href={url}>
          <Svg className={styles.featureSvg} role="img" />
        </a>
      </div>
      <div className="text--center padding-horiz--md">
        <h3 dangerouslySetInnerHTML={{ __html: title }}></h3>
        <p>{description}</p>
        <a href={url} style={{ fontWeight: 'bold' }}>
          Read more...
        </a>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          <div className="col text--center">
            <h1>What is Apex?</h1>
          </div>
        </div>
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
