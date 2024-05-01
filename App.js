import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { firestore } from "./firebase.js";
import { addDoc, collection, deleteDoc, getDocs } from "firebase/firestore";
import { doc } from "firebase/firestore";
import './App.css';

const defaultMapOptions = {
  fullscreenControl: false,
  streetViewControl: false,
};

function Home() {
  const bangalore = { lat: 12.97, lng: 77.59 };
  const [markers, setMarkers] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [mapCenter, setMapCenter] = useState(bangalore);

  useEffect(() => {
    const fetchMarkers = async () => {
      const querySnapshot = await getDocs(collection(firestore, "markers"));
      const markersData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setMarkers(markersData);
    };

    fetchMarkers();
  }, []);

  const addMarker = (location) => {
    const newMarker = {
      id: Date.now().toString(), 
      position: { lat: location.lat(), lng: location.lng() },
      label: (markers.length + 1).toString(),
      name: `Marker ${markers.length + 1}`,
      time: new Date().toLocaleString(),
    };
    setMarkers([...markers, newMarker]);
    setSelectedMarker(newMarker);
  };

  const removeMarker = async (id) => {
    try {
      await deleteDoc(doc(firestore, "markers", id));
      const newMarkers = markers.filter((marker) => marker.id !== id);
      setMarkers(newMarkers);
      setSelectedMarker(null);
    } catch (error) {
      console.error("Помилка при видаленні мітки:", error);
    }
  };

  const removeAllMarkers = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "markers"));
      const deletePromises = [];
      querySnapshot.forEach((doc) => {
        deletePromises.push(deleteDoc(doc.ref));
      });
      await Promise.all(deletePromises);
      setMarkers([]);
      setSelectedMarker(null);
    } catch (error) {
      console.error("Помилка при видаленні всіх міток:", error);
    }
  };

  const handleClickMarker = (marker) => {
    setSelectedMarker(marker);
  };

  const handleSave = async () => {
    try {
      markers.forEach(async (marker) => {
        await addDoc(collection(firestore, "markers"), marker);
      });
    } catch (error) {
      console.error("Помилка при додаванні мітки:", error);
    }
  };

  const updateMarkerPosition = (index, newPosition) => {
    const newMarkers = markers.map((marker, i) =>
      i === index ? { ...marker, position: newPosition } : marker
    );
    setMarkers(newMarkers);
    setMapCenter(newPosition);
  };

  return (
    <div>
      <LoadScript googleMapsApiKey="AIzaSyBKGnCz1laqksvyatx2El1-TJACQxkBYsE">
        <GoogleMap
          mapContainerStyle={{ height: "400px", width: "100%" }}
          zoom={12}
          center={mapCenter}
          options={defaultMapOptions}
          onClick={(event) => addMarker(event.latLng)}
        >
          {markers.map((marker, index) => (
            <Marker
              key={marker.id}
              position={marker.position}
              label={marker.label}
              draggable={true}
              onDragEnd={(e) => updateMarkerPosition(index, e.latLng.toJSON())}
              onClick={() => handleClickMarker(marker)}
            />
          ))}
        </GoogleMap>
      </LoadScript>
      <div className='buttons'>
        <div> 
          <button onClick={handleSave}>Save all markers</button>
          <button className="delite" onClick={removeAllMarkers}>Delete all</button>
        </div>
        <h3>List of all markers:</h3>
        <ul>
          {markers.map((marker) => (
            <li key={marker.id}>
              <strong>{marker.name}</strong>: ({marker.position.lat}, {marker.position.lng}) created at {marker.time}
              <button className="delite" onClick={() => removeMarker(marker.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;
