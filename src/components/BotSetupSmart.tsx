import React from "react";
import {
  Search, ArrowLeft, ArrowRight, Check, ChevronsUpDown,
  ChevronUp, ChevronDown, Trash2
} from "lucide-react";

const BotSetupSmart = ({
  step2Form,
  currentMainStep,
  setCurrentMainStep,
  handleNextStep,
  getLoopDescription,
  hasSelectedMetrics,
  buyAmtDisabledTooltip,
  addedMetrics,
  handleResetMetrics,
  setShowAddMetricsModal,
  handleToggleEnabledMetric,
  toggleGroupExpand,
  handleToggleExpandMetric,
  handleRemoveMetric,
  handleUpdateMetric,
  getMetricKeyFromName,
  supportsRiskMetric,
  riskMetricAdded,
  fearGreedAdded,
  handleAddMetric,
  startMetricDrag,
  updateMetricFromClientX,
  availableAssetsList = [],
}) => (
  // Smart DCA Layout
  <div className="bg-white rounded-lg p-6 shadow-lg max-w-6xl mx-auto border border-gray-200 relative">

    {/* Arrow buttons */}
    <button className="absolute -left-12 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors" onClick={() => setCurrentMainStep(1)}>
      <ArrowLeft className="w-6 h-6" />
    </button>
    <button className="absolute -right-12 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors" onClick={handleNextStep}>
      <ArrowRight className="w-6 h-6" />
    </button>

    {/* Main Header */}
    <div className="text-center mb-6">
      <h3 className="text-2xl font-bold text-black mb-2">Step 2 asset details page</h3>
      <div className="w-full h-0.5 bg-green-500 mx-auto"></div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

      {/* Left Panel: Asset Details */}
      <div className="space-y-6">

        {/* Left Panel Title */}
        <div className="flex items-center gap-2 mb-4">
          <h4 className="text-lg font-semibold text-black">Enter asset details & configuration</h4>
          <div className="inline-block bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">DCA Smart</div>
        </div>

        {/* Asset Name */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">Asset name*</label>
          <div className="relative">
            <select
              {...step2Form.register("assetName")}
              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-bold text-black bg-white ${step2Form.formState.errors.assetName ? 'border-red-300' : 'border-gray-300'
                }`}
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
          <div className="relative group">
            <input
              type="number"
              {...step2Form.register("amountPerBuy", { valueAsNumber: true })}
              disabled={hasSelectedMetrics}
              title={hasSelectedMetrics ? buyAmtDisabledTooltip : undefined}
              className={`w-full px-4 py-3 border rounded-md focus:outline-none ${hasSelectedMetrics ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'focus:ring-2 focus:ring-green-500 focus-border-transparent text-lg font-bold text-black'} ${step2Form.formState.errors.amountPerBuy ? 'border-red-300' : 'border-gray-300'
                }`}
            />
            {hasSelectedMetrics && (
              <div className="pointer-events-none absolute inset-0" title={buyAmtDisabledTooltip} />
            )}
          </div>
          {step2Form.formState.errors.amountPerBuy && (
            <div className="text-red-600 text-sm mt-1">{step2Form.formState.errors.amountPerBuy.message}</div>
          )}
          {hasSelectedMetrics && (
            <div className="text-xs text-gray-500 mt-1">
              This field is disabled because a metric has been selected. The selected metric's 'Amount per Buy' will override this value.
            </div>
          )}
        </div>

        {/* Time Frame and Frequency */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-2">Time frame*</label>
            <select
              {...step2Form.register("timeFrame")}
              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus-border-transparent text-lg font-bold text-black bg-white ${step2Form.formState.errors.timeFrame ? 'border-red-300' : 'border-gray-300'
                }`}
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
              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus-border-transparent text-lg font-bold text-black ${step2Form.formState.errors.frequency ? 'border-red-300' : 'border-gray-300'
                }`}
            />
            {step2Form.formState.errors.frequency && (
              <div className="text-red-600 text-sm mt-1">{step2Form.formState.errors.frequency.message}</div>
            )}
          </div>
        </div>

        {/* Loop */}
        <div>
          <label className="block text-sm font-medium text-black mb-3">Loop*</label>
          <div className="flex space-x-6 mb-2">
            {["Once", "Infinite", "Custom"].map((option) => (
              <label key={option} className="flex items-center">
                <input
                  type="radio"
                  name="loop"
                  value={option}
                  checked={step2Form.watch("loop") === option}
                  className="w-4 h-4 text-green-500 border-green-500 focus:ring-green-500"
                  onChange={(e) => {
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
            ))}
          </div>
          {step2Form.formState.errors.loop && (
            <div className="text-red-600 text-sm mt-1">{step2Form.formState.errors.loop.message}</div>
          )}
          <p className="text-blue-600 text-xs">{getLoopDescription()}</p>

          {/* Amount of Times - Only shown when Custom is selected */}
          {step2Form.watch("loop") === "Custom" && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-black mb-2">Amount of times*</label>
              <input
                type="number"
                {...step2Form.register("amountOfTimes", { valueAsNumber: true })}
                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus-border-transparent text-lg font-bold text-black ${step2Form.formState.errors.amountOfTimes ? 'border-red-300' : 'border-gray-300'
                  }`}
              />
              {step2Form.formState.errors.amountOfTimes && (
                <div className="text-red-600 text-sm mt-1">{step2Form.formState.errors.amountOfTimes.message}</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Risk Metrics Selection */}
      <div className="space-y-6">

        <div className="flex justify-between items-center">
          <h4 className="text-lg font-semibold text-black">Risk Metrics Selection (Upto 10, {addedMetrics.length} Added)</h4>
          <div className="flex w-44 items-center">
            <button className="flex items-center text-gray-500 hover:text-gray-700 text-sm font-medium ml-[-5px]" onClick={handleResetMetrics} disabled={addedMetrics.length === 0}>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Reset</span>
            </button>
            <div className="flex-grow" />
            <button className={`flex items-center text-sm font-medium ${addedMetrics.length >= 10 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setShowAddMetricsModal(true)} disabled={addedMetrics.length >= 10}>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Risk Metric Cards */}
        <div className="space-y-4">

          {/* Added metrics list */}
          {addedMetrics.length > 0 && (
            <div className="space-y-3">
              {addedMetrics.map((m, idx) => (
                <div key={m.id} className="border rounded-md p-3 bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        aria-pressed={m.enabled}
                        title={m.enabled ? 'Enabled' : 'Disabled'}
                        className={`grid place-items-center w-5 h-5 rounded-[3px] border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${m.enabled ? 'bg-green-600 border-green-600' : 'bg-white border-gray-400'}`}
                        onClick={() => handleToggleEnabledMetric(m.id)}
                      >
                        <Check className={`w-3 h-3 ${m.enabled ? 'text-white' : 'text-transparent'}`} strokeWidth={3} />
                      </button>
                      <div className="font-semibold text-sm text-black">{m.name}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Double chevron: expand/collapse all of same group */}
                      <button className="p-1 text-sky-600 hover:text-black" onClick={() => toggleGroupExpand(getMetricKeyFromName(m.name))} title="Expand/Collapse all in this group"><ChevronsUpDown className="w-4 h-4" /></button>
                      {/* Single chevron: just this card */}
                      <button className="p-1 text-gray-600 hover:text-black" onClick={() => handleToggleExpandMetric(m.id)} title="Expand/Collapse">{m.expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</button>
                      <button className="p-1 text-red-600 hover:text-red-700" onClick={() => handleRemoveMetric(m.id)} title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  {m.expanded && (
                    <div className="mt-3 space-y-4">

                      {/* Technical Indicator editor (Advance) */}
                      {getMetricKeyFromName(m.name) === 'TECHNICAL' && (
                        <div className="border rounded-md shadow-sm">
                          {/* Body */}
                          <div className="p-4 grid grid-cols-2 gap-6">
                            {/* Select indicator */}
                            <div>
                              <div className="text-[11px] text-gray-500 mb-1">Select indicator*</div>
                              <div className="relative">
                                <input type="text" className="w-full border rounded px-3 py-2 text-sm pr-14" value={m.indicatorName || 'RSI'} onChange={(e) => handleUpdateMetric(m.id, { indicatorName: e.target.value })} />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                  <button className="w-6 h-6 grid place-items-center border rounded text-xs" title="Add">+</button>
                                  <button className="w-6 h-6 grid place-items-center border rounded" title="Search"><Search className="w-3 h-3" /></button>
                                </div>
                              </div>
                            </div>
                            {/* Indicator period */}
                            <div>
                              <div className="flex items-center justify-between">
                                <div className="text-[11px] text-gray-500 mb-1">Indicator period*</div>
                                <div className="text-[10px] text-gray-400">Default 14 Period</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <input type="number" className="w-24 border rounded px-3 py-2 text-sm" value={m.indicatorPeriod ?? 14} onChange={(e) => handleUpdateMetric(m.id, { indicatorPeriod: Number(e.target.value) })} />
                                <div className="flex items-center gap-1">
                                  <button className="w-7 h-7 grid place-items-center border rounded" onClick={() => handleUpdateMetric(m.id, { indicatorPeriod: (m.indicatorPeriod ?? 14) + 1 })}>▲</button>
                                  <button className="w-7 h-7 grid place-items-center border rounded" onClick={() => handleUpdateMetric(m.id, { indicatorPeriod: Math.max(1, (m.indicatorPeriod ?? 14) - 1) })}>▼</button>
                                </div>
                              </div>
                            </div>
                            {/* Action */}
                            <div>
                              <div className="text-[11px] text-gray-500 mb-1">Action*</div>
                              <div className="flex items-center gap-3">
                                <button className={`px-4 py-2 rounded font-semibold text-xs ${m.tradeAction === 'BUY' ? 'bg-green-600 text-white' : 'bg-gray-100'}`} onClick={() => handleUpdateMetric(m.id, { tradeAction: 'BUY' })}>BUY</button>
                                <button className={`px-4 py-2 rounded font-semibold text-xs ${m.tradeAction === 'SELL' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-400'}`} onClick={() => handleUpdateMetric(m.id, { tradeAction: 'SELL' })}>SELL</button>
                                <button
                                  className="text-[12px] text-blue-600"
                                  onClick={() => {
                                    handleUpdateMetric(m.id, {
                                      actions: [...(m.actions || []), {
                                        id: (m.actions?.length || 0),
                                        type: 'BUY',
                                        condition: 'Less than',
                                        value: '25',
                                        tradeManagement: {
                                          amountPerBuyDollars: '100',
                                          amountPerBuyPercentage: '1'
                                        },
                                        levels: []
                                      }]
                                    });
                                  }}
                                >
                                  + Add actions ({5 - (m.actions?.length || 0)})
                                </button>
                              </div>
                            </div>

                            {/* Condition + Value */}
                            <div className="col-span-2 grid grid-cols-[1fr_160px] gap-4 items-end">
                              <div>
                                <div className="text-[11px] text-gray-500 mb-1">Condition*</div>
                                <select className="w-full border rounded px-3 py-2 text-sm" value={m.condition} onChange={(e) => handleUpdateMetric(m.id, { condition: e.target.value as any })}>
                                  <option>Less than</option>
                                  <option>Greater than</option>
                                  <option>Equal to</option>
                                  <option>In between</option>
                                </select>
                              </div>
                              <div>
                                <div className="text-[11px] text-gray-500 mb-1">Value*</div>
                                {m.condition !== 'In between' ? (
                                  <div className="relative w-full">
                                    <input type="number" className="w-full border rounded px-3 py-2 text-sm pr-8" value={m.selectedValue} onChange={(e) => handleUpdateMetric(m.id, { selectedValue: Number(e.target.value) })} />
                                    <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col">
                                      <button className="w-6 h-4 grid place-items-center border rounded-t" onClick={() => handleUpdateMetric(m.id, { selectedValue: m.selectedValue + (m.step || 1) })}>▲</button>
                                      <button className="w-6 h-4 grid place-items-center border rounded-b -mt-[1px]" onClick={() => handleUpdateMetric(m.id, { selectedValue: m.selectedValue - (m.step || 1) })}>▼</button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="relative w-28">
                                      <input type="number" className="w-full border rounded px-3 py-2 text-sm pr-8" value={m.selectedMinValue ?? 20} onChange={(e) => handleUpdateMetric(m.id, { selectedMinValue: Number(e.target.value) })} />
                                      <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col">
                                        <button className="w-6 h-4 grid place-items-center border rounded-t" onClick={() => handleUpdateMetric(m.id, { selectedMinValue: (m.selectedMinValue ?? 20) + (m.step || 1) })}>▲</button>
                                        <button className="w-6 h-4 grid place-items-center border rounded-b -mt-[1px]" onClick={() => handleUpdateMetric(m.id, { selectedMinValue: (m.selectedMinValue ?? 20) - (m.step || 1) })}>▼</button>
                                      </div>
                                    </div>
                                    <div className="relative w-28">
                                      <input type="number" className="w-full border rounded px-3 py-2 text-sm pr-8" value={m.selectedMaxValue ?? 80} onChange={(e) => handleUpdateMetric(m.id, { selectedMaxValue: Number(e.target.value) })} />
                                      <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col">
                                        <button className="w-6 h-4 grid place-items-center border rounded-t" onClick={() => handleUpdateMetric(m.id, { selectedMaxValue: (m.selectedMaxValue ?? 80) + (m.step || 1) })}>▲</button>
                                        <button className="w-6 h-4 grid place-items-center border rounded-b -mt-[1px]" onClick={() => handleUpdateMetric(m.id, { selectedMaxValue: (m.selectedMaxValue ?? 80) - (m.step || 1) })}>▼</button>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Trade management */}
                            <div className="col-span-2">
                              <div className="flex items-center justify-between">
                                <div className="text-[11px] text-sky-600">Trade management</div>
                                <button className="text-[12px] text-blue-600">+ Add levels (5)</button>
                              </div>
                              <div className="grid grid-cols-[160px_40px_160px] items-end gap-4 mt-2">
                                <div>
                                  <div className="text-[11px] text-gray-500 mb-1">Amount per Buy* ($)</div>
                                  <input type="number" className="w-40 border rounded px-3 py-2 text-sm" value={m.amountPerBuy} onChange={(e) => handleUpdateMetric(m.id, { amountPerBuy: Number(e.target.value) })} />
                                </div>
                                <div className="text-center text-[11px] text-gray-500 mb-2">OR</div>
                                <div>
                                  <div className="text-[11px] text-gray-500 mb-1">Amount per Buy* (%)</div>
                                  <input type="number" className="w-40 border rounded px-3 py-2 text-sm" value={m.percentPerBuy ?? 1} onChange={(e) => handleUpdateMetric(m.id, { percentPerBuy: Number(e.target.value) })} />
                                  <div className="text-[10px] text-gray-400 mt-1">(%) percentage calculated from total available capital</div>
                                </div>
                              </div>
                            </div>

                            {/* Dynamic rules list */}
                            <div className="col-span-2 space-y-4 mt-3">
                              {(m.techRules || []).map((rule) => (
                                <div key={rule.id} className="grid grid-cols-2 gap-6">
                                  {rule.action === 'BUY' ? (
                                    <>
                                      <div>
                                        <div className="text-[13px] text-gray-500 font-semibold">Amount per Buy* ($)</div>
                                        <input type="number" className="w-40 border rounded px-3 py-2 text-sm" value={rule.amountPerBuy ?? m.amountPerBuy ?? 100} readOnly />
                                      </div>
                                      <div>
                                        <div className="text-[13px] text-gray-500 font-semibold">Amount per Buy* (%)</div>
                                        <div className="text-[10px] text-gray-400">(%) percentage calculated from total available capital</div>
                                        <input type="number" className="w-40 border rounded px-3 py-2 text-sm" value={rule.percentPerBuy ?? m.percentPerBuy ?? 1} readOnly />
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div>
                                        <div className="text-[13px] text-gray-500 font-semibold">Trade (%) to sell/take profit</div>
                                        <div className="text-[10px] text-gray-400">(%) percentage will be calculated based on position/trade size</div>
                                        <input type="number" className="w-40 border rounded px-3 py-2 text-sm" value={rule.sellPercent ?? m.sellPercent ?? 100} readOnly />
                                      </div>
                                      <div>
                                        <div className="text-[13px] text-gray-500 font-semibold">Take profit or sell level*</div>
                                        <div className="text-[10px] text-gray-400">Default level: 100% of position size</div>
                                        <input type="number" className="w-40 border rounded px-3 py-2 text-sm" value={rule.sellLevel ?? m.sellLevel ?? 100} readOnly />
                                      </div>
                                    </>
                                  )}
                                  <div className="col-span-2 flex justify-end">
                                    <button className="text-[12px] text-red-500" onClick={() => { }}>Remove</button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Interactive slider (non-technical metrics only) */}
                      {getMetricKeyFromName(m.name) !== 'TECHNICAL' && (m.condition !== 'In between' ? (
                        <div
                          className="relative h-5"
                          onMouseDown={(e) => {
                            const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                            startMetricDrag(m.id, { left: rect.left, width: rect.width }, 'single');
                            updateMetricFromClientX(e.clientX);
                          }}
                          onTouchStart={(e) => {
                            const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                            const clientX = e.touches[0].clientX;
                            startMetricDrag(m.id, { left: rect.left, width: rect.width }, 'single');
                            updateMetricFromClientX(clientX);
                          }}
                        >
                          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-green-500 via-yellow-400 to-red-500 rounded" />
                          <div className="absolute top-1/2 -translate-y-1/2" style={{ left: `calc(${((m.selectedValue - m.min) / (m.max - m.min)) * 100}% - 6px)` }}>
                            <div className="w-3 h-3 rounded-full bg-white border border-gray-400 shadow-sm" />
                          </div>
                          <div className="absolute left-0 -bottom-4 text-[10px] text-gray-500">0</div>
                          <div className="absolute left-1/2 -translate-x-1/2 -bottom-4 text-[10px] text-gray-500">{((m.min + m.max) / 2)}</div>
                          <div className="absolute right-0 -bottom-4 text-[10px] text-gray-500">{m.max}</div>
                        </div>
                      ) : (
                        <div
                          className="relative h-5"
                          onMouseDown={(e) => {
                            const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                            // Determine nearest handle to grab initially
                            const clickX = e.clientX;
                            const relative = (clickX - rect.left) / rect.width;
                            const distMin = Math.abs(((m.selectedMinValue ?? (m.min + (m.max - m.min) * 0.2)) - m.min) / (m.max - m.min) - relative);
                            const distMax = Math.abs(((m.selectedMaxValue ?? (m.min + (m.max - m.min) * 0.8)) - m.min) / (m.max - m.min) - relative);
                            const handle = distMin <= distMax ? 'min' : 'max';
                            startMetricDrag(m.id, { left: rect.left, width: rect.width }, handle);
                            updateMetricFromClientX(e.clientX);
                          }}
                          onTouchStart={(e) => {
                            const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                            const clientX = e.touches[0].clientX;
                            const relative = (clientX - rect.left) / rect.width;
                            const distMin = Math.abs(((m.selectedMinValue ?? (m.min + (m.max - m.min) * 0.2)) - m.min) / (m.max - m.min) - relative);
                            const distMax = Math.abs(((m.selectedMaxValue ?? (m.min + (m.max - m.min) * 0.8)) - m.min) / (m.max - m.min) - relative);
                            const handle = distMin <= distMax ? 'min' : 'max';
                            startMetricDrag(m.id, { left: rect.left, width: rect.width }, handle);
                            updateMetricFromClientX(clientX);
                          }}
                        >
                          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-green-500 via-yellow-400 to-red-500 rounded" />
                          {/* Range fill */}
                          <div className="absolute top-1/2 -translate-y-1/2 h-[4px] bg-green-500/20" style={{
                            left: `${(((m.selectedMinValue ?? (m.min + (m.max - m.min) * 0.2)) - m.min) / (m.max - m.min)) * 100}%`,
                            width: `${((((m.selectedMaxValue ?? (m.min + (m.max - m.min) * 0.8)) - m.min) / (m.max - m.min)) - (((m.selectedMinValue ?? (m.min + (m.max - m.min) * 0.2)) - m.min) / (m.max - m.min))) * 100}%`
                          }} />
                          {/* Min handle */}
                          <div className="absolute top-1/2 -translate-y-1/2 cursor-ew-resize" style={{ left: `calc(${(((m.selectedMinValue ?? (m.min + (m.max - m.min) * 0.2)) - m.min) / (m.max - m.min)) * 100}% - 6px)` }}>
                            <div className="w-3 h-3 rounded-full bg-white border border-gray-400 shadow-sm" />
                          </div>
                          {/* Max handle */}
                          <div className="absolute top-1/2 -translate-y-1/2 cursor-ew-resize" style={{ left: `calc(${(((m.selectedMaxValue ?? (m.min + (m.max - m.min) * 0.8)) - m.min) / (m.max - m.min)) * 100}% - 6px)` }}>
                            <div className="w-3 h-3 rounded-full bg-white border border-gray-400 shadow-sm" />
                          </div>
                          <div className="absolute left-0 -bottom-4 text-[10px] text-gray-500">0</div>
                          <div className="absolute left-1/2 -translate-x-1/2 -bottom-4 text-[10px] text-gray-500">{((m.min + m.max) / 2)}</div>
                          <div className="absolute right-0 -bottom-4 text-[10px] text-gray-500">{m.max}</div>
                        </div>
                      ))}

                      {getMetricKeyFromName(m.name) !== 'TECHNICAL' && (
                        <>
                          <div className="grid grid-cols-2 gap-4 items-center">
                            <div>
                              <label className="block text-xs text-gray-600 mb-1">Condition*</label>
                              <select className="w-full border rounded px-3 py-2" value={m.condition} onChange={(e) => handleUpdateMetric(m.id, { condition: e.target.value as any })}>
                                <option>Less than</option>
                                <option>Greater than</option>
                                <option>Equal to</option>
                                <option>In between</option>
                              </select>
                            </div>
                            {m.condition !== 'In between' ? (
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Selected value*</label>
                                <input type="number" step={m.step} min={m.min} max={m.max} className="w-full border rounded px-3 py-2" value={m.selectedValue} onChange={(e) => handleUpdateMetric(m.id, { selectedValue: Number(e.target.value) })} />
                              </div>
                            ) : (
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">Min*</label>
                                  <input type="number" step={m.step} min={m.min} max={m.max} className="w-full border rounded px-3 py-2" value={m.selectedMinValue ?? (m.min + (m.max - m.min) * 0.2)} onChange={(e) => handleUpdateMetric(m.id, { selectedMinValue: Number(e.target.value) })} />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">Max*</label>
                                  <input type="number" step={m.step} min={m.min} max={m.max} className="w-full border rounded px-3 py-2" value={m.selectedMaxValue ?? (m.min + (m.max - m.min) * 0.8)} onChange={(e) => handleUpdateMetric(m.id, { selectedMaxValue: Number(e.target.value) })} />
                                </div>
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Amount per Buy* ($)</label>
                            <input type="number" className="w-full border rounded px-3 py-2" value={m.amountPerBuy} onChange={(e) => handleUpdateMetric(m.id, { amountPerBuy: Number(e.target.value) })} />
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Available metric cards (with ADD) */}
          {/* Risk Metric for Bitcoin & Ethereum */}
          {supportsRiskMetric && !riskMetricAdded && (
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex items-start space-x-4">

                {/* Left: Chart */}
                <div>
                  <div className="relative w-44 h-64 rounded-md overflow-hidden border border-gray-300 shadow-sm bg-gradient-to-t from-[#22c55e] via-[#f59e0b] to-[#ef4444]">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="risk-stroke" x1="0" y1="1" x2="0" y2="0">
                          <stop offset="0" stopColor="#ffffff" />
                          <stop offset="0.75" stopColor="#ffffff" />
                          <stop offset="0.9" stopColor="#ff6b6b" />
                          <stop offset="1" stopColor="#ff6b6b" />
                        </linearGradient>
                        <filter id="risk-glow" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur stdDeviation="1.2" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>
                      <line x1="0" y1="16" x2="100" y2="16" stroke="#ffffff" strokeWidth="1.5" />
                      <line x1="0" y1="86" x2="100" y2="86" stroke="#7ed957" strokeWidth="1.5" />
                      <polyline points="2,96 6,88 8,92 12,84 15,86 20,78 24,80 28,70 32,72 36,66 40,68 44,60 48,61 52,58 56,60 60,54 64,56 68,50 72,51 76,48 80,49 84,44 88,45 92,35 94,34 96,20" fill="none" stroke="url(#risk-stroke)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#risk-glow)" />
                    </svg>
                    <div className="absolute top-2 left-3 text-white text-m font-medium">High risk zone</div>
                    <div className="absolute bottom-2 left-3 text-white text-m font-medium">Lower risk zone</div>
                    <div className="absolute" style={{ top: '18%', left: '12px' }}>
                      <span className="text-white/90 text-sm">0.8</span>
                    </div>
                    <div className="absolute" style={{ top: '76%', right: '30px' }}>
                      <span className="text-white/90 text-sm">0.2</span>
                    </div>
                  </div>
                </div>

                {/* Middle: Title, Description, ADD Button */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h5 className="font-medium text-black">Risk Metric for Bitcoin & Ethereum</h5>
                    <div className="w-5 h-4 border border-gray-300 rounded-full flex items-center justify-center" style={{
                      background: "#3e8a29"
                    }}>
                      <span className="text-[10px] text-white font-bold">i</span>
                    </div>
                  </div>
                  <p className="border border-gray-100 rounded-md px-2 py-1 text-xs font-bold leading-5 text-gray-600 mb-3 text-left">
                    BTC Risk Metric shows if Bitcoin is historically cheap or expensive based on past prices and trends. Lower values mean it's potentially a better time to buy, higher values mean it's riskier.
                  </p>
                  <div className="flex">
                    <button disabled={riskMetricAdded} onClick={() => handleAddMetric('RISK METRIC (BTC & ETH)')} className={`w-full px-4 py-2 rounded text-sm font-medium border ${riskMetricAdded ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-green-200'}`} style={{
                      border: "1px solid #3e8a29",
                      color: "#3e8a29"
                    }}>
                      ADD
                    </button>
                  </div>
                </div>

                {/* Right: Current Metric */}
                <div className="text-center">
                  {/* <div className="border border-gray-200 rounded-md bg-white px-4 py-3 w-28 shadow-sm"> */}
                  <div className="text-xs text-gray-600 mb-1">Current metric
                    <div className="border border-gray-200 rounded-md text-[30px] font-bold text-black py-3 shadow-sm">0.5</div>
                    <div
                      className="mt-1 inline-block text-xs px-2 py-0.5 rounded"
                      style={{
                        background: "#fcedba",
                        color: "#e38b13",
                        border: "1px solid #e38b13"
                      }}
                    >
                      Moderate
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Fear & Greed Index */}
          {!fearGreedAdded && (
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex items-start space-x-4">
                {/* Left: Chart */}
                <div>
                  <div className="relative w-44 h-64 rounded-md overflow-hidden border border-gray-300 shadow-sm bg-gradient-to-t from-[#22c55e] via-[#f59e0b] to-[#ef4444]">
                    <div className="absolute top-2 left-3 text-white text-m font-medium">Extreme greed</div>
                    <div className="absolute bottom-2 left-3 text-white text-m font-medium">Extreme fear</div>
                    <div className="absolute" style={{ top: '18%', left: '12px' }}>
                      <span className="text-white/90 text-sm">0.8</span>
                    </div>
                    <div className="absolute" style={{ top: '76%', right: '30px' }}>
                      <span className="text-white/90 text-sm">0.2</span>
                    </div>
                  </div>
                </div>

                {/* Middle: Title, Description, ADD Button */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h5 className="font-medium text-black">Fear & Greed Index (Crypto)</h5>
                    <div className="w-4 h-4 border border-gray-300 rounded-full flex items-center justify-center" style={{
                      background: "#3e8a29"
                    }}>
                      <span className="text-[10px] text-white font-bold">i</span>
                    </div>
                  </div>
                  <p className="border border-gray-100 rounded-md px-2 py-1 text-xs font-bold leading-5 text-gray-600 mb-3 text-left">
                    Crypto Fear & Greed Index reflects market emotions. 0 means extreme fear (people selling), 100 means extreme greed (people buying aggressively).
                  </p>
                  <div className="flex mt-[30px]">
                    <button disabled={fearGreedAdded} onClick={() => handleAddMetric('FEAR & GREED INDEX')} className={`w-full px-4 py-2 rounded text-sm font-medium border ${fearGreedAdded ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-green-200'}`} style={{
                      border: "1px solid #3e8a29",
                      color: "#3e8a29"
                    }}>
                      ADD
                    </button>
                  </div>
                </div>

                {/* Right: Current Metric */}
                <div className="text-center">
                  {/* <div className="border border-gray-200 rounded-md bg-white px-4 py-3 w-28 shadow-sm"> */}
                  <div className="text-xs text-gray-600 mb-1">Current metric
                    <div className="border border-gray-200 rounded-md text-[30px] font-bold text-black py-3 shadow-sm">70</div>
                    <div className="mt-1 inline-block text-xs font-medium text-green-900 bg-green-100 px-2 py-0.5 rounded border border-green-600">Greed</div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  </div>
);

export default BotSetupSmart;
