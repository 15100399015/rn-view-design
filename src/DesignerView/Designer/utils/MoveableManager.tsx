import * as React from "react";
import Moveable from "react-moveable";
import { isNaN } from "lodash-es";
import { OnReiszeGroupEventData } from "@/types/eventbus";
import { eventbus, mm } from "@/utils";
import { getContentElement } from "./index";
import { EditorInterface } from "./types";
import { connectEditorContext } from "../DesignerContext";
import { SOLIDUI_ELEMENT_ID } from "./const";
import {
  DimensionViewable,
  DimensionViewableProps,
} from "../ables/DimensionViewable";
import {
  DelteButtonViewable,
  DelteButtonViewableProps,
} from "../ables/DeleteButtonViewable";

interface MoveableManager extends EditorInterface {}

@connectEditorContext
class MoveableManager extends React.PureComponent<{
  selectedTargets: Array<HTMLElement | SVGElement>;
  selectedMenu: string;
  verticalGuidelines: number[];
  horizontalGuidelines: number[];
  zoom: number;
}> {
  public moveable = React.createRef<Moveable>();

  public getMoveable() {
    return this.moveable.current!;
  }

  public render() {
    const {
      verticalGuidelines,
      horizontalGuidelines,
      selectedTargets,
      selectedMenu = "Text",
      zoom,
    } = this.props;

    if (!selectedTargets.length) {
      // return this.renderViewportMoveable();
      return undefined;
    }

    const { moveableData } = this;

    const elementGuidelines = [
      document.querySelector(".editor-viewport"),
      ...moveableData.getTargets(),
    ].filter((el) => selectedTargets.indexOf(el as any) === -1);

    return (
      <Moveable<DimensionViewableProps & DelteButtonViewableProps>
        ables={[DimensionViewable, DelteButtonViewable]}
        ref={this.moveable}
        targets={selectedTargets}
        dimensionViewable
        deleteButtonViewable
        zoom={1 / zoom}
        throttleResize={1}
        throttleDrag={1}
        passDragArea={selectedMenu === "Text"}
        checkInput={selectedMenu === "Text"}
        // keepRatio={selectedTargets.length > 1 ? true : isShift}
        keepRatio={false}
        // Snapable
        snappable
        bounds={{
          position: "css",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
        }}
        snapThreshold={5}
        snapGap
        elementGuidelines={elementGuidelines}
        elementSnapDirections={{
          top: true,
          left: true,
          bottom: true,
          right: true,
          center: true,
          middle: true,
        }}
        isDisplaySnapDigit
        isDisplayInnerSnapDigit
        snapDistFormat={(v) => `${v}px`}
        // Roundable
        roundable={false}
        // roundable={selectedTargets.length > 1 ? false : true}
        roundClickable={false}
        isDisplayShadowRoundControls
        minRoundControls={[1, 0]}
        maxRoundControls={[1, 0]}
        roundRelative
        roundPadding={13}
        onRound={(e) => {
          moveableData.onRound(e);
          e.target.style.borderRadius = e.borderRadius;
        }}
        verticalGuidelines={verticalGuidelines}
        horizontalGuidelines={horizontalGuidelines}
        // Drag
        draggable
        // onDragStart={moveableData.onDragStart}
        onDragStart={(e) => {
          const id = e.target.getAttribute(SOLIDUI_ELEMENT_ID);
          if (id === null || undefined === id) {
            return;
          }
          const view = mm.getView(id);
          if (view === null || undefined === view) {
            return;
          }
          const top = view.position.top || 0;
          const left = view.position.left || 0;
          e.set([parseFloat(left.toString()), parseFloat(top.toString())]);
        }}
        onDrag={(e) => {
          const id = e.target.getAttribute(SOLIDUI_ELEMENT_ID);

          if (id === null || undefined === id) {
            return;
          }
          const view = mm.getView(id);

          if (view === null || undefined === view) {
            return;
          }
          const rotate = view.frame.rotate || 0;
          const moveL = e.beforeTranslate[0];
          const moveT = e.beforeTranslate[1];
          view.position.left = moveL;
          view.position.top = moveT;
          e.target.style.transform = `translate(${moveL}px, ${moveT}px) rotate(${rotate}deg)`;
        }}
        onDragGroupStart={moveableData.onDragGroupStart}
        onDragGroup={moveableData.onDragGroup}
        onDragOriginStart={moveableData.onDragOriginStart}
        onDragOrigin={(e) => {
          moveableData.onDragOrigin(e);
        }}
        onScaleStart={moveableData.onScaleStart}
        onScale={moveableData.onScale}
        onScaleGroupStart={moveableData.onScaleGroupStart}
        onScaleGroup={moveableData.onScaleGroup}
        // Resize
        resizable
        onResizeStart={moveableData.onResizeStart}
        onResize={(e) => {
          moveableData.onResize(e);
        }}
        onResizeEnd={(e) => {
          const id = e.target.getAttribute(SOLIDUI_ELEMENT_ID);
          if (id === null || undefined === id) {
            return;
          }
          if (e.lastEvent === null || e.lastEvent === undefined) {
            return;
          }
          const view = mm.getView(id);
          if (view === null || undefined === view) {
            return;
          }
          const w = e.lastEvent.boundingWidth;
          const h = e.lastEvent.boundingHeight;
          view.size = { ...view.size, width: w, height: h };
          eventbus.emit("onResize", { id, width: w, height: h });
        }}
        onResizeGroupStart={moveableData.onResizeGroupStart}
        onResizeGroup={moveableData.onResizeGroup}
        onResizeGroupEnd={(e) => {
          const evts = e.events || [];
          const eventData: OnReiszeGroupEventData = {};
          for (let i = 0; i < evts.length; i++) {
            if (evts[i].lastEvent === null || evts[i].lastEvent === undefined) {
              return;
            }
            const t = evts[i].target;
            const w = evts[i].lastEvent.boundingWidth;
            const h = evts[i].lastEvent.boundingHeight;
            const tid = t.getAttribute(SOLIDUI_ELEMENT_ID);
            if (tid === null || undefined === tid) {
              continue;
            }
            eventData[tid] = { width: w, height: h };
          }
          eventbus.emit("onResizeGroup", eventData);
        }}
        // Rotate
        rotatable={false}
        onRotateStart={moveableData.onRotateStart}
        onRotate={moveableData.onRotate}
        onRotateGroupStart={moveableData.onRotateGroupStart}
        onRotateGroup={moveableData.onRotateGroup}
        onClick={(e) => {
          const target = e.inputTarget as any;
          if (e.isDouble && target.isContentEditable) {
            // this.selectMenu("Text");
            const el = getContentElement(target);

            if (el) {
              el.focus();
            }
          } else {
            this.getSelecto().clickTarget(e.inputEvent, e.inputTarget);
            const id = e.target.getAttribute(SOLIDUI_ELEMENT_ID);
            if (id) {
              eventbus.emit("onSelectViewInViewport", { id });
            }
          }
        }}
        onClickGroup={(e) => {
          this.getSelecto().clickTarget(e.inputEvent, e.inputTarget);
        }}
        onBeforeRenderStart={moveableData.onBeforeRenderStart}
        onBeforeRenderGroupStart={moveableData.onBeforeRenderGroupStart}
        onRenderStart={(e) => {
          e.datas.prevData = moveableData.getFrame(e.target).get();
        }}
        onRender={(e) => {
          e.datas.isRender = true;
          // this.eventBus.requestTrigger("render");
        }}
        onRenderEnd={() => {
          // this.eventBus.requestTrigger("render");
          // if (!e.datas.isRender) {
          // 	return;
          // }
          // this.historyManager.addAction("render", {
          // 	id: getId(e.target),
          // 	prev: e.datas.prevData,
          // 	next: moveableData.getFrame(e.target).get(),
          // });
        }}
        onRenderGroupStart={(e) => {
          e.datas.prevDatas = e.targets.map((target) =>
            moveableData.getFrame(target).get()
          );
        }}
        onRenderGroup={() => {
          // this.eventBus.requestTrigger("renderGroup", e);
          // e.datas.isRender = true;
        }}
        onRenderGroupEnd={() => {
          // this.eventBus.requestTrigger("renderGroup", e);
          // if (!e.datas.isRender) {
          // 	return;
          // }
          // const prevDatas = e.datas.prevDatas;
          // const infos = e.targets.map((target, i) => {
          // 	return {
          // 		id: getId(target),
          // 		prev: prevDatas[i],
          // 		next: moveableData.getFrame(target).get(),
          // 	};
          // });
          // this.historyManager.addAction("renders", {
          // 	infos,
          // });
        }}
      />
    );
  }

  public renderViewportMoveable() {
    const { moveableData } = this;
    const viewport = this.getViewport();
    const target = viewport ? viewport.viewportRef.current! : null;

    return (
      <Moveable
        ref={this.moveable}
        rotatable
        target={target}
        origin={false}
        onRotateStart={moveableData.onRotateStart}
        onRotate={moveableData.onRotate}
      />
    );
  }

  public componentDidMount() {}

  public updateRect() {
    this.getMoveable().updateRect();
  }
}

export default MoveableManager;
