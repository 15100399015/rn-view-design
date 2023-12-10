/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from "react";
import StylePropertiesPanel from "./AttributePropertiesPanel";
import DataPropertiesPanel from "./OptionPropertiesPanel";

import usePropertiesTabs from "./usePropertiesTabs";

function Properties() {
  const { currentTabKey, renderTabs } = usePropertiesTabs({
    tabs: [
      {
        key: "Style",
        tab: "Style",
      },
      {
        key: "Data",
        tab: "Data",
      },
    ],
  });

  function renderPanel() {
    if (currentTabKey === "Style") {
      return <StylePropertiesPanel />;
    }
    if (currentTabKey === "Data") {
      return <DataPropertiesPanel />;
    }
    return undefined;
  }

  return (
    <section id="section-properties" className="aside-east">
      <div className="aside-east__container">
        <header className="conf-header">{renderTabs()}</header>
        <main className="conf-main">
          <div className="aside-east__container">{renderPanel()}</div>
        </main>
      </div>
    </section>
  );
}

export default Properties;
