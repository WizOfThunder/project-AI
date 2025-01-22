'use client';

export const Node = ({ 
  position, 
  type, 
  onClick, 
  onHover, 
  isHighlighted,
  isValidMove,
  moveType,
  isSelected,
}) => {
  const nodeClasses = [
    'node',
    `node-${type || 'default'}`,
    isHighlighted ? 'square-hover' : '',
    type === 'macan' ? 'node-size30' : 'node-size20',
    isValidMove ? 'valid-move' : '',
    isSelected ? 'selected' : '',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={nodeClasses}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        '--highlight-color': moveType === 'uwong' ? 'blue' : 'red'
      }}
      data-highlight={isValidMove ? moveType : null}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
      onClick={onClick}
    />
  );
};