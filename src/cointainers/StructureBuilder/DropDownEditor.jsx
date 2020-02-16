import React from "react";
import "./styles.scss";
import { useState } from "react";

export const DropDownEditor = ({ params = {}, onChange = () => {} }) => {
  const { title = "", name="", values = [""] } = params;

  const [value, setValue] = useState('');

  const setTitle = e => {
    onChange({ ...params, title: e.target.value });
  };

  const setName = e => {
    onChange({ ...params, name: e.target.value });
  };

  const addValue = () => {
    onChange({ ...params, values: [...values, value] });
    setValue('');
  }

  const onDelete = (value) => {
    onChange({ ...params, values: values.filter(v => v !== value) });
  }

  return (
    <div className="dde__wrapper">
      <input placeholder="title" value={title} onChange={setTitle} />
      <br />
      <input placeholder="name" value={name} onChange={setName} />
      <br />
      <input placeholder="add value" onKeyPress={(e) => e.charCode===13 ? addValue():null }value={value} onChange={(e) => setValue(e.target.value)}/>{" "}
      <span className="builder__del-category" onClick={addValue}>+</span>
      <ol>
        {values.map((v, i) => <li key={i}>{v} <span
              className="builder__del-category builder__del-category"
              onClick={() => onDelete(v)}
            >
              {"\u2A2F"}
            </span></li>) }
      </ol>
    </div>
  );
};
