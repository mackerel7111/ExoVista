import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, AlertCircle, CheckCircle } from 'lucide-react';

interface ExoplanetData {
  orbitalPeriod: number;
  transitDepth: number;
  temperature: number;
}

interface FileUploadAreaProps {
  onDataUpload: (data: ExoplanetData) => void;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({ onDataUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const validateData = (data: any): ExoplanetData | null => {
    if (!data || typeof data !== 'object') return null;
    
    const period = parseFloat(data.orbital_period || data.orbitalPeriod || data.period);
    const depth = parseFloat(data.transit_depth || data.transitDepth || data.depth);
    const temp = parseFloat(data.temperature || data.temp);

    if (isNaN(period) || isNaN(depth) || isNaN(temp)) return null;
    if (period <= 0 || depth <= 0 || temp <= 0) return null;

    return {
      orbitalPeriod: period,
      transitDepth: depth,
      temperature: temp
    };
  };

  const processFile = useCallback(async (file: File) => {
    setUploadStatus('processing');
    setErrorMessage('');

    try {
      const text = await file.text();
      let data;

      if (file.name.endsWith('.json')) {
        data = JSON.parse(text);
      } else if (file.name.endsWith('.csv')) {
        const lines = text.split('\n').filter(line => line.trim());
        if (lines.length < 2) throw new Error('CSV must have header and data rows');
        
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const values = lines[1].split(',').map(v => v.trim());
        
        data = {};
        headers.forEach((header, index) => {
          data[header] = values[index];
        });
      } else {
        throw new Error('Unsupported file format. Please use JSON or CSV.');
      }

      const validatedData = validateData(data);
      if (!validatedData) {
        throw new Error('Invalid data format. Required fields: orbital_period, transit_depth, temperature');
      }

      onDataUpload(validatedData);
      setUploadStatus('success');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to process file');
      setUploadStatus('error');
    }
  }, [onDataUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <motion.div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300
          ${isDragOver 
            ? 'border-yellow-400 bg-yellow-400/5' 
            : uploadStatus === 'success' 
              ? 'border-green-400 bg-green-400/5' 
              : uploadStatus === 'error' 
                ? 'border-red-400 bg-red-400/5' 
                : 'border-gray-600 hover:border-gray-500'
          }
        `}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        whileHover={{ scale: 1.02 }}
      >
        <input
          type="file"
          accept=".csv,.json"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploadStatus === 'processing'}
        />
        
        <div className="space-y-4">
          {uploadStatus === 'processing' ? (
            <div className="animate-spin w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full mx-auto" />
          ) : uploadStatus === 'success' ? (
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto" />
          ) : uploadStatus === 'error' ? (
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
          ) : (
            <Upload className={`w-8 h-8 mx-auto ${isDragOver ? 'text-yellow-400' : 'text-gray-400'}`} />
          )}
          
          <div>
            {uploadStatus === 'processing' ? (
              <p className="text-yellow-400">Processing file...</p>
            ) : uploadStatus === 'success' ? (
              <p className="text-green-400">File uploaded successfully!</p>
            ) : uploadStatus === 'error' ? (
              <p className="text-red-400">Upload failed</p>
            ) : (
              <>
                <p className="text-gray-300 font-medium">
                  {isDragOver ? 'Drop your file here' : 'Drag & drop your data file'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  or click to browse (CSV, JSON)
                </p>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {uploadStatus === 'error' && errorMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-400 bg-red-900/20 p-3 rounded-lg border border-red-400/20"
        >
          {errorMessage}
        </motion.div>
      )}

      <div className="text-xs text-gray-500 space-y-1">
        <p><strong>Required fields:</strong></p>
        <ul className="list-disc list-inside space-y-0.5 ml-2">
          <li>orbital_period (days)</li>
          <li>transit_depth (%)</li>
          <li>temperature (K)</li>
        </ul>
        
        <div className="mt-4 p-3 bg-blue-900/20 border border-blue-400/20 rounded-lg">
          <p className="font-semibold text-blue-400 mb-2">📄 CSV File Format Example:</p>
          <div className="bg-black/30 p-2 rounded text-xs font-mono text-green-400">
            <div>orbital_period,transit_depth,temperature</div>
            <div>365.25,0.01,288</div>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            • First row: column headers<br/>
            • Second row: your planet data<br/>
            • Use commas to separate values
          </p>
        </div>
        
        <div className="mt-3 p-3 bg-green-900/20 border border-green-400/20 rounded-lg">
          <p className="font-semibold text-green-400 mb-2">📋 JSON File Format Example:</p>
          <div className="bg-black/30 p-2 rounded text-xs font-mono text-green-400">
            <div>&#123;</div>
            <div>&nbsp;&nbsp;"orbital_period": 365.25,</div>
            <div>&nbsp;&nbsp;"transit_depth": 0.01,</div>
            <div>&nbsp;&nbsp;"temperature": 288</div>
            <div>&#125;</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadArea;