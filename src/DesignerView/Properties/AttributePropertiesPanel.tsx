import React, { useEffect, useMemo, useState } from "react";
import { useMemoizedFn } from "ahooks";
import { LeftRightExpander } from "@/components";
import { eventbus, mm } from "@/DesignerView/utils";
import { SolidViewDataType } from "@/DesignerView/types";
import { isNull, set, unset } from "lodash-es";
import { Button, Form, Input, Modal, Select, message } from "antd";

export default function StyleProperties() {
  const [currentViewTiem, setCurrentViewItem] = useState<SolidViewDataType>();

  const handleSelectViewEvent = useMemoizedFn((e) => {
    const view = mm.getCurrentView();
    if (view) {
      setCurrentViewItem(view);
    }
  });

  useEffect(() => {
    eventbus.on("onSelectViewInViewList", handleSelectViewEvent);
    eventbus.on("onSelectViewInViewport", handleSelectViewEvent);

    return () => {
      eventbus.off("onSelectViewInViewList", handleSelectViewEvent);
      eventbus.off("onSelectViewInViewport", handleSelectViewEvent);
    };
  }, [handleSelectViewEvent]);
  if (!currentViewTiem) return null;
  return (
    <>
      <LeftRightExpander expanded showCheckbox={false} title="Styles">
        <StylePropertiesPanel
          view={currentViewTiem}
          propertie={"style"}
          value={currentViewTiem?.attributes?.style}
        ></StylePropertiesPanel>
        
      </LeftRightExpander>
    </>
  );
}

interface IStylePropertiesPanelProps {
  view: SolidViewDataType;
  propertie: string;
  value: any;
}

const StylePropertiesPanel = (props: IStylePropertiesPanelProps) => {
  const styles = props.value || {};

  const [form] = Form.useForm();
  useEffect(() => {
    form.setFieldsValue(styles);
  }, [props.value]);

  const list = useMemo(() => {
    return Object.entries(styles);
  }, [styles]);

  function handleDelete(key: string) {
    unset(styles, key);
    mm.updateView();
  }
  function handleUpdateValue(key: string) {
    const value = form.getFieldValue(key);
    message.info(value);

    set(styles, key, Number(value));
    mm.updateView();
  }
  function addProperties() {
    Modal.confirm({
      title: "Are you sure delete this task?",
      content: (
        <div style={{ display: "flex" }}>
          <Select
            size="small"
            style={{ width: "100%" }}
            options={[
              {
                label: "width",
                value: "height",
              },
            ]}
          ></Select>
          <Input size="small"></Input>
        </div>
      ),
      icon: null,
      okText: "Yes",
      cancelText: "No",
      onOk() {
        console.log("OK");
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  }
  return (
    <div style={{ width: "100%", padding: "0 15px" }}>
      <Form
        form={form}
        name="styles"
        labelAlign="left"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        size="small"
      >
        {list.map(([key]) => {
          return (
            <div>
              <Form.Item
                key={key}
                style={{ marginBottom: 2 }}
                label={key}
                name={key}
              >
                <Input
                  onBlur={() => handleUpdateValue(key)}
                  addonAfter={
                    <div
                      onClick={() => handleDelete(key)}
                      style={{ cursor: "pointer" }}
                    >
                      -
                    </div>
                  }
                />
              </Form.Item>
            </div>
          );
        })}
      </Form>
      <Button
        size="small"
        onClick={addProperties}
        style={{ width: "100%" }}
        type="primary"
      >
        add
      </Button>
    </div>
  );
};
