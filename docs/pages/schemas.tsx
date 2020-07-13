import React from "react";

import { schemas } from "../../dist/";
import styles from "./jsonListing.module.scss";
import { H2, H3 } from "../components/anchoredHeadings";

const SchemasPage: React.FunctionComponent = () => {
  return (
    <div className={styles.jsonListing}>
      <h1>Schema Groups</h1>
      {Object.entries(schemas).map(([groupName, groupSchemas]) => (
        <>
          <H2>{groupName}</H2>
          {Object.entries(groupSchemas).map(([schemaName, schema]) => (
            <>
              <H3 anchor={`${groupName}-${schemaName}`}>{schemaName}</H3>
              <pre>
                <code>
                  {JSON.stringify(schema.definitions[schemaName], null, 4)}
                </code>
              </pre>
            </>
          ))}
        </>
      ))}
    </div>
  );
};
export default SchemasPage;
