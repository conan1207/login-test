import React from 'react';
import axios from 'axios';

function LandingPage(props) {
  const onClickHandler = () => {
    axios.get('/api/users/logout').then((response) => {
      if (response.data.success) {
        props.history.push('./login');
      } else {
        alert('로그아웃 실패...');
      }
    });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh' }}>
      <p>시작 페이지</p>
      <button onClick={onClickHandler}>logout</button>
    </div>
  );
}

export default LandingPage;
