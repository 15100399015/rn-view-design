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
import { useMemoizedFn } from "ahooks";
import { eventbus, mm } from "@/utils";
import Header from "./Header/Header";
import Aside from "./Aside/Aside";
import Scena from "./Scena/Scena";
import Properties from "./Properties/Properties";
import "@/assets/styles/designer.less";
import { modelData } from "@/apis/data/mode";

function Dashboard() {
  const handleLoad = useMemoizedFn(async () => {
    mm.attach(modelData);
    eventbus.emit("onModelLoad", { model: modelData });
  });

  React.useEffect(() => {
    handleLoad();
  }, [handleLoad]);

  return (
    <div id="dashboard">
      {/* 头部 */}
      <Header />
      {/* 左侧边栏 */}
      <Aside />
      {/* 场景视图 */}
      <Scena />
      {/* 右侧面板 */}
      <Properties />
    </div>
  );
}

export default Dashboard;
