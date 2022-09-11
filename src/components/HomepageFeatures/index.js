import React from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

const FeatureList = [
  {
    title: '<span style="text-decoration: underline;">A</span>pproachable',
    Svg: require("@site/static/img/01-approachable.svg").default,
    description: (
      <>
        Apex was designed from the ground up to be succinct. Interfaces and data
        types are described using familiar syntax that won't slow you down.
      </>
    ),
  },
  {
    title: '<span style="text-decoration: underline;">P</span>rotocol agnostic',
    Svg: require("@site/static/img/02-protocol-agnostic.svg").default,
    description: (
      <>
        Regardless of the architecture, your data and interfaces are
        fundamentally the same. Use Apex to generate code for any serialization
        format or protocol.
      </>
    ),
  },
  {
    title: '<span style="text-decoration: underline;">Ex</span>tensible',
    Svg: require("@site/static/img/03-extensible.svg").default,
    description: (
      <>
        Generators are written in TypeScript. Easily add custom generators that
        satisfy your unique needs and publish them for everyone to use.
      </>
    ),
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3 dangerouslySetInnerHTML={{ __html: title }}></h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
