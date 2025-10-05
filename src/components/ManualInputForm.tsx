import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Timer, TrendingDown, Circle, Star } from 'lucide-react';

interface ExoplanetData {
  period: number;
  duration: number;
  transitDepth: number;
  planetRadius: number;
  stellarRadius: number;
}

interface ManualInputFormProps {
  onDataChange: (data: ExoplanetData) => void;
}

const ManualInputForm: React.FC<ManualInputFormProps> = ({ onDataChange }) => {
  const [formData, setFormData] = useState({
    period: '',
    duration: '',
    transitDepth: '',
    planetRadius: '',
    stellarRadius: ''
  });

  const [errors, setErrors] = useState({
    period: '',
    duration: '',
    transitDepth: '',
    planetRadius: '',
    stellarRadius: ''
  });

  const validateField = (name: string, value: string) => {
    const numValue = parseFloat(value);
    if (!value) return '';
    if (isNaN(numValue) || numValue <= 0) {
      return 'Must be a positive number';
    }
    
    switch (name) {
      case 'period':
        if (numValue > 10000) return 'Value seems unusually high';
        break;
      case 'duration':
        if (numValue > 24) return 'Duration cannot exceed 24 hours';
        break;
      case 'transitDepth':
        if (numValue > 100) return 'Transit depth cannot exceed 100%';
        break;
      case 'planetRadius':
        if (numValue > 50) return 'Planet radius seems unusually large';
        break;
      case 'stellarRadius':
        if (numValue > 100) return 'Stellar radius seems unusually large';
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
    const { period, duration, transitDepth, planetRadius, stellarRadius } = formData;
    
    if (period && duration && transitDepth && planetRadius && stellarRadius && 
        !errors.period && !errors.duration && !errors.transitDepth && 
        !errors.planetRadius && !errors.stellarRadius) {
      
      const data: ExoplanetData = {
        period: parseFloat(period),
        duration: parseFloat(duration),
        transitDepth: parseFloat(transitDepth),
        planetRadius: parseFloat(planetRadius),
        stellarRadius: parseFloat(stellarRadius)
      };
      
      onDataChange(data);
    }
  }, [formData, errors, onDataChange]);

  const inputFields = [
    {
      name: 'period',
      label: 'Orbital Period',
      icon: Clock,
      placeholder: 'e.g., 365.25',
      unit: 'days',
      color: 'text-blue-400',
      description: 'Time for one complete orbit around the star'
    },
    {
      name: 'duration',
      label: 'Transit Duration',
      icon: Timer,
      placeholder: 'e.g., 2.5',
      unit: 'hours',
      color: 'text-purple-400',
      description: 'How long the planet blocks the star\'s light'
    },
    {
      name: 'transitDepth',
      label: 'Transit Depth',
      icon: TrendingDown,
      placeholder: 'e.g., 0.01',
      unit: '%',
      color: 'text-green-400',
      description: 'Percentage of starlight blocked during transit'
    },
    {
      name: 'planetRadius',
      label: 'Planet Radius',
      icon: Circle,
      placeholder: 'e.g., 1.0',
      unit: 'R⊕',
      color: 'text-orange-400',
      description: 'Planet size relative to Earth (1.0 = Earth-sized)'
    },
    {
      name: 'stellarRadius',
      label: 'Stellar Radius',
      icon: Star,
      placeholder: 'e.g., 1.0',
      unit: 'R☉',
      color: 'text-yellow-400',
      description: 'Star size relative to our Sun (1.0 = Sun-sized)'
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
          <p className="text-xs text-gray-500 mb-2">{field.description}</p>
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
          <p>• Transit Duration: 0.1 - 24 hours</p>
          <p>• Transit Depth: 0.001% - 100%</p>
          <p>• Planet Radius: 0.1 - 50 R⊕ (Earth radii)</p>
          <p>• Stellar Radius: 0.1 - 100 R☉ (Solar radii)</p>
        </div>
      </div>
    </div>
  );
};

export default ManualInputForm;