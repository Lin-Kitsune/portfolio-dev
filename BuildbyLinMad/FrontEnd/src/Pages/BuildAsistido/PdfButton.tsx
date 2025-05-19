import React from 'react';
import styled from 'styled-components';

const PdfButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <StyledWrapper>
      <button className="download-button" onClick={onClick}>
        <div className="docs">
          <svg viewBox="0 0 24 24" width={20} height={20} stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1={16} y1={13} x2={8} y2={13} />
            <line x1={16} y1={17} x2={8} y2={17} />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          Exportar PDF
        </div>
        <div className="download">
          <svg viewBox="0 0 24 24" width={24} height={24} stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1={12} y1={15} x2={12} y2={3} />
          </svg>
        </div>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .download-button {
    position: relative;
    border-width: 0;
    color: white;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    border-radius: 2px;
    z-index: 1;
    background-color: transparent;
  }

  .download-button .docs {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    min-height: 40px;
    padding: 0 10px;
    border-radius: 4px;
    z-index: 1;
    background-color: #1A1A1A;
    border: solid 1px #7F00FF;
    transition: all 0.5s cubic-bezier(0.77, 0, 0.175, 1);
  }

  .download {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 90%;
    margin: 0 auto;
    z-index: -1;
    border-radius: 4px;
    transform: translateY(0%);
    background-color: #7F00FF;
    border: solid 1px #5A32A3;
    transition: all 0.5s cubic-bezier(0.77, 0, 0.175, 1);
  }

  .download-button:hover .download {
    transform: translateY(100%);
  }

  .download svg polyline,
  .download svg line {
    animation: docs 1s infinite;
  }

  @keyframes docs {
    0% { transform: translateY(0%); }
    50% { transform: translateY(-15%); }
    100% { transform: translateY(0%); }
  }

`;

export default PdfButton;
