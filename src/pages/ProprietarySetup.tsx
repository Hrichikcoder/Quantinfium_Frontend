import React, { useState } from "react";
import { Search, ArrowLeft, ChevronsUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

interface ProprietarySetupProps {
  onBack?: () => void;
}

const ProprietarySetup: React.FC<ProprietarySetupProps> = ({ onBack }) => {
  const navigate = useNavigate();
  
  // Left column state
  const [accountCapital, setAccountCapital] = useState("2500");
  const [assetName, setAssetName] = useState("BTCUSDT");
  const [amountPerBuy, setAmountPerBuy] = useState("50");
  const [timeFrame, setTimeFrame] = useState("1D");
  const [frequency, setFrequency] = useState("1x");
  const [loop, setLoop] = useState("Once");

  // Right column state
  const [exchange, setExchange] = useState("Kraken");
  const [allocationSpot, setAllocationSpot] = useState(50);
  const [allocationUSDT, setAllocationUSDT] = useState(50);
  const [leverage, setLeverage] = useState(5);
  const [positionSize, setPositionSize] = useState(0.5);
  const [direction, setDirection] = useState("Long only");
  const [orderType, setOrderType] = useState("Market Order");
  const [technicalIndicator, setTechnicalIndicator] = useState(true);
  const [defaultStrategy, setDefaultStrategy] = useState("Execute based on Derivative strategy");
  const [percentageToSpot, setPercentageToSpot] = useState(50);
  const [percentageToUSDT, setPercentageToUSDT] = useState(50);
  const [maxProfitRedeploy, setMaxProfitRedeploy] = useState(70);

  // Slider handlers
  const handleAllocationChange = (value: number) => {
    setAllocationSpot(value);
    setAllocationUSDT(100 - value);
  };

  const calculateEffectiveNotional = (value: number, isLeverage: boolean) => {
    const capital = parseFloat(accountCapital) || 0;
    const spotAllocation = (capital * allocationSpot) / 100;
    if (isLeverage) {
      return (spotAllocation * value).toFixed(0);
    } else {
      return (spotAllocation * leverage * value).toFixed(0);
    }
  };

  // Custom slider component
  const GradientSlider: React.FC<{
    min: number;
    max: number;
    value: number;
    onChange: (value: number) => void;
    step?: number;
    showLabels?: boolean;
    showValue?: boolean;
    effectiveValue?: string;
    valueFormat?: (val: number) => string;
  }> = ({ min, max, value, onChange, step = 1, showLabels = true, showValue = true, effectiveValue, valueFormat }) => {
    const [isDragging, setIsDragging] = useState(false);
    const sliderRef = React.useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      setIsDragging(true);
      updateValue(e);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && sliderRef.current) {
        const rect = sliderRef.current.getBoundingClientRect();
        const clientX = e.clientX;
        const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const newValue = min + percentage * (max - min);
        const steppedValue = Math.round(newValue / step) * step;
        onChange(Math.max(min, Math.min(max, steppedValue)));
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const updateValue = (e: React.MouseEvent<HTMLDivElement>) => {
      if (sliderRef.current) {
        const rect = sliderRef.current.getBoundingClientRect();
        const clientX = e.clientX;
        const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const newValue = min + percentage * (max - min);
        const steppedValue = Math.round(newValue / step) * step;
        onChange(Math.max(min, Math.min(max, steppedValue)));
      }
    };

    React.useEffect(() => {
      if (isDragging) {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);
        };
      }
    }, [isDragging]);

    const percentage = ((value - min) / (max - min)) * 100;
    const displayValue = valueFormat ? valueFormat(value) : `${value}${step < 1 ? '%' : step === 1 && max <= 10 ? 'x' : ''}`;

    return (
      <div className="slider-container relative">
        <div
          ref={sliderRef}
          className="relative h-5 cursor-pointer"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-green-500 via-yellow-400 to-red-500 rounded" />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-gray-400 shadow-sm cursor-pointer z-10"
            style={{ left: `calc(${percentage}% - 8px)` }}
          />
          {showLabels && (
            <>
              <div className="absolute left-0 -bottom-5 text-[10px] text-gray-500">{min}</div>
              <div className="absolute right-0 -bottom-5 text-[10px] text-gray-500">{max}</div>
            </>
          )}
        </div>
        {showValue && (
          <div className="mt-6 flex items-center gap-4">
            <div>
              <div className="text-sm text-gray-600">Selected Value</div>
              <div className="text-2xl font-bold">{displayValue}</div>
            </div>
            {effectiveValue && (
              <div>
                <div className="text-sm text-gray-600">Effective Notional Value</div>
                <div className="text-lg font-semibold">{effectiveValue} USD</div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <button
          onClick={() => {
            if (onBack) {
              onBack();
            } else {
              navigate("/dashboard");
            }
          }}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
          {/* Title and Tag */}
          <div className="flex items-center justify-center mb-8 gap-10">
                <h1 className="text-2xl font-semibold">Enter asset details & configuration</h1>
                <div className="flex items-center gap-2">
                    <button className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium">
                        QI Proprietary
                    </button>
                    <button className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium">
                        Deploy/Apply
                    </button>
                </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Account Capital */}
            <div>
              <Label htmlFor="accountCapital" className="text-sm font-medium text-gray-700 mb-2 block">
                Account capital ($)
              </Label>
              <Input
                id="accountCapital"
                type="number"
                value={accountCapital}
                onChange={(e) => setAccountCapital(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Asset Name */}
            <div>
              <Label htmlFor="assetName" className="text-sm font-medium text-gray-700 mb-2 block">
                Asset name<span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="assetName"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  className="w-full pr-10"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Amount per Buy */}
            <div>
              <Label htmlFor="amountPerBuy" className="text-sm font-medium text-gray-700 mb-2 block">
                Amount per Buy<span className="text-red-500">*</span> ($)
              </Label>
              <Input
                id="amountPerBuy"
                type="number"
                value={amountPerBuy}
                onChange={(e) => setAmountPerBuy(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum amount is 10 USD</p>
            </div>

            {/* Time Frame and Frequency in one row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="timeFrame" className="text-sm font-medium text-gray-700 mb-2 block">
                  Time frame<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="timeFrame"
                  value={timeFrame}
                  onChange={(e) => setTimeFrame(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <Label htmlFor="frequency" className="text-sm font-medium text-gray-700 mb-2 block">
                  Frequency<span className="text-red-500">*</span>
                </Label>
                <Input
                  id="frequency"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>

            {/* Loop */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Loop<span className="text-red-500">*</span>
              </Label>
              <RadioGroup value={loop} onValueChange={setLoop} className="flex gap-6">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="Once" id="once" />
                  <Label htmlFor="once" className="cursor-pointer">Once</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="Infinite" id="infinite" />
                  <Label htmlFor="infinite" className="cursor-pointer">Infinite</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="Custom" id="custom" />
                  <Label htmlFor="custom" className="cursor-pointer">Custom</Label>
                </div>
              </RadioGroup>
              <p className="text-xs text-gray-500 mt-1">Eg: 1 time for 1 day</p>
            </div>

            {/* Link */}
            <div>
              <a href="#" className="text-blue-600 text-sm hover:underline">
                See Timeframe/Freq
              </a>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Exchange */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <Label htmlFor="exchange" className="text-sm font-medium text-gray-700 mb-2 block">
                Exchange<span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="exchange"
                  value={exchange}
                  onChange={(e) => setExchange(e.target.value)}
                  className="w-full pr-10 h-12 text-lg font-bold bg-gray-100"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Allocation Split */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Allocation Split<span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-gray-600 mb-4">
                Split capital between Spot (Accumulation) and USDT (Collateral for Perp-Derivative)
              </p>
              <GradientSlider
                min={0}
                max={1}
                value={allocationSpot / 100}
                onChange={(value) => handleAllocationChange(value * 100)}
                step={0.01}
                showLabels={true}
                showValue={false}
              />
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <Label className="text-sm text-gray-600 mb-1 block">Spot pair</Label>
                  <Input
                    type="text"
                    value={`${allocationSpot}%`}
                    readOnly
                    className="bg-gray-100 text-lg font-bold text-gray-600"
                  />
                </div>
                <div>
                  <Label className="text-sm text-gray-600 mb-1 block">USDT Collateral</Label>
                  <Input
                    type="text"
                    value={`${allocationUSDT}%`}
                    readOnly
                    className="bg-gray-100 text-lg font-bold text-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* Perps-Derivative settings */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Perps-Derivative settings<span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-gray-600 mb-4">
                Configuration for leverage & position size per trade
              </p>
              
              <div className="mb-6">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Leverage<span className="text-red-500">*</span>
                </Label>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <GradientSlider
                      min={1}
                      max={10}
                      value={leverage}
                      onChange={setLeverage}
                      step={1}
                      showValue={false}
                    />
                  </div>
                  <div className="flex items-end gap-4 pt-2">
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Selected Value</div>
                      <Input
                        type="text"
                        value={`${leverage}x`}
                        readOnly
                        className="w-24 bg-gray-100 text-lg font-bold text-center h-10"
                      />
                    </div>
                    <div>
                      <div className="text-xs text-blue-500 font-bold mb-1">Effective Notional Value</div>
                      <div className="text-sm text-blue-500 font-bold">{calculateEffectiveNotional(leverage, true)} USD</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Position size per signal<span className="text-red-500">*</span>
                </Label>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <GradientSlider
                      min={0.1}
                      max={1}
                      value={positionSize}
                      onChange={setPositionSize}
                      step={0.01}
                      showValue={false}
                    />
                  </div>
                  <div className="flex items-end gap-4 pt-2">
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Selected Value</div>
                      <Input
                        type="text"
                        value={`${Math.round(positionSize * 100)}%`}
                        readOnly
                        className="w-24 bg-gray-100 text-lg font-bold text-center h-10"
                      />
                    </div>
                    <div>
                      <div className="text-xs text-blue-500 font-bold mb-1">Effective Notional Value</div>
                      <div className="text-sm text-blue-500 font-bold">{calculateEffectiveNotional(positionSize, false)} USD</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk control */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <Label className="text-sm font-medium text-gray-700 block">
                    Risk control<span className="text-red-500">*</span>
                  </Label>
                  <p className="text-xs text-gray-600 mt-1">
                    Trade management & settings for perps-derivative
                  </p>
                </div>
                <button className="text-blue-600 text-sm font-medium hover:underline">
                  + ADD
                </button>
              </div>

              <div className="space-y-0">
                <div className="pb-4">
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Direction</Label>
                  <RadioGroup value={direction} onValueChange={setDirection} className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="Long only" id="long" />
                      <Label htmlFor="long" className="cursor-pointer">Long only</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="Short only" id="short" />
                      <Label htmlFor="short" className="cursor-pointer">Short only</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="Long & Short (!)" id="both" />
                      <Label htmlFor="both" className="cursor-pointer">Long & Short (!)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="border-t border-gray-200 pt-4 pb-4">
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Order type</Label>
                  <RadioGroup value={orderType} onValueChange={setOrderType} className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="Market Order" id="market" />
                      <Label htmlFor="market" className="cursor-pointer">Market Order</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="Limit Order" id="limit" />
                      <Label htmlFor="limit" className="cursor-pointer">Limit Order</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="Stop limit Order" id="stop" />
                      <Label htmlFor="stop" className="cursor-pointer">Stop limit Order</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium text-gray-700">Signals</Label>
                    <button className="text-blue-600 text-sm font-medium hover:underline">
                      + BUY
                    </button>
                  </div>
                  <div className="border border-gray-200 rounded-md p-3 bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="technical"
                        checked={technicalIndicator}
                        onCheckedChange={(checked) => setTechnicalIndicator(checked as boolean)}
                      />
                      <Label htmlFor="technical" className="cursor-pointer font-bold">
                        TECHNICAL INDICATOR
                      </Label>
                    </div>
                    <ChevronsUpDown className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Spot pair risk control */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <Label className="text-sm font-medium text-gray-700 block">
                    Spot pair risk control<span className="text-red-500">*</span>
                  </Label>
                  <p className="text-xs text-gray-600 mt-1">
                    Trade management & settings for perps-derivative
                  </p>
                </div>
                <button className="text-blue-600 text-sm font-medium hover:underline">
                  + ADD
                </button>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2 block">Default strategy</Label>
                <div className="flex gap-2 flex-nowrap">
                  <button
                    onClick={() => setDefaultStrategy("Execute based on Derivative strategy")}
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors whitespace-nowrap ${
                      defaultStrategy === "Execute based on Derivative strategy"
                        ? "bg-green-600 text-white"
                        : "border border-green-600 text-green-600 hover:bg-green-50"
                    }`}
                  >
                    <span className="block leading-tight">Execute based on</span>
                    <span className="block leading-tight">Derivative strategy</span>
                  </button>
                  <button
                    onClick={() => setDefaultStrategy("Custom DCA")}
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors whitespace-nowrap ${
                      defaultStrategy === "Custom DCA"
                        ? "bg-green-600 text-white"
                        : "border border-green-600 text-green-600 hover:bg-green-50"
                    }`}
                  >
                    Custom DCA
                  </button>
                  <button
                    onClick={() => setDefaultStrategy("Load Strategy")}
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors whitespace-nowrap ${
                      defaultStrategy === "Load Strategy"
                        ? "bg-green-600 text-white"
                        : "border border-green-600 text-green-600 hover:bg-green-50"
                    }`}
                  >
                    Load Strategy
                  </button>
                  <button
                    onClick={() => setDefaultStrategy("Advanced")}
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors whitespace-nowrap ${
                      defaultStrategy === "Advanced"
                        ? "bg-green-600 text-white"
                        : "border border-green-600 text-green-600 hover:bg-green-50"
                    }`}
                  >
                    Advanced
                  </button>
                </div>
              </div>
            </div>

            {/* Profit routing system */}
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <Label className="text-sm font-bold text-gray-900 mb-1 block">
                Profit routing system<span className="text-red-500">*</span>
              </Label>
              <p className="text-sm text-gray-900 mb-6">
                How do you want the realised PnL to be re-used
              </p>

              <div className="space-y-0">
                {/* Percentage to Spot */}
                <div className="pb-6">
                  <Label className="text-sm font-bold text-gray-900 mb-2 block">
                    Percentage to Spot<span className="text-red-500">*</span> (Re-invest in asset)
                  </Label>
                  <div className="flex items-center gap-10">
                    <div className="w-[16rem] max-w-60">
                      <GradientSlider
                        min={1}
                        max={100}
                        value={percentageToSpot}
                        onChange={setPercentageToSpot}
                        step={1}
                        showValue={false}
                      />
                    </div>
                    <div className="flex-shrink-0">
                      <div className="text-sm text-gray-900 mb-1">Selected Value</div>
                      <Input
                        type="text"
                        value={`${percentageToSpot}%`}
                        readOnly
                        className="w-24 bg-gray-100 text-lg font-bold text-center h-10 border border-gray-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Percentage to USDT */}
                <div className="pb-6">
                  <Label className="text-sm font-bold text-gray-900 mb-2 block">
                    Percentage to USDT<span className="text-red-500">*</span>
                  </Label>
                  <div className="flex items-center gap-10">
                    <div className="w-[16rem] max-w-60">
                      <GradientSlider
                        min={1}
                        max={100}
                        value={percentageToUSDT}
                        onChange={setPercentageToUSDT}
                        step={1}
                        showValue={false}
                      />
                    </div>
                    <div className="flex-shrink-0">
                      <div className="text-sm text-gray-900 mb-1">Selected Value</div>
                      <Input
                        type="text"
                        value={`${percentageToUSDT}%`}
                        readOnly
                        className="w-24 bg-gray-100 text-lg font-bold text-center h-10 border border-gray-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-200 pb-6 pt-6">
                  {/* Maximum Profit to redeploy */}
                  <Label className="text-sm font-bold text-gray-900 mb-2 block">
                    Maximum Profit to redeploy on next trade
                  </Label>
                  <div className="flex items-center gap-10">
                    <div className="w-[16rem] max-w-60">
                      <GradientSlider
                        min={1}
                        max={100}
                        value={maxProfitRedeploy}
                        onChange={setMaxProfitRedeploy}
                        step={1}
                        showValue={false}
                      />
                    </div>
                    <div className="flex-shrink-0">
                      <div className="text-sm text-gray-900 mb-1">Selected Value</div>
                      <Input
                        type="text"
                        value={`${maxProfitRedeploy}%`}
                        readOnly
                        className="w-24 bg-gray-100 text-lg font-bold text-center h-10 border border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ProprietarySetup;

