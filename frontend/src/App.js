import React, { useState, useEffect } from 'react';
import MersenneTwister from 'mersenne-twister';
import { 
  Play, 
  Square, 
  Settings, 
  Download, 
  Upload,
  Lock,
  Unlock,
  Maximize2
} from 'lucide-react';

function App() {
  const [isRunning, setIsRunning] = useState(false);
  const [lightSource, setLightSource] = useState('');
  const [workMode, setWorkMode] = useState('');
  const [waveformType, setWaveformType] = useState('analog');
  const [outputWaveform, setOutputWaveform] = useState('Advanced Pulse Train');
  const [distribution, setDistribution] = useState('Uniform');
  const [amplitude, setAmplitude] = useState('10.0');
  const [initialDelay, setInitialDelay] = useState('0');
  const [period, setPeriod] = useState({ min: '40', avg: '120', max: '200' });
  const [pulseWidth, setPulseWidth] = useState({ min: '20', avg: '40', max: '60' });
  const [interval, setInterval] = useState({ min: '20', avg: '80', max: '140' });
  const [pulseCount, setPulseCount] = useState('1');
  const [waveformRepeatCount, setWaveformRepeatCount] = useState('1');
  const [showAll, setShowAll] = useState(false);
  const [lockedParameter, setLockedParameter] = useState('period'); // 'period', 'pulseWidth', 'interval', or null
  
  // Local state for input values (for display only)
  const [localPulseWidth, setLocalPulseWidth] = useState({ min: '20', max: '60' });
  const [localInterval, setLocalInterval] = useState({ min: '20', max: '140' });
  const [localPeriod, setLocalPeriod] = useState({ min: '40', max: '200' });
  
  const [waveformDefinition, setWaveformDefinition] = useState([
    { output: '10', timeSpan: '50' },
    { output: '0', timeSpan: '50' },
    { output: '0', timeSpan: '0' },
    { output: '0', timeSpan: '0' },
    { output: '0', timeSpan: '0' },
    { output: '0', timeSpan: '0' },
    { output: '0', timeSpan: '0' },
    { output: '0', timeSpan: '0' }
  ]);

  // Initialize Mersenne Twister generator
  const mt = new MersenneTwister();

  // Generate random number using uniform distribution between min and max
  const generateRandomValue = (min, max) => {
    const minVal = parseFloat(min) || 0;
    const maxVal = parseFloat(max) || 0;
    if (minVal === maxVal) return minVal;
    
    // Use Mersenne Twister for uniform distribution
    return minVal + (mt.random() * (maxVal - minVal));
  };

  // Update waveform definition table based on current parameters
  const updateWaveformDefinition = () => {
    const pulseCountNum = parseInt(pulseCount) || 1;
    const amplitudeNum = parseFloat(amplitude) || 0;
    
    const newWaveformDefinition = [];
    
    // Generate waveform definition for each pulse
    for (let i = 0; i < pulseCountNum && i < 8; i++) {
      // Sample pulse width from min/max range
      const sampledPulseWidth = generateRandomValue(pulseWidth.min, pulseWidth.max);
      
      // First segment: Pulse ON (pulse width duration)
      newWaveformDefinition.push({
        output: amplitudeNum.toString(),
        timeSpan: sampledPulseWidth.toFixed(1)
      });
      
      // Second segment: Pulse OFF (interval duration) - always add OFF segment
      const sampledInterval = generateRandomValue(interval.min, interval.max);
      
      newWaveformDefinition.push({
        output: '0',
        timeSpan: sampledInterval.toFixed(1)
      });
    }
    
    // Fill remaining slots with zeros if needed
    while (newWaveformDefinition.length < 8) {
      newWaveformDefinition.push({
        output: '0',
        timeSpan: '0'
      });
    }
    
    setWaveformDefinition(newWaveformDefinition);
  };

  // Initialize waveform definition on component mount
  useEffect(() => {
    updateWaveformDefinition();
  }, []); // Empty dependency array means this runs once on mount

  const handleStart = () => {
    setIsRunning(!isRunning);
  };

  const handleAmplitudeChange = (value) => {
    if (isValidPositiveNumber(value)) {
      setAmplitude(value);
      updateWaveformDefinition();
    }
  };

  const handleInitialDelayChange = (value) => {
    if (isValidPositiveNumber(value)) {
      setInitialDelay(value);
    }
  };

  const handlePulseCountChange = (value) => {
    if (isValidPositiveNumber(value)) {
      setPulseCount(value);
      updateWaveformDefinition();
    }
  };

  const handleWaveformRepeatCountChange = (value) => {
    if (isValidPositiveNumber(value)) {
      setWaveformRepeatCount(value);
    }
  };

  const handleMaxPulseCount = () => {
    setPulseCount('511');
    updateWaveformDefinition();
  };

  const handleMaxRepeatCount = () => {
    setWaveformRepeatCount('999');
  };

  const handleWaveformDefinitionChange = (index, field, value) => {
    // Validate input for numeric fields
    if (field === 'output' || field === 'timeSpan') {
      if (!isValidPositiveNumber(value)) {
        return; // Keep original value
      }
    }
    
    const newWaveformDefinition = [...waveformDefinition];
    newWaveformDefinition[index] = { ...newWaveformDefinition[index], [field]: value };
    setWaveformDefinition(newWaveformDefinition);
  };

  // Validate if a value is a positive number
  const isValidPositiveNumber = (value) => {
    const num = parseFloat(value);
    return !isNaN(num) && num >= 0;
  };

  // Validate that min < max for a parameter
  const isValidMinMax = (min, max) => {
    const minVal = parseFloat(min) || 0;
    const maxVal = parseFloat(max) || 0;
    return minVal <= maxVal;
  };

  // Calculate average values based on Period = Pulse Width + Interval
  const calculateAvg = (min, max) => {
    const minVal = parseFloat(min) || 0;
    const maxVal = parseFloat(max) || 0;
    return ((minVal + maxVal) / 2).toFixed(1);
  };

  // Update period when pulse width or interval changes
  const updatePeriod = (pulseWidthMin, pulseWidthMax, intervalMin, intervalMax) => {
    const pwMin = parseFloat(pulseWidthMin) || 0;
    const pwMax = parseFloat(pulseWidthMax) || 0;
    const intMin = parseFloat(intervalMin) || 0;
    const intMax = parseFloat(intervalMax) || 0;
    
    const periodMin = pwMin + intMin;
    const periodMax = pwMax + intMax;
    
    setPeriod({
      min: periodMin.toString(),
      avg: calculateAvg(periodMin.toString(), periodMax.toString()),
      max: periodMax.toString()
    });
  };

  // Update pulse width and recalculate based on locked parameter
  const updatePulseWidth = (field, value) => {
    // Don't update state immediately - let validation handle it
    // This prevents race conditions between onChange and validation
  };

  // Validate pulse width on blur/enter
  const validatePulseWidth = (field, value) => {
    // Validate input
    if (!isValidPositiveNumber(value)) {
      // Revert local state to match main state
      setLocalPulseWidth(pulseWidth);
      return;
    }
    
    const newPulseWidth = { ...pulseWidth, [field]: value };
    
    // Validate min < max for pulse width
    if (!isValidMinMax(newPulseWidth.min, newPulseWidth.max)) {
      // Revert local state to match main state
      setLocalPulseWidth(pulseWidth);
      return;
    }
    
    // Additional validation for locked period
    if (lockedParameter === 'period') {
      const periodMin = parseFloat(period.min) || 0;
      const periodMax = parseFloat(period.max) || 0;
      const pwMin = parseFloat(newPulseWidth.min) || 0;
      const pwMax = parseFloat(newPulseWidth.max) || 0;
      
      // Check if new values would result in negative intervals
      const newIntervalMin = periodMin - pwMin;
      const newIntervalMax = periodMax - pwMax;
      
      if (newIntervalMin < 0 || newIntervalMax < 0) {
        // Revert local state to match main state
        setLocalPulseWidth(pulseWidth);
        return;
      }
    }
    
    // Valid value, proceed with recalculation
    setPulseWidth(newPulseWidth);
    setLocalPulseWidth(newPulseWidth);
    updateWaveformDefinition();
    
    if (lockedParameter === 'period') {
      // Period is locked, recalculate interval
      const periodMin = parseFloat(period.min) || 0;
      const periodMax = parseFloat(period.max) || 0;
      const pwMin = parseFloat(newPulseWidth.min) || 0;
      const pwMax = parseFloat(newPulseWidth.max) || 0;
      
      const newIntervalMin = periodMin - pwMin;
      const newIntervalMax = periodMax - pwMax;
      
      setInterval({
        min: newIntervalMin.toString(),
        avg: calculateAvg(newIntervalMin.toString(), newIntervalMax.toString()),
        max: newIntervalMax.toString()
      });
      
      // Update local interval state to reflect the new calculated values
      setLocalInterval({
        min: newIntervalMin.toString(),
        avg: calculateAvg(newIntervalMin.toString(), newIntervalMax.toString()),
        max: newIntervalMax.toString()
      });
    } else if (lockedParameter === 'interval') {
      // Interval is locked, recalculate period
      updatePeriod(newPulseWidth.min, newPulseWidth.max, interval.min, interval.max);
      
      // Update local period state to reflect the new calculated values
      const newPeriodMin = parseFloat(newPulseWidth.min) + parseFloat(interval.min);
      const newPeriodMax = parseFloat(newPulseWidth.max) + parseFloat(interval.max);
      setLocalPeriod({
        min: newPeriodMin.toString(),
        avg: calculateAvg(newPeriodMin.toString(), newPeriodMax.toString()),
        max: newPeriodMax.toString()
      });
    } else {
      // No lock or pulse width is locked, recalculate period
      updatePeriod(newPulseWidth.min, newPulseWidth.max, interval.min, interval.max);
    }
  };

  // Update interval and recalculate based on locked parameter
  const updateInterval = (field, value) => {
    // Don't update state immediately - let validation handle it
    // This prevents race conditions between onChange and validation
  };

  // Validate interval on blur/enter
  const validateInterval = (field, value) => {
    // Validate input
    if (!isValidPositiveNumber(value)) {
      // Revert local state to match main state
      setLocalInterval(interval);
      return;
    }
    
    const newInterval = { ...interval, [field]: value };
    
    // Validate min < max for interval
    if (!isValidMinMax(newInterval.min, newInterval.max)) {
      // Revert local state to match main state
      setLocalInterval(interval);
      return;
    }
    
    // Additional validation for locked period
    if (lockedParameter === 'period') {
      const periodMin = parseFloat(period.min) || 0;
      const periodMax = parseFloat(period.max) || 0;
      const intMin = parseFloat(newInterval.min) || 0;
      const intMax = parseFloat(newInterval.max) || 0;
      
      // Check if new values would result in negative pulse widths
      const newPulseWidthMin = periodMin - intMin;
      const newPulseWidthMax = periodMax - intMax;
      
      if (newPulseWidthMin < 0 || newPulseWidthMax < 0) {
        // Revert local state to match main state
        setLocalInterval(interval);
        return;
      }
    }
    
    // Additional validation for locked pulse width
    if (lockedParameter === 'pulseWidth') {
      const pwMin = parseFloat(pulseWidth.min) || 0;
      const pwMax = parseFloat(pulseWidth.max) || 0;
      const intMin = parseFloat(newInterval.min) || 0;
      const intMax = parseFloat(newInterval.max) || 0;
      
      // Check if new values would result in negative periods
      const newPeriodMin = pwMin + intMin;
      const newPeriodMax = pwMax + intMax;
      
      if (newPeriodMin < 0 || newPeriodMax < 0) {
        // Revert local state to match main state
        setLocalInterval(interval);
        return;
      }
    }
    
    // Valid value, proceed with recalculation
    setInterval(newInterval);
    setLocalInterval(newInterval);
    updateWaveformDefinition();
    
    if (lockedParameter === 'period') {
      // Period is locked, recalculate pulse width
      const periodMin = parseFloat(period.min) || 0;
      const periodMax = parseFloat(period.max) || 0;
      const intMin = parseFloat(newInterval.min) || 0;
      const intMax = parseFloat(newInterval.max) || 0;
      
      const newPulseWidthMin = periodMin - intMin;
      const newPulseWidthMax = periodMax - intMax;
      
      setPulseWidth({
        min: newPulseWidthMin.toString(),
        avg: calculateAvg(newPulseWidthMin.toString(), newPulseWidthMax.toString()),
        max: newPulseWidthMax.toString()
      });
      
      // Update local pulse width state to reflect the new calculated values
      setLocalPulseWidth({
        min: newPulseWidthMin.toString(),
        avg: calculateAvg(newPulseWidthMin.toString(), newPulseWidthMax.toString()),
        max: newPulseWidthMax.toString()
      });
    } else if (lockedParameter === 'pulseWidth') {
      // Pulse width is locked, recalculate period
      updatePeriod(pulseWidth.min, pulseWidth.max, newInterval.min, newInterval.max);
      
      // Update local period state to reflect the new calculated values
      const newPeriodMin = parseFloat(pulseWidth.min) + parseFloat(newInterval.min);
      const newPeriodMax = parseFloat(pulseWidth.max) + parseFloat(newInterval.max);
      setLocalPeriod({
        min: newPeriodMin.toString(),
        avg: calculateAvg(newPeriodMin.toString(), newPeriodMax.toString()),
        max: newPeriodMax.toString()
      });
    } else {
      // No lock or interval is locked, recalculate period
      updatePeriod(pulseWidth.min, pulseWidth.max, newInterval.min, newInterval.max);
    }
  };

  // Update period and recalculate based on locked parameter
  const updatePeriodDirect = (field, value) => {
    // Don't update state immediately - let validation handle it
    // This prevents race conditions between onChange and validation
  };

  // Validate period on blur/enter
  const validatePeriod = (field, value) => {
    // Validate input
    if (!isValidPositiveNumber(value)) {
      // Revert local state to match main state
      setLocalPeriod(period);
      return;
    }
    
    const newPeriod = { ...period, [field]: value };
    
    // Validate min < max for period
    if (!isValidMinMax(newPeriod.min, newPeriod.max)) {
      // Revert local state to match main state
      setLocalPeriod(period);
      return;
    }
    
    // Additional validation for locked parameters
    if (lockedParameter === 'pulseWidth') {
      const periodMin = parseFloat(newPeriod.min) || 0;
      const periodMax = parseFloat(newPeriod.max) || 0;
      const pwMin = parseFloat(pulseWidth.min) || 0;
      const pwMax = parseFloat(pulseWidth.max) || 0;
      
      // Check if new values would result in negative intervals
      const newIntervalMin = periodMin - pwMin;
      const newIntervalMax = periodMax - pwMax;
      
      if (newIntervalMin < 0 || newIntervalMax < 0) {
        // Revert local state to match main state
        setLocalPeriod(period);
        return;
      }
    } else if (lockedParameter === 'interval') {
      const periodMin = parseFloat(newPeriod.min) || 0;
      const periodMax = parseFloat(newPeriod.max) || 0;
      const intMin = parseFloat(interval.min) || 0;
      const intMax = parseFloat(interval.max) || 0;
      
      // Check if new values would result in negative pulse widths
      const newPulseWidthMin = periodMin - intMin;
      const newPulseWidthMax = periodMax - intMax;
      
      if (newPulseWidthMin < 0 || newPulseWidthMax < 0) {
        // Revert local state to match main state
        setLocalPeriod(period);
        return;
      }
    }
    
    // Valid value, proceed with recalculation
    setPeriod(newPeriod);
    setLocalPeriod(newPeriod);
    updateWaveformDefinition();
    
    if (lockedParameter === 'pulseWidth') {
      // Pulse width is locked, recalculate interval
      const periodMin = parseFloat(newPeriod.min) || 0;
      const periodMax = parseFloat(newPeriod.max) || 0;
      const pwMin = parseFloat(pulseWidth.min) || 0;
      const pwMax = parseFloat(pulseWidth.max) || 0;
      
      const newIntervalMin = periodMin - pwMin;
      const newIntervalMax = periodMax - pwMax;
      
      setInterval({
        min: newIntervalMin.toString(),
        avg: calculateAvg(newIntervalMin.toString(), newIntervalMax.toString()),
        max: newIntervalMax.toString()
      });
      
      // Update local interval state to reflect the new calculated values
      setLocalInterval({
        min: newIntervalMin.toString(),
        avg: calculateAvg(newIntervalMin.toString(), newIntervalMax.toString()),
        max: newIntervalMax.toString()
      });
    } else if (lockedParameter === 'interval') {
      // Interval is locked, recalculate pulse width
      const periodMin = parseFloat(newPeriod.min) || 0;
      const periodMax = parseFloat(newPeriod.max) || 0;
      const intMin = parseFloat(interval.min) || 0;
      const intMax = parseFloat(interval.max) || 0;
      
      const newPulseWidthMin = periodMin - intMin;
      const newPulseWidthMax = periodMax - intMax;
      
      setPulseWidth({
        min: newPulseWidthMin.toString(),
        avg: calculateAvg(newPulseWidthMin.toString(), newPulseWidthMax.toString()),
        max: newPulseWidthMax.toString()
      });
      
      // Update local pulse width state to reflect the new calculated values
      setLocalPulseWidth({
        min: newPulseWidthMin.toString(),
        avg: calculateAvg(newPulseWidthMin.toString(), newPulseWidthMax.toString()),
        max: newPulseWidthMax.toString()
      });
    }
  };

  // Toggle lock for a parameter
  const toggleLock = (parameter) => {
    // Always ensure one parameter is locked - never allow null
    setLockedParameter(parameter); // Lock this parameter
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Advanced Pulse GUI</h1>
        
        {/* Top Control Section */}
        <div className="mb-6 pb-4 border-b border-gray-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Light Source:</label>
              <input
                type="text"
                value={lightSource}
                onChange={(e) => setLightSource(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter light source"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Work Mode:</label>
              <input
                type="text"
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter work mode"
              />
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleStart}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  isRunning 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isRunning ? <Square className="w-4 h-4 inline mr-2" /> : <Play className="w-4 h-4 inline mr-2" />}
                {isRunning ? 'Stop' : 'Start'}
              </button>
              <div className="flex items-center space-x-2">
                <div className={`w-12 h-6 rounded-full transition-colors ${
                  isRunning ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
                <span className="text-sm font-medium text-gray-700">
                  {isRunning ? 'On' : 'Off'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Waveform Type & Output Section */}
        <div className="mb-6 pb-4 border-b border-gray-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Waveform Type:</label>
              <input
                type="text"
                value={waveformType}
                onChange={(e) => setWaveformType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter waveform type"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Output Waveform:</label>
              <input
                type="text"
                value={outputWaveform}
                onChange={(e) => setOutputWaveform(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter output waveform"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Distribution:</label>
              <select
                value={distribution}
                onChange={(e) => setDistribution(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Uniform">Uniform</option>
                <option value="Normal">Normal</option>
                <option value="Exponential">Exponential</option>
              </select>
            </div>
          </div>
        </div>

        {/* Waveform Parameters Section */}
        <div className="mb-6">
          <div className="space-y-4">
            {/* Amplitude */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amplitude:</label>
              <div className="flex items-center space-x-4">
                                     <input
                       type="range"
                       min="0"
                       max="100"
                       step="0.1"
                       value={amplitude}
                       onChange={(e) => handleAmplitudeChange(e.target.value)}
                       className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                     />
                <span className="text-sm font-medium text-gray-700 min-w-[3rem]">{amplitude}</span>
              </div>
            </div>

            {/* Initial Delay */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Initial Delay:</label>
              <div className="flex items-center space-x-2">
                                       <input
                         type="text"
                         value={initialDelay}
                         onChange={(e) => handleInitialDelayChange(e.target.value)}
                         className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                         placeholder="Enter initial delay"
                       />
                <span className="text-sm text-gray-600">ms</span>
              </div>
            </div>

                         {/* Period */}
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Period:</label>
               <div className="grid grid-cols-3 gap-2 items-center">
                 <div>
                   <label className="block text-xs text-gray-600 mb-1">Min:</label>
                                        <input
                       type="text"
                       value={localPeriod.min}
                       onChange={(e) => setLocalPeriod({...localPeriod, min: e.target.value})}
                       onBlur={(e) => validatePeriod('min', e.target.value)}
                       onKeyDown={(e) => {
                         if (e.key === 'Enter') {
                           validatePeriod('min', e.target.value);
                         }
                       }}
                       className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                         lockedParameter === 'period' ? 'bg-gray-100 text-gray-600' : ''
                       }`}
                       placeholder="Min"
                       readOnly={lockedParameter === 'period'}
                     />
                 </div>
                 <div>
                   <label className="block text-xs text-gray-600 mb-1">Avg:</label>
                   <input
                     type="text"
                     value={calculateAvg(localPeriod.min, localPeriod.max)}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                     placeholder="Avg"
                     readOnly
                   />
                 </div>
                 <div className="flex items-end space-x-2">
                   <div className="flex-1">
                     <label className="block text-xs text-gray-600 mb-1">Max:</label>
                                            <input
                         type="text"
                         value={localPeriod.max}
                         onChange={(e) => setLocalPeriod({...localPeriod, max: e.target.value})}
                         onBlur={(e) => validatePeriod('max', e.target.value)}
                         onKeyDown={(e) => {
                           if (e.key === 'Enter') {
                             validatePeriod('max', e.target.value);
                           }
                         }}
                         className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                           lockedParameter === 'period' ? 'bg-gray-100 text-gray-600' : ''
                         }`}
                         placeholder="Max"
                         readOnly={lockedParameter === 'period'}
                       />
                   </div>
                   <span className="text-sm text-gray-600 mb-2">ms</span>
                   <button
                     onClick={() => toggleLock('period')}
                     className={`p-1 rounded transition-colors ${
                       lockedParameter === 'period' ? 'text-blue-600' : 'text-gray-600'
                     }`}
                   >
                     {lockedParameter === 'period' ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                   </button>
                   <Settings className="w-5 h-5 text-gray-600 mb-2" />
                 </div>
               </div>
             </div>

                           {/* Pulse Width */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pulse Width:</label>
                <div className="grid grid-cols-3 gap-2 items-center">
                                     <div>
                     <label className="block text-xs text-gray-600 mb-1">Min:</label>
                                                                 <input
                       type="text"
                       value={localPulseWidth.min}
                       onChange={(e) => setLocalPulseWidth({...localPulseWidth, min: e.target.value})}
                       onBlur={(e) => validatePulseWidth('min', e.target.value)}
                       onKeyDown={(e) => {
                         if (e.key === 'Enter') {
                           validatePulseWidth('min', e.target.value);
                         }
                       }}
                       className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                         lockedParameter === 'pulseWidth' ? 'bg-gray-100 text-gray-600' : ''
                       }`}
                       placeholder="Min"
                       readOnly={lockedParameter === 'pulseWidth'}
                     />
                   </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Avg:</label>
                                         <input
                       type="text"
                       value={calculateAvg(localPulseWidth.min, localPulseWidth.max)}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                       placeholder="Avg"
                       readOnly
                     />
                  </div>
                                     <div className="flex items-end space-x-2">
                     <div className="flex-1">
                       <label className="block text-xs text-gray-600 mb-1">Max:</label>
                                                <input
                           type="text"
                           value={localPulseWidth.max}
                           onChange={(e) => setLocalPulseWidth({...localPulseWidth, max: e.target.value})}
                           onBlur={(e) => validatePulseWidth('max', e.target.value)}
                           onKeyDown={(e) => {
                             if (e.key === 'Enter') {
                               validatePulseWidth('max', e.target.value);
                             }
                           }}
                           className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                             lockedParameter === 'pulseWidth' ? 'bg-gray-100 text-gray-600' : ''
                           }`}
                           placeholder="Max"
                           readOnly={lockedParameter === 'pulseWidth'}
                         />
                     </div>
                     <span className="text-sm text-gray-600 mb-2">ms</span>
                     <button
                       onClick={() => toggleLock('pulseWidth')}
                       className={`p-1 rounded transition-colors ${
                         lockedParameter === 'pulseWidth' ? 'text-blue-600' : 'text-gray-600'
                       }`}
                     >
                       {lockedParameter === 'pulseWidth' ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                     </button>
                     <Settings className="w-5 h-5 text-gray-600 mb-2" />
                   </div>
                </div>
              </div>

                             {/* Interval */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">Interval:</label>
                 <div className="grid grid-cols-3 gap-2 items-center">
                                    <div>
                   <label className="block text-xs text-gray-600 mb-1">Min:</label>
                                        <input
                       type="text"
                       value={localInterval.min}
                       onChange={(e) => setLocalInterval({...localInterval, min: e.target.value})}
                       onBlur={(e) => validateInterval('min', e.target.value)}
                       onKeyDown={(e) => {
                         if (e.key === 'Enter') {
                           validateInterval('min', e.target.value);
                         }
                       }}
                       className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                         lockedParameter === 'interval' ? 'bg-gray-100 text-gray-600' : ''
                       }`}
                       placeholder="Min"
                       readOnly={lockedParameter === 'interval'}
                     />
                 </div>
                   <div>
                     <label className="block text-xs text-gray-600 mb-1">Avg:</label>
                     <input
                       type="text"
                       value={calculateAvg(localInterval.min, localInterval.max)}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600"
                       placeholder="Avg"
                       readOnly
                     />
                   </div>
                   <div className="flex items-end space-x-2">
                     <div className="flex-1">
                       <label className="block text-xs text-gray-600 mb-1">Max:</label>
                       <input
                         type="text"
                         value={localInterval.max}
                         onChange={(e) => setLocalInterval({...localInterval, max: e.target.value})}
                         onBlur={(e) => validateInterval('max', e.target.value)}
                         onKeyDown={(e) => {
                           if (e.key === 'Enter') {
                             validateInterval('max', e.target.value);
                           }
                         }}
                         className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                           lockedParameter === 'interval' ? 'bg-gray-100 text-gray-600' : ''
                         }`}
                         placeholder="Max"
                         readOnly={lockedParameter === 'interval'}
                       />
                     </div>
                     <span className="text-sm text-gray-600 mb-2">ms</span>
                     <button
                       onClick={() => toggleLock('interval')}
                       className={`p-1 rounded transition-colors ${
                         lockedParameter === 'interval' ? 'text-blue-600' : 'text-gray-600'
                       }`}
                     >
                       {lockedParameter === 'interval' ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                     </button>
                     <Settings className="w-5 h-5 text-gray-600 mb-2" />
                   </div>
                 </div>
               </div>

            {/* Pulse Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pulse Count:</label>
              <div className="flex items-center space-x-2">
                                       <input
                         type="text"
                         value={pulseCount}
                         onChange={(e) => handlePulseCountChange(e.target.value)}
                         className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                         placeholder="Enter pulse count"
                       />
                <button
                  onClick={handleMaxPulseCount}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md font-medium transition-colors"
                >
                  Max
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Display Area */}
        <div className="mb-6">
          <div className="w-full h-64 bg-black rounded-lg flex items-center justify-center">
            <div className="text-white text-lg">Waveform Display Area</div>
          </div>
        </div>

        {/* Waveform Repeat Count & Show All */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Waveform Repeat Count:</label>
                               <input
                     type="text"
                     value={waveformRepeatCount}
                     onChange={(e) => handleWaveformRepeatCountChange(e.target.value)}
                     className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                     placeholder="Count"
                   />
            <button
              onClick={handleMaxRepeatCount}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md font-medium transition-colors"
            >
              Max
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showAll}
              onChange={(e) => setShowAll(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="text-sm font-medium text-gray-700">Show All</label>
          </div>
        </div>

        {/* Waveform Definition Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Waveform Definition</h2>
              <p className="text-sm text-gray-600 mt-1">
                Automatically generated from Period, Pulse Width, Interval, and Pulse Count parameters
              </p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={updateWaveformDefinition}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium transition-colors flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Update from Parameters</span>
              </button>
              <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md font-medium transition-colors flex items-center space-x-2">
                <Upload className="w-4 h-4" />
                <span>Import</span>
              </button>
              <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md font-medium transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-300">Output (%)</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b border-gray-300">Time Span (ms)</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {waveformDefinition.map((row, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={row.output}
                        onChange={(e) => handleWaveformDefinitionChange(index, 'output', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded bg-gray-100 text-gray-600"
                        readOnly
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={row.timeSpan}
                        onChange={(e) => handleWaveformDefinitionChange(index, 'timeSpan', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded bg-gray-100 text-gray-600"
                        readOnly
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
