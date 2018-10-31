import React from 'react';

const StateHistory = ({ curState, revertAction, data }) => {

  return (
    <ul>
      <div className="row">
        <div className='col-3'><button onClick={revertAction(curState)} className="btn-primary">{curState}</button></div>
        <div className='col-9'>{JSON.stringify(data)}</div>
      </div>
    </ul>
  )
}

export default StateHistory;