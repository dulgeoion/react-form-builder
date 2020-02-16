import React from "react";
import { a } from 'react-router-dom'
import "./style.scss";
import { useIntl } from "react-intl";
import { useUser } from '../../context';

export const Header = ({ isLoggedIn= false }) => {
  const { formatMessage } = useIntl();
  const { setUserLocale } = useUser();

  const onSelect = (e) => {
    setUserLocale(e.target.value)
  }

  return (
    <div className="header">
      <h1>{formatMessage({ id: "title" })}</h1>
      <select onChange={onSelect}>
        <option value="uk">Українська</option>
        <option value="hu">Magyar</option>
      </select>
      <div className="header__navbar" >
        {
          isLoggedIn && (
            <>
            <a href='/' className="header__navbar-item">Info</a>
            <a href='/builder' className="header__navbar-item">Structure Builder</a>
            <a href='/display' className="header__navbar-item">Test Drive</a>
            </>
          )
        }
        {
          !isLoggedIn && (
            <>
            <a href='/' className="header__navbar-item">Login</a>
            </>
          )
        }

      </div>
    </div>
  );
};
