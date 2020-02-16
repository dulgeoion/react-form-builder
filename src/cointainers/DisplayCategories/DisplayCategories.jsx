import React, { useEffect } from "react";
import "./styles.scss";
import { useState } from "react";
import { unflutten } from "../../utils/unflutten";

const Title = props => {
  switch (props.depth) {
    case 0: {
      return <h1>{props.children}</h1>;
    }
    case 1: {
      return <h2>{props.children}</h2>;
    }
    case 2: {
      return <h3>{props.children}</h3>;
    }
    default: {
      return <h4>{props.children}</h4>;
    }
  }
};

export const DisplayCategories = () => {
  const [tree, setTree] = useState([]);
  const [values, setValues] = useState({});
  const [words, setWords] = useState([]);

  useEffect(() => {
    let _layers = JSON.parse(localStorage.getItem("layers"));
    setTree(unflutten(_layers));
  }, []);


  const addWord = () => {
    let _layers = JSON.parse(localStorage.getItem("layers"));
    const newWords = [...words];

    const newValues = { ...values };
    let newWord = [..._layers].map(l => {
      if (newValues[l.name]) {
        l.value = newValues[l.name];
      }
      return l;
    });

    setWords([...newWords, unflutten(newWord)[0]]);
  };

  const displayItem = (item, depth) => {
    switch (item.type) {
      case "category": {
        return (
          <div key={item.id}>
            <Title depth={depth}>{item.title}</Title>
            <hr />
            {item.children.map(i => displayItem(i, depth + 1))}
          </div>
        );
      }
      case "input": {
        return (
          <div key={item.id}>
            <label htmlFor={item.id}>{item.title}</label>
            <br />
            <input
              id={item.id}
              name={item.name}
              value={values[item.name]}
              onChange={e =>
                setValues({ ...values, [item.name]: e.target.value })
              }
            />
          </div>
        );
      }
      case "selector": {
        return (
          <div key={item.id}>
            {item.title}
            <br />
            <select
              placeholder={item.title}
              name={item.name}
              defaultValue={item.values[0]}
              value={values[item.name]}
              onChange={e =>
                setValues({ ...values, [item.name]: e.target.value })
              }
            >
              {item.values.map((v, i) => (
                <option key={i} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        );
      }
      default:
        return <span />;
    }
  };

  const displayWord = (w, depth) => {
    switch (w.type) {
      case "category":
        return (
          <div key={w.id}>
            <Title depth={depth}>{w.title}</Title>
            {w.children.map(i => displayWord(i, depth + 1))}
          </div>
        );
      default:
        return (
          <div key={w.id}>
            <span className="right__w--key">{w.title}:</span>
            <span className="right__w--value">{w.value}</span>
          </div>
        );
    }
  };

  return (
    <div className="display">
      <div className="left">
        {tree[0] && displayItem(tree[0], 0)}
        <button className="display__btn" onClick={addWord}>
          Add word
        </button>
      </div>
      <div className="right">
        {words.map((w, i) => (
          <span key={i}>
            {displayWord(w, 0)} <hr />
          </span>
        ))}
      </div>
    </div>
  );
};
