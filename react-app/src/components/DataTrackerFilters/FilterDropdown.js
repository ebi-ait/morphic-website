import React, { useEffect, useRef, useState } from "react";

import * as style from "./filter-dropdown.module.css";


export default function FilterDropdown({ label, studiesData, contentType, inputList, updateInputList }) {
    const [showList, setShowList] = useState(false);
    const [searchText, setSearchText] = useState("");

    const componentRef = useRef(null);

    const handleClickAway = (event) => {
        if (componentRef.current && !componentRef.current.contains(event.target)) {
            setSearchText("");
            setShowList(false);
        }
    }

    const handleSearch = (e) => {
        setSearchText(e.target.value.toLowerCase());
    }

    const handleBtn = () => {
        setShowList(!showList);
        setSearchText("");
    };

    const handleCheckBox = (input, event) => {
        event.stopPropagation();
        updateInputList(input);
    };

    // For a studies category, accumulate a count
    const aggregateStudiesByCategory = (studies, category) => {
        return studies.reduce((acc, study) => {
            if (study.content == null) {
                return acc;
            }
            const contentValue = category in study.content ? study.content[category] : "";

            const contentList = Array.isArray(contentValue) ? contentValue : [contentValue];

            contentList.forEach((contentItem) => {
                acc[contentItem] = (acc[contentItem] || 0) + 1;
            });
            return acc;
        }, {});
    };
    const categoryCounts = aggregateStudiesByCategory(studiesData, contentType);


    // Create a two lists of categories: checked categories and unchecked categories
    const categoriesNotSelected = Object.entries(categoryCounts).filter(
        ([category]) => !inputList.has(category) && category.toLowerCase().includes(searchText)
    );

    const categoriesSelected = Object.entries(categoryCounts).filter(
        ([category]) => inputList.has(category) && category.toLowerCase().includes(searchText)
    );

    const SearchIcon = () => {
        return (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.537 13.3474L11.2874 9.16111C11.9887 8.04422 12.3372 6.6874 12.1525 5.23958C11.7914 2.40598 9.36422 0.176336 6.47097 0.0108709C2.93104 -0.195961 -0.0041947 2.57558 4.49999e-06 6.0214C0.0042037 9.23143 2.67909 11.9327 5.93767 12.0195C7.04626 12.0485 8.09186 11.7837 8.99889 11.2997L13.3073 15.5439C13.9245 16.152 14.9198 16.152 15.537 15.5439C16.1543 14.9359 16.1543 13.9555 15.537 13.3474ZM6.10144 9.5665C4.10682 9.5665 2.49013 7.97389 2.49013 6.00899C2.49013 4.04409 4.10682 2.45149 6.10144 2.45149C8.09606 2.45149 9.71275 4.04409 9.71275 6.00899C9.71275 7.97389 8.09606 9.5665 6.10144 9.5665Z" fill="#999999" />
            </svg>
        );
    }

    useEffect(() => {
        document.addEventListener("click", handleClickAway);

        // After unmount, remove event listener
        return () => {
            document.removeEventListener("click", handleClickAway)
        }
    }, []);

    const CheckedCheckboxIcon = () => {
        return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <mask id="path-1-inside-1_1044_440" fill="white">
                    <rect width="24" height="24" rx="5" />
                </mask>
                <rect width="24" height="24" rx="5" fill="white" stroke="#1E1E1E" stroke-width="16" mask="url(#path-1-inside-1_1044_440)" />
            </svg>
        );
    };

    const CheckboxIcon = () => {
        return (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" y="0.5" width="23" height="23" rx="4.5" fill="white" stroke="#999999" />
            </svg>
        );
    };

    return (
        <div ref={componentRef} className={style.filter}>
            <button
                className={`${style.selectBtn} ${showList ? style.activeBtn : ""}`}
                onClick={handleBtn}
            >
                {label}
            </button>

            {showList && (
                <div className={style.card}>
                    <div className={style.cardHeader}>
                        <label className={`${style.searchBox} ${style.searchBoxLabel}`}>
                            <span className={style.searchIcon} aria-label="Search"><SearchIcon /></span>
                            <input
                                className={style.searchInput}
                                placeholder="Search"
                                onChange={handleSearch}
                            />
                        </label>
                    </div>

                    <div className={style.cardBody}>
                        <ul className={style.cardList}>

                            {categoriesSelected.map(([item, quantity]) => (
                                <li key={`selected_item_${item}`} className={style.cardListItem}>
                                    <button
                                        className={style.optionBtn}
                                        onClick={(e) => handleCheckBox(item, e)}
                                        role="checkbox"
                                    >
                                        <CheckedCheckboxIcon />
                                        <span className="">{item}</span>
                                        <span className={style.optionCount}>{quantity}</span>
                                    </button>
                                </li>
                            ))}

                            {categoriesNotSelected.map(([item, quantity]) => (
                                <li key={`unselected_item_${item}`} className={style.cardListItem}>
                                    <button
                                        className={style.optionBtn}
                                        onClick={(e) => handleCheckBox(item, e)}
                                        role="checkbox"
                                    >
                                        <CheckboxIcon />
                                        <span className="">{item}</span>
                                        <span className={style.optionCount}>{quantity}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
