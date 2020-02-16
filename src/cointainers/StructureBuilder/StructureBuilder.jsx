import React, { useState } from "react";
import { Input } from "../../components/Input";
import "./styles.scss";
import { useReducer } from "react";
import { unflutten } from "../../utils/unflutten";
import { useEffect } from "react";
import { DropDownEditor } from "./DropDownEditor";

const elements = ["category", "input", "selector"];

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_LAYER": {
      return [
        ...state,
        {
          id: action.payload.id,
          parent: action.payload.parent,
          type: action.payload.type,
          title: action.payload.title,
          values: action.payload.values,
          name: action.payload.name
        }
      ];
    }
    case "REMOVE_LAYER": {
      return state.filter(i => i.id !== action.payload.id);
    }
    default:
      return state;
  }
};

export const StructureBuilder = () => {
  const [selected, select] = useState("");
  const [metadata, setMetadata] = useState("");
  const [counter, setCounter] = useState(4);
  const [layers, dispatch] = useReducer(reducer, [
    { id: 0, parent: null, type: "category", title: "Опис" },
    { id: 1, parent: 0, type: "category", title: "Мовна класифікація" },
    { id: 2, parent: 0, type: "category", title: "Діалектичні штучки" },
    { id: 3, parent: 1, type: "selector", name: "lang_type", values:['Іменник', "Дієслово"], title: "Частина мови" },
    { id: 4, parent: 2, type: "input", name: "source", title: "Джерело" },
  ]);
  const [tree, setTree] = useState([]);
  const [selectedItem, selectItem] = useState({});

  useEffect(() => {
    setTree(unflutten(layers));
    localStorage.setItem('layers', JSON.stringify(layers));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layers]);

  useEffect(() => {
    select("category");
    selectItem(layers[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
    }
  }, []);
  const onSelect = e => {
    select(e);
    switch (e) {
      case "selector":
        setMetadata({title: '', values: []})
        break;
      default:
        setMetadata("");
    }
  };

  const addLayer = () => {
    console.log(tree);

    dispatch({
      type: "ADD_LAYER",
      payload: {
        id: counter + 1,
        parent: selectedItem.id,
        type: selected,
        title: metadata.title ? metadata.title : metadata,
        values: metadata.values || []
      }
    });
    setCounter(counter + 1);
  };

  const selectLayer = item => {
    selectItem(item);
  };

  const onDelete = item => {
    console.log("TCL: StructureBuilder -> item", item);
    dispatch({
      type: "REMOVE_LAYER",
      payload: {
        id: item.id
      }
    });
  };

  const renderKeys = () => {
    switch (selected) {
      case "selector":
        return <DropDownEditor params={metadata} onChange={setMetadata} />;

      default:
        return (
          <>
          <input
          placeholder="name"
          value={metadata.name}
          onChange={e => setMetadata({ ...metadata, name: e.target.value })}
          />
          <input
            placeholder="title"
            value={metadata.title}
            onChange={e => setMetadata({ ...metadata, title: e.target.value })}
          />
          </>
        );
    }
  };

  const renderChild = item => {
    switch (item && item.type) {
      case "category":
        return (
          <div
            key={item.id}
            className={
              "builder__category " +
              (selectedItem.id === item.id ? "builder__category--selected" : "")
            }
          >
            <div className="builder__title">
              {item.title}{" "}
              <input
                type="checkbox"
                readOnly
                checked={selectedItem.id === item.id}
                onClick={() => selectLayer(item)}
              />
            </div>
            <div className="builder__children">
              {item.children && item.children.map(i => renderChild(i))}
            </div>
            <span
              className="builder__del-category builder__del-category--absolute"
              onClick={() => onDelete(item)}
            >
              {"\u2A2F"}
            </span>
          </div>
        );
      case "input":
        return (
          <div key={item.id}>
            <label htmlFor={item.id}>{item.title}</label>
            <br />
            <input type="text" id={item.id} name={item.name} />{" "}
            <span
              className="builder__del-category"
              onClick={() => onDelete(item)}
            >
              {"\u2A2F"}
            </span>{" "}
          </div>
        );
      case "selector":
        return (
          <div key={item.id}>
            {item.title}<br/>
          <select placeholder={item.title}>
            {item.values.map((v, i) => (
              <option key={i} value={i}>
                {v}
              </option>
            ))}
          </select>
          </div>
        );
      default:
        return "";
    }
  };

  return (
    <div className="builder">
      <div className="builder__element-selector">
        {elements.map((e, i) => (
          <div className="builder__checkbox-item" key={i}>
            <input
              type="checkbox"
              readOnly
              id="box"
              checked={selected === e}
              onClick={() => onSelect(e)}
            />
            <label htmlFor="box">{e}</label>
          </div>
        ))}

        <button className="builder__btn" onClick={addLayer}>
          +
        </button>
      </div>
      <div className="builder__element-selector">{renderKeys()}</div>
      <div className="builder__display">{renderChild(tree[0])}</div>
    </div>
  );
};
