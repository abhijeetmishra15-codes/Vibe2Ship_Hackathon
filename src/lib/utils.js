export const getDefaultIssueImage = (category) => {
  const defaultImages = {
    'Pothole': 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80',
    'Garbage': 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&w=600&q=80',
    'Water Leakage': 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80',
    'Streetlight': 'https://images.unsplash.com/photo-1512413914561-c88f192931a0?auto=format&fit=crop&w=600&q=80',
    'Sewer': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    'Public Infrastructure': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    'General': 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80'
  };

  return defaultImages[category] || defaultImages['General'];
};
