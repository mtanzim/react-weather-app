import React from 'react';

// note the conditions checking for improved display
// this can be improved further
const WeatherCards = ({id, title, data}) => {

  let lineId = -1;

  return (
    <div className="col-4">
      <div className="card mb-4 mt-4" >
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <ul>
          {
            Boolean (typeof data === "object") ? (Object.keys(data).map(element => {
            lineId ++;
            if (typeof data[element] !== "object"){
              return (
                <li key={lineId} id={lineId}>{`${element}: ${data[element]}`}</li>
              )
            } else {
              console.error('Please update the parser for:');
              console.error(JSON.stringify(data[element]));
              return(<li>Error on {element}</li>);
            }
          })) :  (<li>{data}</li>) }
          </ul>
        </div>
      </div>
    </div>
  )
}

export default WeatherCards;