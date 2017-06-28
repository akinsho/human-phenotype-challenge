import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Active = styled.div`
  width: 20em;
  height: 12em;
  background-color: whitesmoke;
  position: absolute;
  bottom: 20px;
  left: 1em;
  box-shadow: -1px 1.8px 0 rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5em;
`;

export const ActiveTitle = styled.h2`
  margin: 0;
  width: 100%;
  color: white;
  background-color:#42A5F5;
  text-align: center;
`;

export const ActiveBody = styled.p`
  height: 80%;
  overflow: scroll;
`;

export const Button = styled.button`
  border: none;
  margin: 0.4em;
  font-size: 1.4em;
  width: 8em;
  color: white;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
  background-color:#2196F3;
`;
