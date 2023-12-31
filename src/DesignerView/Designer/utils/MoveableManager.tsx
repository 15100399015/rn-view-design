import * as React from "react";
import Moveable from "react-moveable";
import { EditorInterface } from "./types";
import { connectEditorContext } from "../DesignerContext";
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
        draggable={false}
        // Resize
        resizable={false}
        // Rotate
        rotatable={false}
        onBeforeRenderStart={moveableData.onBeforeRenderStart}
        onBeforeRenderGroupStart={moveableData.onBeforeRenderGroupStart}
        onRenderStart={(e) => {
          e.datas.prevData = moveableData.getFrame(e.target).get();
        }}
        onRender={(e) => {
          e.datas.isRender = true;
        }}
        onRenderEnd={() => {}}
        onRenderGroupStart={(e) => {
          e.datas.prevDatas = e.targets.map((target) =>
            moveableData.getFrame(target).get()
          );
        }}
        onRenderGroup={() => {}}
        onRenderGroupEnd={() => {}}
      />
    );
  }
}

export default MoveableManager;
