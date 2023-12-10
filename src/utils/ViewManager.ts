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

import { isNil, set, unset, forEach, isEmpty, isNull } from "lodash-es";
import {
  SolidModelDataType,
  SolidScenaDataType,
  SolidPageDataType,
  SolidViewDataType,
} from "@/types/solid";
import { eventbus } from "@/utils";
import { OnSelectViewEventData } from "@/types/eventbus";

class ViewManager {
  private model?: SolidModelDataType;

  private currentPage?: SolidPageDataType;

  private currentScene?: SolidScenaDataType;

  private currentView?: SolidViewDataType;

  private viewMap: Map<string, SolidViewDataType> = new Map();

  private views: SolidViewDataType[] = [];

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
    this.views = [];
  }

  private __config(model: SolidModelDataType) {
    if (isNil(model)) {
      return;
    }
    const scene = model.scena;
    const page = model.page;
    const views = model.views;
    if (isNil(scene) || isNull(page) || isNil(views)) {
      return;
    }
    for (let i = 0; i < views.length; i++) {
      this.viewMap.set(views[i].id, views[i]);
      this.views.push(views[i]);
    }
  }

  public addScene(scene: SolidScenaDataType) {
    if (isNil(this.model)) {
      return;
    }
    this.sceneMap.set(scene.id, scene);
    this.scenes.push(scene);
    if (this.model.scenas) {
      this.model.scenas.push(scene);
    } else {
      set(this.model, "scenas", [scene]);
    }
  }

  public getViews(): SolidViewDataType[] {
    return this.views || [];
  }

  public getCurrentPage(): SolidPageDataType | undefined {
    return this.currentPage;
  }

  public getCurrentView(): SolidViewDataType | undefined {
    return this.currentView;
  }

  public getCurrentScene(): SolidScenaDataType | undefined {
    return this.currentScene;
  }

  public getView(id: string): SolidViewDataType | undefined {
    return this.viewMap.get(id);
  }

  public getModel(): SolidModelDataType | undefined {
    return this.model;
  }

  public addView(view: SolidViewDataType): void {
    if (isNil(this.currentPage)) {
      return;
    }
    this.currentPage.views.push(view);
    this.viewMap.set(view.id, view);
    this.views.push(view);
  }

  public addViews(views: SolidViewDataType[]): void {
    if (isNil(this.currentPage)) {
      return;
    }
    forEach(views, (item) => {
      this.currentPage?.views.push(item);
      this.viewMap.set(`${item.id}`, item);
      this.views.push(item);
    });
  }

  public setViews(views: SolidViewDataType[]): void {
    if (isNil(this.currentPage)) {
      return;
    }
    this.currentPage.views = [];
    forEach(views, (item) => {
      this.currentPage?.views.push(item);
      this.viewMap.set(`${item.id}`, item);
      this.views.push(item);
    });
  }

  public removeView(id: string): void {
    if (isNil(this.currentPage)) {
      return;
    }
    const index = this.currentPage.views.findIndex((item) => item.id === id);
    if (index > -1) {
      this.currentPage.views.splice(index, 1);
    }
    this.viewMap.delete(id);
    this.views = this.views.filter((item) => item.id !== id);
  }

  public getPrepareSavingModel(): SolidModelDataType | undefined {
    if (isNil(this.model)) {
      return undefined;
    }
    if (!isEmpty(this.model.scenas)) {
      forEach(this.model.scenas, (item) => {
        if (!isEmpty(item.pages)) {
          forEach(item.pages, (page) => unset(page, "selected"));
        }
        unset(item, "selected");
      });
    }
    return this.model;
  }
}

export default ViewManager;
