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
import { Emitter } from "mitt";
import { set, cloneDeep } from "lodash-es";
import {
  EventBusType,
  OnReiszeGroupEventData,
  OnUpdateViewPropertyValueEventData,
} from "@/types/eventbus";

import { SolidViewDataType } from "@/types/solid";

export interface SolidViewProps {
  id: string;
  className?: string;
  style?: React.CSSProperties;
  viewModel: SolidViewDataType;
  "solidui-element-id"?: string;
  eventbus: Emitter<EventBusType>;
  scenaAttrs?: any;
}

export interface SolidViewState {
  viewModel: SolidViewDataType;
}

export default abstract class SolidView<
  T extends SolidViewProps,
  S extends SolidViewState = SolidViewState
> extends React.Component<T, S> {
  private viewRef = React.createRef<HTMLDivElement>();

  private vm: SolidViewDataType;

  private id: string;

  private eventbus: Emitter<EventBusType>;

  protected constructor(props: T) {
    super(props);

    this.id = props["solidui-element-id"] as string;
    this.eventbus = props.eventbus;
    this.vm = this.props.viewModel || {};

    // abstract methods
    this.renderView = this.renderView.bind(this);
    this.baseViewDidMount = this.baseViewDidMount.bind(this);
    this.baseViewWillUnmount = this.baseViewWillUnmount.bind(this);
    // this.reRender = this.reRender.bind(this);
  }

  /// / ------------------------------------------------------------------
  /// / abstract methods
  protected abstract baseViewDidMount(): void;

  protected abstract baseViewWillUnmount(): void;

  protected abstract reRender(): void;

  protected abstract resize(): void;

  protected abstract renderView(): React.ReactNode;

  /// / ------------------------------------------------------------------
  /// / protected methods
  protected renderTitle(): React.ReactNode {
    const viewModel = this.vm;
    const options = viewModel.options || {};
    const title = options.title || {};
    const style = title.style || {};
    const { show } = title;
    if (show) {
      return (
        <div className="solid-view-title" style={style}>
          {title.text}
        </div>
      );
    }
    return null;
  }

  protected getVM(): SolidViewDataType {
    return this.vm;
  }

  /// / ------------------------------------------------------------------
  /// / private methods

  async componentDidMount() {
    this.baseViewDidMount();

    this.eventbus.on("onResize", this.handleResize);
    this.eventbus.on("onResizeGroup", this.handleResizeGroup);
    this.eventbus.on(
      "onUpdateViewPropertyValue",
      this.handleUpdateViewPropertyValue
    );
  }

  protected handleResize = () => {
    this.resize();
  };

  protected getViewRef() {
    return this.viewRef;
  }

  protected handleUpdateViewPropertyValue = (
    evt: OnUpdateViewPropertyValueEventData
  ) => {
    if (this.id === evt.id) {
      const clonedVM = cloneDeep(this.vm);
      set(clonedVM, evt.property, evt.value);
      this.vm = clonedVM;
      this.forceUpdate();
      this.reRender();
    }
  };

  protected handleResizeGroup = (evt: OnReiszeGroupEventData) => {
    Object.keys(evt).forEach((key) => {
      if (key === this.id) {
        this.resize();
      }
    });
  };

  async componentWillUnmount() {}

  async componentDidUpdate() {
    // this.reRender();
  }

  render() {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const { viewModel, className, style, eventbus, scenaAttrs, ...restProps } =
      this.props;
    return (
      <div
        className={className}
        style={{
          display:"inline-block",
          position: "relative",
          width: "auto",
          height: "auto",
          zIndex: 1,
          padding: 5,
          background: "#fff",
          ...style,
        }}
        ref={this.viewRef}
        {...restProps}
      >
        {this.renderTitle()}
        {this.renderView()}
      </div>
    );
  }
}
