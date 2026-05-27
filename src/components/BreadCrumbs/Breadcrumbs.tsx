import "./BreadCrumbs.css"
import React from "react";
import { Link } from "react-router-dom";
import type { FC } from "react";

interface ICrumb {
  label: string;
  path?: string;
}

interface BreadCrumbsProps {
  crumbs: ICrumb[];
}

export const BreadCrumbs: FC<BreadCrumbsProps> = (props) => {
  const { crumbs } = props;

  return (
    <ul className="breadcrumbs">
      {!!crumbs.length &&
        crumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            {index !== 0 && <li className="slash">/</li>}
            {index === crumbs.length - 1 ? (
              <li>{crumb.label}</li>
            ) : (
              <li>
                <Link to={crumb.path || ""}>{crumb.label}</Link>
              </li>
            )}
            
          </React.Fragment>
        ))}
    </ul>
  );
};

/*<li>
        <Link to={ROUTES.HOME}>Главная</Link>
      </li> */