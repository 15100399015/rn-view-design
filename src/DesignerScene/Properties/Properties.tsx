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
import ScenePropertiesPanel from "./ScenePropertiesPanel/ScenePropertiesPanel";
import PagePropertiesPanel from "./PagePropertiesPanel/PagePropertiesPanel";
import ViewPropertiesPanel from "./ViewPropertiesPanel/ViewPropertiesPanel";
import useProperties from "./useProperties";

import "./configurations.less";

function Properties() {
  const { propertyKey } = useProperties();

  function renderByPropertyKey() {
    if (propertyKey === "scene") {
      return <ScenePropertiesPanel />;
    }
    if (propertyKey === "page") {
      return <PagePropertiesPanel />;
    }
    if (propertyKey === "view") {
      return <ViewPropertiesPanel />;
    }
    return undefined;
  }

  return (
    <section id="section-properties" className="aside-east">
      <div className="aside-east__container">{renderByPropertyKey()}</div>
    </section>
  );
}

export default Properties;
