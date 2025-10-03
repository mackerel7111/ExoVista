import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingDown, Thermometer } from 'lucide-react';

interface ExoplanetData {
  orbitalPeriod: number;
  transitDepth: number;
  temperature: number;
}

interface ManualInputFormProps {
  onDataChange: (data: ExoplanetData) => void;
}

const ManualInputForm: React.FC<ManualInputFormProps> = ({ onDataChange }) => {
  const [formData, setFormData] = useState({
    orbitalPeriod: '',
    transitDepth: '',
    temperature: ''
  });

  const [errors, setErrors] = useState({
    orbitalPeriod: '',
    transitDepth: '',
    temperature: ''
  });

  const validateField = (name: string, value: string) => {
    const numValue = parseFloat(value);
    if (!value) return '';
    if (isNaN(numValue) || numValue <= 0) {
      return 'Must be a positive number';
    }
    
    switch (name) {
      case 'orbitalPeriod':
        if (numValue > 10000) return 'Value seems unusually high';
        break;
      case 'transitDepth':
        if (numValue > 100) return 'Transit depth cannot exceed 100%';
        break;
      case 'temperature':
        if (numValue > 10000) return 'Temperature seems unusually high';
        break;
    }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  useEffect(() => {
    const { orbitalPeriod, transitDepth, temperature } = formData;
    
    if (orbitalPeriod && transitDepth && temperature && 
        !errors.orbitalPeriod && !errors.transitDepth && !errors.temperature) {
      
      const data: ExoplanetData = {
        orbitalPeriod: parseFloat(orbitalPeriod),
        transitDepth: parseFloat(transitDepth),
        temperature: parseFloat(temperature)
      };
      
      onDataChange(data);
    }
  }, [formData, errors, onDataChange]);

  const inputFields = [
    {
      name: 'orbitalPeriod',
      label: 'Orbital Period',
      icon: Clock,
      placeholder: 'e.g., 365.25',
      unit: 'days',
      color: 'text-blue-400'
    },
    {
      name: 'transitDepth',
      label: 'Transit Depth',
      icon: TrendingDown,
      placeholder: 'e.g., 0.01',
      unit: '%',
      color: 'text-green-400'
    },
    {
      name: 'temperature',
      label: 'Temperature',
      icon: Thermometer,
      placeholder: 'e.g., 288',
      unit: 'K',
      color: 'text-red-400'
    }
  ];

  return (
    <div className="space-y-4">
      {inputFields.map((field, index) => (
        <motion.div 
          key={field.name}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="space-y-2"
        >
          <label className="block text-sm font-medium text-gray-300 flex items-center gap-2">
            <field.icon className={`w-4 h-4 ${field.color}`} />
            {field.label} ({field.unit})
          </label>
          <div className="relative">
            <input
              type="number"
              name={field.name}
              value={formData[field.name as keyof typeof formData]}
              onChange={handleChange}
              placeholder={field.placeholder}
              className={`
                w-full px-4 py-3 bg-black/20 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-300
                ${errors[field.name as keyof typeof errors] 
                  ? 'border-red-400 focus:ring-red-400/50' 
                  : 'border-gray-600 focus:border-yellow-400 focus:ring-yellow-400/50'
                }
                text-white placeholder-gray-500
              `}
              step="any"
              min="0"
            />
            {formData[field.name as keyof typeof formData] && !errors[field.name as keyof typeof errors] && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
              </div>
            )}
          </div>
          {errors[field.name as keyof typeof errors] && (
            <motion.p 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-400"
            >
              {errors[field.name as keyof typeof errors]}
            </motion.p>
          )}
        </motion.div>
      ))}

      <div className="mt-6 p-4 bg-black/10 rounded-lg border border-gray-700">
        <h4 className="text-sm font-medium text-gray-400 mb-2">Parameter Ranges</h4>
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Orbital Period: 0.1 - 10,000 days</p>
          <p>• Transit Depth: 0.001% - 100%</p>
          <p>• Temperature: 50K - 10,000K</p>
        </div>
      </div>
    </div>
  );
};

export default ManualInputForm;