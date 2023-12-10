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

import { isNil, set, unset, forEach, isEmpty, remove, find } from "lodash-es";
import { SolidModelDataType, SolidViewDataType } from "@/DesignerView/types";
import { eventbus } from "@/DesignerView/utils";
import { OnSelectViewEventData } from "@/DesignerView/types/eventbus";

class ModelManager {
  private model?: SolidModelDataType;

  private currentView?: SolidViewDataType;

  private viewMap: Map<string, SolidViewDataType> = new Map();

  constructor() {
    this.handleSelectView = this.handleSelectView.bind(this);

    eventbus.on("onSelectViewInViewList", this.handleSelectView);
    eventbus.on("onSelectViewInViewport", this.handleSelectView);
  }

  private handleSelectView(data: OnSelectViewEventData) {
    const viewId = data.id;
    const view = this.viewMap.get(viewId);
    if (!isNil(view)) {
      this.currentView = view;
    }
  }

  public attach(model: SolidModelDataType): void {
    this.model = model;
    this.__clear();
    this.__config(model);
  }

  private __clear() {
    this.currentView = undefined;
    this.viewMap.clear();
  }

  private __config(model: SolidModelDataType) {
    if (isNil(model)) {
      return;
    }
    const view = model.view;
    if (isNil(view)) {
      return;
    }

    const recursion = (childNodes: SolidViewDataType[], parentId?: string) => {
      for (let i = 0; i < childNodes.length; i++) {
        const view = childNodes[i];
        if (parentId) view.meta.parentId = parentId;
        this.viewMap.set(view.meta.id, view);
        if (view.childNodes?.length) {
          recursion(view.childNodes, view.meta.id);
        }
      }
    };
    recursion([view], "root");
  }

  public updateView() {
    eventbus.emit("onUpdateView", {
      model: this.getModel() as SolidModelDataType,
    });
  }
  public getModel(): SolidModelDataType | undefined {
    return this.model;
  }
  public getCurrentView(): SolidViewDataType | undefined {
    return this.currentView;
  }
  public getView(id: string): SolidViewDataType | undefined {
    return this.viewMap.get(id);
  }

  public addView(parentView: SolidViewDataType, view: SolidViewDataType): void {
    // const parent = this.viewMap.get(parentView.id);
    // parent?.childNodes?.push(view);
    // this.viewMap.set(view.id, view);
    // this.views.push(view);
  }

  public setViews(views: SolidViewDataType[]): void {
    // this.currentPage.views = [];
    // forEach(views, (item) => {
    //   this.currentPage?.views.push(item);
    //   this.viewMap.set(`${item.id}`, item);
    //   this.views.push(item);
    // });
  }

  public removeView(id: string): void {
    const parentId = this.viewMap.get(id)?.meta.parentId;
    if (!parentId) return;
    const parent = this.viewMap.get(parentId);
    if (!parent) return;
    for (let i = 0; i < parent.childNodes!.length; i++) {
      const view = parent.childNodes![i];
      if (view.meta.id === id) {
        this.viewMap.delete(view.meta.id);
        parent.childNodes!.splice(i, 1);
        this.updateView();
        return;
      }
    }
  }

  public getPrepareSavingModel(): SolidModelDataType | undefined {
    return undefined;
  }
}

export default ModelManager;
