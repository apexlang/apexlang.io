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
  "Order a new pet."
  order(order: OrderRequest @n(1)): Order
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

  const [state, updateState] = useState({});

  function codegen(apexSrc: string) {
    const doc = parse(apexSrc, (name) => {
      console.warn(
        `Can not import apex files (i.e. '${name}') in this online editor`
      );
      return "";
    });

    // Code should only be generated for the active tab, but I can't figure
    // out how to find that in a React-y way. If you can, please fix this.
    const newState = Object.fromEntries(
      tabDefs.map((def) => [def.id, generate(doc, def.visitor, {})])
    );

    updateState(newState);

    return apexSrc;
  }

  let codeStyle = { height: "550px", overflow: "auto", borderRadius: "4px" };

  let tabDefs = [
    {
      label: "Proto",
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

  let tabs = tabDefs.map((def) => (
    <TabItem value={def.id} label={def.label} key={def.id}>
      <div style={codeStyle}>
        <CodeBlock language={def.lang} className={styles.codeblock}>
          {state[def.id]}
        </CodeBlock>
      </div>
    </TabItem>
  ));

  let tabList = <Tabs>{tabs}</Tabs>;

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
                      codegen(src);
                      updateParseError("");
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
              {tabList}
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
