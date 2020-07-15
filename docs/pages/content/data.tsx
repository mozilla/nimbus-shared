import React from "react";
import { data } from "../../../dist";
import styles from "./jsonListing.module.scss";
import { H2, H3 } from "../../components/anchoredHeadings";

const DataPage: React.FunctionComponent = () => {
  const githubUrl = "https://github.com/mozilla/nimbus-shared/tree/main/data";

  return (
    <div className={styles.jsonListing}>
      <h1>Data Groups</h1>

      <p>
        This is the data exported by nimbus-shared. The source of this data is{" "}
        <a href={githubUrl}>on GitHub</a>.
      </p>

      {Object.entries(data).map(([groupName, groupData]) => (
        <>
          <H2>{groupName}</H2>
          {Object.entries(groupData).map(([dataName, data]) => (
            <>
              <H3 anchor={`${groupName}-${dataName}`}>{dataName}</H3>
              <pre>
                <code>{JSON.stringify(data, null, 4)}</code>
              </pre>
            </>
          ))}
        </>
      ))}
    </div>
  );
};

export default DataPage;
