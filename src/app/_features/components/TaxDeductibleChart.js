"use client";
import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { useMonthlyTaxData } from '../hooks/useMonthlyTaxData';

/**
 * Bar chart component displaying monthly tax deductible amounts.
 * Shows 3 bars per month: Gross deductible, AG Spesen, and Net deductible.
 * 
 * @param {Object} props - Component props
 * @param {number} props.year - The year to display data for
 * @returns {JSX.Element} The rendered bar chart or empty state
 */
export default function TaxDeductibleChart({ year }) {
  const monthlyData = useMonthlyTaxData(year);
  
  // Check if there's any data
  const hasData = monthlyData.some(m => m.gross > 0 || m.spesen > 0);
  
  if (!hasData) {
    return (
      <div className="text-center py-12 text-white/60">
        <p>Keine Daten für {year} vorhanden</p>
        <p className="text-xs mt-2 text-white/40">
          Füge Fahrten, Ausgaben oder Equipment hinzu
        </p>
      </div>
    );
  }
  
  return (
    <div className="w-full h-[400px] mt-6">
      <BarChart
        dataset={monthlyData}
        xAxis={[{ 
          scaleType: 'band', 
          dataKey: 'month',
          categoryGapRatio: 0.3,
          barGapRatio: 0.1,
          tickLabelStyle: {
            fill: 'rgba(255, 255, 255, 0.7)',
            fontSize: 12,
          },
        }]}
        yAxis={[{
          tickLabelStyle: {
            fill: 'rgba(255, 255, 255, 0.7)',
            fontSize: 12,
          },
        }]}
        series={[
          {
            dataKey: 'gross',
            label: 'Absetzbar (Brutto)',
            color: '#60A5FA', // Light Blue-400 (good contrast on primary background)
            valueFormatter: (value) => `${value?.toFixed(2) || '0.00'} €`
          },
          {
            dataKey: 'spesen',
            label: 'AG Spesen',
            color: '#FCD34D', // Light Yellow-300 (matches AG Spesen KPI)
            valueFormatter: (value) => `${value?.toFixed(2) || '0.00'} €`
          },
          {
            dataKey: 'net',
            label: 'Netto Absetzbar',
            color: '#34D399', // Light Green-400 (Success color)
            valueFormatter: (value) => `${value?.toFixed(2) || '0.00'} €`
          }
        ]}
        margin={{ top: 20, right: 20, bottom: 40, left: 10 }}
        slotProps={{
          legend: {
            direction: 'row',
            position: { vertical: 'bottom', horizontal: 'middle' },
            padding: 0,
          },
        }}
        sx={{
          // Dimmed white axes - using !important for Android WebView compatibility
          '& .MuiChartsAxis-line': { 
            stroke: 'rgba(255, 255, 255, 0.5) !important' 
          },
          '& .MuiChartsAxis-tick': { 
            stroke: 'rgba(255, 255, 255, 0.5) !important' 
          },
          '& .MuiChartsAxis-tickLabel': { 
            fill: 'rgba(255, 255, 255, 0.7) !important',
            fontSize: '0.75rem'
          },
          '& .MuiChartsAxis-label': { 
            fill: 'rgba(255, 255, 255, 0.7) !important',
            fontSize: '0.875rem'
          },
          // Direct SVG line targeting for axis lines
          '& line': {
            stroke: 'rgba(255, 255, 255, 0.5) !important'
          },
          '& .MuiChartsAxis-root line': {
            stroke: 'rgba(255, 255, 255, 0.5) !important'
          },
          '.MuiChartsLegend-series text': { 
            fill: 'rgba(255, 255, 255, 0.7) !important',
            fontSize: '0.75rem'
          },
          '& .MuiChartsLegend-series text': { 
            fill: 'rgba(255, 255, 255, 0.7) !important',
            fontSize: '0.75rem'
          },
          '& .MuiChartsLegend-root text': { 
            fill: 'rgba(255, 255, 255, 0.7) !important',
          },
          // Legend is rendered as HTML in MUI X Charts v8
          '& .MuiChartsLegend-root': {
            color: 'rgba(255, 255, 255, 0.7) !important',
          },
          '& .MuiChartsLegend-root span': {
            color: 'rgba(255, 255, 255, 0.7) !important',
          },
          '& .MuiChartsLegend-label': {
            color: 'rgba(255, 255, 255, 0.7) !important',
          },
          '& ul': {
            color: 'rgba(255, 255, 255, 0.7) !important',
          },
          '& li': {
            color: 'rgba(255, 255, 255, 0.7) !important',
          },
          '& text': {
            fill: 'rgba(255, 255, 255, 0.7) !important',
          },
          '.MuiChartsLegend-mark': {
            rx: 2
          },
          // Tooltip styling
          '.MuiChartsTooltip-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            borderRadius: '8px',
            padding: '8px 12px'
          },
          '.MuiChartsTooltip-table': {
            color: 'white'
          }
        }}
      />
    </div>
  );
}
