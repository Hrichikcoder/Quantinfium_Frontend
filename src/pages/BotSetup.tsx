import React, { useState, useEffect } from "react";
import { Search, RotateCcw, ArrowLeft, ArrowRight, Check, ChevronDown, ChevronUp, CheckCircle, ChevronsUpDown, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import { deployDCABot, deployDCASmartBot, getBrokers, createBroker, getAvailableBrokers, getAvailableAssets } from "@/api.jsx";
import * as ccxt from 'ccxt';
import type { ActionCardData, TradeManagementData } from '@/types/common';
type MetricAction = ActionCardData;
import Chatbot from "@/components/Chatbot";
import BotSetupBasic from "@/components/BotSetupBasic";
import BotSetupSmart from "@/components/BotSetupSmart";
import BotSetupAdvanced from "@/components/BotSetupAdvanced";

const step1Schema = z.object({
  botName: z.string().min(1, { message: "Bot name is required" }),
  broker: z.string().min(1, { message: "Broker is required" }),
  botType: z.string().min(1, { message: "Bot type is required" }),
  apiKey: z.string().optional(),
  secretKey: z.string().optional(),
});

const apiConnectSchema = z.object({
  apiKey: z.string().min(1, { message: "API key is required" }),
  secretKey: z.string().min(1, { message: "Secret key is required" }),
});

const step2Schema = z.object({
  assetName: z.string().min(1, { message: "Asset name is required" }),
  amountPerBuy: z.number(),
  timeFrame: z.string().min(1, { message: "Time frame is required" }),
  frequency: z.number().min(1, { message: "Frequency is required" }),
  loop: z.string().min(1, { message: "Loop option is required" }),
  amountOfTimes: z.number().optional(),
  label3: z.string().optional(),
  accountCapital: z.number().optional(),
})
  .refine(
    (data) => {
      if (data.loop === "Custom") {
        return data.amountOfTimes !== undefined && data.amountOfTimes > 0;
      }
      return true;
    },
    {
      message: "Amount of times is required for Custom loop",
      path: ["amountOfTimes"],
    }
  );

type Step1FormData = z.infer<typeof step1Schema>;
type Step2FormData = z.infer<typeof step2Schema>;

interface BotSetupProps {
  onBack?: () => void;
  initialData?: any; 
}

const BotSetup: React.FC<BotSetupProps> = ({ onBack, initialData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [actionCards, setActionCards] = useState<ActionCardData[]>([]);

  const handleAddAction = () => {
    if (actionCards.length < 5) {
      const newCard: ActionCardData = {
        id: actionCards.length,
        type: 'BUY',
        condition: 'Less than',
        value: '25',
        tradeManagement: {
          amountPerBuyDollars: '100',
          amountPerBuyPercentage: '1'
        },
        levels: []
      };
      setActionCards(prev => [...prev, newCard]);
    }
  };

  const handleDeleteAction = (index: number) => {
    setActionCards(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateAction = (index: number, data: Partial<ActionCardData>) => {
    setActionCards(prev => prev.map((card, i) =>
      i === index ? { ...card, ...data } : card
    ));
  };

  const [selectedBotType, setSelectedBotType] = useState("Basic");
  const [currentMainStep, setCurrentMainStep] = useState(1); 
  const [currentSubStep, setCurrentSubStep] = useState(1);
  const [isModifyMode, setIsModifyMode] = useState(false);
  const [accountBalance, setAccountBalance] = useState<number>(0);
  const [modifyBotData, setModifyBotData] = useState<any>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({
    botName: '',
    asset: '',
    amount: 0,
    timeFrame: '',
    frequency: 1,
    loop: 'Once',
    amountOfTimes: 0,
    broker: '',
    botType: ''
  });
  const [isChatbotOpen, setIsChatbotOpen] = useState(true);

  const step1Form = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    mode: "onChange",
    defaultValues: {
      botName: "",
      broker: "",
      botType: "Basic",
    }
  });

  const brokerValue = step1Form.watch("broker");

  const step2Form = useForm<Step2FormData>({
    resolver: zodResolver(step2Schema),
    mode: "onChange",
    defaultValues: {
      assetName: "BTCUSDT",
      amountPerBuy: 50,
      accountCapital: 2500,
      timeFrame: "",
      frequency: 1,
      loop: "Custom",
      amountOfTimes: 1,
      label3: "LabelText",
    }
  });

  const apiConnectForm = useForm({
    resolver: zodResolver(apiConnectSchema),
    mode: "onChange",
    defaultValues: {
      apiKey: "",
      secretKey: "",
      testMode: false
    }
  });

  useEffect(() => {
    const aiConfig = location.state?.aiConfig;
    if (aiConfig) {
      let uiBotType = aiConfig.strategy || "Basic";
      if (uiBotType === "Advanced") uiBotType = "Advance";
      
      setSelectedBotType(uiBotType);
      step1Form.setValue("botType", uiBotType);
      step1Form.setValue("botName", `AI-${uiBotType}-${aiConfig.asset || 'BOT'}`);
      step1Form.setValue("broker", "ByBit"); 

      if (aiConfig.asset) {
        step2Form.setValue("assetName", aiConfig.asset.toUpperCase());
      }
      if (aiConfig.amount) {
        step2Form.setValue("amountPerBuy", Number(aiConfig.amount));
      }

      if (aiConfig.frequency) {
        const freqLower = aiConfig.frequency.toLowerCase();
        if (freqLower.includes("daily") || freqLower.includes("day")) {
            step2Form.setValue("timeFrame", "1Day");
            step2Form.setValue("frequency", 1);
            step2Form.setValue("loop", "Infinite");
        } else if (freqLower.includes("weekly") || freqLower.includes("week") || freqLower.includes("sunday")) {
            step2Form.setValue("timeFrame", "1Week");
            step2Form.setValue("frequency", 1);
            step2Form.setValue("loop", "Infinite");
        } else if (freqLower === "once") {
            step2Form.setValue("timeFrame", "1Day");
            step2Form.setValue("loop", "Once");
        }
      }

      setCurrentMainStep(3);
      setCurrentSubStep(3);
      toast.success("Bot configuration pre-filled by AI!");
    }
  }, [location.state, step1Form, step2Form]);

  useEffect(() => {
    if (initialData) {
        const typeMapping: any = { "Basic": "Basic", "Advanced": "Advance", "Smart": "Smart" };
        const uiType = typeMapping[initialData.strategy] || "Basic";

        step1Form.setValue("botName", `AI-${uiType}-${initialData.asset}`);
        step1Form.setValue("broker", "ByBit");
        step1Form.setValue("botType", uiType);
        setSelectedBotType(uiType);

        step2Form.setValue("assetName", initialData.asset);
        step2Form.setValue("amountPerBuy", initialData.amount);
        step2Form.setValue("frequency", 1);
        step2Form.setValue("timeFrame", "1Day"); 

        if (uiType === "Advance" || uiType === "Smart") {
            setCurrentMainStep(3);
            setCurrentSubStep(3);
        } else {
            setCurrentMainStep(1);
        }
    }
  }, [initialData, step1Form, step2Form]);

  const [formData, setFormData] = useState({
    botName: "",
    broker: ""
  });

  const [activeTab, setActiveTab] = useState<'load' | 'connect'>('load');
  const [savedBrokers, setSavedBrokers] = useState<any[]>([]);
  const [selectedBroker, setSelectedBroker] = useState<any | null>(null);
  const [availableBrokersList, setAvailableBrokersList] = useState<string[]>([]);
  const [availableAssetsList, setAvailableAssetsList] = useState<string[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const isLoadingBrokersRef = React.useRef(false);

  const [advanceMatchMode, setAdvanceMatchMode] = useState<'ALL' | 'ANY'>('ALL');

  const watchedAsset = step2Form.watch('assetName')?.trim().toUpperCase() || '';
  const supportsRiskMetric = ['BTCUSDT', 'BTC/USDT', 'ETHUSDT', 'ETH/USDT'].includes(watchedAsset);

  type MetricCondition = 'Less than' | 'Greater than' | 'Equal to' | 'In between';

  interface AddedMetric {
    id: string;
    name: string;
    expanded: boolean;
    enabled: boolean;
    selectedValue: number;
    selectedMinValue?: number;
    selectedMaxValue?: number;
    min: number;
    max: number;
    step: number;
    condition: MetricCondition;
    amountPerBuy: number;
    indicatorName?: string;
    indicatorPeriod?: number;
    tradeAction?: 'BUY' | 'SELL';
    actions?: MetricAction[];
    percentPerBuy?: number;
    sellPercent?: number;
    sellLevel?: number;
    techRules?: Array<{
      id: string;
      action: 'BUY' | 'SELL';
      condition: MetricCondition;
      selectedValue: number;
      selectedMinValue?: number;
      selectedMaxValue?: number;
      amountPerBuy?: number;
      percentPerBuy?: number;
      sellPercent?: number;
      sellLevel?: number;
    }>;
  }

  const [addedMetrics, setAddedMetrics] = useState<AddedMetric[]>([]);
  const [showAddMetricsModal, setShowAddMetricsModal] = useState(false);
  const [technicalContentExpanded, setTechnicalContentExpanded] = useState<{ [key: string]: boolean }>({});
  
  useEffect(() => {
    if (!supportsRiskMetric) {
      const hadRisk = addedMetrics.some(m => getMetricKeyFromName(m.name) === 'RISK');
      if (hadRisk) {
        setAddedMetrics(prev => prev.filter(m => getMetricKeyFromName(m.name) !== 'RISK'));
        toast.info('Risk Metric removed: not supported for selected asset', { position: 'top-center' });
      }
    }
  }, [supportsRiskMetric]);

  const getMetricKeyFromName = (name: string): 'TECHNICAL' | 'RISK' | 'FEAR_GREED' | 'FUNDAMENTAL' | 'PROPRIETARY' | 'CUSTOM' => {
    const upper = name.toUpperCase();
    if (upper.includes('TECHNICAL')) return 'TECHNICAL';
    if (upper.includes('RISK METRIC')) return 'RISK';
    if (upper.includes('RISK METRICS')) return 'RISK';
    if (upper.includes('FEAR') || upper.includes('GREED')) return 'FEAR_GREED';
    if (upper.includes('FUNDAMENTAL')) return 'FUNDAMENTAL';
    if (upper.includes('PROPRIETARY')) return 'PROPRIETARY';
    return 'CUSTOM';
  };

  const [draggingMetric, setDraggingMetric] = useState<{
    id: string;
    rectLeft: number;
    rectWidth: number;
    handle: 'single' | 'min' | 'max';
  } | null>(null);

  const handleAddMetric = (name: string) => {
    if (addedMetrics.length >= 10) {
      toast.info('You can add up to 10 metrics', { position: 'top-center' });
      return;
    }
    const key = getMetricKeyFromName(name);
    const alreadyExists = addedMetrics.some(m => getMetricKeyFromName(m.name) === key);
    if (alreadyExists) {
      toast.info('This metric is already added', { position: 'top-center' });
      return;
    }
    const id = `${Date.now()}-${Math.random()}`;
    const defaults = key === 'FEAR_GREED'
      ? { min: 0, max: 100, step: 1, selectedValue: 70 }
      : key === 'TECHNICAL'
        ? { min: 0, max: 100, step: 1, selectedValue: 25 }
        : { min: 0, max: 1, step: 0.01, selectedValue: 0.5 };

    setAddedMetrics((prev) => [
      ...prev,
      {
        id,
        name,
        expanded: true,
        enabled: true,
        selectedValue: defaults.selectedValue,
        min: defaults.min,
        max: defaults.max,
        step: defaults.step,
        condition: 'Less than',
        amountPerBuy: 100,
        indicatorName: key === 'TECHNICAL' ? 'RSI' : undefined,
        indicatorPeriod: key === 'TECHNICAL' ? 14 : undefined,
        tradeAction: key === 'TECHNICAL' ? 'BUY' : undefined,
        percentPerBuy: key === 'TECHNICAL' ? 1 : undefined,
        sellPercent: key === 'TECHNICAL' ? 100 : undefined,
        sellLevel: key === 'TECHNICAL' ? 100 : undefined,
        techRules: key === 'TECHNICAL' ? [
          { id: `${id}-r1`, action: 'BUY', condition: 'Less than', selectedValue: 25, amountPerBuy: 100, percentPerBuy: 1 },
        ] : undefined,
      },
    ]);
    setShowAddMetricsModal(false);
  };

  const handleToggleExpandMetric = (id: string) => {
    setAddedMetrics((prev) => prev.map((m) => (m.id === id ? { ...m, expanded: !m.expanded } : m)));
  };

  const handleToggleTechnicalContent = (id: string) => {
    setTechnicalContentExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleToggleEnabledMetric = (id: string) => {
    setAddedMetrics((prev) => prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m)));
  };

  const handleRemoveMetric = (id: string) => {
    setAddedMetrics((prev) => prev.filter((m) => m.id !== id));
  };

  const handleMoveMetric = (id: string, direction: 'up' | 'down') => {
    setAddedMetrics((prev) => {
      const index = prev.findIndex((m) => m.id === id);
      if (index === -1) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const newArr = [...prev];
      const [item] = newArr.splice(index, 1);
      newArr.splice(targetIndex, 0, item);
      return newArr;
    });
  };

  const handleUpdateMetric = (id: string, updates: Partial<AddedMetric>) => {
    setAddedMetrics((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  };


  const toggleGroupExpand = (type: ReturnType<typeof getMetricKeyFromName>) => {
    setAddedMetrics((prev) => {
      const inGroup = prev.filter((m) => getMetricKeyFromName(m.name) === type);
      if (inGroup.length === 0) return prev;
      const allExpanded = inGroup.every((m) => m.expanded);
      return prev.map((m) =>
        getMetricKeyFromName(m.name) === type ? { ...m, expanded: !allExpanded } : m
      );
    });
  };

  const handleResetMetrics = () => {
    if (addedMetrics.length === 0) return;
    setAddedMetrics([]);
    toast.success('Risk metrics reset', { position: 'top-center' });
  };

  const getLoopDescription = () => {
    const loop = step2Form.watch('loop');
    const frequency = step2Form.watch('frequency');
    const timeFrame = step2Form.watch('timeFrame');
    const amountOfTimes = step2Form.watch('amountOfTimes');

    const timeFrameText =
      timeFrame === '1Min' ? 'minute' :
        timeFrame === '5Min' ? 'minute' :
          timeFrame === '15Min' ? 'minute' :
            timeFrame === '30Min' ? 'minute' :
              timeFrame === '1Hour' ? 'hour' :
                timeFrame === '1Day' ? 'day' :
                  timeFrame === '1Week' ? 'week' :
                    timeFrame === '1Month' ? 'month' :
                      timeFrame === '3Months' ? '3 months' :
                        timeFrame === '6Months' ? '6 months' :
                          timeFrame === '1Year' ? 'year' : 'day';

    const timesText = `${frequency} time${frequency > 1 ? 's' : ''}`;

    if (loop === 'Once') {
      return `Eg: ${timesText} for 1 ${timeFrameText}`;
    }
    if (loop === 'Infinite') {
      return `Eg: ${timesText} every ${timeFrameText} indefinitely`;
    }
    const amt = amountOfTimes ?? 1;
    const amtText = `${amt} time${amt > 1 ? 's' : ''}`;
    return `Eg: ${timesText} every ${timeFrameText} for ${amtText}`;
  };

  const riskMetricAdded = addedMetrics.some(m => getMetricKeyFromName(m.name) === 'RISK');
  const fearGreedAdded = addedMetrics.some(m => getMetricKeyFromName(m.name) === 'FEAR_GREED');
  const availableMetricPool = selectedBotType === 'Advance'
    ? [
      { name: 'TECHNICAL INDICATORS', isSupported: true },
      { name: 'RISK METRICS', isSupported: supportsRiskMetric },
      { name: 'FEAR & GREED INDEX', isSupported: true },
    ]
    : [
      { name: 'RISK METRIC (BTC & ETH)', isSupported: supportsRiskMetric },
      { name: 'FEAR & GREED INDEX', isSupported: true },
    ];
  const hasSelectedMetrics = (selectedBotType === 'Smart' || selectedBotType === 'Advance') && addedMetrics.some(m => m.enabled);

  const renderAdvanceStep3 = () => {
    const tf = step2Form.getValues('timeFrame');
    const frequencyDisplay = `${step2Form.getValues('frequency') || 1}x`;
    const loopDisplay = step2Form.getValues('loop') || 'Once';
    const apiStatus = currentSubStep === 3 ? 'Connected' : 'Not Connected';
    const accountCapital = step2Form.getValues('accountCapital') ?? 0;

    const nonTechnicalMetrics = addedMetrics.filter(m => getMetricKeyFromName(m.name) !== 'TECHNICAL');
    const technicalMetric = addedMetrics.find(m => getMetricKeyFromName(m.name) === 'TECHNICAL');

    return (
      <div className="space-y-6">
        <div className="border border-gray-200 rounded-md">
          <div className="p-5">
            <div className="grid [grid-template-columns:2fr_1fr] gap-6">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-gray-500 mb-2">Bot Name</div>
                    <div className="text-xl font-bold text-black">{step1Form.getValues('botName') || 'MyDCA-1'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-2">Asset</div>
                    <div className="text-xl font-bold text-black">{(step2Form.getValues('assetName') || 'BTCUSDT')} (Spot)</div>
                  </div>
                </div>
                <div className="pt-6 border-t border-gray-200">
                  <div className="grid [grid-template-columns:1.2fr_1fr_1fr] gap-6">
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Time frame</div>
                      <div className="text-xl font-bold text-black">{tf}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Frequency</div>
                      <div className="text-xl font-bold text-black">{frequencyDisplay}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Loop</div>
                      <div className="text-xl font-bold text-black">{loopDisplay}</div>
                    </div>
                  </div>
                </div>
                <div className="pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Broker</div>
                      <div className="text-xl font-bold text-black">{step1Form.getValues('broker') || 'ByBit'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-2">API Status</div>
                      <div className="text-xl font-bold text-black">{apiStatus}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Total Capital ($)</div>
                      <div className="text-xl font-bold text-sky-600">{accountBalance.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pl-6 border-l border-gray-200 space-y-4">
                {nonTechnicalMetrics.map((m, idx) => (
                  <div key={m.id} className={idx > 0 ? 'pt-4 border-t border-gray-200' : ''}>
                    <div className="text-[11px] text-gray-500">({idx + 1}) Buy Amount ($) &nbsp; {m.name.replace(/\s*\(.+\)$/, '').trim()} {m.condition !== 'In between' ? `(${m.selectedValue})` : `(${m.selectedMinValue ?? ''}-${m.selectedMaxValue ?? ''})`}</div>
                    <div className="text-xl font-bold">{(m.amountPerBuy || 0).toFixed(2)}</div>
                  </div>
                ))}

                {technicalMetric && (
                  <div className={nonTechnicalMetrics.length > 0 ? 'pt-4 border-t border-gray-200' : ''}>
                    <div className="text-sm text-gray-600 mb-1">{technicalMetric.indicatorName || 'RSI'} ({technicalMetric.indicatorPeriod ?? 14})</div>
                    {(technicalMetric.techRules || []).map((r) => (
                      <div key={r.id} className="text-[12px] text-gray-700 grid grid-cols-2 gap-2 mb-1">
                        {r.action === 'BUY' ? (
                          <>
                            <div>Buy Amount ($): <span className="font-semibold">{(r.amountPerBuy ?? technicalMetric.amountPerBuy ?? 0).toFixed(2)}</span></div>
                            <div>Buy Amount (%): <span className="font-semibold">{(r.percentPerBuy ?? technicalMetric.percentPerBuy ?? 0)}%</span></div>
                          </>
                        ) : (
                          <>
                            <div>Sell Amount (%): <span className="font-semibold">{(r.sellPercent ?? technicalMetric.sellPercent ?? 0)}%</span></div>
                            <div>Sell Level (%): <span className="font-semibold">{(r.sellLevel ?? technicalMetric.sellLevel ?? 0)}%</span></div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-[11px] text-gray-600 border rounded-md py-3">Your bot will execute on {step1Form.getValues('broker') || 'ByBit'} with the above settings starting from {new Date().toLocaleDateString()} at market order.</div>
        <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded" onClick={handleDeployBot}>{isModifyMode ? 'Update bot' : 'Deploy bot'}</button>
        <button className="w-full border border-green-600 text-green-700 font-medium py-2 rounded">Deploy signal</button>
      </div>
    );
  };
  const buyAmtDisabledTooltip = "This field is disabled because a metric has been enabled. The selected metric's 'Amount per Buy' will override this value.";

  const startMetricDrag = (id: string, rect: { left: number; width: number }, handle: 'single' | 'min' | 'max') => {
    setDraggingMetric({ id, rectLeft: rect.left, rectWidth: rect.width, handle });
  };

  const updateMetricFromClientX = (clientX: number) => {
    if (!draggingMetric) return;
    const relative = (clientX - draggingMetric.rectLeft) / draggingMetric.rectWidth;
    const clamped = Math.max(0, Math.min(1, relative));
    const metric = addedMetrics.find(m => m.id === draggingMetric.id);
    if (!metric) return;
    const scaled = metric.min + clamped * (metric.max - metric.min);
    const stepped = Math.round(scaled / metric.step) * metric.step;
    const fixed = Number(stepped.toFixed(metric.step < 1 ? 2 : 0));
    if (draggingMetric.handle === 'single' || metric.condition !== 'In between') {
      handleUpdateMetric(draggingMetric.id, { selectedValue: fixed });
    } else if (draggingMetric.handle === 'min') {
      const maxVal = metric.selectedMaxValue ?? metric.max * 0.8;
      const next = Math.min(fixed, maxVal - metric.step);
      handleUpdateMetric(draggingMetric.id, { selectedMinValue: Math.max(metric.min, next) });
    } else if (draggingMetric.handle === 'max') {
      const minVal = metric.selectedMinValue ?? metric.min * 0.2;
      const next = Math.max(fixed, minVal + metric.step);
      handleUpdateMetric(draggingMetric.id, { selectedMaxValue: Math.min(metric.max, next) });
    }
  };

  useEffect(() => {
    if (!draggingMetric) return;
    const onMove = (e: MouseEvent | TouchEvent) => {
      // @ts-ignore
      const clientX: number = 'touches' in e && e.touches && e.touches[0] ? e.touches[0].clientX : (e as MouseEvent).clientX;
      updateMetricFromClientX(clientX);
    };
    const onUp = () => setDraggingMetric(null);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: false } as any);
    window.addEventListener('touchend', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove as any);
      window.removeEventListener('touchend', onUp);
    };
  }, [draggingMetric]);

  useEffect(() => {
    if (currentSubStep === 2) {
      setActiveTab('load');
      setSelectedBroker(null);
      setIsVerifying(false);
      setIsConnected(false);

      if (!isLoadingBrokersRef.current) {
        let isCancelled = false;
        isLoadingBrokersRef.current = true;

        const loadBrokers = async () => {
          try {
            const brokers = await getBrokers();
            if (!isCancelled) {
              setSavedBrokers(brokers || []);
            }
          } catch (error) {
            if (!isCancelled) {
              console.error('Error loading saved brokers:', error);
              setSavedBrokers([]);
            }
          } finally {
            if (!isCancelled) {
              isLoadingBrokersRef.current = false;
            }
          }
        };

        loadBrokers();
        return () => {
          isCancelled = true;
          isLoadingBrokersRef.current = false;
        };
      }
    } else {
      isLoadingBrokersRef.current = false;
    }
  }, [currentSubStep]);

  const handleLoadBroker = (broker: any) => {
    setSelectedBroker(broker);
    apiConnectForm.setValue('apiKey', broker.api_key);
    apiConnectForm.setValue('secretKey', broker.api_secret);
    apiConnectForm.setValue('testMode', broker.test_mode || false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const brokers = await getAvailableBrokers();
        if (Array.isArray(brokers)) {
          setAvailableBrokersList(brokers);
        }
      } catch (e) {
        console.error("Failed to fetch available brokers", e);
      }

      try {
        const assets = await getAvailableAssets();
        if (Array.isArray(assets)) {
          setAvailableAssetsList(assets);
        }
      } catch (e) {
        console.error("Failed to fetch available assets", e);
      }
    };
    fetchData();
  }, []);

  const handleConnectFromLoad = async () => {
    if (!selectedBroker) {
      toast.error('Please select a saved connection first');
      return;
    }

    try {
      setIsVerifying(true);
      const brokerName = step1Form.getValues('broker');
      const backendBrokerName = mapUiBrokerToBackend(brokerName);
      const apiKey = apiConnectForm.getValues('apiKey');
      const secretKey = apiConnectForm.getValues('secretKey');
      const testMode = apiConnectForm.getValues('testMode') ?? false;

      try {
        console.log('Verifying API keys with CCXT...');
        const exchangeId = backendBrokerName.toLowerCase();
        const exchange = new (ccxt as any)[exchangeId]({
          apiKey: apiKey,
          secret: secretKey,
          options: {
            defaultType: 'spot',
          },
          enableRateLimit: true,
          timeout: 30000,
        });

        if (testMode) {
          try {
            exchange.setSandboxMode(true);
          } catch (e) {
            console.warn(`${backendBrokerName} does not support test mode. Using live API.`);
            toast.warning(`${backendBrokerName} does not support test mode. Using live API.`);
          }
        }

        let totalUSDT = 0;
        try {
          console.log('Fetching balance to verify API keys...');
          const balance = await exchange.fetchBalance();
          totalUSDT = (balance.total?.USDT || 0) + (balance.total?.USD || 0);
          console.log('Balance fetched successfully:', totalUSDT);
          console.log('API keys verified successfully with CCXT');
        } catch (balanceError) {
          console.warn('Could not fetch balance due to CORS:', balanceError);
          console.warn('This is expected in browser - proceeding with broker creation anyway');
          toast.warning('Connected successfully, but balance fetch failed due to browser restrictions');
          totalUSDT = 0; 
        }

        const keysUnchanged = selectedBroker &&
          selectedBroker.api_key === apiKey &&
          selectedBroker.api_secret === secretKey &&
          (selectedBroker.test_mode || false) === !!testMode;

        if (keysUnchanged) {
          console.log('Broker keys unchanged. Skipping backend update to preserve Broker ID.');
        } else {
          console.log('API keys verified. Creating/updating broker on backend...');
          const result = await createBroker({
            name: backendBrokerName,
            api_key: apiKey,
            api_secret: secretKey,
            test_mode: !!testMode
          });
          console.log('Broker created/updated successfully on backend:', result);
        }

        setAccountBalance(totalUSDT);
        setIsConnected(true);
        setIsVerifying(false);
        toast.success('API connection successful!');

        setTimeout(() => {
          setCurrentSubStep(3);
        }, 1000);

      } catch (error: any) {
        console.error('Error during API connection process:', error);
        toast.error('API Connection Failed', {
          description: "Check console for details",
          duration: 10000
        });
        setIsVerifying(false);
        setIsConnected(false);
      }
    } catch (e) {
      toast.error('Broker connection failed', { description: typeof e === 'string' ? e : 'Please verify keys and try again.' });
      setIsVerifying(false);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    const modifyMode = searchParams.get('modify') === 'true';
    setIsModifyMode(modifyMode);

    if (modifyMode) {
      const storedBotData = localStorage.getItem('modifyBotData');
      if (storedBotData) {
        const botData = JSON.parse(storedBotData);
        setModifyBotData(botData);

        step1Form.setValue('botName', botData.name);
        step1Form.setValue('broker', 'ByBit');
        step1Form.setValue('botType', botData.strategy.replace('DCA-', ''));

        step2Form.setValue('assetName', botData.pair);
        step2Form.setValue('amountPerBuy', parseFloat(botData.totalInvestment.replace('$', '')));
        step2Form.setValue('timeFrame', botData.investmentFrequency);
        step2Form.setValue('frequency', parseInt(botData.count));

        const loopValue = botData.loop || 'Once';
        step2Form.setValue('loop', loopValue);

        if (loopValue === 'Custom' && botData.amountOfTimes) {
          step2Form.setValue('amountOfTimes', botData.amountOfTimes);
        }

        setSelectedBotType(botData.strategy.replace('DCA-', ''));
        setFormData({
          botName: botData.name,
          broker: 'ByBit'
        });

        setEditValues({
          botName: botData.name,
          asset: botData.pair,
          amount: parseFloat(botData.totalInvestment.replace('$', '')),
          timeFrame: botData.investmentFrequency,
          frequency: parseInt(botData.count),
          loop: loopValue,
          amountOfTimes: loopValue === 'Custom' ? (botData.amountOfTimes || 1) : 0,
          broker: 'ByBit',
          botType: botData.strategy.replace('DCA-', '')
        });

        setCurrentMainStep(3);
      }
    }
  }, [searchParams, step1Form, step2Form]);

  const validateStep1 = async () => {
    try {
      await step1Form.trigger();
      return step1Form.formState.isValid;
    } catch {
      return false;
    }
  };

  const validateStep2 = async () => {
    try {
      await step2Form.trigger();
      return step2Form.formState.isValid;
    } catch {
      return false;
    }
  };

  const validateSubStep1 = async () => {
    try {
      await step1Form.trigger(['botName', 'broker', 'botType']);
      return step1Form.formState.errors.botName === undefined &&
        step1Form.formState.errors.broker === undefined &&
        step1Form.formState.errors.botType === undefined;
    } catch {
      return false;
    }
  };

  const handleNextStep = async () => {
    if (currentMainStep === 1) {
      const isValid = await validateStep1();
      if (isValid) {
        setCurrentMainStep(2);
      }
    } else if (currentMainStep === 2) {
      const isValid = await validateStep2();
      if (isValid) {
        setCurrentMainStep(3);
      }
    }
  };

  const handleNextSubStep = async () => {
    if (currentSubStep === 1) {
      const isValid = await validateSubStep1();
      if (isValid) {
        setCurrentSubStep(2);
      }
    } else if (currentSubStep === 2) {
      try {
        await apiConnectForm.trigger();
        if (apiConnectForm.formState.isValid) {
          const brokerName = step1Form.getValues('broker');
          const backendBrokerName = mapUiBrokerToBackend(brokerName);
          const apiKey = apiConnectForm.getValues('apiKey');
          const secretKey = apiConnectForm.getValues('secretKey');
          const testMode = apiConnectForm.getValues('testMode') ?? false;

          try {
            console.log('Verifying API keys with CCXT...');
            const exchangeId = backendBrokerName.toLowerCase();
            const exchange = new (ccxt as any)[exchangeId]({
              apiKey: apiKey,
              secret: secretKey,
              options: {
                defaultType: 'spot',
              },
              enableRateLimit: true,
              timeout: 30000,
            });

            if (testMode) {
              try {
                exchange.setSandboxMode(true);
              } catch (e) {
                console.warn(`${backendBrokerName} does not support test mode. Using live API.`);
                toast.warning(`${backendBrokerName} does not support test mode. Using live API.`);
              }
            }

            let totalUSDT = 0;
            try {
              console.log('Fetching balance to verify API keys...');
              const balance = await exchange.fetchBalance();
              totalUSDT = (balance.total?.USDT || 0) + (balance.total?.USD || 0);
              console.log('Balance fetched successfully:', totalUSDT);
              console.log('API keys verified successfully with CCXT');
            } catch (balanceError) {
              console.warn('Could not fetch balance due to CORS:', balanceError);
              console.warn('This is expected in browser - proceeding with broker creation anyway');
              toast.warning('Connected successfully, but balance fetch failed due to browser restrictions');
              totalUSDT = 0; 
            }

            const existingExactMatch = savedBrokers.find(b =>
              (b.name === backendBrokerName || mapUiBrokerToBackend(b.name) === backendBrokerName) &&
              b.api_key === apiKey &&
              b.api_secret === secretKey &&
              (b.test_mode || false) === !!testMode
            );

            if (existingExactMatch) {
              console.log('Broker with exact credentials already exists. Skipping backend creation.', existingExactMatch);
            } else {
              console.log('API keys verified. Creating broker on backend...');
              const result = await createBroker({
                name: backendBrokerName,
                api_key: apiKey,
                api_secret: secretKey,
                test_mode: !!testMode
              });
              console.log('Broker created successfully on backend:', result);
            }

            setAccountBalance(totalUSDT);
            setCurrentSubStep(3);
            toast.success('API connection successful!');

          } catch (error: any) {
            console.error('Error during API connection process:', error);
            toast.error('API Connection Failed', {
              description: "Check console for details",
              duration: 10000
            });
          }
        }
      } catch (e) {
        toast.error('Broker connection failed', { description: typeof e === 'string' ? e : 'Please verify keys and try again.' });
      }
    }
  };

  const handleReset = () => {
    const message = isModifyMode
      ? "Are you sure you want to reset all changes? This will clear all modifications and return to the default form."
      : "Are you sure you want to reset the form? This will clear all entered data and return to the initial state.";

    if (window.confirm(message)) {
      step1Form.reset({
        botName: "",
        broker: "",
        botType: "Basic",
      });

      step2Form.reset({
        assetName: "BTCUSDT",
        amountPerBuy: 50,
        timeFrame: "",
        frequency: 1,
        loop: "Custom",
        amountOfTimes: 1,
      });

      apiConnectForm.reset({
        apiKey: "",
        secretKey: "",
      });

      setSelectedBotType("Basic");
      setCurrentMainStep(1);
      setCurrentSubStep(1);
      setEditingField(null);
      setActiveTab('load');
      setSelectedBroker(null);
      setIsVerifying(false);
      setIsConnected(false);
      setEditValues({
        botName: '',
        amountOfTimes: 0,
        asset: '',
        amount: 0,
        timeFrame: '',
        frequency: 1,
        loop: 'Custom',
        broker: '',
        botType: ''
      });
      setFormData({
        botName: "",
        broker: ""
      });

      if (isModifyMode) {
        localStorage.removeItem('modifyBotData');
        setIsModifyMode(false);
        setModifyBotData(null);
      }

      toast.success("Form reset successfully", {
        description: isModifyMode
          ? "All modifications have been cleared and form reset to default"
          : "All fields have been cleared and reset to initial state"
      });
    }
  };

  const mapTimeFrameToPeriod = (tf: string): string => {
    const mapping: Record<string, string> = {
      "1Min": "MINUTE",
      "5Min": "MINUTE",
      "15Min": "MINUTE",
      "30Min": "MINUTE",
      "1Hour": "HOUR",
      "1Day": "DAY",
      "1Week": "WEEK",
      "1Month": "MONTH",
      "3Months": "THREE_MONTHS",
      "6Months": "SIX_MONTHS",
      "1Year": "YEAR",
    };
    return mapping[tf] || "DAY";
  };

  const mapUiAssetToBackend = (symbol: string): string => {
    if (!symbol) return symbol;
    const upper = symbol.toUpperCase();
    if (upper.includes('/')) return upper; 
    const quotes = ["USDT", "USDC", "BUSD", "USD", "EUR", "GBP"];
    for (const q of quotes) {
      if (upper.endsWith(q)) {
        const base = upper.slice(0, upper.length - q.length);
        return `${base}/${q}`;
      }
    }
    return upper;
  };

  const mapUiBrokerToBackend = (name: string): string => {
    if (!name) return name as unknown as string;
    const key = String(name).replace(/\s+/g, "").toUpperCase();
    const KNOWN: Record<string, string> = {
      BYBIT: 'Bybit',
      BINANCE: 'Binance',
      KRAKEN: 'Kraken',
      OKX: 'OKX',
      KUCOIN: 'KuCoin',
      BITGET: 'Bitget',
      BITFINEX: 'Bitfinex',
      BITSTAMP: 'Bitstamp',
    };
    if (KNOWN[key]) return KNOWN[key];
    return String(name).toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const handleDeployBot = async () => {
    console.log("=".repeat(50));
    console.log("handleDeployBot: Deploy bot clicked!");
    console.log("handleDeployBot: Mode:", isModifyMode ? "UPDATE" : "CREATE");
    console.log("=".repeat(50));

    if (isModifyMode && modifyBotData) {
      const updatedBot = {
        ...modifyBotData,
        name: editValues.botName,
        pair: editValues.asset,
        strategy: `DCA-${editValues.botType}`,
        totalInvestment: `$${editValues.amount.toFixed(2)}`,
        investmentFrequency: editValues.timeFrame,
        nextBuySignal: `Next buy signal in ${editValues.timeFrame}`,
        count: String(editValues.frequency),
        loop: editValues.loop,
        amountOfTimes: editValues.loop === 'Custom' ? editValues.amountOfTimes : undefined,
      };

      const existingBots = JSON.parse(localStorage.getItem('deployedBots') || '[]');
      const updatedBots = existingBots.map((bot: any) =>
        bot.id === modifyBotData.id ? updatedBot : bot
      );
      localStorage.setItem('deployedBots', JSON.stringify(updatedBots));

      localStorage.removeItem('modifyBotData');

      toast.success("Bot updated successfully", {
        description: `${updatedBot.name} has been modified with new settings`
      });

    } else {
      const name = step1Form.getValues("botName") || "MyDCA-1";
      const asset = mapUiAssetToBackend(step2Form.getValues("assetName") || "BTCUSDT");
      const amountPerBuy = step2Form.getValues("amountPerBuy") || 50;
      const frequency = step2Form.getValues("frequency") || 1;
      const timeFrame = step2Form.getValues("timeFrame");
      const period = mapTimeFrameToPeriod(timeFrame);
      const loopValue = step2Form.getValues("loop") || "Once";
      const repetition = loopValue === "Once" ? 1 : (loopValue === "Infinite" ? 0 : (step2Form.getValues("amountOfTimes") || 1));
      const risk = riskMetricAdded;

      const brokerName = step1Form.getValues("broker");
      const backendBrokerName = mapUiBrokerToBackend(brokerName);
      
      let brokerId: number | undefined = undefined;
      try {
        const brokers = await getBrokers();
        const match = Array.isArray(brokers)
          ? brokers.find((b: any) => mapUiBrokerToBackend(String(b.name || b.title || b.label)) === backendBrokerName)
          : undefined;

        if (match && match.test_mode === true) {
          toast.warning("Found broker with test mode enabled. Please recreate the broker connection with test mode disabled.");
          return;
        }

        brokerId = match?.id ?? brokers?.[0]?.id;
      } catch (e: any) {
        console.error('handleDeployBot: Error fetching brokers:', e);
      }

      if (!brokerId) {
        toast.error("No broker connected", { description: "Please add a broker in Step 1 › API connect, then deploy again." });
        return;
      }

      const botType = step1Form.getValues("botType") || "Basic";

      if (accountBalance > 0 && amountPerBuy > accountBalance) {
        toast.error("Insufficient funds", {
          description: `Insufficient funds. Needed: ${amountPerBuy.toFixed(2)}, Available: ${accountBalance.toFixed(2)}`,
          duration: 8000
        });
        return;
      } else if (accountBalance <= 0) {
        toast.warning("Balance verification unavailable", {
          description: `Could not verify account balance. Please ensure you have at least ${amountPerBuy.toFixed(2)} available. Bot will be created but may fail if funds are insufficient.`,
          duration: 10000
        });
      }

      const payload = {
        name,
        asset,
        amount: String(amountPerBuy),
        frequency,
        period,
        repetition,
        risk: Boolean(risk),
        ...(brokerId ? { broker: brokerId } : {}),
      };

      let backendIdentifier: string | undefined = undefined;
      let created;

      try {
        if (botType === "Smart") {
          const smartMetrics = addedMetrics.map(m => {
            let type = "RISK_METRIC";
            if (m.name.includes("Fear")) type = "FEAR_AND_GREED";

            const metricPayload: any = {
              type: type,
              condition: m.condition,
              amount_per_buy: m.amountPerBuy
            };

            if (m.condition === "In between") {
              metricPayload.min_threshold = m.selectedMinValue ?? m.min;
              metricPayload.max_threshold = m.selectedMaxValue ?? m.max;
            } else {
              metricPayload.threshold = m.selectedValue;
            }

            return metricPayload;
          });

          const smartPayload = {
            ...payload,
            smart_metrics: smartMetrics
          };

          created = await deployDCASmartBot(smartPayload);

        } else {
          created = await deployDCABot(payload, botType);
        }

        if (created?.error || created?.warning) {
          toast.warning("Bot created with warnings", {
            description: created.error || created.warning || "Check console for details",
            duration: 5000
          });
        }

        backendIdentifier = created?.identifier;

        if (!backendIdentifier) {
          toast.warning("Bot created but identifier missing", {
            description: "Bot may not function correctly. Check console for details.",
            duration: 5000
          });
        }
      } catch (err: any) {
        console.error("handleDeployBot: Backend deployment failed:", err);
        toast.error("Failed to deploy bot", {
          description: "Check console for details",
          duration: 5000
        });
        return;
      }
      const currentTime = new Date();
      const newBot = {
        id: Date.now(), 
        name: step1Form.getValues("botName") || "MyDCA-1",
        pair: step2Form.getValues("assetName") || "BTCUSDT",
        strategy: `DCA-${step1Form.getValues("botType") || "Basic"}`,
        totalValue: `$${(step2Form.getValues("amountPerBuy") || 50).toFixed(2)}`,
        totalInvestment: `$${(step2Form.getValues("amountPerBuy") || 50).toFixed(2)}`,
        realizedPnl: "$0.00",
        totalReturn: "0%",
        chart: true,
        status: "Active",
        statusColor: "bg-green-500",
        runtime: "0d 0h 0m",
        account: "My Account",
        paused: false,
        statusSince: "Active since: Just now",
        botId: `bot-${Date.now()}`,
        investmentFrequency: step2Form.getValues("timeFrame") || "1Day",
        nextBuySignal: `Next buy signal in ${step2Form.getValues("timeFrame")}`,
        count: String(step2Form.getValues("frequency") || 1),
        isPositive: true,
        loop: loopValue,
        amountOfTimes: loopValue === 'Custom' ? step2Form.getValues("amountOfTimes") : undefined,
        identifier: backendIdentifier,
        createdAt: currentTime.toISOString(),
        lastStatusChange: currentTime.toISOString(),
        totalPausedTime: 0, 
        lastPausedAt: null
      };

      const existingBots = JSON.parse(localStorage.getItem('deployedBots') || '[]');
      existingBots.push(newBot);
      localStorage.setItem('deployedBots', JSON.stringify(existingBots));

      toast.success("Bot deployed successfully", {
        description: `${newBot.name} has been deployed and is now active`
      });
    }

    navigate('/dashboard', { replace: true });
  };

  const instruments = [
    { title: "Trade or Invest", description: "Description & some performance data" },
    { title: "Portfolio or Rebalancer", description: "Description & some perform" },
    { title: "Buy & Hold", description: "Description & some perform" },
    { title: "Investoaccumulator", description: "Description & some performance data" },
    { title: "Proprietary", description: "Coming soon* in 2026", comingSoon: true },
    { title: "Arbitrage", description: "Coming soon* in 2026", comingSoon: true }
  ];

  return (
    <div>
      <div className="max-w-7xl mx-auto pl-8 md:pl-20 py-8">
        
        <div className="flex flex-col lg:flex-row gap-8 mb-8 lg:ml-2">
          <div className="lg:w-1/3 lg:ml-10 lg:mr-6">
            <h3 className="font-sm text-3xl text-gray-800 mb-4">Currently selected</h3>
            <div className="text-white rounded-lg p-4 h-48 flex flex-col justify-between" style={{ backgroundColor: "#3e8a29" }}>
              <h4 className="text-4xl font-semibold">Dollar Cost Average</h4>
              <p className="text-lg opacity-90 text-center">Description & some performance data</p>
            </div>
          </div>

          <div className="lg:w-2/3">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-3xl font-medium text-gray-500">All instruments</h3>
              <button
                onClick={handleReset}
                className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {instruments.map((instrument, index) => (
                <div
                  key={index}
                  className="text-white rounded-lg p-2 h-24 flex flex-col justify-between relative" style={{ backgroundColor: "#7f7f7f" }}
                >
                  <h4 className="text-2xl font-medium text-white">{instrument.title}</h4>
                  <p className="text-sm text-gray-300">{instrument.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-8 mb-8">
          <div className="w-full h-0.5 bg-gray-200 mb-6"></div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-8">Let's get your bot running</h2>
          <div className="flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${currentMainStep >= 1
                ? currentSubStep === 3
                  ? "bg-green-600 text-white"
                  : "bg-white border-4 border-green-600 text-black"
                : "bg-gray-300 text-gray-500"
                }`}>
                {currentMainStep >= 1 && currentSubStep === 3 ? <Check className="w-6 h-6" /> : "1"}
              </div>
              <span className={`mt-2 text-lg font-bold ${currentMainStep >= 1 ? "text-black" : "text-gray-500"
                }`}>
                {currentMainStep >= 1 && currentSubStep === 3 ? "Bot details complete!" : "Bot details"}
              </span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300 mx-8 -mt-6"></div>
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-xl ${currentMainStep >= 2
                ? currentMainStep > 2
                  ? "bg-green-600 text-white"
                  : "bg-white border-4 border-green-600 text-black"
                : "bg-gray-300 text-gray-500"
                }`}>
                {currentMainStep > 2 ? <Check className="w-6 h-6" /> : "2"}
              </div>
              <span className={`mt-2 text-lg font-bold ${currentMainStep >= 2 ? "text-black" : "text-gray-500"
                }`}>
                {currentMainStep > 2 ? "Asset details complete!" : "Asset details"}
              </span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300 mx-8 -mt-6"></div>
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-xl ${currentMainStep === 3
                ? "bg-green-600 text-white"
                : "bg-gray-300 text-gray-500"
                }`}>
                3
              </div>
              <span className={`mt-2 text-lg ${currentMainStep >= 3 ? "text-black font-bold" : "text-gray-500"
                }`}>
                Confirm & deploy
              </span>
            </div>
          </div>
        </div>
        <div className="w-full h-0.5 bg-gray-200 mb-6"></div>

        <div className="flex justify-center mb-6 relative">
          <div className="w-16 h-16 bg-green-600 border-2 border-white rounded-full flex items-center justify-center font-bold text-2xl text-white shadow-lg">
            {currentMainStep === 1 ? "1" : currentMainStep === 2 ? "2" : "3"}
          </div>
        </div>

        {currentMainStep === 1 ? (
          currentSubStep === 1 ? (
            <div className="bg-white rounded-lg p-4 shadow-lg max-w-lg mx-auto border border-gray-200 relative">
              {currentMainStep === 1 && currentSubStep === 1 && (
                <button
                  className="absolute -right-12 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors"
                  onClick={handleNextSubStep}
                >
                  <ArrowRight className="w-6 h-6" />
                </button>
              )}
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Enter basic bot details</h3>
                <div className="w-full h-0.5 bg-green-600 mx-auto"></div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bot name*
                  </label>
                  <input
                    type="text"
                    {...step1Form.register("botName")}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base font-bold uppercase ${step1Form.formState.errors.botName ? 'border-red-300' : 'border-gray-300'
                      }`}
                  />
                  {step1Form.formState.errors.botName && (
                    <div className="text-red-600 text-sm mt-1">{step1Form.formState.errors.botName.message}</div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Broker*
                    </label>
                    <button
                      className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      onClick={handleNextSubStep}
                    >
                      Connect API Keys
                    </button>
                  </div>
                  <div className="relative">
                    <select
                      {...step1Form.register("broker")}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base font-bold bg-white ${step1Form.formState.errors.broker ? 'border-red-300' : 'border-gray-300'
                        }`}
                    >
                      <option value="">Select broker</option>
                      {availableBrokersList.map((broker) => (
                        <option key={broker} value={broker}>
                          {broker}
                        </option>
                      ))}
                    </select>
                  </div>
                  {step1Form.formState.errors.broker && (
                    <div className="text-red-600 text-sm mt-1">{step1Form.formState.errors.broker.message}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select bot type*
                  </label>
                  <div className="flex space-x-2">
                    {["Basic", "Smart", "Advance"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setSelectedBotType(type);
                          step1Form.setValue("botType", type);
                        }}
                        className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${selectedBotType === type
                          ? "bg-green-600 text-white"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  {step1Form.formState.errors.botType && (
                    <div className="text-red-600 text-sm mt-1">{step1Form.formState.errors.botType.message}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  {selectedBotType === "Advance" ? (
                    <>
                      <div className="flex justify-center border border-gray-300 px-29 mb-1">
                        <div className="text-green-600 text-sm font-semibold my-2 ">
                          Powerful indicators & metrics included
                        </div>
                      </div>
                      <div className="bg-gray-100 border border-gray-300 rounded-lg p-3">
                        <p className="text-gray-700 text-sm leading-relaxed">
                          Advanced DCA bot lets you buy an asset using a combination of powerful metrics, indicators across various levels of risks, market timings & specific levels.
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          Eg: You will create a DCA bot that buys  x amount  of Bitcoin every once
                          a  week on Sunday if the Risk Metric is 0.5, buys y amount if risk drops to 0.3
                          & sells holdings if risk goes to 0.8.
                        </p>
                      </div>
                    </>
                  ) : selectedBotType === "Smart" ? (
                    <>
                      <div className="flex justify-center border border-gray-300 px-29 mb-1">
                        <div className="text-green-600 text-sm font-semibold my-2 ">
                          Smart risk metrics included
                        </div>
                      </div>
                      <div className="bg-gray-100 border border-gray-300 rounded-lg p-3">
                        <p className="text-gray-700 text-sm leading-relaxed">
                          Smart DCA bot lets you buy an asset at a specified time and frequency of your choice with smart metrics.
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          Eg: You will create a DCA bot that buys Bitcoin every once a  week on Sunday if the Risk Metric is 0.5 & Fear & Greed Index is at your preferred threshold.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-center border border-gray-300 px-29 mb-1">
                        <div className="text-green-600 text-sm font-semibold my-2 ">
                          No metrics or indicators included.
                        </div>
                      </div>
                      <div className="bg-gray-100 border border-gray-300 rounded-lg p-3">
                        <p className="text-gray-700 text-sm leading-relaxed">
                          Basic: DCA bot lets you buy an asset at a specified time and frequency of your choice.
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          Eg: You will create a DCA bot that buys Bitcoin every once a week on Sunday.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : currentSubStep === 2 ? (
            <div className="bg-white rounded-lg p-4 shadow-lg max-w-lg mx-auto border border-gray-200 relative">
              {currentMainStep === 1 && currentSubStep === 2 && (
                <button
                  className="absolute -right-12 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors"
                  onClick={handleNextSubStep}
                >
                  <ArrowRight className="w-6 h-6" />
                </button>
              )}
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Enter basic bot details</h3>
                <div className="w-full h-0.5 bg-green-600 mx-auto"></div>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-white rounded-lg p-4 border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">API Connect for {brokerValue || "ByBit"}</h4>

                  <div className="flex border-b border-gray-200 mb-4">
                    <button
                      onClick={() => setActiveTab('load')}
                      className={`flex-1 py-3 px-4 text-sm font-medium ${activeTab === 'load'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      Load
                    </button>
                    <button
                      onClick={() => setActiveTab('connect')}
                      className={`flex-1 py-3 px-4 text-sm font-medium ${activeTab === 'connect'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      Connect
                    </button>
                  </div>

                  {activeTab === 'load' ? (
                    <>
                      <div className="space-y-2 mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Select from saved API connections*
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={selectedBroker?.name || ""}
                            placeholder="Select a saved connection"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm pr-10"
                            readOnly
                          />
                          <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <Search className="h-4 w-4 text-gray-400" />
                          </button>
                        </div>

                        {savedBrokers.length > 0 && (
                          <div className="border border-gray-200 rounded-lg max-h-32 overflow-y-auto">
                            {savedBrokers.map((broker) => (
                              <button
                                key={broker.id}
                                onClick={() => handleLoadBroker(broker)}
                                className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                              >
                                <div className="text-sm font-medium">{broker.name}</div>
                                <div className="text-xs text-gray-500">
                                  {broker.test_mode ? 'Test Mode' : 'Live Mode'}
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {selectedBroker && (
                        <>
                          <div className="space-y-2 mb-4">
                            <label className="block text-sm font-medium text-gray-700">API key*</label>
                            <input
                              type="text"
                              {...apiConnectForm.register("apiKey")}
                              placeholder="Enter your API key"
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm ${apiConnectForm.formState.errors.apiKey ? 'border-red-300' : 'border-gray-300'
                                }`}
                            />
                            {apiConnectForm.formState.errors.apiKey && (
                              <div className="text-red-600 text-sm mt-1">{apiConnectForm.formState.errors.apiKey.message}</div>
                            )}
                          </div>

                          <div className="space-y-2 mb-4">
                            <label className="block text-sm font-medium text-gray-700">Secret key*</label>
                            <input
                              type="password"
                              {...apiConnectForm.register("secretKey")}
                              placeholder="****************************"
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm ${apiConnectForm.formState.errors.secretKey ? 'border-red-300' : 'border-gray-300'
                                }`}
                            />
                            {apiConnectForm.formState.errors.secretKey && (
                              <div className="text-red-600 text-sm mt-1">{apiConnectForm.formState.errors.secretKey.message}</div>
                            )}
                          </div>
                        </>
                      )}

                      <div className="pt-4">
                        <button
                          onClick={handleConnectFromLoad}
                          disabled={!selectedBroker || isVerifying}
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isVerifying ? 'Connecting...' : 'Connect'}
                        </button>

                        {isVerifying && (
                          <p className="text-sm text-green-600 text-center mt-2">Connecting...</p>
                        )}

                        {isConnected && (
                          <div className="flex items-center justify-center gap-2 mt-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <p className="text-sm text-green-600">Connection successful</p>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            API key*
                          </label>
                          <input
                            type="text"
                            {...apiConnectForm.register("apiKey")}
                            placeholder="Enter your API key"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm ${apiConnectForm.formState.errors.apiKey ? 'border-red-300' : 'border-gray-300'
                              }`}
                          />
                          {apiConnectForm.formState.errors.apiKey && (
                            <div className="text-red-600 text-sm mt-1">{apiConnectForm.formState.errors.apiKey.message}</div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Secret key*
                          </label>
                          <input
                            type="password"
                            {...apiConnectForm.register("secretKey")}
                            placeholder="Enter your secret key"
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm ${apiConnectForm.formState.errors.secretKey ? 'border-red-300' : 'border-gray-300'
                              }`}
                          />
                          {apiConnectForm.formState.errors.secretKey && (
                            <div className="text-red-600 text-sm mt-1">{apiConnectForm.formState.errors.secretKey.message}</div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            id="testMode"
                            type="checkbox"
                            {...apiConnectForm.register("testMode")}
                            className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <label htmlFor="testMode" className="text-sm text-gray-700 select-none">
                            Use test mode (testnet/demo keys)
                          </label>
                        </div>

                        <div className="space-y-3 pt-2">
                          <button
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-sm"
                            onClick={handleNextSubStep}
                          >
                            Connect
                          </button>
                          <button
                            className="w-full text-blue-600 hover:text-blue-700 font-medium text-sm underline"
                            onClick={() => setCurrentSubStep(1)}
                          >
                            Skip for now
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-4 shadow-lg max-w-lg mx-auto border border-gray-200 relative">
              {currentMainStep === 1 && currentSubStep === 3 && (
                <button
                  className="absolute -right-12 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors"
                  onClick={handleNextStep}
                >
                  <ArrowRight className="w-6 h-6" />
                </button>
              )}
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-2">Enter basic bot details</h3>
                <div className="w-full h-0.5 bg-green-600 mx-auto"></div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bot name*
                  </label>
                  <input
                    type="text"
                    {...step1Form.register("botName")}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base font-bold text-black uppercase ${step1Form.formState.errors.botName ? 'border-red-300' : 'border-gray-300'
                      }`}
                  />
                  {step1Form.formState.errors.botName && (
                    <div className="text-red-600 text-sm mt-1">{step1Form.formState.errors.botName.message}</div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Broker*
                    </label>
                    <span className="text-green-600 font-medium text-sm">API Keys successfully added!</span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      {...step1Form.register("broker")}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base font-bold text-black pr-8 ${step1Form.formState.errors.broker ? 'border-red-300' : 'border-gray-300'
                        }`}
                    />
                    <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-green-600">
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                  {step1Form.formState.errors.broker && (
                    <div className="text-red-600 text-sm mt-1">{step1Form.formState.errors.broker.message}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select bot type*
                  </label>
                  <div className="flex space-x-2">
                    {["Basic", "Smart", "Advance"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setSelectedBotType(type);
                          step1Form.setValue("botType", type);
                        }}
                        className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${selectedBotType === type
                          ? "bg-green-600 text-white"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  {step1Form.formState.errors.botType && (
                    <div className="text-red-600 text-sm mt-1">{step1Form.formState.errors.botType.message}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  {selectedBotType === "Smart" ? (
                    <>
                      <div className="flex justify-center border border-gray-300 px-29 mb-1">
                        <div className="text-green-600 text-sm font-semibold my-2 ">
                          Smart risk metrics included
                        </div>
                      </div>
                      <div className="bg-gray-100 border border-gray-300 rounded-lg p-3">
                        <p className="text-gray-700 text-sm leading-relaxed">
                          Smart DCA bot lets you buy an asset at a specified
                          time and frequency of your choice with smart metrics.
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          Eg: You will create a DCA bot that buys Bitcoin every once a  week on Sunday if the Risk Metric is 0.5 & Fear & Greed Index is at your preferred threshold.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-center border border-gray-300 px-29 mb-1">
                        <div className="text-green-600 text-sm font-semibold my-2 ">
                          No metrics or indicators included.
                        </div>
                      </div>
                      <div className="bg-gray-100 border border-gray-300 rounded-lg p-3">
                        <p className="text-gray-700 text-sm leading-relaxed">
                          Basic: DCA bot lets you buy an asset at a specified time and frequency of your choice.
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          Eg: You will create a DCA bot that buys Bitcoin every once a week on Sunday.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        ) : currentMainStep === 2 ? (
          selectedBotType === "Advance" ? (
            <BotSetupAdvanced
              step2Form={step2Form}
              currentMainStep={currentMainStep}
              setCurrentMainStep={setCurrentMainStep}
              handleNextStep={handleNextStep}
              getLoopDescription={getLoopDescription}
              hasSelectedMetrics={hasSelectedMetrics}
              buyAmtDisabledTooltip={buyAmtDisabledTooltip}
              addedMetrics={addedMetrics}
              handleResetMetrics={handleResetMetrics}
              setShowAddMetricsModal={setShowAddMetricsModal}
              handleToggleEnabledMetric={handleToggleEnabledMetric}
              toggleGroupExpand={toggleGroupExpand}
              handleToggleExpandMetric={handleToggleExpandMetric}
              handleRemoveMetric={handleRemoveMetric}
              handleUpdateMetric={handleUpdateMetric}
              getMetricKeyFromName={getMetricKeyFromName}
              advanceMatchMode={advanceMatchMode}
              setAdvanceMatchMode={setAdvanceMatchMode}
              technicalContentExpanded={technicalContentExpanded}
              handleToggleTechnicalContent={handleToggleTechnicalContent}
              startMetricDrag={startMetricDrag}
              updateMetricFromClientX={updateMetricFromClientX}
              availableAssetsList={availableAssetsList}
              riskMetricAdded={riskMetricAdded}
              fearGreedAdded={fearGreedAdded}
              handleAddMetric={handleAddMetric}
            />
          ) : selectedBotType === "Smart" ? (
            <BotSetupSmart
              step2Form={step2Form}
              currentMainStep={currentMainStep}
              setCurrentMainStep={setCurrentMainStep}
              handleNextStep={handleNextStep}
              getLoopDescription={getLoopDescription}
              hasSelectedMetrics={hasSelectedMetrics}
              buyAmtDisabledTooltip={buyAmtDisabledTooltip}
              addedMetrics={addedMetrics}
              handleResetMetrics={handleResetMetrics}
              setShowAddMetricsModal={setShowAddMetricsModal}
              handleToggleEnabledMetric={handleToggleEnabledMetric}
              toggleGroupExpand={toggleGroupExpand}
              handleToggleExpandMetric={handleToggleExpandMetric}
              handleRemoveMetric={handleRemoveMetric}
              handleUpdateMetric={handleUpdateMetric}
              getMetricKeyFromName={getMetricKeyFromName}
              supportsRiskMetric={supportsRiskMetric}
              riskMetricAdded={riskMetricAdded}
              fearGreedAdded={fearGreedAdded}
              handleAddMetric={handleAddMetric}
              startMetricDrag={startMetricDrag}
              updateMetricFromClientX={updateMetricFromClientX}
              availableAssetsList={availableAssetsList}
            />
          ) : (
            <BotSetupBasic
              step2Form={step2Form}
              currentMainStep={currentMainStep}
              setCurrentMainStep={setCurrentMainStep}
              handleNextStep={handleNextStep}
              getLoopDescription={getLoopDescription}
              availableAssetsList={availableAssetsList}
            />
          )
        ) : currentMainStep === 3 ? (
          <div className={`bg-white rounded-lg p-8 shadow-lg ${selectedBotType === 'Advance' ? 'max-w-6xl' : selectedBotType === 'Smart' ? 'max-w-4xl' : 'max-w-lg'} mx-auto border border-gray-200 relative`}>
            {currentMainStep === 3 && (
              <button
                className="absolute -left-12 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors"
                onClick={() => setCurrentMainStep(2)}
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
            )}
            <div className="flex items-center justify-between mb-8">
              <div className="flex-1"></div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-black mb-1">
                  {isModifyMode ? "Modify bot settings" : "Review details"}
                </h3>
                <div className="w-24 h-1 bg-green-600 mx-auto"></div>
              </div>
              <div className="flex-1 flex justify-end">
                <button
                  onClick={() => {
                    setCurrentMainStep(1);
                    setCurrentSubStep(1);
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 text-sm border border-blue-600 px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
                >
                  <span>Edit Parameters</span>
                </button>
              </div>
            </div>
            {selectedBotType === 'Advance' ? (
              renderAdvanceStep3()
            ) : selectedBotType === 'Smart' ? (
              <div className="space-y-6">
                <div className="border border-gray-200 rounded-md">
                  <div className="p-5">
                    <div className="grid [grid-template-columns:2fr_1fr] gap-6">
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <div className="text-sm text-gray-500 mb-2">Bot Name</div>
                            <div className="text-xl font-bold text-black">{step1Form.getValues('botName') || 'MyDCA-1'}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500 mb-2">Asset</div>
                            <div className="text-xl font-bold text-black">{(step2Form.getValues('assetName') || 'BTCUSDT')} (Spot)</div>
                          </div>
                        </div>
                        <div className="pt-6 border-t border-gray-200">
                          <div className="grid [grid-template-columns:1.2fr_1fr_1fr] gap-6">
                            <div>
                              <div className="text-sm text-gray-500 mb-2">Time frame</div>
                              <div className="text-xl font-bold text-black">{step2Form.getValues('timeFrame')}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500 mb-2">Frequency</div>
                              <div className="text-xl font-bold text-black">{(step2Form.getValues('frequency') || 1)}x</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500 mb-2">Loop</div>
                              <div className="text-xl font-bold text-black">{step2Form.getValues('loop') || 'Once'}</div>
                            </div>
                          </div>
                        </div>
                        <div className="pt-6 border-t border-gray-200">
                          <div className="grid grid-cols-2 gap-6">
                            <div>
                              <div className="text-sm text-gray-500 mb-2">Broker</div>
                              <div className="text-xl font-bold text-black">{step1Form.getValues('broker') || 'ByBit'}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500 mb-2">API Status</div>
                              <div className="text-xl font-bold text-black">{currentSubStep === 3 ? 'Connected' : 'Not Connected'}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="pl-6 border-l border-gray-200 space-y-6">
                        {addedMetrics[0] && (
                          <div className="pl-2">
                            <div className="text-[11px] text-gray-500">(1) Buy Amount ($) &nbsp; {addedMetrics[0].name.replace(/\s*\(.+\)$/, '').trim()} ({addedMetrics[0].selectedValue})</div>
                            <div className="text-xl font-bold">{(addedMetrics[0].amountPerBuy || 0).toFixed(2)}</div>
                          </div>
                        )}
                        <div className="border-t border-gray-200"></div>
                        {addedMetrics[1] && (
                          <div className="">
                            <div className="text-[11px] text-gray-500">(2) Buy Amount ($) &nbsp; {addedMetrics[1].name.replace(/\s*\(.+\)$/, '').trim()} ({addedMetrics[1].selectedValue})</div>
                            <div className="text-xl font-bold">{(addedMetrics[1].amountPerBuy || 0).toFixed(2)}</div>
                          </div>
                        )}
                        <div className="border-t border-gray-200"></div>
                        <div className="text-center">
                          <div className="text-sm text-gray-500 mb-2">Label 3</div>
                          <div className="text-xl font-bold text-black">{step2Form.getValues('label3') || 'LabelText'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center text-[11px] text-gray-600 border rounded-md py-3">Your bot will execute on {step1Form.getValues('broker') || 'ByBit'} with the above settings starting from {new Date().toLocaleDateString()} at market order.</div>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded" onClick={handleDeployBot}>{isModifyMode ? 'Update bot' : 'Deploy bot'}</button>
                <button className="w-full border border-green-600 text-green-700 font-medium py-2 rounded">Deploy signal</button>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="border-b border-gray-200 pb-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Bot Name</div>
                      {isModifyMode && editingField === 'botName' ? (
                        <input
                          type="text"
                          value={editValues.botName}
                          onChange={(e) => setEditValues({ ...editValues, botName: e.target.value })}
                          onBlur={() => setEditingField(null)}
                          className="text-xl font-bold text-black border-b border-gray-300 focus:outline-none focus:border-green-600"
                          autoFocus
                        />
                      ) : (
                        <div className="text-xl font-bold text-black flex items-center gap-2">
                          {isModifyMode ? editValues.botName : (step1Form.getValues("botName") || "MyDCA-1")}
                          {isModifyMode && (
                            <button
                              onClick={() => setEditingField('botName')}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              ✏️
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Asset</div>
                      {isModifyMode && editingField === 'asset' ? (
                        <input
                          type="text"
                          value={editValues.asset}
                          onChange={(e) => setEditValues({ ...editValues, asset: e.target.value })}
                          onBlur={() => setEditingField(null)}
                          className="text-xl font-bold text-black border-b border-gray-300 focus:outline-none focus:border-green-600"
                          autoFocus
                        />
                      ) : (
                        <div className="text-xl font-bold text-black flex items-center gap-2">
                          {isModifyMode ? editValues.asset : (step2Form.getValues("assetName") || "BTCUSDT")} (Spot)
                          {isModifyMode && (
                            <button
                              onClick={() => setEditingField('asset')}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              ✏️
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Amount ($)</div>
                      {isModifyMode && editingField === 'amount' ? (
                        <input
                          type="number"
                          value={editValues.amount}
                          onChange={(e) => setEditValues({ ...editValues, amount: parseFloat(e.target.value) || 0 })}
                          onBlur={() => setEditingField(null)}
                          className="text-xl font-bold text-black border-b border-gray-300 focus:outline-none focus:border-green-600"
                          autoFocus
                        />
                      ) : (
                        <div className="text-xl font-bold text-black flex items-center gap-2">
                          {(isModifyMode ? editValues.amount : (step2Form.getValues("amountPerBuy") || 50)).toFixed(2)}
                          {isModifyMode && (
                            <button
                              onClick={() => setEditingField('amount')}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              ✏️
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Time frame</div>
                      {isModifyMode && editingField === 'timeFrame' ? (
                        <select
                          value={editValues.timeFrame}
                          onChange={(e) => setEditValues({ ...editValues, timeFrame: e.target.value })}
                          onBlur={() => setEditingField(null)}
                          className="text-xl font-bold text-black border-b border-gray-300 focus:outline-none focus:border-green-600 bg-white"
                          autoFocus
                        >
                          <option value="1Day">1 Day</option>
                          <option value="1Week">1 Week</option>
                          <option value="1Month">1 Month</option>
                          <option value="3Months">3 Months</option>
                          <option value="6Months">6 Months</option>
                          <option value="1Year">1 Year</option>
                        </select>
                      ) : (
                        <div className="text-xl font-bold text-black flex items-center gap-2">
                          {isModifyMode ? editValues.timeFrame : (step2Form.getValues("timeFrame"))}
                          {isModifyMode && (
                            <button
                              onClick={() => setEditingField('timeFrame')}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              ✏️
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Frequency</div>
                      {isModifyMode && editingField === 'frequency' ? (
                        <input
                          type="number"
                          value={editValues.frequency}
                          onChange={(e) => setEditValues({ ...editValues, frequency: parseInt(e.target.value) || 1 })}
                          onBlur={() => setEditingField(null)}
                          className="text-xl font-bold text-black border-b border-gray-300 focus:outline-none focus:border-green-600"
                          autoFocus
                        />
                      ) : (
                        <div className="text-xl font-bold text-black flex items-center gap-2">
                          {(isModifyMode ? editValues.frequency : (step2Form.getValues("frequency") || 1))}x
                          {isModifyMode && (
                            <button
                              onClick={() => setEditingField('frequency')}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              ✏️
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Loop</div>
                      {isModifyMode && editingField === 'loop' ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={editValues.loop}
                            onChange={(e) => {
                              setEditValues({ ...editValues, loop: e.target.value });
                              if (e.target.value === 'Custom' && !editValues.amountOfTimes) {
                                setEditValues(prev => ({ ...prev, amountOfTimes: 1 }));
                              }
                            }}
                            onBlur={() => setEditingField(null)}
                            className="text-xl font-bold text-black border-b border-gray-300 focus:outline-none focus:border-green-600 bg-white"
                            autoFocus
                          >
                            <option value="Once">Once</option>
                            <option value="Infinite">Infinite</option>
                            <option value="Custom">Custom</option>
                          </select>
                        </div>
                      ) : (
                        <div className="text-xl font-bold text-black flex items-center gap-2">
                          {isModifyMode ? editValues.loop : (step2Form.getValues("loop") || "Once")}
                          {(isModifyMode ? editValues.loop : step2Form.getValues("loop")) === "Custom" && (
                            <span className="ml-2">
                              {isModifyMode && editingField === 'amountOfTimes' ? (
                                <input
                                  type="number"
                                  value={editValues.amountOfTimes}
                                  onChange={(e) => setEditValues({ ...editValues, amountOfTimes: parseInt(e.target.value) || 1 })}
                                  onBlur={() => setEditingField(null)}
                                  className="w-16 text-xl font-bold text-black border-b border-gray-300 focus:outline-none focus:border-green-600"
                                  autoFocus
                                />
                              ) : (
                                <span>
                                  ({isModifyMode ? editValues.amountOfTimes : (step2Form.getValues("amountOfTimes") || 1)} times)
                                  {isModifyMode && (
                                    <button
                                      onClick={() => setEditingField('amountOfTimes')}
                                      className="text-blue-600 hover:text-blue-800 text-sm ml-1"
                                    >
                                      ✏️
                                    </button>
                                  )}
                                </span>
                              )}
                            </span>
                          )}
                          {isModifyMode && (
                            <button
                              onClick={() => setEditingField('loop')}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              ✏️
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-b border-gray-200 pb-6">
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Broker</div>
                      <div className="text-xl font-bold text-black">{isModifyMode ? editValues.broker : (step1Form.getValues("broker") || "ByBit")}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-2">API Status</div>
                      <div className="text-xl font-bold text-black">{currentSubStep === 3 ? "Connected" : "Not Connected"}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-2">Bot Type</div>
                      {isModifyMode && editingField === 'botType' ? (
                        <select
                          value={editValues.botType}
                          onChange={(e) => setEditValues({ ...editValues, botType: e.target.value })}
                          onBlur={() => setEditingField(null)}
                          className="text-xl font-bold text-black border-b border-gray-300 focus:outline-none focus:border-green-600 bg-white"
                          autoFocus
                        >
                          <option value="Basic">Basic</option>
                          <option value="Smart">Smart</option>
                          <option value="Advance">Advance</option>
                        </select>
                      ) : (
                        <div className="text-xl font-bold text-black flex items-center gap-2">
                          {isModifyMode ? editValues.botType : (step1Form.getValues("botType") || "Basic")}
                          {isModifyMode && (
                            <button
                              onClick={() => setEditingField('botType')}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              ✏️
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gray-100 rounded-lg p-5">
                  <p className="text-sm text-gray-600 text-center leading-relaxed">
                    Your bot will execute on {isModifyMode ? editValues.broker : (step1Form.getValues("broker") || "ByBit")} with the above settings starting from {new Date().toLocaleDateString()} at market order.
                  </p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={handleDeployBot}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition-colors shadow-sm"
                  >
                    {isModifyMode ? "Update bot" : "Deploy bot"}
                  </button>
                  <button className="w-full bg-white border border-green-600 text-green-600 hover:bg-green-50 font-bold py-4 px-6 rounded-lg transition-colors">
                    Deploy signal
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : null}

        {showAddMetricsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/30" onClick={() => setShowAddMetricsModal(false)} />
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-5">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-lg font-semibold text-black">Add Risk Metric</h5>
                <button className="text-gray-500 hover:text-black" onClick={() => setShowAddMetricsModal(false)}>✕</button>
              </div>
              <div className="space-y-2">
                {availableMetricPool.map((m) => {
                  const key = getMetricKeyFromName(m.name);
                  const exists = addedMetrics.some(am => getMetricKeyFromName(am.name) === key);
                  const disabled = exists || !m.isSupported || addedMetrics.length >= 10;
                  return (
                    <button
                      key={m.name}
                      onClick={() => !disabled && handleAddMetric(m.name)}
                      disabled={disabled}
                      className={`w-full text-left px-3 py-2 rounded border flex items-center justify-between ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-green-50'}`}
                    >
                      <span className="font-medium">{m.name}</span>
                      {disabled ? (
                        <span className="text-xs">{!m.isSupported ? 'Not supported for selected asset' : 'Already added'}</span>
                      ) : (
                        <span className="text-green-700 text-sm">ADD</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center mt-8 space-x-2">
          <button
            type="button"
            aria-label="Go to step 1"
            className={`w-3 h-3 rounded-full ${currentMainStep >= 1 ? 'bg-green-600' : 'bg-gray-300'}`}
            onClick={async () => setCurrentMainStep(1)}
          />
          <button
            type="button"
            aria-label="Go to step 2"
            className={`w-3 h-3 rounded-full ${currentMainStep >= 2 ? 'bg-green-600' : 'bg-gray-300'}`}
            onClick={async () => {
              if (currentMainStep === 1) {
                const ok = await validateStep1();
                if (!ok) return;
              }
              setCurrentMainStep(2);
            }}
          />
          <button
            type="button"
            aria-label="Go to step 3"
            className={`w-3 h-3 rounded-full ${currentMainStep >= 3 ? 'bg-green-600' : 'bg-gray-300'}`}
            onClick={async () => {
              if (currentMainStep === 1) {
                const ok1 = await validateStep1();
                if (!ok1) return;
                const ok2 = await validateStep2();
                if (!ok2) return;
              } else if (currentMainStep === 2) {
                const ok2 = await validateStep2();
                if (!ok2) return;
              }
              setCurrentMainStep(3);
            }}
          />
        </div>

        <Chatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} />

      </div>
    </div>
  );
}

export default BotSetup;