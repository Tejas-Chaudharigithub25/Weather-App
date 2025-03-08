import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [inp, setInp] = useState();
  const [details, setDetails] = useState();
  const [wheather, setWheather] = useState(null);

  async function handleClick() {
    const name = inp;

    if (!name) return alert('Please Enter City');

    const nameurl = await fetch(`https://nominatim.openstreetmap.org/search?q=${name}&format=json&addressdetails=1`);
    const latlon = await nameurl.json();
    setDetails(latlon[0].display_name);
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latlon[0].lat}&longitude=${latlon[0].lon}&current=temperature_2m,wind_speed_10m,relative_humidity_2m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,relative_humidity_2m`;

    await fetch(url).then((item) => item.json()).then((data) => setWheather(data)).catch((error) => alert('Something went wrong. Try After Sometime.'));

  }

  function handleCL() {
    navigator.geolocation.getCurrentPosition(async (position) => {

      const lati = position.coords.latitude
      const lang = position.coords.longitude;
      document.getElementById('inputext').value = '';
      const nameurl = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lati}&lon=${lang}&format=json&addressdetails=1`);
      const latlon2 = await nameurl.json();

      setDetails(latlon2.display_name);

      const urli = `https://api.open-meteo.com/v1/forecast?latitude=${lati}&longitude=${lang}&current=temperature_2m,wind_speed_10m,relative_humidity_2m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,relative_humidity_2m`;
      await fetch(urli).then((item) => item.json()).then((data) => setWheather(data)).catch((error) => alert('Something went wrong. Try After Sometime.'));
    },
      (error) => {
        alert('Cant Get Location. Turn on Internet.');
      })

  }
  return (
    <>
      <div className="container ">
        <div className="row-12 justify-content-center align-item-center">
          <div className="col-md-10" style={{ 'width': '100%' }}>
            <div className="card shadow pt-4">
              <h2>🌄🌡☁️ Wheather App</h2>
              <div className="row d-flex justify-content-between my-2">
                <input type="text" id='inputext' onChange={(e) => setInp(e.target.value)} className='col-md-12 form-control my-2' placeholder='Enter City Name' />
                <button type='button' onClick={handleClick} className='col-md-5 btn btn-primary my-3'>Get Wheather</button>
                <button type='button' onClick={handleCL} className='col-md-6 btn btn-info my-3'>Get Current Location Wheather</button>
              </div>
              <div className="row d-flex justify-content-center mb-3">
                <p className='fw-bold fs-5 my-3'>{details && (details != undefined ? details : '')}</p>
              </div>
              <div className="row d-flex justify-content-between border-bottom border-top bg-success">
                <p className='col-md-5 mt-3 text-white'><span className='fw-bold'>🌞 Temprature: </span>{wheather && wheather.current.temperature_2m + wheather.current_units.temperature_2m}</p>
                <p className='col-md-5 mt-3 text-white'><span className='fw-bold'>🍃 Wind Speed: </span>{wheather && wheather.current.wind_speed_10m + wheather.current_units.wind_speed_10m}</p>
              </div>
              <div className="row d-flex justify-content-between mt-1 mb-0  py-2 bg-warning">
                <p className='col-md-12 mt-1 mb-0'><span className='fw-bold'>🌡️ Related Humidity: </span>{wheather && wheather.current.relative_humidity_2m + wheather.current_units.relative_humidity_2m}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row justify-content-center fixed-bottom">
        <footer class="border-top py-2">
          Made By @Tejas Chaudhari.
        </footer>
      </div>
    </>
  )
}

export default App