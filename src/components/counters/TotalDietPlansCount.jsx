import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config/api';

const TotalDietPlansCount = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/dietChartCounts/count`);
        setCount(response.data.count);
      } catch (error) {
        console.error('Error fetching diet plans count:', error);
      }
    };

    fetchCount();
  }, []);

  return count;
};

export default TotalDietPlansCount;
