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
import React, { useEffect, useState } from "react";
import SolidView, { SolidViewProps, SolidViewState } from "../../BaseView";
import { generatorElementTreeByXmlAst } from "@/utils/renderRnView";
import { viewTreeData } from "@/apis/data/_redPackData";
import { useEffectOnce } from "react-use";

export default class BaseViewSolidView<
  T extends SolidViewProps,
  S extends SolidViewState
> extends SolidView<T, S> {
  divRef: React.RefObject<HTMLDivElement>;

  resizeTimer?: any;

  constructor(props: T) {
    super(props);

    this.divRef = React.createRef();

    this.reFetchData = this.reFetchData.bind(this);
    this.reload = this.reload.bind(this);

    this.resize = this.resize.bind(this);
  }

  reFetchData() {}

  reload() {}

  protected reRender = async () => {
    const vm = this.getVM();
    const options = vm.options || {};
  };

  protected baseViewDidMount(): void {
    window.addEventListener("resize", this.resize);
    const vm = this.getVM();
    const { options } = vm;
  }

  protected baseViewWillUnmount(): void {
    window.removeEventListener("resize", this.resize);
  }

  /// / ------------------------------------------------------------------
  /// / protected methods
  resize(): void {}

  protected renderView(): React.ReactNode {
    return (
      <div
        ref={this.divRef}
        style={{
          position: "relative",
          userSelect: "none",
          width: "100%",
          height: "100%",
        }}
      >
        <RenderRnViewComponent />
      </div>
    );
  }
}

function RenderRnViewComponent() {
  const [Com, setCom] = useState<React.FunctionComponent | null>(null);
  useEffectOnce(() => {
    const Com = generatorElementTreeByXmlAst(viewTreeData as unknown as any);
    setCom(() => Com);
  });
  return (
    <div className="view-container">
      {Com && <Com btnEffect={"opacity"}></Com>}
    </div>
  );
}
