import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import clsx from "clsx";
import { LiveProvider, LiveEditor, LiveError } from "react-live";
import CodeBlock from "@theme/CodeBlock";
import theme from "prism-react-renderer/themes/vsDark";
import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import { parse } from "@apexlang/core";
import { Context, Writer } from "@apexlang/core/model";

import { InterfacesVisitor as GoVisitor } from "@apexlang/codegen/go";
import { RustBasic as RustVisitor } from "@apexlang/codegen/rust";
import { JsonSchemaVisitor } from "@apexlang/codegen/json-schema";
import { ProtoVisitor } from "@apexlang/codegen/proto";
import { InterfacesVisitor as TypeScriptVisitor } from "@apexlang/codegen/typescript";
import { InterfacesVisitor as PythonVisitor } from "@apexlang/codegen/python";

export function generate(doc, Visitor, config) {
  const context = new Context(config, doc);
  const writer = new Writer();
  const visitor = new Visitor(writer);
  context.accept(context, visitor);
  let source = writer.string();
  return source;
}

const apexExample = `
namespace "petstore"

"The Order service is the primary interface for ordering new pets."
interface Order @service {
  "Query the current inventory of pets."
  inventory(): Inventory
  "Order a new pet. (unary operation)"
  order[order: OrderRequest @n(1)]: Order
  "Check the status of your order."
  orderStatus(id: UUID @n(1)): Order
}

"An OrderRequest contains the adopter ID and the ID of the pet being purchased."
type OrderRequest {
  "An adopter's user id"
  adopter: u32 @n(1)
  "A pet's pet id"
  pet: u32 @n(2)
}

type Order {
  "The order ID."
  id: UUID @n(1)
  "An adopter's user id."
  adopter: u32 @n(2)
  "A pet's pet id."
  pet: u32 @n(3)
  "The date the order was placed."
  date: datetime @n(4)
  "The order status."
  status: OrderStatus @n(5)
  "Whether or not the order is considered complete, regardless of status."
  complete: bool @n(6)
}

"A UUID v4 string"
alias UUID = string

"The OrderStatus enum represents all statuses an order can be in."
enum OrderStatus {
  "The order has been placed."
  placed = 0
  "The order has been shipped."
  shipped = 1
  "The order has been canceled."
  canceled = 2
}

"The Inventory structure contains summary information of the Pet Store's inventory."
type Inventory {
  "Total number of pets sold."
  sold: u32 @n(1)
  "Total number of new pets."
  new: u32 @n(2)
  "Total number of available pets."
  available: u32 @n(3)
}
`.trim();

export type Props = {
  words?: string[];
  delay?: number;
  typeSpeed?: number;
  defaultTitle?: string;
  defaultSubtitle?: string;
  className?: string;
};

const ApexEditor: React.FC<Props> = (props) => {
  const { className } = props;
  const [parseError, updateParseError] = useState("");

  const [state, updateState] = useState({ code: "", lang: "" });

  let apexSource = apexExample;
  function changed(apexSrc: string) {
    apexSource = apexSrc;
  }

  function codegen() {
    const doc = parse(apexSource, (name) => {
      console.warn(
        `Can not import apex files (i.e. '${name}') in this online editor`
      );
      return "";
    });

    const lang = (document.querySelector("#language") as HTMLSelectElement)
      .value;

    const def = langDefs.find((def) => def.id === lang);
    console.log(def);

    const code = generate(doc, def?.visitor, {});

    updateState({ code, lang: def?.lang! });
  }

  let codeStyle = { height: "550px", overflow: "auto", borderRadius: "4px" };

  let langDefs = [
    {
      label: "Proto3 Schema",
      lang: "protobuf",
      id: "protobuf",
      visitor: ProtoVisitor,
    },
    {
      label: "JSON Schema",
      lang: "json",
      id: "jsonschema",
      visitor: JsonSchemaVisitor,
    },
    {
      label: "Rust",
      lang: "rust",
      id: "rust",
      visitor: RustVisitor,
    },
    {
      label: "Go",
      lang: "go",
      id: "golang",
      visitor: GoVisitor,
    },
    {
      label: "TypeScript",
      lang: "typescript",
      id: "typescript",
      visitor: TypeScriptVisitor,
    },
    {
      label: "Python",
      lang: "python",
      id: "python",
      visitor: PythonVisitor,
    },
  ];

  let codeblock = (
    <CodeBlock language={state.lang} className={styles.codeblock}>
      {state.code}
    </CodeBlock>
  );

  let options = langDefs.map((def) => (
    <option value={def.id} key={def.id}>
      {def.label}
    </option>
  ));

  let dropdown = (
    <select id="language" onChange={(evt) => codegen()}>
      {options}
    </select>
  );

  return (
    <div className={clsx(styles.Container, className)}>
      <div className="container">
        <div className="row">
          <div className="col col--6">
            <h1 style={{ textAlign: "center", lineHeight: "4rem" }}>
              {props.defaultTitle}
            </h1>
            <LiveProvider
              code={apexExample}
              language="apexlang"
              theme={theme}
              transformCode={() => "''"}
            >
              <div style={codeStyle}>
                <LiveEditor
                  onChange={(src) => {
                    try {
                      changed(src);
                      codegen();
                      updateParseError("");
                      return src;
                    } catch (e) {
                      console.error(e);
                      updateParseError(e.toString());
                    }
                  }}
                />
              </div>
            </LiveProvider>
          </div>
          <div className="col col--6">
            <div style={{ position: "relative" }}>
              <div className={styles.dropdown}>
                <h2>Generate</h2>
                {dropdown}
              </div>
              <div style={codeStyle}>{codeblock}</div>
              <div
                className={styles.error}
                style={{ display: parseError ? "flex" : "none" }}
              >
                <p>
                  Error in Apex source
                  <br />
                  {parseError}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApexEditor;
