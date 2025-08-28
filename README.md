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
- Configure custom waveform segments with output percentage and time span
- Add multiple segments for complex pulse patterns
- Export and import waveform configurations

## Technical Details

### Parameter Relationships
The interface enforces the fundamental relationship:
```
Period = Pulse Width + Interval
```

### Validation Rules
- All parameters must be positive numbers
- Min values must be less than or equal to Max values
- When a parameter is locked, dependent parameters are recalculated
- Invalid configurations are prevented with real-time validation

### State Management
- **Main State**: Stores the actual parameter values
- **Local State**: Manages user input and display values
- **Synchronization**: Automatic sync between main and local states
- **Validation**: Real-time validation on blur and Enter key press

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
