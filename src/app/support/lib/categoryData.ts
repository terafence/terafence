export interface CategoryOption {
    value: string;
    label: string;
    subcategories: { value: string; label: string }[];
  }
  
  export const categories: CategoryOption[] = [
    {
      value: 'technical',
      label: 'Technical',
      subcategories: [
        { value: 'installation', label: 'Installation Issues' },
        { value: 'configuration', label: 'Configuration Problems' },
        { value: 'performance', label: 'Performance Issues' },
        { value: 'bugs', label: 'Bug Reports' },
        { value: 'feature_request', label: 'Feature Requests' },
      ],
    },
    {
      value: 'sales',
      label: 'Sales',
      subcategories: [
        { value: 'pricing', label: 'Pricing Inquiries' },
        { value: 'quotes', label: 'Request a Quote' },
        { value: 'licensing', label: 'Licensing Questions' },
        { value: 'renewals', label: 'Renewals' },
        { value: 'upgrades', label: 'Upgrades' },
      ],
    },
    {
      value: 'general',
      label: 'General',
      subcategories: [
        { value: 'account', label: 'Account Management' },
        { value: 'billing', label: 'Billing Questions' },
        { value: 'documentation', label: 'Documentation Requests' },
        { value: 'feedback', label: 'Feedback' },
      ],
    },
    {
      value: 'others',
      label: 'Others',
      subcategories: [
        { value: 'partnership', label: 'Partnership Inquiries' },
        { value: 'career', label: 'Career Information' },
        { value: 'press', label: 'Press Inquiries' },
        { value: 'other', label: 'Other Questions' },
      ],
    },
    {
      value: 'related',
      label: 'Related',
      subcategories: [
        { value: 'integration', label: 'Integration Support' },
        { value: 'compatibility', label: 'Compatibility Issues' },
        { value: 'third_party', label: 'Third-Party Tools' },
        { value: 'api', label: 'API Questions' },
      ],
    },
  ];
  
  // Helper function to get subcategories based on selected category
  export const getSubcategories = (categoryValue: string) => {
    const category = categories.find(cat => cat.value === categoryValue);
    return category ? category.subcategories : [];
  };