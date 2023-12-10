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

import { SOLIDUI_ELEMENT_ID } from "./const";
import { ElementInfo } from "./types";

export const PREFIX = "visual-";

export function prefixNames(pPrefix: string, ...classNames: string[]) {
  return classNames
    .map((className) =>
      className
        .split(" ")
        .map((name) => (name ? `${pPrefix}${name}` : ""))
        .join(" ")
    )
    .join(" ");
}

export function prefix(...classNames: string[]) {
  return prefixNames(PREFIX, ...classNames);
}

export function getId(el: HTMLElement | SVGElement) {
  return el.getAttribute(SOLIDUI_ELEMENT_ID) || "";
}

export function updateElements(
  info: ElementInfo,
  callBack: (id: string, el: HTMLElement) => void
) {
  const targets = document.querySelectorAll<HTMLElement>(
    `.editor-viewport [${SOLIDUI_ELEMENT_ID}]`
  )!;
  for (const target of targets) {
    const id = target.getAttribute(SOLIDUI_ELEMENT_ID) as string;
    callBack(id, target);
  }
  return { ...info };
}
