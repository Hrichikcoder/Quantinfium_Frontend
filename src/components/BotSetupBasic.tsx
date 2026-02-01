import React from "react";
import { Search, ArrowLeft, ArrowRight } from "lucide-react";

const BotSetupBasic = ({
  step2Form,
  currentMainStep,
  setCurrentMainStep,
  handleNextStep,
  getLoopDescription,
  availableAssetsList = [],
}) => (
  <div className="bg-white rounded-lg p-6 shadow-lg max-w-lg mx-auto border border-gray-200 relative">
    {/* Left Arrow Button */}
    {currentMainStep === 2 && (
      <button
        className="absolute -left-12 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors"
        onClick={() => setCurrentMainStep(1)}
      >
        <ArrowLeft className="w-6 h-6" />
      </button>
    )}
    {/* Right Arrow Button */}
    {currentMainStep === 2 && (
      <button
        className="absolute -right-12 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors"
        onClick={handleNextStep}
      >
        <ArrowRight className="w-6 h-6" />
      </button>
    )}
    {/* Section Title */}
    <div className="text-center mb-6">
      <h3 className="text-2xl font-bold text-black mb-2">Enter asset details</h3>
      <div className="w-full h-0.5 bg-green-500 mx-auto"></div>
    </div>
    <div className="space-y-6">
      {/* Asset Name */}
      <div>
        <label className="block text-sm font-medium text-black mb-2">Asset name*</label>
        <div className="relative">
          <select
            {...step2Form.register("assetName")}
            className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-bold text-black bg-white ${step2Form.formState.errors.assetName ? 'border-red-300' : 'border-gray-300'}`}
          >
            <option value="">Select asset</option>
            {availableAssetsList && availableAssetsList.map((asset) => (
              <option key={asset} value={asset}>{asset}</option>
            ))}
          </select>
        </div>
        {step2Form.formState.errors.assetName && (
          <div className="text-red-600 text-sm mt-1">{step2Form.formState.errors.assetName.message}</div>
        )}
      </div>
      {/* Amount per Buy */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-black">Amount per Buy* ($)</label>
        </div>
        <input
          type="number"
          {...step2Form.register("amountPerBuy", { valueAsNumber: true })}
          className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-bold text-black ${step2Form.formState.errors.amountPerBuy ? 'border-red-300' : 'border-gray-300'}`}
        />
        {step2Form.formState.errors.amountPerBuy && (
          <div className="text-red-600 text-sm mt-1">{step2Form.formState.errors.amountPerBuy.message}</div>
        )}
      </div>
      {/* Time Frame and Frequency - Side by Side */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-black mb-2">Time frame*</label>
          <select
            {...step2Form.register("timeFrame")}
            className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-bold text-black bg-white ${step2Form.formState.errors.timeFrame ? 'border-red-300' : 'border-gray-300'}`}
          >
            <option value="">Select time frame</option>
            <option value="1Min">1 Minute</option>
            <option value="5Min">5 Minutes</option>
            <option value="15Min">15 Minutes</option>
            <option value="30Min">30 Minutes</option>
            <option value="1Hour">1 Hour</option>
            <option value="1Day">1 Day</option>
            <option value="1Week">1 Week</option>
            <option value="1Month">1 Month</option>
            <option value="3Months">3 Months</option>
            <option value="6Months">6 Months</option>
            <option value="1Year">1 Year</option>
          </select>
          {step2Form.formState.errors.timeFrame && (
            <div className="text-red-600 text-sm mt-1">{step2Form.formState.errors.timeFrame.message}</div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-black mb-2">Frequency*</label>
          <input
            type="number"
            {...step2Form.register("frequency", { valueAsNumber: true })}
            className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus-border-transparent text-lg font-bold text-black ${step2Form.formState.errors.frequency ? 'border-red-300' : 'border-gray-300'}`}
          />
          {step2Form.formState.errors.frequency && (
            <div className="text-red-600 text-sm mt-1">{step2Form.formState.errors.frequency.message}</div>
          )}
        </div>
      </div>
      {/* Loop radio group */}
      <div>
        <label className="block text-sm font-medium text-black mb-3">Loop*</label>
        <div className="flex space-x-6 mb-2">
          {["Once", "Infinite", "Custom"].map((option) => {
            const currentValue = step2Form.watch("loop");
            return (
              <label key={option} className="flex items-center">
                <input
                  type="radio"
                  name="loop"
                  value={option}
                  checked={currentValue === option}
                  className="w-4 h-4 text-green-500 border-green-500 focus:ring-green-500"
                  onChange={() => {
                    step2Form.setValue("loop", option);
                    if (option === "Custom") {
                      step2Form.setValue("amountOfTimes", 1);
                    } else {
                      step2Form.setValue("amountOfTimes", undefined);
                    }
                  }}
                />
                <span className="ml-2 text-sm text-black">{option}</span>
              </label>
            );
          })}
        </div>
        {step2Form.formState.errors.loop && (
          <div className="text-red-600 text-sm mt-1">{step2Form.formState.errors.loop.message}</div>
        )}
        <p className="text-blue-600 text-xs">{getLoopDescription && getLoopDescription()}</p>
        {step2Form.watch("loop") === "Custom" && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-black mb-2">Amount of times*</label>
            <input
              type="number"
              {...step2Form.register("amountOfTimes", { valueAsNumber: true })}
              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus-border-transparent text-lg font-bold text-black ${step2Form.formState.errors.amountOfTimes ? 'border-red-300' : 'border-gray-300'}`}
            />
            {step2Form.formState.errors.amountOfTimes && (
              <div className="text-red-600 text-sm mt-1">{step2Form.formState.errors.amountOfTimes.message}</div>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
);

export default BotSetupBasic;
