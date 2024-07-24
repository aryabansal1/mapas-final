import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, Typography, Button, Box, Paper, IconButton } from '@mui/material';
import { ArrowForwardIos, Close } from '@mui/icons-material';
import DOMPurify from 'dompurify';


// Extend the Window interface to include WooCommerce parameters
declare global {
  interface Window {
    woocommerce_params: {
      wc_ajax_url: string;
    };
  }
}

interface InfoCardProps {
  name: string;
  description: string;
  price: string;
  details: string;
  productId: string;
  actionUrl: string;
   isOpen: boolean;
  onToggleDescription: (productId: string) => void;
  sx?: object;
}

const InfoCard: React.FC<InfoCardProps> = ({ name, description, price, details, productId, actionUrl, sx }) => {
  const [showDescription, setShowDescription] = useState(false);
  const [descriptionBoxWidth, setDescriptionBoxWidth] = useState<number>(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize the necessary parameters for WooCommerce AJAX functionality
    window.woocommerce_params = {
      wc_ajax_url: 'https://crm.emergente.com.co/staging/?wc-ajax=%%endpoint%%'
    };

    // Set the width of the description box
    if (cardRef.current) {
      setDescriptionBoxWidth(cardRef.current.offsetWidth);
    }
  }, []);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(name);
    console.log(productId);
    // Send the product ID to the parent window
    window.parent.postMessage(`${productId}`, '*');
  };

  const openDescription = () => {
    setShowDescription(true);
  };

  const closeDescription = () => {
    setShowDescription(false);
  };

  const formatPrice = (price: string) => {
    return price.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
  
  const formatDescription = (desc: string) => {
    // Remove all HTML tags
    const cleanDesc = DOMPurify.sanitize(desc, { USE_PROFILES: { html: true } });
    // Create a temporary element to use the browser's parsing
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = cleanDesc;
    // Extract the text content
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    // Split into paragraphs based on double new lines
    const paragraphs = textContent.split(/\n{2,}/).map(paragraph => paragraph.trim());
    return paragraphs;
  };


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: 2, ...sx, position: 'relative' }}>
      <Card ref={cardRef} sx={{ marginBottom: 1 }}>
        <CardContent>
          <Typography variant="h6" component="div" sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.875rem' }}>
            {name}
          </Typography>
          <Typography variant="h5" component="div" sx={{ fontFamily: 'Poppins, sans-serif', marginTop: 1, fontSize: '0.7rem' }}>
            ${formatPrice(price)}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, marginTop: 1 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddToCart}
              sx={{
                fontSize: '0.6rem',
                backgroundColor: '#E74F20',
                color: '#fff',
                borderRadius: '20px',
                '&:hover': {
                  backgroundColor: '#625B71'
                }
              }}
              className="single_add_to_cart_button"
            >
              Añadir
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => window.open(details, '_blank')}
              sx={{
                fontSize: '0.6rem',
                backgroundColor: '#fff',
                color: '#E74F20',
                borderRadius: '20px',
                '&:hover': {
                  backgroundColor: '#625B71'
                }
              }}
            >
              Ver más
            </Button>
            <IconButton
              onClick={openDescription}
              sx={{
                position: 'absolute',
                top: '5px',
                right: '10px',
                padding: '4px',
                color: '#625B71',
                backgroundColor: '#f0f0f0',
                '&:hover': {
                  backgroundColor: '#e0e0e0'
                }
              }}
            >
              <ArrowForwardIos sx={{ fontSize: '0.75rem' }} />
            </IconButton>
          </Box>
        </CardContent>
      </Card>
      {showDescription && (
        <Paper
          elevation={3}
          sx={{
            position: 'fixed',
            top: '50%',
            left: '52%',
            transform: 'translate(-50%, -50%)',
            width: descriptionBoxWidth,
            padding: 2,
            backgroundColor: '#f5f5f5',
            borderLeft: '4px solid #E74F20',
            zIndex: 10,
            overflowY: 'auto',
            maxHeight: '70vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
            <Typography variant="h6" sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.8rem' }}>
              {name}
            </Typography>
            <IconButton onClick={closeDescription} size="small">
              <Close fontSize="small" />
            </IconButton>
          </Box>
          <Box sx={{ overflowY: 'auto', flex: 1 }}>
            {formatDescription(description).map((paragraph, index) => (
              <Typography key={index} variant="body2" sx={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.7rem', marginBottom: '0.5rem' }}>
                {paragraph}
              </Typography>
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 1, marginTop: 1, paddingTop: 1, borderTop: '1px solid #e0e0e0' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddToCart}
              sx={{
                fontSize: '0.6rem',
                backgroundColor: '#E74F20',
                color: '#fff',
                
                '&:hover': {
                  backgroundColor: '#625B71'
                }
              }}
              className="single_add_to_cart_button"
            >
              Añadir
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => window.open(details, '_blank')}
              sx={{
                fontSize: '0.6rem',
                backgroundColor: '#fff',
                color: '#E74F20',
                borderRadius: '20px',
                '&:hover': {
                  backgroundColor: '#625B71'
                }
              }}
            >
              Ver más
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default InfoCard;