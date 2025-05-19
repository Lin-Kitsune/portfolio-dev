import React from 'react';
import styled from 'styled-components';

interface FlipCardProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  enabled?: boolean;
}

export const FlipCard: React.FC<FlipCardProps> = ({
  frontContent,
  backContent,
  enabled = true,
}) => {
  return (
    <CardWrapper className={enabled ? 'can-flip' : ''}>
      <div className="flip-card">
        <div className="card-inner">
          <div className="card-front">{frontContent}</div>
          <div className="card-back">{backContent}</div>
        </div>
      </div>
    </CardWrapper>
  );
};

const CardWrapper = styled.div`
  &.can-flip .flip-card:hover .card-inner {
    transform: rotateY(180deg);
  }

  .flip-card {
    width: 160px;
    height: 160px;
    perspective: 1000px;
  }

  .card-inner {
    width: 100%;
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.6s ease-in-out;
  }

  .card-front,
  .card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 18px;
    overflow: hidden;
  }

  .card-front {
    z-index: 2;
    display: flex; 
    justify-content: center;
    align-items: center;
  }

  .card-back {
    transform: rotateY(180deg);
    background: linear-gradient(to bottom right, #7F00FF, #00FFFF);
    color: white;
    padding: 0.5rem;
    font-size: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.25rem;
  }

  .card-back h4 {
    font-size: 0.85rem;
    font-weight: bold;
    margin-bottom: 0.25rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card-back a.component-link {
  font-size: 0.9rem;
  font-weight: 600;
}

  .card-back .spec-line {
    font-size: 0.7rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .back-content {
  width: 100%;
  padding: 0.6rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  overflow: hidden;
  text-align: center;
}

.component-title {
  font-size: 1rem;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90%;
}

.component-link {
  font-size: 0.9rem; 
  font-weight: 600;
  text-decoration: underline;
  color: white;
  opacity: 0.9;
  transition: opacity 0.2s;
}

.component-link:hover {
  opacity: 1;
}

.spec-list {
  margin-top: 0.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  max-height: 90rem;
  overflow-y: auto;
  width: 100%;
}

.spec-line {
  font-size: 0.85rem;
  display: flex;
  justify-content: space-between;
  padding: 0 0.4rem;
}

.spec-key {
  font-weight: 600;
  opacity: 0.8;
  font-size: 0.85rem;
}

.spec-value {
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.85rem;
}

`;
