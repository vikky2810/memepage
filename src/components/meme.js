import React from 'react';
import styled from 'styled-components';

const MemeContainer = styled.div`
  border: 1px solid #ddd;
  padding: 10px;
  margin: 10px;
  width: 300px;
  text-align: center;
`;

const MemeImage = styled.img`
  max-width: 100%;
  height: auto;
`;

const Meme = ({ title, imageUrl }) => {
  return (
    <MemeContainer>
      <h2>{title}</h2>
      <MemeImage src={imageUrl} alt={title} />
    </MemeContainer>
  );
};

export default Meme;