import React from 'react';
import styled from 'styled-components';
import { FaDesktop } from 'react-icons/fa';

interface BuildCardProps {
  title: string;
  onClick: () => void;
}

const BuildCard: React.FC<BuildCardProps> = ({ title, onClick }) => {
  return (
    <StyledWrapper>
      <div className="card" onClick={onClick}>
        <div className="card-details">
          <div className="icon">
            <FaDesktop />
          </div>
          <p className="text-title">{title}</p>
        </div>
        <button className="card-button">Ver más</button>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: relative;
  z-index: 10;

.card {
  width: 190px;
  height: 254px;
  border-radius: 20px;
  background: #1f1f1f;
  position: relative;
  padding: 1.8rem;
  border: 2px solid #9f5bff;
  transition: 0.5s ease-out;
  overflow: visible; /* <- ya está OK */
  cursor: pointer;
  z-index: 1; /* <- asegúrate que tenga z-index bajo */
}

  .card-details {
    color: #fff;
    height: 100%;
    gap: 0.5em;
    display: grid;
    place-content: center;
    text-align: center;
  }

  .icon {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    color: #fff;
  }

.card-button {
  transform: translate(-50%, 100%);
  width: 60%;
  border-radius: 1rem;
  border: none;
  background-color: #9f5bff;
  color: #fff;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  position: absolute;
  left: 50%;
  bottom: 0;
  opacity: 0;
  transition: 0.3s ease-out;
    z-index: 50; /* << Asegura que está encima */
  pointer-events: auto;
}

  .text-body {
    color: #ccc;
    font-size: 0.8rem;
  }

  .text-title {
    font-size: 1.2em;
    font-weight: bold;
    color: #fff;
  }

.card:hover .card-button {
  transform: translate(-50%, 40%);
  opacity: 1;
}
`;

export default BuildCard;
