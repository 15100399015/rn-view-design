import React, { useEffect, useLayoutEffect, useRef } from "react";
import InfiniteViewer from "react-infinite-viewer";
import Guides from "@scena/react-guides";
import Selecto from "react-selecto";
import { OnSelectViewEventData } from "@/DesignerScene/types/eventbus";
import { eventbus, mm } from "@/DesignerView/utils";
import SolidViewport from "./DesignerViewport";
import MoveableManager from "./utils/MoveableManager";
import MoveableData from "./utils/MoveableData";
import Memory from "./utils/Memory";
import { SOLIDUI_ELEMENT_ID } from "./utils/const";
import { prefix } from "./utils";

import { SolidEditorContext } from "./DesignerContext";
import { ElementInfo } from "./utils/types";
import "./style/index.less";
import { OnModelLoadEventData } from "@/types";
import { generatorElementTreeByXmlAst } from "@/utils/renderRnView";

export interface SolidEditorState {
  selectedTargets: Array<SVGElement | HTMLElement>;
  horizontalGuides: number[];
  verticalGuides: number[];
  selectedMenu: string;
  zoom: number;
}

export interface SolidEditorProps {
  id?: string;
  width: number;
  height: number;
  zoom?: number;
}

export default class SolidEditor extends React.PureComponent<
  SolidEditorProps,
  SolidEditorState
> {
  constructor(props: SolidEditorProps) {
    super(props);
    // 清除画布
    this.clear = this.clear.bind(this);

    this.state = {
      selectedTargets: [],
      horizontalGuides: [],
      verticalGuides: [],
      zoom: this.props.zoom ? this.props.zoom : 1,
      selectedMenu: "MoveTool",
    };
  }

  public memory = new Memory();

  public moveableData = new MoveableData(this.memory);

  public editorRef = React.createRef<HTMLDivElement>();

  // 和横向标尺引用
  public horizontalGuides = React.createRef<Guides>();
  //  竖向标尺引用
  public verticalGuides = React.createRef<Guides>();
  //  画布引用
  public infiniteViewer = React.createRef<InfiniteViewer>();
  // 画布内视口引用
  public viewport = React.createRef<SolidViewport>();
  //  选择控件引用
  public selecto = React.createRef<Selecto>();
  // 移动控件引用
  public moveableManager = React.createRef<MoveableManager>();

  componentDidMount(): void {
    eventbus.on("onModelLoad", this.handleModelLoad);
    eventbus.on("onSelectViewInViewList", this.handleSelectViewinViewList);
  }

  componentWillUnmount(): void {
    eventbus.off("onModelLoad", this.handleModelLoad);
    eventbus.off("onSelectViewInViewList", this.handleSelectViewinViewList);
  }

  public handleSelectViewinViewList = (event: OnSelectViewEventData) => {
    const view = mm.getView(event.id);
    if (view) {
      this.selectTarget(view.meta.id);
    }
  };

  public handleModelLoad = (event: OnModelLoadEventData) => {
    const model = mm.getModel();
    this.clear().then(() => {
      if (model?.view) {
        const JsxComponent = generatorElementTreeByXmlAst(
          model.view as unknown as any
        );
        this.setViewPortRootView({
          id: "view.meta.id",
          jsx: <JsxComponent />,
          name: "根标签",
        });
      }
    });
  };

  public getViewport = () => this.viewport.current!;

  public getSelecto = () => this.selecto.current!;

  public getInfiniteViewer = () => this.infiniteViewer.current!;

  public setZoom = (zoom: number) => {
    this.setState({
      zoom,
    });
  };

  public selectTarget(id: string) {
    const target = this.getViewport().getElement(id);
    if (target) {
      this.setSelectedTargets([target]);
    }
  }

  public setViewPortRootView(info: ElementInfo): Promise<any> {
    return this.getViewport().setRootView(info);
  }

  public clear() {
    return new Promise((resolve) => {
      this.getViewport().clear();
      resolve(void 0);
    });
  }

  public promiseState(state: SolidEditorState) {
    return new Promise<void>((resolve) => {
      this.setState(state, () => {
        resolve();
      });
    });
  }

  public setSelectedTargets(targets: Array<HTMLElement | SVGElement>) {
    targets = targets.filter((target) =>
      targets.every(
        (parnetTarget) =>
          parnetTarget === target || !parnetTarget.contains(target)
      )
    );

    return this.promiseState({
      ...this.state,
      selectedTargets: targets,
    }).then(() => {
      this.selecto.current!.setSelectedTargets(targets);
      this.moveableData.setSelectedTargets(targets);
      const id = targets[0].getAttribute(SOLIDUI_ELEMENT_ID) as string;
      eventbus.emit("onSelectViewInViewport", { id });
      return targets;
    });
  }

  public getSelectedTargets = () => this.state.selectedTargets;

  public render() {
    return (
      <SolidEditorContext.Provider value={this}>
        {this.__render()}
      </SolidEditorContext.Provider>
    );
  }

  private __render() {
    const {
      horizontalGuides,
      verticalGuides,
      infiniteViewer,
      selecto,
      moveableManager,
      state,
    } = this;

    const { selectedMenu, selectedTargets, zoom } = state;

    const { width, height } = this.props;

    let unit = 50;
    if (zoom < 0.8) {
      unit = Math.floor(1 / zoom) * 50;
    }

    const horizontalSnapGuides = state.horizontalGuides;
    const verticalSnapGuides = state.verticalGuides;

    return (
      <>
        <div
          id={this.props.id}
          className={prefix("editor")}
          ref={this.editorRef}
        >
          <div
            className="editor-guides-reset"
            onClick={() => {
              infiniteViewer.current!.scrollCenter();
            }}
          />
          <div className="editor-zoom-btn" />
          {/* 横向标尺 */}
          <Guides
            ref={horizontalGuides}
            type="horizontal"
            className="editor-guides guides-horizontal"
            snapThreshold={5}
            snaps={horizontalSnapGuides}
            displayDragPos
            dragPosFormat={(v) => `${v}px`}
            zoom={zoom}
            unit={unit}
            onChangeGuides={(e) => {
              this.setState({
                horizontalGuides: e.guides,
              });
            }}
            lineColor="#D1D1D1"
            backgroundColor="#F6F6F6"
            textColor="#D1D1D1"
          />
          {/* 竖向标尺 */}
          <Guides
            ref={verticalGuides}
            type="vertical"
            className="editor-guides guides-vertical"
            snapThreshold={5}
            snaps={verticalSnapGuides}
            displayDragPos
            dragPosFormat={(v) => `${v}px`}
            zoom={zoom}
            unit={unit}
            onChangeGuides={(e) => {
              this.setState({
                verticalGuides: e.guides,
              });
            }}
            lineColor="#D1D1D1"
            backgroundColor="#F6F6F6"
            textColor="#D1D1D1"
          />

          {/* view wrapper */}
          <InfiniteViewer
            ref={infiniteViewer}
            className="editor-viewer"
            zoom={zoom}
            useWheelScroll
            useForceWheel
            pinchThreshold={50}
            onScroll={(e) => {
              horizontalGuides.current!.scroll(e.scrollLeft);
              horizontalGuides.current!.scrollGuides(e.scrollTop);
              verticalGuides.current!.scroll(e.scrollTop);
              verticalGuides.current!.scrollGuides(e.scrollLeft);
            }}
            // onDragStart={(e) => {}}
            // onDrag={(e) => {}}
            usePinch
            onPinch={(e) => {
              eventbus.emit("onZoom", { zoom: e.zoom });
              this.setState({
                zoom: e.zoom,
              });
            }}
            // onPinchStart={(e) => {}}
          >
            <SolidViewport
              ref={this.viewport}
              onBlur={() => {}}
              style={{
                width: `${width}px`,
                height: `${height}px`,
                background: "rgb(25, 26, 29)",
                boxShadow: "rgb(0 0 0 / 10%) 0px 2px 6px",
              }}
            >
              <MoveableManager
                ref={moveableManager}
                selectedTargets={selectedTargets}
                selectedMenu={selectedMenu}
                verticalGuidelines={verticalSnapGuides}
                horizontalGuidelines={horizontalSnapGuides}
                zoom={zoom}
              />
            </SolidViewport>
          </InfiniteViewer>
        </div>
        {/* 操作控件 */}
        <Selecto
          ref={selecto}
          dragContainer=".editor-viewport"
          selectableTargets={[`.editor-viewport [${SOLIDUI_ELEMENT_ID}]`]}
          hitRate={0}
          ratio={0}
          selectByClick
          selectFromInside={false}
          continueSelectWithoutDeselect
          toggleContinueSelectWithoutDeselect={["x"]}
          continueSelect={false}
          toggleContinueSelect={["shift"]}
          scrollOptions={
            infiniteViewer.current
              ? {
                  container: infiniteViewer.current.getContainer(),
                  threshold: 30,
                  throttleTime: 30,
                  getScrollPosition: () => {
                    const current = infiniteViewer.current!;
                    return [current.getScrollLeft(), current.getScrollTop()];
                  },
                }
              : undefined
          }
          onSelectEnd={(e) => {
            const selected = e.selected || [];
            const { isDragStart } = e;
            const { inputEvent } = e;
            if (isDragStart) {
              inputEvent.preventDefault();
            }
            this.setSelectedTargets(selected).then(() => {
              if (!isDragStart) {
                return;
              }
              moveableManager.current!.getMoveable().dragStart(e.inputEvent);
            });
          }}
        />
      </>
    );
  }
}
