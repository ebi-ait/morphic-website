import React from "react"

import * as style from "./filter-tags.module.css";

export default function FilterTags({ tags, updateTags }) {

  const tagList = Array.from(tags);

  const XCircleIcon = () => {
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.2384 1.76045C7.89485 -0.584942 4.0946 -0.586817 1.75483 1.75483C-0.586817 4.09648 -0.584942 7.89485 1.76045 10.2402C4.10585 12.5838 7.90423 12.5875 10.2459 10.2459C12.5875 7.90423 12.5838 4.10585 10.2402 1.76233L10.2384 1.76045ZM7.72425 9.04974L6.26564 7.59113C6.1194 7.4449 5.8813 7.4449 5.73506 7.59113L4.28208 9.04412C4.13585 9.19035 3.89774 9.19035 3.75151 9.04412L2.95471 8.24732C2.80848 8.10108 2.80848 7.86298 2.95471 7.71675L4.40769 6.26376C4.55393 6.11753 4.55393 5.87943 4.40769 5.73319L2.94909 4.27458C2.80285 4.12835 2.80285 3.89025 2.94909 3.74401L3.74588 2.94721C3.89212 2.80098 4.13022 2.80098 4.27646 2.94721L5.73506 4.40582C5.8813 4.55206 6.1194 4.55206 6.26564 4.40582L7.71862 2.95284C7.86486 2.8066 8.10296 2.8066 8.24919 2.95284L9.04599 3.74963C9.19223 3.89587 9.19223 4.13397 9.04599 4.28021L7.59301 5.73319C7.44677 5.87943 7.44677 6.11753 7.59301 6.26376L9.05162 7.72237C9.19785 7.86861 9.19785 8.10671 9.05162 8.25294L8.25482 9.04974C8.10858 9.19598 7.87048 9.19598 7.72425 9.04974Z" fill="white" />
      </svg>

    );
  };

  return (
    <div className={style.tagsWrap} role="listbox" aria-labelledby="filter">
      {tagList.map((tag, index) =>
      (
        <>
          <div key={`tag_item_${index}`} className={style.filterTag} role="option" onClick={() => updateTags(tag)}>
            <span>{tag}</span>
            <div className={style.filterTagIcon}>
              <XCircleIcon />
            </div>
          </div>
          <br></br>
        </>
      )
      )}
    </div>
  )
}
