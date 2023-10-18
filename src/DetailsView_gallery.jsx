import { useParams } from 'react-router-dom';
import { useState,useEffect } from 'react';

function DetailsView_gallery() {
  const { id } = useParams();

  useEffect(() => {
    // Fetch and display details using the id variable
  }, [id]);

  return (
    <div>
      {/* Your detailed view content */}
    </div>
  );
}

export default DetailsView_gallery;