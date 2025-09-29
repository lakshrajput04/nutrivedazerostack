import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ActivePlansCount = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/v1/diet-charts/active/count');
        setCount(response.data.count);
      } catch (error) {
        console.error('Error fetching active plans count:', error);
      }
    };

    fetchCount();
  }, []);

  return count;
};

export default ActivePlansCount;
