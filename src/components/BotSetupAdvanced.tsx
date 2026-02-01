import React from "react";
import { Search, ArrowLeft, ArrowRight, ChevronsUpDown, Check, ChevronUp, ChevronDown, Trash2 } from "lucide-react";

const BotSetupAdvanced = ({
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
  advanceMatchMode,
  setAdvanceMatchMode,
  technicalContentExpanded,
  handleToggleTechnicalContent,
  startMetricDrag,
  updateMetricFromClientX,
  riskMetricAdded,
  fearGreedAdded,
  handleAddMetric,
  availableAssetsList = [],
}) => (
  <div className="bg-white rounded-lg p-6 shadow-lg max-w-6xl mx-auto border border-gray-200 relative">

    <button className="absolute -left-12 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors" onClick={() => setCurrentMainStep(1)}>
      <ArrowLeft className="w-6 h-6" />
    </button>
    <button className="absolute -right-12 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors" onClick={handleNextStep}>
      <ArrowRight className="w-6 h-6" />
    </button>

    <div className="text-center mb-6">
      <h3 className="text-2xl font-bold text-black mb-2">Enter asset details & configuration</h3>
      <div className="inline-block bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">DCA Advance</div>
      <div className="w-full h-0.5 bg-green-500 mx-auto mt-2"></div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-[0.4fr_0.6fr] gap-8">
      <div className="space-y-6">

        <div>
          <label className="block text-sm font-medium text-black mb-2">Account capital* ($)</label>
          <input type="number" {...step2Form.register('accountCapital', { valueAsNumber: true })} className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-bold text-black ${
            // @ts-ignore
            step2Form.formState.errors.accountCapital ? 'border-red-300' : 'border-gray-300'
            }`} />
          {/* @ts-ignore */}
          {step2Form.formState.errors.accountCapital && (
            // @ts-ignore
            <div className="text-red-600 text-sm mt-1">{step2Form.formState.errors.accountCapital.message}</div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-2">Asset name*</label>
          <div className="relative">
            <select {...step2Form.register('assetName')} className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-bold text-black bg-white ${step2Form.formState.errors.assetName ? 'border-red-300' : 'border-gray-300'
              }`}>
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

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-black">Amount per Buy* ($)</label>
          </div>
          <div className="relative group">
            <input type="number" {...step2Form.register('amountPerBuy', { valueAsNumber: true })} disabled={hasSelectedMetrics} title={hasSelectedMetrics ? buyAmtDisabledTooltip : undefined} className={`w-full px-4 py-3 border rounded-md focus:outline-none ${hasSelectedMetrics ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-bold text-black'} ${step2Form.formState.errors.amountPerBuy ? 'border-red-300' : 'border-gray-300'
              }`} />
            {hasSelectedMetrics && <div className="pointer-events-none absolute inset-0" title={buyAmtDisabledTooltip} />}
          </div>
          {step2Form.formState.errors.amountPerBuy && (
            <div className="text-red-600 text-sm mt-1">{step2Form.formState.errors.amountPerBuy.message}</div>
          )}
          {hasSelectedMetrics && (
            <div className="text-xs text-gray-500 mt-1">This field is disabled because a metric has been selected. The selected metric's 'Amount per Buy' will override this value.</div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-black mb-2">Time frame*</label>
            <select {...step2Form.register('timeFrame')} className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-bold text-black bg-white ${step2Form.formState.errors.timeFrame ? 'border-red-300' : 'border-gray-300'
              }`}>
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
            <input type="number" {...step2Form.register('frequency', { valueAsNumber: true })} className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-bold text-black ${step2Form.formState.errors.frequency ? 'border-red-300' : 'border-gray-300'
              }`} />
            {step2Form.formState.errors.frequency && (
              <div className="text-red-600 text-sm mt-1">{step2Form.formState.errors.frequency.message}</div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-3">Loop*</label>
          <div className="flex space-x-6 mb-2">
            {['Once', 'Infinite', 'Custom'].map(option => (
              <label key={option} className="flex items-center">
                <input type="radio" name="loop" value={option} checked={step2Form.watch('loop') === option} className="w-4 h-4 text-green-500 border-green-500 focus:ring-green-500" onChange={() => {
                  step2Form.setValue('loop', option);
                  if (option === 'Custom') step2Form.setValue('amountOfTimes', 1); else step2Form.setValue('amountOfTimes', undefined);
                }} />
                <span className="ml-2 text-sm text-black">{option}</span>
              </label>
            ))}
          </div>
          {step2Form.formState.errors.loop && (
            <div className="text-red-600 text-sm mt-1">{step2Form.formState.errors.loop.message}</div>
          )}
          <p className="text-blue-600 text-xs">{getLoopDescription()}</p>
          {step2Form.watch('loop') === 'Custom' && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-black mb-2">Amount of times*</label>
              <input type="number" {...step2Form.register('amountOfTimes', { valueAsNumber: true })} className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-bold text-black ${step2Form.formState.errors.amountOfTimes ? 'border-red-300' : 'border-gray-300'
                }`} />
              {step2Form.formState.errors.amountOfTimes && (
                <div className="text-red-600 text-sm mt-1">{step2Form.formState.errors.amountOfTimes.message}</div>
              )}
            </div>
          )}
        </div>
      </div>


      <div className="space-y-6">

        <div className="flex justify-between items-center">
          <h4 className="text-lg font-semibold text-black">Advance settings</h4>
          <div className="flex items-center gap-4 text-[13px]">
            <div className="flex items-center gap-2">
              <input type="radio" name="advmatch" checked={advanceMatchMode === 'ALL'} onChange={() => setAdvanceMatchMode('ALL')} className="accent-green-600" />
              <span className="text-gray-700">ALL must be true</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="radio" name="advmatch" checked={advanceMatchMode === 'ANY'} onChange={() => setAdvanceMatchMode('ANY')} className="accent-green-600" />
              <span className="text-gray-700">ANY can be true</span>
            </div>
          </div>
          <div className="flex w-44 items-center">
            <button className="flex items-center text-gray-500 hover:text-gray-700 text-sm font-medium ml-[-5px]" onClick={handleResetMetrics} disabled={addedMetrics.length === 0}>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Reset</span>
            </button>
            <div className="flex-grow" />
            <button className={`flex items-center text-sm font-medium ${addedMetrics.length >= 10 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setShowAddMetricsModal(true)} disabled={addedMetrics.length >= 10}>+ ADD</button>
          </div>
        </div>

        {addedMetrics.length > 0 && (
          <div className="space-y-3">
            {addedMetrics.map((m) => (
              <div key={m.id} className="border rounded-md p-3 bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button aria-pressed={m.enabled} title={m.enabled ? 'Enabled' : 'Disabled'} className={`grid place-items-center w-5 h-5 rounded-[3px] border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${m.enabled ? 'bg-green-600 border-green-600' : 'bg-white border-gray-400'}`} onClick={() => handleToggleEnabledMetric(m.id)}>
                      <Check className={`w-3 h-3 ${m.enabled ? 'text-white' : 'text-transparent'}`} strokeWidth={3} />
                    </button>
                    <div className="font-semibold text-sm text-black">{m.name}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1 text-sky-600 hover:text-black" onClick={() => toggleGroupExpand(getMetricKeyFromName(m.name))} title="Expand/Collapse all in this group"><ChevronsUpDown className="w-4 h-4" /></button>
                    <button className="p-1 text-gray-600 hover:text-black" onClick={() => handleToggleExpandMetric(m.id)} title="Expand/Collapse">{m.expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</button>
                    <button className="p-1 text-red-600 hover:text-red-700" onClick={() => handleRemoveMetric(m.id)} title="Delete"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                {m.expanded && (
                  <div className="mt-3 space-y-4">
                    {getMetricKeyFromName(m.name) === 'TECHNICAL' ? (
                      <div className="rounded-md shadow-sm p-4">
                        {/* Horizontal line below TECHNICAL */}
                        <button
                          className="absolute -left-8 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleTechnicalContent(m.id);
                          }}
                          title={(technicalContentExpanded[m.id] ?? false) ? 'Collapse' : 'Expand'}
                        >
                          {(technicalContentExpanded[m.id] ?? false) ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                        </button>
                        <hr className="mb-4 border-gray-200" />
                        <div className="flex items-center gap-6 mb-6">
                          <div className="flex-1">
                            <div className="text-[13px] text-gray-500 mb-2 font-semibold">Select indicator*</div>
                            <div className="relative">
                              <input
                                type="text"
                                className="w-full border rounded px-3 py-2 text-sm pr-16"
                                value={m.indicatorName || 'RSI'}
                                onChange={(e) => handleUpdateMetric(m.id, { indicatorName: e.target.value })}
                              />
                              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                <button className="grid place-items-center rounded-full text-xs text-blue-500 hover:bg-blue-50 p-1" title="Add">+Q</button>
                                <button className="grid place-items-center rounded-full text-blue-500 hover:bg-blue-50 p-1" title="Search"><Search className="w-3.5 h-3.5" /></button>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="text-[13px] text-gray-500 font-semibold mb-1">Indicator period*</div>
                            <div className="text-[10px] text-gray-400 mb-2">Default: 14 Period</div>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                className="w-20 border rounded px-3 py-2 text-sm"
                                value={m.indicatorPeriod ?? 14}
                                onChange={(e) => handleUpdateMetric(m.id, { indicatorPeriod: Number(e.target.value) })}
                              />
                              <div className="flex flex-col gap-1">
                                <button className="w-6 h-4 grid place-items-center border rounded-t text-xs" onClick={() => handleUpdateMetric(m.id, { indicatorPeriod: (m.indicatorPeriod ?? 14) + 1 })}>▲</button>
                                <button className="w-6 h-4 grid place-items-center border rounded-b -mt-[1px] text-xs" onClick={() => handleUpdateMetric(m.id, { indicatorPeriod: Math.max(1, (m.indicatorPeriod ?? 14) - 1) })}>▼</button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions Section */}
                        <div className="mb-6">
                          <div className="text-[13px] text-gray-500 font-semibold mb-3">Actions*</div>
                          <div className="flex items-center gap-4">
                            <button
                              className={`px-6 py-3 rounded-lg font-semibold text-sm ${m.tradeAction === 'BUY' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                              onClick={() => {
                                // Set trade action to BUY and add a BUY action
                                const currentActions = m.actions || [];
                                const buyActions = currentActions.filter(a => a.type === 'BUY');
                                const sellActions = currentActions.filter(a => a.type === 'SELL');
                                if (buyActions.length >= 5) return;
                                const newAction = {
                                  id: Date.now(),
                                  type: 'BUY',
                                  condition: 'Less than',
                                  value: '25',
                                  minValue: '20',
                                  maxValue: '80',
                                  tradeManagement: {
                                    amountPerBuyDollars: '100',
                                    amountPerBuyPercentage: '1'
                                  },
                                  levels: []
                                };
                                handleUpdateMetric(m.id, {
                                  tradeAction: 'BUY',
                                  actions: [...sellActions, ...buyActions, newAction]
                                });
                              }}
                            >
                              ADD BUY ({5 - ((m.actions?.filter(a => a.type === 'BUY')?.length) || 0)})
                            </button>
                            <button
                              className={`px-6 py-3 rounded-lg font-semibold text-sm ${m.tradeAction === 'SELL' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                              onClick={() => {
                                // Set trade action to SELL and add a SELL action
                                const currentActions = m.actions || [];
                                const buyActions = currentActions.filter(a => a.type === 'BUY');
                                const sellActions = currentActions.filter(a => a.type === 'SELL');
                                if (sellActions.length >= 5) return;
                                const newAction = {
                                  id: Date.now(),
                                  type: 'SELL',
                                  condition: 'Greater than',
                                  value: '70',
                                  minValue: '20',
                                  maxValue: '80',
                                  tradeManagement: {
                                    amountPerBuyDollars: '',
                                    amountPerBuyPercentage: '',
                                    sellProfitPercentage: '10',
                                    sellLevel: '25'
                                  },
                                  levels: []
                                };
                                handleUpdateMetric(m.id, {
                                  tradeAction: 'SELL',
                                  actions: [...buyActions, ...sellActions, newAction]
                                });
                              }}
                            >
                              ADD SELL ({5 - ((m.actions?.filter(a => a.type === 'SELL')?.length) || 0)})
                            </button>
                          </div>
                        </div>

                        {/* Basic Content - Show when collapsed (default state) */}
                        {!(technicalContentExpanded[m.id] ?? false) && (
                          <div className="grid grid-cols-2 gap-6">
                            {/* BUY Conditions Column */}
                            <div>
                              <div className="flex items-center gap-3 mb-4">
                                <button className="px-3 py-1 rounded text-xs font-semibold border-2 border-green-600 text-green-600 bg-white">BUY</button>
                                <span className="text-[12px] text-gray-500">
                                  {m.actions?.filter(a => a.type === 'BUY').length || 0} actions
                                </span>
                              </div>
                              {/* BUY Action Cards */}
                              <div className="space-y-3">
                                {m.actions?.filter(a => a.type === 'BUY').map((action, index) => (
                                  <div key={action.id} className="border border-gray-200 rounded-lg p-3 bg-white">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-sm font-medium text-gray-700">{index + 1}.</span>
                                      <div className="flex items-center gap-2">
                                        <button className="text-blue-600 text-xs font-medium">Edit</button>
                                        <button
                                          className="text-red-500 hover:text-red-700"
                                          onClick={() => {
                                            handleUpdateMetric(m.id, {
                                              actions: m.actions?.filter(a => a.id !== action.id)
                                            });
                                          }}
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      <div>Condition: {action.condition} {action.value}</div>
                                      <div>Buy amount: {action.tradeManagement.amountPerBuyDollars}/{action.tradeManagement.amountPerBuyPercentage}%</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            {/* SELL Conditions Column */}
                            <div>
                              <div className="flex items-center gap-3 mb-4">
                                <button className="px-3 py-1 rounded text-xs font-semibold border-2 border-red-600 text-red-600 bg-white">SELL</button>
                                <button
                                  className="text-[12px] text-gray-500 font-bold hover:text-red-600"
                                  onClick={() => {
                                    // Reset all SELL actions
                                    const buyActions = m.actions?.filter(a => a.type === 'BUY') || [];
                                    handleUpdateMetric(m.id, {
                                      actions: buyActions
                                    });
                                  }}
                                >
                                  Reset
                                </button>
                                <span className="text-[12px] text-gray-500">
                                  {m.actions?.filter(a => a.type === 'SELL').length || 0} actions
                                </span>
                              </div>
                              {/* SELL Action Cards */}
                              <div className="space-y-3">
                                {m.actions?.filter(a => a.type === 'SELL').map((action, index) => (
                                  <div key={action.id} className="border border-gray-200 rounded-lg p-3 bg-white">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="text-sm font-medium text-gray-700">{index + 1}.</span>
                                      <div className="flex items-center gap-2">
                                        <button className="text-blue-600 text-xs font-medium">Edit</button>
                                        <button
                                          className="text-red-500 hover:text-red-700"
                                          onClick={() => {
                                            handleUpdateMetric(m.id, {
                                              actions: m.actions?.filter(a => a.id !== action.id)
                                            });
                                          }}
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      <div>Condition: {action.condition} {action.value}</div>
                                      <div>Take profit: {action.tradeManagement.sellProfitPercentage}%</div>
                                      <div>Position: {action.tradeManagement.sellLevel}%</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Expanded Content - Show when expanded (overlaps with left column) */}
                        {(technicalContentExpanded[m.id] ?? false) && (
                          <div className="absolute top-0 left-0 right-0 bg-white border rounded-lg shadow-lg p-6 z-50">
                            <div className="grid grid-cols-2 gap-6">

                              {/* BUY Conditions Column with detailed inputs */}
                              <div>
                                <div className="flex items-center gap-3 mb-4">
                                  <button className="px-3 py-1 rounded text-xs font-semibold border-2 border-green-600 text-green-600 bg-white">BUY</button>
                                  <span className="text-[12px] text-gray-500">{m.actions?.filter(a => a.type === 'BUY').length || 0} actions</span>
                                </div>
                                {/* BUY Action Cards with detailed inputs */}
                                <div className="space-y-3">
                                  {m.actions?.filter(a => a.type === 'BUY').map((action, index) => (
                                    <div key={action.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                                      <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium text-gray-700">{index + 1}.</span>
                                        <div className="flex items-center gap-2">
                                          <button className="text-blue-600 text-xs font-medium">Edit</button>
                                          <button
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => {
                                              handleUpdateMetric(m.id, {
                                                actions: m.actions?.filter(a => a.id !== action.id)
                                              });
                                            }}
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </div>

                                      {/* Detailed input fields */}
                                      <div className="space-y-3">
                                        <div>
                                          <label className="block text-xs text-gray-500 font-semibold mb-1">Condition*</label>
                                          <select
                                            className="w-full border rounded px-3 py-2 text-sm"
                                            value={action.condition}
                                            onChange={(e) => {
                                              const newCondition = e.target.value;
                                              handleUpdateMetric(m.id, {
                                                actions: m.actions?.map(a =>
                                                  a.id === action.id ? {
                                                    ...a,
                                                    condition: newCondition,
                                                    // Reset values when condition changes
                                                    value: newCondition === 'In between' ? '' : '25',
                                                    minValue: newCondition === 'In between' ? '20' : undefined,
                                                    maxValue: newCondition === 'In between' ? '80' : undefined
                                                  } : a
                                                )
                                              });
                                            }}
                                          >
                                            <option value="Less than">Less than</option>
                                            <option value="Greater than">Greater than</option>
                                            <option value="Equal to">Equal to</option>
                                            <option value="In between">In between</option>
                                          </select>
                                        </div>
                                        {action.condition === 'In between' ? (
                                          <div className="grid grid-cols-2 gap-2">
                                            <div>
                                              <label className="block text-xs text-gray-500 font-semibold mb-1">Min Value*</label>
                                              <input
                                                type="number"
                                                className="w-full border rounded px-3 py-2 text-sm"
                                                value={action.minValue || ''}
                                                onChange={(e) => {
                                                  handleUpdateMetric(m.id, {
                                                    actions: m.actions?.map(a =>
                                                      a.id === action.id ? { ...a, minValue: e.target.value } : a
                                                    )
                                                  });
                                                }}
                                              />
                                            </div>
                                            <div>
                                              <label className="block text-xs text-gray-500 font-semibold mb-1">Max Value*</label>
                                              <input
                                                type="number"
                                                className="w-full border rounded px-3 py-2 text-sm"
                                                value={action.maxValue || ''}
                                                onChange={(e) => {
                                                  handleUpdateMetric(m.id, {
                                                    actions: m.actions?.map(a =>
                                                      a.id === action.id ? { ...a, maxValue: e.target.value } : a
                                                    )
                                                  });
                                                }}
                                              />
                                            </div>
                                          </div>
                                        ) : (
                                          <div>
                                            <label className="block text-xs text-gray-500 font-semibold mb-1">Value*</label>
                                            <input
                                              type="number"
                                              className="w-full border rounded px-3 py-2 text-sm"
                                              value={action.value}
                                              onChange={(e) => {
                                                handleUpdateMetric(m.id, {
                                                  actions: m.actions?.map(a =>
                                                    a.id === action.id ? { ...a, value: e.target.value } : a
                                                  )
                                                });
                                              }}
                                            />
                                          </div>
                                        )}
                                        <div className="grid grid-cols-2 gap-2">
                                          <div>
                                            <label className="block text-xs text-gray-500 font-semibold mb-1">Amount per Buy ($)</label>
                                            <input
                                              type="number"
                                              className="w-full border rounded px-3 py-2 text-sm"
                                              value={action.tradeManagement.amountPerBuyDollars}
                                              onChange={(e) => {
                                                handleUpdateMetric(m.id, {
                                                  actions: m.actions?.map(a =>
                                                    a.id === action.id ? {
                                                      ...a,
                                                      tradeManagement: { ...a.tradeManagement, amountPerBuyDollars: e.target.value }
                                                    } : a
                                                  )
                                                });
                                              }}
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-xs text-gray-500 font-semibold mb-1">Amount per Buy (%)</label>
                                            <input
                                              type="number"
                                              className="w-full border rounded px-3 py-2 text-sm"
                                              value={action.tradeManagement.amountPerBuyPercentage}
                                              onChange={(e) => {
                                                handleUpdateMetric(m.id, {
                                                  actions: m.actions?.map(a =>
                                                    a.id === action.id ? {
                                                      ...a,
                                                      tradeManagement: { ...a.tradeManagement, amountPerBuyPercentage: e.target.value }
                                                    } : a
                                                  )
                                                });
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* SELL Conditions Column with detailed inputs */}
                              <div>
                                <div className="flex items-center gap-3 mb-4">
                                  <button className="px-3 py-1 rounded text-xs font-semibold border-2 border-red-600 text-red-600 bg-white">SELL</button>
                                  <button
                                    className="text-[12px] text-gray-500 font-bold hover:text-red-600"
                                    onClick={() => {
                                      const buyActions = m.actions?.filter(a => a.type === 'BUY') || [];
                                      handleUpdateMetric(m.id, {
                                        actions: buyActions
                                      });
                                    }}
                                  >
                                    Reset
                                  </button>
                                  <span className="text-[12px] text-gray-500">
                                    {m.actions?.filter(a => a.type === 'SELL').length || 0} actions
                                  </span>
                                </div>
                                {/* SELL Action Cards with detailed inputs */}
                                <div className="space-y-3">
                                  {m.actions?.filter(a => a.type === 'SELL').map((action, index) => (
                                    <div key={action.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                                      <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium text-gray-700">{index + 1}.</span>
                                        <div className="flex items-center gap-2">
                                          <button className="text-blue-600 text-xs font-medium">Edit</button>
                                          <button
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => {
                                              handleUpdateMetric(m.id, {
                                                actions: m.actions?.filter(a => a.id !== action.id)
                                              });
                                            }}
                                          >
                                            <Trash2 className="w-4 h-4" />
                                          </button>
                                        </div>
                                      </div>

                                      {/* Detailed input fields */}
                                      <div className="space-y-3">
                                        <div>
                                          <label className="block text-xs text-gray-500 font-semibold mb-1">Condition*</label>
                                          <select
                                            className="w-full border rounded px-3 py-2 text-sm"
                                            value={action.condition}
                                            onChange={(e) => {
                                              const newCondition = e.target.value;
                                              handleUpdateMetric(m.id, {
                                                actions: m.actions?.map(a =>
                                                  a.id === action.id ? {
                                                    ...a,
                                                    condition: newCondition,
                                                    // Reset values when condition changes
                                                    value: newCondition === 'In between' ? '' : '70',
                                                    minValue: newCondition === 'In between' ? '20' : undefined,
                                                    maxValue: newCondition === 'In between' ? '80' : undefined
                                                  } : a
                                                )
                                              });
                                            }}
                                          >
                                            <option value="Less than">Less than</option>
                                            <option value="Greater than">Greater than</option>
                                            <option value="Equal to">Equal to</option>
                                            <option value="In between">In between</option>
                                          </select>
                                        </div>
                                        {action.condition === 'In between' ? (
                                          <div className="grid grid-cols-2 gap-2">
                                            <div>
                                              <label className="block text-xs text-gray-500 font-semibold mb-1">Min Value*</label>
                                              <input
                                                type="number"
                                                className="w-full border rounded px-3 py-2 text-sm"
                                                value={action.minValue || ''}
                                                onChange={(e) => {
                                                  handleUpdateMetric(m.id, {
                                                    actions: m.actions?.map(a =>
                                                      a.id === action.id ? { ...a, minValue: e.target.value } : a
                                                    )
                                                  });
                                                }}
                                              />
                                            </div>
                                            <div>
                                              <label className="block text-xs text-gray-500 font-semibold mb-1">Max Value*</label>
                                              <input
                                                type="number"
                                                className="w-full border rounded px-3 py-2 text-sm"
                                                value={action.maxValue || ''}
                                                onChange={(e) => {
                                                  handleUpdateMetric(m.id, {
                                                    actions: m.actions?.map(a =>
                                                      a.id === action.id ? { ...a, maxValue: e.target.value } : a
                                                    )
                                                  });
                                                }}
                                              />
                                            </div>
                                          </div>
                                        ) : (
                                          <div>
                                            <label className="block text-xs text-gray-500 font-semibold mb-1">Value*</label>
                                            <input
                                              type="number"
                                              className="w-full border rounded px-3 py-2 text-sm"
                                              value={action.value}
                                              onChange={(e) => {
                                                handleUpdateMetric(m.id, {
                                                  actions: m.actions?.map(a =>
                                                    a.id === action.id ? { ...a, value: e.target.value } : a
                                                  )
                                                });
                                              }}
                                            />
                                          </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-2">
                                          <div>
                                            <label className="block text-xs text-gray-500 font-semibold mb-1">Take profit (%)</label>
                                            <input
                                              type="number"
                                              className="w-full border rounded px-3 py-2 text-sm"
                                              value={action.tradeManagement.sellProfitPercentage}
                                              onChange={(e) => {
                                                handleUpdateMetric(m.id, {
                                                  actions: m.actions?.map(a =>
                                                    a.id === action.id ? {
                                                      ...a,
                                                      tradeManagement: { ...a.tradeManagement, sellProfitPercentage: e.target.value }
                                                    } : a
                                                  )
                                                });
                                              }}
                                            />
                                          </div>
                                          <div>
                                            <label className="block text-xs text-gray-500 font-semibold mb-1">Position (%)</label>
                                            <input
                                              type="number"
                                              className="w-full border rounded px-3 py-2 text-sm"
                                              value={action.tradeManagement.sellLevel}
                                              onChange={(e) => {
                                                handleUpdateMetric(m.id, {
                                                  actions: m.actions?.map(a =>
                                                    a.id === action.id ? {
                                                      ...a,
                                                      tradeManagement: { ...a.tradeManagement, sellLevel: e.target.value }
                                                    } : a
                                                  )
                                                });
                                              }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        {m.condition !== 'In between' ? (
                          <div className="relative h-5" onMouseDown={(e) => { const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect(); startMetricDrag(m.id, { left: rect.left, width: rect.width }, 'single'); updateMetricFromClientX(e.clientX); }} onTouchStart={(e) => { const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect(); const clientX = e.touches[0].clientX; startMetricDrag(m.id, { left: rect.left, width: rect.width }, 'single'); updateMetricFromClientX(clientX); }}>
                            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-green-500 via-yellow-400 to-red-500 rounded" />
                            <div className="absolute top-1/2 -translate-y-1/2" style={{ left: `calc(${((m.selectedValue - m.min) / (m.max - m.min)) * 100}% - 6px)` }}>
                              <div className="w-3 h-3 rounded-full bg-white border border-gray-400 shadow-sm" />
                            </div>
                            <div className="absolute left-0 -bottom-4 text-[10px] text-gray-500">0</div>
                            <div className="absolute left-1/2 -translate-x-1/2 -bottom-4 text-[10px] text-gray-500">{((m.min + m.max) / 2)}</div>
                            <div className="absolute right-0 -bottom-4 text-[10px] text-gray-500">{m.max}</div>
                          </div>
                        ) : (
                          <div className="relative h-5" onMouseDown={(e) => { const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect(); const clickX = e.clientX; const relative = (clickX - rect.left) / rect.width; const distMin = Math.abs(((m.selectedMinValue ?? (m.min + (m.max - m.min) * 0.2)) - m.min) / (m.max - m.min) - relative); const distMax = Math.abs(((m.selectedMaxValue ?? (m.min + (m.max - m.min) * 0.8)) - m.min) / (m.max - m.min) - relative); const handle = distMin <= distMax ? 'min' : 'max'; startMetricDrag(m.id, { left: rect.left, width: rect.width }, handle); updateMetricFromClientX(e.clientX); }} onTouchStart={(e) => { const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect(); const clientX = e.touches[0].clientX; const relative = (clientX - rect.left) / rect.width; const distMin = Math.abs(((m.selectedMinValue ?? (m.min + (m.max - m.min) * 0.2)) - m.min) / (m.max - m.min) - relative); const distMax = Math.abs(((m.selectedMaxValue ?? (m.min + (m.max - m.min) * 0.8)) - m.min) / (m.max - m.min) - relative); const handle = distMin <= distMax ? 'min' : 'max'; startMetricDrag(m.id, { left: rect.left, width: rect.width }, handle); updateMetricFromClientX(clientX); }}>
                            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-green-500 via-yellow-400 to-red-500 rounded" />
                            <div className="absolute top-1/2 -translate-y-1/2 h-[4px] bg-green-500/20" style={{ left: `${(((m.selectedMinValue ?? (m.min + (m.max - m.min) * 0.2)) - m.min) / (m.max - m.min)) * 100}%`, width: `${((((m.selectedMaxValue ?? (m.min + (m.max - m.min) * 0.8)) - m.min) / (m.max - m.min)) - (((m.selectedMinValue ?? (m.min + (m.max - m.min) * 0.2)) - m.min) / (m.max - m.min))) * 100}%` }} />
                            <div className="absolute top-1/2 -translate-y-1/2 cursor-ew-resize" style={{ left: `calc(${(((m.selectedMinValue ?? (m.min + (m.max - m.min) * 0.2)) - m.min) / (m.max - m.min)) * 100}% - 6px)` }}>
                              <div className="w-3 h-3 rounded-full bg-white border border-gray-400 shadow-sm" />
                            </div>
                            <div className="absolute top-1/2 -translate-y-1/2 cursor-ew-resize" style={{ left: `calc(${(((m.selectedMaxValue ?? (m.min + (m.max - m.min) * 0.8)) - m.min) / (m.max - m.min)) * 100}% - 6px)` }}>
                              <div className="w-3 h-3 rounded-full bg-white border border-gray-400 shadow-sm" />
                            </div>
                            <div className="absolute left-0 -bottom-4 text-[10px] text-gray-500">0</div>
                            <div className="absolute left-1/2 -translate-x-1/2 -bottom-4 text-[10px] text-gray-500">{((m.min + m.max) / 2)}</div>
                            <div className="absolute right-0 -bottom-4 text-[10px] text-gray-500">{m.max}</div>
                          </div>
                        )}

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

        <div className="space-y-4">

          {/* Technical Indicators card */}
          {/* Only show if not added */}
          {(() => {
            const added = addedMetrics.some(m => getMetricKeyFromName(m.name) === 'TECHNICAL'); return (
              <div className="border border-gray-200 rounded-lg bg-white h-[186px]">
                <div className="grid grid-cols-[170px_1fr_130px] items-stretch gap-4 h-full">
                  {/* Left: thumbnail/graph placeholder (keep as is) */}
                  <div className="h-full">
                    <div className="relative w-[180px] h-full min-h-[184px] rounded-md overflow-hidden border border-gray-300 shadow-sm bg-gradient-to-t from-[#a78bfa] via-[#f0abfc] to-[#fda4af]" />
                  </div>
                  {/* Middle: title and description */}
                  <div className="pt-5 h-full pl-2 ">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="text-[18px] font-semibold text-black leading-none">Technical Indicators</div>
                      <div className="w-4 h-4 rounded-full grid place-items-center" style={{ background: '#3e8a29' }}>
                        <span className="text-[10px] text-white font-bold">i</span>
                      </div>
                    </div>
                    <div className="text-[12px] leading-[1.15] text-gray-700 max-h-[110px] overflow-hidden">
                      Technical indicators are mathematical calculations based on past price, volume, or open interest data used by traders to analyze securities and predict future price movements. They help identify trends, momentum, volatility, and overbought/oversold conditions.
                    </div>
                  </div>
                  {/* Right: current value placeholder and action */}
                  <div className="flex flex-col items-end justify-between h-full py-5">
                    <div className="pr-7">
                      <div className="w-24 h-16 border border-gray-200 rounded-md bg-white" />
                    </div>
                    <button disabled={added} onClick={() => handleAddMetric('TECHNICAL INDICATORS')} className={`w-32 h-9 mr-3 rounded text-sm font-semibold ${added ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-green-700 text-white hover:bg-green-800'}`}>
                      ADD
                    </button>
                  </div>
                </div>
              </div>
            )
          })()}

          {/* Risk metrics card */}
          {!riskMetricAdded && (
            <div className="border border-gray-200 rounded-lg bg-white h-[190px]">
              <div className="grid grid-cols-[170px_1fr_130px] items-stretch gap-4 h-full">
                <div className="h-full"><div className="relative w-[180px] h-full min-h-[185px] rounded-md overflow-hidden border border-gray-300 shadow-sm bg-gradient-to-t from-[#bbf7d0] via-[#fef08a] to-[#fca5a5]"></div></div>
                <div className="pt-5 h-full pl-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-[18px] font-semibold text-black leading-none">Risk metrics</div>
                    <div className="w-4 h-4 rounded-full grid place-items-center" style={{ background: '#3e8a29' }}><span className="text-[10px] text-white font-bold">i</span></div>
                  </div>
                  <div className="text-[12px] leading-[1.15] text-gray-700 max-h-[140px] overflow-hidden">
                    Crypto Fear &amp; Greed Index reflects market emotions. 0 means extreme fear (people selling), 100 means extreme greed (people buying aggressively).
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between h-full py-5">
                  <div className="pr-7">
                    <div className="text-[11px] text-gray-600 pl-2">Current value</div>
                    <div className="border border-gray-200 rounded-md text-[30px] font-bold text-black w-24 text-center py-2 shadow-sm">0.5</div>
                    <div className="block text-[11px] px-2 py-[2px] mt-1 rounded w-24 text-center" style={{ background: '#fcedba', color: '#e38b13', border: '1px solid #e38b13' }}>Moderate</div>
                  </div>
                  <button
                    disabled={riskMetricAdded}
                    onClick={() => handleAddMetric('RISK METRICS')}
                    className={`w-32 h-9 mr-3 rounded text-sm font-semibold mt-1 ${riskMetricAdded ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-green-700 text-white hover:bg-green-800'}`}
                  >
                    ADD
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Fear & Greed */}
          {!fearGreedAdded && (
            <div className="border border-gray-200 rounded-lg bg-white h-[190px]">
              <div className="grid grid-cols-[170px_1fr_130px] items-stretch gap-4 h-full">
                <div className="h-full"><div className="relative w-[180px] h-full min-h-[185px] rounded-md overflow-hidden border border-gray-300 shadow-sm bg-gradient-to-t from-[#22c55e] via-[#f59e0b] to-[#ef4444]"></div></div>
                <div className="pt-5 h-full pl-2">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-[18px] font-semibold text-black leading-none">Fear & Greed Index</div>
                    <div className="w-4 h-4 rounded-full grid place-items-center" style={{ background: '#3e8a29' }}><span className="text-[10px] text-white font-bold">i</span></div>
                  </div>
                  <div className="text-[12px] leading-[1.15] text-gray-700 max-h-[140px] overflow-hidden">Crypto Fear & Greed Index reflects market emotions. 0 means extreme fear (people selling), 100 means extreme greed (people buying aggressively).</div>
                </div>
                <div className="flex flex-col items-end justify-between h-full py-5">
                  <div className="pr-7">
                    <div className="text-[11px] text-gray-600 pl-2">Current value</div>
                    <div className="border border-gray-200 rounded-md text-[30px] font-bold text-black w-24 text-center py-2 shadow-sm">70</div>
                    <div className="block text-[11px] font-medium text-green-900 bg-green-100 px-2 py-[2px] mt-1 rounded border border-green-600 w-24 text-center">Greed</div>
                  </div>
                  <button disabled={fearGreedAdded} onClick={() => handleAddMetric('FEAR & GREED INDEX')} className={`w-32 h-9 mr-3 rounded text-sm font-semibold mt-1 ${fearGreedAdded ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-green-700 text-white hover:bg-green-800'}`}>ADD</button>
                </div>
              </div>
            </div>
          )}

          {/* Fundamental Analysis - Coming soon */}
          <div className="border border-gray-200 rounded-lg bg-white h-[186px]">
            <div className="grid grid-cols-[170px_1fr_130px] items-stretch gap-4 h-full">
              <div className="h-full"><div className="relative w-[180px] h-full min-h-[184px] rounded-md overflow-hidden border border-gray-300 shadow-sm bg-gradient-to-t from-[#f0abfc] via-[#a78bfa] to-[#60a5fa]"></div></div>
              <div className="pt-5 h-full pl-2">
                <div className="flex items-center gap-2 mb-2"><div className="text-[18px] font-semibold text-black leading-none">Fundamental Analysis</div><div className="w-4 h-4 rounded-full grid place-items-center" style={{ background: '#3e8a29' }}><span className="text-[10px] text-white font-bold">i</span></div></div>
                <div className="text-[12px] leading-[1.15] text-gray-700 max-h-[140px] overflow-hidden">PE Ratios, F-1 & SEC Filings, Earnings, Debt, Cash inflow. Narrative of all the options</div>
              </div>
              <div className="flex flex-col items-end justify-between h-full py-5">
                <div className="pr-7">
                  <div className="w-24 h-16 border border-gray-200 rounded-md bg-white" />
                </div>
                <button className="w-32 h-9 mr-3 rounded text-sm font-semibold mt-1 bg-blue-600 text-white/90 cursor-not-allowed opacity-80">COMING SOON</button>
              </div>
            </div>
          </div>

          {/* Proprietary Systems */}
          <div className="border border-gray-200 rounded-lg bg-white h-[190px]">
            <div className="grid grid-cols-[170px_1fr_130px] items-stretch gap-4 h-full">
              <div className="h-full"><div className="relative w-[180px] h-full min-h-[185px] rounded-md overflow-hidden border border-gray-300 shadow-sm bg-gradient-to-t from-[#60a5fa] via-[#38bdf8] to-[#22d3ee]"></div></div>
              <div className="pt-5 h-full pl-2">
                <div className="flex items-center gap-2 mb-2"><div className="text-[18px] font-semibold text-black leading-none">Proprietary Systems</div><div className="w-4 h-4 rounded-full grid place-items-center" style={{ background: '#3e8a29' }}><span className="text-[10px] text-white font-bold">i</span></div></div>
                <div className="text-[12px] leading-[1.15] text-gray-700 max-h-[140px] overflow-hidden">Crypto Fear & Greed Index reflects market emotions. 0 means extreme fear (people selling), 100 means extreme greed (people buying aggressively).</div>
              </div>
              <div className="flex flex-col items-end justify-between h-full py-5">
                <div className="pr-4">
                  <div className="text-[11px] text-gray-600">QI's Total Net Returns</div>
                  <div className="border border-gray-200 rounded-md text-[30px] font-bold text-black w-24 text-center py-2 shadow-sm">+31%</div>
                  <div className="inline-block text-[11px] py-[2px] mt-1 rounded border text-yellow-700 w-24 text-center" style={{ background: '#fff4d6', borderColor: '#f1c96f' }}>Hold or evaluate</div>
                </div>
                <button className="w-32 h-9 mr-3 rounded text-sm font-semibold mt-1 bg-black text-white">UNLOCK</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>
);

export default BotSetupAdvanced;
