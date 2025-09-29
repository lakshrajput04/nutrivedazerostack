import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TotalPatientsCount = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/patients/count');
        setCount(response.data.count);
      } catch (error) {
        console.error('Error fetching patient count:', error);
      }
    };

    fetchCount();
  }, []);

  return count;
};

export default TotalPatientsCount;
