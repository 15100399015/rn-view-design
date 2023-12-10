import React, { Fragment, ReactNode } from "react";
import { CustomImage } from "@/rnViews/CustomImage";
import { CustomImageBackground } from "@/rnViews/CustomImageBackground";
import { CustomText } from "@/rnViews/CustomText";
import { CustomTouchableView } from "@/rnViews/CustomTouchableView";
import { CustomView } from "@/rnViews/CustomView";

export function capitalizeFirstLetter(str: string) {
  return str.replace(/^([a-z])/g, (_, char) => char.toUpperCase());
}

export function toCamelCase(str: string) {
  return str.replace(/[-]([a-z])/g, (_, char) => char.toUpperCase());
}

export class Token {}

export enum NodeType {
  Document,
  Element,
  Text,
  Interp,
}

export class Node {
  meta?: {
    id: string;
    title: string;
  };
  readonly childNodes: (Text | Element | Interp)[] = [];
}

export class Document extends Node {
  readonly elementType = NodeType.Document;
  readonly isDocument = true;
  [Symbol.toStringTag]() {
    return `Document`;
  }
}

export class Element extends Node {
  readonly elementType = NodeType.Element;
  readonly name = "";
  readonly attributes = {};
  readonly bind = {};
  readonly event = {};
  constructor(token: Record<string, any>) {
    super();
    this.name = token.name;
    this.attributes = token.attributes;
    this.bind = token.bind;
    this.event = token.event;
  }
  [Symbol.toStringTag]() {
    return `Element<${this.name}>`;
  }
}

export class Text extends Node {
  elementType = NodeType.Text;
  public value: string = "";
  appendValue(val: string) {
    this.value += val;
  }
  constructor(value: string) {
    super();
    this.value = value || "";
  }
  [Symbol.toStringTag]() {
    return `Text<${this.value}>`;
  }
}

export class Interp extends Node {
  readonly elementType = NodeType.Interp;
  public value: string = "";
  appendValue(val: string) {
    this.value += val;
  }
  [Symbol.toStringTag]() {
    return `Interp`;
  }
}
// 组件 map
export class ComponentMap {
  private readonly map = new Map<string, React.ComponentType>();
  public register(name: string, element: React.ComponentType) {
    if (!this.map.has(name)) this.map.set(name.toLowerCase(), element);
  }
  public getComponent(name: string) {
    return this.map.get(name);
  }
  public hasComponent(name: string) {
    return this.map.has(name);
  }
}
export const componentMap = new ComponentMap();

componentMap.register("view", CustomView);
componentMap.register("text", CustomText);
componentMap.register("image", CustomImage);
componentMap.register("touchableView", CustomTouchableView);

const EmptyComponent = () => null;

export function generatorElementTreeByXmlAst(ast: Document) {
  if (ast.elementType !== NodeType.Document) return EmptyComponent;
  const RenderJsxXmlComponents = (props: any = {}) => {
    return React.createElement(
      Fragment,
      {},
      ...mapElement(ast.childNodes, props, 0)
    );
  };
  return RenderJsxXmlComponents;
}

function mapElement(
  children: (Text | Element | Interp)[] = [],
  props: any,
  index: number
): ReactNode[] {
  if (children.length === 0) return [];
  const elementList: ReactNode[] = [];
  for (let i = 0; i < children.length; i++) {
    const elementOption = children[i];
    if (elementOption.elementType === NodeType.Element) {
      const elementName = (elementOption as Element).name.toLowerCase();
      const elementAttributes = (elementOption as Element).attributes;
      const elementBind = (elementOption as Element).bind;
      const elementEvent = (elementOption as Element).event;
      const elementChildren = (elementOption as Element).childNodes;

      if (componentMap.hasComponent(elementName)) {
        const elementType = componentMap.getComponent(elementName)!;
        const element = React.createElement(
          elementType,
          {
            key: `el-${elementName}-${i}`,
            // @ts-ignore
            dataSet: {
              "element-id": `${elementOption.meta!.id}`,
            },
            ...disposeAttributes(elementAttributes),
            ...disposeBind(elementBind, props),
            ...disposeEvent(elementEvent, props),
          },
          ...mapElement(elementChildren, props, i)
        );
        elementList.push(element);
      } else {
        throw new Error("组件未注册");
      }
    }
    // text
    if (elementOption.elementType === NodeType.Text) {
      const content = (elementOption as Text).value.trim();
      if (content) {
        elementList.push(content);
      }
    }
    // 插值
    if (elementOption.elementType === NodeType.Interp) {
      const content = (elementOption as Interp).value.trim();
      if (content) {
        elementList.push(props[content]);
      }
    }
  }
  return elementList;
}

function disposeAttributes(attributes: Record<string, any>) {
  const attrs: Record<string, any> = {};
  Object.entries(attributes).forEach(([key, value]) => {
    if (Reflect.has(disposeAttributesMap, key)) {
      attrs[key] = disposeAttributesMap[key](value);
    } else {
      attrs[key] = value;
    }
  });
  return attrs;
}
function disposeBind(bind: Record<string, any>, props: any) {
  const bindAttrs: Record<string, any> = {};
  Object.entries(bind).forEach(([key, value]) => {
    bindAttrs[toCamelCase(key)] = props[value];
  });
  return bindAttrs;
}
function disposeEvent(bind: Record<string, any>, props: any) {
  const eventAttrs: Record<string, any> = {};
  Object.entries(bind).forEach(([key, value]) => {
    eventAttrs[`on${capitalizeFirstLetter(toCamelCase(key))}`] = props[value];
  });
  return eventAttrs;
}

const disposeAttributesMap: Record<string, Function> = {};
