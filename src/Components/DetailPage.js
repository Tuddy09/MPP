// DetailPage.js
import React, {useContext, useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import UserContext from "./UserContext";
import CarContext from "./CarContext";


function DetailPage() {
    const navigate = useNavigate();
    const {id} = useParams();
    const [entity, setEntity] = useState(null);
    const {user} = useContext(UserContext);
    const {setData} = useContext(CarContext);

    useEffect(() => {
        fetch(`http://localhost:8080/car/getCar?id=${id}`)
            .then(response => response.json())
            .then(data => setEntity(data));
    }, [id]);

    if (!entity) return <div>Entity not found</div>;

    function handleRemoveCar() {
        fetch(`http://localhost:8080/user/removeCarFromUser?userId=${user.id}&carId=${id}`, {
            method: 'DELETE'
        })
            .then(() => setData(data => data.filter(car => car.id !== id)))
            .then(() => navigate('/'));

    }

    function handleUpdateCar() {
        const form = document.querySelector('form');
        const formData = new FormData(form);
        // Create a new object from the form data
        const updatedCar = Object.fromEntries(formData);
        updatedCar.id = id;
        fetch(`http://localhost:8080/car/updateCar?id=${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedCar)
        }).then(() => navigate('/'));
    }

    return (
        <div className='masterLayout'>
            <h1>Car Details</h1>
            <form>
                <label>Name:</label>
                <input type='text' name='name' defaultValue={entity.name}/>
                <label>Type:</label>
                <input type='text' name='type' defaultValue={entity.type}/>
                <label>Description:</label>
                <input type='text' name='description' defaultValue={entity.description}/>
                <button type='button' onClick={handleUpdateCar}>Update</button>
            </form>
            <button onClick={handleRemoveCar}>Remove</button>
        </div>
    );
}

export default DetailPage;
