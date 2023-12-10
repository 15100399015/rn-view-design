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

import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Tooltip } from "antd";
import { ChartHistogramTwo } from "@icon-park/react";
import { eventbus, mm } from "@/DesignerScene/utils";
import {
  ProjectPageViewsCreationDataType,
  PageViewCreationDataType,
} from "@/apis/types";
import "./header.less";
import { isNil, startsWith } from "lodash-es";

function Header() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [title, setTitle] = React.useState("");

  function renderHome() {
    navigate("/");
  }

  useEffect(() => {
    const projectName = searchParams.get("projectName");
    if (projectName !== null) {
      setTitle(projectName);
    }
  }, [searchParams]);

  const vars: Record<string, any> = {};
  Object.keys(process.env).forEach((key) => {
    vars[key] = process.env[key];
  });

  return (
    <header className="header">
      <div className="header-main">
        <div className="header-left">
          <div className="logo-text" onClick={renderHome}>
            {vars.APP_NAME || "SolidUI"}
          </div>
          <div className="split-line" />
        </div>
        <div className="header-center">
          {/* <Tooltip title="Bar Chart">
            <ChartHistogramTwo
              theme="two-tone"
              size="32"
              fill={["#379aff", "#4890f3"]}
              strokeLinejoin="bevel"
              strokeLinecap="square"
              style={{
                cursor: "pointer",
              }}
              onClick={() => {
                eventbus.emit("onDraw", {
                  viewType: "echarts_bar",
                });
              }}
            />
          </Tooltip>
          <Tooltip title="Line Chart">
            <ChartHistogramTwo
              theme="two-tone"
              size="32"
              fill={["#379aff", "#4890f3"]}
              strokeLinejoin="bevel"
              strokeLinecap="square"
              style={{
                cursor: "pointer",
              }}
              onClick={() => {
                eventbus.emit("onDraw", {
                  viewType: "echarts_line",
                });
              }}
            />
          </Tooltip> */}
        </div>
        <div className="header-right">
          <Button
            size="small"
            onClick={async () => {
              const model = mm.getPrepareSavingModel();
              const page = mm.getCurrentPage();

              if (isNil(model) || isNil(page)) {
                return;
              }
              const views = page.views || [];
              const _views: PageViewCreationDataType[] = [];
              views.forEach((view) => {
                const v: any = {
                  title: view.title,
                  options: view.options,
                  position: {
                    top: `${view.position.top}`,
                    left: `${view.position.left}`,
                  },
                  size: {
                    width: `${view.size.width}`,
                    height: `${view.size.height}`,
                  },
                  type: view.type,
                };
                if (view.options !== null && undefined !== view.options) {
                }
                if (!startsWith(view.id, "visual")) {
                  v.id = view.id;
                }
                _views.push(v);
              });
              const data: ProjectPageViewsCreationDataType = {
                projectId: model.id,
                page: {
                  id: page.id,
                  name: page.title,
                },
                size: {
                  width: page.size.width,
                  height: page.size.height,
                },
                views: _views,
              };
              console.log(data);
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Header;
