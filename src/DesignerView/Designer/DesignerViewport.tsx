import React from "react";
import { IObject } from "@daybrush/utils";
import { connectEditorContext } from "./DesignerContext";
import {
  SolidViewJSXElement,
  ElementInfo,
  EditorInterface,
} from "./utils/types";

import { updateElements } from "./utils";

interface SolidViewport extends EditorInterface {}

@connectEditorContext
class SolidViewport extends React.PureComponent<{
  children: any;
  style: IObject<any>;
  onBlur: (e: any) => any;
}> {
  public viewport: ElementInfo | null = null;

  public ids: Record<string, { el: HTMLElement }> = {};

  public viewportRef = React.createRef<HTMLDivElement>();

  public makeId(ids: Record<string, any> = this.ids) {
    for (;;) {
      const id = `visual${Math.floor(Math.random() * 100000000)}`;
      if (ids[id]) {
        continue;
      }
      return id;
    }
  }

  public getRootView() {
    return this.viewport;
  }

  public getInfo(id: string) {
    return this.ids[id];
  }

  public setInfo(id: string, info: { el: HTMLElement }) {
    const { ids } = this;
    ids[id] = info;
  }

  public getElements(ids: string[]): Array<HTMLElement | SVGElement> {
    return ids.map((id) => this.getElement(id)).filter((el) => el) as Array<
      HTMLElement | SVGElement
    >;
  }

  public getElement(id: string): HTMLElement | SVGElement | undefined {
    const info = this.getInfo(id);
    return info && info.el;
  }

  public setRootView(info: ElementInfo): Promise<any> {
    this.viewport = info;
    return new Promise((resolve) => {
      this.forceUpdate(() => {
        updateElements(info, (id, element) => {
          this.setInfo(id, { el: element });
        });
        resolve(void 0);
      });
    });
  }

  public clear() {
    this.ids = {};
    this.viewport = null
  }

  public render() {
    const { style } = this.props;
    return (
      <div
        className="editor-viewport-container"
        onBlur={this.props.onBlur}
        style={style}
      >
        {this.props.children}
        <div className="editor-viewport" ref={this.viewportRef}>
          {this.__renderRootView(this.getRootView())}
        </div>
      </div>
    );
  }

  private __renderRootView(info: ElementInfo | null): SolidViewJSXElement {
    if (!info) return React.createElement("div");
    const { jsx } = info;
    const id = info.id!;
    const props: IObject<any> = { key: id };

    return React.cloneElement(jsx, {
      ...jsx.props,
      ...props,
    }) as SolidViewJSXElement;
  }
}

export default SolidViewport;
