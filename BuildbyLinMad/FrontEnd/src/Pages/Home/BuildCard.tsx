import React from 'react';
import styled from 'styled-components';

interface BuildCardProps {
  title: string;
  total: number;
  components: {
    [key: string]: {
      name: string;
    };
  };
}

const BuildCard: React.FC<BuildCardProps> = ({ title, total , components }) => {
  return (
    <StyledWrapper>
      <div className="card-container">
        <div className="card">
          <div className="front-content">
            <div className="icon">
              <div className="pc-icon-mask" />
            </div>
            <p className="text-title">{title}</p>
            <p className="text-price">
              {typeof total === 'number' ? `$${total.toLocaleString('es-CL')}` : 'Precio no disponible'}
            </p>
          </div>
          <div className="content">
            <div className="scroll-wrapper">
              <ul className="components-list">
                {Object.entries(components).map(([key, comp]: any) =>
                  comp?.name?.trim() ? (
                    <li key={key} className="component-item">
                      {(() => {
                        const match = comp.name.match(/^([^\(]*)?(?:\(([^)]*GB)[^)]+\))?/);
                        const main = match?.[1]?.trim() || '';
                        const gb = match?.[2] ? ` ${match[2]}` : '';
                        return `${main}${gb}`;
                      })()}
                    </li>
                  ) : null
                )}
              </ul>
            </div>
          </div>


        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .card-container {
    width: 330px; 
    height: 300px;
    position: relative;
    border-radius: 10px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }

  .card {
    width: 100%;
    height: 100%;
    border-radius: inherit;
  }

  .pc-icon-mask {
    width: 80px;
    height: 80px;
    background: linear-gradient(to bottom right, #7F00FF, #00FFFF);
    
    /* Máscara usando tu imagen PNG como forma */
    -webkit-mask-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAByUlEQVR4nO3YoYsVURSA8WsU12DbXUHEqP+BCAYNFtlkFZPVtE/3WTYYrEaTYBSb2SAsFkWTmMSm1SC4G/QnDybsLjOO973Z+2ZmzweThnPPuR/nXC43pSAIgiAIggqcxBms4wIu4Qqu4yZu4Tbu4h628RhP8BTP8QKvsIP3+IQv+IZfqa8oROorQkCnbOEUpod/pL6iW1aqNU83CcBlhSkpYDqTgIdNReCqEQtoZF++a465gBulcvZSQAmWmbsXhIBDZNk6KnrbAQpRbPchIC21A7b6cBVepoCVtqvw2AVM267CYxfQSLHdh4AUHWCJ3dcLsgUY2aNolgCFKLb7EJCiA8QIHCRrXo6KYgdAjECKEZDTfQpRrP+jA1J0gBiBg2TNyz/YxSbWqm+CPf/JvnxvFKYrAZs1sfdzi8BbAxWwWhO7mlsE3hmogLWa2LO5ReDjfNtoXrNtL10JmNTEPpi32N4g7xCcVI8m69X8Zx+CQxawEDV5z89eivAdH/ASj7AxE3wcBNxpCbk4dgHPWkK2xy7ga0vI51EKwI85wneq1+kTYxDwc4FlXuPc0AXsLrjUrIM2hizgdwfL/Sl2SAZBEARBEKQR8Rfj6v3FNjYTZwAAAABJRU5ErkJggg==");
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-size: contain;
    -webkit-mask-position: center;
    mask-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAByUlEQVR4nO3YoYsVURSA8WsU12DbXUHEqP+BCAYNFtlkFZPVtE/3WTYYrEaTYBSb2SAsFkWTmMSm1SC4G/QnDybsLjOO973Z+2ZmzweThnPPuR/nXC43pSAIgiAIggqcxBms4wIu4Qqu4yZu4Tbu4h628RhP8BTP8QKvsIP3+IQv+IZfqa8oROorQkCnbOEUpod/pL6iW1aqNU83CcBlhSkpYDqTgIdNReCqEQtoZF++a465gBulcvZSQAmWmbsXhIBDZNk6KnrbAQpRbPchIC21A7b6cBVepoCVtqvw2AVM267CYxfQSLHdh4AUHWCJ3dcLsgUY2aNolgCFKLb7EJCiA8QIHCRrXo6KYgdAjECKEZDTfQpRrP+jA1J0gBiBg2TNyz/YxSbWqm+CPf/JvnxvFKYrAZs1sfdzi8BbAxWwWhO7mlsE3hmogLWa2LO5ReDjfNtoXrNtL10JmNTEPpi32N4g7xCcVI8m69X8Zx+CQxawEDV5z89eivAdH/ASj7AxE3wcBNxpCbk4dgHPWkK2xy7ga0vI51EKwI85wneq1+kTYxDwc4FlXuPc0AXsLrjUrIM2hizgdwfL/Sl2SAZBEARBEKQR8Rfj6v3FNjYTZwAAAABJRU5ErkJggg==");
    mask-repeat: no-repeat;
    mask-size: contain;
    mask-position: center;
  }

  .text-price {
    font-size: 18px;
    font-weight: 500;
    color: #00ffff;
    margin-top: 4px;
  }
    
.scroll-wrapper {
  max-height: 250px; /* 👈 controla la altura del área con scroll */
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 8px;
  margin: 12px 0; /* 👈 espacio arriba y abajo para que el scroll no toque los bordes */
  margin-right: -8px; /* oculta el "track" feo del scroll */
  box-sizing: content-box;
  scrollbar-width: thin;
  scrollbar-color: #00FFFF transparent;
  pointer-events: auto;
}

.scroll-wrapper::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.scroll-wrapper::-webkit-scrollbar-thumb {
  background-color: #00FFFF;
  border-radius: 8px;
}

.scroll-wrapper::-webkit-scrollbar-track {
  background: transparent;
}

.components-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.component-item {
  background-color: rgba(255, 255, 255, 0.08);
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  color: #ffffff;
  word-break: break-word;
  white-space: normal;
  transition: background-color 0.3s ease;
}

.component-item:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

  .text-title {
    font-size: 22px;
    font-weight: 600;
    background: linear-gradient(to bottom right, #7F00FF, #00FFFF);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
    margin: 0;
    padding: 0;
    line-height: 1.1; 
  }

  .card:hover .text-title {
    opacity: 0;
  }

  .card .front-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #1f1f1f;
    gap: 4px;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.320, 1);
  }

  .card .front-content p {
    font-size: 32px;
    font-weight: 700;
    opacity: 1;
    background: linear-gradient(to bottom right, #7F00FF, #00FFFF);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.320, 1)
  }

.card .content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(-45deg, #00FFFF 0%, #7F00FF 100%);
  color: #e8e8e8;
  border-radius: 5px;
  transform: translateY(-94%);
  transition: all 0.6s cubic-bezier(0.23, 1, 0.320, 1);
  display: flex;
  flex-direction: column;
  padding: 0 1em;
  box-sizing: border-box;
  pointer-events: auto; /* ← Permite hacer scroll y hover */
}


  .card .content .heading {
    font-size: 32px;
    font-weight: 700;
  }

  .card:hover .content {
    transform: translateY(0);
  }

  .card:hover .front-content {
    transform: translateY(30%); 
  }

  .card:hover .front-content p {
    opacity: 0;
  }`;

export default BuildCard;
