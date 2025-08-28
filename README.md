# Advanced Pulse Train Interface

A modern web-based interface for configuring and controlling advanced pulse train waveforms with real-time parameter calculations and validation.

## Overview

The Advanced Pulse Train Interface provides an intuitive GUI for setting up complex pulse train configurations with interdependent parameters (Period, Pulse Width, and Interval). The interface features intelligent parameter locking, real-time calculations, and comprehensive validation to ensure physically valid configurations.

## Features

### 🎛️ **Parameter Management**
- **Period Control**: Set minimum and maximum period values with automatic average calculation
- **Pulse Width Control**: Configure pulse width ranges with real-time validation
- **Interval Control**: Manage interval parameters with automatic recalculation
- **Parameter Locking**: Lock any parameter to maintain its value while others adjust

### 🔒 **Smart Parameter Locking**
- **Period Locked**: When period is locked, changing pulse width automatically recalculates interval
- **Pulse Width Locked**: When pulse width is locked, changing period automatically recalculates interval
- **Interval Locked**: When interval is locked, changing period automatically recalculates pulse width

### ⚡ **Real-time Calculations**
- **Automatic Averages**: Calculates average values based on min/max ranges
- **Parameter Validation**: Ensures all parameters remain physically valid
- **Constraint Checking**: Prevents negative intervals or invalid configurations

### 🎨 **Modern Interface**
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Real-time Updates**: Instant feedback as you adjust parameters
- **Visual Indicators**: Clear indication of locked parameters and calculated values
- **Professional UI**: Clean, modern interface with intuitive controls

### 📊 **Waveform Configuration**
- **Amplitude Control**: Adjustable amplitude with slider interface
- **Initial Delay**: Configure initial delay timing
- **Pulse Count**: Set number of pulses with maximum value option
- **Distribution Types**: Support for Uniform, Normal, and Exponential distributions
- **Waveform Definition**: Custom waveform definition with output and time span controls

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ashley-z/advanced-pulse-train.git
   cd advanced-pulse-train
   ```

2. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

3. **Start the application**:
   ```bash
   npm start
   ```

4. **Open your browser** and navigate to `http://localhost:3000`

## Usage Guide

### Basic Parameter Configuration

1. **Set Initial Values**:
   - Configure Period: Min = 120ms, Max = 540ms
   - Configure Pulse Width: Min = 100ms, Max = 400ms
   - Configure Interval: Min = 20ms, Max = 140ms
   - Configure Pulse Count: 1 (max = 511)

2. **Lock a Parameter**:
   - Click the lock icon next to any parameter to lock it
   - Locked parameters will be grayed out and cannot be edited
   - Other parameters will automatically recalculate when you change unlocked values

3. **Adjust Parameters**:
   - Change any unlocked parameter value
   - Watch as dependent parameters automatically update
   - The interface prevents invalid configurations

### Advanced Features

#### Parameter Locking Examples

**Example 1: Lock Pulse Width**
- Set Pulse Width Min = 100ms, Max = 400ms
- Lock Pulse Width by clicking the lock icon
- Change Period Min from 120ms to 200ms
- Interval Min automatically calculates to 100ms (200 - 100 = 100)

**Example 2: Lock Period**
- Set Period Min = 120ms, Max = 540ms
- Lock Period by clicking the lock icon
- Change Pulse Width Min from 20ms to 50ms
- Interval Min automatically calculates to 70ms (120 - 50 = 70)

#### Waveform Definition
- **Automatic Generation**: Waveform definition table is automatically generated from parameters
- **Pulse Structure**: One pulse = one ON segment (pulse width) + one OFF segment (interval)
- **Period Relationship**: Period = Pulse Width + Interval
- **Waveform Structure**: Waveform consists of (pulse × pulse count) segments
- **Output Values**: ON segments use amplitude percentage, OFF segments use 0%
- **Time Spans**: Randomly sampled from min/max ranges using Mersenne Twister uniform distribution
- **Pulse Count**: Maximum of 511 pulses supported
- **Example**: For 2 pulses with amplitude 10%, the table shows: 10%, 0%, 10%, 0% (2 pulses × 2 segments = 4 segments total)
- **Random Sampling**: Each time span value is randomly generated within the specified min/max ranges

## Technical Details

### Core Mathematical Relationship
The interface enforces the fundamental relationship:
```
Period = Pulse Width + Interval
```

This relationship is the cornerstone of all calculations and validations in the system.

### Parameter Locking System
The system implements an intelligent parameter locking mechanism where **exactly one parameter must always be locked**:

- **Period Locked**: When period is locked, changing pulse width automatically recalculates interval
- **Pulse Width Locked**: When pulse width is locked, changing period automatically recalculates interval  
- **Interval Locked**: When interval is locked, changing period automatically recalculates pulse width

### Validation Rules

#### 1. Basic Input Validation
```javascript
// All parameters must be positive numbers
const isValidPositiveNumber = (value) => {
  const num = parseFloat(value);
  return !isNaN(num) && num >= 0;
};

// Min values must be less than or equal to Max values
const isValidMinMax = (min, max) => {
  const minVal = parseFloat(min) || 0;
  const maxVal = parseFloat(max) || 0;
  return minVal <= maxVal;
};
```

#### 2. Mathematical Constraint Validation
The system prevents invalid configurations by checking:

**When Period is Locked:**
- Changing pulse width: Ensures `Period - Pulse Width ≥ 0` (no negative intervals)
- Changing interval: Ensures `Period - Interval ≥ 0` (no negative pulse widths)

**When Pulse Width is Locked:**
- Changing period: Ensures `Period - Pulse Width ≥ 0` (no negative intervals)

**When Interval is Locked:**
- Changing period: Ensures `Period - Interval ≥ 0` (no negative pulse widths)

#### 3. Real-time Calculation Examples

**Example 1: Period Locked**
```
Initial State:
- Period: Min = 120ms, Max = 540ms (locked)
- Pulse Width: Min = 100ms, Max = 400ms
- Interval: Min = 20ms, Max = 140ms

Action: Change Pulse Width Min to 50ms
Calculation: 
- New Interval Min = 120 - 50 = 70ms
- New Interval Max = 540 - 400 = 140ms
Result: Interval updates to Min = 70ms, Max = 140ms
```

**Example 2: Pulse Width Locked**
```
Initial State:
- Period: Min = 120ms, Max = 540ms
- Pulse Width: Min = 100ms, Max = 400ms (locked)
- Interval: Min = 20ms, Max = 140ms

Action: Change Period Min to 200ms
Calculation:
- New Interval Min = 200 - 100 = 100ms
- New Interval Max = 540 - 400 = 140ms
Result: Interval updates to Min = 100ms, Max = 140ms
```

**Example 3: Interval Locked**
```
Initial State:
- Period: Min = 120ms, Max = 540ms
- Pulse Width: Min = 100ms, Max = 400ms
- Interval: Min = 20ms, Max = 140ms (locked)

Action: Change Period Min to 150ms
Calculation:
- New Pulse Width Min = 150 - 20 = 130ms
- New Pulse Width Max = 540 - 140 = 400ms
Result: Pulse Width updates to Min = 130ms, Max = 400ms
```

### Average Calculation
All parameters automatically calculate their average values:
```javascript
const calculateAvg = (min, max) => {
  const minVal = parseFloat(min) || 0;
  const maxVal = parseFloat(max) || 0;
  return ((minVal + maxVal) / 2).toFixed(1);
};
```

### Random Sampling for Waveform Definition
Time span values in the waveform definition table are randomly sampled using Mersenne Twister uniform distribution:
```javascript
// Initialize Mersenne Twister generator
const mt = new MersenneTwister();

// Generate random value within min/max range
const generateRandomValue = (min, max) => {
  const minVal = parseFloat(min) || 0;
  const maxVal = parseFloat(max) || 0;
  if (minVal === maxVal) return minVal;
  
  // Use Mersenne Twister for uniform distribution
  return minVal + (mt.random() * (maxVal - minVal));
};
```

**Sampling Process:**
- **Pulse Width Segments**: Randomly sampled from pulse width min/max range
- **Interval Segments**: Randomly sampled from interval min/max range
- **Distribution**: Uniform distribution using Mersenne Twister algorithm
- **Precision**: Values rounded to 1 decimal place

**Segment Structure:**
- **One pulse** = **2 segments** (1 ON segment + 1 OFF segment)
- **N pulses** = **2N segments** total (N ON segments + N OFF segments)
- **Period** = Pulse Width + Interval (one complete pulse cycle)
- **Waveform** = (pulse × pulse count) segments
- **Example**: 2 pulses = 4 segments (ON, OFF, ON, OFF)
- **Example**: 3 pulses = 6 segments (ON, OFF, ON, OFF, ON, OFF)

### State Management Architecture
- **Main State**: Stores the actual validated parameter values
- **Local State**: Manages user input and display values
- **Synchronization**: Automatic sync between main and local states with validation
- **Validation Triggers**: Real-time validation on blur and Enter key press

### Validation Flow
1. **Input Validation**: Check if value is a positive number
2. **Range Validation**: Ensure min ≤ max for the parameter
3. **Constraint Validation**: Check mathematical relationships based on locked parameter
4. **State Update**: Update both main and local states if validation passes
5. **Recalculation**: Automatically recalculate dependent parameters
6. **UI Update**: Synchronize local state to reflect calculated values

## Project Structure

```
frontend/
├── src/
│   ├── App.js                 # Main application component
│   ├── components/            # React components
│   │   ├── ConnectionStatus.js
│   │   ├── ExportPanel.js
│   │   ├── FigmaFileViewer.js
│   │   ├── FileInfo.js
│   │   └── CommentsPanel.js
│   ├── index.js              # Application entry point
│   └── index.css             # Global styles
├── public/                   # Static assets
├── package.json             # Dependencies and scripts
└── README.md               # Frontend documentation
```

## Development

### Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject from Create React App
npm run eject
```

### Key Components

- **App.js**: Main application with parameter management logic
- **Parameter Inputs**: Real-time validation and calculation
- **Lock Controls**: Parameter locking functionality
- **Waveform Display**: Visual representation of pulse train
- **Export/Import**: Configuration management

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions, issues, or feature requests, please open an issue on GitHub or contact the development team.

---

**Advanced Pulse Train Interface** - Making complex pulse train configuration simple and intuitive.
