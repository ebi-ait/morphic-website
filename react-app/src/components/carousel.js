import React, { useEffect, useState } from "react"

export default function Carousel() {
    const items = [
        {
            participant: "Fred Hutchinson Cancer Center",
            logo: "logo-fred-hutch"
        },
        {
            participant: "The Jackson Laboratory",
            logo: "logo-jackson"
        },
        {
            participant: "Memorial Sloan Kettering Cancer Center",
            logo: "logo-msk"
        },
        {
            participant: "Northwestern University",
            logo: "logo-northwestern"
        },
        {
            participant: "Stanford University",
            logo: "logo-stanford"
        },{
            participant: "University of California San Francisco",
            logo: "logo-ucsf"
        },
        {
            participant: "University of Washington",
            logo: "logo-uw"
        },
    ];

    const totalItems = items.length;
    const [itemNumber, setItemNumber] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setItemNumber((itemNumber) => (itemNumber + 1) % totalItems);
        }, 5000);
        return () => clearInterval(interval);
    }, [itemNumber]);

    function handleItem0() {
        setItemNumber(0);
    }
    function handleItem1() {
        setItemNumber(1);
    }
    function handleItem2() {
        setItemNumber(2);
    }
    function handleItem3() {
        setItemNumber(3);
    }
    function handleItem4() {
        setItemNumber(4);
    }
    function handleItem5() {
        setItemNumber(5);
    }
    function handleItem6() {
        setItemNumber(6);
    }

    return (
        <div className="carousel-container">
            <span aria-hidden className={"home-card-logo " + items[itemNumber].logo}></span>
            <p className="home-card-text">
                {items[itemNumber].participant}
            </p>
            <ul className="home-card-nav">
                <li className="home-card-nav-item">
                    <div
                        className={(itemNumber === 0 ? "home-card-dot home-card-dot-active" : "home-card-dot")}
                        onClick={handleItem0} 
                        aria-label={items[0].participant}
                    ></div>
                </li>
                <li className="home-card-nav-item">
                    <div
                        className={(itemNumber === 1 ? "home-card-dot home-card-dot-active" : "home-card-dot")}
                        onClick={handleItem1} 
                        aria-label={items[1].participant}
                    ></div>
                </li>
                <li className="home-card-nav-item">
                    <div
                        className={(itemNumber === 2 ? "home-card-dot home-card-dot-active" : "home-card-dot")}
                        onClick={handleItem2} 
                        aria-label={items[2].participant}
                    ></div>
                </li>
                <li className="home-card-nav-item">
                    <div
                        className={(itemNumber === 3 ? "home-card-dot home-card-dot-active" : "home-card-dot")}
                        onClick={handleItem3} 
                        aria-label={items[3].participant}
                    ></div>
                </li>
                <li className="home-card-nav-item">
                    <div
                        className={(itemNumber === 4 ? "home-card-dot home-card-dot-active" : "home-card-dot")}
                        onClick={handleItem4} 
                        aria-label={items[4].participant}
                    ></div>
                </li>
                <li className="home-card-nav-item">
                    <div
                        className={(itemNumber === 5 ? "home-card-dot home-card-dot-active" : "home-card-dot")}
                        onClick={handleItem5} 
                        aria-label={items[5].participant}
                    ></div>
                </li>
                <li className="home-card-nav-item">
                    <div
                        className={(itemNumber === 6 ? "home-card-dot home-card-dot-active" : "home-card-dot")}
                        onClick={handleItem6} 
                        aria-label={items[6].participant}
                    ></div>
                </li>
            </ul>
        </div>
    )
}
