import React, { useRef, useState, useEffect } from 'react';
import { cssObj } from '@fuel-ui/css';
import { Text } from '@fuel-ui/react';

export function Paragraph(props: any) {
  const paragraphRef = useRef(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [hasImage, setHasImage] = useState(false);

  useEffect(() => {
    if (paragraphRef.current.querySelector('img')) {
      setHasImage(true);
    }
  }, []);

  const handleClick = () => {
    if (hasImage) {
      setIsZoomed(!isZoomed);
    }
  };

  const currentStyles = isZoomed ? zoomedStyles : rootStyles(hasImage);

  return (
    <Text
      as="div"
      {...props}
      css={currentStyles}
      ref={paragraphRef}
      onClick={handleClick}
    />
  );
}

function rootStyles(hasImage: any) {
  return cssObj({
    mt: '$3',
    mb: '$3',
    fontSize: '16px',
    lineHeight: '1.7',
    wordWrap: 'break-word',
    'html[class="fuel_light-theme"] &': {
      color: '$intentsBase12',
    },
    position: 'relative',
    cursor: hasImage ? 'zoom-in' : 'default', // Dynamic cursor change
  });
}

const zoomedStyles = cssObj({
    mt: '0',
    mb: '0',
    fontSize: '16px',
    lineHeight: '1.7',
    wordWrap: 'break-word',
    'html[class="fuel_light-theme"] &': {
      color: '$intentsBase12',
    },
    cursor: 'zoom-out',
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    zIndex: '9999',
    backgroundColor: '$intentsBase12',
    overflow: 'auto',
    transition: 'transform 0.5s ease',
    '> img': {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    },
});