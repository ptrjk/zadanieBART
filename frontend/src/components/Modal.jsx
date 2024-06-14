import React, { useState } from "react";
import "./Modal.css";

export default function Modal({ active, func, error }) {

    let content;
    if (!error) {
        content =
            <>
                <h2>Uspesna Objednavka</h2>
                <p>
                    Dakujeme Vam za Vasu objednavku.
                </p>
            </>;
    } else {
        content = <>
            <h2>Chybna objednavka</h2>
            <p>
                {error}
            </p>
        </>;
    }

    return (
        <>
            {/* <button onClick={toggleModal} className="btn-modal">
                Open
            </button> */}

            {active && (
                < div className="modal">
                    <div onClick={func} className="overlay"></div>
                    <div className="modal-content">
                        {content}
                    </div>
                </div >
            )
            }
        </>
    );
}