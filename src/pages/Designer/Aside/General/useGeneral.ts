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

import React, { useEffect, useState, useRef } from "react";
import { message } from "antd";
import { useParams } from "react-router-dom";
import { isNil } from "lodash-es";
import { useUpdate } from "react-use";
import { eventbus, mm } from "@/utils";
import { SolidScenaDataType, SolidPageDataType } from "@/types/solid";
import Apis from "@/apis";
import {
  ProjectPageViewsResultData,
  CreatedSceneResponseDataType,
  CreatedPageResponseDataType,
} from "@/apis/types/resp";
import { ApiResult } from "@/types";
import { pageData } from "@/apis/data/mode";

interface StatefulSolidSceneDataType extends SolidScenaDataType {
  open?: boolean;
  editing?: boolean;
}

interface StatefulSolidPageDataType extends SolidPageDataType {
  selected?: boolean;
  editing?: boolean;
}

function useGeneral() {
  const forceUpdate = useUpdate();
  const params = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [scenes, setScenes] = useState<StatefulSolidSceneDataType[]>([]);
  const idRef = React.useRef<string>();

  const pageEditingModelMap = useRef<
    Map<
      string,
      {
        editing: boolean;
        oldName: string;
        newName: string;
      }
    >
  >(new Map());

  useEffect(() => {
    eventbus.on("onModelLoad", () => {
      const _scenes_ = mm.getScenes() as StatefulSolidSceneDataType[];
      _scenes_.forEach((_scene_) => {
        _scene_.open = false;
      });
      setScenes(_scenes_);
    });

    return () => {
      eventbus.off("onModelLoad");
    };
  }, []);

  useEffect(() => {
    if (isNil(params.id)) {
      return;
    }

    idRef.current = params.id;
  }, [params.id]);
  /**
   * 创建场景
   * @param title 标题
   * @returns
   */
  async function createScene(title: string) {
    const res: ApiResult<CreatedSceneResponseDataType> =
      await Apis.model.createPage({
        projectId: idRef.current || "",
        name: title,
        layout: "",
        orders: 1,
      });
    if (res.ok) {
      const { data } = res;
      if (isNil(data)) {
        forceUpdate();
        return;
      }
      mm.addScene({
        id: data.id,
        parentId: data.parentId || "",
        title: data.name,
        pages: [],
        selected: false,
        size: {
          width: 1024,
          height: 768,
        },
      });
      const _scenes_ = mm.getScenes() as StatefulSolidSceneDataType[];
      _scenes_.forEach((_scene_) => {
        _scene_.open = false;
      });
      setScenes(_scenes_);
      message.success("create scene ok");
    }
    forceUpdate();
  }
  /**
   * 创建场景页
   * @param scene 场景
   * @param title 标题
   * @returns
   */
  async function createPage(scene: StatefulSolidSceneDataType, title: string) {
    const res: ApiResult<CreatedPageResponseDataType> =
      await Apis.model.createPage({
        projectId: idRef.current || "",
        name: title,
        parentId: scene.id,
        layout: "",
        orders: 1,
      });

    if (res.ok) {
      const { data } = res;
      if (isNil(data)) {
        forceUpdate();
        return;
      }
      mm.addPage({
        id: data.id,
        title: data.name,
        views: [],
        selected: false,
        parentId: data?.parentId || "",
        size: {
          width: 1024,
          height: 768,
        },
      });

      const _pages_ = mm.getPages() as StatefulSolidPageDataType[];
      _pages_.forEach((_page_) => {
        _page_.selected = false;
      });
      message.success("create page ok");
    }
    forceUpdate();
  }
  /**
   * 删除场景或场景页
   * @param item 被删除项
   * @returns
   */
  async function deletePage(item: SolidPageDataType | SolidScenaDataType) {
    if (!item || !item.id) return;
    const res = await Apis.model.deletePage(item.id);
    if (res.ok) {
      if (!Number(item.parentId)) {
        mm.removeScene(item as SolidScenaDataType);
      } else {
        mm.removePage(item as SolidPageDataType);
      }
    }
    setScenes(mm.getScenes());
    forceUpdate();
  }
  /**
   * 切换场景
   * @param scene
   */
  function toggleScene(scene: StatefulSolidSceneDataType) {
    setLoading(true);
    const selectedScene = mm.getScene(scene.id);
    if (selectedScene) {
      selectedScene.selected = !selectedScene.selected;
    }
    forceUpdate();
    setLoading(false);
  }
  /**
   * 选择场景页
   * @param page
   * @returns
   */
  async function selectPage(page: SolidPageDataType) {
    const currentPage = mm.getCurrentPage();
    if (currentPage && currentPage.id === page.id) {
      return;
    }

    const model = mm.getModel();
    if (isNil(model)) {
      return;
    }
    const data: any = pageData;
    const pages = mm.getPages();
    pages.forEach((p) => {
      if (p.id === page.id) {
        p.selected = true;
      } else {
        p.selected = false;
      }
      p.size = {
        width: data?.size.width || 1024,
        height: data?.size.height || 768,
      };
    });
    mm.selectPage(page.id);
    const views = data?.views || [];
    views.forEach((v: any) => {
      v.id = `${v.id}`;
      v.frame = {
        translate: [v.position.top, v.position.left, 0, 0],
      };
    });
    mm.setViews(views);
    eventbus.emit("onSelectPage", { id: page.id, page });
    forceUpdate();
  }
  /**
   * 场景或场景页进入重命名
   * @param entity
   */
  async function edit(
    entity: StatefulSolidPageDataType | StatefulSolidSceneDataType
  ) {
    pageEditingModelMap.current.forEach((v, k) => {
      if (v) {
        pageEditingModelMap.current.set(k, {
          editing: false,
          oldName: entity.title,
          newName: entity.title,
        });
      }
    });
    pageEditingModelMap.current.set(entity.id, {
      editing: true,
      oldName: entity.title,
      newName: entity.title,
    });

    forceUpdate();
  }
  /**
   * 场景或场景页重命名
   * @param entity
   * @returns
   */
  async function renamePage(
    entity: StatefulSolidPageDataType | StatefulSolidSceneDataType
  ) {
    const selectEntity = pageEditingModelMap.current.get(entity.id);
    if (isNil(selectEntity)) return;

    if (selectEntity.newName === selectEntity.oldName) {
      selectEntity.editing = false;
      forceUpdate();
      return;
    }
    const res = await Apis.model.renamePage(entity.id, {
      name: selectEntity.newName,
    });
    if (res.ok) {
      message.success("rename ok");
      entity.title = selectEntity.newName;
      selectEntity.editing = false;
      forceUpdate();
    }
  }
  /**
   * 编辑完成
   * @param event
   * @param entity
   * @returns
   */
  async function handleEditingInputKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
    entity: StatefulSolidPageDataType | StatefulSolidSceneDataType
  ) {
    if (event.keyCode === 27) {
      const selectEntity = pageEditingModelMap.current.get(entity.id);
      if (isNil(selectEntity)) {
        return;
      }
      selectEntity.editing = false;
      selectEntity.newName = "";
      selectEntity.oldName = "";
      forceUpdate();
    } else if (event.keyCode === 13) {
      await renamePage(entity);
    }
  }

  return {
    loading,
    scenes,
    createScene,
    createPage,
    toggleScene,
    selectPage,
    deletePage,
    edit,
    pageEditingModelMap,
    handleEditingInputKeyDown,
    renamePage,
  };
}

export default useGeneral;
