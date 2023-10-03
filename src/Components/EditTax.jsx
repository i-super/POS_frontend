import React from 'react'
import { StoreContext } from './StoreContext';
import { useContext } from 'react';
import { api } from '../Services/api-service';
import { useState } from 'react';
import { Modal } from 'react-bootstrap';

const EditTax = (props) => {
    const { selectedStore, setSelectedStore } = useContext(StoreContext);
    const [tax, setTax] = useState("")

    const handleDefaultTax = async () => {
        const response = await api.put(`default-tax/${selectedStore.value}`, {
            defaultTax: tax
        })
        if (response.ok) {
            setSelectedStore({ ...selectedStore, defaultTax: tax });
            props.handleClose("tax")
        }
    }

    return (
        <Modal {...props} animation={true}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Tax</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <label className="form-label">Edit Tax</label>
                    <input
                        type="number"
                        className="form-control"
                        min={0}
                        value={tax}
                        onChange={(e) => {
                            setTax(e.target.value);
                        }}
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button onClick={props.handleClose} className="btn btn-danger">
                    Close
                </button>
                <button
                    onClick={() => {
                        handleDefaultTax()
                    }}
                    className="btn btn-primary">
                    Update Tax
                </button>
            </Modal.Footer>
        </Modal>
    )
}

export default EditTax