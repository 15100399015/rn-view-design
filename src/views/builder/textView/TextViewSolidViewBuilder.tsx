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
import { TooltipComponentOption } from "echarts";
import { SolidViewDataType, SolidViewType } from "@/types/solid";
import { genId } from "@/utils";
import SolidViewBuilder, { ViewCategory } from "../../SolidViewBuilder";
import Base64ImageSolidView from "./TextViewSolidView";

export default class Base64ImageSolidViewBuilder extends SolidViewBuilder {
  createModel(options: any = {}): any {
    const viewModel: SolidViewDataType = {
      id: genId(),
      title: "textView",
      type: "textView",
      position: {
        top: 0,
        left: 0,
      },
      size: {
        width: 560,
        height: 250,
      },
      frame: {
        backgroundColor: "#333",
        translate: [0, 0],
        rotate: 0,
      },
      options: {
        ...options,
      },
    };

    const defaultOptions = {
      tooltip: {
        show: true,
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      } as TooltipComponentOption,
    };

    const viewStyle = {
      position: "absolute",
      background: "#fff",
      overflow: "hidden",
      border: "1px solid #f1f1f1",
    } as React.CSSProperties;

    viewModel.style = viewStyle;

    return { ...viewModel, option: defaultOptions };
  }

  getFrame(): any {
    return {
      translate: [0, 0],
      transformOrigin: "50% 50%",
      rotate: 0,
    };
  }

  getComponentType(): any {
    return Base64ImageSolidView;
  }

  getCategory(): ViewCategory {
    return {
      key: "images",
      title: "Base64 Image",
    };
  }

  getDescription(): string {
    return "";
  }

  getIcon(): string {
    return "";
  }

  getTitle(): string {
    return "Base64 Image";
  }

  getType(): SolidViewType {
    return "textView";
  }

  getId(): string {
    return "image_base64";
  }

  getImage(): string {
    return "";
  }
}
