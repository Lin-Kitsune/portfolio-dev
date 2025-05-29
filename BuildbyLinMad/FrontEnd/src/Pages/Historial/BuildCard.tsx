import React from 'react';
import { FaStar, FaEdit, FaTrash } from 'react-icons/fa';
import './BuildCard.css';

const BuildCard = ({ build, index, onEdit, onDelete, onToggleRecommended, isAdmin }: any) => {
  const fecha = new Date(build.createdAt).toLocaleDateString('es-CL');

  return (
    <div className="build-card">
      <div className="overlay"></div>

      <img
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAByUlEQVR4nO3YoYsVURSA8WsU12DbXUHEqP+BCAYNFtlkFZPVtE/3WTYYrEaTYBSb2SAsFkWTmMSm1SC4G/QnDybsLjOO973Z+2ZmzweThnPPuR/nXC43pSAIgiAIggqcxBms4wIu4Qqu4yZu4Tbu4h628RhP8BTP8QKvsIP3+IQv+IZfqa8oROorQkCnbOEUpod/pL6iW1aqNU83CcBlhSkpYDqTgIdNReCqEQtoZF++a465gBulcvZSQAmWmbsXhIBDZNk6KnrbAQpRbPchIC21A7b6cBVepoCVtqvw2AVM267CYxfQSLHdh4AUHWCJ3dcLsgUY2aNolgCFKLb7EJCiA8QIHCRrXo6KYgdAjECKEZDTfQpRrP+jA1J0gBiBg2TNyz/YxSbWqm+CPf/JvnxvFKYrAZs1sfdzi8BbAxWwWhO7mlsE3hmogLWa2LO5ReDjfNtoXrNtL10JmNTEPpi32N4g7xCcVI8m69X8Zx+CQxawEDV5z89eivAdH/ASj7AxE3wcBNxpCbk4dgHPWkK2xy7ga0vI51EKwI85wneq1+kTYxDwc4FlXuPc0AXsLrjUrIM2hizgdwfL/Sl2SAZBEARBEKQR8Rfj6v3FNjYTZwAAAABJRU5ErkJggg=="
        alt="Tu Build"
        className="pc-icon"
      />

      <div className="content">
        <h1 className="text-2xl font-bold">{build.title || `Build #${index + 1}`}</h1>


        <div className="row-info">
          <span className="build-date">{fecha}</span>

          <span className="build-price">${build.total.toLocaleString('es-CL')}</span>
        </div>

        <div className="icon-buttons">
          {isAdmin && (
            <button className="icon-button green" onClick={onToggleRecommended}>
              <FaStar />
            </button>
          )}
          <button className="icon-button yellow" onClick={onEdit}>
            <FaEdit />
          </button>
          <button className="icon-button red" onClick={onDelete}>
            <FaTrash />
          </button>
        </div>

        <div className="back-content">
          <ul className="components-list">
            {Object.entries(build.components).map(([key, comp]: any) =>
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
  );
};

export default BuildCard;
